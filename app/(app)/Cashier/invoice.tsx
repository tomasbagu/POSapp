import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useOrder } from "@/context/OrderContext";
import { Image } from "react-native";

const InvoiceScreen = () => {
  const { id } = useLocalSearchParams();
  const { allOrders } = useOrder();

  const order = allOrders.find((o) => o.id === id);
  if (!order) return null;

  const subtotal = order.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const tax = 0.19; // Estilo de imagen dice Tax (0%)
  const total = subtotal + tax * subtotal;

  return (
    <View style={styles.container}>
        <Image
        source={require("../../../assets/images/image-logo.png")}
        style={{
          width: 60,
          height: 50,
          alignSelf: "flex-start",
          marginTop: 50
        }}
      />
      
      <Text style={styles.invoiceTitle}>INVOICE</Text>
      
      <View style={styles.rowBetween}>
        <View>
          <Text style={styles.invoiceLabel}>
            Invoice No. {order.id?.slice(0, 6).toUpperCase()}
          </Text>
          <Text style={styles.invoiceDate}>
            {new Date(order.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>

      <View style={styles.tableHeader}>
        <Text style={styles.colItem}>Item</Text>
        <Text style={styles.colQty}>Quantity</Text>
        <Text style={styles.colPrice}>Unit Price</Text>
        <Text style={styles.colTotal}>Total</Text>
      </View>

      {order.items.map((item, idx) => (
        <View key={idx} style={styles.tableRow}>
          <Text style={styles.colItem}>{item.name}</Text>
          <Text style={styles.colQty}>{item.quantity}</Text>
          <Text style={styles.colPrice}>${item.price.toFixed(2)}</Text>
          <Text style={styles.colTotal}>
            ${(item.price * item.quantity).toFixed(2)}
          </Text>
        </View>
      ))}

      <View style={styles.summaryBlock}>
        <Text style={styles.summaryText}>Subtotal</Text>
        <Text style={styles.summaryText}>${subtotal.toFixed(2)}</Text>
      </View>
      <View style={styles.summaryBlock}>
        <Text style={styles.summaryText}>Tax (19%)</Text>
        <Text style={styles.summaryText}>${tax * subtotal}</Text>
      </View>
      <View style={styles.summaryBlockBold}>
        <Text style={styles.summaryTotal}>Total Due</Text>
        <Text style={styles.summaryTotal}>${total.toFixed(2)}</Text>
      </View>

      <Text style={styles.thankYou}>Thank you!</Text>
    </View>
  );
};

export default InvoiceScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 24,
  },
  invoiceTitle: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "right",
    marginBottom: 20,
    marginTop: 50,
    fontFamily: "Inter-Regular",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  sectionLabel: {
    fontWeight: "bold",
    marginBottom: 6,
    fontFamily: "Inter-Regular",
  },
  clientText: {
    fontSize: 14,
    color: "#333",
    fontFamily: "Inter-Regular",
  },
  invoiceLabel: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "right",
    fontFamily: "Inter-Regular",
  },
  invoiceDate: {
    fontSize: 14,
    textAlign: "right",
    fontFamily: "Inter-Regular",
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 8,
    marginTop: 20,
    fontFamily: "Inter-Regular",
    
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 6,
  },
  colItem: {
    flex: 2,
    fontSize: 14,
    fontFamily: "Inter-Regular",
    
  },
  colQty: {
    flex: 1,
    fontSize: 14,
    textAlign: "center",
    fontFamily: "Inter-Regular",
  },
  colPrice: {
    flex: 1,
    fontSize: 14,
    textAlign: "center",
    fontFamily: "Inter-Regular",
  },
  colTotal: {
    flex: 1,
    fontSize: 14,
    textAlign: "right",
    fontFamily: "Inter-Regular",
  },
  summaryBlock: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    fontFamily: "Inter-Regular",
  },
  summaryBlockBold: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    borderTopWidth: 1,
    borderColor: "#000",
    paddingTop: 8,
    fontFamily: "Inter-Regular",
  },
  summaryText: {
    fontSize: 14,
    color: "#333",
    fontFamily: "Inter-Regular",
  },
  summaryTotal: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Inter-Regular",
  },
  thankYou: {
    marginTop: 40,
    fontSize: 16,
    textAlign: "center",
    fontStyle: "italic",
    color: "#444",
    fontFamily: "Inter-Regular",
  },
  footerBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
  },
  paymentInfoTitle: {
    fontWeight: "bold",
    marginBottom: 8,
    fontFamily: "Inter-Regular",
  },
  footerText: {
    fontSize: 13,
    color: "#333",
    fontFamily: "Inter-Regular",
  },
});
