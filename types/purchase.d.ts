import z from "zod";
import { addDays, endOfDay } from 'date-fns';

export type Purchase = z.infer<typeof PurchaseSchema>;

export type PurchaseProductList = z.infer<typeof productLists>;

export enum PaymentMethods{
  CASH = "CASH"
}

export enum DiscountType{
  PERCENTAGE = "PERCENTAGE",
  FIX = "FIX"
}

export const productLists = z.object({
  product_id: z.number().nullable(),
  unit_price: z.number(),
  currency_code: z.string(),
  qty: z.number(),
  amount: z.number(),
})

export const PurchaseSchema = z.object({
  purchase_id: z.number().optional(),
  merchant_id: z.number(),
  wallet_id: z.number(),
  contact_id: z.number(),
  currency_code: z.string(),
  discount_type: z.string(),
  discount_value: z.number().min(0),
  discount_price_cut: z.number().optional(),
  transaction_number: z
    .string()
    .min(2, {
      message: "transaction number must be at least 2 characters.",
    })
    .max(10, {
      message: "transaction number must not be longer than 10 characters.",
    }),
  email: z.string().email().optional().or(z.literal("")),
  billing_address: z.string().optional(),
  transaction_date: z.date(),
  due_date: z.date(),
  memo: z.string().optional(),
  subtotal: z.number().min(0),
  total: z.number().min(0),
  payment_method: z.string(),
  process_as_active: z.boolean(),
  process_as_paid: z.boolean(),
  tax: z.number().min(0), // ini bentuknya float jadi perlu 0.00 pake function yg ada (hanya display karena hasil kalkulasi rate x subtotal)
  tax_rate: z.number().min(0), // int biasa dlm bentuk , ini yang persentase
  details: z.array(productLists)
});

export const PurchaseDefaultValues: Partial<PurchaseSchema> = {
  purchase_id: 0,
  merchant_id: 0,
  wallet_id: null,
  contact_id: null,
  currency_code: "IDR",
  discount_type: "FIX",
  discount_value: 0,
  discount_price_cut: 0,
  transaction_number: "",
  email: "",
  billing_address: "",
  transaction_date: "",
  due_date: "",
  memo: "",
  subtotal: 0,
  total: 0,
  payment_method: "CASH",
  process_as_active: false,
  process_as_paid: false,
  tax: 0,
  tax_rate: 0,
  details: [
    {
    product_id: null,
    currency_code: "IDR",
    unit_price: 0,
    qty: 0,
    amount: 0,
  }
  ]
};
