import { z } from 'zod';

export const customerSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    mobile: z.string().min(8, "Mobile must be at least 8 characters"),
    email: z.union([z.string().email("Invalid email format"), z.literal(''), z.undefined()]),
    businessName: z.string().min(2, "Business name must be at least 2 characters"),
    gstNumber: z.union([z.string(), z.literal(''), z.undefined()]),
    type: z.enum(['RETAIL', 'WHOLESALE', 'DISTRIBUTOR']),
    address: z.string().min(3, "Address must be at least 3 characters"),
    status: z.enum(['LEAD', 'ACTIVE', 'INACTIVE']),
    followUpDate: z.union([z.string(), z.literal(''), z.undefined()]),
    notes: z.union([z.string(), z.literal(''), z.undefined()]),
  }),
});

export const updateCustomerSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    mobile: z.string().min(8).optional(),
    email: z.string().email().optional().or(z.literal('')),
    businessName: z.string().min(2).optional(),
    gstNumber: z.string().optional().or(z.literal('')),
    type: z.enum(['RETAIL', 'WHOLESALE', 'DISTRIBUTOR']).optional(),
    address: z.string().min(3).optional(),
    status: z.enum(['LEAD', 'ACTIVE', 'INACTIVE']).optional(),
    followUpDate: z.string().optional().or(z.literal('')),
    notes: z.string().optional().or(z.literal('')),
  }),
});

export const followUpSchema = z.object({
  body: z.object({
    note: z.string().min(1),
    followUpDate: z.string().optional().or(z.literal('')),
  }),
});
