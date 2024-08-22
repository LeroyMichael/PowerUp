"use client";

import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { toLower } from "lodash";
import { Account } from "@/types/account";

interface ComboboxAccountProps {
  onValueChange: (value: string | null) => void;
  defaultValue?: string | null;
  value: string | null;
  items: Array<Account>;
}

export const ComboboxAccount: React.FC<ComboboxAccountProps> = ({
  onValueChange,
  defaultValue = "",
  value = null,
  items = [],
}) => {
  const [open, setOpen] = useState(false);
  const [select, setSelect] = useState<string | null>(value);
  const [isLoading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  useEffect(() => {
    setSelect(value);
  }, [value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-auto"
        >
          {select
            ? items.find((account) => account.account_code == select)
                ?.account_name
            : "Select Account"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command
          filter={(value, search) => {
            if (value.includes(toLower(search))) return 1;
            return 0;
          }}
        >
          <CommandInput
            placeholder="Select Account..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>No account found.</CommandEmpty>
            <CommandGroup>
              {items.map((account: Account) => (
                <CommandItem
                  key={account.account_code}
                  value={account.account_name + ";" + account.account_code}
                  onSelect={(currentValue) => {
                    setSelect(currentValue ? currentValue.split(";")[1] : null);
                    onValueChange &&
                      onValueChange(
                        currentValue ? currentValue.split(";")[1] : null
                      );
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      select == account.account_code
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {account.account_code} {account.account_name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
