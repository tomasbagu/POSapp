import { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { AuthContext } from "@/context/AuthContext";
import { router } from "expo-router";
import { Image } from "react-native";

const roles = ["client", "chef", "cashier"];

export default function SignupScreen() {
  const { register } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("client");

  const handleSignup = async () => {
    try {
      await register({ name, email, password, role });
      Alert.alert("Éxito", "Usuario registrado correctamente");
      router.replace("/auth/login");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "No se pudo registrar el usuario");
    }
  };

  return (
    <View style={{ padding: 30, height: "100%", backgroundColor: "white", justifyContent: "center"}}>
      <View style={{ marginBottom: 37 }}>
        <Image
          source={require("../../assets/images/image-logo.png")}
          style={{
            width: 60,
            height: 50,
            alignSelf: "center",
            marginBottom: 10,
          }}
        />
        <Text
          style={{
            fontFamily: "Inter-Regular",
            alignSelf: "center",
            marginBottom: 10,
            fontSize: 24,
            fontWeight: 800,
            letterSpacing: 0.5,
          }}
        >
          Sign Up 
        </Text>
        <Text
          style={{
            fontFamily: "Inter-Regular",
            alignSelf: "center",
            marginBottom: 5,
            fontSize: 14,
            fontWeight: "400",
          }}
        >
          Let’s create an <Text style={{ fontWeight: "800" }}>account!</Text>
        </Text>
      </View>
      <Text style={{fontFamily: "Inter-Regular",fontSize: 14, fontWeight: "700", marginBottom: 10,}}>Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Name"
        style={{
          borderWidth: 1,
          borderColor: "#000",
          borderRadius: 10,
          padding: 10,
          paddingLeft: 19,
          marginBottom: 22,
          fontFamily: "Inter-Regular",
          fontSize: 14,
          marginHorizontal: 20,
        }}
      />
      <Text style={{fontFamily: "Inter-Regular",fontSize: 14, fontWeight: "700", marginBottom: 10,}}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="Email"
        style={{
          borderWidth: 1,
          borderColor: "#000",
          borderRadius: 10,
          padding: 10,
          paddingLeft: 19,
          marginBottom: 22,
          fontFamily: "Inter-Regular",
          fontSize: 14,
          marginHorizontal: 20,
        }}
      />
      <Text style={{fontFamily: "Inter-Regular",fontSize: 14, fontWeight: "700", marginBottom: 10,}}>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Passsword"
        style={{
          borderWidth: 1,
          borderColor: "#000",
          borderRadius: 10,
          padding: 10,
          paddingLeft: 19,
          marginBottom: 22,
          fontFamily: "Inter-Regular",
          fontSize: 14,
          marginHorizontal: 20,
        }}
      />
      <Text style={{fontFamily: "Inter-Regular",fontSize: 14, fontWeight: "700", marginBottom: 10,}}>Rol</Text>
      <View
        style={{
          flexDirection: "column",
          justifyContent: "space-between",
          marginBottom: 20,
          marginHorizontal:20
        }}
      >
        {roles.map((r) => (
          <TouchableOpacity
            key={r}
            onPress={() => setRole(r)}
            style={{
              padding: 10,
              marginBottom: 10,
              borderWidth: 1,
              borderColor: role === r ? "white" : "black",
              backgroundColor: role === r ? "black" : "white",
              borderRadius: 10,
            }}
          >
            <Text style={{ color: role === r ? "white" : "black" }}>{r}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Pressable
                    onPress={handleSignup}
                    style={{
                      backgroundColor: "#000",
                      borderRadius: 10,
                      paddingVertical: 12,
                      alignItems: "center",
                      marginBottom: 20,
                      marginHorizontal: 20,
                    }}
                  >
                    <Text style={{ color: "#fff", fontWeight: "700", fontSize: 14 }}>
                      Sign up
                    </Text>
      </Pressable>
      <TouchableOpacity
              onPress={() => router.replace("/auth/login")}
              style={{ marginTop: 10 }}
            >
              <Text
                style={{
                  color: "#000",
                  textAlign: "center",
                  fontWeight: "400",
                  fontSize: 14,
                  fontFamily: "Inter-Regular",
                }}
              >
                Already have an account?{" "}
                <Text style={{ fontWeight: "700", textDecorationLine: "underline" }}>Login</Text>
              </Text>
            </TouchableOpacity>
    </View>
  );
}
