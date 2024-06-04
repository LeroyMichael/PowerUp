import { number, optional, z } from "zod";
import { numbering } from "@/lib/utils";

export enum SalesType {
  proinvoice = "Pro Invoice",
  invoice = "Invoice",
  penawaran = "Penawaran",
}

export const SaleSchema = z.object({
  wallet_id: z.number().optional(),
  merchant_id: z.string().nullable().optional(),
  contact_id: z.string().optional(),
  currency_code: z.string().optional(),
  status: z.string().optional(),
  transaction_number: z.string().optional(),
  transaction_date: z.string().optional(),
  due_date: z.string().optional(),
  payment_method: z.string().optional(),
  billing_address: z.string().optional(),
  subtotal: z.string().optional(), //
  tax_rate: z.string().optional(),
  tax: z.string().optional(), //
  discount_type: z.string().optional().nullable(),
  discount_value: z.string().optional(), //
  discount_price_cut: z.string().optional(), //
  total: z.string().optional(), //  
  memo: z.string().optional(),
  down_payment_amount: z.string().optional(),
  delivery: z.number().optional(),
  transaction_type: z.string().optional(),
  estimated_time: z.string().optional(),
  is_presigned: z.boolean().default(false),
  details: z
    .array(
      z.object({
        product_id: z.number().optional(),
        description: z.string().optional(),
        currency_code: z.string().optional(),
        unit_price: z.string().optional(),
        qty: z.number().optional(),
        amount: z.string().optional(),
      })
    )
    .optional(),
  
  
  // discount: z.number().min(0).optional(),
  // invoiceNumber: z.string(),
  // customer_id: z.number().nullable(),
  // name: z
  //   .string()
  //   .min(2, {
  //     message: "Name must be at least 2 characters.",
  //   })
  //   .max(30, {
  //     message: "Name must not be longer than 30 characters.",
  //   }),
  // company: z.string({ message: "Company cannot be empty " }),
  // email: z.string().optional(),
  // address: z.string().optional(),
  // telephone: z.number().optional(),
  // sale_id: z.number(),
  // type: z.nativeEnum(SalesType),
  // dp: z.number().min(0).optional(),
  // estimatedTime: z.string().optional(),
  // isPreSigned: z.boolean().optional(),
  // contact_detail: z.object({
  //   contact_id: z.string().optional(),
  //   merchant_id: z.string().optional(),
  //   display_name: z.string().optional(),
  //   contact_type: z.string().optional(),
  //   first_name: z.string().optional(),
  //   last_name: z.string().optional(),
  //   email: z.string().optional(),
  //   company_name: z.string().optional(),
  //   phone_number: z.string().optional(),
  //   billing_address: z.string().optional(),
  //   delivery_address: z.string().optional(),
  //   bank_name: z.string().optional(),
  //   bank_holder: z.string().optional(),
  //   bank_number: z.string().optional(),
  //   memo: z.string().optional(),
  // }),
  // invoices: z
  //   .array(
  //     z.object({
  //       namaBarang: z.string().optional(),
  //       desc: z.string().optional(),
  //       quantity: z.number().min(1).default(0),
  //       price: z.number().min(1).default(0),
  //     })
  //   )
  //   .optional(),
});

export const SaleDefaultValues: Partial<Sale> = {
  wallet_id: 1,
  merchant_id: "0",
  contact_id: "0",
  currency_code: "IDR",
  status: "DRAFT",
  transaction_number: numbering("Sales"),
  transaction_date: new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }),
  due_date: new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }),
  payment_method: "CASH",
  billing_address: "Alamat Billing",
  subtotal: 0,
  tax_rate: "0",
  tax: "0.00",
  discount_type: "promo",
  discount_value: "0",
  discount_price_cut: "0.00",
  total: "10012.00",
  memo: "", 
  down_payment_amount: "100.00", 
  delivery: 0, 
  transaction_type: "Penawaran",
  estimated_time: "1 sampai 2 minggu",
  details: [
    {
      product_id: 0,
      description: "",
      currency_code: "IDR",
      unit_price: "333",
      qty: 0,
      amount: "123",
    },
  ],
  // contact_detail: {
  //   contact_id: "1",
  //   merchant_id: "1",
  //   display_name: "dimas",
  //   contact_type: "customer",
  //   first_name: "Dimas",
  //   last_name: "",
  //   email: "",
  //   company_name: "",
  //   phone_number: "",
  //   billing_address: "",
  //   delivery_address: "",
  //   bank_name: "",
  //   bank_holder: "",
  //   bank_number: "",
  //   memo: "",
  // },
  // invoices: [
  //   {
  //     namaBarang: "WIREMESH Conveyor",
  //     desc: "Wiremesh Conveyor Unit dengan ukuran",
  //     quantity: 1,
  //     price: 2000,
  //   },
  // ],
  // invoiceNumber: "ASD/a13/4454",
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
    discount: 0,
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
    memo: "memo", // optional
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
    invoiceNumber: "ASD/a13/4454",
  },
];
export type Sale = z.infer<typeof SaleSchema>;


