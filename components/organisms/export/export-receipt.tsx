/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import { NumericFormat } from "react-number-format";
import {
  Page,
  Text,
  Image,
  Document,
  StyleSheet,
  Canvas,
  View,
  Font,
} from "@react-pdf/renderer";
import customStyles from "./export-invoice.module.css";
import moment from "moment";
import { numberToPriceFormat, rupiah, terbilang } from "@/lib/utils";
import { ProfileFormValues } from "@/types/transaction-schema";
import { useFormContext } from "react-hook-form";
import { ExportReceiptStyle } from "./styles";
import { ExportInvoiceType } from "@/types/export-invoice.d";
import ExportInvoiceItems from "./export-invoice-items";
import ExportInvoiceFooter from "./export-invoice-footer";
import ExportInvoiceHeader from "./export-invoice-header";
import ExportInvoiceTransactionDetails from "./export-invoice-transaction-details";
import ExportInvoiceReceipt from "./export-invoice-receipt";
import { OfferDetails, OfferFooter } from "./types/offer";
import { format } from "date-fns";
Font.register({
  family: "Inter",
  fonts: [
    {
      src: "/fonts/Inter-Regular.ttf",
      fontWeight: 400,
    },
    {
      src: "/fonts/Inter.ttf",
      fontWeight: 700,
    },
  ],
});

const ExportReceipt = (props: { data: ExportInvoiceType }) => {
  const data: ExportInvoiceType = props.data;
  return (
    <Document>
      <Page size="C8" style={{ ...ExportReceiptStyle.body }} wrap={false}>
        <View
          style={{
            display: "flex",
            width: "100%",
            marginBottom: "10px",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Image
            style={{ ...ExportReceiptStyle.image }}
            src={`/logo/${props.data.merchant?.merchant_id ?? 7}.png`}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "left",
              marginLeft: "7px",
            }}
          >
            <Text style={ExportReceiptStyle.textBold}>
              {data.merchant?.name}
            </Text>
            <Text style={{ ...ExportReceiptStyle.text, fontSize: 6 }}>
              {data.merchant?.address}
            </Text>
          </div>
        </View>
        <Text style={ExportReceiptStyle.text}>
          No: {data.transaction_info?.transaction_number}
        </Text>
        <Text style={ExportReceiptStyle.text}>
          To: {data.contact?.first_name}
        </Text>
        <Text style={ExportReceiptStyle.text}>
          Date:{" "}
          {format(
            data.transaction_info?.transaction_date ?? new Date(),
            "dd-MM-yyy"
          )}{" "}
          {format(new Date(), "HH:mm")}
        </Text>
        <div
          style={{
            ...ExportReceiptStyle.headerLayout,
            ...{ marginBottom: 10 },
          }}
        >
          <div style={ExportReceiptStyle.headerColumnLeft}></div>
          <div style={ExportReceiptStyle.headerColumnRight}></div>
        </div>

        <View>
          <View style={ExportReceiptStyle.tableRowHeader}>
            <View style={{ width: "15%" }}>
              <Text>QTY</Text>
            </View>
            <View style={ExportReceiptStyle.tableCol}>
              <Text style={ExportReceiptStyle.tableCell}>ITEM</Text>
            </View>
            <View style={ExportReceiptStyle.tableColPrice}>
              <Text style={ExportReceiptStyle.tableCell}>TOTAL</Text>
            </View>
          </View>
          <div style={ExportReceiptStyle.separator}></div>
          {/* Iterator */}

          {data.items?.map((item: any, id: any) => {
            return (
              <View key={id} style={ExportReceiptStyle.tableRow}>
                <View style={{ width: "15%" }}>
                  <Text>{numberToPriceFormat(item.qty)}</Text>
                </View>
                <View style={ExportReceiptStyle.tableCol}>
                  {item.product_name && (
                    <Text style={ExportReceiptStyle.tableCell}>
                      {item.product_name}
                    </Text>
                  )}
                </View>
                <View style={ExportReceiptStyle.tableColPrice}>
                  <Text style={ExportReceiptStyle.tableCell}>
                    {numberToPriceFormat(item.unit_price * item.qty)}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
        <div style={ExportReceiptStyle.separator}></div>
        <View style={ExportReceiptStyle.tableRowHeader}>
          <View style={{ width: "15%" }}></View>
          <View style={ExportReceiptStyle.tableCol}>
            <Text style={ExportReceiptStyle.tableCell}>Subtotal</Text>
          </View>
          <View style={ExportReceiptStyle.tableColPrice}>
            <Text style={ExportReceiptStyle.tableCell}>
              {numberToPriceFormat(data.transaction_details?.subtotal)}
            </Text>
          </View>
        </View>
        <View style={ExportReceiptStyle.tableRowHeader}>
          <View style={{ width: "15%" }}></View>
          <View style={ExportReceiptStyle.tableCol}>
            <Text style={ExportReceiptStyle.tableCell}>Discount</Text>
          </View>
          <View style={ExportReceiptStyle.tableColPrice}>
            <Text style={ExportReceiptStyle.tableCell}>
              {numberToPriceFormat(
                data.transaction_details?.discount_price_cut
              )}
            </Text>
          </View>
        </View>
        <View style={ExportReceiptStyle.tableRowHeader}>
          <View style={{ width: "15%" }}></View>
          <View style={ExportReceiptStyle.tableCol}>
            <Text style={ExportReceiptStyle.tableCell}>Tax</Text>
          </View>
          <View style={ExportReceiptStyle.tableColPrice}>
            <Text style={ExportReceiptStyle.tableCell}>
              {numberToPriceFormat(data.calculated?.total_tax)}
            </Text>
          </View>
        </View>
        <View style={ExportReceiptStyle.tableRowHeader}>
          <View style={{ width: "15%" }}></View>
          <View style={ExportReceiptStyle.tableCol}>
            <Text style={ExportReceiptStyle.tableCell}>Delivery</Text>
          </View>
          <View style={ExportReceiptStyle.tableColPrice}>
            <Text style={ExportReceiptStyle.tableCell}>
              {numberToPriceFormat(data.transaction_details?.delivery_amount)}
            </Text>
          </View>
        </View>
        <div style={ExportReceiptStyle.separator}></div>
        <View style={ExportReceiptStyle.tableRowHeader}>
          <View style={{ width: "15%" }}></View>
          <View style={ExportReceiptStyle.tableCol}>
            <Text style={ExportReceiptStyle.tableCell}>Total</Text>
          </View>
          <View style={ExportReceiptStyle.tableColPrice}>
            <Text style={ExportReceiptStyle.tableCell}>
              {numberToPriceFormat(data.calculated?.grand_total)}
            </Text>
          </View>
        </View>
        <div style={ExportReceiptStyle.separator}></div>
        <Text style={{ marginTop: "10px" }}>Thank You for your order!</Text>
      </Page>
    </Document>
  );
};

export default ExportReceipt;
