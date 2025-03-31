import { useEffect } from "react";
import { useRouter } from "expo-router";

export default function AuthIndex() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/auth/login"); // Evita que el usuario vuelva atrás a este index
  }, []);

  return null;
}
