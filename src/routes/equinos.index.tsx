import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { api, apiQs } from "@/lib/api";
import type { EquinoListItem } from "@/lib/types";
import { AppLayout, PageHeader } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, GitBranch, X } from "lucide-react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/equinos/")({ component: List });

type EquinoFiltros = {
  nombre: string;
  propietario: string;
  soloVivos: boolean;
};

const filtrosVacios: EquinoFiltros = { nombre: "", propietario: "", soloVivos: false };

function tieneFiltros(f: EquinoFiltros) {
  return Boolean(f.nombre.trim() || f.propietario.trim() || f.soloVivos);
}

function List() {
  const { isAdmin } = useAuth();
  const [nombreInput, setNombreInput] = useState("");
  const [propietarioInput, setPropietarioInput] = useState("");
  const [soloVivosInput, setSoloVivosInput] = useState(false);
  const [filtros, setFiltros] = useState<EquinoFiltros>(filtrosVacios);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["equinos", filtros],
    queryFn: () =>
      api<EquinoListItem[]>(
        "/api/v1/equinos" +
          apiQs({
            nombre: filtros.nombre.trim() || undefined,
            propietario: filtros.propietario.trim() || undefined,
            soloVivos: filtros.soloVivos ? true : undefined,
          }),
      ),
  });

  function buscar(e?: FormEvent) {
    e?.preventDefault();
    setFiltros({
      nombre: nombreInput,
      propietario: propietarioInput,
      soloVivos: soloVivosInput,
    });
  }

  function limpiar() {
    setNombreInput("");
    setPropietarioInput("");
    setSoloVivosInput(false);
    setFiltros(filtrosVacios);
  }

  return (
    <AppLayout>
      <PageHeader
        title="Equinos"
        subtitle={
          tieneFiltros(filtros)
            ? "Resultados de la búsqueda."
            : "Todos los caballos registrados."
        }
        actions={isAdmin && (
          <Link to="/equinos/nuevo"><Button><Plus className="w-4 h-4 mr-2" /> Nuevo equino</Button></Link>
        )}
      />

      <Card className="mb-6">
        <CardContent className="p-4">
          <form className="flex flex-wrap gap-3 items-end" onSubmit={buscar}>
            <div className="flex-1 min-w-48">
              <label className="text-xs text-muted-foreground">Nombre</label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-9"
                  value={nombreInput}
                  onChange={(e) => setNombreInput(e.target.value)}
                  placeholder="Relámpago"
                />
              </div>
            </div>
            <div className="flex-1 min-w-48">
              <label className="text-xs text-muted-foreground">Propietario</label>
              <Input
                value={propietarioInput}
                onChange={(e) => setPropietarioInput(e.target.value)}
                placeholder="García"
              />
            </div>
            <label className="flex items-center gap-2 text-sm pb-2">
              <input
                type="checkbox"
                checked={soloVivosInput}
                onChange={(e) => setSoloVivosInput(e.target.checked)}
              />
              Solo vivos
            </label>
            <Button type="submit">
              <Search className="w-4 h-4 mr-2" /> Buscar
            </Button>
            {tieneFiltros(filtros) && (
              <Button type="button" variant="outline" onClick={limpiar}>
                <X className="w-4 h-4 mr-2" /> Limpiar
              </Button>
            )}
          </form>
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
              {isError && (
                <tr>
                  <td className="p-6 text-destructive" colSpan={6}>
                    No se pudo cargar el listado. Verifica que la API esté disponible.
                  </td>
                </tr>
              )}
              {!isLoading && !isError && data?.length === 0 && (
                <tr>
                  <td className="p-6 text-muted-foreground" colSpan={6}>
                    {tieneFiltros(filtros) ? "Sin resultados para esta búsqueda." : "No hay equinos registrados."}
                  </td>
                </tr>
              )}
              {!isLoading && data?.map((e) => (
                <tr key={e.equinoId} className="border-b last:border-0 hover:bg-muted/40">
                  <td className="p-4 font-medium">{e.nombre}</td>
                  <td className="p-4">{e.tipoDeSangre || "—"}</td>
                  <td className="p-4"><Badge variant={e.fechaDeFallecimiento ? "secondary" : "default"}>{e.estadoDescripcion}</Badge></td>
                  <td className="p-4">{e.propietarioNombreCompleto || "—"}</td>
                  <td className="p-4">{e.tipoDePasoDescripcion || "—"}</td>
                  <td className="p-4 text-right space-x-3">
                    <Link to="/equinos/$id" params={{ id: String(e.equinoId) }} className="text-accent underline">Ver</Link>
                    <Link
                      to="/equinos/$id/genealogia"
                      params={{ id: String(e.equinoId) }}
                      className="inline-flex items-center gap-1 text-accent underline"
                    >
                      <GitBranch className="h-3.5 w-3.5" /> Genealogía
                    </Link>
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
