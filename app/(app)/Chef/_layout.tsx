import { OrderProvider } from "@/context/OrderContext";
import { Slot, Stack } from "expo-router";
export default function ChefLayout() {
  return (<OrderProvider>
              <Stack screenOptions={{ headerShown: false }} />
          </OrderProvider>);
}