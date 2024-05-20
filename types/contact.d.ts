import { z } from "zod";

export enum ContactTypeEnum {
  customer = "Customer",
  vendor = "Vendor",
  employee = "Employee",
  others = "Others",
}

export type Contact = z.infer<typeof ContactSchema>;

export const ContactSchema = z.object({
  contactId: z.number().default(0).required(),
  // Contact Info
  displayName: z.string().required(),
  contactType: z.nativeEnum(ContactTypeEnum).required(),

  // General Info
  firstName: z.string().required(),
  lastName: z.string(),
  email: z.string().email().optional().or(z.literal("")),
  companyName: z
    .string()
    .min(2, {
      message: "name must be at least 2 characters.",
    })
    .max(30, {
      message: "name must not be longer than 30 characters.",
    }),
  telephone: z.string().optional(),

  billingAddress: z.string().optional(),
  deliveryAddress: z.string().optional(),
  otherInfo: z.string().optional(),

  // Bank Info
  bankAccounts: z.array(
    z.object({
      bankName: z.string().optional(),
      accountNumber: z.string().optional(),
    })
  ),
});
