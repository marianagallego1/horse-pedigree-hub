import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { EstadisticasGenerales } from "@/lib/types";
import { AppLayout, PageHeader } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Rabbit, Heart, Skull, Medal, Activity, Percent } from "lucide-react";

export const Route = createFileRoute("/")({ component: Dashboard });

function Stat({ icon: Icon, label, value, accent }: { icon: any; label: string; value: string | number; accent?: boolean }) {
  return (
    <Card className={accent ? "bg-primary text-primary-foreground border-primary" : ""}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs uppercase tracking-widest opacity-70">{label}</div>
            <div className="font-serif text-3xl mt-2">{value}</div>
          </div>
          <Icon className="w-5 h-5 opacity-60" />
        </div>
      </CardContent>
    </Card>
  );
}

function Dashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["estadisticas"],
    queryFn: () => api<EstadisticasGenerales>("/api/v1/reportes/estadisticas-generales"),
  });

  return (
    <AppLayout>
      <PageHeader
        title="Panel general"
        subtitle="Vista rápida del registro equino, campeonatos y desempeño."
      />
      {isLoading && <p className="text-muted-foreground">Cargando…</p>}
      {error && <p className="text-destructive">No se pudo cargar. Verifica la URL de la API en Configuración.</p>}
      {data && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Stat icon={Rabbit} label="Total equinos" value={data.totalEquinos} accent />
            <Stat icon={Heart} label="Vivos" value={data.equinosVivos} />
            <Stat icon={Skull} label="Fallecidos" value={data.equinosFallecidos} />
            <Stat icon={Activity} label="En competencia" value={data.equinosEnCompetencia} />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <Stat icon={Trophy} label="Campeonatos" value={data.totalCampeonatos} />
            <Stat icon={Medal} label="Participaciones" value={data.totalParticipaciones} />
            <Stat icon={Medal} label="Victorias" value={data.totalVictorias} />
            <Stat icon={Percent} label="% Victorias" value={`${data.porcentajeVictorias.toFixed(1)}%`} />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Stat icon={Medal} label="Derrotas" value={data.totalDerrotas} />
            <Stat icon={Medal} label="Sin resultado" value={data.participacionesSinResultado} />
          </div>
        </>
      )}
    </AppLayout>
  );
}
