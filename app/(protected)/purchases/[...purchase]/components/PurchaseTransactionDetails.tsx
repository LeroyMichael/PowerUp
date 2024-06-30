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
import { cn, getRunningNumber } from "@/lib/utils";
import { Purchase } from "@/types/purchase";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

import { useFormContext } from "react-hook-form";
import { CalendarIcon, Loader } from "lucide-react";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function PurchaseTransactionDetails({}) {
  const {data: session} = useSession()
  const {
    control,
    setValue,
    watch
  } = useFormContext<Purchase>();

  async function callRunningNumber(){
    const runningNumber = await getRunningNumber(session?.user.merchant_id, "purchase")
    setValue("transaction_number", runningNumber)
  }

  useEffect(() => {
    if(session?.user.merchant_id){
      callRunningNumber()
    }
  }, [session?.user])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Purchase Details</CardTitle>
        <CardDescription>Add purchase details</CardDescription>
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

          <FormField
            control={control}
            name="due_date"
            render={({ field }) => (
              <FormItem className="flex flex-col w-1/2">
                <FormLabel>Due Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "text-left font-normal flex justify-between",
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
