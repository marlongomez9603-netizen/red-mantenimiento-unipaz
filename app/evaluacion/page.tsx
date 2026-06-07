import { actividades } from "../lib/data";

export const metadata = { title: "Evaluación · MANTÉN-LAB" };

const niveles = [
  { n: "Excelente", r: "4.5 – 5.0", d: "Cumple el criterio con dominio técnico y autonomía." },
  { n: "Satisfactorio", r: "3.5 – 4.4", d: "Cumple el criterio con apoyo puntual del docente." },
  { n: "En proceso", r: "3.0 – 3.4", d: "Cumple parcialmente; requiere acompañamiento." },
  { n: "Inicial", r: "< 3.0", d: "No evidencia aún el desempeño esperado." },
];

export default function EvaluacionPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <header className="rise">
        <p className="tag mb-3">Evaluación del aprendizaje en el RED</p>
        <h1 className="font-display text-4xl font-black tracking-tight text-ink sm:text-5xl">
          Cómo se <span className="text-amber">evalúa</span>
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-ink-dim">
          La evaluación es continua y coherente con la fase E de ADDIE. Combina
          retroalimentación formativa inmediata dentro del CMMS con una
          valoración sumativa por rúbrica analítica de cada producto.
        </p>
      </header>

      <section className="mt-10">
        <p className="tag mb-4">Escala de valoración (institucional 0.0 – 5.0)</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {niveles.map((x) => (
            <div key={x.n} className="panel p-4">
              <p className="font-display font-bold text-ink">{x.n}</p>
              <p className="font-mono text-sm text-amber">{x.r}</p>
              <p className="mt-2 text-sm text-ink-dim">{x.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 space-y-6">
        <p className="tag">Pesos de evaluación por actividad</p>
        {actividades.map((a) => (
          <div key={a.slug} className="panel p-6">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-sm border border-amber/50 bg-amber/5 font-display font-black text-amber">
                {a.codigo}
              </span>
              <h2 className="font-display text-lg font-bold text-ink">{a.titulo}</h2>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {a.evaluacion.map((e) => (
                <div key={e.criterio} className="flex items-center gap-3">
                  <div className="h-2 flex-1 overflow-hidden rounded-sm bg-panel-2">
                    <div className="h-full bg-amber" style={{ width: `${e.peso}%` }} />
                  </div>
                  <span className="w-10 text-right font-mono text-xs text-ink">{e.peso}%</span>
                  <span className="flex-1 text-sm text-ink-dim">{e.criterio}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
