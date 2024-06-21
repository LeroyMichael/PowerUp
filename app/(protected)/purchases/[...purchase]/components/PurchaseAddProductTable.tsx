"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Purchase, PurchaseProductList } from "@/types/purchase";
import { PlusCircle, X } from "lucide-react";
import { ChangeEvent, useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";


export default function PurchaseAddProductTable({}){

    const { control, getValues, formState: {errors}, setValue, watch, register } = useFormContext<Purchase>()

    const { fields, append, remove } = useFieldArray({
        control: control,
        name: "details"
    })
    // ini perlu di set supaya dapet unit_pricej uga
    const dummyProducts = [
        {text: "Produk Name 1", product_id: 1, unit_price: 10000},
        {text: "Produk Name 2", product_id: 2, unit_price: 20000},
        {text: "Produk Name 3", product_id: 3, unit_price: 30000},
    ]

    console.log('fields', fields)

    // CHANGE ANY TYPE WHEN INTEGRATING
    const setProductPrice = (input: any) => {
        const itemPrice = dummyProducts.filter(item => item.product_id === Number(input))?.[0]?.unit_price

        getValues("details").map((item, index) => {
            if(item.product_id === input){
                setValue(`details.${index}.unit_price`, itemPrice)
            }
        })

    }

    const calculateAmount = (e: number | string, currentProductUnitPrice: number | string) => {
        const tempQty = Number(e)
        return tempQty * Number(currentProductUnitPrice)
    }

    useEffect(() => {
        const details: PurchaseProductList[] = getValues("details")
        const subtotal = details.reduce((prev, curr) => prev + curr.amount, 0)

        setValue('subtotal', subtotal)
        console.log('run useEffect watch()')
    }, fields)

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
                                <TableRow key={fieldData.id} className="flex-1">
                                    <TableCell className="w-2/12">
                                        <FormField
                                            control={control}
                                            name={`details.${index}.product_id`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Select
                                                            onValueChange={(e) => {
                                                                field.onChange(e)
                                                                setProductPrice(e)
                                                            }}
                                                            value={field.value?.toString()}
                                                        >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select Product" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {dummyProducts.map((product) => {
                                                                return (
                                                                <SelectItem
                                                                    key={product.product_id}
                                                                    value={product.product_id.toString()}
                                                                >
                                                                    {product.text}
                                                                </SelectItem>
                                                                )
                                                            })}
                                                        </SelectContent>
                                                        </Select>                                                        
                                                    </FormControl>
                                                </FormItem>
                                            ) }
                                        />
                                    </TableCell>
                                    <TableCell className="w-1/12">
                                        {isProductIsSelected && 
                                            <FormField
                                                control={control}
                                                name={`details.${index}.unit_price`}
                                                render={({field}) => (
                                                    <FormItem>
                                                        <Input
                                                            placeholder="0"
                                                            defaultValue={watch(`details.${index}.unit_price`)}
                                                            onChange={(e) => {
                                                                field.onChange(e)
                                                                setValue(`details.${index}.amount`, calculateAmount(getValues(`details.${index}.qty`), e.target.value))
                                                            }}
                                                        />
                                                    </FormItem>
                                                )}
                                            />}
                                    </TableCell>
                                    <TableCell className="w-1/12">
                                        {isProductIsSelected && 
                                            <FormField
                                                control={control}
                                                name={`details.${index}.qty`}
                                                render={({field}) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="0"
                                                                onChange={(e) => {
                                                                    field.onChange(e)
                                                                    setValue(`details.${index}.amount`, calculateAmount(e.target.value, currentProductUnitPrice))
                                                                }}
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        }
                                    </TableCell>
                                    <TableCell className="w-1/12">
                                        {/* Cari cara untuk re-render ini */}
                                        {isAmountDisplayed && watch().details[index].amount}
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