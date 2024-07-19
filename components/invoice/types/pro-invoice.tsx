import { Text, View } from "@react-pdf/renderer";
import React from "react";
import { styles } from "../invoice-generator";
import { rupiah } from "@/lib/utils";
import { ProfileFormValues } from "@/types/transaction-schema";

const ProInvoice = (props: {
  data: ProfileFormValues;
  totalTax: number;
  totalDP: number;
}) => {
  return (
    <>
      <View style={styles.tableRow}>
        <View style={styles.tableColFoot}></View>
        <View style={styles.tableColQtyFoot}></View>
        <View style={styles.tableColPriceFoot}>
          <Text style={styles.tableCell}>SUBTOTAL</Text>
        </View>
        <View style={styles.tableColPriceFoot}>
          <Text style={styles.tableCell}>
            {rupiah(props.data.subtotal ? props.data.subtotal : 0)}
          </Text>
        </View>
      </View>

      {props.data.discount ? (
        <View style={styles.tableRow}>
          <View style={styles.tableColFoot}></View>
          <View style={styles.tableColQtyFoot}></View>
          <View style={styles.tableColPriceFoot}>
            <Text style={styles.tableCell}>DISCOUNT</Text>
          </View>
          <View style={styles.tableColPriceFoot}>
            <Text style={styles.tableCell}>{rupiah(props.data.discount!)}</Text>
          </View>
        </View>
      ) : (
        <></>
      )}

      {props.data.tax ? (
        <View style={styles.tableRow}>
          <View style={styles.tableColFoot}></View>
          <View style={styles.tableColQtyFoot}></View>
          <View style={styles.tableColPriceFoot}>
            <Text style={styles.tableCell}>TAX {props.data.tax!}%</Text>
          </View>
          <View style={styles.tableColPriceFoot}>
            <Text style={styles.tableCell}>{rupiah(props.totalTax)}</Text>
          </View>
        </View>
      ) : (
        <></>
      )}
      {props.data.dp ? (
        <View style={styles.tableRow}>
          <View style={styles.tableColFoot}></View>
          <View style={styles.tableColQtyFoot}></View>
          <View style={styles.tableColPriceFootHighlight}>
            <Text style={styles.tableCell}>DP RATE</Text>
          </View>
          <View style={styles.tableColPriceFootHighlight}>
            <Text style={styles.tableCell}>
              {props.data.dp ? props.data.dp : 0}%
            </Text>
          </View>
        </View>
      ) : (
        <></>
      )}
      {props.totalDP ? (
        <View style={styles.tableRow}>
          <View style={styles.tableColFoot}></View>
          <View style={styles.tableColQtyFoot}></View>
          <View style={styles.tableColPriceFootHighlight}>
            <Text style={styles.tableCell}>TOTAL DP</Text>
          </View>
          <View style={styles.tableColPriceFootHighlight}>
            <Text style={styles.tableCell}>{rupiah(props.totalDP)}</Text>
          </View>
        </View>
      ) : (
        <></>
      )}
      {props.data.delivery ? (
        <View style={styles.tableRow}>
          <View style={styles.tableColFoot}></View>
          <View style={styles.tableColQtyFoot}></View>
          <View style={styles.tableColPriceFoot}>
            <Text style={styles.tableCell}>PENGIRIMAN</Text>
          </View>
          <View style={styles.tableColPriceFoot}>
            <Text style={styles.tableCell}>{rupiah(props.data.delivery!)}</Text>
          </View>
        </View>
      ) : (
        <></>
      )}
    </>
  );
};

export default ProInvoice;
