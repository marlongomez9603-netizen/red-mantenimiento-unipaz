import { addie, curso } from "../lib/data";

export const metadata = {
  title: "Modelo ADDIE · MANTÉN-LAB",
};

export default function ModeloPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <header className="rise">
        <p className="tag mb-3">Capítulo 2 · Propuesta de modelo de diseño instruccional</p>
        <h1 className="font-display text-4xl font-black tracking-tight text-ink sm:text-5xl">
          Diseño instruccional con <span className="text-amber">ADDIE</span>
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-ink-dim">
          El RED adopta <strong className="text-ink">ADDIE</strong> (Análisis,
          Diseño, Desarrollo, Implementación y Evaluación) como línea base. Es
          un modelo sistémico, iterativo y centrado en el estudiante, que se
          mapea con naturalidad sobre el flujo real de trabajo de un CMMS y
          permite incorporar las tecnologías digitales en cada fase.
        </p>
      </header>

      {/* Ficha resumen */}
      <div className="mt-10 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {[
          ["Enfoque pedagógico", curso.enfoque],
          ["Población", curso.cohorte],
          ["Asignatura", curso.nombre],
          ["Programa", curso.programa],
          ["Modalidad", curso.modalidad],
        ].map(([k, v]) => (
          <div key={k} className="panel p-4">
            <p className="tag">{k}</p>
            <p className="mt-1 text-sm font-medium text-ink">{v}</p>
          </div>
        ))}
      </div>

      {/* Fases */}
      <div className="mt-12 space-y-5">
        {addie.map((f, i) => (
          <div key={f.nombre} className="panel corner rise overflow-hidden" style={{ animationDelay: `${i * 0.06}s` }}>
            <div className="grid gap-0 md:grid-cols-[260px_1fr]">
              <div
                className="flex flex-col justify-center gap-2 border-b border-line p-6 md:border-b-0 md:border-r"
                style={{ background: `linear-gradient(135deg, ${f.color}14, transparent)` }}
              >
                <span
                  className="grid h-14 w-14 place-items-center rounded-sm font-display text-3xl font-black"
                  style={{ color: f.color, border: `1.5px solid ${f.color}` }}
                >
                  {f.sigla}
                </span>
                <h2 className="font-display text-2xl font-black text-ink">{f.nombre}</h2>
                <p className="font-mono text-xs italic text-ink-dim">{f.pregunta}</p>
              </div>
              <div className="p-6">
                <p className="tag mb-3">Funciones de la fase</p>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {f.acciones.map((a) => (
                    <li key={a} className="flex gap-2 text-sm leading-snug text-ink-dim">
                      <span style={{ color: f.color }}>▸</span>
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 rounded-sm border border-line-soft bg-panel-2 p-3">
                  <p className="tag mb-1" style={{ color: f.color }}>Concreción en el RED</p>
                  <p className="text-sm text-ink-dim">{f.enRED}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Justificación */}
      <section className="mt-12 panel p-7">
        <h2 className="font-display text-2xl font-bold text-ink">
          ¿Por qué ADDIE y no otro modelo?
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {[
            {
              t: "Frente a ASSURE",
              d: "ASSURE es excelente para planear una clase puntual mediada por medios, pero ADDIE abarca todo el ciclo del curso y su mejora continua, necesaria para institucionalizar el CMMS.",
            },
            {
              t: "Frente a Dick y Carey",
              d: "Dick y Carey es muy potente pero exige un nivel de detalle y recursos que excede una asignatura. ADDIE conserva el rigor sistémico con una complejidad manejable.",
            },
            {
              t: "Ventaja decisiva",
              d: "Sus cinco fases se corresponden con el flujo real de un CMMS (datos → planes → ejecución → indicadores), lo que hace transparente el vínculo entre pedagogía y herramienta.",
            },
          ].map((c) => (
            <div key={c.t} className="rounded-sm border border-line-soft bg-panel-2 p-4">
              <p className="font-display font-bold text-amber">{c.t}</p>
              <p className="mt-2 text-sm leading-snug text-ink-dim">{c.d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
