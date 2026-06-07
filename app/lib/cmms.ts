import { supabase } from "./supabase";

export type Activo = {
  id: string; codigo: string; nombre: string; sistema: string | null;
  criticidad: "Alta" | "Media" | "Baja"; estado: "Operativo" | "Mantenimiento" | "Falla";
  owner?: string;
};
export type Plan = {
  id: string; activo_codigo: string; nombre: string; tipo: string;
  frecuencia_dias: number; tareas: string | null; owner?: string;
};
export type Orden = {
  id: string; codigo: string; activo_codigo: string; tipo: string;
  prioridad: "Urgente" | "Alta" | "Media" | "Baja"; estado: "Abierta" | "En proceso" | "Cerrada";
  tecnico: string | null; horas: number; owner?: string;
};

// ---------- Lecturas (RLS filtra por dueno; el docente ve todo) ----------
export const getActivos = (ownerFilter?: string) =>
  build("activos", ownerFilter);
export const getPlanes = (ownerFilter?: string) =>
  build("planes", ownerFilter);
export const getOrdenes = (ownerFilter?: string) =>
  build("ordenes", ownerFilter);

function build(table: string, ownerFilter?: string) {
  let q = supabase.from(table).select("*").order("created_at", { ascending: true });
  if (ownerFilter) q = q.eq("owner", ownerFilter);
  return q;
}

// ---------- Escrituras ----------
export const addActivo = (a: Omit<Activo, "id">) => supabase.from("activos").insert(a);
export const delActivo = (id: string) => supabase.from("activos").delete().eq("id", id);
export const updActivo = (id: string, patch: Partial<Activo>) => supabase.from("activos").update(patch).eq("id", id);

export const addPlan = (p: Omit<Plan, "id">) => supabase.from("planes").insert(p);
export const delPlan = (id: string) => supabase.from("planes").delete().eq("id", id);

export const addOrden = (o: Omit<Orden, "id">) => supabase.from("ordenes").insert(o);
export const delOrden = (id: string) => supabase.from("ordenes").delete().eq("id", id);
export const updOrden = (id: string, patch: Partial<Orden>) => supabase.from("ordenes").update(patch).eq("id", id);

// ---------- Datos de ejemplo (para arrancar la actividad A1) ----------
export const SEED_ACTIVOS: Omit<Activo, "id" | "owner">[] = [
  { codigo: "BBA-101", nombre: "Bomba centrífuga API 610", sistema: "Bombeo crudo", criticidad: "Alta", estado: "Operativo" },
  { codigo: "MOT-204", nombre: "Motor eléctrico 75 kW", sistema: "Bombeo crudo", criticidad: "Alta", estado: "Mantenimiento" },
  { codigo: "INT-310", nombre: "Intercambiador de calor", sistema: "Tratamiento", criticidad: "Media", estado: "Operativo" },
  { codigo: "CMP-415", nombre: "Compresor de tornillo", sistema: "Aire de planta", criticidad: "Alta", estado: "Falla" },
];

// ---------- KPI derivados del trabajo del estudiante ----------
export function calcularKpi(activos: Activo[], ordenes: Orden[]) {
  const totalAct = activos.length || 1;
  const operativos = activos.filter((a) => a.estado === "Operativo").length;
  const disponibilidad = Math.round((operativos / totalAct) * 1000) / 10;

  const cerradas = ordenes.filter((o) => o.estado === "Cerrada");
  const correctivasCerr = cerradas.filter((o) => o.tipo === "Correctivo");
  const mttr = correctivasCerr.length
    ? Math.round((correctivasCerr.reduce((s, o) => s + Number(o.horas || 0), 0) / correctivasCerr.length) * 10) / 10
    : 0;
  const cumplimiento = ordenes.length
    ? Math.round((cerradas.length / ordenes.length) * 100)
    : 0;
  const abiertas = ordenes.filter((o) => o.estado !== "Cerrada").length;

  return { disponibilidad, mttr, cumplimiento, abiertas, totalOrdenes: ordenes.length };
}
