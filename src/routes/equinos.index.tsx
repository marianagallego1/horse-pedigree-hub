import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { api, apiQs } from "@/lib/api";
import type { EquinoListItem } from "@/lib/types";
import { AppLayout, PageHeader } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search } from "lucide-react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/equinos/")({ component: List });

function List() {
  const { isAdmin } = useAuth();
  const [nombre, setNombre] = useState("");
  const [propietario, setProp] = useState("");
  const [soloVivos, setSV] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["equinos", { nombre, propietario, soloVivos }],
    queryFn: () =>
      api<EquinoListItem[]>(
        "/api/v1/equinos" +
          apiQs({
            Nombre: nombre || undefined,
            Propietario: propietario || undefined,
            SoloVivos: soloVivos ? true : undefined,
          }),
      ),
  });

  return (
    <AppLayout>
      <PageHeader
        title="Equinos"
        subtitle="Listado de caballos registrados."
        actions={isAdmin && (
          <Link to="/equinos/nuevo"><Button><Plus className="w-4 h-4 mr-2" /> Nuevo equino</Button></Link>
        )}
      />

      <Card className="mb-6">
        <CardContent className="p-4 flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-48">
            <label className="text-xs text-muted-foreground">Nombre</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input className="pl-9" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Relámpago" />
            </div>
          </div>
          <div className="flex-1 min-w-48">
            <label className="text-xs text-muted-foreground">Propietario</label>
            <Input value={propietario} onChange={(e) => setProp(e.target.value)} placeholder="García" />
          </div>
          <label className="flex items-center gap-2 text-sm pb-2">
            <input type="checkbox" checked={soloVivos} onChange={(e) => setSV(e.target.checked)} />
            Solo vivos
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="p-4">Nombre</th>
                <th className="p-4">Sangre</th>
                <th className="p-4">Estado</th>
                <th className="p-4">Propietario</th>
                <th className="p-4">Paso</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading && <tr><td className="p-6 text-muted-foreground" colSpan={6}>Cargando…</td></tr>}
              {data?.length === 0 && <tr><td className="p-6 text-muted-foreground" colSpan={6}>Sin resultados</td></tr>}
              {data?.map((e) => (
                <tr key={e.equinoId} className="border-b last:border-0 hover:bg-muted/40">
                  <td className="p-4 font-medium">{e.nombre}</td>
                  <td className="p-4">{e.tipoDeSangre || "—"}</td>
                  <td className="p-4"><Badge variant={e.fechaDeFallecimiento ? "secondary" : "default"}>{e.estadoDescripcion}</Badge></td>
                  <td className="p-4">{e.propietarioNombreCompleto || "—"}</td>
                  <td className="p-4">{e.tipoDePasoDescripcion || "—"}</td>
                  <td className="p-4 text-right">
                    <Link to="/equinos/$id" params={{ id: String(e.equinoId) }} className="text-accent underline">Ver</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
