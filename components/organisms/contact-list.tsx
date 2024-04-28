import { Contact } from "@/types/contact";
import { ScrollArea } from "../ui/scroll-area";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import contactsDummy from "@/lib/contact-dummy.json";

const ContactList = () => {
  const [contacts, setContacts] = useState<Array<Contact>>();
  const [selectedContact, setSelectedContact] = useState<Number>(0);
  useEffect(() => {
    return setContacts(contactsDummy);
  }, []);
  return (
    <ScrollArea className="h-[300px]">
      <div className="grid md:grid-cols-2 gap-5 ">
        {contacts?.map((item: Contact) => {
          return (
            <button
              type="button"
              key={item.contactId}
              className={cn(
                "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
                selectedContact === item.contactId && "bg-muted"
              )}
              onClick={() => setSelectedContact(item.contactId)}
            >
              <div className="flex w-full flex-col gap-1">
                <div className="flex items-center">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold">
                      {item.companyName} / {item.firstName}
                    </div>
                  </div>
                </div>
                <div className="text-xs font-medium">{item.telephone}</div>
                <div className="text-xs font-medium">{item.email}</div>
              </div>
              <div className="line-clamp-2 text-xs text-muted-foreground">
                {item.billingAddress}
              </div>
            </button>
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default ContactList;
