import { cn } from "@/lib/utils";
import { Contact } from "@/types/contact";

export interface ContactButtonProps {
  item: Contact;
  selectedContactID: number;
  setSelectedContactID?: (id: number) => void; //optional for the current contact if edit
  selectContact: (data: Contact) => void;
}

export const ContactButton = ({
  item,
  selectedContactID,
  setSelectedContactID,
  selectContact,
}: ContactButtonProps) => {
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
          setSelectedContactID && setSelectedContactID(Number(item.contact_id));
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
        <div className="text-xs font-medium">{item.phone_number}</div>
        <div className="text-xs font-medium">{item.email}</div>
      </div>
      <div className="line-clamp-2 text-xs text-muted-foreground">
        {item.billing_address}
      </div>
    </button>
  );
};
