import fs from 'fs';
import path from 'path';
import { Calendar } from '../models/index.js';
import sequelize from '../config/database.js';

const BACKUP_DIR = process.env.BACKUP_DIR || './backups';

const backup = async () => {
  try {
    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }

    console.log('🔄 Creating backup...');

    const calendars = await Calendar.findAll();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `backup_${timestamp}.json`;
    const filepath = path.join(BACKUP_DIR, filename);

    fs.writeFileSync(filepath, JSON.stringify(calendars, null, 2));

    console.log(`✅ Backup created: ${filepath}`);
    console.log(`   Records: ${calendars.length}`);
  } catch (error) {
    console.error('❌ Backup failed:', error);
    process.exit(1);
  }
};

const restore = async (filename) => {
  try {
    const filepath = path.join(BACKUP_DIR, filename);

    if (!fs.existsSync(filepath)) {
      console.error(`❌ Backup file not found: ${filepath}`);
      process.exit(1);
    }

    console.log('🔄 Restoring from backup...');

    const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));

    // Clear existing data
    await Calendar.destroy({ where: {} });

    // Insert restored data
    await Calendar.bulkCreate(data);

    console.log(`✅ Backup restored: ${filename}`);
    console.log(`   Records: ${data.length}`);
  } catch (error) {
    console.error('❌ Restore failed:', error);
    process.exit(1);
  }
};

const listBackups = () => {
  try {
    if (!fs.existsSync(BACKUP_DIR)) {
      console.log('No backups found');
      return;
    }

    const files = fs.readdirSync(BACKUP_DIR).filter((f) => f.startsWith('backup_'));

    if (files.length === 0) {
      console.log('No backups found');
      return;
    }

    console.log('📋 Available backups:\n');
    files.forEach((file) => {
      const stat = fs.statSync(path.join(BACKUP_DIR, file));
      console.log(`   ${file} (${(stat.size / 1024).toFixed(2)} KB)`);
    });
  } catch (error) {
    console.error('❌ Error listing backups:', error);
  }
};

const stats = async () => {
  try {
    await sequelize.authenticate();

    const totalRecords = await Calendar.count();
    const verifiedRecords = await Calendar.count({ where: { verified: true } });
    const unverifiedRecords = totalRecords - verifiedRecords;

    console.log('📊 Database Statistics:\n');
    console.log(`   Total Records: ${totalRecords}`);
    console.log(`   Verified: ${verifiedRecords}`);
    console.log(`   Unverified: ${unverifiedRecords}`);
    console.log(`   Verification Rate: ${((verifiedRecords / totalRecords) * 100).toFixed(2)}%`);
  } catch (error) {
    console.error('❌ Error getting stats:', error);
    process.exit(1);
  }
};

const cleanup = async () => {
  try {
    console.log('🧹 Cleaning up old data...');

    const retentionDays = parseInt(process.env.BACKUP_RETENTION_DAYS) || 90;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    if (fs.existsSync(BACKUP_DIR)) {
      const files = fs.readdirSync(BACKUP_DIR);
      files.forEach((file) => {
        const filepath = path.join(BACKUP_DIR, file);
        const stat = fs.statSync(filepath);

        if (stat.mtime < cutoffDate) {
          fs.unlinkSync(filepath);
          console.log(`   Deleted: ${file}`);
        }
      });
    }

    console.log('✅ Cleanup completed');
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    process.exit(1);
  }
};

const command = process.argv[2];
const arg = process.argv[3];

switch (command) {
  case 'backup':
    backup().then(() => process.exit(0));
    break;
  case 'restore':
    restore(arg).then(() => process.exit(0));
    break;
  case 'list':
    listBackups();
    break;
  case 'stats':
    stats().then(() => process.exit(0));
    break;
  case 'cleanup':
    cleanup().then(() => process.exit(0));
    break;
  default:
    console.log('Usage:');
    console.log('  npm run backup         - Create a backup');
    console.log('  npm run restore <file> - Restore from backup');
    console.log('  npm run list           - List available backups');
    console.log('  npm run stats          - Show database statistics');
    console.log('  npm run cleanup        - Clean up old backups');
}
