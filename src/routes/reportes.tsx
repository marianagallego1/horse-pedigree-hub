import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api, apiBlob, apiQs } from "@/lib/api";
import type { EquinosPorEstadoItem, EstadisticasGenerales } from "@/lib/types";
import { AppLayout, PageHeader } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/reportes")({ component: Page });

function Page() {
  const porEstado = useQuery({
    queryKey: ["rep", "por-estado"],
    queryFn: () => api<EquinosPorEstadoItem[]>("/api/v1/reportes/equinos-por-estado"),
  });
  const stats = useQuery({
    queryKey: ["rep", "stats"],
    queryFn: () => api<EstadisticasGenerales>("/api/v1/reportes/estadisticas-generales"),
  });

  const exportar = async () => {
    try {
      const blob = await apiBlob(
        `/api/v1/reportes/equinos-por-estado/exportar${apiQs({ formato: "pdf" })}`,
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "equinos-por-estado.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Error al exportar");
    }
  };

  const max = Math.max(1, ...(porEstado.data?.map((x) => x.totalEquinos) || [0]));

  return (
    <AppLayout>
      <PageHeader
        title="Reportes"
        subtitle="Distribución y estadísticas generales."
        actions={<Button onClick={exportar}><Download className="w-4 h-4 mr-2" /> Exportar PDF</Button>}
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2"><CardContent className="p-6">
          <h3 className="font-serif text-xl mb-4">Equinos por estado</h3>
          {porEstado.isLoading && <p>Cargando…</p>}
          <div className="space-y-3">
            {porEstado.data?.map((it) => (
              <div key={it.estadoId}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{it.estadoDescripcion}</span>
                  <span className="text-muted-foreground">{it.totalEquinos}</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-accent" style={{ width: `${(it.totalEquinos / max) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </CardContent></Card>

        <Card><CardContent className="p-6 space-y-3 text-sm">
          <h3 className="font-serif text-xl mb-2">Estadísticas</h3>
          {stats.data && Object.entries(stats.data).map(([k, v]) => (
            <div key={k} className="flex justify-between border-b last:border-0 py-1">
              <span className="capitalize text-muted-foreground">{k.replace(/([A-Z])/g, " $1")}</span>
              <span className="font-medium">{typeof v === "number" && k.includes("porcentaje") ? `${(v as number).toFixed(1)}%` : String(v)}</span>
            </div>
          ))}
        </CardContent></Card>
      </div>
    </AppLayout>
  );
}
