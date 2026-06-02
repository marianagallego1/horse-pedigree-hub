import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Equino, EquinoGenealogia, EquinoDesempeno, EquinoCampeonatoHistorial } from "@/lib/types";
import { AppLayout, PageHeader } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Trash2, Plus } from "lucide-react";

export const Route = createFileRoute("/equinos/$id")({ component: Detail });

function Detail() {
  const { id } = Route.useParams();
  const { isAdmin, isAuthenticated } = useAuth();
  const nav = useNavigate();
  const qc = useQueryClient();

  const equino = useQuery({ queryKey: ["equino", id], queryFn: () => api<Equino>(`/api/v1/equinos/${id}`) });
  const gen = useQuery({ queryKey: ["equino-gen", id], queryFn: () => api<EquinoGenealogia>(`/api/v1/equinos/${id}/genealogia`) });
  const des = useQuery({ queryKey: ["equino-des", id], queryFn: () => api<EquinoDesempeno>(`/api/v1/equinos/${id}/desempeno`) });
  const hist = useQuery({ queryKey: ["equino-hist", id], queryFn: () => api<EquinoCampeonatoHistorial[]>(`/api/v1/equinos/${id}/campeonatos`) });

  const del = useMutation({
    mutationFn: () => api(`/api/v1/equinos/${id}`, { method: "DELETE" }),
    onSuccess: () => { toast.success("Eliminado"); nav({ to: "/equinos" }); },
    onError: (e: any) => toast.error(e.message),
  });

  const [estadoId, setEstadoId] = useState<number | "">("");
  const [fechaFall, setFechaFall] = useState("");
  const estado = useMutation({
    mutationFn: () => api(`/api/v1/equinos/${id}/estado`, {
      method: "PATCH",
      body: JSON.stringify({ estadoId: Number(estadoId), fechaDeFallecimiento: fechaFall || undefined }),
    }),
    onSuccess: () => { toast.success("Estado actualizado"); qc.invalidateQueries({ queryKey: ["equino", id] }); },
    onError: (e: any) => toast.error(e.message),
  });

  const [campId, setCampId] = useState("");
  const [catId, setCatId] = useState("");
  const inscribir = useMutation({
    mutationFn: () => api(`/api/v1/equinos/${id}/campeonatos`, {
      method: "POST",
      body: JSON.stringify({ campeonatoId: Number(campId), categoriaId: Number(catId) }),
    }),
    onSuccess: () => {
      toast.success("Inscrito");
      qc.invalidateQueries({ queryKey: ["equino-hist", id] });
      setCampId(""); setCatId("");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const e = equino.data;

  return (
    <AppLayout>
      <PageHeader
        title={e?.nombre || "Equino"}
        subtitle={e?.estado ? `${e.estado.descripcion}` : "Detalle"}
        actions={
          <>
            {isAdmin && e && (
              <>
                <Link to="/equinos/$id/editar" params={{ id }}>
                  <Button variant="secondary"><Pencil className="w-4 h-4 mr-2" /> Editar</Button>
                </Link>
                <Button variant="destructive" onClick={() => { if (confirm("¿Eliminar equino?")) del.mutate(); }}>
                  <Trash2 className="w-4 h-4 mr-2" /> Eliminar
                </Button>
              </>
            )}
          </>
        }
      />

      {equino.isLoading && <p>Cargando…</p>}
      {e && (
        <Tabs defaultValue="ficha">
          <TabsList>
            <TabsTrigger value="ficha">Ficha</TabsTrigger>
            <TabsTrigger value="genealogia">Genealogía</TabsTrigger>
            <TabsTrigger value="desempeno">Desempeño</TabsTrigger>
            <TabsTrigger value="historial">Campeonatos</TabsTrigger>
            {isAdmin && <TabsTrigger value="estado">Estado</TabsTrigger>}
            {isAuthenticated && <TabsTrigger value="inscribir">Inscribir</TabsTrigger>}
          </TabsList>

          <TabsContent value="ficha">
            <Card><CardContent className="p-6 grid sm:grid-cols-2 gap-4 text-sm">
              <Field k="Tipo de sangre" v={e.tipoDeSangre} />
              <Field k="Sexo" v={e.sexo} />
              <Field k="Fecha de nacimiento" v={e.fechaDeNacimiento} />
              <Field k="Fecha de fallecimiento" v={e.fechaDeFallecimiento} />
              <Field k="Chip" v={e.chipId} />
              <Field k="Criadero" v={e.criadero?.descripcion} />
              <Field k="Tipo de paso" v={e.tipoDePaso?.descripcion} />
              <Field k="Propietario" v={e.propietario ? `${e.propietario.nombre} ${e.propietario.apellido}` : undefined} />
              <Field k="Padre" v={e.padre?.nombre} />
              <Field k="Madre" v={e.madre?.nombre} />
              <Field k="Capón" v={e.capon ? "Sí" : "No"} />
              <Field k="Mular" v={e.mular ? "Sí" : "No"} />
              <Field k="En competencia" v={e.enCompetencia ? "Sí" : "No"} />
              <Field k="Creado" v={e.fechaDeCreacion} />
              <div className="sm:col-span-2"><Field k="Descripción" v={e.descripcion} /></div>
            </CardContent></Card>
          </TabsContent>

          <TabsContent value="genealogia">
            <Card><CardContent className="p-6">
              {gen.data ? <Tree g={gen.data} /> : <p className="text-muted-foreground">Sin datos</p>}
            </CardContent></Card>
          </TabsContent>

          <TabsContent value="desempeno">
            <Card><CardContent className="p-6 grid sm:grid-cols-3 gap-4">
              {des.data && (
                <>
                  <Stat label="Campeonatos" v={des.data.totalCampeonatos} />
                  <Stat label="Victorias" v={des.data.victorias} />
                  <Stat label="Derrotas" v={des.data.derrotas} />
                </>
              )}
            </CardContent></Card>
          </TabsContent>

          <TabsContent value="historial">
            <Card><CardContent className="p-0">
              <table className="w-full text-sm">
                <thead className="border-b text-left text-xs uppercase text-muted-foreground">
                  <tr><th className="p-3">Campeonato</th><th className="p-3">Fecha</th><th className="p-3">Categoría</th><th className="p-3">Resultado</th><th className="p-3">Puntaje</th><th className="p-3">Posición</th><th></th></tr>
                </thead>
                <tbody>
                  {hist.data?.length === 0 && <tr><td colSpan={7} className="p-6 text-muted-foreground">Sin participaciones</td></tr>}
                  {hist.data?.map((h) => (
                    <tr key={h.equinoCampeonatoId} className="border-b last:border-0">
                      <td className="p-3">{h.campeonatoNombre}</td>
                      <td className="p-3">{h.fechaCampeonato}</td>
                      <td className="p-3">{h.categoriaDescripcion || "—"}</td>
                      <td className="p-3"><Badge variant="secondary">{h.resultado || "—"}</Badge></td>
                      <td className="p-3">{h.puntaje ?? "—"}</td>
                      <td className="p-3">{h.posicion ?? "—"}</td>
                      <td className="p-3"><Link to="/participaciones/$id" params={{ id: String(h.equinoCampeonatoId) }} className="text-accent underline">Editar</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent></Card>
          </TabsContent>

          {isAdmin && (
            <TabsContent value="estado">
              <Card><CardContent className="p-6 space-y-4 max-w-md">
                <div><Label>Estado ID</Label><Input type="number" value={estadoId} onChange={(ev) => setEstadoId(ev.target.value === "" ? "" : Number(ev.target.value))} /></div>
                <div><Label>Fecha de fallecimiento (opcional)</Label><Input type="date" value={fechaFall} onChange={(ev) => setFechaFall(ev.target.value)} /></div>
                <Button disabled={estadoId === "" || estado.isPending} onClick={() => estado.mutate()}>Actualizar estado</Button>
              </CardContent></Card>
            </TabsContent>
          )}

          {isAuthenticated && (
            <TabsContent value="inscribir">
              <Card><CardContent className="p-6 space-y-4 max-w-md">
                <div><Label>Campeonato ID</Label><Input type="number" value={campId} onChange={(ev) => setCampId(ev.target.value)} /></div>
                <div><Label>Categoría ID*</Label><Input type="number" required value={catId} onChange={(ev) => setCatId(ev.target.value)} /></div>
                <Button disabled={!campId || !catId || inscribir.isPending} onClick={() => inscribir.mutate()}>
                  <Plus className="w-4 h-4 mr-2" /> Inscribir
                </Button>
              </CardContent></Card>
            </TabsContent>
          )}
        </Tabs>
      )}
    </AppLayout>
  );
}

function Field({ k, v }: { k: string; v?: string | null }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{k}</div>
      <div className="mt-1">{v || "—"}</div>
    </div>
  );
}
function Stat({ label, v }: { label: string; v: number }) {
  return (
    <div className="text-center p-4 rounded-md bg-muted">
      <div className="font-serif text-3xl">{v}</div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{label}</div>
    </div>
  );
}
function Node({ label, name }: { label: string; name?: string | null }) {
  return (
    <div className="p-3 rounded-md border bg-card min-w-32 text-center">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="font-medium">{name || "—"}</div>
    </div>
  );
}
function Tree({ g }: { g: EquinoGenealogia }) {
  return (
    <div className="flex flex-col items-center gap-6">
      <Node label="Equino" name={g.nombre} />
      <div className="grid grid-cols-2 gap-8 w-full max-w-2xl">
        <div className="flex flex-col items-center gap-3">
          <Node label="Padre" name={g.padre?.nombre} />
          <div className="grid grid-cols-2 gap-3 w-full">
            <Node label="Abuelo paterno" name={g.padre?.padre?.nombre} />
            <Node label="Abuela paterna" name={g.padre?.madre?.nombre} />
          </div>
        </div>
        <div className="flex flex-col items-center gap-3">
          <Node label="Madre" name={g.madre?.nombre} />
          <div className="grid grid-cols-2 gap-3 w-full">
            <Node label="Abuelo materno" name={g.madre?.padre?.nombre} />
            <Node label="Abuela materna" name={g.madre?.madre?.nombre} />
          </div>
        </div>
      </div>
    </div>
  );
}
