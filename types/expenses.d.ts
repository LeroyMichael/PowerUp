import { z } from "zod"

export type ExpensesDataType = z.infer<typeof expensesData>

export type ExpenseMutationSchema = z.infer<typeof expenseMutationSchema>

const expensesDetailData = z.object({
    account_code: z.string(),
    description: z.string(),
    currency_code: z.string(),
    amount: z.number()
})

const expensesData = z.object({
    wallet_id: 1,
    merchant_id: 1,
    contact_id: 1,
    currency_code: "IDR",
    transaction_number: z.string(),
    transaction_date: z.string(),
    payment_method: z.string(),
    billing_address: z.string(),
    subtotal: z.number().min(0),
    tax_rate: z.number().min(0),
    tax: z.number().min(0),
    total: z.number().min(0),
    process_as_active: false,
    process_as_paid: false,
    details: z.array(expensesDetailDataType)
})


export const ExpensesDefaultValues: Partial<ExpensesDataType> = {
    wallet_id: 1,
    merchant_id: 1,
    contact_id: 1,
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
            account_code: "",
            description: "",
            currency_code: "IDR",
            amount: 0
        }
    ]
}


export const expenseMutationSchema = ExpensesData.and({
    transaction_date: z.string(),
    subtotal: z.string(),
    tax_rate: z.number().min(0),
    tax: z.string(),
    total: z.string(),
    created_at: z.string(),
    details: z.array(ExpensesDetailData)
})