import { Product } from "@/types/product";
import { Purchase, PurchaseMutation } from "@/types/purchase";
import { format } from "date-fns";
import { numberFixedToString } from "../utils";

export type TProductLists = {
    product_id: number,
    product_name: string,
    unit_price: number,
}

export function mappingProductLists(rawProductLists: Product[]): TProductLists[]{
    
    const newProductList: TProductLists[] = rawProductLists.map((product) => {
        return {
            product_id: product.product_id,
            product_name: product.name,
            unit_price: Number(product.sell.sell_price),
        }
    })

    return newProductList
}

export function convertPurchaseMutation(purchaseData: Purchase): PurchaseMutation{
    return {
        ...purchaseData,
        transaction_date: format(purchaseData.transaction_date, "dd-MM-yyyy"),
        due_date: format(purchaseData.due_date, "dd-MM-yyyy"),
        subtotal: numberFixedToString(purchaseData.subtotal),
        tax: numberFixedToString(purchaseData.tax),
        tax_rate: purchaseData.tax_rate.toString(),
        discount_value: numberFixedToString(purchaseData.discount_value),
        discount_price_cut: numberFixedToString(purchaseData.discount_price_cut),
        total: numberFixedToString(purchaseData.total),
        details: purchaseData.details.map((detail) => {
            return {
                ...detail,
                unit_price: numberFixedToString(detail.unit_price),
                amount: numberFixedToString(detail.amount)
            }
        })
    }
}

export async function createPurchase(body: PurchaseMutation){

    await fetch(`${process.env.NEXT_PUBLIC_URL}/api/purchases`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body),
        redirect: "follow"
    }).catch((e) => {
        throw new Error("Failed to create purchase", e)
    })

}
