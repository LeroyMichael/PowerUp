import { z } from "zod";

export type Sale = z.infer<typeof SaleSchema>;

export const SaleSchema = z.object({
  sale_id: z.number(),
  wallet_id: z.number(),
  merchant_id: z.number().nullable(),
  contact_id: z.number().nullable(),
  currency_code: z.string(),
  status: z.string(),
  transaction_number: z.string(),
  transaction_date: z.string(),
  due_date: z.string(),
  payment_method: z.string(),
  billing_address: z.string().optional(),
  subtotal: z.number(), //
  tax_rate: z.string().optional(),
  tax: z.number().optional(), //
  discount_type: z.string().optional(),
  discount_value: z.number().optional(), //
  discount_price_cut: z.number().optional(), //
  total: z.number(), //
  memo: z.string().optional(),
  down_payment_amount: z.number().optional(),
  delivery: z.number().optional(),
  transaction_type: z.string().optional(),
  estimated_time: z.string().optional(),
  is_presigned: z.boolean().default(false),
  details: z.array(
    z.object({
      product_id: z.number(),
      description: z.string().optional(),
      currency_code: z.string(),
      unit_price: z.number(),
      qty: z.number(),
      amount: z.number(),
    })
  ),
});
export const SaleDefaultValues: Partial<Sale> = {
  sale_id: 0,
  wallet_id: 0,
  merchant_id: 0,
  contact_id: 0,
  currency_code: "IDR",
  status: "DRAFT",
  transaction_number: "PC/100/100",
  transaction_date: new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }),
  due_date: new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }),
  payment_method: "CASH",
  transaction_type: "Penawaran",
  estimated_time: "1 sampai 2 minggu",
  is_presigned: false,
  details: [
    {
      product_id: 0,
      description: "",
      currency_code: "IDR",
      unit_price: "0.00",
      qty: 0,
      amount: "0.00",
    },
  ],
};

export const DummySales: Array<Sale> = [
  {
    sale_id: 0,
    wallet_id: 1,
    merchant_id: 1,
    contact_id: 1,
    currency_code: "IDR",
    status: "DRAFT",
    transaction_number: "PC/100/100",
    transaction_date: "12-05-2024",
    due_date: "15-06-2024",
    payment_method: "CASH",
    billing_address: "ALamant Billing", // optional
    subtotal: "10012.00",
    tax_rate: "0",
    tax: "0.00",
    discount_type: "-",
    discount_value: "0.00",
    discount_price_cut: "0.00",
    total: "10012.00",
    memo: "", // optional
    down_payment_amount: 50, // new ini jadi "down_payment_amount" aja, dp ada payment method beda sama diatas ga?
    delivery: 0, //new   (Delivery probably mau delivery method juga)
    transaction_type: "Penawaran", // new | optional nullable
    estimated_time: "1 sampai 2 minggu", // new | optional
    is_presigned: false, // new default false
    details: [
      {
        product_id: 1,
        description: "", //optional
        currency_code: "IDR",
        unit_price: "1000.00",
        qty: 999,
        amount: "10012.00",
      },
    ],
  },
  {
    wallet_id: 1,
    merchant_id: 1,
    contact_id: 1,
    currency_code: "IDR",
    status: "DRAFT",
    transaction_number: "PC/100/100",
    transaction_date: "12-05-2024",
    due_date: "15-06-2024",
    payment_method: "CASH",
    billing_address: "ALamant Billing", // optional
    subtotal: "10012.00",
    tax_rate: "0",
    tax: "0.00",
    discount_type: "-",
    discount_value: "0.00",
    discount_price_cut: "0.00",
    total: "10012.00",
    memo: "", // optional
    down_payment_amount: 50, // new ini jadi "down_payment_amount" aja, dp ada payment method beda sama diatas ga?
    delivery: 0, //new   (Delivery probably mau delivery method juga)
    transaction_type: "Penawaran", // new | optional nullable
    estimated_time: "1 sampai 2 minggu", // new | optional
    is_presigned: false, // new default false
    details: [
      {
        product_id: 1,
        description: "", //optional
        currency_code: "IDR",
        unit_price: "1000.00",
        qty: 999,
        amount: "10012.00",
      },
    ],
  },
];
