import React from "react";
import { ExportInvoiceStyle } from "../styles";
import { Text, View } from "@react-pdf/renderer";
import { rupiah } from "@/lib/utils";
import { StockAdjustment } from "@/types/stock-adjustment";
import { Product } from "@/types/product";

const ExportStockAdjustmentItems = (props: {
  data: StockAdjustment;
  products: Array<Product>;
}) => {
  return (
    <View>
      <View style={ExportInvoiceStyle.tableRowHeader}>
        <View style={ExportInvoiceStyle.tableCol4First}>
          <Text style={ExportInvoiceStyle.tableCell}>Nama Barang</Text>
        </View>
        <View style={ExportInvoiceStyle.tableCol4}>
          <Text style={ExportInvoiceStyle.tableCell}>Quantity Sebelum </Text>
        </View>
        <View style={ExportInvoiceStyle.tableCol4}>
          <Text style={ExportInvoiceStyle.tableCell}>Quantity Sesudah</Text>
        </View>
        <View style={ExportInvoiceStyle.tableCol4}>
          <Text style={ExportInvoiceStyle.tableCell}>Perbedaan</Text>
        </View>
      </View>
      {/* Iterator */}

      {props.data.details?.map((item: any, id: any) => {
        const temp: Product | null =
          props.products.find(
            (product: Product) => product.product_id == item.product_id
          ) ?? null;
        return (
          <View key={id} style={ExportInvoiceStyle.tableRow}>
            <View style={ExportInvoiceStyle.tableCol4First}>
              <Text style={ExportInvoiceStyle.tableCell}>{temp?.name}</Text>
            </View>
            <View style={ExportInvoiceStyle.tableCol4}>
              <Text style={ExportInvoiceStyle.tableCell}>
                {`${item.pre_qty ?? temp?.qty} ${temp?.unit}`}
              </Text>
            </View>
            <View style={ExportInvoiceStyle.tableCol4}>
              <Text style={ExportInvoiceStyle.tableCell}>
                {`${Number(temp?.qty ?? 0) + Number(item.difference)} ${
                  temp?.unit
                }`}
              </Text>
            </View>
            <View style={ExportInvoiceStyle.tableCol4}>
              <Text style={ExportInvoiceStyle.tableCell}>
                {`${item.difference} ${temp?.unit}`}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default ExportStockAdjustmentItems;
