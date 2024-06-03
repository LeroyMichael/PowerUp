import { optional, z } from "zod";
import { numbering } from "@/lib/utils";


export enum SalesType {
  proinvoice = "Pro Invoice",
  invoice = "Invoice",
  penawaran = "Penawaran",
}

export const SaleSchema = z.object({
  invoiceNumber: z.string(),
  customer_id: z.number().nullable(),
  name: z
  .string()
  .min(2, {
    message: "Name must be at least 2 characters.",
  })
  .max(30, {
    message: "Name must not be longer than 30 characters.",
  }),
  company: z.string({message: "Company cannot be empty "}),
  email: z.string().optional(),
  address: z.string().optional(),
  telephone: z.number().optional(),
  sale_id: z.number().optional(),
  wallet_id: z.number().optional(),
  merchant_id: z.number().nullable().optional(),
  contact_id: z.number().nullable().optional(),
  type: z.nativeEnum(SalesType),
  currency_code: z.string().optional(),
  status: z.string().optional(),
  transaction_number: z.string().optional(),
  transaction_date: z.string().optional(),
  due_date: z.string().optional(),
  payment_method: z.string().optional(),
  billing_address: z.string().optional(),
  subtotal: z.number().optional(), //
  tax_rate: z.string().optional(),
  tax: z.number().optional(), //
  discount: z.number().min(0).optional(),
  discount_type: z.string().optional(),
  discount_value: z.number().optional(), //
  discount_price_cut: z.number().optional(), //
  dp: z.number().min(0).optional(),
  estimatedTime: z.string().optional(),
  isPreSigned: z.boolean().optional(),
  total: z.number().optional(), //
  memo: z.string().optional(),
  down_payment_amount: z.number().optional(),
  delivery: z.number().optional(),
  transaction_type: z.string().optional(),
  estimated_time: z.string().optional(),
  is_presigned: z.boolean().default(false),
  details: z.array(
    z.object({
      product_id: z.number().optional(),
      description: z.string().optional(),
      currency_code: z.string().optional(),
      unit_price: z.number().optional(),
      qty: z.number().optional(),
      amount: z.number().optional(),
    })
  ).optional(),
  contact_detail: {
    contact_id: z.string(),
    merchant_id: z.string(),
    display_name: z.string(),
    contact_type: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    email: z.string(),
    company_name: z.string(),
    phone_number: z.string(),
    billing_address: z.string(),
    delivery_address: z.string(),
    bank_name: z.string(),
    bank_holder: z.string(),
    bank_number: z.string(),
    memo: z.string(),
}, 
  invoices: z
  .array(
    z.object({
      namaBarang: z.string().optional(),
        desc: z.string().optional(),
        quantity: z.number().min(1).default(0),
        price: z.number().min(1).default(0),
      })
    )
    .optional(),
    
  });
  
  export const SaleDefaultValues: Partial<Sale> = {
    customer_id: null,
    name: "",
    company: "",
    email: "",
    address: "",
    telephone: 0,
    sale_id: 0,
    wallet_id: 0,
    merchant_id: 0,
    contact_id: 0,
    type: SalesType.penawaran,
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
  dp: 50,
  estimatedTime: "1 sampai 2 minggu",
  isPreSigned: true,
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
  contact_detail: {
    "contact_id": 1,
    "merchant_id": 1,
    "display_name": "dimas",
    "contact_type": "customer",
    "first_name": "Dimas",
    "last_name": "",
    "email": "",
    "company_name": "",
    "phone_number": "",
    "billing_address": "",
    "delivery_address": "",
    "bank_name": "",
    "bank_holder": "",
    "bank_number": "",
    "memo": ""
},
  invoices: [
    {
      namaBarang: "WIREMESH Conveyor",
      desc: "Wiremesh Conveyor Unit dengan ukuran",
      quantity: 1,
      price: 2000,
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
    invoiceNumber: numbering("Penawaran"),
  },
];
export type Sale = z.infer<typeof SaleSchema>;
