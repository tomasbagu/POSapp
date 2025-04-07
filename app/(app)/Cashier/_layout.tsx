import { Stack } from "expo-router";
import { DataProvider } from "@/context/DataContext";  // Verifica que esta ruta sea correcta

const Layout = () => {
    return (
        <DataProvider>
            <Stack screenOptions={{ headerShown: false }} />
        </DataProvider>
    );
};

export default Layout;
