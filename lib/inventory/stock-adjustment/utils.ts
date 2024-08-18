import { toast } from "@/components/ui/use-toast";
import { formatDate, numberFixedToString, stringToDate } from "@/lib/utils";
import { StockAdjustment } from "@/types/stock-adjustment.d";

type TFilterProps = {
  search: string;
  page: number;
  perPage: number;
};

type TGetStockAdjustmentParams = {
  merchant_id: number;
  filter: TFilterProps;
};

export async function getStockAdjustments({
  merchant_id,
  filter,
}: TGetStockAdjustmentParams) {
  const filterParams = `search=${filter.search}&page=${filter.page}&perPage=${filter.perPage}`;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/stock-adjustments?merchant_id=${merchant_id}&${filterParams}`,
    {
      method: "GET",
    }
  )
    .then((res) => res.json())
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
    .then(async (data) => {
      let sa: StockAdjustment = data.data;
      sa.transaction_date = stringToDate(data.data.transaction_date);
      sa.details.map((e) => {
        console.log(e);
        return {
          ...e,
          buy_price: Number(e.post_buy_price),
          pre_avg: Number(e.pre_avg),
          post_avg: Number(e.post_avg),
          pre_buy_price: Number(e.pre_buy_price),
          post_buy_price: Number(e.post_buy_price),
        };
      });
      return sa;
    })
    .catch((e) => {
      throw new Error("Failed to fetch data", e);
    });
  return res;
};

const convertStockAdjustmentSchema = (
  data: StockAdjustment,
  merchant_id: string
) => {
  const modData = {
    ...data,
    merchant_id: Number(merchant_id),
    transaction_date: formatDate(data.transaction_date),
    details: data.details.map((detail) => {
      return {
        ...detail,
        difference: Number(detail.difference),
        buy_price: numberFixedToString(detail.buy_price),
      };
    }),
  };

  return modData;
};

export const createStockAdjustment = async (
  data: StockAdjustment,
  merchant_id: string,
  router: any
) => {
  let request: any = convertStockAdjustmentSchema(data, merchant_id);
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/stock-adjustments`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
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
  toast({
    description: "Your stock adjustment has been submitted.",
  });
  router.push("/inventory");
};

export const updateStockAdjustment = async (
  data: StockAdjustment,
  merchant_id: string,
  sa_id: String,
  router: any
) => {
  let request: any = convertStockAdjustmentSchema(data, merchant_id);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/stock-adjustments/${sa_id}`,
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
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
  toast({
    description: "Your stock adjustment has been updated.",
  });
  router.push("/inventory");
};
