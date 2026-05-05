import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import bcrypt from 'bcrypt';
import { getConfig } from '../config';
import prisma from '../libs/prisma';

const userService = new UserService();

export class UserController {
  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const pharmacyId = req.user?.pharmacyId;
      if (!pharmacyId) {
        throw new Error('Pharmacy ID not found');
      }

      const { email, password, firstName, lastName, role, phone } = req.body;
      const hashedPassword = await bcrypt.hash(password, Number(getConfig().BCRYPT_ROUNDS));

      const user = await userService.createUser({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role,
        phone,
        pharmacy: { connect: { id: pharmacyId } },
      });

      res.status(201).json({
        success: true,
        data: user,
        message: 'User created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const pharmacyId = req.user?.pharmacyId;
      if (!pharmacyId) {
        throw new Error('Pharmacy ID not found');
      }

      const { page, limit, search, role } = req.query;

      const result = await userService.getUsers(pharmacyId, {
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        search: search as string,
        role: role as any,
      });

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const pharmacyId = req.user?.pharmacyId;
      if (!pharmacyId) {
        throw new Error('Pharmacy ID not found');
      }

      const { id } = req.params;
      const user = await userService.getUserById(id, pharmacyId);

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const pharmacyId = req.user?.pharmacyId;
      if (!pharmacyId) {
        throw new Error('Pharmacy ID not found');
      }

      const { id } = req.params;
      const { firstName, lastName, phone, role } = req.body;

      const user = await userService.updateUser(id, pharmacyId, {
        firstName,
        lastName,
        phone,
        role,
      });

      res.json({
        success: true,
        data: user,
        message: 'User updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async deactivateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const pharmacyId = req.user?.pharmacyId;
      if (!pharmacyId) {
        throw new Error('Pharmacy ID not found');
      }

      const { id } = req.params;
      const user = await userService.deactivateUser(id, pharmacyId);

      res.json({
        success: true,
        data: user,
        message: 'User deactivated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async activateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const pharmacyId = req.user?.pharmacyId;
      if (!pharmacyId) {
        throw new Error('Pharmacy ID not found');
      }

      const { id } = req.params;
      const user = await userService.activateUser(id, pharmacyId);

      res.json({
        success: true,
        data: user,
        message: 'User activated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new Error('User ID not found');
      }

      const { currentPassword, newPassword } = req.body;

      // Get user
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Verify current password
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, Number(getConfig().BCRYPT_ROUNDS));

      // Update password
      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });

      res.json({
        success: true,
        message: 'Password changed successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();