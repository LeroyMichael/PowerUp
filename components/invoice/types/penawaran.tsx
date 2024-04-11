import { Text } from "@react-pdf/renderer";
import { styles } from "../invoice-generator";
import { ProfileFormValues } from "@/app/(protected)/transactions/transaction-form/[[...transaction]]/page";

const Penawaran = (props: { data: ProfileFormValues }) => {
  return (
    <div style={{ ...{ marginBottom: 10 } }}>
      <div style={{ ...{ marginBottom: 10 } }}>
        <Text style={styles.text}>No. {props.data.invoiceNumber}</Text>
        <Text style={styles.text}>Perihal : Surat Penawaran Harga (SPH)</Text>
        <Text style={styles.text}>Lampiran : 1 rangkap</Text>
      </div>
      <div style={{ ...{ marginBottom: 10 } }}>
        <Text style={styles.textBold}>Kepada Yth.</Text>
        <Text style={styles.text}>Bpk/Ibu {props.data.name}</Text>
        <Text style={styles.text}>{props.data.company}</Text>
        <Text style={styles.text}>{props.data.address}</Text>
      </div>
      <Text style={styles.text}>Salam hormat,</Text>
      <Text style={styles.text}>
        Bersama dengan surat ini, kami mengajukan penawaran barang ke perusahaan
        yang Bapak/Ibu kelola. Kami ingin mengirim daftar barang yang kami
        tawarkan meliputi:
      </Text>
    </div>
  );
};

export default Penawaran;
