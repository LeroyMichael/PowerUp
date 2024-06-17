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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CaseUpper, PlusCircle, Search, Trash2 } from "lucide-react";
const ContactPage = () => {
  const { data: session, status } = useSession();

  const [data, setData] = useState<any[]>([]);
  const [temp, setTemp] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(0)
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    if (session?.user.id) {
      fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/contacts?merchant_id=${session?.user.merchant_id}&page=${currentPage}`,
        {
          method: "GET",
        }
      )
        .then((res) => res.json())
        .then((data) => {
 
          setData(data.data);
          setTemp(data.data);
          setLastPage(data.meta.last_page)
          localStorage.setItem("contacts", JSON.stringify(data.data));
          setLoading(false);
        })
        .catch((error) => console.log("error", error));
    }
  }, [session?.user, currentPage]);
  function deleteTransaction(contact_id: String) {
    fetch(`${process.env.NEXT_PUBLIC_URL}/api/contacts/${contact_id}`, {
      method: "DELETE",
    }).catch((error) => console.log("error", error));
  }

  console.log("DATAA = ", data);

  const searchTrans = (term: string) => {
    setData(temp.filter((e) => JSON.stringify(e).toLowerCase().includes(term)));
  };

  return (
    <Card>
      <CardHeader className="space-y-0.5">
        <div className="flex w-100 justify-between items-center">
          <div className="flex flex-col space-y-1.5">
            <CardTitle>Contacts</CardTitle>
            <CardDescription>List of contact</CardDescription>
          </div>
          <div>
            <Button size="sm" className="h-8 gap-1">
              <Link href="/contacts/new" className="flex items-center gap-2">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Add Contact
                </span>
              </Link>
            </Button>
          </div>
        </div>
      </CardHeader>
      <Separator className="" />
      <CardContent className="pt-5 flex flex-col space-y-8 lg:flex-row ">
        <div className="flex-1 ">
        <div className="relative mb-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search"
              className="pl-8"
              onChange={(e) => searchTrans(e.target.value)}
            />
          </div>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10"></TableHead>
                  <TableHead>
                    Company/Customer Name
                    </TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead className="text-right">Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((e) => {
                 
                  return (
                    <TableRow key={e.customer_id}>
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
                          <DropdownMenuContent
                            align="end"
                            className="w-[160px] "
                          >
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
                      <TableCell className="font-medium">
                        <Link href={`/contacts/${e.contact_id}`} className="flex items-center gap-2 text-blue-600">
                          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            {e.company_name}/{e.display_name}
                          </span>
                        </Link>
                      </TableCell>
                      <TableCell>{e.email}</TableCell>
                      <TableCell>{e.phone_number}</TableCell>
                      <TableCell className="text-right">
                        {e.billing_address}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => currentPage >= 1 && setCurrentPage(currentPage - 1)}
              style={{display: currentPage == 1 ? "none" : "flex"}}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => lastPage != currentPage && setCurrentPage(currentPage + 1)}
              style={{display: currentPage == lastPage ? "none" : "flex"}}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactPage;
