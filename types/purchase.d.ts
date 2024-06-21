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
  purchase_id: z.number(),
  merchant_id: z.number().nullable(),
  wallet_id: z.number().nullable(),
  contact_id: z.number().min(0),
  currency_code: z.string(),
  discount_type: z.enum(),
  discount_value: z.number(),
  discount_price_cut: z.number(),
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
  subtotal: z.number().min(0).optional(),
  total: z.number().min(0).optional(),
  payment_method: z.enum(PaymentMethods),
  process_as_active: z.boolean(),
  process_as_paid: z.boolean(),
  tax: z.number().min(0), // ini bentuknya float jadi perlu 0.00 pake function yg ada
  tax_rate: z.number().min(0), // int biasa dlm bentuk string
  details: z.array(productLists)
});

export const PurchaseDefaultValues: Partial<PurchaseSchema> = {
  purchase_id: 0,
  merchant_id: 0,
  bank_name: "",
  currency_code: "IDR",
  transaction_num: "",
  vendor_name: "",
  total_price: 0,
  message: "",
  balance_due: 0,
  transactionDate: new Date(),
  dueDate: addDays(new Date(), 1),
  details: [
    {
    product_id: null,
    currency_code: "IDR",
    unit_price: null,
    qty: null,
    amount: null,
  }
  ],
  process_as_active: false,
  process_as_paid: false,
};
