"use client";
import * as z from "zod";
import { useState } from "react";
import { useFieldArray } from "react-hook-form";
import { format } from "date-fns";
import {
  Badge,
  CalendarIcon,
  ChevronLeft,
  Loader2,
  PlusCircle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface Props {
  formsales: any;
}

const SalesInformationComponent = ({ formsales }: Props) => {
  const {
    handleSubmit,
    formState: { errors },
  } = formsales;
  console.log("ASDASDASDASDASDSA = ", errors);
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Sale Information</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col space-y-8 lg:flex-row">
          <div className="flex-1 my-5">
            <div className="space-y-8 ">
              <FormField
                control={formsales.control}
                name="transaction_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transaction No</FormLabel>
                    <FormControl>
                      <Input placeholder="10 Oktober 2023" {...field} />
                    </FormControl>
                    <FormMessage className="" />
                  </FormItem>
                )}
              />
              <div className="flex gap-5">
                <FormField
                  control={formsales.control}
                  name="transaction_date"
                  render={({ field }) => (
                    <FormItem className="w-full flex flex-col">
                      <FormLabel>Transaction Date</FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
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
                      </FormControl>
                      <FormMessage className="" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={formsales.control}
                  name="due_date"
                  render={({ field }) => (
                    <FormItem className="w-full flex flex-col">
                      <FormLabel>Invoice Due Date</FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
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
                      </FormControl>
                      <FormMessage className="absolute" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={formsales.control}
              name="memo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Memo</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Sale for Tokopedia" {...field} />
                  </FormControl>
                  <FormMessage className="" />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default SalesInformationComponent;
