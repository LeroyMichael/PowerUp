"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { getProducts } from "@/lib/inventory/products/utils";
import { mappingProductLists, TProductLists } from "@/lib/purchase/utils";
import { Purchase } from "@/types/purchase";
import { PlusCircle, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { NumericFormat } from "react-number-format";


export default function PurchaseAddProductTable({}){
    const { data: session } = useSession()
    const { control, getValues, formState: {errors}, setValue, watch, register } = useFormContext<Purchase>()

    const { fields, append, remove } = useFieldArray({
        control: control,
        name: "details"

    })

    const [ productLists, setProductLists ] = useState<TProductLists[]>([])

    async function callGetProducts() {
        // Hardcode perPage so all products will be listed
        const tempProductList =
            (await getProducts(session?.user.merchant_id, { page: 1, perPage: 999}))
                .filter(product => product.sell.is_sell === true)


        setProductLists(mappingProductLists(tempProductList))
    }

    const watchDetails = watch("details")

    const subtotal = watch('details').reduce((acc, curr) => acc + curr.amount, 0)

    const setProductPrice = (productId: number) => {
        const itemPrice = productLists.find(item => item.product_id === productId)

        watch("details").map((item, index) => {

            if(item.product_id === productId){
                setValue(`details.${index}.unit_price`, itemPrice?.unit_price ?? 0)
            }
        })

    }

    const calculateAmount = (e: number | string, currentProductUnitPrice: number | string) => {
        const tempQty = Number(e)
        return tempQty * Number(currentProductUnitPrice)
    }


    useEffect(() => {
        if(session?.user.merchant_id){
            callGetProducts()
        }
    }, [session?.user.merchant_id])

    useEffect(() => {
        setValue('subtotal', subtotal)
    }, [subtotal])

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
                            <TableCell className="w-3/12">Amount</TableCell> 
                            <TableCell className="w-1/12"></TableCell> 
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {watchDetails.map((detail, index) => {

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
                                                    <FormControl>
                                                        <Select
                                                            onValueChange={(e) => {
                                                                field.onChange(Number(e))
                                                                setProductPrice(Number(e))
                                                                setValue(`details.${index}.amount`, calculateAmount(detail.qty, detail.unit_price))
                                                            }}
                                                            value={field.value?.toString()}
                                                        >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select Product" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {productLists.map((product) => {
                                                                return (
                                                                <SelectItem
                                                                    key={product.product_id}
                                                                    value={product.product_id.toString()}
                                                                >
                                                                    {product.product_name}
                                                                </SelectItem>
                                                                )
                                                            })}
                                                        </SelectContent>
                                                        </Select>                                                        
                                                    </FormControl>
                                                    <FormMessage className="absolute" />
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
                                                            value={detail.unit_price}
                                                            onChange={(e) => {
                                                                field.onChange(Number(e.target.value))
                                                                setValue(`details.${index}.amount`, calculateAmount(detail.qty, e.target.value))
                                                            }}
                                                        />
                                                        <FormMessage className="absolute" />
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
                                                                    field.onChange(Number(e.target.value))
                                                                    setValue(`details.${index}.amount`, calculateAmount(e.target.value, detail.unit_price))
                                                                }}
                                                            />
                                                        </FormControl>
                                                        <FormMessage className="absolute" />
                                                    </FormItem>
                                                )}
                                            />
                                        }
                                    </TableCell>
                                    <TableCell className="w-1/12">
                                        {isAmountDisplayed && <NumericFormat
                                            value={detail.amount}
                                            displayType={"text"}
                                            prefix={"Rp"}
                                            allowNegative={false}
                                            decimalSeparator={","}
                                            thousandSeparator={"."}
                                            fixedDecimalScale={true}
                                        />}
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="outline" size={"icon"}>
                                            <X
                                                className="h-4 w-4"
                                                type="button"
                                                onClick={() => {
                                                    remove(index)
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
                        unit_price: 0
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