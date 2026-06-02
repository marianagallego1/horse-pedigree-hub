import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Campeonato } from "@/lib/types";
import { AppLayout, PageHeader } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MapPin, Calendar } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/campeonatos/")({ component: List });

function List() {
  const { isAdmin } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["campeonatos"],
    queryFn: () => api<Campeonato[]>("/api/v1/campeonatos"),
  });
  return (
    <AppLayout>
      <PageHeader
        title="Campeonatos"
        subtitle="Eventos de competencia ecuestre."
        actions={isAdmin && (
          <Link to="/campeonatos/nuevo"><Button><Plus className="w-4 h-4 mr-2" /> Nuevo</Button></Link>
        )}
      />
      {isLoading && <p>Cargando…</p>}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.map((c) => (
          <Link key={c.campeonatoId} to="/campeonatos/$id" params={{ id: String(c.campeonatoId) }}>
            <Card className="hover:border-accent transition cursor-pointer h-full">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <h3 className="font-serif text-xl">{c.nombre}</h3>
                  {c.nivel && <Badge>{c.nivel}</Badge>}
                </div>
                <div className="mt-3 text-sm text-muted-foreground flex flex-col gap-1">
                  <span className="flex items-center gap-2"><Calendar className="w-3 h-3" /> {c.fechaCampeonato}</span>
                  {c.ubicacion && <span className="flex items-center gap-2"><MapPin className="w-3 h-3" /> {c.ubicacion}</span>}
                </div>
                {c.descripcion && <p className="mt-3 text-sm line-clamp-2">{c.descripcion}</p>}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </AppLayout>
  );
}
