import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Purchase } from "@/types/purchase";
import { useFormContext } from "react-hook-form";


export default function PurchaseMemo({}){

    const { control } = useFormContext<Purchase>()

    return (
        <Card>
            <CardHeader>
                <CardTitle>Memo</CardTitle>
            </CardHeader>
            <Separator className="mb-4"/>
            <CardContent>
                <FormField
                    control={control}
                    name="memo"
                    render={({field}) => (
                        <FormItem>
                            <Textarea
                                placeholder="Your notes. . ."
                                {...field}
                                />
                        </FormItem>
                    )}
                    />
            </CardContent>
        </Card>
    )
}