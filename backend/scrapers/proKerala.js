import axios from 'axios';

export const scrapeProKerala = async (dateString) => {
  try {
    console.log(`Scraping Pro Kerala for ${dateString}`);

    const url = `https://api.prokerala.com/panchang/${dateString}`;

    const response = await axios.get(url, {
      timeout: 10000,
    });

    if (response.data) {
      const data = {
        tithi: response.data.tithi || {},
        nakshatram: response.data.nakshatram || {},
        yogam: response.data.yoga || {},
        karanam: response.data.karana || {},
        sunrise: response.data.sunrise || null,
        sunset: response.data.sunset || null,
        moonrise: response.data.moonrise || null,
        moonset: response.data.moonset || null,
        rahuKalam: response.data.rahuKalam || {},
        festivals: response.data.festivals || [],
      };

      console.log(`Successfully scraped Pro Kerala for ${dateString}`);
      return data;
    }

    throw new Error('No data from Pro Kerala');
  } catch (error) {
    console.error(`Error scraping Pro Kerala for ${dateString}:`, error.message);
    throw error;
  }
};

export default scrapeProKerala;
