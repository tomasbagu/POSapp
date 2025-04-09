import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const HomeClientMenu = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <Text style={styles.title}>Welcome to your</Text>
        <Text style={styles.subtitle}>Order Management Area </Text>
        <Text style={styles.text}>What do you want to do today?</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => router.push("/(app)/Client/homeClient")}>
        <FontAwesome name="cutlery" size={16} color="#fff" style={styles.icon} />
        <Text style={styles.buttonText}>Let's see the Menu</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push("/(app)/Client/order-list")}>
        <FontAwesome name="list-alt" size={16} color="#fff" style={styles.icon} />
        <Text style={styles.buttonText}>My Orders and Status</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeClientMenu;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  heading: {
    alignItems: "flex-start",
    marginTop: 150,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
  },
  subtitle: {
    fontSize: 28,
    fontWeight: "200",
    marginBottom: 20,
    color: "#000",
  },
  text: {
    fontSize: 18,
    fontWeight: "200",
    marginBottom: 40,
    color: "#000",
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: 40,
    paddingHorizontal: 32,
    borderRadius: 10,
    marginBottom: 20,
    width: "80%",
    height: "20%",
    alignItems: "flex-start",
    justifyContent: "flex-end",
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "400",
  },
  icon: {
    marginBottom: 60,
    fontSize: 30,
  },
});
