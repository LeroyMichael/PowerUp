"use client";
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
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { Contact } from "@/types/contact";
import { getContacts } from "@/lib/contacts/utils";
import { ContactButton } from "@/components/organisms/contact-button";

interface Props {
  formsales: any;
  params: any;
}

const ContactDetailComponent = ({ formsales, params }: Props) => {
  const { data: session, status } = useSession();
  const contactIdFromDb = formsales.getValues("contact_id");
  const [contacts, setContacts] = useState<Array<Contact>>([]);
  const [temp, setTemp] = useState<Array<Contact>>([]);
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
        setSelectedContactID(contactIdFromDb);

        localStorage.setItem("contacts", JSON.stringify(tempContacts));
      }
    }
    get();
  }, [session?.user, currentContactPage]);

  function selectContact(data: Contact) {
    setSelectedContactID(Number(data.contact_id));
    formsales.setValue("contact_id", Number(data.contact_id));
    formsales.setValue("contact", data);
  }

  const searchContacts = (term: string) => {
    setContacts(
      temp.filter((e) => JSON.stringify(e).toLowerCase().includes(term))
    );
  };

  //current contact data if edit
  const currentContactArray = [
    {
      contact_id: formsales.getValues("contact_name.contact_id"),
      merchant_id: formsales.getValues("contact_name.merchant_id"),
      display_name: formsales.getValues("contact_name.display_name"),
      contact_type: formsales.getValues("contact_name.contact_type"),
      first_name: formsales.getValues("contact_name.first_name"),
      last_name: formsales.getValues("contact_name.last_name"),
      email: formsales.getValues("contact_name.email"),
      company_name: formsales.getValues("contact_name.company_name"),
      phone_number: formsales.getValues("contact_name.phone_number"),
      billing_address: formsales.getValues("contact_name.billing_address"),
      delivery_address: formsales.getValues("contact_name.delivery_address"),
      bank_name: formsales.getValues("contact_name.bank_name"),
      bank_holder: formsales.getValues("contact_name.bank_holder"),
      bank_number: formsales.getValues("contact_name.bank_number"),
      memo: formsales.getValues("contact_name.memo"),
    },
  ];
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
          <FormField
            control={formsales.control}
            name="billing_address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Billing Address</FormLabel>
                <FormControl>
                  <Textarea placeholder="Input Billing Address" {...field} />
                </FormControl>
                <FormMessage className="" />
              </FormItem>
            )}
          />
          <div className="relative mb-4 mt-3 w-full">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search Contact"
              className="pl-8"
              onChange={(e) => searchContacts(e.target.value)}
            />
          </div>
          {params?.sale != "new" && (
            <div className="relative mb-4 mt-3 w-full">
              <h4>Current Contact</h4>
              {currentContactArray?.map((item: Contact) => (
                <ContactButton
                  key={item.contact_id}
                  item={item}
                  selectedContactID={selectedContactID}
                  selectContact={selectContact}
                  setSelectedContactID={setSelectedContactID}
                />
              ))}
            </div>
          )}
          <Separator className="mb-4" />
          <ScrollArea className="h-[300px] w-full">
            <div className="grid md:grid-cols-2 gap-5 ">
              {contacts?.map((item: Contact) => (
                <ContactButton
                  key={item.contact_id}
                  item={item}
                  selectedContactID={selectedContactID}
                  selectContact={selectContact}
                  setSelectedContactID={setSelectedContactID}
                />
              ))}
            </div>
          </ScrollArea>
          <div className="flex items-center justify-end space-x-2 py-4">
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
        </CardContent>
        <CardFooter>
          {formsales.formState.errors.contact_id?.message && (
            <p className="text-red-500">
              {formsales.formState.errors.contact_id?.message}
            </p>
          )}
        </CardFooter>
      </Card>
    </>
  );
};

export default ContactDetailComponent;
