import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ExpensesFormDataType } from "@/types/expenses";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";


export default function ExpenseTax({}){

    const { control, watch, setValue } = useFormContext<ExpensesFormDataType>()

    const watchForm = watch()

    const calculateTax = () => {
        const subtotal = watchForm.subtotal

        const taxRate = watchForm.tax_rate
    
        const tax = Math.floor(subtotal * taxRate / 100 )
    
        setValue('tax', tax)
      }


    useEffect(() => {
        calculateTax()
    }, [watchForm.tax_rate, watchForm.subtotal])

    return (
        <Card>
            <CardHeader>
                <CardTitle>Discount</CardTitle>
            </CardHeader>
            <Separator className="mb-4"/>
            <CardContent>
                <div className="mt-4 w-1/2">
                    <FormField
                        control={control}
                        name="tax_rate"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Tax Rate (%)</FormLabel>
                                <Input
                                    placeholder="ex. 10"
                                    value={watchForm.tax_rate}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                                <FormMessage className="absolute" />
                            </FormItem>
                        )}
                    />
                </div>
            </CardContent>
        </Card>
    )
}