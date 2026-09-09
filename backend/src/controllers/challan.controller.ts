import { Request, Response, NextFunction } from 'express';
import { ChallanService } from '../services/challan.service';
import { AuthRequest } from '../middleware/auth.middleware';

export class ChallanController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await ChallanService.getAll(page, limit);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const challan = await ChallanService.getById(parseInt(req.params.id));
      res.json(challan);
    } catch (error) {
      next(error);
    }
  }

  static async createDraft(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const challan = await ChallanService.createDraft(req.body, req.user!.userId);
      res.status(201).json(challan);
    } catch (error) {
      next(error);
    }
  }

  static async confirm(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const challan = await ChallanService.confirm(parseInt(req.params.id), req.user!.userId);
      res.json(challan);
    } catch (error) {
      next(error);
    }
  }

  static async cancel(req: Request, res: Response, next: NextFunction) {
    try {
      const challan = await ChallanService.cancel(parseInt(req.params.id));
      res.json(challan);
    } catch (error) {
      next(error);
    }
  }
}
