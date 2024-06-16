import { z } from "zod";

export enum ContactTypeEnum {
  customer = "Customer",
  vendor = "Vendor",
  employee = "Employee",
  others = "Others",
}

export type Contact = z.infer<typeof ContactSchema>;

export const ContactSchema = z.object({
  contact_id: z.number().default(0),
  merchant_id: z.number().default(0),
  // Contact Info
  display_name: z.string(),
  contact_type: z.nativeEnum(ContactTypeEnum),

  // General Info
  first_name: z.string(),
  last_name: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  company_name: z
    .string()
    .min(2, {
      message: "name must be at least 2 characters.",
    })
    .max(30, {
      message: "name must not be longer than 30 characters.",
    }),
  phone_number: z.string().optional(),

  billing_address: z.string().optional(),
  delivery_address: z.string().optional(),

  bank_name: z.string().optional(),
  bank_holder: z.string().optional(),
  bank_number: z.string().optional(),
  memo: z.string().optional(),
});

export const ContactDefaultValues: Partial<Contact> = {
  // Contact Info
  contact_type: "Customer",
};

export type Contact = z.infer<typeof ContactSchema>;
