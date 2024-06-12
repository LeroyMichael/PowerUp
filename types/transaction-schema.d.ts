import * as z from "zod";

export enum SalesType {
  proinvoice = "Pro Invoice",
  invoice = "Invoice",
  penawaran = "Penawaran",
}
export const profileFormSchema = z.object({
  merchant_id: z.number(),
  customer_id: z.number().nullable(),
  invoiceNumber: z
    .string()
    .min(2, {
      message: "name must be at least 2 characters.",
    })
    .max(30, {
      message: "name must not be longer than 30 characters.",
    }),
  name: z
    .string()
    .min(2, {
      message: "name must be at least 2 characters.",
    })
    .max(30, {
      message: "name must not be longer than 30 characters.",
    }),
  company: z
    .string()
    .min(2, {
      message: "name must be at least 2 characters.",
    })
    .max(30, {
      message: "name must not be longer than 30 characters.",
    }),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().optional(),
  telephone: z.number().optional(),
  invoices: z
    .array(
      z.object({
        namaBarang: z.string(),
        desc: z.string(),
        quantity: z.number().min(1),
        price: z.number().min(1),
      })
    )
    .optional(),
  discount: z.number().min(0).optional(),
  delivery: z.number().min(0).optional(),
  type: z.nativeEnum(SalesType, {
    required_error: "You need to select a file type.",
  }),
  subtotal: z.number().min(0).optional(),
  total: z.number().min(0).optional(),
  tax: z.number().min(0).optional(),
  dp: z.number().min(0).optional(),
  invoiceDate: z.string(),
  invoiceDueDate: z.string(),
  estimatedTime: z.string(),
  isPreSigned: z.boolean(),
  payment_status: z.string(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

const x =
{
  "wallet_id": 1,
  "merchant_id": 1,
  "contact_id": 1,
  "currency_code": "IDR",
  "status": "DRAFT",
  "transaction_number": "SL/100/100",
  "transaction_date": "12-05-2024",
  "due_date": "15-06-2024",
  "payment_method": "CASH",
  "billing_address": "ALamant Billing", 
  "subtotal": "10012.00",
  "tax_rate": "0",
  "tax": "0.00",
  "discount_type": null,
  "discount_value": "0",
  "discount_price_cut": "0.00",
  "total": "10012.00",
  "memo": "", 
  "down_payment_amount": "100.00", 
  "delivery": 0, 
  "transaction_type": "Penawaran",
  "estimated_time": "1 sampai 2 minggu",
  "is_presigned": false,
  "details": [
      {
          "product_id": 4,
          "description": "", 
          "currency_code": "IDR",
          "unit_price": "1000.00",
          "qty": 999,
          "amount": "10012.00"
      }
  ]
}