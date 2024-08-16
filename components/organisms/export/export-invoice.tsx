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
import { ExportInvoiceStyle } from "./styles";
import { ExportInvoiceType } from "@/types/export-invoice.d";
import ExportInvoiceItems from "./export-invoice-items";
import ExportInvoiceFooter from "./export-invoice-footer";
import ExportInvoiceHeader from "./export-invoice-header";
import ExportInvoiceTransactionDetails from "./export-invoice-transaction-details";
import ExportInvoiceReceipt from "./export-invoice-receipt";
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

const ExportInvoice = (props: { data: ExportInvoiceType }) => {
  const data: ExportInvoiceType = props.data;
  return (
    <Document>
      <Page size="A4" style={{ ...ExportInvoiceStyle.body }}>
        <div style={ExportInvoiceStyle.headerLine}></div>
        <div style={ExportInvoiceStyle.main}>
          <ExportInvoiceHeader data={data} />
          <div style={ExportInvoiceStyle.separator}></div>
          <ExportInvoiceTransactionDetails data={data} />

          {/* Items */}
          <ExportInvoiceItems data={data} />

          {/* Receipt */}
          <ExportInvoiceReceipt data={data} />

          {/* FOOTER */}
          <ExportInvoiceFooter data={data} />
        </div>

        <Text
          style={ExportInvoiceStyle.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} / ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
};

export default ExportInvoice;
