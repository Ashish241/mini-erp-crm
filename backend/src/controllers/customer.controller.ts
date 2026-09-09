import { Request, Response, NextFunction } from 'express';
import { CustomerService } from '../services/customer.service';
import { AuthRequest } from '../middleware/auth.middleware';

export class CustomerController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const search = req.query.search as string;
      const status = req.query.status as any;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await CustomerService.getAll(search, status, page, limit);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const customer = await CustomerService.getById(parseInt(req.params.id));
      res.json(customer);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const customer = await CustomerService.create(req.body, req.user!.userId);
      res.status(201).json(customer);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const customer = await CustomerService.update(parseInt(req.params.id), req.body);
      res.json(customer);
    } catch (error) {
      next(error);
    }
  }

  static async addFollowUp(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const followUp = await CustomerService.addFollowUp(
        parseInt(req.params.id),
        req.body,
        req.user!.userId
      );
      res.status(201).json(followUp);
    } catch (error) {
      next(error);
    }
  }
}
