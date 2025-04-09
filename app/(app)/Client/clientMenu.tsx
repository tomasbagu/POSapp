import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useOrder } from "@/context/OrderContext";

const HomeClientMenu = () => {
  const router = useRouter();
  const { order } = useOrder();

  const handleGoToMenu = () => {
    router.push("/(app)/Client/homeClient");
  };

 

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido</Text>

      <TouchableOpacity style={styles.button} onPress={handleGoToMenu}>
        <Text style={styles.buttonText}>Ver Menú</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push("/(app)/Client/order-list")}>
        <Text style={styles.buttonText}>Estado de mi pedido</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeClientMenu;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
    marginBottom: 20,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
