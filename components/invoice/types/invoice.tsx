import { rupiah } from "@/lib/utils";
import { Text, View } from "@react-pdf/renderer";
import { styles } from "../invoice-generator";
import { ProfileFormValues } from "@/types/transaction-schema";

const Invoice = (props: { data: ProfileFormValues; totalTax: number }) => {
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
      <View style={styles.tableRow}>
        <View style={styles.tableColFoot}></View>
        <View style={styles.tableColQtyFoot}></View>
        <View style={styles.tableColPriceFoot}>
          <Text style={styles.tableCell}>DISCOUNT</Text>
        </View>
        <View style={styles.tableColPriceFoot}>
          <Text style={styles.tableCell}>
            -{rupiah(props.data.discount ? props.data.discount : 0)}
          </Text>
        </View>
      </View>
      <View style={styles.tableRow}>
        <View style={styles.tableColFoot}></View>
        <View style={styles.tableColQtyFoot}></View>
        <View style={styles.tableColPriceFoot}>
          <Text style={styles.tableCell}>PENGIRIMAN</Text>
        </View>
        <View style={styles.tableColPriceFoot}>
          <Text style={styles.tableCell}>
            {rupiah(props.data.delivery ? props.data.delivery : 0)}
          </Text>
        </View>
      </View>
      <View style={styles.tableRow}>
        <View style={styles.tableColFoot}></View>
        <View style={styles.tableColQtyFoot}></View>
        <View style={styles.tableColPriceFoot}>
          <Text style={styles.tableCell}>
            TAX {props.data.tax ? props.data.tax : 0}%
          </Text>
        </View>
        <View style={styles.tableColPriceFoot}>
          <Text style={styles.tableCell}>{rupiah(props.totalTax)}</Text>
        </View>
      </View>
    </>
  );
};

export default Invoice;
