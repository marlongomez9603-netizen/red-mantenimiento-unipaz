import Link from "next/link";
import { actividades } from "../lib/data";

export const metadata = { title: "Actividades · MANTÉN-LAB" };

export default function ActividadesPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <header className="rise">
        <p className="tag mb-3">Capítulo 3 · Planeación de la actividad académica</p>
        <h1 className="font-display text-4xl font-black tracking-tight text-ink sm:text-5xl">
          Secuencia de <span className="text-amber">aprendizaje</span>
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-ink-dim">
          Tres actividades articuladas y progresivas, coherentes con las fases
          del modelo ADDIE. En conjunto desarrollan la competencia de gestionar
          el mantenimiento con un CMMS y resuelven la situación-problema
          identificada.
        </p>
      </header>

      <div className="mt-10 space-y-4">
        {actividades.map((a, i) => (
          <Link
            key={a.slug}
            href={`/actividades/${a.slug}`}
            className="panel panel-hover group flex flex-col gap-4 p-6 md:flex-row md:items-center"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-sm border border-amber/50 bg-amber/5 font-display text-2xl font-black text-amber">
              {a.codigo}
            </span>
            <div className="flex-1">
              <h2 className="font-display text-xl font-bold text-ink group-hover:text-amber">
                {a.titulo}
              </h2>
              <p className="mt-1 text-sm text-ink-dim">{a.objetivoGeneral}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {[a.fase, a.modalidad, a.duracion].map((t) => (
                  <span key={t} className="rounded-sm border border-line-soft bg-panel-2 px-2 py-1 font-mono text-[0.65rem] uppercase tracking-wider text-ink-dim">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <span className="font-mono text-xs uppercase tracking-wider text-ink-faint group-hover:text-amber">
              Abrir →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
