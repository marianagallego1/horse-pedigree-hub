import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, GitBranch } from "lucide-react";
import { api } from "@/lib/api";
import type { Equino, EquinoGenealogia } from "@/lib/types";
import { AppLayout, PageHeader } from "@/components/AppLayout";
import { GenealogiaTree } from "@/components/GenealogiaTree";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/equinos/$id/genealogia")({ component: GenealogiaPage });

function GenealogiaPage() {
  const { id } = Route.useParams();

  const equino = useQuery({
    queryKey: ["equino", id],
    queryFn: () => api<Equino>(`/api/v1/equinos/${id}`),
  });

  const gen = useQuery({
    queryKey: ["equino-gen", id],
    queryFn: () => api<EquinoGenealogia>(`/api/v1/equinos/${id}/genealogia`),
  });

  const nombre = gen.data?.nombre || equino.data?.nombre || "Equino";

  return (
    <AppLayout>
      <PageHeader
        title={`Genealogía de ${nombre}`}
        subtitle="Padres y abuelos registrados en la base de datos."
        actions={
          <Link to="/equinos/$id" params={{ id }}>
            <Button variant="secondary">
              <ArrowLeft className="mr-2 h-4 w-4" /> Volver al equino
            </Button>
          </Link>
        }
      />

      <Card>
        <CardContent className="p-6">
          {gen.isLoading && <p className="text-muted-foreground">Cargando genealogía…</p>}
          {gen.isError && (
            <p className="text-destructive">
              No se pudo cargar la genealogía. Verifica que el equino exista y que la API esté disponible.
            </p>
          )}
          {gen.data && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <GitBranch className="h-4 w-4" />
                <span>Árbol genealógico (hasta 2 generaciones de ancestros)</span>
              </div>
              <GenealogiaTree g={gen.data} />
            </div>
          )}
        </CardContent>
      </Card>
    </AppLayout>
  );
}
