import jwt from 'jsonwebtoken';
import { Admin, Log } from '../models/index.js';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findByPk(decoded.id);

    if (!admin || !admin.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Admin not found or inactive',
      });
    }

    req.admin = admin;
    req.adminId = admin.id;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};

export const authorizePermission = (requiredPermission) => {
  return async (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const permissions = req.admin.permissions || {};

    if (req.admin.role === 'superadmin') {
      return next();
    }

    if (!permissions[requiredPermission]) {
      await Log.create({
        adminId: req.admin.id,
        action: 'unauthorized_access',
        entity: 'admin',
        status: 'failure',
        description: `Attempted unauthorized access to ${requiredPermission}`,
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
      });

      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
      });
    }

    next();
  };
};

export const logActivity = async (
  adminId,
  action,
  entity,
  entityId = null,
  description = null,
  changes = {},
  req = null
) => {
  try {
    await Log.create({
      adminId,
      action,
      entity,
      entityId,
      description,
      changes,
      ipAddress: req?.ip,
      userAgent: req?.get('user-agent'),
      status: 'success',
    });
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};
