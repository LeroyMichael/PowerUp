import { NumericFormat } from "react-number-format";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function RecentSales(props: { data: any[] }) {
  return (
    <div className="space-y-8">
      {props.data.map((e) => {
        const tDetails = JSON.parse(e.details);
        return (
          <div className="flex items-center" key={e.transaction_id}>
            {/* <Avatar className="h-12 w-12">
              <AvatarFallback>12/02</AvatarFallback>
            </Avatar> */}
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">
                {e.transaction_num}
              </p>
              <p className="text-sm text-muted-foreground">
                {tDetails.company}
              </p>
            </div>
            <div className="ml-auto font-medium text-green-400">
              +
              <NumericFormat
                className=""
                value={e.total_price}
                displayType={"text"}
                prefix={"Rp."}
                allowNegative={false}
                decimalSeparator={","}
                thousandSeparator={"."}
                fixedDecimalScale={true}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
