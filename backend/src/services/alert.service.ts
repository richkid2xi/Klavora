import { AppError, NotFoundError } from '../errors/AppError';
import prisma from '../libs/prisma';

export class AlertService {
  async getAlerts(pharmacyId: string, params: {
    page?: number;
    limit?: number;
    type?: string;
    severity?: string;
    status?: string;
  }) {
    const page = params.page ?? 1;
    const limit = params.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: any = {
      pharmacyId,
    };

    if (params.type) {
      where.type = params.type;
    }

    if (params.severity) {
      where.severity = params.severity;
    }

    if (params.status) {
      where.status = params.status;
    }

    const [alerts, total] = await prisma.$transaction([
      prisma.alert.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          type: true,
          severity: true,
          status: true,
          title: true,
          message: true,
          inventoryItemId: true,
          batchId: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.alert.count({ where }),
    ]);

    return {
      items: alerts,
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

  async getUnreadCount(pharmacyId: string) {
    const count = await prisma.alert.count({
      where: {
        pharmacyId,
        status: { not: 'RESOLVED' },
      },
    });

    return { count };
  }

  async markAsRead(id: string, pharmacyId: string) {
    const alert = await prisma.alert.findFirst({
      where: { id, pharmacyId },
    });

    if (!alert) {
      throw new NotFoundError('Alert');
    }

    const updatedAlert = await prisma.alert.update({
      where: { id },
      data: { status: 'READ' },
      select: {
        id: true,
        status: true,
        updatedAt: true,
      },
    });

    return updatedAlert;
  }

  async markAllAsRead(pharmacyId: string) {
    const result = await prisma.alert.updateMany({
      where: {
        pharmacyId,
        status: 'UNREAD',
      },
      data: { status: 'READ' },
    });

    return { count: result.count };
  }

  async resolveAlert(id: string, pharmacyId: string) {
    const alert = await prisma.alert.findFirst({
      where: { id, pharmacyId },
    });

    if (!alert) {
      throw new NotFoundError('Alert');
    }

    const resolvedAlert = await prisma.alert.update({
      where: { id },
      data: {
        status: 'RESOLVED',
        updatedAt: new Date(),
      },
      select: {
        id: true,
        status: true,
        updatedAt: true,
      },
    });

    return resolvedAlert;
  }

  async createAlert(data: {
    pharmacyId: string;
    type: 'LOW_STOCK' | 'OUT_OF_STOCK' | 'EXPIRY_APPROACHING' | 'EXPIRED';
    severity: 'INFO' | 'WARNING' | 'CRITICAL';
    title: string;
    message: string;
    inventoryItemId?: string;
    batchId?: string;
    metadata?: Record<string, any>;
  }) {
    const alert = await prisma.alert.create({
      data,
      select: {
        id: true,
        type: true,
        severity: true,
        status: true,
        title: true,
        message: true,
        inventoryItemId: true,
        batchId: true,
        createdAt: true,
      },
    });

    return alert;
  }
}