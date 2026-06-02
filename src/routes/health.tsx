import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { AppLayout, PageHeader } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/health")({ component: Health });

function Health() {
  const { isLoading, error, refetch, isFetching, isSuccess } = useQuery({
    queryKey: ["health"],
    queryFn: () => api<unknown>("/api/Health"),
  });
  return (
    <AppLayout>
      <PageHeader title="Estado de la API" subtitle="Verifica conectividad con el backend." />
      <Card className="max-w-xl">
        <CardContent className="p-6 space-y-3">
          {isLoading && <p>Verificando…</p>}
          {error && <p className="text-destructive">No se pudo conectar.</p>}
          {isSuccess && (
            <div className="flex justify-between">
              <span>API</span>
              <Badge>OK</Badge>
            </div>
          )}
          <button className="text-sm underline text-muted-foreground" onClick={() => refetch()}>
            {isFetching ? "Actualizando…" : "Volver a verificar"}
          </button>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
