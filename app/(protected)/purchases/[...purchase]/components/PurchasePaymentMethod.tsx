import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Purchase } from "@/types/purchase"
import { useFormContext } from "react-hook-form"



export default function PurchasePaymentMethod(){

    const { control, getValues, formState: {errors} } = useFormContext<Purchase>()

    const paymentMethods = [
        {text: "Cash", value: "CASH"},
    ]

    return (
      <>
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
            <CardContent className="mt-4">
                <FormField
                    control={control}
                    name="payment_method"
                    render={({field}) => (
                    <FormItem>
                        <FormLabel>Payment Method</FormLabel>
                        <Select
                            onValueChange={field.onChange}
                            value={field.value?.toString()}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Payment Method" />
                            </SelectTrigger>
                            <SelectContent>
                                {paymentMethods.map((paymentMethod) => {
                                    return (
                                    <SelectItem
                                        key={paymentMethod.value}
                                        value={paymentMethod.value.toString()}
                                    >
                                        {paymentMethod.text}
                                    </SelectItem>
                                    )
                                })}
                            </SelectContent>
                        </Select>
                    </FormItem>
                    )}
                />
            </CardContent>
        </Card>
      </>
    )
}