"use client";
import * as z from "zod";
import { useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { Contact } from "@/types/contact";
import { getContacts } from "@/lib/contacts/utils";

interface Props {
  form: any;
}

const ContactDetailComponent = ({ form }: Props) => {
  const { data: session, status } = useSession();

  const [contacts, setContacts] = useState<Array<Contact>>([]);
  const [temp, setTemp] = useState<Array<Contact>>([]);
  const [selectedContact, setSelectedContact] = useState<Number>(0);
  const [selectedContactID, setSelectedContactID] = useState(-1);
  const [currentContactPage, setCurrentContactPage] = useState(1);
  const [contactLastPage, setContactLastPage] = useState(1);
  useEffect(() => {
    async function get() {
      if (session?.user.merchant_id) {
        const tempContacts = await getContacts(
          session?.user.merchant_id,
          currentContactPage
        );
        setContacts(tempContacts.data);
        setTemp(tempContacts.data);
        setContactLastPage(tempContacts.meta.last_page);
        setSelectedContactID(form.getValues("customer_id"));
        if (form.getValues("customer_id"))
          selectContact(
            tempContacts.data.find(
              (contact: Contact) =>
                (contact.contact_id = form.getValues("customer_id"))
            )
          );
        localStorage.setItem("contacts", JSON.stringify(tempContacts));
      }
    }

    get();
  }, [session?.user, currentContactPage]);

  function selectContact(data: Contact) {
    setSelectedContact(Number(data.contact_id));
    form.setValue("customer_id", Number(data.contact_id));
    form.setValue("company", data.company_name);
    form.setValue("name", data.first_name);
    form.setValue("email", data.email);
    form.setValue("address", data.billing_address);
  }

  const searchContacts = (term: string) => {
    setContacts(
      temp.filter((e) => JSON.stringify(e).toLowerCase().includes(term))
    );
  };

  return (
    <>
      <Card>
        <CardHeader className="space-y-0.5">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Contact Details
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Add contact details.
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="flex flex-col mt-3">
          <div className="relative mb-4 mt-3 w-full">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search Contact"
              className="pl-8"
              onChange={(e) => searchContacts(e.target.value)}
            />
          </div>
          <ScrollArea className="h-[300px] w-full">
            <div className="grid md:grid-cols-2 gap-5 ">
              {contacts?.map((item: Contact) => {
                return (
                  <button
                    type="button"
                    key={item.contact_id}
                    className={cn(
                      "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
                      selectedContactID === item.contact_id && "bg-muted"
                    )}
                    onClick={() => {
                      selectContact(item),
                        setSelectedContactID(Number(item.contact_id));
                    }}
                  >
                    <div className="flex w-full flex-col gap-1">
                      <div className="flex items-center">
                        <div className="flex items-center gap-2">
                          <div className="font-semibold">
                            {item.company_name} / {item.display_name}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs font-medium">
                        {item.phone_number}
                      </div>
                      <div className="text-xs font-medium">{item.email}</div>
                    </div>
                    <div className="line-clamp-2 text-xs text-muted-foreground">
                      {item.billing_address}
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="flex items-end justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() =>
                  currentContactPage >= 1 &&
                  setCurrentContactPage(currentContactPage - 1)
                }
                style={{ display: currentContactPage == 1 ? "none" : "flex" }}
                // disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() =>
                  currentContactPage != contactLastPage &&
                  setCurrentContactPage(currentContactPage + 1)
                }
                style={{
                  display:
                    currentContactPage == contactLastPage ? "none" : "flex",
                }}
                // disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="flex flex-col">
          {form.formState.errors.customer_id?.message && (
            <p className="text-red-500">
              {form.formState.errors.customer_id?.message}
            </p>
          )}
        </CardFooter>
      </Card>
    </>
  );
};

export default ContactDetailComponent;
