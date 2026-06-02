import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toUpdateCampeonatoRequest } from "@/lib/api-dto";
import type { Campeonato } from "@/lib/types";
import { AppLayout, PageHeader } from "@/components/AppLayout";
import { CampeonatoForm, type CampeonatoFormState } from "@/components/CampeonatoForm";
import { toast } from "sonner";

export const Route = createFileRoute("/campeonatos/$id/editar")({ component: Page });

function Page() {
  const { id } = Route.useParams();
  const nav = useNavigate();
  const { data } = useQuery({ queryKey: ["campeonato", id], queryFn: () => api<Campeonato>(`/api/v1/campeonatos/${id}`) });
  const m = useMutation({
    mutationFn: (b: CampeonatoFormState) =>
      api(`/api/v1/campeonatos/${id}`, { method: "PUT", body: JSON.stringify(toUpdateCampeonatoRequest(b)) }),
    onSuccess: () => { toast.success("Actualizado"); nav({ to: "/campeonatos/$id", params: { id } }); },
    onError: (e: any) => toast.error(e.message),
  });
  if (!data) return <AppLayout><p>Cargando…</p></AppLayout>;
  return (
    <AppLayout>
      <PageHeader title={`Editar: ${data.nombre}`} subtitle="Solo se envían los campos modificados." />
      <CampeonatoForm
        initial={{ nombre: data.nombre, fechaCampeonato: data.fechaCampeonato, ubicacion: data.ubicacion, descripcion: data.descripcion, nivel: data.nivel }}
        onSubmit={(v) => m.mutate(v)} submitting={m.isPending}
      />
    </AppLayout>
  );
}
