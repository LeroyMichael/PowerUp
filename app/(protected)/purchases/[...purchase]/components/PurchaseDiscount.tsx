import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Purchase } from "@/types/purchase";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";


export default function PurchaseDiscount({}){

    const { control, formState: { errors }, getValues, watch } = useFormContext<Purchase>()

    const discountTypes = [
        {text: "Percentage", value: "PERCENTAGE"},
        {text: "Fix", value: "FIX"}
    ]

    let selectedDiscountType = getValues("discount_type")
    let discountValue = getValues("discount_value")

    const calculatePriceCut = () => {
        const subtotal = getValues("subtotal")

        return selectedDiscountType === "PERCENTAGE" ? Number(subtotal)*discountValue  : discountValue
    }

    let priceCut = calculatePriceCut()

    useEffect(() => {
        selectedDiscountType = getValues("discount_type")
        discountValue = getValues("discount_value")

        priceCut = calculatePriceCut()
        console.log('priceCut', priceCut)

    }, [watch("discount_type"), watch("discount_value")])

    return (
        <Card>
            <CardHeader>
                <CardTitle>Discount</CardTitle>
            </CardHeader>
            <Separator className="mb-4"/>
            <CardContent>
                <div className="flex gap-4">
                    <div className="w-1/2">
                        <FormField
                            control={control}
                            name="discount_type"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Discount Type</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Discount Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {discountTypes.map((type) => {
                                                return (
                                                    <SelectItem key={type.value} value={type.value}>{type.text}</SelectItem>
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
                            name="discount_value"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Discount Value</FormLabel>
                                    <Input
                                        placeholder="Input"
                                        {...field}
                                    />
                                </FormItem>
                            )}
                        />
                    </div>                    
                </div>
                <div className="justify-between flex mt-4">
                    <div>
                        <span>Price Cut</span>
                        <span> :</span>
                    </div>
                    <div>Rp{priceCut}</div>
                </div>
            </CardContent>
        </Card>
    )
}