import { ExportInvoiceStyle } from "../styles";
import { ExportInvoiceType } from "@/types/export-invoice.d";
import { Image, Text, View } from "@react-pdf/renderer";

const Sign = (props: { data: ExportInvoiceType }) => {
  return (
    <>
      <Text style={ExportInvoiceStyle.text}>Hormat kami,</Text>
      {props.data.transaction_info?.is_presigned ? (
        <Image style={ExportInvoiceStyle.imageTTD} src={`/ttd.png`} />
      ) : (
        <Image style={ExportInvoiceStyle.imageNoTTD} src={`/ttd.png`} />
      )}

      <Text style={ExportInvoiceStyle.text}>
        {props.data.merchant?.admin_name}
      </Text>
      <Text style={ExportInvoiceStyle.text}>Direktur Utama</Text>
    </>
  );
};

export default Sign;
