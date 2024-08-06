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
import { Product } from "@/types/product";
import { toLower } from "lodash";

interface ComboboxProductProps {
  onValueChange: (value: Number | null) => void;
  defaultValue?: Number | null;
  value: Number | null;
  items: Array<Product>;
}

export const ComboboxProduct: React.FC<ComboboxProductProps> = ({
  onValueChange,
  defaultValue = "",
  value = null,
  items = [],
}) => {
  const [open, setOpen] = useState(false);
  const [select, setSelect] = useState<Number | null>(value);
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
            ? items.find((product) => product.product_id == select)?.name
            : "Select Product"}
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
            placeholder="Select Product..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>No product found.</CommandEmpty>
            <CommandGroup>
              {items.map((product: Product) => (
                <CommandItem
                  key={product.product_id}
                  value={product.name + ";" + product.product_id}
                  onSelect={(currentValue) => {
                    setSelect(
                      currentValue ? Number(currentValue.split(";")[1]) : null
                    );
                    onValueChange &&
                      onValueChange(
                        currentValue ? Number(currentValue.split(";")[1]) : null
                      );
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      select == product.product_id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {product.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
