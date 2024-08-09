import { Text, View } from "@react-pdf/renderer";
import React from "react";
import { rupiah, terbilang } from "@/lib/utils";
import { ExportInvoiceType } from "@/types/export-invoice.d";
import { ExportInvoiceStyle } from "./styles";

const ExportInvoiceReceipt = (props: { data: ExportInvoiceType }) => {
  const data: ExportInvoiceType = props.data;
  return (
    <>
      <View style={ExportInvoiceStyle.tableRow}>
        <View style={ExportInvoiceStyle.tableColFoot}></View>
        <View style={ExportInvoiceStyle.tableColQtyFoot}></View>
        <View style={ExportInvoiceStyle.tableColPriceFoot}>
          <Text style={ExportInvoiceStyle.tableCell}>SUBTOTAL</Text>
        </View>
        <View style={ExportInvoiceStyle.tableColPriceFoot}>
          <Text style={ExportInvoiceStyle.tableCell}>
            {rupiah(data.transaction_details?.subtotal ?? 0)}
          </Text>
        </View>
      </View>
      {data.transaction_details?.discount_price_cut && (
        <>
          <View style={ExportInvoiceStyle.tableRow}>
            <View style={ExportInvoiceStyle.tableColFoot}></View>
            <View style={ExportInvoiceStyle.tableColQtyFoot}></View>
            <View style={ExportInvoiceStyle.tableColPriceFoot}>
              <Text style={ExportInvoiceStyle.tableCell}>DISCOUNT</Text>
            </View>
            <View style={ExportInvoiceStyle.tableColPriceFoot}>
              <Text style={ExportInvoiceStyle.tableCell}>
                -{rupiah(data.transaction_details?.discount_price_cut!)}
              </Text>
            </View>
          </View>
        </>
      )}

      {data.transaction_details?.tax_rate && (
        <>
          <View style={ExportInvoiceStyle.tableRow}>
            <View style={ExportInvoiceStyle.tableColFoot}></View>
            <View style={ExportInvoiceStyle.tableColQtyFoot}></View>
            <View style={ExportInvoiceStyle.tableColPriceFoot}>
              <Text style={ExportInvoiceStyle.tableCell}>
                TAX {data.transaction_details?.tax_rate!}%
              </Text>
            </View>
            <View style={ExportInvoiceStyle.tableColPriceFoot}>
              <Text style={ExportInvoiceStyle.tableCell}>
                {rupiah(data.calculated?.total_tax)}
              </Text>
            </View>
          </View>
        </>
      )}
      {data.calculated?.total_dp && (
        <>
          <View style={ExportInvoiceStyle.tableRow}>
            <View style={ExportInvoiceStyle.tableColFoot}></View>
            <View style={ExportInvoiceStyle.tableColQtyFoot}></View>
            <View style={ExportInvoiceStyle.tableColPriceFootHighlight}>
              <Text style={ExportInvoiceStyle.tableCell}>
                {data.transaction_info.is_last_installment
                  ? `PELUNASAN 1`
                  : "TOTAL DP"}{" "}
                {data.transaction_details?.down_payment_type === "RATE" &&
                  `(${data.transaction_details?.down_payment_amount} %)`}
              </Text>
            </View>
            <View style={ExportInvoiceStyle.tableColPriceFootHighlight}>
              <Text style={ExportInvoiceStyle.tableCell}>
                {data.transaction_info.is_last_installment && "-"}
                {rupiah(data.calculated?.total_dp)}
              </Text>
            </View>
          </View>
        </>
      )}
      {data.transaction_details?.delivery_amount && (
        <>
          <View style={ExportInvoiceStyle.tableRow}>
            <View style={ExportInvoiceStyle.tableColFoot}></View>
            <View style={ExportInvoiceStyle.tableColQtyFoot}></View>
            <View style={ExportInvoiceStyle.tableColPriceFoot}>
              <Text style={ExportInvoiceStyle.tableCell}>PENGIRIMAN</Text>
            </View>
            <View style={ExportInvoiceStyle.tableColPriceFoot}>
              <Text style={ExportInvoiceStyle.tableCell}>
                {rupiah(data.transaction_details?.delivery_amount!)}
              </Text>
            </View>
          </View>
        </>
      )}

      <div>
        <Text style={ExportInvoiceStyle.totalPrice}>
          {rupiah(data.calculated?.grand_total)}
        </Text>
        <Text
          style={{
            ...ExportInvoiceStyle.textBold,
            ...{ textAlign: "right", marginBottom: 10 },
          }}
        >
          {terbilang(data.calculated?.grand_total) + " RUPIAH"}
        </Text>
      </div>
    </>
  );
};

export default ExportInvoiceReceipt;
