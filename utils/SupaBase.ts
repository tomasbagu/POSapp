import { createClient, SupabaseClient } from "@supabase/supabase-js";
import "dotenv/config"; // Carga las variables de entorno

const SUPABASE_URL: string = process.env.EXPO_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY: string = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("Faltan las variables de entorno de Supabase");
}

export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
