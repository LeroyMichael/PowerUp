import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Overview } from "@/components/organisms/overview";
import { RecentSales } from "@/components/organisms/recent-sales";
import { NumericFormat } from "react-number-format";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import moment from "moment";
import { useSession } from "next-auth/react";

type Months = typeof monthsList;
const monthsList = moment.monthsShort();
const TransactionDashboard = () => {
  const { data: session, status } = useSession();
  const [data, setData] = useState<any[]>([]);
  const [temp, setTemp] = useState<any[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [selectMonth, setSelectMonth] = useState<Months>([
    moment().tz("Asia/Jakarta").format("MMM"),
  ]);
  useEffect(() => {
    setData(temp.filter((e) => selectMonth.includes(e.date_string)));
  }, [selectMonth, temp]);
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
          data.map((e: any) => {
            if (typeof e.details === "object") return e;
            try {
              const tDetails = JSON.parse(e.details);
              e.details = tDetails;
            } catch (error) {}
            e.date_string = moment(e.date).format("MMM");
            return e;
          });
          setData(data);
          setTemp(data);
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
  }, [session?.user.merchant_id]);
  return (
    <div className="space-y-4">
      <div className="flex content-start">
        <ToggleGroup
          type="multiple"
          variant="outline"
          value={selectMonth}
          onValueChange={setSelectMonth}
          className="grid grid-cols-6 md:flex"
        >
          {moment.monthsShort().map((e: string) => (
            <ToggleGroupItem value={e} key={e} className="bg-white">
              {e}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
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
                  .reduce(
                    (acc, curr) =>
                      acc + (+curr.total_price * curr.details.dp) / 100,
                    0
                  )}
                displayType={"text"}
                prefix={"Rp"}
                allowNegative={false}
                decimalSeparator={","}
                thousandSeparator={"."}
                fixedDecimalScale={true}
              />
            </div>
            <div>
              <NumericFormat
                value={data
                  .filter((e) => e.type === "proinvoice")
                  .reduce((acc, curr) => acc + +curr.total_price, 0)}
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
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview Invoice</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview trans={temp.filter((e) => e.type == "invoice")} />
          </CardContent>
        </Card>
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview Proforma Invoice</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview trans={temp.filter((e) => e.type == "proinvoice")} />
          </CardContent>
        </Card>
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Sales (Invoice)</CardTitle>
            <CardDescription>
              You made {data.filter((e) => e.type === "invoice").length} sales
              this month.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentSales data={data.filter((e) => e.type === "invoice")} />
          </CardContent>
        </Card>
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Sales (Proforma Invoice)</CardTitle>
            <CardDescription>
              You made {data.filter((e) => e.type === "proinvoice").length}{" "}
              incoming sales this month.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentSales data={data.filter((e) => e.type === "proinvoice")} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TransactionDashboard;
