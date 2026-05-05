import { AppError } from '../errors/AppError';
import { Prisma, UserRole } from '@prisma/client';
import prisma from '../libs/prisma';

export class UserService {
  async createUser(data: Prisma.UserCreateInput): Promise<any> {
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email as string },
    });

    if (existingUser) {
      throw new AppError('User with this email already exists', 409, 'CONFLICT');
    }

    // Create user
    const user = await prisma.user.create({
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        phone: true,
        isActive: true,
        createdAt: true,
      },
    });

    return user;
  }

  async getUsers(pharmacyId: string, params: { page?: number; limit?: number; search?: string; role?: UserRole }) {
    const page = params.page ?? 1;
    const limit = params.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: any = {
      pharmacyId,
      isActive: true,
    };

    if (params.role) {
      where.role = params.role;
    }

    if (params.search) {
      where.OR = [
        { firstName: { contains: params.search, mode: 'insensitive' } },
        { lastName: { contains: params.search, mode: 'insensitive' } },
        { email: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          phone: true,
          isActive: true,
          lastLogin: true,
          createdAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      items: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  }

  async getUserById(id: string, pharmacyId: string) {
    const user = await prisma.user.findFirst({
      where: { id, pharmacyId, isActive: true },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        phone: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404, 'NOT_FOUND');
    }

    return user;
  }

  async updateUser(id: string, pharmacyId: string, data: Prisma.UserUpdateInput) {
    // Check if user exists and belongs to pharmacy
    const existingUser = await prisma.user.findFirst({
      where: { id, pharmacyId },
    });

    if (!existingUser) {
      throw new AppError('User not found', 404, 'NOT_FOUND');
    }

    // Check if email is being updated and already exists
    if (data.email && data.email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: data.email as string },
      });

      if (emailExists) {
        throw new AppError('User with this email already exists', 409, 'CONFLICT');
      }
    }

    // Update user
    const user = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        phone: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async deactivateUser(id: string, pharmacyId: string) {
    const user = await prisma.user.findFirst({
      where: { id, pharmacyId },
    });

    if (!user) {
      throw new AppError('User not found', 404, 'NOT_FOUND');
    }

    // Deactivate user
    const deactivatedUser = await prisma.user.update({
      where: { id },
      data: { isActive: false },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
      },
    });

    return deactivatedUser;
  }

  async activateUser(id: string, pharmacyId: string) {
    const user = await prisma.user.findFirst({
      where: { id, pharmacyId },
    });

    if (!user) {
      throw new AppError('User not found', 404, 'NOT_FOUND');
    }

    // Activate user
    const activatedUser = await prisma.user.update({
      where: { id },
      data: { isActive: true },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
      },
    });

    return activatedUser;
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    // This would typically be in auth service, but keeping it here for completeness
    // In a real implementation, you'd want to move this to auth service
    throw new AppError('Use auth service for password changes', 400, 'BAD_REQUEST');
  }
}