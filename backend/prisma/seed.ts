import { PrismaClient, Role, CustomerType, CustomerStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const passwordHash = await bcrypt.hash('Admin@123', 10);
  const salesPassword = await bcrypt.hash('Sales@123', 10);
  const warehousePassword = await bcrypt.hash('Warehouse@123', 10);
  const accountsPassword = await bcrypt.hash('Accounts@123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'System Admin',
      passwordHash,
      role: Role.ADMIN,
    },
  });

  const sales = await prisma.user.upsert({
    where: { email: 'sales@example.com' },
    update: {},
    create: {
      email: 'sales@example.com',
      name: 'Sales Rep',
      passwordHash: salesPassword,
      role: Role.SALES,
    },
  });

  const warehouse = await prisma.user.upsert({
    where: { email: 'warehouse@example.com' },
    update: {},
    create: {
      email: 'warehouse@example.com',
      name: 'Warehouse Manager',
      passwordHash: warehousePassword,
      role: Role.WAREHOUSE,
    },
  });

  const accounts = await prisma.user.upsert({
    where: { email: 'accounts@example.com' },
    update: {},
    create: {
      email: 'accounts@example.com',
      name: 'Accounts Executive',
      passwordHash: accountsPassword,
      role: Role.ACCOUNTS,
    },
  });

  // Create Customers
  const customer1 = await prisma.customer.create({
    data: {
      name: 'John Doe',
      mobile: '9876543210',
      businessName: 'Doe Enterprises',
      type: CustomerType.RETAIL,
      address: '123 Main St, City',
      status: CustomerStatus.ACTIVE,
      createdById: sales.id,
    }
  });

  const customer2 = await prisma.customer.create({
    data: {
      name: 'Jane Smith',
      mobile: '9876543211',
      businessName: 'Smith Wholesale',
      type: CustomerType.WHOLESALE,
      address: '456 Market Blvd, City',
      status: CustomerStatus.ACTIVE,
      createdById: sales.id,
    }
  });
  
  const customer3 = await prisma.customer.create({
    data: {
      name: 'Bob Johnson',
      mobile: '9876543212',
      businessName: 'BJ Distributing',
      type: CustomerType.DISTRIBUTOR,
      address: '789 Warehouse Row, City',
      status: CustomerStatus.LEAD,
      createdById: sales.id,
    }
  });

  // Create Products
  const p1 = await prisma.product.create({
    data: {
      name: 'Widget A',
      sku: 'WID-A-100',
      category: 'Hardware',
      unitPrice: 15.50,
      currentStock: 150,
      minimumStock: 20,
      warehouse: 'Main WH',
    }
  });

  const p2 = await prisma.product.create({
    data: {
      name: 'Gadget B',
      sku: 'GAD-B-200',
      category: 'Electronics',
      unitPrice: 120.00,
      currentStock: 45,
      minimumStock: 10,
      warehouse: 'Main WH',
    }
  });

  const p3 = await prisma.product.create({
    data: {
      name: 'Gizmo C',
      sku: 'GIZ-C-300',
      category: 'Electronics',
      unitPrice: 45.00,
      currentStock: 5, // Low stock
      minimumStock: 15,
      warehouse: 'Main WH',
    }
  });

  const p4 = await prisma.product.create({
    data: {
      name: 'Tool D',
      sku: 'TOL-D-400',
      category: 'Hardware',
      unitPrice: 25.00,
      currentStock: 200,
      minimumStock: 50,
      warehouse: 'Aux WH',
    }
  });

  const p5 = await prisma.product.create({
    data: {
      name: 'Part E',
      sku: 'PRT-E-500',
      category: 'Components',
      unitPrice: 2.50,
      currentStock: 1000,
      minimumStock: 200,
      warehouse: 'Aux WH',
    }
  });

  // Initial Stock Movements (IN)
  for (const product of [p1, p2, p3, p4, p5]) {
    await prisma.stockMovement.create({
      data: {
        productId: product.id,
        quantity: product.currentStock,
        type: 'IN',
        reason: 'Initial Inventory Seeding',
        createdById: warehouse.id,
      }
    });
  }

  // Draft Challan
  await prisma.challan.create({
    data: {
      challanNumber: 'CH-2026-0001',
      customerId: customer1.id,
      createdById: sales.id,
      status: 'DRAFT',
      totalQuantity: 15,
      items: {
        create: [
          {
            productId: p1.id,
            productName: p1.name,
            sku: p1.sku,
            unitPrice: p1.unitPrice,
            quantity: 10
          },
          {
            productId: p2.id,
            productName: p2.name,
            sku: p2.sku,
            unitPrice: p2.unitPrice,
            quantity: 5
          }
        ]
      }
    }
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
