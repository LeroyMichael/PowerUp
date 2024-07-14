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
import { Contact } from "@/types/contact";
import { getContacts, deleteContact } from "@/lib/contacts/utils";
const ContactPage = () => {
  const { data: session, status } = useSession();

  const [data, setData] = useState<Array<Contact>>([]);
  const [temp, setTemp] = useState<Array<Contact>>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(0);
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    async function get() {
      if (session?.user.merchant_id) {
        const res = await getContacts(session?.user.merchant_id, currentPage);
        setData(res.data);
        setTemp(res.data);
        setLastPage(res.meta.last_page);
      }
    }
    get();
  }, [session?.user, currentPage]);

  function delContact(contact_id: Number) {
    deleteContact(contact_id);
    setData(data.filter((item: Contact) => item.contact_id != contact_id));
    setTemp(data.filter((item: Contact) => item.contact_id != contact_id));
  }

  const searchContacts = (term: string) => {
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
              onChange={(e) => searchContacts(e.target.value)}
            />
          </div>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10"></TableHead>
                  <TableHead>Contact Type</TableHead>
                  <TableHead>Company/Customer Name</TableHead>
                  <TableHead>Phone Number</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((e: Contact) => {
                  return (
                    <TableRow key={e.contact_id}>
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
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => {
                                delContact(Number(e.contact_id));
                              }}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                      <TableCell>{e.contact_type}</TableCell>
                      <TableCell className="font-medium">
                        <Link
                          href={`/contacts/${e.contact_id}`}
                          className="flex items-center gap-2 text-blue-600"
                        >
                          <span className=" sm:not-sr-only sm:whitespace-nowrap">
                            {e.company_name}/{e.display_name}
                          </span>
                        </Link>
                      </TableCell>
                      <TableCell>{e.phone_number}</TableCell>
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
              onClick={() =>
                currentPage >= 1 && setCurrentPage(currentPage - 1)
              }
              style={{ display: currentPage == 1 ? "none" : "flex" }}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                currentPage != lastPage && setCurrentPage(currentPage + 1)
              }
              style={{ display: currentPage == lastPage ? "none" : "flex" }}
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
