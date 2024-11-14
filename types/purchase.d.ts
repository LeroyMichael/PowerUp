import z from "zod";
import { addDays, format } from "date-fns";

export type Purchase = z.infer<typeof PurchaseSchema>;

export type PurchaseProductList = z.infer<typeof productDetail>;

export type PurchaseMutation = z.infer<typeof PurchaseMutationSchema>;

export type PurchaseDetailMutation = z.infer<
  typeof PurchaseDetailMutationSchema
>;

export enum PaymentMethods {
  TRANSFER = "TRANSFER",
  CASH = "CASH",
}

export enum DiscountType {
  PERCENTAGE = "PERCENTAGE",
  FIX = "FIX",
}

export const productDetail = z.object({
  product_id: z.number().min(1),
  unit_price: z.string(),
  currency_code: z.string(),
  qty: z.string(),
  amount: z.number(),
  description: z.string().optional(),
});

export const PurchaseSchema = z.object({
  purchase_id: z.number().optional(),
  merchant_id: z.number(),
  wallet_id: z.number(),
  contact_id: z.number(),
  currency_code: z.string(),
  discount_type: z.string(),
  discount_value: z.number().min(0),
  discount_price_cut: z.number().optional(),
  transaction_number: z.string(),
  billing_address: z.string().optional(),
  transaction_date: z.date(),
  due_date: z.date(),
  memo: z.string().optional(),
  subtotal: z.number().min(0),
  total: z.number().min(0),
  payment_method: z.string(),
  process_as_active: z.boolean(),
  process_as_paid: z.boolean(),
  tax: z.number().min(0),
  tax_rate: z.number().min(0),
  details: z.array(productDetail),
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
  billing_address: "",
  transaction_date: new Date(),
  due_date: addDays(new Date(), 1),
  memo: "",
  subtotal: 0,
  total: 0,
  payment_method: "TRANSFER",
  process_as_active: false,
  process_as_paid: false,
  tax: 0,
  tax_rate: 0,
  details: [
    {
      product_id: 0,
      currency_code: "IDR",
      unit_price: 0,
      qty: "0",
      amount: 0,
      description: "",
    },
  ],
};

export const PurchaseDetailMutationSchema = productDetail.and(
  z.object({
    unit_price: z.string(),
    amount: z.string(),
  })
);

export const PurchaseMutationSchema = PurchaseSchema.and({
  transaction_date: z.string(),
  due_date: z.string(),
  subtotal: z.string(),
  tax: z.string(),
  tax_rate: z.string(),
  discount_value: z.string(),
  discount_price_cut: z.string(),
  total: z.string(),
  details: z.array(PurchaseDetailMutationSchema),
});
