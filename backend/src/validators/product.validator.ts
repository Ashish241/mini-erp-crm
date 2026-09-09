import { z } from 'zod';

export const productSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    sku: z.string().min(2),
    category: z.string().min(2),
    unitPrice: z.number().positive(),
    currentStock: z.number().int().min(0),
    minimumStock: z.number().int().min(0),
    warehouse: z.string().min(2),
    imageUrl: z.union([z.string().url(), z.literal(''), z.undefined(), z.null()]),
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    sku: z.string().min(2).optional(),
    category: z.string().min(2).optional(),
    unitPrice: z.number().positive().optional(),
    minimumStock: z.number().int().min(0).optional(),
    warehouse: z.string().min(2).optional(),
  }),
});

export const stockMovementSchema = z.object({
  body: z.object({
    quantity: z.number().int().positive(),
    type: z.enum(['IN', 'OUT']),
    reason: z.string().min(3),
  }),
});
