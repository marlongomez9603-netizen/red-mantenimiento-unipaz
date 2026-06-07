import Link from "next/link";
import { addie, actividades, curso, problema } from "./lib/data";

export default function Home() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="mx-auto max-w-7xl px-5 py-16 md:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rise">
              <div className="mb-5 flex items-center gap-3">
                <span className="led led-live bg-ok text-ok" />
                <span className="tag">Recurso Educativo Digital · En operación</span>
              </div>
              <h1 className="font-display text-4xl font-black leading-[0.95] tracking-tight text-ink sm:text-6xl">
                AULA DE
                <br />
                <span className="text-amber">MANTENIMIENTO</span>
                <br />
                INDUSTRIAL
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-dim">
                Plataforma que lleva el aula de <strong className="text-ink">
                Programación y Control del Mantenimiento</strong> a un entorno
                real de gestión de activos. El estudiante aprende operando un{" "}
                <strong className="text-ink">CMMS/GMAO</strong>, no llenando
                hojas de cálculo.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/cmms"
                  className="rounded-sm bg-amber px-6 py-3 font-mono text-sm font-semibold uppercase tracking-wider text-base transition-colors hover:bg-amber-deep"
                >
                  Abrir el CMMS →
                </Link>
                <Link
                  href="/modelo-instruccional"
                  className="rounded-sm border border-line px-6 py-3 font-mono text-sm uppercase tracking-wider text-ink transition-colors hover:border-amber"
                >
                  Modelo ADDIE
                </Link>
              </div>
            </div>

            {/* Tarjeta tipo HMI */}
            <div className="corner panel rise p-5" style={{ animationDelay: "0.15s" }}>
              <div className="flex items-center justify-between border-b border-line-soft pb-3">
                <span className="tag">Estado del sistema</span>
                <span className="font-mono text-xs text-ok">● ONLINE</span>
              </div>
              <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-line-soft bg-line-soft py-px">
                {[
                  ["Asignatura", curso.nombre],
                  ["Programa", curso.programa],
                  ["Modelo DI", curso.modelo],
                  ["Modalidad", "b-learning"],
                  ["Cohorte", curso.cohorte],
                  ["Región", "Magdalena Medio"],
                ].map(([k, v]) => (
                  <div key={k} className="bg-panel p-3">
                    <dt className="tag">{k}</dt>
                    <dd className="mt-1 text-sm font-medium text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-4 rounded-sm border border-amber/30 bg-amber/5 p-3">
                <p className="tag mb-1 text-amber">Situación a mejorar</p>
                <p className="text-sm leading-snug text-ink-dim">{problema.titulo}.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="hazard h-1 w-full opacity-40" />
      </section>

      {/* PROBLEMA → SOLUCIÓN */}
      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="panel p-7">
            <p className="tag mb-3 text-alarm">Diagnóstico</p>
            <h2 className="font-display text-2xl font-bold text-ink">
              El problema en el aula
            </h2>
            <p className="mt-3 leading-relaxed text-ink-dim">{problema.descripcion}</p>
          </div>
          <div className="panel p-7">
            <p className="tag mb-3 text-ok">Propuesta</p>
            <h2 className="font-display text-2xl font-bold text-ink">
              La respuesta con TIC
            </h2>
            <p className="mt-3 leading-relaxed text-ink-dim">
              Un RED que simula un CMMS industrial y estructura el aprendizaje
              con el modelo <strong className="text-ink">ADDIE</strong>. El
              estudiante registra activos, programa mantenimientos, gestiona
              órdenes de trabajo y analiza indicadores, cerrando la brecha entre
              la academia y la industria del Magdalena Medio.
            </p>
          </div>
        </div>
      </section>

      {/* ADDIE strip */}
      <section className="border-y border-line bg-panel/40">
        <div className="mx-auto max-w-7xl px-5 py-14">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="tag mb-2">Línea base del diseño instruccional</p>
              <h2 className="font-display text-3xl font-black text-ink">
                Modelo <span className="text-amber">ADDIE</span>
              </h2>
            </div>
            <Link href="/modelo-instruccional" className="hidden font-mono text-xs uppercase tracking-wider text-amber hover:underline sm:block">
              Ver desarrollo completo →
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {addie.map((f, i) => (
              <div key={f.nombre} className="panel panel-hover rise p-4" style={{ animationDelay: `${i * 0.07}s` }}>
                <div className="flex items-center gap-2">
                  <span
                    className="grid h-9 w-9 place-items-center rounded-sm font-display text-lg font-black"
                    style={{ color: f.color, border: `1px solid ${f.color}` }}
                  >
                    {f.sigla}
                  </span>
                  <span className="font-display text-lg font-bold text-ink">{f.nombre}</span>
                </div>
                <p className="mt-3 text-sm leading-snug text-ink-dim">{f.pregunta}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Actividades */}
      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="mb-8">
          <p className="tag mb-2">Capítulo 3 · Desarrollo de la actividad académica</p>
          <h2 className="font-display text-3xl font-black text-ink">
            Tres actividades, una competencia
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {actividades.map((a, i) => (
            <Link
              key={a.slug}
              href={`/actividades/${a.slug}`}
              className="panel panel-hover group flex flex-col p-6"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-bold text-amber">{a.codigo}</span>
                <span className="tag">{a.duracion}</span>
              </div>
              <h3 className="mt-3 font-display text-xl font-bold leading-tight text-ink group-hover:text-amber">
                {a.titulo}
              </h3>
              <p className="mt-2 text-sm text-ink-dim">{a.estrategia}</p>
              <span className="mt-auto pt-5 font-mono text-xs uppercase tracking-wider text-ink-faint group-hover:text-amber">
                Ver planeación →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
