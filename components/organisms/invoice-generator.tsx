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
import { ProfileFormValues } from "@/app/generateInvoice/page";
import customStyles from "./InvoiceGenerator.module.css";
import moment from "moment";
Font.register({
  family: "Inter",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyeMZhrib2Bg-4.ttf",
      fontWeight: 100,
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuDyfMZhrib2Bg-4.ttf",
      fontWeight: 200,
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuOKfMZhrib2Bg-4.ttf",
      fontWeight: 300,
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf",
      fontWeight: 400,
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fMZhrib2Bg-4.ttf",
      fontWeight: 500,
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYMZhrib2Bg-4.ttf",
      fontWeight: 600,
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYMZhrib2Bg-4.ttf",
      fontWeight: 700,
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuDyYMZhrib2Bg-4.ttf",
      fontWeight: 800,
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuBWYMZhrib2Bg-4.ttf",
      fontWeight: 900,
    },
  ],
});
const styles = StyleSheet.create({
  body: {
    paddingTop: 10,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: "Inter",
    fontSize: 24,
    textAlign: "center",
  },
  text: {
    fontFamily: "Inter",
    fontSize: 8,
    textAlign: "justify",
    marginBottom: 2,
  },
  totalPrice: {
    marginTop: 10,
    fontFamily: "Inter",
    fontSize: 20,
    textAlign: "right",
    fontWeight: 700,
    marginBottom: 1,
  },
  textE: {
    fontFamily: "Inter",
    fontSize: 8,
    textAlign: "justify",
    marginBottom: 5,
  },
  p: {
    fontFamily: "Inter",
    fontSize: 8,
    textAlign: "justify",
  },
  image: {
    marginLeft: 40,
  },
  imageTTD: {
    width: "50px",
    height: "50px",
  },
  header: {
    fontSize: 30,
    marginBottom: 20,
    textAlign: "center",
  },
  textBold: {
    fontFamily: "Inter",
    fontSize: 9,
    textAlign: "justify",
    fontWeight: 700,
    marginBottom: 2,
  },
  pageNumber: {
    position: "absolute",
    fontSize: 12,
    bottom: 10,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
  },
  headerLine: {
    width: "100%",
    height: 10,
    backgroundColor: "black",
  },
  headerLayout: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
  },
  headerColumnLeft: {
    flex: 1,
    display: "flex",
    alignItems: "flex-start",
  },
  headerColumnRight: {
    flex: 1,
    display: "flex",
    alignItems: "flex-end",
  },
  subHeaderColumnLeft: {
    flex: 1,
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  subHeaderColumnRight: {
    marginLeft: "5px",
    flex: 2,
    display: "flex",
    alignItems: "flex-end",
  },
  separator: {
    width: "100%",
    height: "1px",
    backgroundColor: "black",
    marginBottom: 10,
  },
  main: {
    padding: 20,
  },
  tableRowHeader: {
    margin: "auto",
    flexDirection: "row",
    backgroundColor: "black",
    color: "white",
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableCol: {
    width: "55%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 1,
    borderTopWidth: 0,
  },
  tableColQty: {
    width: "5%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableColPrice: {
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableColFoot: {
    width: "55%",
  },
  tableColQtyFoot: {
    width: "5%",
  },
  tableColPriceFoot: {
    width: "20%",
  },
  tableColPriceFootHighlight: {
    width: "20%",
    backgroundColor: "#FFFF00",
  },
  tableCell: {
    margin: "auto",
    marginTop: 5,
    fontSize: 8,
  },

  footerTextBold: {
    fontFamily: "Inter",
    fontSize: 7,
    textAlign: "justify",
    fontWeight: 700,
    marginBottom: 2,
  },
  footerText: {
    fontFamily: "Inter",
    fontSize: 6,
    textAlign: "justify",
    marginBottom: 2,
  },
  footerLayout: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    marginBottom: 10,
  },
  footerColumnLeft: {
    flex: 2,
    display: "flex",
    alignItems: "flex-start",
  },
  footerColumnRight: {
    flex: 1,
    display: "flex",
    alignItems: "center",
  },
});

const InvoiceGenerator = (props: { data: ProfileFormValues }) => {
  const rupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(number);
  };
  function terbilang(x: number): string {
    var ambil = new Array(
      "",
      "SATU",
      "DUA",
      "TIGA",
      "EMPAT",
      "LIMA",
      "ENAM",
      "TUJUH",
      "DELAPAN",
      "SEMBILAN",
      "SEPULUH",
      "SEBELAS"
    );
    if (x < 12) {
      x = Math.floor(x);
      return " " + ambil[x];
    } else if (x < 20) {
      return terbilang(x - 10) + " BELAS";
    } else if (x < 100) {
      return terbilang(x / 10) + " PULUH" + terbilang(x % 10);
    } else if (x < 200) {
      return " SERATUS" + terbilang(x - 100);
    } else if (x < 1000) {
      return terbilang(x / 100) + " RATUS" + terbilang(x % 100);
    } else if (x < 2000) {
      return " SERIBU" + terbilang(x - 1000);
    } else if (x < 1000000) {
      return terbilang(x / 1000) + " RIBU" + terbilang(x % 1000);
    } else if (x < 1000000000) {
      return terbilang(x / 1000000) + " JUTA" + terbilang(x % 1000000);
    } else if (x < 1000000000000) {
      return terbilang(x / 1000000000) + " MILLIAR" + terbilang(x % 1000000000);
    } else {
      return "";
    }
  }
  return (
    <Document>
      <Page size="A4" style={{ ...styles.body }}>
        <div style={styles.headerLine}></div>
        <div style={styles.main}>
          <div style={styles.headerLayout}>
            <div style={styles.headerColumnLeft}>
              <Text style={styles.header}>
                {props.data.type == "Penawaran"
                  ? "Surat Penawaran"
                  : props.data.type == "Pro Invoice"
                  ? "Proforma Invoice"
                  : props.data.type}
              </Text>
            </div>
            <div style={styles.headerColumnRight}>
              <div style={styles.headerLayout}>
                <div
                  style={{
                    ...styles.subHeaderColumnLeft,
                  }}
                >
                  <Image style={{ ...styles.image }} src="logo.png" />
                </div>
                <div style={styles.subHeaderColumnRight}>
                  <Text style={styles.textBold}>Colossus Teknik Steel</Text>
                  <Text style={styles.p}>
                    Jl. Kariawan 4 no 1, Karang Tengah
                  </Text>
                  <Text style={styles.p}>Ciledug, Tangerang, 15157</Text>
                </div>
              </div>
            </div>
          </div>
          <div style={styles.separator}></div>
          {props.data.type == "Penawaran" ? (
            <div style={{ ...{ marginBottom: 10 } }}>
              <div style={{ ...{ marginBottom: 10 } }}>
                <Text style={styles.text}>No. {props.data.invoiceNumber}</Text>
                <Text style={styles.text}>
                  Perihal : Surat Penawaran Harga (SPH)
                </Text>
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
                Bersama dengan surat ini, kami mengajukan penawaran barang ke
                perusahaan yang Bapak/Ibu kelola. Kami ingin mengirim daftar
                barang yang kami tawarkan meliputi:
              </Text>
            </div>
          ) : (
            <div style={{ ...styles.headerLayout, ...{ marginBottom: 10 } }}>
              <div style={styles.headerColumnLeft}>
                <Text style={styles.textBold}>BILL TO:</Text>
                <Text style={styles.text}>
                  {props.data.company}/{props.data.name}
                </Text>
                <Text style={styles.text}>{props.data.address}</Text>
                <Text style={styles.text}>{props.data.email}</Text>
              </div>
              <div style={styles.headerColumnRight}>
                <Text style={styles.textBold}>INVOICE #</Text>
                <Text style={styles.textE}>{props.data.invoiceNumber}</Text>
                <Text style={styles.textBold}>DATE</Text>
                <Text style={styles.textE}>
                  {moment(props.data.invoiceDate.toLocaleDateString()).format(
                    "D MMMM YYYY"
                  )}
                </Text>
                <Text style={styles.textBold}>INVOICE DUE DATE</Text>
                <Text style={styles.textE}>
                  {moment(
                    props.data.invoiceDueDate.toLocaleDateString()
                  ).format("D MMMM YYYY")}
                </Text>
              </div>
            </div>
          )}
          <div>
            <View>
              <View style={styles.tableRowHeader}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    NAMA BARANG DAN DESKRIPSI
                  </Text>
                </View>
                <View style={styles.tableColQty}>
                  <Text style={styles.tableCell}>QTY</Text>
                </View>
                <View style={styles.tableColPrice}>
                  <Text style={styles.tableCell}>HARGA SATUAN</Text>
                </View>
                <View style={styles.tableColPrice}>
                  <Text style={styles.tableCell}>TOTAL HARGA</Text>
                </View>
              </View>
              {/* Iterator */}

              {props.data.invoices?.map((data, id) => {
                return (
                  <View key={id} style={styles.tableRow}>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>{data.desc}</Text>
                    </View>
                    <View style={styles.tableColQty}>
                      <Text style={styles.tableCell}>{data.quantity}</Text>
                    </View>
                    <View style={styles.tableColPrice}>
                      <Text style={styles.tableCell}>{rupiah(data.price)}</Text>
                    </View>
                    <View style={styles.tableColPrice}>
                      <Text style={styles.tableCell}>
                        {rupiah(data.quantity * data.price)}
                      </Text>
                    </View>
                  </View>
                );
              })}

              {props.data.type == "Penawaran" &&
              (props.data.discount ? props.data.discount > 0 : false) ? (
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
                        {rupiah(props.data.discount ? props.data.discount : 0)}
                      </Text>
                    </View>
                  </View>
                </>
              ) : (
                <></>
              )}
              {props.data.type == "Invoice" ? (
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
                        {rupiah(props.data.discount ? props.data.discount : 0)}
                      </Text>
                    </View>
                  </View>
                </>
              ) : (
                <></>
              )}
              {props.data.type == "Pro Invoice" ? (
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
                        {rupiah(props.data.discount ? props.data.discount : 0)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.tableRow}>
                    <View style={styles.tableColFoot}></View>
                    <View style={styles.tableColQtyFoot}></View>
                    <View style={styles.tableColPriceFootHighlight}>
                      <Text style={styles.tableCell}>DP RATE</Text>
                    </View>
                    <View style={styles.tableColPriceFootHighlight}>
                      <Text style={styles.tableCell}>50%</Text>
                    </View>
                  </View>

                  <View style={styles.tableRow}>
                    <View style={styles.tableColFoot}></View>
                    <View style={styles.tableColQtyFoot}></View>
                    <View style={styles.tableColPriceFootHighlight}>
                      <Text style={styles.tableCell}>TOTAL DP</Text>
                    </View>
                    <View style={styles.tableColPriceFootHighlight}>
                      <Text style={styles.tableCell}>
                        {rupiah(
                          props.data.subtotal
                            ? ((props.data.subtotal -
                                (props.data.discount
                                  ? props.data.discount
                                  : 0)) *
                                50) /
                                100
                            : 0
                        )}
                      </Text>
                    </View>
                  </View>
                </>
              ) : (
                <></>
              )}
            </View>
          </div>
          {/* Total */}
          <div>
            <Text style={styles.totalPrice}>
              {rupiah(
                props.data.subtotal
                  ? props.data.subtotal -
                      (props.data.discount ? props.data.discount : 0)
                  : 0
              )}
            </Text>
            <Text
              style={{
                ...styles.textBold,
                ...{ textAlign: "right", marginBottom: 10 },
              }}
            >
              {terbilang(
                props.data.subtotal
                  ? props.data.subtotal -
                      (props.data.discount ? props.data.discount : 0)
                  : 0
              ) + " RUPIAH"}
            </Text>
          </div>

          {props.data.type == "Penawaran" ? (
            <>
              <Text style={styles.text}>
                Dalam perjanjian ini, pembeli diwajibkan untuk melakukan
                pembayaran muka sebesar 50% dari total pembelian sebagai tanda
                jadi. Pembeli juga harus melunasi sisa tagihan sebelum barang
                dikirimkan kepadanya. Pengerjaan pesanan diperkirakan memakan
                waktu antara {props.data.estimatedTime}, namun kami akan
                berupaya untuk menyelesaikannya lebih cepat jika memungkinkan.
                Kami ingin menekankan bahwa kepuasan pelanggan adalah prioritas
                utama bagi kami, dan kami akan berusaha semaksimal mungkin untuk
                memenuhi kebutuhan dan keinginan pelanggan kami.
              </Text>
              <Text style={styles.text}>
                Demikian surat penawaran ini kami sampaikan. Apabila Bapak/Ibu
                berkenan dengan penawaran kami, silakan menghubungi kami dan
                kami akan dengan senang hati melayani. Atas perhatian dan kerja
                samanya kami ucapkan terima kasih.
              </Text>
            </>
          ) : (
            <></>
          )}

          {/* PURCHASE AGREEMENT */}
          <div>
            <div style={styles.footerLayout}>
              <div style={styles.footerColumnLeft}>
                {props.data.type == "Penawaran" ? (
                  <></>
                ) : (
                  <>
                    <Text style={styles.footerTextBold}>
                      PURCHASE AGREEMENT:
                    </Text>
                    <Text style={styles.footerText}>
                      1. Pembeli diharuskan untuk melakukan pembayaran muka
                      sebesar 50% dari total pembelian.
                    </Text>
                    <Text style={styles.footerText}>
                      2. Pembeli harus menyelesaikan pembayaran sisa tagihan
                      sebelum barang dikirimkan.
                    </Text>
                    <Text style={styles.footerText}>
                      3. Waktu pelaksanaan pengerjaan berkisar antara{" "}
                      {props.data.estimatedTime}, dengan kemungkinan
                      penyelesaian lebih cepat.
                    </Text>
                    <Text style={styles.footerText}>
                      4. Kami mengutamakan kepuasan pelanggan kami sebagai
                      prioritas utama.
                    </Text>

                    <Text style={{ ...styles.textBold, ...{ marginTop: 5 } }}>
                      NOTES:
                    </Text>
                    <Text style={styles.text}>
                      Pembayaran dilakukan Via Transfer BCA: 549-503-9932 A/N
                      ALVINO SETIO
                    </Text>
                  </>
                )}
              </div>

              <div style={styles.footerColumnRight}>
                <Text style={styles.text}>Hormat kami,</Text>
                <Image style={styles.imageTTD} src="ttd.png" />
                <Text style={styles.text}>Alvino Setio</Text>
                <Text style={styles.text}>Direktur Utama</Text>
              </div>
            </div>
          </div>
        </div>

        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} / ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
};

export default InvoiceGenerator;
