import { Sale, SalesType } from "@/types/sale.d";
import { numberFixedToString } from "../utils";
import { ExportInvoiceType } from "@/types/export-invoice.d";

export type TGetListsParams = {
  sale_data: Sale;
};

export function convertExportInvoiceMutation(
  params: TGetListsParams
): ExportInvoiceType {
  params.sale_data.subtotal = params.sale_data.subtotal ?? 0;
  params.sale_data.discount_price_cut =
    params.sale_data.discount_price_cut ?? 0;
  params.sale_data.tax = params.sale_data.tax ?? 0;
  params.sale_data.down_payment_amount =
    params.sale_data.down_payment_amount ?? 0;
  params.sale_data.delivery_amount = params.sale_data.delivery_amount ?? 0;
  params.sale_data.subtotal = params.sale_data.subtotal ?? 0;
  params.sale_data.tax_rate = params.sale_data.tax_rate ?? 0;
  params.sale_data.discount_value = params.sale_data.discount_value ?? 0;
  params.sale_data.total = params.sale_data.total ?? 0;

  const totalAfterDiscount =
    params.sale_data.subtotal - params.sale_data.discount_price_cut;
  const totalTax = totalAfterDiscount * (params.sale_data.tax_rate / 100);
  const total = totalAfterDiscount + totalTax;
  const totalDP =
    params.sale_data.down_payment_type == "RATE"
      ? (total * params.sale_data.down_payment_amount) / 100
      : params.sale_data.down_payment_amount;

  let grandTotal = total + params.sale_data.delivery_amount;
  if (totalDP != 0) {
    if (params.sale_data.transaction_type != "Penawaran") {
      if (params.sale_data.is_last_installment) {
        grandTotal =
          Math.abs(total - totalDP) + params.sale_data.delivery_amount;
      } else {
        grandTotal = totalDP + params.sale_data.delivery_amount;
      }
    }
  }

  return {
    transaction_info: {
      transaction_number: params.sale_data.transaction_number ?? "",
      transaction_date: params.sale_data.transaction_date ?? new Date(),
      transaction_type: params.sale_data.transaction_type ?? "invoice",
      payment_method: params.sale_data.payment_method ?? "",
      due_date: params.sale_data.due_date ?? new Date(),
      status: params.sale_data.status ?? "",
      memo: params.sale_data.memo ?? "",
      currency_code: "IDR",
      estimated_time: params.sale_data.estimated_time ?? "",
      is_presigned: params.sale_data.is_presigned ?? false,
      is_last_installment: params.sale_data.is_last_installment ?? false,
      is_purchase_agreement: params.sale_data.is_purchase_agreement ?? false,
    },
    merchant: {
      ...params.sale_data.merchant,
      logo: params.sale_data.merchant?.logo ?? "",
    },
    contact: params.sale_data.contact,
    transaction_details: {
      subtotal: params.sale_data.subtotal,
      tax_rate: params.sale_data.tax_rate,
      tax: params.sale_data.tax,
      discount_type: params.sale_data.discount_type,
      discount_value: params.sale_data.discount_value,
      discount_price_cut: params.sale_data.discount_price_cut,
      total: params.sale_data.total,
      down_payment_amount: params.sale_data.down_payment_amount,
      down_payment_type: params.sale_data.down_payment_type,
      delivery_method: params.sale_data.delivery_method,
      delivery_amount: params.sale_data.delivery_amount,
    },

    items: params.sale_data.details?.map((detail) => {
      return { ...detail };
    }),
    calculated: {
      total_tax: totalTax,
      total_dp: totalDP,
      grand_total: grandTotal,
    },
  };
}
