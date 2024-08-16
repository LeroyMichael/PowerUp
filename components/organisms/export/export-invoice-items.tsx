import React from "react";
import { ExportInvoiceStyle } from "./styles";
import { Text, View } from "@react-pdf/renderer";
import { ExportInvoiceType } from "@/types/export-invoice.d";
import { rupiah } from "@/lib/utils";

const ExportInvoiceItems = (props: { data: ExportInvoiceType }) => {
  return (
    <View>
      <View style={ExportInvoiceStyle.tableRowHeader}>
        <View style={ExportInvoiceStyle.tableCol}>
          <Text style={ExportInvoiceStyle.tableCell}>
            NAMA BARANG DAN DESKRIPSI
          </Text>
        </View>
        <View style={ExportInvoiceStyle.tableColQty}>
          <Text style={ExportInvoiceStyle.tableCell}>QTY</Text>
        </View>
        <View style={ExportInvoiceStyle.tableColPrice}>
          <Text style={ExportInvoiceStyle.tableCell}>HARGA SATUAN</Text>
        </View>
        <View style={ExportInvoiceStyle.tableColPrice}>
          <Text style={ExportInvoiceStyle.tableCell}>TOTAL HARGA</Text>
        </View>
      </View>
      {/* Iterator */}

      {props.data.items?.map((item: any, id: any) => {
        return (
          <View key={id} style={ExportInvoiceStyle.tableRow}>
            <View style={ExportInvoiceStyle.tableCol}>
              {item.product_name && (
                <Text
                  style={{
                    ...ExportInvoiceStyle.tableCellCenter,
                    marginBottom: "-5px",
                  }}
                >
                  {item.product_name}
                </Text>
              )}
              <Text style={ExportInvoiceStyle.tableCellCenter}>
                {item.description}
              </Text>
            </View>
            <View style={ExportInvoiceStyle.tableColQty}>
              <Text style={ExportInvoiceStyle.tableCell}>{item.qty}</Text>
            </View>
            <View style={ExportInvoiceStyle.tableColPrice}>
              <Text style={ExportInvoiceStyle.tableCell}>
                {rupiah(item.unit_price)}
              </Text>
            </View>
            <View style={ExportInvoiceStyle.tableColPrice}>
              <Text style={ExportInvoiceStyle.tableCell}>
                {rupiah(item.unit_price * item.qty)}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default ExportInvoiceItems;
