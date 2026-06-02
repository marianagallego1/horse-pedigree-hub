import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { HealthResponse } from "@/lib/types";
import { AppLayout, PageHeader } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/health")({ component: Health });

function Health() {
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["health"],
    queryFn: () => api<HealthResponse>("/api/Health"),
  });
  return (
    <AppLayout>
      <PageHeader title="Estado de la API" subtitle="Verifica conectividad con el backend y la base de datos." />
      <Card className="max-w-xl">
        <CardContent className="p-6 space-y-3">
          {isLoading && <p>Verificando…</p>}
          {error && <p className="text-destructive">No se pudo conectar.</p>}
          {data && (
            <>
              <div className="flex justify-between"><span>API</span><Badge>{data.status}</Badge></div>
              <div className="flex justify-between"><span>Base de datos</span><Badge variant="secondary">{data.database}</Badge></div>
            </>
          )}
          <button className="text-sm underline text-muted-foreground" onClick={() => refetch()}>
            {isFetching ? "Actualizando…" : "Volver a verificar"}
          </button>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
