import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { numberFixedToString } from "@/lib/utils";
import { Purchase } from "@/types/purchase";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";


export default function PurchaseSubtotal({}){

  const { watch, setValue, formState: { errors } } = useFormContext<Purchase>()

  const watchForm = watch()

  const calculateTax = () => {
    const subtotal = watchForm.subtotal
    const discount = watchForm.discount_price_cut ?? 0
    const taxRate = watchForm.tax_rate

    const tax = (subtotal - discount) * taxRate / 100 

    return tax
  }

  const calculateTotal = () => {
    const total = watchForm.subtotal - (watchForm.discount_price_cut ?? 0) - watchForm.tax
    setValue('total', total)
    return total
  }

  useEffect(() => {
    calculateTotal()
  }, [watchForm.discount_price_cut, watchForm.tax, watchForm.discount_type, watchForm.details])

    return(
      <Card>
        <CardHeader>
          <CardTitle>Total</CardTitle>
        </CardHeader>
        <Separator className="mb-4"/>
        <CardContent className="p-4">
          <div className="flex flex-col gap-y-1">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>Rp{numberFixedToString(watch("subtotal"))}</span>
            </div>

            <div className="flex justify-between">
              <span>Discount</span>
              <span>Rp{numberFixedToString(watchForm.discount_price_cut)}</span>
            </div>

            <div className="flex justify-between">
              <span>Tax</span>
              <span>Rp{numberFixedToString(watchForm.tax)} </span>
            </div>

            <Separator/>

            <div className="flex justify-between">
              <span>Total</span>
              <span>Rp{numberFixedToString(watchForm.total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
}