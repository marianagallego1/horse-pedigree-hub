import { Link, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard, Rabbit, Trophy, BarChart3, UserPlus,
  Settings, Activity, LogOut, LogIn,
} from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Panel", icon: LayoutDashboard },
  { to: "/equinos", label: "Equinos", icon: Rabbit },
  { to: "/campeonatos", label: "Campeonatos", icon: Trophy },
  { to: "/reportes", label: "Reportes", icon: BarChart3 },
  { to: "/health", label: "Estado API", icon: Activity },
];

export function AppLayout({ children }: { children: ReactNode }) {
  const { user, logout, isAdmin } = useAuth();
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col p-5 shrink-0 sticky top-0 h-screen">
        <Link to="/" className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-md bg-sidebar-primary text-sidebar-primary-foreground grid place-items-center font-serif text-lg">H</div>
          <div>
            <div className="font-serif text-lg leading-tight">HorsePedigree</div>
            <div className="text-[11px] uppercase tracking-widest opacity-70">Equine Registry</div>
          </div>
        </Link>

        <nav className="flex flex-col gap-1">
          {nav.map(({ to, label, icon: Icon }) => {
            const active = to === "/" ? path === "/" : path.startsWith(to);
            return (
              <Link key={to} to={to}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition",
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "hover:bg-sidebar-accent",
                )}>
                <Icon className="w-4 h-4" /> {label}
              </Link>
            );
          })}
          {isAdmin && (
            <Link to="/usuarios/nuevo"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition",
                path.startsWith("/usuarios") ? "bg-sidebar-primary text-sidebar-primary-foreground" : "hover:bg-sidebar-accent",
              )}>
              <UserPlus className="w-4 h-4" /> Nuevo usuario
            </Link>
          )}
          <Link to="/configuracion"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition",
              path.startsWith("/configuracion") ? "bg-sidebar-primary text-sidebar-primary-foreground" : "hover:bg-sidebar-accent",
            )}>
            <Settings className="w-4 h-4" /> Configuración
          </Link>
        </nav>

        <div className="mt-auto pt-6 border-t border-sidebar-border">
          {user ? (
            <div className="space-y-2">
              <div className="text-sm">
                <div className="font-medium">{user.nombre} {user.apellido}</div>
                <div className="text-xs opacity-70">{user.rolDescripcion}</div>
              </div>
              <Button variant="secondary" size="sm" className="w-full" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" /> Cerrar sesión
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button size="sm" className="w-full">
                <LogIn className="w-4 h-4 mr-2" /> Iniciar sesión
              </Button>
            </Link>
          )}
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <div className="max-w-6xl mx-auto px-8 py-10">{children}</div>
      </main>
    </div>
  );
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-4 mb-8">
      <div>
        <h1 className="font-serif text-4xl text-foreground">{title}</h1>
        {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}
