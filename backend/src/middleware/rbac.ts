import { Response, NextFunction } from 'express';
import { UserRole } from '@prisma/client';
import { AuthorizationError } from '../errors/AppError';
import { AuthenticatedRequest } from './auth';

type Role = UserRole | 'ALL';

const roleHierarchy: Record<Role, number> = {
  ADMIN: 3,
  PHARMACIST: 2,
  CASHIER: 1,
  ALL: 0,
};

export const authorize = (...allowedRoles: Role[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new AuthorizationError('User not authenticated');
      }
      
      const userRole = req.user.role;
      
      // Admin has access to everything
      if (userRole === 'ADMIN') {
        return next();
      }
      
      // Check if user's role is in allowed roles
      const hasPermission = allowedRoles.includes('ALL') || 
        allowedRoles.includes(userRole);
      
      if (!hasPermission) {
        throw new AuthorizationError(`Access denied. Required roles: ${allowedRoles.join(', ')}`);
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
};

export const requirePharmacy = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  try {
    if (!req.user?.pharmacyId) {
      throw new AuthorizationError('No pharmacy associated with user');
    }
    next();
  } catch (error) {
    next(error);
  }
};