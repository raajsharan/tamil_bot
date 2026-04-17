import sequelize from '../config/database.js';
import Calendar from './Calendar.js';
import Admin from './Admin.js';
import Log from './Log.js';

// Define associations
Admin.hasMany(Log, {
  foreignKey: 'adminId',
  as: 'logs',
});

Log.belongsTo(Admin, {
  foreignKey: 'adminId',
  as: 'admin',
});

export { Calendar, Admin, Log, sequelize };
