import { z } from "zod";

export type Wallet = z.infer<typeof WalletSchema>;

export const WalletSchema = z.object({
  bank_id: z.number(),
  merchant_id: z.number().nullable(),
  bank_num: z
    .string()
    .min(2, {
      message: "bank number must be at least 2 characters.",
    })
    .max(10, {
      message: "bank number must not be longer than 10 characters.",
    }),
  wallet_name: z
    .string()
    .min(2, {
      message: "name must be at least 2 characters.",
    })
    .max(30, {
      message: "name must not be longer than 30 characters.",
    }),
  bank_name: z
    .string()
    .min(2, {
      message: "name must be at least 2 characters.",
    })
    .max(30, {
      message: "name must not be longer than 30 characters.",
    }),
  description: z.string().optional(),
  statement_balance: z.number().min(0).optional(),
  current_balance: z.number().min(0).optional(),
});
export const WalletDefaultValues: Partial<Wallet> = {
  bank_id: 0,
  merchant_id: 0,
  bank_name: "",
  wallet_name: "",
  bank_num: "",
  current_balance: 0,
  description: "",
  statement_balance: 0,
};
