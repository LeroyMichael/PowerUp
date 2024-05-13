import { z } from "zod";

export type Product = z.infer<typeof ProductSchema>;

export const ProductSchema = z.object({
  product_id: z.number(),
  merchant_id: z.number().nullable(),
  name: z.string(),
  sku: z.string().optional(),
  unit: z.string(),
  description: z.string().optional(),
  currency_code: z.string(),

  buy: z.object({
    buy_price: z.number().min(0).optional(),
    is_buy: z.boolean().default(true),
  }),

  sell: z.object({
    sell_price: z.number().min(0).optional(),
    is_sell: z.boolean().default(true),
  }),

  // List
  qty: z.number().optional(),
  minStock: z.number().optional(),
});
export const ProductDefaultValues: Partial<Product> = {
  product_id: 0,
  merchant_id: 0,
  unit: "gr",
  currency_code: "IDR",
  buy: {
    is_buy: true,
    buy_price: 0,
  },
  sell: {
    is_sell: false,
    sell_price: 0,
  },
};
