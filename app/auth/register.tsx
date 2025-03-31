import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { RadioButton } from "react-native-paper";
import { AuthContext } from "@/context/AuthContext"; // Importa el contexto de autenticación

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useContext(AuthContext); // Usa el método register del AuthContext

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("client"); // Valor predeterminado

  const handleRegister = async () => {
    if (!name || !email || !password || !role) {
      Alert.alert("Error", "Por favor, completa todos los campos.");
      return;
    }

    const success = await register({ name, email, password, role });

    if (success) {
      Alert.alert("Éxito", "Registro exitoso.", [{ text: "OK", onPress: () => router.push("/auth/login") }]);
    } else {
      Alert.alert("Error", "No se pudo registrar el usuario.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>👑</Text>
      <Text style={styles.title}>Register</Text>
      <Text style={styles.subtitle}>Let's create an <Text style={styles.bold}>account!</Text></Text>

      <Text style={styles.label}>Full Name</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Enter your password" 
        secureTextEntry 
        value={password}
        onChangeText={setPassword}
      />

      <Text style={styles.label}>Role</Text>
      <RadioButton.Group onValueChange={setRole} value={role}>
        <View style={styles.radioContainer}>
          <RadioButton.Item label="Client" value="client" />
          <RadioButton.Item label="Chef" value="chef" />
          <RadioButton.Item label="Cashier" value="cashier" />
        </View>
      </RadioButton.Group>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Already have an account?{" "}
        <Text style={styles.link} onPress={() => router.push("/auth/login")}>Sign In</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  icon: {
    fontSize: 40,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  bold: {
    fontWeight: "bold",
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    height: 45,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  radioContainer: {
    alignSelf: "stretch",
    marginBottom: 20,
  },
  button: {
    width: "100%",
    backgroundColor: "#000",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  footerText: {
    marginTop: 20,
    fontSize: 14,
  },
  link: {
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});
