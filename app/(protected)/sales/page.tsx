import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircle, Smartphone } from "lucide-react";
import Link from "next/link";
import SalesList from "./components/sales-list";

const SalesPage = () => {
  return (
    <Card className="my-4">
      <CardHeader>
        <div className="flex w-100 justify-between items-center">
          <div className="flex flex-col space-y-1.5">
            <CardTitle>Sales</CardTitle>
            <CardDescription>List of sales</CardDescription>
          </div>
          <div className="flex justify-center">
            <Button size="sm" className="h-8 gap-1 mr-2">
              <Link href="/sales/mobile" className="flex items-center gap-2">
                <Smartphone className="w-4" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Quick Sale
                </span>
              </Link>
            </Button>
            <Button size="sm" className="h-8 gap-1">
              <Link href="/sales/new" className="flex items-center gap-2">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Add Sale
                </span>
              </Link>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col space-y-8 lg:flex-row ">
        <SalesList />
      </CardContent>
    </Card>
  );
};

export default SalesPage;
