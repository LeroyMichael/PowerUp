"use client";
import { Metadata } from "next";
import Image from "next/image";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Overview } from "@/components/organisms/overview";
import { Search } from "@/components/atoms/search";
import { UserNav } from "@/components/organisms/user-nav";
import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/molecules/main-nav";
import { RecentSales } from "@/components/organisms/recent-sales";
import { CalendarDateRangePicker } from "@/components/molecules/date-range-picker";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";

// export const metadata: Metadata = {
//   title: "Dashboard",
//   description: "Example dashboard app built using the components.",
// };

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    if (session?.user.merchant_id) {
      fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/transactions?merchantId=${session?.user.merchant_id}`,
        {
          method: "GET",
        }
      )
        .then((res) => res.json())
        .then((data) => {
          setData(data);
          console.log(data);
          localStorage.setItem("transactions", JSON.stringify(data));
          var map = data.reduce(function (prev: any, cur: any) {
            prev[cur.type] = (prev[cur.type] || 0) + 1;
            return prev;
          }, {});
          localStorage.setItem("count", JSON.stringify(map));
          setLoading(false);
        })
        .catch((error) => console.log("error", error));
    }
  }, [session]);
  return (
    <>
      <div className="flex-col md:flex">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <div className="flex items-center space-x-2">
              {/* <CalendarDateRangePicker /> */}
            </div>
          </div>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              {/* <TabsTrigger value="analytics" disabled>
                Analytics
              </TabsTrigger>
              <TabsTrigger value="reports" disabled>
                Reports
              </TabsTrigger> */}
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Revenue (Invoice)
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
                        value={data
                          .filter((e) => e.type === "invoice")
                          .reduce((acc, curr) => acc + +curr.total_price, 0)}
                        displayType={"text"}
                        prefix={"Rp."}
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
                      Incoming Revenue (Proforma Invoice)
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
                        value={data
                          .filter((e) => e.type === "proinvoice")
                          .reduce((acc, curr) => acc + +curr.total_price, 0)}
                        displayType={"text"}
                        prefix={"Rp."}
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
                      Sales (Invoice)
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
                      <rect width="20" height="14" x="2" y="5" rx="2" />
                      <path d="M2 10h20" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      +{data.filter((e) => e.type === "invoice").length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {/* +19% from last month */}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Sales (Proforma Invoice)
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
                      <rect width="20" height="14" x="2" y="5" rx="2" />
                      <path d="M2 10h20" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      +{data.filter((e) => e.type === "proinvoice").length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {/* +19% from last month */}
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-8">
                {/* <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <Overview />
                  </CardContent>
                </Card> */}
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Recent Sales (Invoice)</CardTitle>
                    <CardDescription>
                      You made {data.filter((e) => e.type === "invoice").length}{" "}
                      incoming sales this month.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecentSales
                      data={data.filter((e) => e.type === "invoice")}
                    />
                  </CardContent>
                </Card>
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Recent Sales (Proforma Invoice)</CardTitle>
                    <CardDescription>
                      You made{" "}
                      {data.filter((e) => e.type === "proinvoice").length}{" "}
                      incoming sales this month.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecentSales
                      data={data.filter((e) => e.type === "proinvoice")}
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
