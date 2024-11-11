import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  TGetProfitLossParams,
  getProfitLoss,
  getSummaries,
} from "@/lib/report/utils";
import { ProfitLoss, ProfitLossFilter, Summary } from "@/types/report";
import { format, lastDayOfMonth, setDate, setMonth } from "date-fns";
import { id } from "date-fns/locale";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { NumericFormat } from "react-number-format";

type TProps = {
  month: string;
};
const Summaries = ({ month }: TProps) => {
  const { data: session, status } = useSession();

  const [profitLoss, setProfitLoss] = useState<ProfitLoss>();
  const [summaries, setSummaries] = useState<Summary>();
  async function fetchProfitLoss() {
    if (session?.user.merchant_id && month) {
      let date = new Date();
      date = setMonth(date, Number(month) - 1);
      const filter: TGetProfitLossParams = {
        merchant_id: Number(session?.user.merchant_id),
        start_date: format(date, `01-${month.padStart(2, "0")}-yyyy`, {
          locale: id,
        }),
        end_date: format(
          lastDayOfMonth(date),
          `dd-${month.padStart(2, "0")}-yyyy`
        ),
      };
      const resp = await getProfitLoss(filter);
      const sum = await getSummaries(filter);
      setProfitLoss(resp);
      setSummaries(sum);
    }
  }

  useEffect(() => {
    session?.user.merchant_id && fetchProfitLoss();
  }, [session?.user.merchant_id, month]);
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
              value={Number(profitLoss?.gross_profits ?? 0).toFixed()}
              displayType={"text"}
              prefix={"Rp"}
              allowNegative={false}
              decimalSeparator={","}
              thousandSeparator={"."}
              fixedDecimalScale={true}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            -+
            <NumericFormat
              value={Number(summaries?.estimated_revenue ?? 0).toFixed()}
              displayType={"text"}
              prefix={"Rp"}
              allowNegative={false}
              decimalSeparator={","}
              thousandSeparator={"."}
              fixedDecimalScale={true}
            />{" "}
            Estimated Revenue
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
          <p className="text-xs text-muted-foreground"></p>
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
