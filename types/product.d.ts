import { z } from "zod";

export type Product = z.infer<typeof ProductSchema>;
export type ProductsRequest = z.infer<typeof ProductsSchemaRequest>;
export type ProductRequest = z.infer<typeof ProductSchemaRequest>;

export const ProductsSchemaRequest = z.object({
  product_list: z.array(
    z.object({
      product_id: z.number(),
      product_name: z.string(),
      sell_price: z.number().optional(),
      selected_qty: z.number().min(0).default(0),
    })
  ),
});

export const ProductSchema = z.object({
  product_id: z.number(),
  merchant_id: z.number().nullable(),
  name: z.string(),
  sku: z.string().optional(),
  unit: z.string(),
  description: z.string().optional(),
  currency_code: z.string(),

  buy: z.object({
    average_buy_price: z.number().min(0).optional(),
    buy_price: z.number().min(0).optional(),
    is_buy: z.boolean().default(true),
  }),

  sell: z.object({
    sell_price: z.number().min(0).optional(),
    is_sell: z.boolean().default(true),
  }),

  // List
  qty: z.number().optional(),
  children: z.array(),
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
  children: [],
};
