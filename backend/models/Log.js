import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Log = sequelize.define(
  'Log',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    adminId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Admins',
        key: 'id',
      },
    },
    action: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'login, logout, create, update, delete, verify, scrape',
    },
    entity: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'calendar, admin, settings',
    },
    entityId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    changes: {
      type: DataTypes.JSONB,
      defaultValue: {},
      comment: 'Old and new values for updates',
    },
    ipAddress: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    userAgent: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('success', 'failure', 'warning'),
      defaultValue: 'success',
    },
    errorMessage: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      index: true,
    },
  },
  {
    timestamps: false,
    underscored: true,
    indexes: [
      {
        fields: ['adminId'],
      },
      {
        fields: ['action'],
      },
      {
        fields: ['entity'],
      },
      {
        fields: ['created_at'],
      },
    ],
  }
);

export default Log;
