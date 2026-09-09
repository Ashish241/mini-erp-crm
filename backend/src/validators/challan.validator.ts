import { z } from 'zod';

export const createChallanSchema = z.object({
  body: z.object({
    customerId: z.number().int().positive(),
    items: z.array(
      z.object({
        productId: z.number().int().positive(),
        quantity: z.number().int().positive(),
      })
    ).min(1, 'At least one item is required'),
  }),
});
