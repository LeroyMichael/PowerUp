"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import { useSession } from "next-auth/react";
import { Product } from "@/types/product";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getStockAdjustments } from "@/lib/inventory/stock-adjustment/utils";
import { StockAdjustment } from "@/types/stock-adjustment";

const StockAdjustmentList = () => {
  const [data, setData] = useState<Array<StockAdjustment>>([]);
  const [temp, setTemp] = useState<Array<StockAdjustment>>([]);
  const [isLoading, setLoading] = useState(true);
  const { data: session, status } = useSession();

  const searchTrans = (term: string) => {
    setData(temp.filter((e) => JSON.stringify(e).toLowerCase().includes(term)));
  };
  useEffect(() => {
    async function fetchData() {
      if (session?.user.merchant_id) {
        const resp = await getStockAdjustments(session?.user.merchant_id);
        setData(resp);
        setTemp(resp);
        console.log(resp);
      }
    }
    fetchData();
  }, [session?.user]);
  return (
    <div>
      <div className="relative mb-4">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search"
          className="pl-8"
          onChange={(e) => searchTrans(e.target.value)}
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="">Date</TableHead>
              <TableHead className="">Transaction No</TableHead>
              <TableHead className="text-center">Category</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data &&
              data.map((e: StockAdjustment) => {
                return (
                  <TableRow key={e.sa_id}>
                    <TableCell className="">
                      {e.created_at.toString().substring(0, 10)}
                    </TableCell>
                    <TableCell className="font-medium">
                      <Link
                        href={`/inventory/stock-adjustment/${e.sa_id}`}
                        className="text-sm font-medium transition-colors text-blue-500 hover:text-black"
                      >
                        {e.transaction_number}
                      </Link>
                    </TableCell>
                    <TableCell className="text-center">
                      {e.sa_category_label}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
          {data.length == 0 && (
            <TableCaption>
              <div className="pb-4">No results found.</div>
            </TableCaption>
          )}
        </Table>
      </div>
    </div>
  );
};

export default StockAdjustmentList;
