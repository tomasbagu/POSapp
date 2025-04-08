import { Stack } from "expo-router";
import { OrderProvider } from "@/context/OrderContext"; // Asegúrate de que esta ruta sea correcta

const Layout = () => {
    return (
        <OrderProvider>
            <Stack screenOptions={{ headerShown: false }} />
        </OrderProvider>
    );
};

export default Layout;
