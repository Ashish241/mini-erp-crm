import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';

export class DashboardController {
  static async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const [
        totalCustomers,
        totalProducts,
        lowStockProducts,
        draftChallans,
        confirmedChallans,
      ] = await Promise.all([
        prisma.customer.count(),
        prisma.product.count(),
        prisma.product.count({
          where: {
            currentStock: {
              lte: prisma.product.fields.minimumStock,
            },
          },
        }),
        prisma.challan.count({ where: { status: 'DRAFT' } }),
        prisma.challan.count({ where: { status: 'CONFIRMED' } }),
      ]);

      res.json({
        totalCustomers,
        totalProducts,
        lowStockProducts,
        draftChallans,
        confirmedChallans,
      });
    } catch (error) {
      next(error);
    }
  }
}
