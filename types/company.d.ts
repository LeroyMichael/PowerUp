import { z } from "zod";

export enum CompanyTypeEnum {
  customer = "Customer",
  vendor = "Vendor",
  employee = "Employee",
  others = "Others",
}

export type Company = z.infer<typeof CompanySchema>;
export type Merchant = z.infer<typeof MerchantSchema>;

export const CompanySchema = z.object({
  label: z.string().required(),
  teams: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
    })
  ),
});

export const MerchantSchema = z.object({
  merchant_id: z.number().nullable().default(0),
  name: z.string().min(2, { message: "Display name is required" }),
  address: z.string().default("").optional(),
  province: z.string().default("").optional(),
  logo: z.string().default("").optional(),
  pic_number: z.string().optional().default(""),
  admin_id: z.number().nullable().default(0),
  created_at: z.string().optional(),
  role: z.string().default("").optional(),
  logo: z.string().optional(),
});
