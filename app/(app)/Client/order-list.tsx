import React, { useEffect } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { useOrder } from "@/context/OrderContext";
import { getAuth } from "firebase/auth";
import { useRouter } from "expo-router";


const ClientOrderList = () => {
  const { allOrders, fetchAllOrders } = useOrder();
  const auth = getAuth();
  const user = auth.currentUser;
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = fetchAllOrders();
    return () => unsubscribe();
  }, []);

  if (!user) {
    return (
      <View style={styles.centered}>
        <Text style={{ fontSize: 16 }}>No has iniciado sesión</Text>
      </View>
    );
  }

  const userOrders = allOrders.filter((order) => order.userEmail === user.email);

  if (!userOrders.length) {
    return (
      <View style={styles.centered}>
        <Text style={{ fontSize: 16 }}>No tienes órdenes registradas</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Órdenes</Text>
      <FlatList
        data={userOrders}
        keyExtractor={(item) => item.id ?? String(item.createdAt)}
        renderItem={({ item }) => (
          <TouchableOpacity  onPress={() => router.push({ pathname: "/(app)/Client/order-status", params: { id: item.id } })}
>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Orden #{item.id?.slice(0, 6).toUpperCase()}</Text>
            <Text style={styles.cardStatus}>Estado: {item.status}</Text>
            <Text style={styles.cardTime}>🕒 {new Date(item.createdAt).toLocaleString()}</Text>
          </View>
          </TouchableOpacity>
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