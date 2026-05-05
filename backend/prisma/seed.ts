import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create pharmacy
  const pharmacy = await prisma.pharmacy.upsert({
    where: { licenseNumber: 'PHARM-2024-001' },
    update: {},
    create: {
      name: 'Klavora Central Pharmacy',
      licenseNumber: 'PHARM-2024-001',
      address: '123 Health Street, Victoria Island',
      city: 'Lagos',
      state: 'Lagos',
      country: 'Nigeria',
      phone: '+2348012345678',
      email: 'info@klavora.com',
      currency: 'NGN',
      timezone: 'Africa/Lagos',
      expiryAlertDays: 90,
    },
  });

  console.log('✅ Pharmacy created:', pharmacy.name);

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@klavora.com' },
    update: {},
    create: {
      email: 'admin@klavora.com',
      password: hashedPassword,
      firstName: 'System',
      lastName: 'Administrator',
      role: UserRole.ADMIN,
      phone: '+2348012345679',
      pharmacyId: pharmacy.id,
    },
  });

  console.log('✅ Admin user created:', admin.email);

  // Create pharmacist user
  const pharmacist = await prisma.user.upsert({
    where: { email: 'pharmacist@klavora.com' },
    update: {},
    create: {
      email: 'pharmacist@klavora.com',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Doe',
      role: UserRole.PHARMACIST,
      phone: '+2348012345680',
      pharmacyId: pharmacy.id,
    },
  });

  console.log('✅ Pharmacist user created:', pharmacist.email);

  // Create cashier user
  const cashier = await prisma.user.upsert({
    where: { email: 'cashier@klavora.com' },
    update: {},
    create: {
      email: 'cashier@klavora.com',
      password: hashedPassword,
      firstName: 'Jane',
      lastName: 'Smith',
      role: UserRole.CASHIER,
      phone: '+2348012345681',
      pharmacyId: pharmacy.id,
    },
  });

  console.log('✅ Cashier user created:', cashier.email);

  // Create sample inventory items
  const inventoryItems = [
    {
      name: 'Paracetamol 500mg',
      genericName: 'Acetaminophen',
      sku: 'PARA-500',
      barcode: '1234567890123',
      category: 'Pain Relief',
      description: 'Pain reliever and fever reducer',
      unitPrice: 150.00,
      costPrice: 100.00,
      reorderLevel: 50,
      totalQuantity: 200,
      unit: 'tablet',
    },
    {
      name: 'Amoxicillin 250mg',
      genericName: 'Amoxicillin',
      sku: 'AMOX-250',
      barcode: '1234567890124',
      category: 'Antibiotics',
      description: 'Broad-spectrum antibiotic',
      unitPrice: 350.00,
      costPrice: 250.00,
      reorderLevel: 30,
      totalQuantity: 100,
      unit: 'capsule',
    },
    {
      name: 'Ibuprofen 400mg',
      genericName: 'Ibuprofen',
      sku: 'IBUP-400',
      barcode: '1234567890125',
      category: 'Pain Relief',
      description: 'NSAID for pain and inflammation',
      unitPrice: 200.00,
      costPrice: 140.00,
      reorderLevel: 40,
      totalQuantity: 80,
      unit: 'tablet',
    },
    {
      name: 'Vitamin C 1000mg',
      genericName: 'Ascorbic Acid',
      sku: 'VITC-1000',
      barcode: '1234567890126',
      category: 'Vitamins',
      description: 'Immune system support',
      unitPrice: 500.00,
      costPrice: 350.00,
      reorderLevel: 20,
      totalQuantity: 50,
      unit: 'tablet',
    },
    {
      name: 'ORS Sachet',
      genericName: 'Oral Rehydration Salt',
      sku: 'ORS-001',
      barcode: '1234567890127',
      category: 'Hydration',
      description: 'Electrolyte replacement',
      unitPrice: 80.00,
      costPrice: 50.00,
      reorderLevel: 100,
      totalQuantity: 300,
      unit: 'sachet',
    },
  ];

  for (const item of inventoryItems) {
    const inventoryItem = await prisma.inventoryItem.upsert({
      where: { sku: item.sku },
      update: {},
      create: {
        ...item,
        pharmacyId: pharmacy.id,
      },
    });

    // Create a batch for each item
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 12);

    await prisma.inventoryBatch.upsert({
      where: {
        inventoryItemId_batchNumber: {
          inventoryItemId: inventoryItem.id,
          batchNumber: `BATCH-${item.sku}-001`,
        },
      },
      update: {},
      create: {
        inventoryItemId: inventoryItem.id,
        batchNumber: `BATCH-${item.sku}-001`,
        expiryDate,
        quantity: item.totalQuantity,
        remainingQty: item.totalQuantity,
        costPrice: item.costPrice,
        supplierName: 'Klavora Suppliers Ltd',
        receivedDate: new Date(),
        status: 'ACTIVE',
      },
    });
  }

  console.log('✅ Sample inventory items created');

  console.log('\n🎉 Seed completed successfully!');
  console.log('\n📝 Login credentials:');
  console.log('   Admin: admin@klavora.com / admin123');
  console.log('   Pharmacist: pharmacist@klavora.com / admin123');
  console.log('   Cashier: cashier@klavora.com / admin123');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });