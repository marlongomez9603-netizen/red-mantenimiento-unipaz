"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase, supabaseConfigured, type Rol } from "./supabase";

type Perfil = { id: string; nombre: string | null; role: Rol } | null;

type AuthCtx = {
  session: Session | null;
  perfil: Perfil;
  loading: boolean;
  configured: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, role: Rol, nombre: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  refreshPerfil: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [perfil, setPerfil] = useState<Perfil>(null);
  const [loading, setLoading] = useState(true);

  const loadPerfil = useCallback(async (uid?: string) => {
    if (!uid) {
      setPerfil(null);
      return;
    }
    const { data } = await supabase.from("profiles").select("id, nombre, role").eq("id", uid).single();
    if (data) setPerfil(data as Perfil);
  }, []);

  useEffect(() => {
    if (!supabaseConfigured) {
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      loadPerfil(data.session?.user.id).finally(() => setLoading(false));
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      loadPerfil(s?.user.id);
    });
    return () => sub.subscription.unsubscribe();
  }, [loadPerfil]);

  const signIn: AuthCtx["signIn"] = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? { error: error.message } : {};
  };

  const signUp: AuthCtx["signUp"] = async (email, password, role, nombre) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role, nombre } },
    });
    return error ? { error: error.message } : {};
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setPerfil(null);
  };

  return (
    <Ctx.Provider
      value={{
        session,
        perfil,
        loading,
        configured: supabaseConfigured,
        signIn,
        signUp,
        signOut,
        refreshPerfil: () => loadPerfil(session?.user.id),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth fuera de AuthProvider");
  return c;
}
