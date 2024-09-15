import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import React, { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { getProfitLossSummary } from "@/lib/report/utils";
import { ProfitLossSummary } from "@/types/report";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import { rupiah } from "@/lib/utils";
const ProfitLossChart = () => {
  const { data: session, status } = useSession();
  const chartConfig = {
    profitloss: {
      label: "Profit & Loss",
      color: "#2563eb",
    },
  } satisfies ChartConfig;
  const [allProfitLoss, setAllProfitLoss] = useState([{}]);

  async function getAllProfitLoss() {
    session?.user.merchant_id &&
      setAllProfitLoss(
        await getProfitLossSummary({
          merchant_id: session?.user.merchant_id,
          start_date: format(new Date(), "01-01-yyyy"),
          end_date: format(new Date(), "dd-12-yyyy"),
        }).then((pls: Array<ProfitLossSummary>) =>
          pls.map((pl: ProfitLossSummary) => {
            return {
              month: format(new Date(2024, pl.month - 1, 1), "MMMM"),
              profitloss: Number(Number(pl.net_income) / 1000000),
            };
          })
        )
      );
  }
  useEffect(() => {
    function fetchAll() {
      getAllProfitLoss();
    }
    session?.user.merchant_id && fetchAll();
  }, [session?.user.merchant_id]);
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Profit & Loss</CardTitle>
          <CardDescription>Total profit & loss each months</CardDescription>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <ChartContainer
                config={chartConfig}
                className="min-h-[200px] w-full"
              >
                <BarChart accessibilityLayer data={allProfitLoss}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) =>
                      `${rupiah(value).split(",")[0] + "jt"}`
                    }
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar
                    dataKey="profitloss"
                    fill="var(--color-profitloss)"
                    radius={4}
                  />
                </BarChart>
              </ChartContainer>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfitLossChart;
