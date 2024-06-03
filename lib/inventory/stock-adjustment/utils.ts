import { formatDate, numberFixedToString, stringToDate } from "@/lib/utils";
import { StockAdjustment } from "@/types/stock-adjustment.d";
import moment from "moment";

export async function getStockAdjustments(
  merchant_id: String
): Promise<Array<StockAdjustment>> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/stock-adjustments?merchant_id=${merchant_id}`,
    {
      method: "GET",
    }
  )
    .then((res) => res.json())
    .then((data) => {
      const sas: Array<StockAdjustment> = data.data;
      return sas;
    })
    .catch((e) => {
      throw new Error("Failed to fetch data", e);
    });
  return res;
}

export const getStockAdjustment = async (
  sa_id: string
): Promise<StockAdjustment> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/stock-adjustments/${sa_id}`,
    {
      method: "GET",
    }
  )
    .then((res) => res.json())
    .then((data) => {
      let sa: StockAdjustment = data.data;
      sa.transaction_date = stringToDate(data.data.transaction_date);
      return sa;
    })
    .catch((e) => {
      throw new Error("Failed to fetch data", e);
    });
  return res;
};

export const createStockAdjustment = async (
  data: StockAdjustment,
  merchant_id: String
) => {
  let request: any = data;
  request.merchant_id = Number(merchant_id);
  request.transaction_date = formatDate(data.transaction_date);
  await fetch(`${process.env.NEXT_PUBLIC_URL}/api/stock-adjustments`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
    redirect: "follow",
  }).catch((e) => {
    throw new Error("Failed to fetch data", e);
  });
};

export const updateStockAdjustment = async (
  data: StockAdjustment,
  merchant_id: String,
  sa_id: String
) => {
  let request: any = data;
  request.merchant_id = Number(merchant_id);
  request.transaction_date = formatDate(data.transaction_date);

  await fetch(`${process.env.NEXT_PUBLIC_URL}/api/stock-adjustments/${sa_id}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
    redirect: "follow",
  }).catch((e) => {
    throw new Error("Failed to fetch data", e);
  });
};
