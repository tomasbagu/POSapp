import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useOrder } from "@/context/OrderContext";
import { useRouter } from "expo-router";

const STATUS_OPTIONS = [
  "Ordered",
  "Cooking",
  "Ready for Pickup",
  "Delivered",
  "Ready for Payment",
  "Done",
];

const CashierDashboard = () => {
  const { allOrders, fetchAllOrders } = useOrder();
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState("Ordered");
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = fetchAllOrders();
    const timer = setTimeout(() => setInitialLoading(false), 2000);
    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  const filteredOrders = allOrders.filter((order) => order.status === statusFilter);

  const calculateTotal = (items: any[]) => {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const renderOrder = ({ item }: { item: any }) => {
    const isPayable = item.status === "Ready for Payment";
    const isDone = item.status === "Done";

    return (
      <TouchableOpacity
        style={[styles.card, isDone && { opacity: 0.5 }]}
        disabled={!isPayable}
        onPress={() => {
          if (isPayable) {
            router.push({ pathname: "/(app)/Cashier/payment", params: { id: item.id } });
          }
        }}
      >
        <Text style={styles.orderId}>Order #{item.id.slice(0, 6).toUpperCase()}</Text>
        <Text style={styles.time}> {new Date(item.createdAt).toLocaleString()}</Text>

        <Text style={styles.sectionTitle}>Details:</Text>
        {item.items.map((dish: any, idx: number) => (
          <Text key={idx} style={styles.dish}>
            • {dish.name} x {dish.quantity} = ${dish.price * dish.quantity}
          </Text>
        ))}

        <Text style={styles.total}> Total: ${calculateTotal(item.items).toFixed(2)}</Text>
        <Text style={styles.status}>Status: {item.status}</Text>
      </TouchableOpacity>
    );
  };

  if (initialLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={{ marginTop: 10 }}>Orders Being Charged...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Management by Status</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
        {STATUS_OPTIONS.map((status) => (
          <TouchableOpacity
            key={status}
            style={[styles.filterButton, statusFilter === status && styles.filterButtonActive]}
            onPress={() => setStatusFilter(status)}
          >
            <Text
              style={[styles.filterButtonText, statusFilter === status && styles.filterButtonTextActive]}
            >
              {status}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id ?? String(item.createdAt)}
        renderItem={renderOrder}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default CashierDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 40,
    marginTop:60,
    textAlign: "left",
    fontFamily: "Inter-Regular"
  },
  filterRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 30,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 10,
    marginBottom: 10,
    elevation: 2,
    height: 40,
  },
  filterButtonActive: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  filterButtonText: {
    color: "#000",
    fontWeight: "400",
    fontFamily: "Inter-Regular"
  },
  filterButtonTextActive: {
    color: "#fff",
  },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  orderId: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 4,
    fontFamily: "Inter-Regular"
  },
  time: {
    fontSize: 14,
    color: "#777",
    marginBottom: 6,
    fontFamily: "Inter-Regular"
  },
  sectionTitle: {
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 4,
    fontSize: 15,
    fontFamily: "Inter-Regular"
  },
  dish: {
    fontSize: 14,
    fontFamily: "Inter-Regular"
  },
  total: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    fontFamily: "Inter-Regular"
  },
  status: {
    marginTop: 6,
    fontWeight: "600",
    color: "#444",
    fontFamily: "Inter-Regular"
  },
});