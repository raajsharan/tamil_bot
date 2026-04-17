import axios from 'axios';
import * as cheerio from 'cheerio';

export const scrapeDinamalar = async (dateString) => {
  try {
    console.log(`Scraping Dinamalar for ${dateString}`);

    const [year, month, day] = dateString.split('-');
    const url = `https://www.dinamalar.com/news/tamil-calendar/${day}-${month}-${year}`;

    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    const $ = cheerio.load(response.data);

    const data = {
      tamilDate: extractTamilDate($),
      tithi: {},
      nakshatram: {},
      yogam: {},
      karanam: {},
      sunrise: null,
      sunset: null,
      rahuKalam: {},
      festivals: extractFestivals($),
    };

    // Extract calendar information
    const calendarInfo = $('[class*="calendar"]').text();

    // Extract Tithi
    const tithiMatch = calendarInfo.match(/திథி[:\s]+([^\n]+)/);
    if (tithiMatch) {
      data.tithi.name = tithiMatch[1].trim();
    }

    // Extract Nakshatram
    const nakshatraMatch = calendarInfo.match(/நட்ஷத்திரம்[:\s]+([^\n]+)/);
    if (nakshatraMatch) {
      data.nakshatram.name = nakshatraMatch[1].trim();
    }

    console.log(`Successfully scraped Dinamalar for ${dateString}`);
    return data;
  } catch (error) {
    console.error(`Error scraping Dinamalar for ${dateString}:`, error.message);
    throw error;
  }
};

const extractTamilDate = ($) => {
  const tamilDateElement = $('[class*="tamil-date"]').first();
  return tamilDateElement.text().trim();
};

const extractFestivals = ($) => {
  const festivals = [];
  $('[class*="festival"]').each((i, elem) => {
    const festivalName = $(elem).text().trim();
    if (festivalName) {
      festivals.push({
        name: festivalName,
        nameTamil: festivalName,
        type: 'general',
      });
    }
  });
  return festivals;
};

export default scrapeDinamalar;
