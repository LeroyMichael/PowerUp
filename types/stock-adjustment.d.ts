import { z } from "zod";

export type StockAdjustment = z.infer<typeof StockAdjustmentSchema>;

export const StockAdjustmentSchema = z.object({
  sa_id: z.number().nullable(),
  merchant_id: z.number().nullable(),
  transaction_number: z.string(),
  transaction_date: z.date(),
  sa_category_label: z.string(),
  account_code: z.string(),
  memo: z.string().optional(),
  details: z.array(
    z.object({
      product_id: z.number(),
      difference: z.string(),
      buy_price: z.number(),
      // GET
      pre_qty: z.number().optional(),
      pre_avg: z.number().optional(),
      post_avg: z.number().optional(),
      post_qty: z.number().optional(),
      pre_buy_price: z.number().optional(),
      post_buy_price: z.number().optional(),
    })
  ),
  created_at: z.coerce.date().optional(),
});

export const StockAdjustmentDefaultValues: Partial<StockAdjustment> = {
  sa_id: 0,
  merchant_id: 0,
  transaction_date: new Date(),
  sa_category_label: "production",
  account_code: "1020-inventory",
  memo: "",
  details: [
    {
      difference: 0,
    },
  ],
};
