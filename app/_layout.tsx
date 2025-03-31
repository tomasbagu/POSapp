import { AuthProvider } from '@/context/AuthContext';
import { Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';
import { useFonts } from "expo-font";

export default function RootLayout() {
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
      <Stack>
        <Stack.Screen name="auth" />
        <Stack.Screen name="(app)" />
      </Stack>
    </AuthProvider>);
} 

    
