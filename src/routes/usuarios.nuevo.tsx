import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { AppLayout, PageHeader } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/usuarios/nuevo")({ component: Page });

function Page() {
  const { isAdmin } = useAuth();
  const nav = useNavigate();
  const [s, setS] = useState({ nombre: "", apellido: "", username: "", password: "", email: "", rolId: 2 });
  const m = useMutation({
    mutationFn: () => api("/api/v1/usuarios", { method: "POST", body: JSON.stringify(s) }),
    onSuccess: () => { toast.success("Usuario creado"); nav({ to: "/" }); },
    onError: (e: any) => toast.error(e.message),
  });
  if (!isAdmin) return <AppLayout><p className="text-destructive">Solo administradores.</p></AppLayout>;
  return (
    <AppLayout>
      <PageHeader title="Nuevo usuario" subtitle="Solo administradores pueden registrar." />
      <form onSubmit={(e) => { e.preventDefault(); m.mutate(); }}>
        <Card className="max-w-2xl"><CardContent className="p-6 grid grid-cols-2 gap-4">
          <div><Label>Nombre</Label><Input required value={s.nombre} onChange={(e) => setS({ ...s, nombre: e.target.value })} /></div>
          <div><Label>Apellido</Label><Input required value={s.apellido} onChange={(e) => setS({ ...s, apellido: e.target.value })} /></div>
          <div><Label>Usuario</Label><Input required value={s.username} onChange={(e) => setS({ ...s, username: e.target.value })} /></div>
          <div><Label>Email</Label><Input required type="email" value={s.email} onChange={(e) => setS({ ...s, email: e.target.value })} /></div>
          <div><Label>Contraseña</Label><Input required type="password" value={s.password} onChange={(e) => setS({ ...s, password: e.target.value })} /></div>
          <div><Label>Rol ID</Label><Input required type="number" value={s.rolId} onChange={(e) => setS({ ...s, rolId: Number(e.target.value) })} /></div>
          <div className="col-span-2"><Button type="submit" disabled={m.isPending}>{m.isPending ? "Creando…" : "Crear usuario"}</Button></div>
        </CardContent></Card>
      </form>
    </AppLayout>
  );
}
