import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useOrder } from "@/context/OrderContext";
import { useLocalSearchParams } from "expo-router";

const OrderStatusScreen = () => {
  const { id } = useLocalSearchParams();
  const { order, getOrderStatus } = useOrder();

  useEffect(() => {
    if (id && typeof id === "string") {
        const unsubscribe = getOrderStatus(id);
      return () => unsubscribe;
    }
  }, [id]);

  if (!order) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.loadingText}>Charging your order...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Status of your order</Text>
      <Text style={styles.status}>{order.status}</Text>
    </View>
  );
};

export default OrderStatusScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
  },
  status: {
    fontSize: 22,
    fontWeight: "600",
    color: "#000",
  },
});
