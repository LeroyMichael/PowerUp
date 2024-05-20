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
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { Product } from "@/types/product";
import { useSession } from "next-auth/react";
import { getProducts } from "@/lib/inventory/products/utils";

export function ComboboxProduct() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("0");

  const [data, setData] = useState<Array<Product>>([]);
  const [temp, setTemp] = useState<Array<Product>>([]);
  const [isLoading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  const searchTrans = (term: string) => {
    setData(temp.filter((e) => JSON.stringify(e).toLowerCase().includes(term)));
  };
  useEffect(() => {
    async function fetchData() {
      if (session?.user.merchant_id) {
        const resp = await getProducts(session?.user.merchant_id);
        setData(resp);
        setTemp(resp);
        console.log(resp);
      }
    }
    fetchData();
  }, [session?.user]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? data.find((product) => product.product_id.toString() == value)
                ?.name
            : "Select Account..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Select Account..." />
          <CommandEmpty>No product found.</CommandEmpty>
          <CommandGroup>
            {data.map((product) => (
              <CommandItem
                key={product.product_id}
                value={product.name}
                onSelect={(currentValue) => {
                  setValue(currentValue == value ? "0" : currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value == product.product_id.toString()
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                {product.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
