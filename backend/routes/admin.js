import express from 'express';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import { Admin, Calendar, Log } from '../models/index.js';
import { authenticateToken, authorizePermission, logActivity } from '../middleware/auth.js';
import { loginLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Admin Login
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password required',
      });
    }

    const admin = await Admin.findOne({ where: { email } });

    if (!admin || !admin.isActive) {
      await Log.create({
        action: 'failed_login',
        entity: 'admin',
        description: `Failed login attempt for ${email}`,
        status: 'failure',
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
      });

      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check account lockout
    if (admin.lockoutUntil && new Date() < new Date(admin.lockoutUntil)) {
      return res.status(429).json({
        success: false,
        message: 'Account locked. Try again later.',
      });
    }

    const isPasswordValid = await admin.verifyPassword(password);

    if (!isPasswordValid) {
      admin.loginAttempts += 1;

      if (admin.loginAttempts >= 5) {
        admin.lockoutUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
      }

      await admin.save();

      await Log.create({
        adminId: admin.id,
        action: 'failed_login',
        entity: 'admin',
        status: 'failure',
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
      });

      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Reset login attempts
    admin.loginAttempts = 0;
    admin.lockoutUntil = null;
    admin.lastLogin = new Date();
    admin.lastLoginIP = req.ip;

    // Add to login history
    const loginHistory = admin.loginHistory || [];
    loginHistory.unshift({
      timestamp: new Date(),
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });
    admin.loginHistory = loginHistory.slice(0, 10);

    await admin.save();

    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    await Log.create({
      adminId: admin.id,
      action: 'login',
      entity: 'admin',
      status: 'success',
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    res.json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login error',
    });
  }
});

// Get Admin Profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.admin.id, {
      attributes: { exclude: ['password'] },
    });

    res.json({
      success: true,
      data: admin,
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
    });
  }
});

// Get Dashboard Stats
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const totalDates = await Calendar.count();
    const verifiedDates = await Calendar.count({ where: { verified: true } });
    const recentLogs = await Log.findAll({
      limit: 10,
      order: [['created_at', 'DESC']],
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const logsToday = await Log.count({
      where: {
        created_at: {
          [Op.gte]: today,
        },
      },
    });

    res.json({
      success: true,
      data: {
        totalDates,
        verifiedDates,
        verificationRate: Math.round((verifiedDates / totalDates) * 100) || 0,
        logsToday,
        recentLogs,
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard',
    });
  }
});

// Get Calendar Entry
router.get('/calendar/:dateString', authenticateToken, async (req, res) => {
  try {
    const { dateString } = req.params;

    const calendar = await Calendar.findOne({
      where: { dateString },
    });

    if (!calendar) {
      return res.status(404).json({
        success: false,
        message: 'Calendar entry not found',
      });
    }

    res.json({
      success: true,
      data: calendar,
    });
  } catch (error) {
    console.error('Error fetching calendar:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching calendar',
    });
  }
});

// Create/Update Calendar Entry
router.post('/calendar', authenticateToken, authorizePermission('canManageCalendar'), async (req, res) => {
  try {
    const { dateString, ...calendarData } = req.body;

    if (!dateString) {
      return res.status(400).json({
        success: false,
        message: 'dateString is required',
      });
    }

    let calendar = await Calendar.findOne({ where: { dateString } });
    const isNew = !calendar;

    if (isNew) {
      calendar = await Calendar.create({
        dateString,
        date: new Date(dateString),
        ...calendarData,
      });
    } else {
      const oldData = calendar.toJSON();
      await calendar.update(calendarData);
      
      await logActivity(
        req.admin.id,
        'update',
        'calendar',
        calendar.id,
        `Updated calendar entry for ${dateString}`,
        { old: oldData, new: calendar.toJSON() },
        req
      );
    }

    res.json({
      success: true,
      message: isNew ? 'Calendar entry created' : 'Calendar entry updated',
      data: calendar,
    });
  } catch (error) {
    console.error('Error saving calendar:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving calendar',
    });
  }
});

// Verify Calendar Data
router.post('/calendar/:dateString/verify', authenticateToken, authorizePermission('canManageCalendar'), async (req, res) => {
  try {
    const { dateString } = req.params;

    const calendar = await Calendar.findOne({ where: { dateString } });

    if (!calendar) {
      return res.status(404).json({
        success: false,
        message: 'Calendar entry not found',
      });
    }

    const oldVerified = calendar.verified;
    calendar.verified = true;
    await calendar.save();

    await logActivity(
      req.admin.id,
      'verify',
      'calendar',
      calendar.id,
      `Verified calendar entry for ${dateString}`,
      {},
      req
    );

    res.json({
      success: true,
      message: 'Calendar data verified',
      data: calendar,
    });
  } catch (error) {
    console.error('Error verifying calendar:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying calendar',
    });
  }
});

// Get Activity Logs
router.get('/logs', authenticateToken, authorizePermission('canViewLogs'), async (req, res) => {
  try {
    const { page = 1, limit = 20, action, adminId } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (action) where.action = action;
    if (adminId) where.adminId = adminId;

    const logs = await Log.findAndCountAll({
      where,
      include: [
        {
          model: Admin,
          as: 'admin',
          attributes: ['id', 'name', 'email'],
        },
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset,
    });

    res.json({
      success: true,
      data: logs.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: logs.count,
        pages: Math.ceil(logs.count / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching logs',
    });
  }
});

// Admin Logout
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    await logActivity(
      req.admin.id,
      'logout',
      'admin',
      req.admin.id,
      'Admin logged out',
      {},
      req
    );

    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout error',
    });
  }
});

export default router;
