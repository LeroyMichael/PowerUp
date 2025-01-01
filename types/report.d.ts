import { endOfMonth, startOfMonth } from "date-fns";
import { z } from "zod";

export type ProfitLoss = z.infer<typeof ProfitLossSchema>;
export type ProfitLossSummary = z.infer<typeof ProfitLossSummarySchema>;
export type ProfitLossFilter = z.infer<typeof ProfitLossFilterSchema>;
export type Summary = z.infer<typeof SummarySchema>;
export type JournalEntry = z.infer<typeof JournalEntrySchema>;

export const ProfitLossFilterSchema = z.object({
  from: z.date(),
  to: z.date(),
});
export const ProfitLossFilterDefaultValues: Partial<ProfitLossFilterSchema> = {
  from: startOfMonth(
    new Date(
      new Date().toLocaleString("en-US", {
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      })
    )
  ),
  to: endOfMonth(
    new Date(
      new Date().toLocaleString("en-US", {
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      })
    )
  ),
};

export const ProfitLossSchema = z.object({
  merchant_id: z.number().nullable().default(0),
  currency_code: z.string().default("IDR").optional(),
  primary_income: z.array(
    z.object({
      account_code: z.string(),
      account_name: z.string(),
      type: z.string(),
      total: z.number().min(0).default(0), // Convert string to number
    })
  ),
  total_primary_income: z.number().min(0).default(0),
  cost_of_sales: z.array(
    z.object({
      account_code: z.string(),
      account_name: z.string(),
      type: z.string(),
      total: z.number().min(0).default(0), // Convert string to number
    })
  ),
  total_cost_of_sales: z.number().min(0).default(0),
  gross_profits: z.number().min(0).default(0),
  operational_expense: z.array(
    z.object({
      account_code: z.string(),
      account_name: z.string(),
      type: z.string(),
      total: z.number().min(0).default(0), // Convert string to number
    })
  ),
  total_operational_expenses: z.number().min(0).default(0),
  net_income: z.number().min(0).default(0),
});

export const ProfitLossSummarySchema = z.object({
  year: z.number(),
  month: z.number(),
  currency_code: z.string().default("IDR").optional(),
  net_income: z.number(),
});

export const SummarySchema = z.object({
  year: z.number(),
  month: z.number(),
  unpaid_sales: z.number(),
  estimated_revenue: z.number(),
});

export const JournalEntrySchema = z.object({
  payment_date: z.string(),
  account_code: z.string(),
  account_name: z.string(),
  amount: z.number(),
  type: z.string(),
});
