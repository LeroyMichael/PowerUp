import { Product } from "@/types/product";
import {
  Purchase,
  PurchaseDetailMutation,
  PurchaseMutation,
} from "@/types/purchase";
import { format, parse } from "date-fns";
import { numberFixedToString } from "../utils";
import { toast } from "@/components/ui/use-toast";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export function convertPurchaseMutation(
  purchaseData: Purchase
): PurchaseMutation {
  return {
    ...purchaseData,
    transaction_date: format(purchaseData.transaction_date, "dd-MM-yyyy"),
    due_date: format(purchaseData.due_date, "dd-MM-yyyy"),
    subtotal: numberFixedToString(purchaseData.subtotal),
    tax: numberFixedToString(purchaseData.tax),
    tax_rate: purchaseData.tax_rate.toString(),
    discount_value: purchaseData.discount_value,
    discount_price_cut: numberFixedToString(purchaseData.discount_price_cut),
    total: numberFixedToString(purchaseData.total),
    details: purchaseData.details.map((detail) => {
      return {
        ...detail,
        unit_price: numberFixedToString(detail.unit_price),
        amount: numberFixedToString(detail.amount),
      };
    }),
  };
}

export async function getPurchasesLists(
  merchant_id: number,
  currentPage: number,
  search?: string
) {
  const searchParams = search && `&search=${search}`;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/purchases?merchant_id=${merchant_id}&page=${currentPage}${searchParams}`,
    {
      method: "GET",
    }
  )
    .then((res) => res.json())
    .catch((e) => {
      throw new Error("Failed to fetch purchase lists", e);
    });

  return res;
}

export const getPurchaseById = async (
  purchase_id: String
): Promise<Purchase> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/purchases/${purchase_id}`,
    {
      method: "GET",
    }
  )
    .then((res) => res.json())
    .then((data) => {
      const purchase: any = convertPurchaseDataToFormData(data.data);

      return purchase;
    })
    .catch((e) => {
      throw new Error("Failed to fetch data", e);
    });
  return res;
};

export async function activatePurchase(purchase_id: number) {
  await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/purchases/${purchase_id}/activate`,
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

export async function payPurchase(purchase_id: number) {
  await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/purchases/${purchase_id}/pay`,
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

export async function deletePurchase(purchase_id: number) {
  await fetch(`${process.env.NEXT_PUBLIC_URL}/api/purchases/${purchase_id}`, {
    method: "DELETE",
    redirect: "follow",
  }).catch((e) => {
    throw new Error("Failed to delete purchase", e);
  });
}

export async function createPurchase(
  body: PurchaseMutation,
  router: any,
  withPay?: boolean
) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/purchases`, {
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
  if (response === null) return null;

  if (response.data.purchase_id && withPay) {
    await activatePurchase(response.data.purchase_id);
    await payPurchase(response.data.purchase_id);
  }
  toast({
    description: "Your purchase has been submitted.",
  });
  router.push("/purchases");
}

export async function updatePurchase(
  body: PurchaseMutation,
  router: AppRouterInstance,
  withPay?: boolean
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/purchases/${body.purchase_id}`,
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

  if (response.data.purchase_id && withPay) {
    await activatePurchase(response.data.purchase_id);
    await payPurchase(response.data.purchase_id);
  }
  toast({
    description: "Your purchase has been updated.",
  });
  router.push("/purchases");
}

export async function convertPurchaseDataToFormData(
  data: PurchaseMutation
): Promise<Purchase> {
  const dateFormat = "dd-MM-yyyy";
  return {
    purchase_id: data.purchase_id,
    merchant_id: data.merchant_id,
    wallet_id: data.wallet_id,
    contact_id: data.contact_id,
    currency_code: data.currency_code,
    discount_type: data.discount_type,
    discount_value: data.discount_value,
    discount_price_cut: Number(data.discount_price_cut),
    transaction_number: data.transaction_number,
    billing_address: data.billing_address,
    transaction_date: parse(data.transaction_date, dateFormat, new Date()),
    due_date: parse(data.due_date, dateFormat, new Date()),
    memo: data.memo,
    subtotal: Number(data.subtotal),
    total: Number(data.total),
    payment_method: data.payment_method,
    process_as_active: data.status === "ACTIVE",
    process_as_paid: data.payment_status === "PAID",
    tax: Number(data.tax),
    tax_rate: Number(data.tax_rate),
    details: data.details.map((detail: PurchaseDetailMutation) => {
      return {
        product_id: detail.product_id,
        unit_price: Number(detail.unit_price),
        currency_code: detail.currency_code,
        qty: detail.qty,
        amount: Number(detail.amount),
        description: detail.description,
      };
    }),
  };
}
