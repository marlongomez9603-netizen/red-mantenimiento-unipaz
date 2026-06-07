"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/modelo-instruccional", label: "Modelo ADDIE" },
  { href: "/actividades", label: "Actividades" },
  { href: "/cmms", label: "CMMS en vivo" },
  { href: "/evaluacion", label: "Evaluación" },
  { href: "/acceso", label: "Cómo acceder" },
];

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-base/85 backdrop-blur-md">
      <div className="hazard h-[3px] w-full opacity-80" />
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
        <Link href="/" className="group flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-sm border border-amber/60 bg-panel font-display text-amber">
            M
          </span>
          <span className="leading-none">
            <span className="block font-display text-base font-extrabold tracking-tight text-ink">
              MANTÉN<span className="text-amber">·</span>LAB
            </span>
            <span className="tag block">Aula virtual · UNIPAZ</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-sm px-3 py-2 font-mono text-xs uppercase tracking-wider transition-colors ${
                isActive(l.href)
                  ? "bg-panel-2 text-amber"
                  : "text-ink-dim hover:text-ink"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded-sm border border-line px-3 py-2 font-mono text-xs text-ink-dim lg:hidden"
          aria-label="Menú"
        >
          {open ? "CERRAR" : "MENÚ"}
        </button>
      </div>

      {open && (
        <nav className="grid gap-1 border-t border-line px-5 py-3 lg:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`rounded-sm px-3 py-2 font-mono text-xs uppercase tracking-wider ${
                isActive(l.href) ? "bg-panel-2 text-amber" : "text-ink-dim"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
