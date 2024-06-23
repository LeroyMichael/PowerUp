import { number, optional, z } from "zod";
import { numbering } from "@/lib/utils";

export enum SalesType {
  proinvoice = "Pro Invoice",
  invoice = "Invoice",
  penawaran = "Penawaran",
}

export const SaleSchema = z.object({
  wallet_id: z.number().nullable(),
  merchant_id: z.number().nullable().optional(),
  contact_id: z.number({ required_error: "Please select contact" }),
  currency_code: z.string().optional(),
  status: z.string().optional(),
  transaction_number: z.string().optional(),
  transaction_date: z.date(),
  due_date: z.date(),
  payment_method: z.string().optional(),
  billing_address: z.string().optional(),
  subtotal: z.number(), // convert ke string float
  tax_rate: z.string(),
  tax: z.number(), // convert ke string float
  discount_type: z.string().optional().nullable(),
  discount_value: z.number(), // convert ke string float
  discount_price_cut: z.number(), // convert ke string float
  total: z.number(), // convert ke string float
  memo: z.string().optional(),
  down_payment_amount: z.number().optional(), // convert ke string float
  delivery: z.number().optional(), // convert ke string float
  transaction_type: z.string().optional(),
  estimated_time: z.string().optional(),
  is_presigned: z.boolean().default(false),
  details: z
    .array(
      z.object({
        product_id: z.number(),
        description: z.string().optional(),
        currency_code: z.string().optional(),
        unit_price: z.number().optional(), // convert ke string float
        qty: z.number().optional(),
        amount: z.number().optional(), // convert ke string float
      })
    )
    .min(1, { message: "Select at least 1 product" })
    .optional(),
});

export const SaleDefaultValues: Partial<Sale> = {
  merchant_id: 0,
  currency_code: "IDR",
  status: "DRAFT",
  transaction_number: "",
  payment_method: "CASH",
  billing_address: "Alamat Billing",
  subtotal: 0,
  tax_rate: 0,
  tax: 0,
  discount_type: "promo",
  discount_value: 0,
  discount_price_cut: 0,
  total: 10012,
  memo: "",
  down_payment_amount: 100,
  delivery: 0,
  transaction_type: "Penawaran",
  estimated_time: "1 sampai 2 minggu",
  details: [
    {
      description: "",
      currency_code: "IDR",
      unit_price: 333,
      qty: 0,
      amount: 123,
    },
  ],
};

export type Sale = z.infer<typeof SaleSchema>;
