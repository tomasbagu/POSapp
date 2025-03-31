import { Redirect, Slot } from "expo-router";
    import { useContext, useEffect, useState } from "react";
    import { AuthContext } from "@/context/AuthContext";
    import { doc, getDoc } from "firebase/firestore";
    import { db } from "@/utils/Firebase";
    import { View, ActivityIndicator } from "react-native";
    
    export default function RootLayout() {
      const { currentUser } = useContext(AuthContext);
      const [role, setRole] = useState<string | null>(null);
      const [loading, setLoading] = useState(true);
    
      useEffect(() => {
        const fetchRole = async () => {
          if (!currentUser) {
            setLoading(false);
            return;
          }
    
          try {
            const snap = await getDoc(doc(db, "users", currentUser.uid));
            if (snap.exists()) {
              setRole(snap.data()?.role);
            }
          } catch (err) {
            console.error("Error obteniendo el rol:", err);
          } finally {
            setLoading(false);
          }
        };
    
        fetchRole();
      }, [currentUser]);
    
      if (loading) {
        return (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" />
          </View>
        );
      }
    
    
      if (!currentUser) return <Redirect href="/auth/login" />;
    
      if (role === "client") return <Redirect href="/(app)/Client/homeClient" />;
      if (role === "chef") return <Redirect href="/(app)/Chef/homeChef" />;
      if (role === "cashier") return <Redirect href="/(app)/Cashier/homeCash" />;
    
      
      return <Slot />;
    }
    