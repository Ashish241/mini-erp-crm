import { prisma } from '../config/prisma';
import { Prisma } from '@prisma/client';

export class ProductService {
  static async getAll(search?: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getById(id: number) {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) throw { status: 404, message: 'Product not found' };
    return product;
  }

  static async create(data: any, userId: number) {
    const existing = await prisma.product.findUnique({ where: { sku: data.sku } });
    if (existing) throw { status: 409, message: 'Product with this SKU already exists' };

    return prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          name: data.name,
          sku: data.sku,
          category: data.category,
          unitPrice: data.unitPrice,
          currentStock: data.currentStock,
          minimumStock: data.minimumStock,
          warehouse: data.warehouse,
          imageUrl: data.imageUrl || null,
        },
      });

      if (product.currentStock > 0) {
        await tx.stockMovement.create({
          data: {
            productId: product.id,
            quantity: product.currentStock,
            type: 'IN',
            reason: 'Initial Stock',
            createdById: userId,
          },
        });
      }

      return product;
    });
  }

  static async update(id: number, data: any) {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) throw { status: 404, message: 'Product not found' };

    if (data.sku && data.sku !== product.sku) {
      const existing = await prisma.product.findUnique({ where: { sku: data.sku } });
      if (existing) throw { status: 409, message: 'Product with this SKU already exists' };
    }

    return prisma.product.update({
      where: { id },
      data,
    });
  }

  static async addStockMovement(id: number, data: any, userId: number) {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) throw { status: 404, message: 'Product not found' };

    if (data.type === 'OUT' && product.currentStock < data.quantity) {
      throw { status: 409, message: 'Insufficient stock' };
    }

    return prisma.$transaction(async (tx) => {
      const movement = await tx.stockMovement.create({
        data: {
          productId: id,
          quantity: data.quantity,
          type: data.type,
          reason: data.reason,
          createdById: userId,
        },
      });

      await tx.product.update({
        where: { id },
        data: {
          currentStock: {
            [data.type === 'IN' ? 'increment' : 'decrement']: data.quantity,
          },
        },
      });

      return movement;
    });
  }

  static async getMovements(id: number, page = 1, limit = 10) {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) throw { status: 404, message: 'Product not found' };

    const skip = (page - 1) * limit;

    const [movements, total] = await Promise.all([
      prisma.stockMovement.findMany({
        where: { productId: id },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { createdBy: { select: { name: true } } },
      }),
      prisma.stockMovement.count({ where: { productId: id } }),
    ]);

    return {
      data: movements,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
