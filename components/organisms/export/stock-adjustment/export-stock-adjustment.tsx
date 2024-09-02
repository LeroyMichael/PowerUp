import { ExportStockAdjustmentType } from "@/types/export-stock-adjustment";
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
import React from "react";
import { ExportInvoiceStyle } from "../styles";
import { ExportInvoiceType } from "@/types/export-invoice.d";
import ExportInvoiceHeader from "../export-invoice-header";
import ExportInvoiceFooter from "../export-invoice-footer";
import { ExportStockAdjustmentMutation } from "@/lib/export-invoice/utils";
import { StockAdjustment } from "@/types/stock-adjustment";
import { Merchant } from "@/types/company";
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
const ExportStockAdjustment = (props: {
  data: StockAdjustment;
  merchant: Merchant;
}) => {
  const sa: StockAdjustment = props.data;
  return (
    <Document>
      <Page size="A4" style={{ ...ExportInvoiceStyle.body }}>
        <div style={ExportInvoiceStyle.headerLine}></div>
        <div style={ExportInvoiceStyle.main}>
          <ExportInvoiceHeader
            data={ExportStockAdjustmentMutation({
              sa: sa,
              merchant: props.merchant,
            })}
          />
          <div style={ExportInvoiceStyle.separator}></div>

          {/* FOOTER */}
          {/* <ExportInvoiceFooter
            data={ExportStockAdjustmentMutation({ sa: sa })}
          /> */}
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

export default ExportStockAdjustment;
