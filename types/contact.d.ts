import { nullable, z } from "zod";

export enum ContactTypeEnum {
  customer = "Customer",
  vendor = "Vendor",
  employee = "Employee",
  others = "Others",
}

export type Contact = z.infer<typeof ContactSchema>;

export const ContactSchema = z.object({
  contact_id: z.number().nullable().optional(),
  merchant_id: z.number().nullable().default(0),
  // Contact Info
  display_name: z.string().min(2, { message: "Display name is required" }),
  contact_type: z.nativeEnum(ContactTypeEnum),

  // General Info
  first_name: z.string().min(2, { message: "First name is required" }),
  last_name: z.string().default("").optional(),
  email: z.string().email().optional().or(z.literal("")).default(""),
  company_name: z
    .string()
    .min(2, {
      message: "name must be at least 2 characters.",
    })
    .max(200, {
      message: "name must not be longer than 200 characters.",
    }),
  phone_number: z.string().optional().default(""),

  billing_address: z.string().optional().default(""),
  delivery_address: z.string().optional().default(""),

  bank_name: z.string().optional().default(""),
  bank_holder: z.string().optional().default(""),
  bank_number: z.string().optional().default(""),
  memo: z.string().optional().default(""),
});

export const ContactDefaultValues: Partial<Contact> = {
  contact_id: 0,
  // Contact Info
  merchant_id: 0,
  contact_type: "Customer",
  last_name: "",
  email: "",
  phone_number: "",

  billing_address: "",
  delivery_address: "",

  bank_name: "",
  bank_holder: "",
  bank_number: "",
  memo: "",
};

export type Contact = z.infer<typeof ContactSchema>;
