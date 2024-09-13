import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  TGetProfitLossParams,
  getProfitLoss,
  getSummaries,
} from "@/lib/report/utils";
import { ProfitLoss, ProfitLossFilter, Summary } from "@/types/report";
import { format, lastDayOfMonth } from "date-fns";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { NumericFormat } from "react-number-format";

const Summaries = () => {
  const { data: session, status } = useSession();

  const [profitLoss, setProfitLoss] = useState<ProfitLoss>();
  const [summaries, setSummaries] = useState<Summary>();
  async function fetchProfitLoss() {
    if (session?.user.merchant_id) {
      const filter: TGetProfitLossParams = {
        merchant_id: Number(session?.user.merchant_id),
        start_date: format(new Date(), "01-MM-yyyy"),
        end_date: format(lastDayOfMonth(new Date()), "dd-MM-yyyy"),
      };
      const resp = await getProfitLoss(filter);
      const sum = await getSummaries(filter);
      setProfitLoss(resp);
      setSummaries(sum);
    }
  }

  useEffect(() => {
    fetchProfitLoss();
  }, [session?.user.merchant_id]);
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <NumericFormat
              value={Number(profitLoss?.net_income ?? 0).toFixed()}
              displayType={"text"}
              prefix={"Rp"}
              allowNegative={false}
              decimalSeparator={","}
              thousandSeparator={"."}
              fixedDecimalScale={true}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {/* +20.1% from last month */}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <NumericFormat
              value={Number(profitLoss?.total_primary_income ?? 0).toFixed()}
              displayType={"text"}
              prefix={"Rp"}
              allowNegative={false}
              decimalSeparator={","}
              thousandSeparator={"."}
              fixedDecimalScale={true}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {/* +20.1% from last month */}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expense</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <NumericFormat
              value={(
                Number(profitLoss?.total_operational_expenses ?? 0) +
                Number(profitLoss?.total_cost_of_sales ?? 0)
              ).toFixed()}
              displayType={"text"}
              prefix={"Rp"}
              allowNegative={false}
              decimalSeparator={","}
              thousandSeparator={"."}
              fixedDecimalScale={true}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {/* +20.1% from last month */}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Unpaid Sales
          </CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <NumericFormat
              value={Number(summaries?.unpaid_sales ?? 0).toFixed()}
              displayType={"text"}
              prefix={"Rp"}
              allowNegative={false}
              decimalSeparator={","}
              thousandSeparator={"."}
              fixedDecimalScale={true}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {/* +20.1% from last month */}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Summaries;
