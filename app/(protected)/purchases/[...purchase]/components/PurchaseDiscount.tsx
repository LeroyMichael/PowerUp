import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { numberFixedToString } from "@/lib/utils";
import { Purchase } from "@/types/purchase";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";


export default function PurchaseDiscount({}){

    const { control, formState: { errors }, watch, setValue } = useFormContext<Purchase>()

    const discountTypes = [
        {text: "Percentage", value: "PERCENTAGE"},
        {text: "Fix", value: "FIX"}
    ]

    const watchForm = watch()

    let selectedDiscountType = watchForm.discount_type
    let discountValue = watchForm.discount_value

    const calculatePriceCut = () => {
        const subtotal = watch("subtotal")
        const discount = selectedDiscountType === "PERCENTAGE" ? Number(subtotal) * (discountValue / 100)  : discountValue
        setValue("discount_price_cut", discount)

        return discount
    }

    const calculateTax = () => {
        const subtotal = watchForm.subtotal

        const discount = watchForm.discount_price_cut ?? 0
        const taxRate = watchForm.tax_rate
    
        const tax = (subtotal - discount) * taxRate / 100 
    
        setValue('tax', tax)
      }


    useEffect(() => {
        calculatePriceCut()
        calculateTax()

    }, [selectedDiscountType, discountValue, watchForm.discount_price_cut, watchForm.discount_type, watchForm.tax_rate, watchForm.subtotal])

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
                                        placeholder="Discount Value"
                                        onChange={(e) => field.onChange(Number(e.target.value))}
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
                    <div>Rp{numberFixedToString(watchForm.discount_price_cut)}</div>
                </div>
                <div className="mt-4 w-1/2">
                    <FormField
                        control={control}
                        name="tax_rate"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Tax Rate (%)</FormLabel>
                                <Input
                                    placeholder="ex. 10"
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                            </FormItem>
                        )}
                    />
                </div>
            </CardContent>
        </Card>
    )
}