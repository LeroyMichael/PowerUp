import { z } from "zod";

export type Wallet = z.infer<typeof WalletSchema>;

export const WalletSchema = z.object({
  wallet_id: z.number(),
  merchant_id: z.number().nullable(),
  wallet_name: z
    .string()
    .min(2, {
      message: "name must be at least 2 characters.",
    })
    .max(30, {
      message: "name must not be longer than 30 characters.",
    }),
  currency_code: z.string(),
  balance: z.number().min(0).optional(),
  bank_info: z.object({
    bank_num: z
      .string()
      .min(2, {
        message: "bank number must be at least 2 characters.",
      })
      .max(10, {
        message: "bank number must not be longer than 10 characters.",
      }),
    bank_name: z
      .string()
      .min(2, {
        message: "name must be at least 2 characters.",
      })
      .max(30, {
        message: "name must not be longer than 30 characters.",
      }),
  }),
  description: z.string().optional(),
});
export const WalletDefaultValues: Partial<Wallet> = {
  wallet_id: 0,
  merchant_id: 0,
  wallet_name: "",
  currency_code: "IDR",
  balance: 0,
  bank_info: {
    bank_name: "",
    bank_num: "",
  },
  description: "",
};

export const DummyWallets: Array<Wallet> = [
  {
    wallet_id: 1,
    merchant_id: 1,
    wallet_name: "Spending Wallet 1",
    currency_code: "IDR",
    balance: 200000,
    bank_info: {
      bank_name: "BCA",
      account_number: "0123",
    },
    description: "Tanggerang Branch",
  },
  {
    wallet_id: 2,
    merchant_id: 1,
    wallet_name: "Spending Wallet 2",
    currency_code: "IDR",
    balance: 200000,
    bank_info: {
      bank_name: "BCA",
      account_number: "0123",
    },
    description: "Jakarta Branch",
  },
];
