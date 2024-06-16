"use client";
import { Contact } from "@/types/contact";
import { ScrollArea } from "../ui/scroll-area";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { getContacts } from "@/lib/contacts/utils";
import { useSession } from "next-auth/react";

const ContactList = () => {
  const [contacts, setContacts] = useState<Array<Contact>>();
  const [selectedContact, setSelectedContact] = useState<Number>(0);
  const { data: session, status } = useSession();
  useEffect(() => {
    async function fetchData() {
      if (session?.user.merchant_id) {
        const resp = await getContacts(session?.user.merchant_id);
        setContacts(resp);
      }
    }
    fetchData();
  }, [session?.user]);
  return (
    <ScrollArea className="h-[300px]">
      <div className="grid md:grid-cols-2 gap-5 ">
        {contacts?.map((item: Contact) => {
          return (
            <button
              type="button"
              key={item.contact_id}
              className={cn(
                "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
                selectedContact === item.contact_id && "bg-muted"
              )}
              onClick={() => setSelectedContact(item.contact_id)}
            >
              <div className="flex w-full flex-col gap-1">
                <div className="flex items-center">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold">
                      {item.company_name} / {item.first_name}
                    </div>
                  </div>
                </div>
                <div className="text-xs font-medium">{item.phone_number}</div>
                <div className="text-xs font-medium">{item.email}</div>
              </div>
              <div className="line-clamp-2 text-xs text-muted-foreground">
                {item.billing_address}
              </div>
            </button>
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default ContactList;
