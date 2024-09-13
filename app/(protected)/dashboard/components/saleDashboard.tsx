import ProfitLossChart from "./profitLossChart";
import Summaries from "./summaries";
import { RecentSales } from "./recent-sales";

const SaleDashboard = () => {
  return (
    <div className="space-y-4">
      <div className="">
        <Summaries />
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
