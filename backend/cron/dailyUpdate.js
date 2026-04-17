import cron from 'node-cron';
import { Calendar, Log } from '../models/index.js';
import { scrapeDrikPanchang } from '../scrapers/drikPanchang.js';
import { scrapeProKerala } from '../scrapers/proKerala.js';
import { scrapeDinamalar } from '../scrapers/dinamalar.js';

const generatePlaceholderData = (dateString) => {
  const [year, month, day] = dateString.split('-');
  const date = new Date(dateString);
  const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];

  return {
    dateString,
    date: new Date(dateString),
    tamilDate: `${day} Month ${month}`,
    tithi: {
      name: 'Tithi Data Pending',
      startTime: '06:00',
      endTime: '18:00',
    },
    nakshatram: {
      name: 'Nakshatram Data Pending',
      startTime: '06:00',
      endTime: '18:00',
    },
    sunrise: '06:00',
    sunset: '18:00',
    rahuKalam: {
      startTime: '14:00',
      endTime: '15:30',
    },
    festivals: [],
    dataSource: 'placeholder',
    verified: false,
  };
};

const scrapeDate = async (dateString, retries = 3) => {
  const scrapers = [scrapeDrikPanchang, scrapeProKerala, scrapeDinamalar];
  let lastError;

  for (const scraper of scrapers) {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const data = await scraper(dateString);
        console.log(`✅ Successfully scraped ${dateString} using ${scraper.name}`);
        return data;
      } catch (error) {
        lastError = error;
        console.warn(`⚠️ Attempt ${attempt + 1} failed for ${scraper.name}: ${error.message}`);
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds before retry
      }
    }
  }

  console.error(`❌ All scrapers failed for ${dateString}:`, lastError);
  throw lastError;
};

export const dailyUpdateJob = cron.schedule('30 4 * * *', async () => {
  console.log('🔄 Starting daily update job at 4:30 AM IST...');

  try {
    const today = new Date();
    const dates = [0, 1, 2].map((offset) => {
      const date = new Date(today);
      date.setDate(date.getDate() + offset);
      return date.toISOString().split('T')[0];
    });

    for (const dateString of dates) {
      try {
        let calendarData;

        // Try to scrape data
        try {
          calendarData = await scrapeDate(dateString);
          calendarData.dataSource = 'scraped';
          calendarData.verified = false;
        } catch (scrapeError) {
          console.warn(`Scraping failed for ${dateString}, using placeholder`);
          calendarData = generatePlaceholderData(dateString);
        }

        // Save or update in database
        let calendar = await Calendar.findOne({ where: { dateString } });

        if (!calendar) {
          calendar = await Calendar.create({
            ...calendarData,
            dateString,
            date: new Date(dateString),
          });
          console.log(`✅ Created new calendar entry for ${dateString}`);
        } else {
          // Only update if not verified (user hasn't manually verified)
          if (!calendar.verified) {
            await calendar.update(calendarData);
            console.log(`✅ Updated calendar entry for ${dateString}`);
          } else {
            console.log(`⏭️ Skipped updating verified entry for ${dateString}`);
          }
        }

        // Log the activity
        await Log.create({
          action: 'daily_update',
          entity: 'calendar',
          entityId: calendar.id,
          description: `Daily update for ${dateString}`,
          status: 'success',
        });
      } catch (dateError) {
        console.error(`Error processing ${dateString}:`, dateError);
        await Log.create({
          action: 'daily_update',
          entity: 'calendar',
          description: `Daily update failed for ${dateString}`,
          status: 'failure',
          errorMessage: dateError.message,
        });
      }
    }

    // Clean up old logs (older than 90 days)
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const deletedLogs = await Log.destroy({
      where: {
        created_at: {
          [require('sequelize').Op.lt]: ninetyDaysAgo,
        },
      },
    });

    console.log(`🧹 Cleaned up ${deletedLogs} old logs`);
    console.log('✅ Daily update job completed successfully');
  } catch (error) {
    console.error('❌ Daily update job failed:', error);
    await Log.create({
      action: 'daily_update',
      description: 'Daily update job encountered a critical error',
      status: 'failure',
      errorMessage: error.message,
    });
  }
});

export const stopDailyUpdateJob = () => {
  if (dailyUpdateJob) {
    dailyUpdateJob.stop();
    console.log('🛑 Daily update job stopped');
  }
};
