import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { EquinoCampeonatoDetalle } from "@/lib/types";
import { AppLayout, PageHeader } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export const Route = createFileRoute("/participaciones/$id")({ component: Page });

function Page() {
  const { id } = Route.useParams();
  const nav = useNavigate();
  const { data } = useQuery({
    queryKey: ["participacion", id],
    queryFn: () => api<EquinoCampeonatoDetalle>(`/api/v1/equino-campeonatos/${id}`),
  });
  const [resultado, setResultado] = useState("");
  const [puntaje, setPuntaje] = useState<string>("");
  const [posicion, setPosicion] = useState<string>("");
  const [categoriaId, setCat] = useState<string>("");

  useEffect(() => {
    if (data) {
      setResultado(data.resultado || "");
      setPuntaje(data.puntaje != null ? String(data.puntaje) : "");
      setPosicion(data.posicion != null ? String(data.posicion) : "");
      setCat(data.categoriaId != null ? String(data.categoriaId) : "");
    }
  }, [data]);

  const upd = useMutation({
    mutationFn: () => api(`/api/v1/equino-campeonatos/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        resultado: resultado || undefined,
        puntaje: puntaje !== "" ? Number(puntaje) : undefined,
        posicion: posicion !== "" ? Number(posicion) : undefined,
        categoriaId: categoriaId !== "" ? Number(categoriaId) : undefined,
      }),
    }),
    onSuccess: () => toast.success("Actualizado"),
    onError: (e: any) => toast.error(e.message),
  });
  const del = useMutation({
    mutationFn: () => api(`/api/v1/equino-campeonatos/${id}`, { method: "DELETE" }),
    onSuccess: () => { toast.success("Eliminado"); nav({ to: "/campeonatos" }); },
    onError: (e: any) => toast.error(e.message),
  });

  if (!data) return <AppLayout><p>Cargando…</p></AppLayout>;
  return (
    <AppLayout>
      <PageHeader
        title="Participación"
        subtitle={`${data.equinoNombre} en ${data.campeonatoNombre}`}
        actions={
          <Button variant="destructive" onClick={() => { if (confirm("¿Eliminar?")) del.mutate(); }}>
            <Trash2 className="w-4 h-4 mr-2" /> Eliminar
          </Button>
        }
      />
      <Card className="max-w-2xl"><CardContent className="p-6 space-y-4">
        <div className="text-sm text-muted-foreground">
          <Link to="/equinos/$id" params={{ id: String(data.equinoId) }} className="underline">{data.equinoNombre}</Link>
          {" · "}
          <Link to="/campeonatos/$id" params={{ id: String(data.campeonatoId) }} className="underline">{data.campeonatoNombre}</Link>
          {" · "}{data.fechaCampeonato}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><Label>Resultado</Label><Input value={resultado} onChange={(e) => setResultado(e.target.value)} placeholder="victoria / derrota / …" /></div>
          <div><Label>Categoría ID</Label><Input type="number" value={categoriaId} onChange={(e) => setCat(e.target.value)} /></div>
          <div><Label>Puntaje</Label><Input type="number" step="0.01" value={puntaje} onChange={(e) => setPuntaje(e.target.value)} /></div>
          <div><Label>Posición</Label><Input type="number" value={posicion} onChange={(e) => setPosicion(e.target.value)} /></div>
        </div>
        <Button disabled={upd.isPending} onClick={() => upd.mutate()}>{upd.isPending ? "Guardando…" : "Guardar cambios"}</Button>
      </CardContent></Card>
    </AppLayout>
  );
}
