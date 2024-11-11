"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { getProfitLoss, TGetProfitLossParams } from "@/lib/report/utils";
import { cn, rupiah } from "@/lib/utils";
import { ProfitLoss, ProfitLossFilter } from "@/types/report";
import { addDays, endOfMonth, format, startOfMonth } from "date-fns";
import { CalendarIcon, Copy, File } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { useFormContext } from "react-hook-form";

const ProfitLossComponent = () => {
  const { data: session, status } = useSession();

  const [date, setDate] = useState<DateRange | undefined>({
    from: startOfMonth(
      new Date(
        new Date().toLocaleString("en-US", {
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        })
      )
    ),
    to: endOfMonth(
      new Date(
        new Date().toLocaleString("en-US", {
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        })
      )
    ),
  });
  const [profitLoss, setProfitLoss] = useState<ProfitLoss>();
  // const {
  //   control,
  //   getValues,
  //   setValue,
  //   watch,
  //   formState: { errors },
  // } = useFormContext<ProfitLossFilter>();
  async function fetchProfitLoss() {
    if (session?.user.merchant_id && date) {
      const currDate = new Date();
      const filter: TGetProfitLossParams = {
        merchant_id: Number(session?.user.merchant_id),
        start_date: format(date?.from ?? currDate, "dd-MM-yyyy"),
        end_date: format(date?.to ?? currDate, "dd-MM-yyyy"),
      };
      const resp = await getProfitLoss(filter);
      setProfitLoss(resp);
    }
  }

  useEffect(() => {
    fetchProfitLoss();
  }, [session?.user.merchant_id, date]);

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="pr-2" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
      <Card className="overflow-hidden mt-2" x-chunk="dashboard-05-chunk-4">
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
                <CardDescription>
                  {format(date?.from ?? new Date(), "dd MMM yyyy")} -
                  {format(date?.to ?? new Date(), "dd MMM yyyy")}
                </CardDescription>
              </div>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-1">
            {/* <Button size="sm" variant="outline" className="h-7 gap-1 text-sm">
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only">Export</span>
            </Button> */}
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
                    <span>
                      {income.type === "DEBIT" && "-"}
                      {rupiah(income.total)}
                    </span>
                  </li>
                );
              })}
              <li className="flex items-center justify-between font-semibold">
                <span className="text-muted-foreground">
                  Total Primary Income
                </span>
                <span>
                  {rupiah(profitLoss?.total_primary_income ?? 0 ?? 0)}
                </span>
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
                    <span>
                      {income.type === "DEBIT" && "-"}
                      {rupiah(income.total)}
                    </span>
                  </li>
                );
              })}
              <li className="flex items-center justify-between font-semibold">
                <span className="text-muted-foreground">
                  Total Cost of Sales
                </span>
                <span>{rupiah(profitLoss?.total_cost_of_sales ?? 0)}</span>
              </li>
            </ul>
            <Separator className="my-2" />
            <div className="font-semibold">Operational Expense</div>
            <ul className="grid gap-3">
              {profitLoss?.operational_expense.map((income: any) => {
                return (
                  <li
                    className="flex items-center justify-between "
                    key={income.account_code + income.account_name}
                  >
                    <span className="text-muted-foreground w-28">
                      {income.account_code} <span>{income.account_name}</span>
                    </span>
                    <span>
                      {income.type === "DEBIT" && "-"}
                      {rupiah(income.total)}
                    </span>
                  </li>
                );
              })}
              <li className="flex items-center justify-between font-semibold">
                <span className="text-muted-foreground mr-2">
                  Total Operational Expense
                </span>
                <span>
                  -{rupiah(profitLoss?.total_operational_expenses ?? 0)}
                </span>
              </li>
            </ul>
            <Separator className="my-2" />
            <ul className="grid gap-3">
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Gross Profit</span>
                <span>{rupiah(profitLoss?.gross_profits ?? 0)}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Operational Expense
                </span>
                <span>
                  -{rupiah(profitLoss?.total_operational_expenses ?? 0)}
                </span>
              </li>
              <li className="flex items-center justify-between font-semibold">
                <span className="text-muted-foreground">Net Income</span>
                <span>{rupiah(profitLoss?.net_income ?? 0)}</span>
              </li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
          <div className="text-xs text-muted-foreground">
            Updated {format(new Date(), "dd MMMM yyyy")}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProfitLossComponent;
