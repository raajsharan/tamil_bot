import axios from 'axios';
import * as cheerio from 'cheerio';

const DRIK_URL = process.env.DRIK_PANCHANG_URL || 'https://www.drikpanchang.com';

export const scrapeDrikPanchang = async (dateString) => {
  try {
    console.log(`Scraping Drik Panchang for ${dateString}`);

    const [year, month, day] = dateString.split('-');

    // Format date for URL
    const date = new Date(dateString);
    const monthStr = date.toLocaleString('en-US', { month: 'long' });
    const dayStr = String(day).padStart(2, '0');
    const yearStr = year;

    const url = `${DRIK_URL}/panchang/${monthStr.toLowerCase()}-${dayStr}-${yearStr}-panchang.html`;

    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    const $ = cheerio.load(response.data);

    const data = {
      tithi: {},
      nakshatram: {},
      yogam: {},
      karanam: {},
      sunrise: extractTime($, 'Sunrise'),
      sunset: extractTime($, 'Sunset'),
      moonrise: extractTime($, 'Moonrise'),
      moonset: extractTime($, 'Moonset'),
      rahuKalam: {},
      festivals: [],
    };

    // Extract Tithi information
    const tithiSection = $('div:contains("Tithi")').first().parent();
    const tithiText = tithiSection.text();
    const tithiMatch = tithiText.match(/([A-Za-z]+)\s+(\d{1,2}:\d{2}\s*[AP]M)\s*-\s*(\d{1,2}:\d{2}\s*[AP]M)?/);
    if (tithiMatch) {
      data.tithi.name = tithiMatch[1];
      data.tithi.startTime = tithiMatch[2];
      data.tithi.endTime = tithiMatch[3] || '';
    }

    // Extract Nakshatram
    const nakshatra = $('div:contains("Nakshatram")').first().parent();
    const nakshatraText = nakshatra.text();
    const nakshatraMatch = nakshatraText.match(/([A-Za-z]+)\s+(\d{1,2}:\d{2}\s*[AP]M)\s*-\s*(\d{1,2}:\d{2}\s*[AP]M)?/);
    if (nakshatraMatch) {
      data.nakshatram.name = nakshatraMatch[1];
      data.nakshatram.startTime = nakshatraMatch[2];
      data.nakshatram.endTime = nakshatraMatch[3] || '';
    }

    // Extract Yoga
    const yoga = $('div:contains("Yoga")').first().parent();
    const yogaText = yoga.text();
    const yogaMatch = yogaText.match(/([A-Za-z]+)\s+(\d{1,2}:\d{2}\s*[AP]M)\s*-\s*(\d{1,2}:\d{2}\s*[AP]M)?/);
    if (yogaMatch) {
      data.yogam.name = yogaMatch[1];
      data.yogam.startTime = yogaMatch[2];
      data.yogam.endTime = yogaMatch[3] || '';
    }

    // Extract Rahu Kalam
    const rahuKalam = $('div:contains("Rahu Kalam")').first().parent();
    const rahuText = rahuKalam.text();
    const rahuMatch = rahuText.match(/(\d{1,2}:\d{2}\s*[AP]M)\s*-\s*(\d{1,2}:\d{2}\s*[AP]M)/);
    if (rahuMatch) {
      data.rahuKalam.startTime = rahuMatch[1];
      data.rahuKalam.endTime = rahuMatch[2];
    }

    // Extract Festivals
    const festivals = $('div:contains("Festival")').parent();
    festivals.each((i, elem) => {
      const festivalName = $(elem).text().trim();
      if (festivalName && festivalName.length > 0) {
        data.festivals.push({
          name: festivalName,
          type: 'general',
        });
      }
    });

    console.log(`Successfully scraped Drik Panchang for ${dateString}`);
    return data;
  } catch (error) {
    console.error(`Error scraping Drik Panchang for ${dateString}:`, error.message);
    throw error;
  }
};

const extractTime = ($, label) => {
  const section = $(`div:contains("${label}")`).first().parent();
  const text = section.text();
  const match = text.match(/(\d{1,2}:\d{2}\s*[AP]M)/);
  return match ? match[1] : null;
};

export default scrapeDrikPanchang;
