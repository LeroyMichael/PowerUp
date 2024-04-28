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
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
