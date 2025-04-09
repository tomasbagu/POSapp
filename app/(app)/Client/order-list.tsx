import React, { useEffect } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { useOrder } from "@/context/OrderContext";

const ClientOrderList = () => {
  const { orderedOrders, fetchOrderedOrders } = useOrder();

  useEffect(() => {
    const unsubscribe = fetchOrderedOrders();
    return () => unsubscribe;
  }, []);

  if (!orderedOrders.length) {
    return (
      <View style={styles.centered}>
        <Text style={styles.title}>No tienes órdenes activas</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Órdenes</Text>
      <FlatList
        data={orderedOrders}
        keyExtractor={(item) => item.id ?? String(item.createdAt)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Orden #{item.id}</Text>
            <Text style={styles.cardStatus}>Estado: {item.status}</Text>
            <Text style={styles.cardTime}>🕒 {new Date(item.createdAt).toLocaleString()}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default ClientOrderList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cardStatus: {
    fontSize: 16,
    marginTop: 4,
  },
  cardTime: {
    fontSize: 14,
    marginTop: 4,
    color: "#555",
  },
});
