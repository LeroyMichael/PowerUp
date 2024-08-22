import { nullable, z } from "zod";

export type Account = z.infer<typeof AccountSchema>;

export const AccountSchema = z.object({
  merchant_id: z.number(),
  account_code: z.string(),
  account_name: z.string(),
  category_label: z.string(),
});
