import ProfitLossChart from "./profitLossChart";
import Summaries from "./summaries";
import { RecentSales } from "./recent-sales";
import moment from "moment";
import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
const SaleDashboard = () => {
  const [selectMonth, setSelectMonth] = useState<string>(
    moment().tz("Asia/Jakarta").format("M")
  );
  return (
    <div className="space-y-4">
      <div className="flex content-start">
        <ToggleGroup
          type="single"
          variant="outline"
          value={selectMonth}
          onValueChange={setSelectMonth}
          className="grid grid-cols-6 md:flex"
        >
          {moment.monthsShort().map((e: string, index) => (
            <ToggleGroupItem
              value={String(index + 1)}
              key={e}
              className="bg-white"
            >
              {e}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <div className="">
        <Summaries month={selectMonth} />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-8">
        <div className="col-span-4">
          <ProfitLossChart />
        </div>
        <div className="col-span-4">
          <RecentSales />
        </div>
      </div>
      <div className="flex content-start"></div>
    </div>
  );
};

export default SaleDashboard;
