import { AppError } from '../errors/AppError';
import prisma from '../libs/prisma';

export class PharmacyService {
  async getPharmacyById(id: string) {
    const pharmacy = await prisma.pharmacy.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        licenseNumber: true,
        address: true,
        city: true,
        state: true,
        country: true,
        phone: true,
        email: true,
        logo: true,
        currency: true,
        timezone: true,
        expiryAlertDays: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!pharmacy) {
      throw new AppError('Pharmacy not found', 404, 'NOT_FOUND');
    }

    return pharmacy;
  }

  async updatePharmacy(id: string, data: {
    name?: string;
    address?: string;
    phone?: string;
    email?: string;
    currency?: string;
    timezone?: string;
    expiryAlertDays?: number;
    logo?: string;
  }) {
    // Check if pharmacy exists
    const existingPharmacy = await prisma.pharmacy.findUnique({
      where: { id },
    });

    if (!existingPharmacy) {
      throw new AppError('Pharmacy not found', 404, 'NOT_FOUND');
    }

    // Check if email is being updated and already exists
    if (data.email && data.email !== existingPharmacy.email) {
      const emailExists = await prisma.pharmacy.findUnique({
        where: { email: data.email },
      });

      if (emailExists) {
        throw new AppError('Pharmacy with this email already exists', 409, 'CONFLICT');
      }
    }

    // Update pharmacy
    const pharmacy = await prisma.pharmacy.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        licenseNumber: true,
        address: true,
        city: true,
        state: true,
        country: true,
        phone: true,
        email: true,
        logo: true,
        currency: true,
        timezone: true,
        expiryAlertDays: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return pharmacy;
  }

  async uploadLogo(pharmacyId: string, file: Express.Multer.File) {
    // Check if pharmacy exists
    const pharmacy = await prisma.pharmacy.findUnique({
      where: { id: pharmacyId },
    });

    if (!pharmacy) {
      throw new AppError('Pharmacy not found', 404, 'NOT_FOUND');
    }

    // In a real implementation, you would upload to S3 or local storage
    // For now, we'll just store the filename or a placeholder URL
    const logoUrl = `/uploads/${file.filename}`;

    // Update pharmacy with logo URL
    const updatedPharmacy = await prisma.pharmacy.update({
      where: { id: pharmacyId },
      data: { logo: logoUrl },
      select: {
        id: true,
        logo: true,
      },
    });

    return updatedPharmacy;
  }
}