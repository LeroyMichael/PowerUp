import { ProfitLoss, ProfitLossSummary } from "@/types/report";

export type TGetProfitLossParams = {
  merchant_id: number;
  start_date: string;
  end_date: string;
};
export async function getProfitLoss(filter: TGetProfitLossParams) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/reports/profit-loss?merchant_id=${filter.merchant_id}&start_date=${filter.start_date}&end_date=${filter.end_date}`,
    {
      method: "GET",
    }
  )
    .then((res) => res.json())
    .then((data) => {
      const profitloss: ProfitLoss = data.data;
      return profitloss;
    })
    .catch((e) => {
      throw new Error("Failed to fetch data", e);
    });
  return res;
}

export async function getProfitLossSummary(filter: TGetProfitLossParams) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/reports/profit-loss/summaries?merchant_id=${filter.merchant_id}&start_date=${filter.start_date}&end_date=${filter.end_date}`,
    {
      method: "GET",
    }
  )
    .then((res) => res.json())
    .then((data) => {
      const profitloss: Array<ProfitLossSummary> = data.data;
      return profitloss;
    })
    .catch((e) => {
      throw new Error("Failed to fetch data", e);
    });
  return res;
}

export async function getSummaries(filter: TGetProfitLossParams) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/reports/summaries?merchant_id=${filter.merchant_id}&start_date=${filter.start_date}&end_date=${filter.end_date}`,
    {
      method: "GET",
    }
  )
    .then((res) => res.json())
    .then((data) => {
      const summary = data.data[0];
      return summary;
    })
    .catch((e) => {
      throw new Error("Failed to fetch data", e);
    });
  return res;
}
