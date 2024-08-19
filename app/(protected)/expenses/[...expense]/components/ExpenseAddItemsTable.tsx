"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { ExpensesFormDataType } from "@/types/expenses";
import { PlusCircle, X } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { NumericFormat } from "react-number-format";

export default function ExpenseAddItemsTable({}) {
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<ExpensesFormDataType>();

  const { append, remove } = useFieldArray({
    control: control,
    name: "details",
  });

  const watchDetails = watch("details");

  const subtotal = watch("details").reduce((acc, curr) => acc + curr.amount, 0);

  useEffect(() => {
    setValue("subtotal", subtotal);
  }, [subtotal]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Items</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell className="p-2">Account Code</TableCell>
              <TableCell className="min-w-[150px] p-2">Description</TableCell>
              <TableCell className="p-2">Amount</TableCell>
              <TableCell className="w-1/12 p-2"></TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {watchDetails.map((detail, idx) => {
              return (
                <TableRow key={idx} className="flex-1">
                  <TableCell className="w-3/12 p-2">
                    <FormField
                      control={control}
                      name={`details.${idx}.account_code`}
                      render={({ field }) => (
                        <FormItem>
                          <Input
                            value={detail.account_code}
                            onChange={field.onChange}
                          />
                          <FormMessage className="absolute" />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell className="w-3/12 p-2">
                    <FormField
                      control={control}
                      name={`details.${idx}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <Textarea
                            placeholder="Your notes. . ."
                            value={detail.description}
                            onChange={field.onChange}
                          />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell className="w-2/12 p-2">
                    <FormField
                      control={control}
                      name={`details.${idx}.amount`}
                      render={({ field }) => (
                        <FormItem>
                          <Input
                            placeholder="0"
                            value={detail.amount}
                            onChange={(e) => {
                              field.onChange(Number(e.target.value));
                            }}
                          />
                          <NumericFormat
                            value={field.value}
                            displayType={"text"}
                            prefix={"Rp"}
                            allowNegative={false}
                            decimalSeparator={","}
                            thousandSeparator={"."}
                            fixedDecimalScale={true}
                          />
                          {errors.details?.[idx]?.amount && (
                            <p className="text-red-500">
                              Price must not be empty
                            </p>
                          )}
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell className="w-1/12 p-2">
                    <Button
                      variant="outline"
                      size={"icon"}
                      type="button"
                      onClick={() => {
                        remove(idx);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
      <Separator />
      <CardFooter className="justify-center border-t p-4">
        <Button
          size="sm"
          variant="ghost"
          className="gap-1"
          onClick={() =>
            append({
              account_code: "6-60100",
              amount: 0,
              currency_code: "IDR",
              description: "",
            })
          }
        >
          <PlusCircle className="h-3.5 w-3.5" />
          Add New Item
        </Button>
      </CardFooter>
    </Card>
  );
}
