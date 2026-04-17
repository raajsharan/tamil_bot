import { Telegraf } from 'telegraf';
import { Calendar } from '../models/index.js';

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const channelId = process.env.TELEGRAM_CHANNEL_ID;

// Store for managing conversation state
const userState = new Map();

// Start command
bot.start((ctx) => {
  ctx.reply(`Welcome to Tamil Panchagam Bot! 🇹🇦📅\n\nAvailable commands:\n/today - Today's Panchangam\n/tomorrow - Tomorrow's Panchangam\n/amavasya - New moon dates\n/pournami - Full moon dates\n/help - Show this help message`);
});

// Help command
bot.help((ctx) => {
  ctx.reply(`📋 Tamil Panchagam Bot Commands\n\n/today - Get today's Panchagam details\n/tomorrow - Get tomorrow's Panchagam details\n/amavasya - List upcoming Amavasya (New Moon) dates\n/pournami - List upcoming Pournami (Full Moon) dates\n/search - Search for a specific date\n/help - Show this message`);
});

// Today command
bot.command('today', async (ctx) => {
  try {
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];

    const calendar = await Calendar.findOne({ where: { dateString } });

    if (!calendar) {
      return ctx.reply('📅 No data available for today');
    }

    const message = formatPanchagamMessage(calendar);
    ctx.reply(message, { parse_mode: 'HTML' });
  } catch (error) {
    console.error('Error in /today command:', error);
    ctx.reply('❌ Error fetching today\'s data');
  }
});

// Tomorrow command
bot.command('tomorrow', async (ctx) => {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = tomorrow.toISOString().split('T')[0];

    const calendar = await Calendar.findOne({ where: { dateString } });

    if (!calendar) {
      return ctx.reply('📅 No data available for tomorrow');
    }

    const message = formatPanchagamMessage(calendar);
    ctx.reply(message, { parse_mode: 'HTML' });
  } catch (error) {
    console.error('Error in /tomorrow command:', error);
    ctx.reply('❌ Error fetching tomorrow\'s data');
  }
});

// Amavasya command
bot.command('amavasya', async (ctx) => {
  try {
    const amavasyas = await Calendar.findAll({
      where: { moonPhase: 'Amavasya' },
      limit: 12,
    });

    if (amavasyas.length === 0) {
      return ctx.reply('🌑 No Amavasya dates found');
    }

    let message = '🌑 <b>Amavasya (New Moon) Dates</b>\n\n';
    amavasyas.forEach((cal) => {
      message += `📅 ${cal.dateString}\n`;
    });

    ctx.reply(message, { parse_mode: 'HTML' });
  } catch (error) {
    console.error('Error in /amavasya command:', error);
    ctx.reply('❌ Error fetching Amavasya dates');
  }
});

// Pournami command
bot.command('pournami', async (ctx) => {
  try {
    const pournamis = await Calendar.findAll({
      where: { moonPhase: 'Pournami' },
      limit: 12,
    });

    if (pournamis.length === 0) {
      return ctx.reply('🌕 No Pournami dates found');
    }

    let message = '🌕 <b>Pournami (Full Moon) Dates</b>\n\n';
    pournamis.forEach((cal) => {
      message += `📅 ${cal.dateString}\n`;
    });

    ctx.reply(message, { parse_mode: 'HTML' });
  } catch (error) {
    console.error('Error in /pournami command:', error);
    ctx.reply('❌ Error fetching Pournami dates');
  }
});

// Search command
bot.command('search', (ctx) => {
  userState.set(ctx.from.id, { state: 'searching' });
  ctx.reply('Enter the date (YYYY-MM-DD) to search:');
});

// Handle text input for search
bot.on('text', async (ctx) => {
  const userId = ctx.from.id;
  const state = userState.get(userId);

  if (state && state.state === 'searching') {
    const dateString = ctx.message.text.trim();

    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return ctx.reply('❌ Invalid date format. Please use YYYY-MM-DD');
    }

    try {
      const calendar = await Calendar.findOne({ where: { dateString } });

      if (!calendar) {
        return ctx.reply(`📅 No data found for ${dateString}`);
      }

      const message = formatPanchagamMessage(calendar);
      ctx.reply(message, { parse_mode: 'HTML' });
      userState.delete(userId);
    } catch (error) {
      console.error('Error searching date:', error);
      ctx.reply('❌ Error searching date');
    }
  }
});

const formatPanchagamMessage = (calendar) => {
  let message = `📅 <b>Panchagam - ${calendar.dateString}</b>\n\n`;

  if (calendar.tamilDate) {
    message += `🇹🇦 <b>Tamil Date:</b> ${calendar.tamilDate}\n`;
  }

  if (calendar.tithi && calendar.tithi.name) {
    message += `<b>Tithi:</b> ${calendar.tithi.name}`;
    if (calendar.tithi.startTime) message += ` (${calendar.tithi.startTime})`;
    message += `\n`;
  }

  if (calendar.nakshatram && calendar.nakshatram.name) {
    message += `<b>Nakshatram:</b> ${calendar.nakshatram.name}`;
    if (calendar.nakshatram.startTime) message += ` (${calendar.nakshatram.startTime})`;
    message += `\n`;
  }

  if (calendar.yogam && calendar.yogam.name) {
    message += `<b>Yoga:</b> ${calendar.yogam.name}\n`;
  }

  if (calendar.sunrise) {
    message += `🌅 <b>Sunrise:</b> ${calendar.sunrise}\n`;
  }

  if (calendar.sunset) {
    message += `🌇 <b>Sunset:</b> ${calendar.sunset}\n`;
  }

  if (calendar.rahuKalam && calendar.rahuKalam.startTime) {
    message += `⚠️ <b>Rahu Kalam:</b> ${calendar.rahuKalam.startTime} - ${calendar.rahuKalam.endTime}\n`;
  }

  if (calendar.festivals && calendar.festivals.length > 0) {
    message += `\n🎉 <b>Festivals:</b>\n`;
    calendar.festivals.forEach((festival) => {
      message += `• ${festival.name}\n`;
    });
  }

  if (calendar.moonPhase) {
    message += `\n🌙 <b>Moon Phase:</b> ${calendar.moonPhase}`;
    if (calendar.moonPhasePercent) {
      message += ` (${calendar.moonPhasePercent}%)`;
    }
    message += `\n`;
  }

  return message;
};

export { bot, formatPanchagamMessage, channelId };
