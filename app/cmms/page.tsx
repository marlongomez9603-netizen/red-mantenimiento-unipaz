"use client";

import { useMemo, useState } from "react";
import {
  cmmsActivos,
  cmmsKpi,
  cmmsOrdenes,
} from "../lib/data";

const tabs = ["Activos", "Planes", "Órdenes", "Indicadores"] as const;
type Tab = (typeof tabs)[number];

const estadoColor: Record<string, string> = {
  Operativo: "text-ok",
  Mantenimiento: "text-amber",
  Falla: "text-alarm",
};
const critColor: Record<string, string> = {
  Alta: "text-alarm",
  Media: "text-amber",
  Baja: "text-ink-dim",
};

export default function CmmsPage() {
  const [tab, setTab] = useState<Tab>("Activos");

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      {/* Barra de aplicación */}
      <div className="panel corner overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-panel-2 px-5 py-3">
          <div className="flex items-center gap-3">
            <span className="led led-live bg-ok text-ok" />
            <span className="font-display text-lg font-extrabold text-ink">
              CMMS <span className="text-amber">MANTÉN·LAB</span>
            </span>
            <span className="tag hidden sm:inline">Sesión: estudiante.demo · Planta Bombeo Norte</span>
          </div>
          <span className="font-mono text-xs text-ink-faint">v1.0 · entorno de práctica</span>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-1 border-b border-line bg-base/40 px-3 py-2">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-sm px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors ${
                tab === t ? "bg-amber text-base" : "text-ink-dim hover:bg-panel-2"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="p-5">
          {tab === "Activos" && <Activos />}
          {tab === "Planes" && <Planes />}
          {tab === "Órdenes" && <Ordenes />}
          {tab === "Indicadores" && <Indicadores />}
        </div>
      </div>

      <p className="mt-4 text-center font-mono text-[0.65rem] uppercase tracking-widest text-ink-faint">
        Datos de demostración con fines didácticos · interactúa con las pestañas y los módulos
      </p>
    </div>
  );
}

function Activos() {
  const [q, setQ] = useState("");
  const filtrados = useMemo(
    () =>
      cmmsActivos.filter(
        (a) =>
          a.nombre.toLowerCase().includes(q.toLowerCase()) ||
          a.codigo.toLowerCase().includes(q.toLowerCase()),
      ),
    [q],
  );
  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="tag">Módulo · Base de datos de activos (ISO 14224)</p>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar activo…"
          className="w-44 rounded-sm border border-line bg-base px-3 py-1.5 font-mono text-xs text-ink outline-none focus:border-amber"
        />
      </div>
      <div className="overflow-x-auto rounded-sm border border-line">
        <table className="w-full text-left text-sm">
          <thead className="bg-panel-2">
            <tr className="tag">
              {["Código", "Activo", "Sistema", "Criticidad", "Estado"].map((h) => (
                <th key={h} className="px-4 py-2.5 font-mono font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtrados.map((a) => (
              <tr key={a.codigo} className="border-t border-line-soft hover:bg-panel-2/60">
                <td className="px-4 py-2.5 font-mono text-amber">{a.codigo}</td>
                <td className="px-4 py-2.5 text-ink">{a.nombre}</td>
                <td className="px-4 py-2.5 text-ink-dim">{a.sistema}</td>
                <td className={`px-4 py-2.5 font-medium ${critColor[a.criticidad]}`}>{a.criticidad}</td>
                <td className={`px-4 py-2.5 ${estadoColor[a.estado]}`}>● {a.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Planes() {
  const [freq, setFreq] = useState(30);
  const ordenesAno = Math.round(365 / freq);
  const horas = ordenesAno * 2.5;
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
      <div>
        <p className="tag mb-3">Módulo · Plan de mantenimiento preventivo</p>
        <div className="rounded-sm border border-line bg-panel-2 p-4">
          <p className="font-display font-bold text-ink">BBA-101 · Bomba centrífuga API 610</p>
          <p className="mt-1 text-sm text-ink-dim">Sistema de bombeo de crudo · criticidad alta</p>
          <ul className="mt-4 space-y-2 text-sm text-ink-dim">
            {[
              "Inspección de sellos mecánicos",
              "Análisis de vibraciones",
              "Lubricación de rodamientos",
              "Verificación de alineación",
            ].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <span className="led bg-teal text-teal" /> {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div>
        <p className="tag mb-3">Simulador de frecuencia → carga de trabajo</p>
        <div className="rounded-sm border border-line bg-panel-2 p-5">
          <label className="flex items-center justify-between text-sm text-ink-dim">
            Frecuencia (días)
            <span className="font-mono text-lg text-amber">{freq}</span>
          </label>
          <input
            type="range"
            min={7}
            max={90}
            step={1}
            value={freq}
            onChange={(e) => setFreq(Number(e.target.value))}
            className="mt-2 w-full accent-amber"
          />
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Stat label="Órdenes / año" value={String(ordenesAno)} tone="text-steel" />
            <Stat label="Horas-hombre / año" value={String(horas)} tone="text-amber" />
          </div>
          <p className="mt-4 text-xs leading-snug text-ink-faint">
            El estudiante observa cómo la frecuencia impacta la carga de trabajo
            y debe balancear costo, riesgo y disponibilidad.
          </p>
        </div>
      </div>
    </div>
  );
}

function Ordenes() {
  const prioColor: Record<string, string> = {
    Urgente: "border-alarm/60 text-alarm",
    Alta: "border-amber/60 text-amber",
    Media: "border-steel/60 text-steel",
    Baja: "border-line text-ink-dim",
  };
  return (
    <div>
      <p className="tag mb-4">Módulo · Órdenes de trabajo (ciclo de vida)</p>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {cmmsOrdenes.map((o) => (
          <div key={o.id} className="panel panel-hover p-4">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-amber">{o.id}</span>
              <span className={`rounded-sm border px-2 py-0.5 font-mono text-[0.65rem] uppercase ${prioColor[o.prioridad]}`}>
                {o.prioridad}
              </span>
            </div>
            <p className="mt-2 text-sm text-ink">{o.tipo} · {o.activo}</p>
            <div className="mt-3 flex items-center justify-between text-xs text-ink-dim">
              <span>{o.tecnico}</span>
              <span className="font-mono">{o.estado}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Indicadores() {
  const toneMap: Record<string, string> = {
    ok: "text-ok",
    steel: "text-steel",
    amber: "text-amber",
    teal: "text-teal",
  };
  return (
    <div>
      <p className="tag mb-4">Módulo · Tablero de indicadores (KPI)</p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cmmsKpi.map((k) => {
          const pct = Math.min(100, (k.valor / (k.meta * 1.1)) * 100);
          return (
            <div key={k.etiqueta} className="panel p-5">
              <p className="tag">{k.etiqueta}</p>
              <p className={`mt-2 font-display text-3xl font-black ${toneMap[k.tono]}`}>
                {k.valor}
                <span className="ml-1 text-base text-ink-faint">{k.unidad}</span>
              </p>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-sm bg-panel-2">
                <div className={`h-full ${toneMap[k.tono].replace("text-", "bg-")}`} style={{ width: `${pct}%` }} />
              </div>
              <p className="mt-2 font-mono text-[0.65rem] text-ink-faint">Meta: {k.meta}{k.unidad}</p>
            </div>
          );
        })}
      </div>
      <div className="mt-4 rounded-sm border border-amber/30 bg-amber/5 p-4 text-sm text-ink-dim">
        <strong className="text-amber">Lectura didáctica:</strong> el MTTR (4.8 h)
        supera la meta y la disponibilidad está por debajo del 95%. El estudiante
        debe proponer acciones de mejora a partir de estos datos en la actividad A3.
      </div>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="rounded-sm border border-line bg-base p-3 text-center">
      <p className={`font-display text-2xl font-black ${tone}`}>{value}</p>
      <p className="tag mt-1">{label}</p>
    </div>
  );
}
