import sequelize from '../config/database.js';
import { Calendar, Admin, Log } from '../models/index.js';

const migrateDB = async () => {
  try {
    console.log('🔄 Starting database migration...');

    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection successful');

    // Sync all models with force false to preserve data
    // If you need fresh start, set alter: true for auto-migrations
    await sequelize.sync({ alter: true, force: false });
    console.log('✅ Database tables synced');

    console.log('✅ Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

migrateDB();
