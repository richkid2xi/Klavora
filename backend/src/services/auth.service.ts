import { TokenPayload } from '../types';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../libs/jwt';
import { AppError } from '../errors/AppError';
import { getConfig } from '../config';
import prisma from '../libs/prisma';
import bcrypt from 'bcrypt';
import { tokenStore } from '../libs/tokenStore';
import { sendPasswordResetEmail, sendWelcomeEmail } from '../libs/mailer';

export class AuthService {
  async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    pharmacyData: {
      name: string;
      licenseNumber: string;
      address: string;
      phone: string;
      email: string;
    }
  ): Promise<{ userId: string; pharmacyId: string }> {
    // Check if pharmacy already exists
    const existingPharmacy = await prisma.pharmacy.findUnique({
      where: { licenseNumber: pharmacyData.licenseNumber },
    });

    if (existingPharmacy) {
      throw new AppError('Pharmacy with this license number already exists', 409, 'CONFLICT');
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError('User with this email already exists', 409, 'CONFLICT');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, Number(getConfig().BCRYPT_ROUNDS));

    // Create pharmacy and admin user in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const pharmacy = await tx.pharmacy.create({
        data: {
          name: pharmacyData.name,
          licenseNumber: pharmacyData.licenseNumber,
          address: pharmacyData.address,
          phone: pharmacyData.phone,
          email: pharmacyData.email,
        },
      });

      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
          role: 'ADMIN',
          pharmacyId: pharmacy.id,
        },
      });

      // Send welcome email
      sendWelcomeEmail(email, firstName, pharmacyData.name).catch(console.error);

      return { userId: user.id, pharmacyId: pharmacy.id };
    });

    return result;
  }

  async login(email: string, password: string): Promise<{ accessToken: string; refreshToken: string }> {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: { pharmacy: true },
    });

    if (!user) {
      throw new AppError('Invalid email or password', 401, 'AUTHENTICATION_ERROR');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401, 'AUTHENTICATION_ERROR');
    }

    if (!user.isActive) {
      throw new AppError('Account is deactivated', 401, 'AUTHENTICATION_ERROR');
    }

    // Generate tokens
    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      pharmacyId: user.pharmacyId,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Store refresh token
    await tokenStore.storeRefreshToken(
      user.id,
      user.refreshTokenVersion,
      refreshToken
    );

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      // Verify refresh token
      const payload = verifyRefreshToken(refreshToken) as TokenPayload;

      // Get user
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        include: { pharmacy: true },
      });

      if (!user || !user.isActive) {
        throw new AppError('User not found or inactive', 401, 'AUTHENTICATION_ERROR');
      }

      // Verify stored token
      const isValid = await tokenStore.verifyRefreshToken(
        user.id,
        user.refreshTokenVersion,
        refreshToken
      );

      if (!isValid) {
        throw new AppError('Invalid refresh token', 401, 'AUTHENTICATION_ERROR');
      }

      // Generate new token pair (token rotation)
      const newPayload: TokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
        pharmacyId: user.pharmacyId,
      };

      const newAccessToken = generateAccessToken(newPayload);
      const newRefreshToken = generateRefreshToken(newPayload);

      // Delete old refresh token
      await tokenStore.deleteRefreshToken(user.id, user.refreshTokenVersion);

      // Increment token version
      await prisma.user.update({
        where: { id: user.id },
        data: { refreshTokenVersion: { increment: 1 } },
      });

      // Store new refresh token
      await tokenStore.storeRefreshToken(
        user.id,
        user.refreshTokenVersion + 1,
        newRefreshToken
      );

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Invalid refresh token', 401, 'AUTHENTICATION_ERROR');
    }
  }

  async logout(userId: string, refreshToken: string): Promise<void> {
    try {
      // Get user to get current token version
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (user) {
        // Delete refresh token
        await tokenStore.deleteRefreshToken(userId, user.refreshTokenVersion);

        // Increment token version to invalidate all refresh tokens
        await prisma.user.update({
          where: { id: userId },
          data: { refreshTokenVersion: { increment: 1 } },
        });
      }
    } catch (error) {
      // Even if there's an error, try to increment version
      try {
        await prisma.user.update({
          where: { id: userId },
          data: { refreshTokenVersion: { increment: 1 } },
        });
      } catch {
        // Ignore
      }
    }
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal whether email exists for security
      return;
    }

    // Generate reset token
    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    // Store reset token
    await tokenStore.storePasswordResetToken(user.id, resetToken);

    // Send reset email
    await sendPasswordResetEmail(email, resetToken);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    // This is a simplified version - in production you'd need to find the user by token
    // For now, we'll just check if any user has this token stored
    
    // Get all active users and check their stored tokens
    // This is inefficient - in production you'd use a different approach
    const users = await prisma.user.findMany({
      where: { isActive: true },
      select: { id: true },
    });

    let foundUserId: string | null = null;
    
    for (const user of users) {
      const isValid = await tokenStore.verifyPasswordResetToken(user.id, token);
      if (isValid) {
        foundUserId = user.id;
        break;
      }
    }

    if (!foundUserId) {
      throw new AppError('Invalid or expired reset token', 400, 'VALIDATION_ERROR');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, Number(getConfig().BCRYPT_ROUNDS));

    // Update password and delete reset token
    await prisma.user.update({
      where: { id: foundUserId },
      data: { password: hashedPassword },
    });

    await tokenStore.deletePasswordResetToken(foundUserId);
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError('User not found', 404, 'NOT_FOUND');
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new AppError('Current password is incorrect', 400, 'VALIDATION_ERROR');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, Number(getConfig().BCRYPT_ROUNDS));

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }
}