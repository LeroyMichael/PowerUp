import { z } from "zod";

export type Wallet = z.infer<typeof WalletSchema>;
export type WalletTransaction = z.infer<typeof WalletTransactionSchema>;
export type WalletTransfer = z.infer<typeof WalletTransferSchema>;

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
    account_number: z
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

export const WalletTransactionSchema = z.object({
  wallet_transaction_id: z.number(),
  wallet_id: z.number().nullable(),
  transaction_type: z.string(),
  currency_code: z.string(),
  amount: z.number().min(0).optional(),
  process_label: z.string().optional(),
  created_at: z.coerce.date(),
});

export const WalletTransferSchema = z.object({
  from_wallet_id: z.number(),
  from_wallet_name: z.string().optional(),
  to_wallet_id: z.number(),
  to_wallet_name: z.string().optional(),
  amount: z.number().min(1),
});
export const WalletTransferDefaultValues: Partial<WalletTransfer> = {
  from_wallet_id: 0,
  to_wallet_id: 0,
  amount: 0,
};
export const WalletDefaultValues: Partial<Wallet> = {
  wallet_id: 0,
  merchant_id: 0,
  wallet_name: "",
  currency_code: "IDR",
  balance: 0,
  bank_info: {
    account_number: "",
    bank_name: "",
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
