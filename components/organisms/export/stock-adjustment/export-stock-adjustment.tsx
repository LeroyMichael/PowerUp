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
import ExportStockAdjustmentDetails from "./export-stock-adjustment-details";
import ExportStockAdjustmentItems from "./export-stock-adjustment-items";
import { Product } from "@/types/product";
import ExportStockAdjustmentFooter from "./export-stock-adjustment-footer";
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
  products: Array<Product>;
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
          <ExportStockAdjustmentDetails data={sa} />
          <ExportStockAdjustmentItems data={sa} products={props.products} />
          {/* FOOTER */}
          <ExportStockAdjustmentFooter data={sa} />
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
