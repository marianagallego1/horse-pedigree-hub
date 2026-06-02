import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Campeonato } from "@/lib/types";
import { AppLayout, PageHeader } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Calendar, MapPin } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/campeonatos/$id")({ component: Detail });

function Detail() {
  const { id } = Route.useParams();
  const { isAdmin } = useAuth();
  const nav = useNavigate();
  const { data } = useQuery({ queryKey: ["campeonato", id], queryFn: () => api<Campeonato>(`/api/v1/campeonatos/${id}`) });
  const del = useMutation({
    mutationFn: () => api(`/api/v1/campeonatos/${id}`, { method: "DELETE" }),
    onSuccess: () => { toast.success("Eliminado"); nav({ to: "/campeonatos" }); },
    onError: (e: any) => toast.error(e.message),
  });
  if (!data) return <AppLayout><p>Cargando…</p></AppLayout>;
  return (
    <AppLayout>
      <PageHeader
        title={data.nombre}
        subtitle={data.nivel}
        actions={isAdmin && (
          <>
            <Link to="/campeonatos/$id/editar" params={{ id }}><Button variant="secondary"><Pencil className="w-4 h-4 mr-2" /> Editar</Button></Link>
            <Button variant="destructive" onClick={() => { if (confirm("¿Eliminar?")) del.mutate(); }}>
              <Trash2 className="w-4 h-4 mr-2" /> Eliminar
            </Button>
          </>
        )}
      />
      <Card><CardContent className="p-6 space-y-4">
        <div className="flex flex-wrap gap-3">
          <Badge variant="secondary" className="gap-2"><Calendar className="w-3 h-3" />{data.fechaCampeonato}</Badge>
          {data.ubicacion && <Badge variant="secondary" className="gap-2"><MapPin className="w-3 h-3" />{data.ubicacion}</Badge>}
          {data.nivel && <Badge>{data.nivel}</Badge>}
        </div>
        {data.descripcion && <p className="text-foreground/80 leading-relaxed">{data.descripcion}</p>}
      </CardContent></Card>
    </AppLayout>
  );
}
