import { prisma } from '../config/prisma';
import { Prisma } from '@prisma/client';

export class ChallanService {
  static async getAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [challans, total] = await Promise.all([
      prisma.challan.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: { select: { name: true, businessName: true } },
          createdBy: { select: { name: true } },
        },
      }),
      prisma.challan.count(),
    ]);

    return {
      data: challans,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getById(id: number) {
    const challan = await prisma.challan.findUnique({
      where: { id },
      include: {
        customer: true,
        createdBy: { select: { name: true, email: true } },
        items: true,
      },
    });

    if (!challan) throw { status: 404, message: 'Challan not found' };
    return challan;
  }

  static async createDraft(data: any, userId: number) {
    const customer = await prisma.customer.findUnique({ where: { id: data.customerId } });
    if (!customer) throw { status: 404, message: 'Customer not found' };

    // Generate Challan Number
    const count = await prisma.challan.count();
    const challanNumber = `CH-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    let totalQuantity = 0;
    const itemsData = [];

    for (const item of data.items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) throw { status: 404, message: `Product ID ${item.productId} not found` };

      totalQuantity += item.quantity;
      itemsData.push({
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        unitPrice: product.unitPrice,
        quantity: item.quantity,
      });
    }

    return prisma.challan.create({
      data: {
        challanNumber,
        customerId: customer.id,
        createdById: userId,
        status: 'DRAFT',
        totalQuantity,
        items: {
          create: itemsData,
        },
      },
      include: { items: true },
    });
  }

  static async confirm(challanId: number, userId: number) {
    return prisma.$transaction(async (tx) => {
      const challan = await tx.challan.findUnique({
        where: { id: challanId },
        include: { items: true },
      });

      if (!challan) {
        throw { status: 404, message: 'Challan not found' };
      }

      if (challan.status !== 'DRAFT') {
        throw { status: 400, message: 'Only DRAFT challans can be confirmed' };
      }

      for (const item of challan.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product || product.currentStock < item.quantity) {
          throw { status: 409, message: `Insufficient stock for ${item.productName}` };
        }

        await tx.product.update({
          where: { id: product.id },
          data: {
            currentStock: {
              decrement: item.quantity,
            },
          },
        });

        await tx.stockMovement.create({
          data: {
            productId: product.id,
            quantity: item.quantity,
            type: 'OUT',
            reason: `Sales challan ${challan.challanNumber}`,
            createdById: userId,
          },
        });
      }

      return tx.challan.update({
        where: { id: challanId },
        data: {
          status: 'CONFIRMED',
        },
        include: { items: true },
      });
    });
  }

  static async cancel(challanId: number) {
    const challan = await prisma.challan.findUnique({ where: { id: challanId } });
    if (!challan) throw { status: 404, message: 'Challan not found' };

    if (challan.status !== 'DRAFT') {
      throw { status: 400, message: 'Only DRAFT challans can be cancelled. Confirmed challans require a return process.' };
    }

    return prisma.challan.update({
      where: { id: challanId },
      data: { status: 'CANCELLED' },
    });
  }
}
