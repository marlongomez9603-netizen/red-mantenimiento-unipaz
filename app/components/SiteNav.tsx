"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../lib/auth";

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
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { session, perfil, signOut, configured } = useAuth();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const navLinks = perfil?.role === "docente"
    ? [...links, { href: "/panel-docente", label: "Panel docente" }]
    : links;

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-base/85 backdrop-blur-md">
      <div className="hazard h-[3px] w-full opacity-80" />
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-3">
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

        <nav className="hidden items-center gap-1 xl:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-sm px-3 py-2 font-mono text-xs uppercase tracking-wider transition-colors ${
                isActive(l.href) ? "bg-panel-2 text-amber" : "text-ink-dim hover:text-ink"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 xl:flex">
          {configured && session && perfil ? (
            <>
              <span className="flex items-center gap-2 rounded-sm border border-line bg-panel px-3 py-1.5">
                <span className="led bg-ok text-ok" />
                <span className="font-mono text-xs text-ink">{perfil.nombre}</span>
                <span className="font-mono text-[0.6rem] uppercase tracking-wider text-amber">{perfil.role}</span>
              </span>
              <button
                onClick={async () => { await signOut(); router.push("/"); }}
                className="rounded-sm border border-line px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-ink-dim hover:border-alarm hover:text-alarm"
              >
                Salir
              </button>
            </>
          ) : (
            <Link
              href="/ingresar"
              className="rounded-sm bg-amber px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-base hover:bg-amber-deep"
            >
              Ingresar
            </Link>
          )}
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded-sm border border-line px-3 py-2 font-mono text-xs text-ink-dim xl:hidden"
          aria-label="Menú"
        >
          {open ? "CERRAR" : "MENÚ"}
        </button>
      </div>

      {open && (
        <nav className="grid gap-1 border-t border-line px-5 py-3 xl:hidden">
          {navLinks.map((l) => (
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
          <div className="mt-2 border-t border-line-soft pt-2">
            {configured && session && perfil ? (
              <button
                onClick={async () => { await signOut(); setOpen(false); router.push("/"); }}
                className="w-full rounded-sm border border-line px-3 py-2 font-mono text-xs uppercase tracking-wider text-alarm"
              >
                Salir ({perfil.nombre})
              </button>
            ) : (
              <Link
                href="/ingresar"
                onClick={() => setOpen(false)}
                className="block rounded-sm bg-amber px-3 py-2 text-center font-mono text-xs font-semibold uppercase tracking-wider text-base"
              >
                Ingresar
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
