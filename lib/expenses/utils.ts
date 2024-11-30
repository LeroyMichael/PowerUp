import { toast } from "@/components/ui/use-toast";
import {
  ExpenseListSchema,
  ExpenseMutationSchema,
  ExpensesFormDataType,
} from "@/types/expenses";

import { format, parse } from "date-fns";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { numberFixedToString } from "../utils";

export type TGetExpensesListsParams = {
  search: string;
  page: number;
};

export async function getExpensesLists(
  merchant_id: number,
  filter: TGetExpensesListsParams
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/expenses?merchant_id=${merchant_id}&page=${filter.page}&search=${filter.search}`,
    {
      method: "GET",
    }
  )
    .then((res) => res.json())
    .catch((e) => {
      throw new Error("Failed to fetch expenses lists", e);
    });

  return res;
}

export const getExpensesById = async (
  expense_id: String
): Promise<ExpensesFormDataType> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/expenses/${expense_id}`,
    {
      method: "GET",
    }
  )
    .then((res) => res.json())
    .then((data) => {
      const expense = convertIncomingDataToFormData(data.data);
      return expense;
    })
    .catch((e) => {
      throw new Error("Failed to fetch data", e);
    });

  return res;
};

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
  await fetch(`${process.env.NEXT_PUBLIC_URL}/api/expenses/${expense_id}/pay`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
    redirect: "follow",
  }).catch((e) => {
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

export default function convertExpenseFormToMutation(
  formData: ExpensesFormDataType
): ExpenseMutationSchema {
  return {
    ...formData,
    contact_id: Number(formData.contact_id),
    transaction_date: format(formData.transaction_date, "dd-MM-yyyy"),
    subtotal: numberFixedToString(formData.subtotal),
    tax: numberFixedToString(formData.tax),
    total: numberFixedToString(formData.total),
    created_at: format(new Date(), "dd-MM-yyyy"),
    details: formData.details.map((detail) => {
      return {
        ...detail,
        amount: detail.amount,
      };
    }),
  };
}

export async function convertIncomingDataToFormData(
  data: ExpenseListSchema
): Promise<ExpensesFormDataType> {
  const dateFormat = "dd-MM-yyyy";

  return {
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
    details: data.details.map((detail) => {
      return {
        account_code: detail.account_code,
        amount: String(detail.amount),
        currency_code: detail.currency_code,
        description: detail.description,
      };
    }),
  };
}

export async function createExpense(
  body: ExpenseMutationSchema,
  router: AppRouterInstance,
  withPay?: boolean
) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/expenses`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    redirect: "follow",
  })
    .then((res) => {
      if (!res.ok) {
        return res.text().then((text) => {
          throw new Error(text);
        });
      } else {
        return res.json();
      }
    })
    .catch((err: Error) => {
      toast({
        title: `Error: ${JSON.parse(err.message).message}`,
        description: `${JSON.stringify(JSON.parse(err.message).errors)}`,
      });
      return null;
    });

  console.log("response,", response, withPay);
  if (response === null) return null;

  if (response.data.expense_id && withPay) {
    await activateExpense(response.data.expense_id).then(async () => {
      await payExpense(response.data.expense_id);
    });
  }
  toast({
    description: "Your purchase has been submitted.",
  });
  router.push("/expenses");
}

export async function updateExpenses(
  body: ExpenseMutationSchema,
  router: AppRouterInstance,
  withPay?: boolean
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/expenses/${body.expense_id}`,
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      redirect: "follow",
    }
  )
    .then((res) => {
      if (!res.ok) {
        return res.text().then((text) => {
          throw new Error(text);
        });
      } else {
        return res.json();
      }
    })
    .catch((err: Error) => {
      toast({
        title: `Error: ${JSON.parse(err.message).message}`,
        description: `${JSON.stringify(JSON.parse(err.message).errors)}`,
      });
      return null;
    });
  if (response === null) return null;

  if (response.data.expense_id && withPay) {
    await activateExpense(response.data.expense_id);
    await payExpense(response.data.expense_id);
  }
  toast({
    description: "Your purchase has been updated.",
  });
  router.push("/expenses");
}
