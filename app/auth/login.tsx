import { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { AuthContext } from "@/context/AuthContext";
import { router } from "expo-router";
import { getDoc, doc } from "firebase/firestore";
import { db, auth } from "@/utils/Firebase";
import { Image } from "react-native";

export default function LoginScreen() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const success = await login(email, password);
    if (!success) {
      setLoading(false);
      Alert.alert("Error", "Credenciales incorrectas");
      return;
    }

    try {
      const uid = auth.currentUser?.uid;
      if (!uid) throw new Error("Usuario no encontrado");

      const userDoc = await getDoc(doc(db, "users", uid));
      const userData = userDoc.data();

      if (!userData?.role) {
        Alert.alert("Error", "No se encontró el rol del usuario");
        setLoading(false);
        return;
      }

      switch (userData.role) {
        case "client":
          router.replace("/(app)/Client/clientMenu");
          break;
        case "chef":
          router.replace("/(app)/Chef/homeChef");
          break;
        case "cashier":
          router.replace("/(app)/Cashier/cashierMenu");
          break;
        default:
          Alert.alert("Error", "Rol no válido");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Hubo un problema al obtener el rol del usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ backgroundColor: "white", height: "100%" }}>
      <View style={{ padding: 20, marginTop: "40%" }}>
        {loading ? (
          <ActivityIndicator size="large" style={{ marginTop: 50 }} />
        ) : (
          <>
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
                Login
              </Text>
              <Text
                style={{
                  fontFamily: "Inter-Regular",
                  alignSelf: "center",
                  marginBottom: 20,
                  fontSize: 14,
                  fontWeight: "400",
                }}
              >
                Let’s get you in to{" "}
                <Text style={{ fontWeight: "800" }}>regent!</Text>
              </Text>
            </View>

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

            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="Password"
              style={{
                borderWidth: 1,
                borderColor: "#000",
                borderRadius: 10,
                padding: 10,
                marginBottom: 45,
                fontFamily: "Inter-Regular",
                fontSize: 14,
                paddingLeft: 19,
                marginHorizontal: 20,
              }}
            />
            <Pressable
              onPress={handleLogin}
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
                Login
              </Text>
            </Pressable>

          
            <TouchableOpacity
              onPress={() => router.push("/auth/signup")}
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
                Don't have an account?{" "}
                <Text style={{ fontWeight: "700", textDecorationLine: "underline" }}>Sign Up</Text>
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}
