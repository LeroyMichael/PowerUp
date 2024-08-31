import { number, optional, z } from "zod";
import { numbering } from "@/lib/utils";
import { addDays } from "date-fns";
import { Merchant } from "./company";

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
  tax_rate: z.number(),
  tax: z.number(), // convert ke string float
  discount_type: z.string().optional().nullable(),
  discount_value: z.number(), // convert ke string float
  discount_price_cut: z.number(), // convert ke string float
  total: z.number(), // convert ke string float
  memo: z.string().optional(),
  down_payment_amount: z.number().default(0), // convert ke string float
  down_payment_type: z.string().default("RATE"), // RATE / FIX
  delivery_method: z.string().optional(), // convert ke string float
  delivery_amount: z.number().default(0), // convert ke string float
  transaction_type: z.string().optional(),
  estimated_time: z.string().optional(),
  is_presigned: z.boolean().default(true),
  is_last_installment: z.boolean().default(false),
  is_purchase_agreement: z.boolean().default(false),
  merchant: z.object({
    merchant_id: z.number(),
    name: z.string(),
    logo: z.string().optional(),
    address: z.string(),
    admin_name: z.string(),
  }),
  contact: z.object({
    display_name: z.string().optional(),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    type: z.string().optional(),
    company_name: z.string().optional(),
    phone_number: z.string().optional(),
    billing_address: z.string().optional(),
    delivery_address: z.string().optional(),
    email: z.string().optional(),
  }),
  details: z
    .array(
      z.object({
        product_id: z.number(),
        product_name: z.string().optional(),
        description: z.string().optional(),
        currency_code: z.string().optional(),
        unit_price: z.number().default(0), // convert ke string float
        unit: z.string().optional(),
        qty: z.number().default(0),
        amount: z.number().default(0), // convert ke string float
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
  transaction_date: new Date(),
  due_date: addDays(new Date(), 1),
  payment_method: "CASH",
  billing_address: "",
  subtotal: 0,
  tax_rate: 0,
  tax: 0,
  discount_type: null,
  discount_value: 0,
  discount_price_cut: 0,
  total: 10012,
  memo: "",
  down_payment_amount: 0,
  down_payment_type: "RATE",
  delivery_method: "",
  delivery_amount: 0,
  transaction_type: "Invoice",
  estimated_time: "1 sampai 2 minggu",
  is_presigned: true,
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
