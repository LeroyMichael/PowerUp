"use client";

import React, { useEffect } from "react";
import { addDays, endOfMonth, format, startOfMonth } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useFormContext } from "react-hook-form";
import { ProfitLossFilter } from "@/types/report";
import { Calendar } from "../../../../components/ui/calendar";

export function DatePickerWithRange({ className }: any) {
  const {
    control,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<ProfitLossFilter>();

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: startOfMonth(
      new Date(
        new Date().getTime() + new Date().getTimezoneOffset() * 3600 * 1000
      )
    ),
    to: endOfMonth(
      new Date(
        new Date().getTime() + new Date().getTimezoneOffset() * 3600 * 1000
      )
    ),
  });

  function setDateValue(set: DateRange | undefined) {
    setDate(set);
    setValue(
      "from",
      set?.from ??
        startOfMonth(
          new Date(
            new Date().toLocaleString("en-US", {
              timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            })
          )
        )
    );
    setValue(
      "to",
      set?.to ??
        endOfMonth(
          new Date(
            new Date().toLocaleString("en-US", {
              timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            })
          )
        )
    );
  }
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={getValues("from")}
            selected={date}
            onSelect={setDateValue}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
