import { NumericFormat } from "react-number-format";
import moment from "moment";
import { SaleList } from "@/types/sale";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { getSales } from "@/lib/sales/utils";
import { format, parse } from "date-fns";

export function RecentSales() {
  const { data: session, status } = useSession();
  const [data, setData] = useState<Array<SaleList>>([]);
  const [currentPage, setCurrentPage] = useState(1);
  async function get() {
    if (session?.user.merchant_id) {
      const res = await getSales(session?.user.merchant_id, currentPage);
      setData(res.data);
    }
  }
  useEffect(() => {
    session?.user.merchant_id && get();
  }, [session?.user.merchant_id, currentPage]);

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {data?.map((e: SaleList) => {
            const date = parse(
              e.transaction_date.toString(),
              "dd-MM-yyyy",
              new Date()
            );
            return (
              <>
                <div className="flex items-center" key={e.sale_id}>
                  <div className="space-y-1 text-center mr-4">
                    <p className="text-sm font-medium leading-none">
                      {format(date, "dd")}
                    </p>
                    <p className="text-sm">{format(date, "MMM")}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {e.transaction_number}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {e.contact_name.company_name}
                    </p>
                  </div>
                  <div className="flex flex-col ml-auto font-medium text-right text-muted-foreground text-sm">
                    {e.payment_status == "PAID" ? (
                      <>
                        <NumericFormat
                          className="text-green-400"
                          value={e.total}
                          displayType={"text"}
                          prefix={"+Rp"}
                          allowNegative={false}
                          decimalSeparator={","}
                          thousandSeparator={"."}
                          fixedDecimalScale={true}
                        />
                      </>
                    ) : (
                      <NumericFormat
                        className=""
                        value={e.total}
                        displayType={"text"}
                        prefix={"Rp"}
                        allowNegative={false}
                        decimalSeparator={","}
                        thousandSeparator={"."}
                        fixedDecimalScale={true}
                      />
                    )}
                  </div>
                </div>
              </>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
