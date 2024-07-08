import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

import { useFormContext } from "react-hook-form";
import { CalendarIcon, Loader } from "lucide-react";
import { ExpensesFormDataType } from "@/types/expenses";

export default function ExpenseTransactionDetails({}) {
  const {
    control,
    watch
  } = useFormContext<ExpensesFormDataType>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Details</CardTitle>
        <CardDescription>Add expense details</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent>
        <FormField
          control={control}
          name="transaction_number"
          render={({ field }) => (
            <FormItem className="mt-4">
              <FormLabel>Transaction No</FormLabel>
              <div className="p-2 border border-gray-100 rounded">
                {!!watch("transaction_number") ? watch("transaction_number") : <Loader/>}
              </div>
              <FormMessage className="absolute" />
            </FormItem>
          )}
        />

        <div className="flex gap-4 w-full mt-4">
          <FormField
            control={control}
            name="transaction_date"
            render={({ field }) => (
              <FormItem className="flex flex-col w-1/2">
                <FormLabel>Transaction Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "justify-between text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "dd-MM-yyyy")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="mr-2 h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage className="absolute" />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
