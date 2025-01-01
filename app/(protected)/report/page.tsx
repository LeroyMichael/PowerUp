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
  JournalEntry,
  ProfitLossFilter,
  ProfitLossFilterDefaultValues,
  ProfitLossFilterSchema,
  ProfitLossSummary,
} from "@/types/report.d";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  getJournalEntries,
  getProfitLossSummary,
  TGetProfitLossParams,
} from "@/lib/report/utils";
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
  const [journalEntrySummary, setJournalEntrySummary] =
    useState<Array<JournalEntry>>();
  async function fetchJournalEntries() {
    if (session?.user.merchant_id) {
      const filter: TGetProfitLossParams = {
        merchant_id: Number(session?.user.merchant_id),
        start_date: format(methods.getValues("from"), "dd-MM-yyyy"),
        end_date: format(methods.getValues("to"), "dd-MM-yyyy"),
      };
      const resp = await getJournalEntries(filter);
      setJournalEntrySummary(resp);
    }
  }

  useEffect(() => {
    fetchJournalEntries();
  }, [session?.user.merchant_id]);
  return (
    <div className="flex flex-col space-y-8 lg:flex-row ">
      <FormProvider {...methods}>
        <div className="flex min-h-screen  flex-col">
          <div className="flex flex-col sm:gap-4">
            <div className="flex-1 items-start gap-4 flex-row md:flex">
              <div className="grid gap-4  mb-4 ">
                <div className="w-full overflow-x-hidden">
                  {JSON.stringify(journalEntrySummary)}
                  <Tabs defaultValue="sale" className="relative">
                    <div className="flex items-center">
                      <TabsList>
                        <TabsTrigger value="sale">Sales</TabsTrigger>
                        <TabsTrigger value="purchase">Purchases</TabsTrigger>
                        <TabsTrigger value="expense">Expenses</TabsTrigger>
                      </TabsList>
                      <div className="ml-auto flex items-center gap-2">
                        {/* <DatePickerWithRange /> */}
                      </div>
                    </div>
                    <TabsContent value="sale" className="w-full">
                      <Card x-chunk="dashboard-05-chunk-3">
                        <CardHeader className="px-7">
                          <CardTitle>Sales Orders</CardTitle>
                          <CardDescription>Recent orders.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col space-y-8 lg:flex-row">
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
              </div>
              <div className="flex-none">
                {/* Profit Loss */}
                <ProfitLossComponent />
              </div>
            </div>
          </div>
        </div>
      </FormProvider>
    </div>
  );
}
