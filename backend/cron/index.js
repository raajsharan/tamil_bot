import cron from 'node-cron';
import { Calendar, Log } from '../models/index.js';
import { bot, channelId, formatPanchagamMessage } from './telegramBot.js';

export const telegramBotJob = cron.schedule('0 5 * * *', async () => {
  console.log('📱 Starting Telegram bot daily post at 5:00 AM IST...');

  try {
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];

    const calendar = await Calendar.findOne({ where: { dateString } });

    if (!calendar) {
      console.warn(`⚠️ No calendar data for today (${dateString})`);
      return;
    }

    const message = formatPanchagamMessage(calendar);

    // Send to channel
    if (channelId) {
      await bot.telegram.sendMessage(channelId, message, { parse_mode: 'HTML' });
      console.log('✅ Daily Panchagam message sent to Telegram channel');
    }

    // Log the activity
    await Log.create({
      action: 'telegram_post',
      entity: 'calendar',
      entityId: calendar.id,
      description: `Daily Telegram post for ${dateString}`,
      status: 'success',
    });
  } catch (error) {
    console.error('❌ Telegram bot job failed:', error);
    await Log.create({
      action: 'telegram_post',
      description: 'Telegram daily post failed',
      status: 'failure',
      errorMessage: error.message,
    });
  }
});

export const stopTelegramBotJob = () => {
  if (telegramBotJob) {
    telegramBotJob.stop();
    console.log('🛑 Telegram bot job stopped');
  }
};
