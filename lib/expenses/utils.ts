import { ExpenseMutationSchema, ExpensesDataType } from "@/types/expenses"

import {parse} from "date-fns"

export type TGetExpensesListsParams = {
    search: string,
    page: number
}

export async function getExpensesLists(merchant_id: number, filter: TGetExpensesListsParams){
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/expenses?merchant_id=${merchant_id}&page=${filter.page}&search=${filter.search}`,
    {
        method: "GET"
    })
    .then((res) => res.json())
    .catch((e) => {
        throw new Error("Failed to fetch expenses lists", e)
    })

    return res
}

export async function activateExpense(expense_id: number) {
    await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/expenses/${expense_id}/activate`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
        redirect: "follow",
      }
    ).catch((e) => {
      throw new Error("Failed to activate purchase", e);
    });
  }

export async function payExpense(expense_id: number) {
    await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/expenses/${expense_id}/pay`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
        redirect: "follow",
      }
    ).catch((e) => {
      throw new Error("Failed to pay purchase", e);
    });
  }
  
  export async function deleteExpense(expense_id: number) {
    await fetch(`${process.env.NEXT_PUBLIC_URL}/api/expenses/${expense_id}`, {
      method: "DELETE",
      redirect: "follow",
    }).catch((e) => {
      throw new Error("Failed to delete purchase", e);
    });
  }

export async function convertIncomingDataToFormData(data: ExpenseMutationSchema ): Promise<ExpensesDataType> {
    
    const dateFormat = "dd-MM-yyyy";
    
    return (
        {
        ...data,
        transaction_date: parse(data.transaction_date, dateFormat, new Date()),
        payment_method: data.payment_method,
        billing_address: data.billing_address,
        subtotal: Number(data.subtotal),
        tax_rate: data.tax_rate,
        tax: Number(data.tax),
        total: Number(data.total),
        process_as_active: data.status === "ACTIVE",
        process_as_paid: data.payment_status === "PAID",
        details: [
            {
                expense_detail_id: data.expense_detail_id,
                account_code: data.account_code,
                description: data.description,
                currency_code: data.currency_code,
                amount: data.amount
            }
        ]}
    )
}