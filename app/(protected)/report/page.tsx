"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ProfitLossComponent from "./component/ProfitLossComponent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SalesList from "../sales/components/sales-list";
import PurchasesList from "../purchases/components/purchases-list";
import ExpensesList from "../expenses/components/expenses-list";
import { DatePickerWithRange } from "@/app/(protected)/report/component/date-range-picker";
import { FormProvider, useForm } from "react-hook-form";
import {
  ProfitLossFilter,
  ProfitLossFilterDefaultValues,
  ProfitLossFilterSchema,
  ProfitLossSummary,
} from "@/types/report.d";
import { zodResolver } from "@hookform/resolvers/zod";
import { getProfitLossSummary, TGetProfitLossParams } from "@/lib/report/utils";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { rupiah } from "@/lib/utils";

export default function ReportPage() {
  const { data: session, status } = useSession();
  const methods = useForm<ProfitLossFilter>({
    resolver: zodResolver(ProfitLossFilterSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: ProfitLossFilterDefaultValues,
  });
  const [profitLossSummary, setProfitLossSummary] =
    useState<Array<ProfitLossSummary>>();
  async function fetchProfitLossSummary() {
    if (session?.user.merchant_id) {
      const filter: TGetProfitLossParams = {
        merchant_id: Number(session?.user.merchant_id),
        start_date: format(methods.getValues("from"), "dd-MM-yyyy"),
        end_date: format(methods.getValues("to"), "dd-MM-yyyy"),
      };
      const resp = await getProfitLossSummary(filter);
      setProfitLossSummary(resp);
    }
  }

  useEffect(() => {
    fetchProfitLossSummary();
  }, [session?.user.merchant_id]);
  return (
    <FormProvider {...methods}>
      <div className="flex min-h-screen w-full flex-col">
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
            <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
              {/* <div className="grid gap-4 grid-cols-2">
                <Card x-chunk="dashboard-05">
                  <CardHeader className="pb-2">
                    <CardDescription>This Week</CardDescription>
                    <CardTitle className="text-4xl">$1,329</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-muted-foreground">
                      +25% from last week
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Progress value={25} aria-label="25% increase" /> 
                  </CardFooter>
                </Card>
                <Card x-chunk="dashboard-05">
                  <CardHeader className="pb-2">
                    <CardDescription>This Month</CardDescription>
                    <CardTitle className="text-4xl">
                      {rupiah(
                        profitLossSummary?.find(
                          (pl) => pl.month === new Date().getMonth()
                        )?.net_income ?? 0
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-muted-foreground">
                      +10% from last month
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Progress value={12} aria-label="12% increase" /> 
                  </CardFooter>
                </Card> 
              </div> */}
              <Tabs defaultValue="sale">
                <div className="flex items-center">
                  <TabsList>
                    <TabsTrigger value="sale">Sales</TabsTrigger>
                    <TabsTrigger value="purchase">Purchases</TabsTrigger>
                    <TabsTrigger value="expense">Expenses</TabsTrigger>
                  </TabsList>
                  <div className="ml-auto flex items-center gap-2">
                    <DatePickerWithRange />
                  </div>
                </div>
                <TabsContent value="sale">
                  <Card x-chunk="dashboard-05-chunk-3">
                    <CardHeader className="px-7">
                      <CardTitle>Sales Orders</CardTitle>
                      <CardDescription>Recent orders.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <SalesList />
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="purchase">
                  <Card x-chunk="dashboard-05-chunk-3">
                    <CardHeader className="px-7">
                      <CardTitle>Purchases Orders</CardTitle>
                      <CardDescription>Recent orders.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <PurchasesList />
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="expense">
                  <Card x-chunk="dashboard-05-chunk-3">
                    <CardHeader className="px-7">
                      <CardTitle>Expenses Orders</CardTitle>
                      <CardDescription>Recent orders.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ExpensesList />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            <div>
              <ProfitLossComponent />
            </div>
          </main>
        </div>
      </div>
    </FormProvider>
  );
}
