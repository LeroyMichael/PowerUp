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
import { rupiah, terbilang } from "@/lib/utils";
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
      <Page size="C8" style={{ ...ExportReceiptStyle.body, width: "55mm" }}>
        <div
          style={{
            ...ExportReceiptStyle.headerLayout,
            ...{ marginBottom: 10 },
          }}
        >
          <div style={ExportReceiptStyle.headerColumnLeft}>
            <Text style={ExportReceiptStyle.textBold}>BILL TO:</Text>
            <Text style={ExportReceiptStyle.text}>
              {data.contact?.company_name}/{data.contact?.display_name}
            </Text>
            <Text style={ExportReceiptStyle.text}>
              {data.contact?.billing_address}
            </Text>
            <Text style={ExportReceiptStyle.text}>{data.contact?.email}</Text>
          </div>
          <div style={ExportReceiptStyle.headerColumnRight}>
            <Text style={ExportReceiptStyle.textBold}>INVOICE #</Text>
            <Text style={ExportReceiptStyle.textE}>
              {data.transaction_info?.transaction_number}
            </Text>
            <Text style={ExportReceiptStyle.textBold}>DATE</Text>
            <Text style={ExportReceiptStyle.textE}>
              {data.transaction_info?.transaction_date.toDateString()}
            </Text>
            <Text style={ExportReceiptStyle.textBold}>INVOICE DUE DATE</Text>
            <Text style={ExportReceiptStyle.textE}>
              {data.transaction_info?.due_date.toDateString()}
            </Text>
          </div>
        </div>
        <Text
          style={ExportReceiptStyle.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} / ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
};

export default ExportReceipt;
