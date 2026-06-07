"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../lib/auth";
import { supabase } from "../lib/supabase";
import { Activo, Orden, Plan, calcularKpi } from "../lib/cmms";

type Perfil = { id: string; nombre: string | null; role: string };

export default function PanelDocente() {
  const { session, perfil, loading, configured } = useAuth();
  const [estudiantes, setEstudiantes] = useState<Perfil[]>([]);
  const [activos, setActivos] = useState<Activo[]>([]);
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [abierto, setAbierto] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    const [pr, a, p, o] = await Promise.all([
      supabase.from("profiles").select("id, nombre, role"),
      supabase.from("activos").select("*"),
      supabase.from("planes").select("*"),
      supabase.from("ordenes").select("*"),
    ]);
    setEstudiantes(((pr.data as Perfil[]) ?? []).filter((x) => x.role === "estudiante"));
    setActivos((a.data as Activo[]) ?? []);
    setPlanes((p.data as Plan[]) ?? []);
    setOrdenes((o.data as Orden[]) ?? []);
  }, []);

  useEffect(() => { if (perfil?.role === "docente") cargar(); }, [perfil, cargar]);

  if (loading) return <Centro>Cargando…</Centro>;
  if (!configured) return <Centro>La base de datos aún no está configurada.</Centro>;
  if (!session) return <Centro><Link href="/ingresar" className="text-amber underline">Inicia sesión</Link> como docente.</Centro>;
  if (perfil?.role !== "docente")
    return <Centro>Esta sección es exclusiva del rol docente. <Link href="/cmms" className="text-amber underline">Ir al CMMS</Link>.</Centro>;

  const porDueno = (uid: string) => ({
    activos: activos.filter((x) => x.owner === uid),
    planes: planes.filter((x) => x.owner === uid),
    ordenes: ordenes.filter((x) => x.owner === uid),
  });

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <header className="mb-8">
        <p className="tag mb-2">Seguimiento del aprendizaje</p>
        <h1 className="font-display text-4xl font-black text-ink">Panel <span className="text-amber">docente</span></h1>
        <p className="mt-3 text-ink-dim">Avance de cada estudiante en las tres actividades, leído directamente del CMMS.</p>
      </header>

      <div className="mb-6 grid gap-3 sm:grid-cols-4">
        <Resumen label="Estudiantes" value={estudiantes.length} />
        <Resumen label="Activos (A1)" value={activos.length} />
        <Resumen label="Planes (A2)" value={planes.length} />
        <Resumen label="Órdenes (A3)" value={ordenes.length} />
      </div>

      <div className="space-y-3">
        {estudiantes.map((e) => {
          const d = porDueno(e.id);
          const kpi = calcularKpi(d.activos, d.ordenes);
          const open = abierto === e.id;
          return (
            <div key={e.id} className="panel overflow-hidden">
              <button onClick={() => setAbierto(open ? null : e.id)} className="flex w-full items-center justify-between gap-3 p-4 text-left hover:bg-panel-2/50">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-sm border border-steel/50 bg-steel/5 font-display font-black text-steel">
                    {(e.nombre ?? "E")[0].toUpperCase()}
                  </span>
                  <div>
                    <p className="font-display font-bold text-ink">{e.nombre}</p>
                    <p className="font-mono text-xs text-ink-dim">A1: {d.activos.length} activos · A2: {d.planes.length} planes · A3: {d.ordenes.length} órdenes</p>
                  </div>
                </div>
                <span className="font-mono text-xs text-amber">{open ? "cerrar ▲" : "ver ▼"}</span>
              </button>
              {open && (
                <div className="border-t border-line p-4">
                  <div className="mb-4 grid gap-2 sm:grid-cols-4">
                    <Mini label="Disponibilidad" value={`${kpi.disponibilidad}%`} />
                    <Mini label="MTTR" value={`${kpi.mttr} h`} />
                    <Mini label="Cumplim." value={`${kpi.cumplimiento}%`} />
                    <Mini label="OT abiertas" value={`${kpi.abiertas}`} />
                  </div>
                  <div className="grid gap-4 lg:grid-cols-3">
                    <Lista titulo="Activos" items={d.activos.map((x) => `${x.codigo} · ${x.nombre}`)} />
                    <Lista titulo="Planes" items={d.planes.map((x) => `${x.activo_codigo} · ${x.nombre}`)} />
                    <Lista titulo="Órdenes" items={d.ordenes.map((x) => `${x.codigo} · ${x.estado}`)} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {estudiantes.length === 0 && (
          <p className="rounded-sm border border-line-soft bg-panel-2 p-6 text-center text-sm text-ink-faint">
            Aún no hay estudiantes registrados. Cuando un estudiante ingrese y trabaje en el CMMS, su avance aparecerá aquí.
          </p>
        )}
      </div>
    </div>
  );
}

function Centro({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto flex max-w-2xl flex-col items-center px-5 py-24 text-center text-ink-dim">{children}</div>;
}
function Resumen({ label, value }: { label: string; value: number }) {
  return <div className="panel p-4"><p className="tag">{label}</p><p className="mt-1 font-display text-3xl font-black text-amber">{value}</p></div>;
}
function Mini({ label, value }: { label: string; value: string }) {
  return <div className="rounded-sm border border-line bg-panel-2 p-3 text-center"><p className="font-display text-xl font-black text-ink">{value}</p><p className="tag mt-1">{label}</p></div>;
}
function Lista({ titulo, items }: { titulo: string; items: string[] }) {
  return (
    <div>
      <p className="tag mb-2">{titulo}</p>
      <ul className="space-y-1">
        {items.map((x, i) => <li key={i} className="rounded-sm border border-line-soft bg-panel-2 px-2 py-1 font-mono text-xs text-ink-dim">{x}</li>)}
        {items.length === 0 && <li className="font-mono text-xs text-ink-faint">sin registros</li>}
      </ul>
    </div>
  );
}
