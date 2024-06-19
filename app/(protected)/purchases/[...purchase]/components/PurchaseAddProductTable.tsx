"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Purchase, PurchaseProductList } from "@/types/purchase";
import { PlusCircle, X } from "lucide-react";
import { ChangeEvent, useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";


export default function PurchaseAddProductTable({}){

    const { control, getValues, formState: {errors}, setValue, watch } = useFormContext<Purchase>()

    const { fields, append, remove } = useFieldArray({
        control: control,
        name: "details"
    })

    const dummyProductName = [
        {text: "Produk Name 1", product_id: 1},
        {text: "Produk Name 2", product_id: 2},
        {text: "Produk Name 3", product_id: 3},
    ]

    // CHANGE ANY TIPE WHEN INTEGRATING
    const selectProduct = (input: any) => {
      console.log('set product unit_price', input)
    }

    const calculateAmount = (e: ChangeEvent<HTMLInputElement>, currentProductUnitPrice: number) => {
        const tempQty = Number(e.target.value)
        return tempQty * currentProductUnitPrice
    }

    useEffect(() => {
        const details: PurchaseProductList[] = getValues("details")
        const subtotal = details.reduce((prev, curr) => prev + curr.amount, 0)

        setValue('subtotal', subtotal)

    }, [watch("details")])

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Add Items
                </CardTitle>
            </CardHeader>
            <Separator/>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableCell className="w-4/12">Product</TableCell>
                            <TableCell className="w-2/12">Price</TableCell>
                            <TableCell className="w-2/12">Qty</TableCell>
                            {/* No edit, qty x price */}
                            <TableCell className="w-3/12">Amount</TableCell> 
                            <TableCell className="w-1/12"></TableCell> 
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {fields.map((fieldData, index) => {

                            const currentProductUnitPrice = getValues(`details.${index}.unit_price`)

                            const isProductIsSelected = !!getValues(`details.${index}.product_id`)
                            const isQtyValid = !!getValues(`details.${index}.qty`) && Number(getValues(`details.${index}.qty`)) > 0

                            const isAmountDisplayed = isProductIsSelected && isQtyValid

                            return(
                                <TableRow key={index} className="flex-1">
                                    <TableCell className="w-2/12">
                                        <FormField
                                            control={control}
                                            name={`details.${index}.product_id`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        value={field.value?.toString()}
                                                    >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select Product" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {dummyProductName.map((productName) => {
                                                            return (
                                                            <SelectItem
                                                                key={productName.product_id}
                                                                value={productName.product_id.toString()}
                                                            >
                                                                {productName.text}
                                                            </SelectItem>
                                                            )
                                                        })}
                                                    </SelectContent>
                                                    </Select>
                                                </FormItem>
                                            ) }
                                        />
                                    </TableCell>
                                    <TableCell className="w-1/12">
                                        {isProductIsSelected && fieldData.unit_price}
                                    </TableCell>
                                    <TableCell className="w-1/12">
                                        {isProductIsSelected && 
                                            <FormField
                                                control={control}
                                                name={`details.${index}.qty`}
                                                render={({field}) => (
                                                    <FormItem>
                                                        <Input
                                                            placeholder="0"
                                                            onChange={(e) => {
                                                                field.onChange(e)
                                                                setValue(`details.${index}.amount`, calculateAmount(e, currentProductUnitPrice))
                                                            }}
                                                        />
                                                    </FormItem>
                                                )}
                                            />
                                        }
                                    </TableCell>
                                    <TableCell className="w-1/12">
                                        {/* Cari cara untuk re-render ini */}
                                        {isAmountDisplayed && fieldData.amount}
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="outline" size={"icon"}>
                                            <X
                                                className="h-4 w-4"
                                                type="button"
                                                onClick={() => {
                                                    remove(index)
                                                    console.log('index', index)
                                                }}
                                            />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </CardContent>
            <Separator/>
            <CardFooter className="justify-center border-t p-4">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="gap-1"
                    onClick={() =>
                      append({
                        product_id: null,
                        amount: 0,
                        currency_code: "IDR",
                        qty: 0,
                        unit_price: 10000
                      })
                    }
                  >
                    <PlusCircle className="h-3.5 w-3.5" />
                    Add New Item
                  </Button>
                </CardFooter>
        </Card>
    )
}