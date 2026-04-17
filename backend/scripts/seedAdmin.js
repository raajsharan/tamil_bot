import readline from 'readline';
import { Admin } from '../models/index.js';
import sequelize from '../config/database.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const seedAdmin = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection successful\n');

    console.log('🔐 Create Admin User\n');

    const name = await question('Admin Name: ');
    const email = await question('Admin Email: ');
    const password = await question('Admin Password (min 8 chars): ');

    if (!name || !email || !password) {
      console.error('❌ All fields are required');
      rl.close();
      process.exit(1);
    }

    if (password.length < 8) {
      console.error('❌ Password must be at least 8 characters');
      rl.close();
      process.exit(1);
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ where: { email } });
    if (existingAdmin) {
      console.error(`❌ Admin with email ${email} already exists`);
      rl.close();
      process.exit(1);
    }

    // Create admin
    const admin = await Admin.create({
      name,
      email,
      password,
      role: 'superadmin',
      permissions: {
        canViewDashboard: true,
        canManageCalendar: true,
        canManageAdmins: true,
        canRunScrapers: true,
        canViewLogs: true,
      },
    });

    console.log('\n✅ Admin user created successfully!');
    console.log(`   ID: ${admin.id}`);
    console.log(`   Name: ${admin.name}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Role: ${admin.role}`);

    rl.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    rl.close();
    process.exit(1);
  }
};

seedAdmin();
