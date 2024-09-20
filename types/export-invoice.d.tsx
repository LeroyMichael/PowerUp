import { z } from "zod";

export type ExportInvoiceType = z.infer<typeof ExportInvoiceSchema>;
export const ExportInvoiceSchema = z.object({
  transaction_info: z.object({
    transaction_number: z.string(),
    transaction_date: z.date(),
    transaction_type: z.string(),
    payment_method: z.string(),
    due_date: z.date(),
    status: z.string(), // DRAFT or ACTIVE
    memo: z.string(),
    currency_code: z.string().default("IDR"),
    estimated_time: z.string(),
    is_presigned: z.boolean().default(false),
    is_last_installment: z.boolean().default(false),
    is_purchase_agreement: z.boolean().default(false),
  }),

  merchant: z.object({
    merchant_id: z.number(),
    name: z.string(),
    logo: z.string(),
    address: z.string(),
    admin_name: z.string().optional(),
  }),
  contact: z.object({
    display_name: z.string().optional(),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    type: z.string().optional(),
    email: z.string().optional(),
    company_name: z.string().optional(),
    phone_number: z.string().optional(),
    billing_address: z.string().optional(),
    delivery_address: z.string().optional(),
  }),
  transaction_details: z.object({
    subtotal: z.number().default(0),
    tax_rate: z.number().default(0),
    tax: z.number().default(0),
    discount_type: z.string().optional().nullable(),
    discount_value: z.number().default(0),
    discount_price_cut: z.number().default(0),
    total: z.number().default(0),
    down_payment_amount: z.number().default(0),
    down_payment_type: z.string().default("RATE"), // RATE / FIX
    delivery_method: z.string().optional(),
    delivery_amount: z.number().default(0),
  }),
  items: z
    .array(
      z.object({
        product_name: z.string().optional(),
        description: z.string().optional(),
        unit_price: z.number().default(0),
        qty: z.string(),
        unit: z.string().optional(),
        amount: z.number().default(0),
      })
    )
    .min(1, { message: "Select at least 1 product" })
    .optional(),
  calculated: z.object({
    total_tax: z.number(),
    total_dp: z.number(),
    grand_total: z.number(),
  }),
});
