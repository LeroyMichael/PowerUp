import z from "zod"
import { ContactSchema } from "./contact.d.ts"

export type ExpensesFormDataType = z.infer<typeof expensesFormData>

export type ExpenseMutationSchema = z.infer<typeof expenseMutationSchema>

export type ExpenseListSchema = z.infer<typeof expenseListSchema>

export type ExpenseListDetailsSchema = z.infer<typeof expenseListDetailSchema>

export const expensesDetailFormData = z.object({
    account_code: z.string(),
    description: z.string(),
    currency_code: z.string(),
    amount: z.number().min(1)
})

export const expensesFormData = z.object({
    expense_id: z.number().optional(),
    merchant_id: z.number(),
    wallet_id: z.number(),
    contact_id: z.number(),
    contact_name: ContactSchema.optional(),
    currency_code: z.string(),
    transaction_number: z.string(),
    transaction_date: z.date(),
    payment_method: z.string(),
    billing_address: z.string(),
    subtotal: z.number().min(0),
    tax_rate: z.number().min(0),
    tax: z.number().min(0),
    total: z.number().min(0),
    process_as_active: z.boolean(),
    process_as_paid: z.boolean(),
    details: z.array(expensesDetailFormData)
})


export const ExpensesDefaultValues: Partial<ExpensesFormDataType> = {
    expense_id: 0,
    merchant_id: 0,
    wallet_id: null,
    contact_id: null,
    currency_code: "IDR",
    transaction_number: "",
    transaction_date: new Date(),
    payment_method: "CASH",
    billing_address: "",
    subtotal: 0,
    tax_rate: 0,
    tax: 0,
    total: 0,
    process_as_active: false,
    process_as_paid: false,
    details: [
        {
            expense_detail_id: 0,
            account_code: "1020-inventory",
            description: "",
            currency_code: "IDR",
            amount: 0
        }
    ]
}

export const expenseDetailMutationSchema = z.object({
    account_code: z.string(),
    description: z.string(),
    currency_code: z.string(),
    amount: z.string()
})

export const expenseMutationSchema = z.object({
    expense_id: z.number().optional(),
    merchant_id: z.number(),
    wallet_id: z.number(),
    contact_id: z.number(),
    currency_code: z.string(),
    transaction_number: z.string(),
    transaction_date: z.string(),
    payment_method: z.string(),
    billing_address: z.string(),
    subtotal: z.string(),
    tax_rate: z.number().min(0),
    tax: z.string(),
    total: z.string(),
    process_as_active: z.boolean(),
    process_as_paid: z.boolean(),
    details: z.array(expenseDetailMutationSchema),
    created_at: z.string(),
})

// ========================List Page============================

export const expenseListDetailSchema = z.object({
    account_code: z.string(),
    description: z.string(),
    currency_code: z.string(),
    amount: z.number(),
    expense_detail_id: z.number()
})

export const expenseListSchema = z.object({
    expense_id: z.number(),
    merchant_id: z.number(),
    wallet_id: z.number(),
    contact_id: z.number(),
    contact_name: ContactSchema,
    currency_code: z.string(),
    transaction_number: z.string(),
    transaction_date: z.string(),
    payment_method: z.string(),
    billing_address: z.string(),
    subtotal: z.number().min(0),
    tax_rate: z.number().min(0),
    tax: z.number().min(0),
    total: z.number().min(0),
    status: z.string(),
    payment_status: z.string(),
    details: z.array(expenseListDetailSchema)
})