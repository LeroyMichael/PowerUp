import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Purchase } from "@/types/purchase";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar"

import { useFormContext } from "react-hook-form";
import { CalendarIcon } from "lucide-react";


export default function TransactionDetails({}){

  const { control, getValues, formState: {errors} } = useFormContext<Purchase>()

    return (
      <Card>
        <CardHeader>
          <CardTitle>
            Purchase Details
          </CardTitle>
          <CardDescription>
            Add purchase details
          </CardDescription>
        </CardHeader>
        <Separator/>
        <CardContent>

        <div className="w-1/2 mt-4">
          <span>Transaction No</span>
          <div className="w-full flex border text-gray-400 border-gray-200 p-2 rounded-sm justify-between items-center">
            [Auto]
          </div>
        </div>

        <div className="flex gap-4 w-full mt-4">
            <FormField
              control={control}
              name="transaction_date"
              render={({field}) => (
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
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="due_date"
              render={({field}) => (
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
                </FormItem>
              )}
              />
          </div>


          {/* <div className="flex justify-between">
            <div className="flex w-1/2 gap-4 justify-between">
              <div className="w-1/2">
                <FormField
                  control={control}
                  name="contact_id"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Vendor</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value?.toString()}

                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Contact" />
                          </SelectTrigger>
                          <SelectContent>
                            {contactSelection.map((contact) => {
                              return (
                                <SelectItem
                                  key={contact.value}
                                  value={contact.value.toString()}
                                >
                                  {contact.text}
                                </SelectItem>
                              )
                            })}
                          </SelectContent>
                        </Select>
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-1/2">
                <FormField
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Email</FormLabel>
                        <Input placeholder="e.g. john@example.com" {...field}/>
                    </FormItem>
                  )}
                />
              </div>

            </div>

            <div className="items-end">Total</div>
          </div> */}
        </CardContent>
      </Card>
    )
}