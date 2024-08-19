import { z } from "zod";

export type ProfitLoss = z.infer<typeof ProfitLossSchema>;
export type ProfitLossSummary = z.infer<typeof ProfitLossSummarySchema>;

export const ProfitLossSchema = z.object({
  merchant_id: z.number().nullable().default(0),
  currency_code: z.string().default("IDR").optional(),
  primary_income: z.Array(
    z.object({
      account_code: z.string(),
      account_name: z.string(),
      type: z.string(),
      total: z.number().default(0).min(0), // Convert string to number
    })
  ),
  total_primary_income: z.number().default(0).min(0),
  cost_of_sales: z.Array(
    z.object({
      account_code: z.string(),
      account_name: z.string(),
      type: z.string(),
      total: z.number().default(0).min(0), // Convert string to number
    })
  ),
  total_cost_of_sales: z.number().default(0).min(0),
  gross_profits: z.number().default(0).min(0),
  operational_expense: z.Array(
    z.object({
      account_code: z.string(),
      account_name: z.string(),
      type: z.string(),
      total: z.number().default(0).min(0), // Convert string to number
    })
  ),
  total_operational_expenses: z.number().default(0).min(0),
  net_income: z.number().default(0).min(0),
});

export const ProfitLossSummarySchema = z.object({
  year: z.number(),
  month: z.number(),
  currency_code: z.string().default("IDR").optional(),
  net_income: z.number(),
});
