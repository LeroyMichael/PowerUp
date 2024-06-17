"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Purchase } from "@/types/purchase";
import { PlusCircle } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";


export default function AddProductTable({}){

    const { control, getValues, formState: {errors} } = useFormContext<Purchase>()

    const { fields, append, remove } = useFieldArray({
        control: control,
        name: "details"
    })

    const dummyProductName = [
        {text: "Produk Name 1", value: 1},
        {text: "Produk Name 2", value: 2},
        {text: "Produk Name 3", value: 3},
    ]

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
                            <TableCell>Product</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Qty</TableCell>
                            {/* No edit, qty x price */}
                            <TableCell>Amount</TableCell> 
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {fields.map((fieldData, index) => {
                            return(
                                <TableRow key={index} className="flex-1">
                                    <TableCell>
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
                                                                key={productName.value}
                                                                value={productName.value.toString()}
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
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
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
                        amount: null,
                        currency_code: "IDR",
                        qty: null,
                        unit_price: null
                      })
                    }
                  >
                    <PlusCircle className="h-3.5 w-3.5" />
                    Add New Item
                  </Button>
                </CardFooter>
        </Card>
    )

    // return (
    //     <Table>
    //         <TableHeader className="bg-gray-100">
    //             <TableRow>
    //                 <TableHead>Product</TableHead>
    //                 <TableHead>Description</TableHead>
    //                 <TableHead>Qty</TableHead>
    //                 <TableHead>Units</TableHead>
    //                 <TableHead>Unit Price</TableHead>
    //                 <TableHead>Tax</TableHead>
    //                 <TableHead>Amount</TableHead>
    //             </TableRow>
    //         </TableHeader>
    //         <TableBody>
    //             {/* Loop this row */}
    //             {
    //                 fields.map((field, index) => {
    //                     return (
    //                       <TableRow>
    //                         <TableCell>
    //                             <FormField
    //                                 control={control}
    //                                 name={`details.${index}.product_id`}
    //                                 render={({ field }) => (
    //                                     <FormItem>
    //                                         <Select>
    //                                             <SelectTrigger>
    //                                                 <SelectValue />
    //                                             </SelectTrigger>
    //                                         </Select>
    //                                     </FormItem>
    //                                 )}
    //                             />
    //                         </TableCell>
    //                         <TableCell></TableCell>
    //                         <TableCell></TableCell>
    //                         <TableCell></TableCell>
    //                         <TableCell></TableCell>
    //                         <TableCell></TableCell>
    //                         <TableCell></TableCell>
    //                       </TableRow>
    //                     )
    //                 })
    //             }

    //         </TableBody>
    //     </Table>
    // )
}