import { useEffect } from "react";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/auth/login"); // Redirige a login directamente
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return null; // No renderiza nada mientras espera
}
