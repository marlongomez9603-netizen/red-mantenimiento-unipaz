"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../lib/auth";
import {
  Activo, Orden, Plan,
  getActivos, getOrdenes, getPlanes,
  addActivo, delActivo, updActivo,
  addPlan, delPlan,
  addOrden, delOrden, updOrden,
  SEED_ACTIVOS, calcularKpi,
} from "../lib/cmms";

const tabs = ["Activos", "Planes", "Órdenes", "Indicadores"] as const;
type Tab = (typeof tabs)[number];

const estadoColor: Record<string, string> = {
  Operativo: "text-ok", Mantenimiento: "text-amber", Falla: "text-alarm",
  Abierta: "text-alarm", "En proceso": "text-amber", Cerrada: "text-ok",
};
const critColor: Record<string, string> = { Alta: "text-alarm", Media: "text-amber", Baja: "text-ink-dim" };

export default function CmmsPage() {
  const { session, perfil, loading, configured } = useAuth();
  const [tab, setTab] = useState<Tab>("Activos");
  const [activos, setActivos] = useState<Activo[]>([]);
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const uid = session?.user.id;

  const refresh = useCallback(async () => {
    if (!uid) return;
    const [a, p, o] = await Promise.all([getActivos(uid), getPlanes(uid), getOrdenes(uid)]);
    setActivos((a.data as Activo[]) ?? []);
    setPlanes((p.data as Plan[]) ?? []);
    setOrdenes((o.data as Orden[]) ?? []);
  }, [uid]);

  useEffect(() => { refresh(); }, [refresh]);

  if (loading) return <Centro>Cargando…</Centro>;

  if (!configured)
    return <Centro>La base de datos aún no está configurada en este despliegue.</Centro>;

  if (!session)
    return (
      <Centro>
        <p className="mb-4 text-ink-dim">Para operar el CMMS debes iniciar sesión.</p>
        <Link href="/ingresar" className="rounded-sm bg-amber px-6 py-3 font-mono text-sm font-semibold uppercase tracking-wider text-base hover:bg-amber-deep">
          Ingresar al RED →
        </Link>
      </Centro>
    );

  const kpi = calcularKpi(activos, ordenes);

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      {perfil?.role === "docente" && (
        <div className="mb-4 rounded-sm border border-amber/40 bg-amber/5 p-3 text-sm text-ink-dim">
          Estás en sesión como <strong className="text-amber">docente</strong>. Aquí operas tu propio entorno de práctica; para revisar el trabajo de los estudiantes ve al{" "}
          <Link href="/panel-docente" className="text-amber underline">Panel docente</Link>.
        </div>
      )}

      <div className="panel corner overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-panel-2 px-5 py-3">
          <div className="flex items-center gap-3">
            <span className="led led-live bg-ok text-ok" />
            <span className="font-display text-lg font-extrabold text-ink">CMMS <span className="text-amber">MANTÉN·LAB</span></span>
            <span className="tag hidden sm:inline">Sesión: {perfil?.nombre} · Planta Bombeo Norte</span>
          </div>
          <span className="font-mono text-xs text-ink-faint">datos guardados en tu cuenta</span>
        </div>

        <div className="flex flex-wrap gap-1 border-b border-line bg-base/40 px-3 py-2">
          {tabs.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`rounded-sm px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors ${tab === t ? "bg-amber text-base" : "text-ink-dim hover:bg-panel-2"}`}>
              {t}
            </button>
          ))}
        </div>

        <div className="p-5">
          {tab === "Activos" && <Activos uid={uid!} activos={activos} refresh={refresh} />}
          {tab === "Planes" && <Planes uid={uid!} activos={activos} planes={planes} refresh={refresh} />}
          {tab === "Órdenes" && <Ordenes uid={uid!} activos={activos} ordenes={ordenes} refresh={refresh} />}
          {tab === "Indicadores" && <Indicadores kpi={kpi} />}
        </div>
      </div>
    </div>
  );
}

function Centro({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto flex max-w-2xl flex-col items-center px-5 py-24 text-center">{children}</div>;
}

const inputCls = "rounded-sm border border-line bg-base px-3 py-2 text-sm text-ink outline-none focus:border-amber";

// ----------------------------- ACTIVOS -----------------------------
function Activos({ uid, activos, refresh }: { uid: string; activos: Activo[]; refresh: () => Promise<void> }) {
  const [f, setF] = useState({ codigo: "", nombre: "", sistema: "", criticidad: "Media", estado: "Operativo" });
  const [busy, setBusy] = useState(false);

  async function crear() {
    if (!f.codigo || !f.nombre) return;
    setBusy(true);
    await addActivo({ ...f, owner: uid } as Omit<Activo, "id">);
    setF({ codigo: "", nombre: "", sistema: "", criticidad: "Media", estado: "Operativo" });
    await refresh(); setBusy(false);
  }
  async function sembrar() {
    setBusy(true);
    for (const a of SEED_ACTIVOS) await addActivo({ ...a, owner: uid });
    await refresh(); setBusy(false);
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="tag">Módulo · Base de datos de activos (ISO 14224) · {activos.length} registros</p>
        {activos.length === 0 && (
          <button onClick={sembrar} disabled={busy} className="rounded-sm border border-line px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-amber hover:border-amber disabled:opacity-50">
            Cargar datos de ejemplo
          </button>
        )}
      </div>

      <Aviso actividad="A1 · Construcción de la base de datos de activos">
        Un <strong className="text-ink">activo</strong> es cualquier equipo de la planta (bombas, motores, compresores). Registra cada uno con un código único,
        su nombre, el sistema al que pertenece y su nivel de criticidad. Esta base es el punto de partida para programar el mantenimiento.
      </Aviso>

      <div className="mb-4 rounded-sm border border-line bg-panel-2 p-4">
        <p className="tag mb-3 text-amber">Registrar un nuevo activo</p>
        <div className="grid items-end gap-3 md:grid-cols-6">
          <Campo label="Código" hint="Ej.: BBA-101">
            <input className={inputCls} placeholder="Código único" value={f.codigo} onChange={(e) => setF({ ...f, codigo: e.target.value })} />
          </Campo>
          <Campo label="Nombre del activo" hint="Equipo y tipo" className="md:col-span-2">
            <input className={inputCls} placeholder="Bomba centrífuga API 610" value={f.nombre} onChange={(e) => setF({ ...f, nombre: e.target.value })} />
          </Campo>
          <Campo label="Sistema" hint="Área o proceso">
            <input className={inputCls} placeholder="Bombeo crudo" value={f.sistema} onChange={(e) => setF({ ...f, sistema: e.target.value })} />
          </Campo>
          <Campo label="Criticidad" hint="Impacto si falla">
            <select className={inputCls} value={f.criticidad} onChange={(e) => setF({ ...f, criticidad: e.target.value })}>
              {["Alta", "Media", "Baja"].map((x) => <option key={x}>{x}</option>)}
            </select>
          </Campo>
          <button onClick={crear} disabled={busy} className="h-[38px] rounded-sm bg-amber px-3 font-mono text-xs font-semibold uppercase text-base hover:bg-amber-deep disabled:opacity-50">
            Agregar
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-sm border border-line">
        <table className="w-full text-left text-sm">
          <thead className="bg-panel-2"><tr className="tag">
            {["Código", "Activo", "Sistema", "Criticidad", "Estado", ""].map((h) => <th key={h} className="px-4 py-2.5 font-mono font-medium">{h}</th>)}
          </tr></thead>
          <tbody>
            {activos.map((a) => (
              <tr key={a.id} className="border-t border-line-soft hover:bg-panel-2/60">
                <td className="px-4 py-2.5 font-mono text-amber">{a.codigo}</td>
                <td className="px-4 py-2.5 text-ink">{a.nombre}</td>
                <td className="px-4 py-2.5 text-ink-dim">{a.sistema}</td>
                <td className={`px-4 py-2.5 font-medium ${critColor[a.criticidad]}`}>{a.criticidad}</td>
                <td className="px-4 py-2.5">
                  <select value={a.estado} onChange={async (e) => { await updActivo(a.id, { estado: e.target.value as Activo["estado"] }); refresh(); }}
                    className={`bg-transparent font-mono text-xs outline-none ${estadoColor[a.estado]}`}>
                    {["Operativo", "Mantenimiento", "Falla"].map((x) => <option key={x} className="bg-panel text-ink">{x}</option>)}
                  </select>
                </td>
                <td className="px-4 py-2.5 text-right">
                  <button onClick={async () => { await delActivo(a.id); refresh(); }} className="font-mono text-xs text-ink-faint hover:text-alarm">Eliminar</button>
                </td>
              </tr>
            ))}
            {activos.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-ink-faint">Sin activos. Agrega uno o carga los datos de ejemplo.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ----------------------------- PLANES -----------------------------
function Planes({ uid, activos, planes, refresh }: { uid: string; activos: Activo[]; planes: Plan[]; refresh: () => Promise<void> }) {
  const [f, setF] = useState({ activo_codigo: "", nombre: "", frecuencia_dias: 30, tareas: "" });
  const [busy, setBusy] = useState(false);
  const ordenesAno = f.frecuencia_dias ? Math.round(365 / f.frecuencia_dias) : 0;
  const horas = Math.round(ordenesAno * 2.5);

  async function crear() {
    if (!f.activo_codigo || !f.nombre) return;
    setBusy(true);
    await addPlan({ ...f, tipo: "Preventivo", owner: uid } as Omit<Plan, "id">);
    setF({ activo_codigo: "", nombre: "", frecuencia_dias: 30, tareas: "" });
    await refresh(); setBusy(false);
  }

  return (
    <div>
      <Aviso actividad="A2 · Diseño de un plan de mantenimiento preventivo">
        Un <strong className="text-ink">plan preventivo</strong> define qué tareas se le hacen a un activo y cada cuánto, para evitar fallas.
        Elige un activo, nómbralo, lista sus tareas y ajusta la frecuencia. El sistema te muestra cuántas órdenes y horas de trabajo generará al año.
      </Aviso>
      <div className="grid gap-5 lg:grid-cols-2">
      <div>
        <p className="tag mb-3 text-amber">Nuevo plan de mantenimiento preventivo</p>
        <div className="space-y-3 rounded-sm border border-line bg-panel-2 p-4">
          <Campo label="Activo a intervenir" hint="Elige uno de los que registraste en A1">
            <select className={`${inputCls} w-full`} value={f.activo_codigo} onChange={(e) => setF({ ...f, activo_codigo: e.target.value })}>
              <option value="">Selecciona un activo…</option>
              {activos.map((a) => <option key={a.id} value={a.codigo}>{a.codigo} · {a.nombre}</option>)}
            </select>
          </Campo>
          <Campo label="Nombre del plan" hint="Ej.: Preventivo bomba API 610">
            <input className={`${inputCls} w-full`} placeholder="Nombre del plan" value={f.nombre} onChange={(e) => setF({ ...f, nombre: e.target.value })} />
          </Campo>
          <Campo label="Tareas del plan" hint="Una tarea por línea (inspección, lubricación…)">
            <textarea className={`${inputCls} w-full`} rows={2} placeholder="Inspección de sellos&#10;Análisis de vibraciones" value={f.tareas} onChange={(e) => setF({ ...f, tareas: e.target.value })} />
          </Campo>
          <label className="flex items-center justify-between text-sm text-ink-dim">
            <span className="tag">Frecuencia: cada cuántos días se ejecuta</span>
            <span className="font-mono text-lg text-amber">{f.frecuencia_dias} días</span>
          </label>
          <input type="range" min={7} max={90} value={f.frecuencia_dias} onChange={(e) => setF({ ...f, frecuencia_dias: Number(e.target.value) })} className="w-full accent-amber" />
          <div className="grid grid-cols-2 gap-2 pt-1">
            <Mini label="Órdenes / año" value={ordenesAno} tone="text-steel" />
            <Mini label="Horas-hombre / año" value={horas} tone="text-amber" />
          </div>
          <button onClick={crear} disabled={busy} className="mt-1 w-full rounded-sm bg-amber px-3 py-2 font-mono text-xs font-semibold uppercase text-base hover:bg-amber-deep disabled:opacity-50">
            Guardar plan
          </button>
        </div>
      </div>
      <div>
        <p className="tag mb-3">Planes programados · {planes.length}</p>
        <div className="space-y-2">
          {planes.map((p) => (
            <div key={p.id} className="panel p-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-amber">{p.activo_codigo}</span>
                <button onClick={async () => { await delPlan(p.id); refresh(); }} className="font-mono text-xs text-ink-faint hover:text-alarm">Eliminar</button>
              </div>
              <p className="mt-1 font-display font-bold text-ink">{p.nombre}</p>
              <p className="font-mono text-xs text-ink-dim">Cada {p.frecuencia_dias} días · {p.tipo}</p>
            </div>
          ))}
          {planes.length === 0 && <p className="rounded-sm border border-line-soft bg-panel-2 p-4 text-center text-sm text-ink-faint">Aún no hay planes.</p>}
        </div>
      </div>
      </div>
    </div>
  );
}

// ----------------------------- ÓRDENES -----------------------------
function Ordenes({ uid, activos, ordenes, refresh }: { uid: string; activos: Activo[]; ordenes: Orden[]; refresh: () => Promise<void> }) {
  const [f, setF] = useState({ activo_codigo: "", tipo: "Correctivo", prioridad: "Media", tecnico: "", horas: 0 });
  const [busy, setBusy] = useState(false);
  const prioColor: Record<string, string> = { Urgente: "border-alarm/60 text-alarm", Alta: "border-amber/60 text-amber", Media: "border-steel/60 text-steel", Baja: "border-line text-ink-dim" };

  async function crear() {
    if (!f.activo_codigo) return;
    setBusy(true);
    const codigo = "OT-" + Math.floor(1000 + Math.random() * 9000);
    await addOrden({ ...f, codigo, estado: "Abierta", owner: uid } as Omit<Orden, "id">);
    setF({ activo_codigo: "", tipo: "Correctivo", prioridad: "Media", tecnico: "", horas: 0 });
    await refresh(); setBusy(false);
  }

  return (
    <div>
      <p className="tag mb-3">Módulo · Órdenes de trabajo · {ordenes.length}</p>
      <Aviso actividad="A3 · Gestión de órdenes de trabajo e indicadores">
        Una <strong className="text-ink">orden de trabajo (OT)</strong> es la instrucción para intervenir un activo. Ábrela indicando el activo, el tipo de trabajo,
        su prioridad, el técnico responsable y las horas. Luego cambia su estado hasta cerrarla; con esos datos el sistema calcula los indicadores.
      </Aviso>
      <div className="mb-4 rounded-sm border border-line bg-panel-2 p-4">
        <p className="tag mb-3 text-amber">Abrir una nueva orden de trabajo</p>
        <div className="grid items-end gap-3 md:grid-cols-6">
          <Campo label="Activo" hint="¿Qué equipo se interviene?">
            <select className={inputCls} value={f.activo_codigo} onChange={(e) => setF({ ...f, activo_codigo: e.target.value })}>
              <option value="">Selecciona…</option>
              {activos.map((a) => <option key={a.id} value={a.codigo}>{a.codigo}</option>)}
            </select>
          </Campo>
          <Campo label="Tipo de trabajo" hint="Correctivo: por falla">
            <select className={inputCls} value={f.tipo} onChange={(e) => setF({ ...f, tipo: e.target.value })}>
              {["Correctivo", "Preventivo", "Inspección"].map((x) => <option key={x}>{x}</option>)}
            </select>
          </Campo>
          <Campo label="Prioridad" hint="Urgencia de atención">
            <select className={inputCls} value={f.prioridad} onChange={(e) => setF({ ...f, prioridad: e.target.value })}>
              {["Urgente", "Alta", "Media", "Baja"].map((x) => <option key={x}>{x}</option>)}
            </select>
          </Campo>
          <Campo label="Técnico" hint="Responsable">
            <input className={inputCls} placeholder="Nombre" value={f.tecnico} onChange={(e) => setF({ ...f, tecnico: e.target.value })} />
          </Campo>
          <Campo label="Horas" hint="Duración estimada">
            <input className={inputCls} type="number" min={0} step={0.5} placeholder="0" value={f.horas} onChange={(e) => setF({ ...f, horas: Number(e.target.value) })} />
          </Campo>
          <button onClick={crear} disabled={busy} className="h-[38px] rounded-sm bg-amber px-3 font-mono text-xs font-semibold uppercase text-base hover:bg-amber-deep disabled:opacity-50">Abrir OT</button>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {ordenes.map((o) => (
          <div key={o.id} className="panel p-4">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-amber">{o.codigo}</span>
              <span className={`rounded-sm border px-2 py-0.5 font-mono text-[0.65rem] uppercase ${prioColor[o.prioridad]}`}>{o.prioridad}</span>
            </div>
            <p className="mt-2 text-sm text-ink">{o.tipo} · {o.activo_codigo}</p>
            <p className="font-mono text-xs text-ink-dim">{o.tecnico || "sin asignar"} · {o.horas} h</p>
            <div className="mt-3 flex items-center justify-between">
              <select value={o.estado} onChange={async (e) => { await updOrden(o.id, { estado: e.target.value as Orden["estado"] }); refresh(); }}
                className={`bg-transparent font-mono text-xs outline-none ${estadoColor[o.estado]}`}>
                {["Abierta", "En proceso", "Cerrada"].map((x) => <option key={x} className="bg-panel text-ink">{x}</option>)}
              </select>
              <button onClick={async () => { await delOrden(o.id); refresh(); }} className="font-mono text-xs text-ink-faint hover:text-alarm">Eliminar</button>
            </div>
          </div>
        ))}
        {ordenes.length === 0 && <p className="md:col-span-3 rounded-sm border border-line-soft bg-panel-2 p-6 text-center text-sm text-ink-faint">Sin órdenes de trabajo. Abre una con el formulario superior.</p>}
      </div>
    </div>
  );
}

// ----------------------------- INDICADORES -----------------------------
function Indicadores({ kpi }: { kpi: ReturnType<typeof calcularKpi> }) {
  const cards = [
    { etiqueta: "Disponibilidad", valor: kpi.disponibilidad, unidad: "%", tone: "text-ok", desc: "% de activos en estado Operativo" },
    { etiqueta: "MTTR", valor: kpi.mttr, unidad: "h", tone: "text-amber", desc: "Tiempo medio de reparación (correctivos cerrados)" },
    { etiqueta: "Cumplim. plan", valor: kpi.cumplimiento, unidad: "%", tone: "text-teal", desc: "% de órdenes cerradas sobre el total" },
    { etiqueta: "OT abiertas", valor: kpi.abiertas, unidad: "", tone: "text-steel", desc: "Órdenes aún sin cerrar" },
  ];
  return (
    <div>
      <p className="tag mb-4">Módulo · Tablero de indicadores (calculados con tus datos)</p>
      <Aviso actividad="A3 · Indicadores de mantenimiento">
        Estos <strong className="text-ink">indicadores (KPI)</strong> miden la salud del mantenimiento y se calculan solos con los activos y órdenes que registras.
        Tu tarea es interpretarlos y proponer mejoras.
      </Aviso>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((k) => (
          <div key={k.etiqueta} className="panel p-5">
            <p className="tag">{k.etiqueta}</p>
            <p className={`mt-2 font-display text-3xl font-black ${k.tone}`}>{k.valor}<span className="ml-1 text-base text-ink-faint">{k.unidad}</span></p>
            <p className="mt-1 text-xs leading-snug text-ink-faint">{k.desc}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-sm border border-amber/30 bg-amber/5 p-4 text-sm text-ink-dim">
        <strong className="text-amber">Lectura didáctica:</strong> estos indicadores se recalculan a partir de los activos y las órdenes que registras. En la actividad A3 debes interpretarlos y proponer acciones de mejora.
      </div>
    </div>
  );
}

function Mini({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="rounded-sm border border-line bg-base p-2 text-center">
      <p className={`font-display text-xl font-black ${tone}`}>{value}</p>
      <p className="tag mt-1">{label}</p>
    </div>
  );
}

function Campo({ label, hint, children, className }: { label: string; hint?: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`flex flex-col gap-1 ${className ?? ""}`}>
      <span className="tag text-ink-dim">{label}</span>
      {children}
      {hint && <span className="font-mono text-[0.62rem] text-ink-faint">{hint}</span>}
    </label>
  );
}

function Aviso({ actividad, children }: { actividad: string; children: React.ReactNode }) {
  return (
    <div className="mb-4 rounded-sm border border-steel/30 bg-steel/5 p-4">
      <p className="mb-1 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-steel">
        <span className="led bg-steel text-steel" /> {actividad}
      </p>
      <p className="text-sm leading-relaxed text-ink-dim">{children}</p>
    </div>
  );
}
