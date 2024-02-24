import { NumericFormat } from "react-number-format";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function RecentSales(props: { data: any[] }) {
  return (
    <div className="space-y-8">
      {props.data.map((e) => {
        const tDetails = JSON.parse(e.details);
        return (
          <div className="flex items-center" key={e.transaction_id}>
            {/* <Avatar className="h-9 w-9">
              <AvatarFallback>OM</AvatarFallback>
            </Avatar> */}
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">
                {e.transaction_num}
              </p>
              <p className="text-sm text-muted-foreground">
                {tDetails.company}
              </p>
            </div>
            <div className="ml-auto font-medium">
              +
              <NumericFormat
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
