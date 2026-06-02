import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [username, setU] = useState("");
  const [password, setP] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(username, password);
      toast.success("Sesión iniciada");
      nav({ to: "/" });
    } catch (err: any) {
      toast.error(err.message || "Credenciales inválidas");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-sidebar text-sidebar-foreground relative overflow-hidden">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-md bg-sidebar-primary text-sidebar-primary-foreground grid place-items-center font-serif text-lg">H</div>
          <div className="font-serif text-xl">HorsePedigree</div>
        </div>
        <div>
          <h1 className="font-serif text-5xl leading-tight">Pedigrí, linaje y triunfo en un solo lugar.</h1>
          <p className="mt-4 opacity-80 max-w-md">Gestiona caballos, genealogía y campeonatos con la elegancia que tu criadero merece.</p>
        </div>
        <div className="text-xs opacity-50">© HorsePedigree</div>
      </div>

      <div className="flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardContent className="p-8">
            <h2 className="font-serif text-3xl mb-1">Bienvenido</h2>
            <p className="text-muted-foreground mb-6">Inicia sesión para continuar</p>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <Label htmlFor="u">Usuario o email</Label>
                <Input id="u" value={username} onChange={(e) => setU(e.target.value)} required autoFocus />
              </div>
              <div>
                <Label htmlFor="p">Contraseña</Label>
                <Input id="p" type="password" value={password} onChange={(e) => setP(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Ingresando…" : "Iniciar sesión"}
              </Button>
            </form>
            <div className="text-sm text-muted-foreground mt-6 text-center">
              <Link to="/" className="underline">Continuar como invitado</Link>
              <span className="mx-2">·</span>
              <Link to="/configuracion" className="underline">Configurar API</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
