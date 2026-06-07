import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-panel/60">
      <div className="hazard h-[3px] w-full opacity-60" />
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:grid-cols-3">
        <div>
          <p className="font-display text-lg font-extrabold text-ink">
            MANTÉN<span className="text-amber">·</span>LAB
          </p>
          <p className="mt-2 max-w-xs text-sm text-ink-dim">
            Recurso Educativo Digital para la asignatura Programación y Control
            del Mantenimiento. Modelo de diseño instruccional ADDIE articulado
            con un CMMS/GMAO.
          </p>
        </div>
        <div>
          <p className="tag mb-3">Navegación</p>
          <ul className="space-y-1.5 text-sm text-ink-dim">
            <li><Link className="hover:text-amber" href="/modelo-instruccional">Modelo ADDIE</Link></li>
            <li><Link className="hover:text-amber" href="/actividades">Actividades de aprendizaje</Link></li>
            <li><Link className="hover:text-amber" href="/cmms">Simulador CMMS</Link></li>
            <li><Link className="hover:text-amber" href="/evaluacion">Evaluación y rúbricas</Link></li>
          </ul>
        </div>
        <div>
          <p className="tag mb-3">Ficha institucional</p>
          <ul className="space-y-1.5 font-mono text-xs text-ink-dim">
            <li>Instituto Universitario de la Paz · UNIPAZ</li>
            <li>Escuela de Ingenierías · Ingeniería de Producción</li>
            <li>Barrancabermeja · Magdalena Medio</li>
            <li>Autor: Marlon Joaquín Gómez Argüello</li>
            <li>EATICE · Universidad de Santander CVUDES</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line-soft py-4 text-center font-mono text-[0.65rem] uppercase tracking-widest text-ink-faint">
        Prototipo educativo · 2026 · Datos de demostración con fines didácticos
      </div>
    </footer>
  );
}
