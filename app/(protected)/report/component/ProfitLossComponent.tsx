"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getProfitLoss, TGetProfitLossParams } from "@/lib/report/utils";
import { rupiah } from "@/lib/utils";
import { ProfitLoss } from "@/types/report";
import { Copy, CreditCard, File } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

const ProfitLossComponent = () => {
  const { data: session, status } = useSession();

  const [profitLoss, setProfitLoss] = useState<ProfitLoss>();

  async function fetchProfitLoss() {
    if (session?.user.merchant_id) {
      const filter: TGetProfitLossParams = {
        merchant_id: Number(session?.user.merchant_id),
        start_date: "01-07-2024",
        end_date: "01-09-2024",
      };
      const resp = await getProfitLoss(filter);
      setProfitLoss(resp);
    }
  }

  useEffect(() => {
    fetchProfitLoss();
  }, [session?.user.merchant_id]);

  return (
    <div>
      <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
        <CardHeader className="flex flex-row items-start bg-muted/50">
          <div className="grid gap-0.5">
            <CardTitle className="group flex items-center gap-2 text-lg">
              Profit & Loss
              <Button
                size="icon"
                variant="outline"
                className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <Copy className="h-3 w-3" />
                <span className="sr-only">Copy Order ID</span>
              </Button>
            </CardTitle>
            <div>
              Date:
              <div className="flex">
                <CardDescription>November 23, 2023</CardDescription>-
                <CardDescription>November 23, 2023</CardDescription>
              </div>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <Button size="sm" variant="outline" className="h-7 gap-1 text-sm">
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only">Export</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6 text-sm">
          <div className="grid gap-3">
            <div className="font-semibold">Primary Income</div>
            <ul className="grid gap-3">
              {profitLoss?.primary_income.map((income: any) => {
                return (
                  <li
                    className="flex items-center justify-between"
                    key={income.account_code + income.account_name}
                  >
                    <span className="text-muted-foreground">
                      {income.account_code} <span>{income.account_name}</span>
                    </span>
                    <span>{rupiah(income.total)}</span>
                  </li>
                );
              })}
              <li className="flex items-center justify-between font-semibold">
                <span className="text-muted-foreground">
                  Total Primary Income
                </span>
                <span>{rupiah(profitLoss?.total_primary_income)}</span>
              </li>
            </ul>
            <Separator className="my-2" />

            <div className="font-semibold">Cost of Sales</div>
            <ul className="grid gap-3">
              {profitLoss?.cost_of_sales.map((income: any) => {
                return (
                  <li
                    className="flex items-center justify-between"
                    key={income.account_code + income.account_name}
                  >
                    <span className="text-muted-foreground">
                      {income.account_code} <span>{income.account_name}</span>
                    </span>
                    <span>{rupiah(income.total)}</span>
                  </li>
                );
              })}
              <li className="flex items-center justify-between font-semibold">
                <span className="text-muted-foreground">
                  Total Cost of Sales
                </span>
                <span>{rupiah(profitLoss?.total_cost_of_sales)}</span>
              </li>
            </ul>
            <Separator className="my-2" />
            <div className="font-semibold">Operational Expense</div>
            <ul className="grid gap-3">
              {profitLoss?.operational_expense.map((income: any) => {
                return (
                  <li
                    className="flex items-center justify-between"
                    key={income.account_code + income.account_name}
                  >
                    <span className="text-muted-foreground">
                      {income.account_code} <span>{income.account_name}</span>
                    </span>
                    <span>{rupiah(income.total)}</span>
                  </li>
                );
              })}
              <li className="flex items-center justify-between font-semibold">
                <span className="text-muted-foreground">
                  Total Operational Expense
                </span>
                <span>{rupiah(profitLoss?.total_operational_expenses)}</span>
              </li>
            </ul>
            <Separator className="my-2" />
            <ul className="grid gap-3">
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Gross Profit</span>
                <span>{rupiah(profitLoss?.gross_profits)}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Operational Expense
                </span>
                <span>-{rupiah(profitLoss?.total_operational_expenses)}</span>
              </li>
              <li className="flex items-center justify-between font-semibold">
                <span className="text-muted-foreground">Net Income</span>
                <span>{rupiah(profitLoss?.net_income)}</span>
              </li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
          <div className="text-xs text-muted-foreground">
            Updated <time dateTime="2023-11-23">November 23, 2023</time>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProfitLossComponent;
