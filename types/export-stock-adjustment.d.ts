import { z } from "zod";

export type ExportStockAdjustmentType = z.infer<
  typeof ExportStockAdjustmentSchema
>;
export const ExportStockAdjustmentSchema = z.object({
  merchant_id: z.number(),
  transaction_number: z.string(),
  transaction_date: z.date(),
  sa_category_label: z.string(),
  account_code: z.string(),
  memo: z.string(),
  details: z
    .array(
      z.object({
        product_id: z.number().default(0),
        difference: z.number().default(0),
        buy_price: z.string().optional(),
      })
    )
    .min(1, { message: "Select at least 1 product" })
    .optional(),
});
