import { toast } from "@/components/ui/use-toast";
import { numberFixedToString } from "@/lib/utils";
import { ProfileFormValues } from "@/types/transaction-schema.d";

export async function getTransactions(
  merchant_id: String
): Promise<Array<ProfileFormValues>> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/transactions?merchantId=${merchant_id}`,
    {
      method: "GET",
    }
  )
    .then((res) => res.json())
    .then((data) => {
      const transactions: Array<ProfileFormValues> = data;
      return transactions;
    })
    .catch((e) => {
      throw new Error("Failed to fetch data", e);
    });
  return res;
}

export const payTransaction = async (transactionId: String) => {
  await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/transactions/${transactionId}/pay`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      redirect: "follow",
    }
  ).catch((e) => {
    throw new Error("Failed to paid sales", e);
  });
};
export const getTransaction = async (
  transaction_id: String
): Promise<ProfileFormValues> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/transactions/${transaction_id}`,
    {
      method: "GET",
    }
  )
    .then((res) => res.json())
    .then((data) => {
      const transaction: ProfileFormValues = data.data;
      return transaction;
    })
    .catch((e) => {
      throw new Error("Failed to fetch data", e);
    });
  return res;
};

export const deleteTransaction = async (transaction_id: number) => {
  fetch(`${process.env.NEXT_PUBLIC_URL}/api/transactions/${transaction_id}`, {
    method: "DELETE",
  }).catch((e) => {
    throw new Error("Failed to fetch data", e);
  });
};

export const createTransaction = async (
  data: ProfileFormValues,
  merchant_id: String
) => {
  data.merchant_id = Number(merchant_id);
  await fetch(`${process.env.NEXT_PUBLIC_URL}/api/transactions`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data, null, 2),
    redirect: "follow",
  }).catch((e) => {
    toast({
      title: "There was a problem with your request:",
      variant: "destructive",
      description: `${e}`,
    });
    throw new Error("Failed to fetch data", e);
  });
  toast({
    description: "Your transaction has been submitted.",
  });
};

export const updateTransaction = async (
  data: ProfileFormValues,
  merchant_id: String,
  transaction_id: String
) => {
  data.merchant_id = Number(merchant_id);

  await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/transactions/${transaction_id}`,
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data, null, 2),
      redirect: "follow",
    }
  ).catch((e) => {
    throw new Error("Failed to fetch data", e);
  });
};
