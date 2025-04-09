import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useOrder } from "@/context/OrderContext";

const STATUS_OPTIONS = [
  "Ordered", "Cooking", "Ready for Pickup", "Delivered", "Ready for Payment", "Done"
];

const ChefDashboard = () => {
  const { allOrders, fetchAllOrders, updateOrderStatus } = useOrder();
  const [initialLoading, setInitialLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("Ordered");

  useEffect(() => {
    const unsubscribe = fetchAllOrders();
    const timer = setTimeout(() => setInitialLoading(false), 2000);
    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  const filteredOrders = allOrders.filter((order) => order.status === statusFilter);

  const renderOrder = ({ item }: { item: any }) => {
    const isNew = !item.timestamps || !item.timestamps["Cooking"];

    return (
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.orderId}>Orden #{item.id.slice(0, 6).toUpperCase()}</Text>
          {isNew && <Text style={styles.newBadge}>🔴 Nueva</Text>}
        </View>

        <Text style={styles.time}>🕒 {new Date(item.createdAt).toLocaleTimeString()}</Text>

        <Text style={styles.sectionTitle}>Pedidos:</Text>
        {item.items.map((dish: any, idx: number) => (
          <Text key={idx} style={styles.dish}>
            - {dish.name} x {dish.quantity}
          </Text>
        ))}

        <Text style={styles.status}>Estado actual: {item.status}</Text>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => updateOrderStatus(item.id, "Cooking")}
          >
            <Text style={styles.buttonText}>Iniciar (Cooking)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => updateOrderStatus(item.id, "Done")}
          >
            <Text style={styles.buttonText}>Marcar como Done</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => updateOrderStatus(item.id, "Ready for Pickup")}
          >
            <Text style={styles.buttonText}>Listo para Recoger</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (initialLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={{ marginTop: 10 }}>Cargando órdenes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 Órdenes por Estado</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
        {STATUS_OPTIONS.map((status) => (
          <TouchableOpacity
            key={status}
            style={[styles.filterButton, statusFilter === status && styles.filterButtonActive]}
            onPress={() => setStatusFilter(status)}
          >
            <Text
              style={[
                styles.filterButtonText,
                statusFilter === status && styles.filterButtonTextActive,
              ]}
            >
              {status}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {filteredOrders.length === 0 ? (
        <Text style={styles.noOrders}>No hay órdenes en este estado.</Text>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id ?? String(item.createdAt)}
          renderItem={renderOrder}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

export default ChefDashboard;

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
    marginBottom: 20,
    textAlign: "center",
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
  },
  filterButtonActive: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  filterButtonText: {
    color: "#000",
    fontWeight: "600",
  },
  filterButtonTextActive: {
    color: "#fff",
  },
  noOrders: {
    textAlign: "center",
    fontSize: 16,
    color: "#555",
    marginTop: 40,
  },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  newBadge: {
    fontSize: 14,
    fontWeight: "bold",
    color: "red",
  },
  orderId: {
    fontWeight: "bold",
    fontSize: 18,
  },
  time: {
    fontSize: 14,
    color: "#777",
    marginBottom: 6,
  },
  sectionTitle: {
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 4,
  },
  dish: {
    fontSize: 14,
  },
  status: {
    marginTop: 10,
    fontWeight: "bold",
    color: "#555",
  },
  buttonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
    gap: 10,
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 10,
    marginTop: 6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
  },
});
