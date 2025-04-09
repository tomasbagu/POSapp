import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useOrder } from "@/context/OrderContext";

const PaymentScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { allOrders, updateOrderStatus } = useOrder();
  const [paymentMethod, setPaymentMethod] = useState("Efectivo");

  const order = allOrders.find((o) => o.id === id);

  if (!order) return null;

  const subtotal = order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.19;
  const total = subtotal + tax;

  const handleConfirm = async () => {
    await updateOrderStatus(order.id!, "Done");
    Alert.alert("Pago recibido", `Método: ${paymentMethod}`);
    router.push({ pathname: "/(app)/Cashier/invoice", params: { id: order.id } });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Confirmation</Text>

      <Text style={styles.line}>Subtotal: ${subtotal.toFixed(2)}</Text>
      <Text style={styles.line}>Tax (19%): ${tax.toFixed(2)}</Text>
      <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>

      <Text style={styles.sectionTitle}>Choose a Payment Method</Text>
      <View style={styles.methodsContainer}>
        {["Cash", "Credit", "Debit"].map((method) => (
          <TouchableOpacity
            key={method}
            style={[styles.methodButton, paymentMethod === method && styles.selectedMethod]}
            onPress={() => setPaymentMethod(method)}
          >
            <Text style={styles.methodText}>{method}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
        <Text style={styles.confirmText}>Confirm and get an invoice</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 80,
    marginBottom:40,
    textAlign: "left",
    fontFamily: "Inter-Regular"
  },
  line: {
    fontSize: 18,
    marginBottom: 20,
    fontFamily: "Inter-Regular"
  },
  total: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 20,
    fontFamily: "Inter-Regular"
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 20,
    fontFamily: "Inter-Regular"
  },
  methodsContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  methodButton: {
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 24,
    fontFamily: "Inter-Regular"
  },
  selectedMethod: {
    backgroundColor: "#000",
  },
  methodText: {
    color: "#000",
    fontWeight: "400",
    fontFamily: "Inter-Regular"
  },
  confirmButton: {
    backgroundColor: "#000",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  confirmText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Inter-Regular"
  },
});
