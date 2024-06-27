import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Purchase } from "@/types/purchase";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { NumericFormat } from "react-number-format";


export default function PurchaseSubtotal({}){

  const { watch, setValue } = useFormContext<Purchase>()

  const watchForm = watch()

  const calculateTotal = () => {
    const total = watchForm.subtotal - (watchForm.discount_price_cut ?? 0) + watchForm.tax
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
              <NumericFormat
                value={watchForm.subtotal}
                displayType={"text"}
                prefix={"Rp"}
                allowNegative={false}
                decimalSeparator={","}
                thousandSeparator={"."}
                fixedDecimalScale={true}
              />
            </div>

            <div className="flex justify-between">
              <span>Discount</span>
              <NumericFormat
                value={watchForm.discount_price_cut}
                displayType={"text"}
                prefix={"-Rp"}
                allowNegative={false}
                decimalSeparator={","}
                thousandSeparator={"."}
                fixedDecimalScale={true}
              />
            </div>

            <div className="flex justify-between">
              <span>Tax {watchForm.tax_rate && `(${watchForm.tax_rate}%)`}</span>
              <NumericFormat
                value={watchForm.tax}
                displayType={"text"}
                prefix={"Rp"}
                allowNegative={false}
                decimalSeparator={","}
                thousandSeparator={"."}
                fixedDecimalScale={true}
              />
            </div>

            <Separator/>

            <div className="flex justify-between">
              <span>Total</span>
              <NumericFormat
                value={watchForm.total}
                displayType={"text"}
                prefix={"Rp"}
                allowNegative={false}
                decimalSeparator={","}
                thousandSeparator={"."}
                fixedDecimalScale={true}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    )
}