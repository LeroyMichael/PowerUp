import { z } from "zod";

export type Product = z.infer<typeof ProductSchema>;

export const ProductSchema = z.object({
  productId: z.number(),
  name: z.string(),
  SKU: z.string().optional(),
  unit: z.string(),
  description: z.string().optional(),

  buy: z.object({
    buyPrice: z.number().min(0).optional(),
    buyAccountId: z.string().optional(),
    buyTaxId: z.string().optional(),
    isBuy: z.boolean().default(true),
  }),

  sell: z.object({
    sellPrice: z.number().min(0).optional(),
    sellAccountId: z.string().optional(),
    sellTaxId: z.string().optional(),
    isSell: z.boolean().default(true),
  }),

  // List
  qty: z.number().optional(),
  minStock: z.number().optional(),
});
export const ProductDefaultValues: Partial<Product> = {
  productId: 0,
  buy: {
    isBuy: true,
    buyPrice: 0,
  },
  sell: {
    isSell: true,
    sellPrice: 0,
  },
};
