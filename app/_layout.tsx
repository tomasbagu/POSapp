import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { DataProvider } from "../context/DataContext";  // Importación agregada

export default function Layout() {
    return (
        <AuthProvider>
            <DataProvider>  
                <Stack screenOptions={{ headerShown: false }} />
            </DataProvider>
        </AuthProvider>
    );
}
