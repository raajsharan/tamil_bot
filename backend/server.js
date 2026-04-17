import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import sequelize from './config/database.js';
import { Calendar, Admin, Log } from './models/index.js';
import publicRoutes from './routes/public.js';
import adminRoutes from './routes/admin.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import { dailyUpdateJob } from './cron/dailyUpdate.js';
import { telegramBotJob } from './cron/index.js';
import { bot } from './cron/telegramBot.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(generalLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use('/api/public', publicRoutes);
app.use('/api/admin', adminRoutes);

// 404 Handler
app.use(notFoundHandler);

// Error Handler
app.use(errorHandler);

// Initialize Database and Start Server
const startServer = async () => {
  try {
    console.log('🔄 Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Database connected');

    console.log('🔄 Syncing database models...');
    await sequelize.sync({ alter: false });
    console.log('✅ Database synced');

    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📚 API Docs: http://localhost:${PORT}/api`);
    });

    // Start cron jobs
    console.log('⏰ Initializing cron jobs...');
    console.log('   • Daily update: 4:30 AM IST');
    console.log('   • Telegram bot: 5:00 AM IST');

    // Start Telegram bot
    console.log('📱 Initializing Telegram bot...');
    try {
      await bot.launch();
      console.log('✅ Telegram bot started');
    } catch (error) {
      console.warn('⚠️ Telegram bot failed to start:', error.message);
    }

    console.log('\n✅ Application started successfully\n');
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n⏹️  Shutting down gracefully...');
  try {
    await sequelize.close();
    console.log('✅ Database closed');
    process.exit(0);
  } catch (error) {
    console.error('Error closing database:', error);
    process.exit(1);
  }
});

startServer();

export default app;
