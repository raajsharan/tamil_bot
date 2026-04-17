import express from 'express';
import { Op } from 'sequelize';
import { Calendar } from '../models/index.js';

const router = express.Router();

// Get today's Panchangam
router.get('/today', async (req, res) => {
  try {
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];

    let calendar = await Calendar.findOne({
      where: { dateString },
    });

    if (!calendar) {
      return res.status(404).json({
        success: false,
        message: 'Data for today not found',
      });
    }

    res.json({
      success: true,
      data: calendar,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Error fetching today data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching data',
    });
  }
});

// Get tomorrow's Panchangam
router.get('/tomorrow', async (req, res) => {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = tomorrow.toISOString().split('T')[0];

    let calendar = await Calendar.findOne({
      where: { dateString },
    });

    if (!calendar) {
      return res.status(404).json({
        success: false,
        message: 'Data for tomorrow not found',
      });
    }

    res.json({
      success: true,
      data: calendar,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Error fetching tomorrow data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching data',
    });
  }
});

// Get specific date Panchangam
router.get('/date/:dateString', async (req, res) => {
  try {
    const { dateString } = req.params;

    // Validate date format (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Use YYYY-MM-DD',
      });
    }

    const calendar = await Calendar.findOne({
      where: { dateString },
    });

    if (!calendar) {
      return res.status(404).json({
        success: false,
        message: `No data found for ${dateString}`,
      });
    }

    res.json({
      success: true,
      data: calendar,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Error fetching date data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching data',
    });
  }
});

// Get monthly calendar
router.get('/month/:year/:month', async (req, res) => {
  try {
    const { year, month } = req.params;
    const startDate = new Date(`${year}-${String(month).padStart(2, '0')}-01`);
    const endDate = new Date(year, month, 0);

    const calendars = await Calendar.findAll({
      where: {
        date: {
          [Op.between]: [startDate, endDate],
        },
      },
      order: [['date', 'ASC']],
    });

    res.json({
      success: true,
      data: calendars,
      month,
      year,
      count: calendars.length,
    });
  } catch (error) {
    console.error('Error fetching month data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching data',
    });
  }
});

// Get festivals
router.get('/festivals', async (req, res) => {
  try {
    const calendars = await Calendar.findAll({
      where: {
        festivals: {
          [Op.not]: [],
        },
      },
      order: [['date', 'ASC']],
    });

    const festivals = calendars.flatMap((cal) =>
      cal.festivals.map((f) => ({
        ...f,
        date: cal.dateString,
        tamilDate: cal.tamilDate,
      }))
    );

    res.json({
      success: true,
      data: festivals,
      count: festivals.length,
    });
  } catch (error) {
    console.error('Error fetching festivals:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching data',
    });
  }
});

// Get Amavasya (new moon) dates
router.get('/amavasya', async (req, res) => {
  try {
    const amavasyas = await Calendar.findAll({
      where: {
        moonPhase: 'Amavasya',
      },
      order: [['date', 'ASC']],
    });

    res.json({
      success: true,
      data: amavasyas,
      count: amavasyas.length,
    });
  } catch (error) {
    console.error('Error fetching amavasya data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching data',
    });
  }
});

// Get Pournami (full moon) dates
router.get('/pournami', async (req, res) => {
  try {
    const pournamis = await Calendar.findAll({
      where: {
        moonPhase: 'Pournami',
      },
      order: [['date', 'ASC']],
    });

    res.json({
      success: true,
      data: pournamis,
      count: pournamis.length,
    });
  } catch (error) {
    console.error('Error fetching pournami data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching data',
    });
  }
});

// Search calendar
router.get('/search', async (req, res) => {
  try {
    const { q, type } = req.query;

    if (!q || q.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters',
      });
    }

    let where = {};

    if (type === 'festival') {
      where = {
        festivals: {
          [Op.contains]: [{ name: { [Op.iLike]: `%${q}%` } }],
        },
      };
    } else {
      where = {
        [Op.or]: [
          { tamilDate: { [Op.iLike]: `%${q}%` } },
          { dateString: { [Op.iLike]: `%${q}%` } },
        ],
      };
    }

    const results = await Calendar.findAll({
      where,
      limit: 20,
    });

    res.json({
      success: true,
      query: q,
      data: results,
      count: results.length,
    });
  } catch (error) {
    console.error('Error searching:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching',
    });
  }
});

// Get date range
router.get('/range/:startDate/:endDate', async (req, res) => {
  try {
    const { startDate, endDate } = req.params;

    if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate) || !/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Use YYYY-MM-DD',
      });
    }

    const calendars = await Calendar.findAll({
      where: {
        dateString: {
          [Op.between]: [startDate, endDate],
        },
      },
      order: [['date', 'ASC']],
    });

    res.json({
      success: true,
      startDate,
      endDate,
      data: calendars,
      count: calendars.length,
    });
  } catch (error) {
    console.error('Error fetching range data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching data',
    });
  }
});

export default router;
