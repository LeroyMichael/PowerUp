import z from "zod";

export type Purchase = z.infer<typeof PurchaseSchema>;

export const PurchaseSchema = z.object({
  purchase_id: z.number(),
  merchant_id: z.number().nullable(),
  wallet_id: z.number().nullable(),
  vendor_id: z.number().nullable(),
  contact_id: z.number().min(0),
  witholding_total: z.number().min(0).optional(),
  transactionNum: z
    .string()
    .min(2, {
      message: "transaction number must be at least 2 characters.",
    })
    .max(10, {
      message: "transaction number must not be longer than 10 characters.",
    }),
  vendorRefNum: z
    .string()
    .min(2, {
      message: "vendor number must be at least 2 characters.",
    })
    .max(10, {
      message: "vendor number must not be longer than 10 characters.",
    }),
  vendorName: z
    .string()
    .min(2, {
      message: "name must be at least 2 characters.",
    })
    .max(30, {
      message: "name must not be longer than 30 characters.",
    }),
  bankName: z
    .string()
    .min(2, {
      message: "name must be at least 2 characters.",
    })
    .max(30, {
      message: "name must not be longer than 30 characters.",
    }),
  email: z.string().email().optional().or(z.literal("")),
  message: z.string().optional(),
  billingAddress: z.string().optional(),
  transactionDate: z.date(),
  dueDate: z.date().optional(),
  memo: z.string().optional(),
  subTotal: z.number().min(0).optional(),
  totalPrice: z.number().min(0).optional(),
  balanceDue: z.number().min(0).optional(),
  status: z.string(),
});

export const PurchaseDefaultValues: Partial<PurchaseSchema> = {
  purchase_id: 0,
  merchant_id: 0,
  bank_name: "",
  transaction_num: "",
  vendor_name: "",
  Total_price: 0,
  message: "",
  balance_due: 0,
};
