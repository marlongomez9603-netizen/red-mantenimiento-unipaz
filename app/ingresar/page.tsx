"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../lib/auth";
import { DEMO_ACCOUNTS, type Rol } from "../lib/supabase";

export default function IngresarPage() {
  const { signIn, signUp, configured } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const goByRole = (role: Rol) => router.push(role === "docente" ? "/panel-docente" : "/cmms");

  async function entrar(e?: React.FormEvent) {
    e?.preventDefault();
    setBusy(true);
    setMsg(null);
    const { error } = await signIn(email, password);
    setBusy(false);
    if (error) { setMsg("No se pudo iniciar sesión: " + error); return; }
    const demo = DEMO_ACCOUNTS.find((d) => d.email === email);
    goByRole((demo?.role as Rol) ?? "estudiante");
  }

  async function entrarDemo(role: Rol) {
    const acc = DEMO_ACCOUNTS.find((d) => d.role === role)!;
    setBusy(true);
    setMsg(null);
    let r = await signIn(acc.email, acc.password);
    if (r.error) {
      // Si aun no existen, las crea y vuelve a entrar
      await signUp(acc.email, acc.password, acc.role as Rol, acc.nombre);
      r = await signIn(acc.email, acc.password);
    }
    setBusy(false);
    if (r.error) { setMsg("Aviso: " + r.error + ". Si menciona confirmación de correo, desactívala en Supabase."); return; }
    goByRole(role);
  }

  async function crearCuentasDemo() {
    setBusy(true);
    setMsg(null);
    for (const a of DEMO_ACCOUNTS) {
      await signUp(a.email, a.password, a.role as Rol, a.nombre);
    }
    setBusy(false);
    setMsg("Cuentas demo creadas (o ya existentes). Ya puedes ingresar con los botones de arriba.");
  }

  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <div className="panel corner p-8">
        <div className="mb-6 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-sm border border-amber/60 bg-panel font-display text-amber">M</span>
          <div>
            <h1 className="font-display text-2xl font-black text-ink">Ingresar al RED</h1>
            <p className="tag">MANTÉN·LAB · CMMS</p>
          </div>
        </div>

        {!configured && (
          <div className="mb-5 rounded-sm border border-alarm/40 bg-alarm/5 p-3 text-sm text-ink-dim">
            La conexión con la base de datos aún no está configurada en este despliegue.
          </div>
        )}

        <form onSubmit={entrar} className="space-y-3">
          <input
            type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo" autoComplete="username"
            className="w-full rounded-sm border border-line bg-base px-3 py-2.5 text-sm text-ink outline-none focus:border-amber"
          />
          <input
            type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña" autoComplete="current-password"
            className="w-full rounded-sm border border-line bg-base px-3 py-2.5 text-sm text-ink outline-none focus:border-amber"
          />
          <button
            type="submit" disabled={busy}
            className="w-full rounded-sm bg-amber px-4 py-2.5 font-mono text-sm font-semibold uppercase tracking-wider text-base hover:bg-amber-deep disabled:opacity-50"
          >
            {busy ? "Procesando…" : "Entrar"}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3 text-ink-faint">
          <div className="h-px flex-1 bg-line" />
          <span className="tag">Acceso rápido demo</span>
          <div className="h-px flex-1 bg-line" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => entrarDemo("estudiante")} disabled={busy}
            className="rounded-sm border border-steel/50 bg-steel/5 px-3 py-3 text-left transition-colors hover:border-steel disabled:opacity-50">
            <span className="block font-display font-bold text-ink">Estudiante</span>
            <span className="block font-mono text-[0.65rem] text-ink-dim">opera el CMMS</span>
          </button>
          <button onClick={() => entrarDemo("docente")} disabled={busy}
            className="rounded-sm border border-amber/50 bg-amber/5 px-3 py-3 text-left transition-colors hover:border-amber disabled:opacity-50">
            <span className="block font-display font-bold text-ink">Docente</span>
            <span className="block font-mono text-[0.65rem] text-ink-dim">revisa el trabajo</span>
          </button>
        </div>

        <div className="mt-4 rounded-sm border border-line-soft bg-panel-2 p-3 font-mono text-[0.7rem] leading-relaxed text-ink-dim">
          <p>docente@manten-lab.demo · docente123</p>
          <p>estudiante@manten-lab.demo · estudiante123</p>
        </div>

        <button onClick={crearCuentasDemo} disabled={busy}
          className="mt-3 w-full rounded-sm border border-line px-3 py-2 font-mono text-xs uppercase tracking-wider text-ink-dim hover:border-amber disabled:opacity-50">
          Crear cuentas demo (primera vez)
        </button>

        {msg && <p className="mt-4 text-sm text-amber">{msg}</p>}
      </div>
    </div>
  );
}
