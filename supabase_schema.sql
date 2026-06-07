-- ============================================================
-- MANTÉN-LAB · Esquema de base de datos (Supabase / PostgreSQL)
-- RED Aula Virtual de Mantenimiento Industrial - UNIPAZ
-- Ejecutar este script completo en: Supabase > SQL Editor > New query > Run
-- ============================================================

-- ---------- 1. Perfiles (rol de cada usuario) ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nombre text,
  role text not null default 'estudiante' check (role in ('docente', 'estudiante')),
  created_at timestamptz not null default now()
);

-- Función auxiliar: ¿el usuario actual es docente?  (security definer evita recursión en RLS)
create or replace function public.is_docente()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'docente'
  );
$$;

-- Trigger: al registrarse un usuario, crear su perfil con el rol del metadata
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, nombre, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'nombre', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'role', 'estudiante')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- 2. Activos ----------
create table if not exists public.activos (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null default auth.uid() references auth.users (id) on delete cascade,
  codigo text not null,
  nombre text not null,
  sistema text,
  criticidad text check (criticidad in ('Alta', 'Media', 'Baja')) default 'Media',
  estado text check (estado in ('Operativo', 'Mantenimiento', 'Falla')) default 'Operativo',
  created_at timestamptz not null default now()
);

-- ---------- 3. Planes de mantenimiento ----------
create table if not exists public.planes (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null default auth.uid() references auth.users (id) on delete cascade,
  activo_codigo text not null,
  nombre text not null,
  tipo text default 'Preventivo',
  frecuencia_dias int not null default 30,
  tareas text,
  created_at timestamptz not null default now()
);

-- ---------- 4. Órdenes de trabajo ----------
create table if not exists public.ordenes (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null default auth.uid() references auth.users (id) on delete cascade,
  codigo text not null,
  activo_codigo text not null,
  tipo text default 'Correctivo',
  prioridad text check (prioridad in ('Urgente', 'Alta', 'Media', 'Baja')) default 'Media',
  estado text check (estado in ('Abierta', 'En proceso', 'Cerrada')) default 'Abierta',
  tecnico text,
  horas numeric default 0,
  created_at timestamptz not null default now()
);

-- ============================================================
-- 5. Seguridad a nivel de fila (RLS)
-- ============================================================
alter table public.profiles enable row level security;
alter table public.activos  enable row level security;
alter table public.planes   enable row level security;
alter table public.ordenes  enable row level security;

-- Perfiles: cada quien ve/edita el suyo; el docente puede ver todos
drop policy if exists "perfil propio o docente" on public.profiles;
create policy "perfil propio o docente" on public.profiles
  for select using (id = auth.uid() or public.is_docente());

drop policy if exists "insertar perfil propio" on public.profiles;
create policy "insertar perfil propio" on public.profiles
  for insert with check (id = auth.uid());

drop policy if exists "actualizar perfil propio" on public.profiles;
create policy "actualizar perfil propio" on public.profiles
  for update using (id = auth.uid());

-- Plantilla de políticas para las tablas de datos
do $$
declare
  t text;
begin
  foreach t in array array['activos', 'planes', 'ordenes'] loop
    execute format('drop policy if exists "leer propio o docente" on public.%I;', t);
    execute format(
      'create policy "leer propio o docente" on public.%I for select using (owner = auth.uid() or public.is_docente());', t);

    execute format('drop policy if exists "insertar propio" on public.%I;', t);
    execute format(
      'create policy "insertar propio" on public.%I for insert with check (owner = auth.uid());', t);

    execute format('drop policy if exists "actualizar propio" on public.%I;', t);
    execute format(
      'create policy "actualizar propio" on public.%I for update using (owner = auth.uid());', t);

    execute format('drop policy if exists "borrar propio" on public.%I;', t);
    execute format(
      'create policy "borrar propio" on public.%I for delete using (owner = auth.uid());', t);
  end loop;
end $$;

-- ============================================================
-- Listo. El frontend creará las cuentas demo (docente / estudiante)
-- mediante registro, y este esquema asignará el rol automáticamente.
-- ============================================================
