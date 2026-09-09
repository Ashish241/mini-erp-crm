import { prisma } from '../config/prisma';
import { CustomerStatus, CustomerType, Prisma } from '@prisma/client';

export class CustomerService {
  static async getAll(search?: string, status?: CustomerStatus, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const where: Prisma.CustomerWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { mobile: { contains: search } },
        { businessName: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status) {
      where.status = status;
    }

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.customer.count({ where }),
    ]);

    return {
      data: customers,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getById(id: number) {
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        followUps: {
          orderBy: { createdAt: 'desc' },
          include: { createdBy: { select: { name: true } } },
        },
        challans: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!customer) throw { status: 404, message: 'Customer not found' };
    return customer;
  }

  static async create(data: any, userId: number) {
    return prisma.customer.create({
      data: {
        ...data,
        email: data.email === '' ? null : data.email,
        gstNumber: data.gstNumber === '' ? null : data.gstNumber,
        followUpDate: data.followUpDate ? new Date(data.followUpDate) : null,
        createdById: userId,
      },
    });
  }

  static async update(id: number, data: any) {
    const existing = await prisma.customer.findUnique({ where: { id } });
    if (!existing) throw { status: 404, message: 'Customer not found' };

    return prisma.customer.update({
      where: { id },
      data: {
        ...data,
        followUpDate: data.followUpDate ? new Date(data.followUpDate) : null,
      },
    });
  }

  static async addFollowUp(customerId: number, data: any, userId: number) {
    const customer = await prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) throw { status: 404, message: 'Customer not found' };

    return prisma.$transaction(async (tx) => {
      const followUp = await tx.followUp.create({
        data: {
          customerId,
          note: data.note,
          followUpDate: data.followUpDate ? new Date(data.followUpDate) : null,
          createdById: userId,
        },
      });

      if (data.followUpDate) {
        await tx.customer.update({
          where: { id: customerId },
          data: { followUpDate: new Date(data.followUpDate) },
        });
      }

      return followUp;
    });
  }
}
