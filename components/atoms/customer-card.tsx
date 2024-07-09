import { cn } from "@/lib/utils"
import { Contact } from "@/types/contact"


export type TCustomerCard = {
    key?: string | number | null
    isSelected: boolean
    onClick?: (value: Contact) => void
    data: Contact
}

export default function CustomerCard({key, isSelected, onClick, data}: TCustomerCard){
    return (
        <button
            type="button"
            key={key}
            className={cn(
                "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
                isSelected &&
                    "bg-muted"
                )}
            onClick={() => onClick?.(data)}
        >
            <div className="flex w-full flex-col gap-1">
            <div className="flex items-center">
                <div className="flex items-center gap-2">
                <div className="font-semibold">
                    {data?.company_name} /{" "}
                    {data?.display_name}
                </div>
                </div>
            </div>
            <div className="text-xs font-medium">
                {data?.phone_number}
            </div>
            <div className="text-xs font-medium">
                Email
                {data?.email}
            </div>
            </div>
            <div className="line-clamp-2 text-xs text-muted-foreground">
            {data?.delivery_address}
            </div>
        </button>
    )
}