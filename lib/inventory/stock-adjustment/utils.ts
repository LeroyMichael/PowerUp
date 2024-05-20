import { numberFixedToString } from "@/lib/utils";
import { StockAdjustment } from "@/types/stock-adjustment.d";

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
      const sa: StockAdjustment = data.data;
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
  data.merchant_id = Number(merchant_id);
  console.log(JSON.stringify(data));
  await fetch(`${process.env.NEXT_PUBLIC_URL}/api/stock-adjustments`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
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
  data.merchant_id = Number(merchant_id);

  await fetch(`${process.env.NEXT_PUBLIC_URL}/api/stock-adjustments/${sa_id}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    redirect: "follow",
  }).catch((e) => {
    throw new Error("Failed to fetch data", e);
  });
};
