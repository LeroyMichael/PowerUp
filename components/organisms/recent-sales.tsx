import { NumericFormat } from "react-number-format";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import moment from "moment";

export function RecentSales(props: { data: any[] }) {
  return (
    <div className="space-y-8">
      {props.data.map((e) => {
        return (
          <div className="flex items-center" key={e.transaction_id}>
            <div className="space-y-1 text-center mr-4">
              <p className="text-sm font-medium leading-none">
                {moment(e.date).format("DD")}
              </p>
              <p className="text-sm">{moment(e.date).format("MMM")}</p>
            </div>
            {/* <Avatar className="h-12 w-12
            ">
              <AvatarFallback>12/02</AvatarFallback>
            </Avatar> */}
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">
                {e.transaction_num}
              </p>
              <p className="text-sm text-muted-foreground">
                {e.details.company}
              </p>
            </div>
            <div className="flex flex-col ml-auto font-medium text-right text-muted-foreground text-sm">
              {e.type == "proinvoice" ? (
                <>
                  <NumericFormat
                    className="text-green-400"
                    value={(e.total_price * e.details.dp) / 100}
                    displayType={"text"}
                    prefix={"+Rp"}
                    allowNegative={false}
                    decimalSeparator={","}
                    thousandSeparator={"."}
                    fixedDecimalScale={true}
                  />
                  <NumericFormat
                    className=""
                    value={e.total_price}
                    displayType={"text"}
                    prefix={"Rp"}
                    allowNegative={false}
                    decimalSeparator={","}
                    thousandSeparator={"."}
                    fixedDecimalScale={true}
                  />
                </>
              ) : (
                <NumericFormat
                  className="text-green-400"
                  value={e.total_price}
                  displayType={"text"}
                  prefix={"+Rp"}
                  allowNegative={false}
                  decimalSeparator={","}
                  thousandSeparator={"."}
                  fixedDecimalScale={true}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
