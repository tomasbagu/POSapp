import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { DataProvider } from "../context/DataContext";  // Importación agregada
import { ActivityIndicator, View } from "react-native";
import { useFonts } from "expo-font";

export default function Layout() {
    const [fontsLoaded] = useFonts({
        "Inter-Regular": require("@/assets/fonts/Inter.ttf"),
        "Inter-Italic": require("@/assets/fonts/Inter-Italic.ttf"),
      });
    
      if (!fontsLoaded) {
        return (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" />
          </View>
        );
    }
    return (
        <AuthProvider>
            <DataProvider>  
                <Stack screenOptions={{ headerShown: false }} />
            </DataProvider>
        </AuthProvider>
    );

}