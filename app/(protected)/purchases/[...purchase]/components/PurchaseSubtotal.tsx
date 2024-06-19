import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Purchase } from "@/types/purchase";
import { useFormContext } from "react-hook-form";


export default function PurchaseSubtotal({}){

  const { getValues } = useFormContext<Purchase>()


    return(
      <Card>
        <CardHeader>
          <CardTitle>Total</CardTitle>
        </CardHeader>
        <Separator className="mb-4"/>
        <CardContent className="p-4">
          <div>
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>Rp{getValues("total")}</span>
            </div>

            <hr className="border border-gray-300 my-2"/>

            <div className="flex justify-between">
              <span>Total</span>
              <span>Rp0,00</span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
}