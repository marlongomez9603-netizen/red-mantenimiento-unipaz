import Link from "next/link";
import { notFound } from "next/navigation";
import { actividades } from "../../lib/data";

export function generateStaticParams() {
  return actividades.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = actividades.find((x) => x.slug === slug);
  return { title: a ? `${a.codigo} · ${a.titulo}` : "Actividad" };
}

export default async function ActividadDetalle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = actividades.find((x) => x.slug === slug);
  if (!a) notFound();

  const idx = actividades.findIndex((x) => x.slug === a.slug);
  const next = actividades[(idx + 1) % actividades.length];

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <Link href="/actividades" className="font-mono text-xs uppercase tracking-wider text-ink-faint hover:text-amber">
        ← Actividades
      </Link>

      <header className="rise mt-5 panel corner p-7">
        <div className="flex flex-wrap items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-sm border border-amber/50 bg-amber/5 font-display text-xl font-black text-amber">
            {a.codigo}
          </span>
          <span className="tag">{a.fase}</span>
        </div>
        <h1 className="mt-4 font-display text-3xl font-black leading-tight text-ink sm:text-4xl">
          {a.titulo}
        </h1>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            ["Duración", a.duracion],
            ["Modalidad", a.modalidad],
            ["Estrategia", a.estrategia],
          ].map(([k, v]) => (
            <div key={k} className="rounded-sm border border-line-soft bg-panel-2 p-3">
              <p className="tag">{k}</p>
              <p className="mt-1 text-sm font-medium text-ink">{v}</p>
            </div>
          ))}
        </div>
      </header>

      {/* Objetivos */}
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <section className="panel p-6">
          <p className="tag mb-2 text-amber">Objetivo general</p>
          <p className="leading-relaxed text-ink">{a.objetivoGeneral}</p>
          <p className="tag mb-2 mt-5 text-amber">Objetivos específicos</p>
          <ul className="space-y-2">
            {a.objetivosEspecificos.map((o) => (
              <li key={o} className="flex gap-2 text-sm text-ink-dim">
                <span className="text-amber">▸</span>
                <span>{o}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="panel p-6">
          <p className="tag mb-2 text-teal">Temáticas</p>
          <ul className="space-y-2">
            {a.temas.map((t) => (
              <li key={t} className="flex gap-2 text-sm text-ink-dim">
                <span className="text-teal">▸</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
          <p className="tag mb-2 mt-5 text-teal">Recursos educativos</p>
          <div className="flex flex-wrap gap-2">
            {a.recursos.map((r) => (
              <span key={r} className="rounded-sm border border-line-soft bg-panel-2 px-2 py-1 text-xs text-ink-dim">
                {r}
              </span>
            ))}
          </div>
        </section>
      </div>

      {/* Paso a paso */}
      <section className="mt-6 panel p-7">
        <p className="tag mb-5 text-steel">Paso a paso de la actividad</p>
        <ol className="relative space-y-6 border-l border-line pl-7">
          {a.pasos.map((p, i) => (
            <li key={p.titulo} className="relative">
              <span className="absolute -left-[35px] grid h-6 w-6 place-items-center rounded-full border border-amber bg-base font-mono text-xs text-amber">
                {i + 1}
              </span>
              <h3 className="font-display font-bold text-ink">{p.titulo}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-dim">{p.detalle}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Evaluación */}
      <section className="mt-6 panel p-7">
        <p className="tag mb-4 text-alarm">Evaluación · rúbrica analítica</p>
        <div className="space-y-3">
          {a.evaluacion.map((e) => (
            <div key={e.criterio}>
              <div className="flex justify-between text-sm">
                <span className="text-ink-dim">{e.criterio}</span>
                <span className="font-mono text-ink">{e.peso}%</span>
              </div>
              <div className="mt-1 h-2 w-full overflow-hidden rounded-sm bg-panel-2">
                <div className="h-full bg-amber" style={{ width: `${e.peso}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Referencias */}
      <section className="mt-6 panel p-7">
        <p className="tag mb-3">Referencias de apoyo</p>
        <ul className="space-y-2">
          {a.referencias.map((r) => (
            <li key={r} className="border-l-2 border-line-soft pl-3 text-sm text-ink-dim">
              {r}
            </li>
          ))}
        </ul>
      </section>

      <Link
        href={`/actividades/${next.slug}`}
        className="mt-8 flex items-center justify-between panel panel-hover p-5"
      >
        <span className="tag">Siguiente actividad</span>
        <span className="font-display font-bold text-ink">
          {next.codigo} · {next.titulo} →
        </span>
      </Link>
    </div>
  );
}
