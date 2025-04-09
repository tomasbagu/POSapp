import { Stack } from "expo-router";
import { DataProvider } from "@/context/DataContext"; // Verifica que esta ruta sea correcta
import { OrderProvider } from "@/context/OrderContext";

const Layout = () => {
  return (
    <DataProvider>
      <OrderProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </OrderProvider>
    </DataProvider>
  );
};

export default Layout;
