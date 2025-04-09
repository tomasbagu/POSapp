import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const CashierMenu = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <Text style={styles.title}>Welcome to your</Text>
        <Text style={styles.subtitle}>Sales Terminal</Text>

        <Text style={styles.text}>Choose the action you'd like to perform</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/(app)/Cashier/cashierDashboard")}
      >
        <FontAwesome name="cutlery" size={16} color="#fff" style={styles.icon}/>
        <Text style={styles.buttonText}>Order Dashboard</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/(app)/Cashier/homeCash")}
      >
        <FontAwesome name="wrench" size={16} color="#fff" style={styles.icon}/>
        <Text style={styles.buttonText}>Manage Menu</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CashierMenu;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    fontFamily: "Inter-Regular",
  },
  heading: {
    alignItems: "flex-start",
    marginTop: 150
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
  },
  subtitle: {
    fontSize: 28,
    fontWeight: 200,
    marginBottom: 20,
    color: "#000",
  },
  text: {
    fontSize: 18,
    fontWeight: 200,
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
    height:"20%",
    alignItems: "flex-start",
    justifyContent: "flex-end"
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "400",
    fontFamily: "Inter-Regular",
  },
  icon:{
    marginBottom: 60,
    fontSize: 30,
  }
});
