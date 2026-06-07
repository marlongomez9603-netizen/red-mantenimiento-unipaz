export const metadata = { title: "Cómo acceder · MANTÉN-LAB" };

const pasos = [
  {
    t: "Ingresar al RED",
    d: "El estudiante abre la dirección pública de la plataforma desde el aula virtual institucional. No requiere instalación: funciona en cualquier navegador.",
  },
  {
    t: "Identificarse",
    d: "Accede con autenticación real. Hay dos roles: estudiante (opera el CMMS y guarda su trabajo) y docente (revisa el avance de cada estudiante en el panel). Para pruebas se ofrecen cuentas demo: estudiante@manten-lab.demo y docente@manten-lab.demo.",
  },
  {
    t: "Explorar el aula",
    d: "Desde el menú navega entre el modelo ADDIE, las tres actividades y el simulador CMMS. Cada actividad expone su objetivo, pasos, recursos y rúbrica.",
  },
  {
    t: "Operar el CMMS",
    d: "En la sección CMMS en vivo registra activos, programa planes, gestiona órdenes de trabajo y consulta el tablero de indicadores.",
  },
  {
    t: "Ser evaluado",
    d: "El docente valora cada producto con la rúbrica analítica; el estudiante recibe retroalimentación y puede reintentar las actividades formativas.",
  },
  {
    t: "Presentar resultados y salir",
    d: "El estudiante exporta su informe técnico de la actividad A3, lo entrega en el aula virtual y cierra la sesión de forma segura.",
  },
];

export default function AccesoPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-14">
      <header className="rise">
        <p className="tag mb-3">Estructuración del proceso de enseñanza y aprendizaje mediante RED</p>
        <h1 className="font-display text-4xl font-black tracking-tight text-ink sm:text-5xl">
          Cómo se <span className="text-amber">usa</span> la plataforma
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-ink-dim">
          Ruta completa de uso del RED: desde el acceso hasta la presentación de
          resultados y el cierre de sesión.
        </p>
      </header>

      <ol className="relative mt-10 space-y-6 border-l border-line pl-8">
        {pasos.map((p, i) => (
          <li key={p.t} className="relative rise" style={{ animationDelay: `${i * 0.06}s` }}>
            <span className="absolute -left-[42px] grid h-8 w-8 place-items-center rounded-full border border-amber bg-base font-mono text-sm text-amber">
              {i + 1}
            </span>
            <div className="panel p-5">
              <h2 className="font-display text-lg font-bold text-ink">{p.t}</h2>
              <p className="mt-1 text-sm leading-relaxed text-ink-dim">{p.d}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-10 panel corner p-6">
        <p className="tag mb-2 text-amber">Requisitos técnicos</p>
        <ul className="grid gap-2 text-sm text-ink-dim sm:grid-cols-2">
          <li>▸ Navegador web actualizado (Chrome, Edge, Firefox)</li>
          <li>▸ Conexión a internet estándar</li>
          <li>▸ Equipo de escritorio, portátil o móvil</li>
          <li>▸ No requiere instalación ni licencias</li>
        </ul>
      </div>
    </div>
  );
}
