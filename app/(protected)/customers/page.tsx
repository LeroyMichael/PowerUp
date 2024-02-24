"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
const CustomerPage = () => {
  const { data: session, status } = useSession();
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    if (session?.user.id) {
      fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/customers?merchantId=${session?.user.merchant_id}`,
        {
          method: "GET",
        }
      )
        .then((res) => res.json())
        .then((data) => {
          setData(data);
          localStorage.setItem("customers", JSON.stringify(data));
          setLoading(false);
        })
        .catch((error) => console.log("error", error));
    }
  }, [session]);
  function deleteTransaction(customerId: String) {
    fetch(`${process.env.NEXT_PUBLIC_URL}/api/customers/${customerId}`, {
      method: "DELETE",
    }).catch((error) => console.log("error", error));
  }
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company/Customer Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead className="text-right">Address</TableHead>
            <TableHead className="w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((e) => {
            const details = JSON.parse(e.details);
            return (
              <TableRow key={e.customer_id}>
                <TableCell className="font-medium">
                  {details.company_name}/{details.customer_name}
                </TableCell>
                <TableCell>{details.email}</TableCell>
                <TableCell>{details.phone_number}</TableCell>
                <TableCell className="text-right">{details.address}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                      >
                        <DotsHorizontalIcon className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px] ">
                      {/* <DropdownMenuItem className="cursor-pointer">
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        Make a copy
                      </DropdownMenuItem> */}
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => {
                          deleteTransaction(e.customer_id);
                        }}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default CustomerPage;
