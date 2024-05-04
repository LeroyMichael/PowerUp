import { z } from "zod";

export enum CompanyTypeEnum {
  customer = "Customer",
  vendor = "Vendor",
  employee = "Employee",
  others = "Others",
}

export type Company = z.infer<typeof CompanySchema>;

export const CompanySchema = z.object({
  label: z.string().required(),
  teams: z.array(
    z.object({
      label: z.string().required(),
      value: z.string().required(),
    })
  ),
});
