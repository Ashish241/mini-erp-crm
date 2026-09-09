import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/product.service';
import { AuthRequest } from '../middleware/auth.middleware';

export class ProductController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const search = req.query.search as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await ProductService.getAll(search, page, limit);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await ProductService.getById(parseInt(req.params.id));
      res.json(product);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const product = await ProductService.create(req.body, req.user!.userId);
      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await ProductService.update(parseInt(req.params.id), req.body);
      res.json(product);
    } catch (error) {
      next(error);
    }
  }

  static async addStockMovement(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const movement = await ProductService.addStockMovement(
        parseInt(req.params.id),
        req.body,
        req.user!.userId
      );
      res.status(201).json(movement);
    } catch (error) {
      next(error);
    }
  }

  static async getMovements(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const movements = await ProductService.getMovements(parseInt(req.params.id), page, limit);
      res.json(movements);
    } catch (error) {
      next(error);
    }
  }
}
