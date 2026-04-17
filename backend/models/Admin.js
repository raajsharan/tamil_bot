import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import bcryptjs from 'bcryptjs';

const Admin = sequelize.define(
  'Admin',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      lowercase: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Hashed password',
    },
    role: {
      type: DataTypes.ENUM('admin', 'superadmin'),
      defaultValue: 'admin',
    },
    permissions: {
      type: DataTypes.JSONB,
      defaultValue: {
        canViewDashboard: true,
        canManageCalendar: true,
        canManageAdmins: false,
        canRunScrapers: true,
        canViewLogs: true,
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    lastLoginIP: {
      type: DataTypes.STRING(45),
      allowNull: true,
      comment: 'IPv4 or IPv6',
    },
    loginAttempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    lockoutUntil: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    loginHistory: {
      type: DataTypes.JSONB,
      defaultValue: [],
      comment: 'Array of last 10 login attempts',
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['email'],
      },
    ],
    hooks: {
      beforeCreate: async (admin) => {
        if (admin.password) {
          admin.password = await bcryptjs.hash(admin.password, 10);
        }
      },
      beforeUpdate: async (admin) => {
        if (admin.changed('password')) {
          admin.password = await bcryptjs.hash(admin.password, 10);
        }
      },
    },
  }
);

// Instance method to verify password
Admin.prototype.verifyPassword = async function (plainPassword) {
  return bcryptjs.compare(plainPassword, this.password);
};

export default Admin;
