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

    const dummyWallets = [
        { text: "Wallet name 1", value: 1 },
        { text: "Wallet name 2", value: 2 },
        { text: "Wallet name 3", value: 3 }
    ]

    return (
      <>
        <Card>
            <CardHeader>
                <CardTitle>
                    Payment
                </CardTitle>
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
                <FormField
                    control={control}
                    name="wallet_id"
                    render={({field}) => (
                        <FormItem className="mt-4">
                            <FormLabel>Wallet</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                value={field.value?.toString()}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Wallet" />
                                </SelectTrigger>
                                <SelectContent>
                                    {dummyWallets.map((wallet) => {
                                        return (
                                            <SelectItem
                                                key={wallet.value}
                                                value={wallet.value.toString()}
                                            >
                                                {wallet.text}
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