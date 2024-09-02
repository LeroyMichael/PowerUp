import React from "react";
import { ExportInvoiceStyle } from "../styles";
import { Image, Text, View } from "@react-pdf/renderer";
import { StockAdjustment } from "@/types/stock-adjustment";
import { capitalize } from "lodash";

const ExportStockAdjustmentDetails = (props: { data: StockAdjustment }) => {
  const data: StockAdjustment = props.data;
  return (
    <div
      style={{
        ...ExportInvoiceStyle.headerLayout,
        ...{ marginBottom: 10 },
      }}
    >
      <div style={ExportInvoiceStyle.headerColumnLeft}>
        <Text style={ExportInvoiceStyle.textBold}>Category</Text>
        <Text style={ExportInvoiceStyle.text}>
          {capitalize(data.sa_category_label)}
        </Text>
        <Text style={ExportInvoiceStyle.textBold}>Description</Text>
        <Text style={ExportInvoiceStyle.textE}>{data.memo}</Text>
      </div>
      <div style={ExportInvoiceStyle.headerColumnRight}>
        <Text style={ExportInvoiceStyle.textBold}>Stock Adjustment #</Text>
        <Text style={ExportInvoiceStyle.textE}>{data.transaction_number}</Text>
        <Text style={ExportInvoiceStyle.textBold}>Date</Text>
        <Text style={ExportInvoiceStyle.textE}>
          {data.transaction_date.toDateString()}
        </Text>
      </div>
    </div>
  );
};

export default ExportStockAdjustmentDetails;
