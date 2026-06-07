import { createClient } from "@supabase/supabase-js";

// Estos dos valores son publicos y seguros en el cliente (la proteccion la dan las politicas RLS).
// Se inyectan en tiempo de build desde variables de entorno NEXT_PUBLIC_*.
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const supabase = createClient(
  SUPABASE_URL || "https://placeholder.supabase.co",
  SUPABASE_ANON_KEY || "placeholder-anon-key",
  { auth: { persistSession: true, autoRefreshToken: true } },
);

// Cuentas demo que la propia plataforma crea la primera vez (signUp).
export const DEMO_ACCOUNTS = [
  { email: "docente@manten-lab.demo", password: "docente123", role: "docente", nombre: "Docente Demo" },
  { email: "estudiante@manten-lab.demo", password: "estudiante123", role: "estudiante", nombre: "Estudiante Demo" },
];

export type Rol = "docente" | "estudiante";
