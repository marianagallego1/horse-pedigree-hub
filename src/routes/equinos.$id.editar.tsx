import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toUpdateEquinoRequest } from "@/lib/api-dto";
import type { Equino } from "@/lib/types";
import { AppLayout, PageHeader } from "@/components/AppLayout";
import { EquinoForm, type EquinoFormState } from "@/components/EquinoForm";
import { toast } from "sonner";

export const Route = createFileRoute("/equinos/$id/editar")({ component: Page });

function Page() {
  const { id } = Route.useParams();
  const nav = useNavigate();
  const { data } = useQuery({ queryKey: ["equino", id], queryFn: () => api<Equino>(`/api/v1/equinos/${id}`) });
  const m = useMutation({
    mutationFn: (body: EquinoFormState) =>
      api(`/api/v1/equinos/${id}`, { method: "PUT", body: JSON.stringify(toUpdateEquinoRequest(body)) }),
    onSuccess: () => { toast.success("Actualizado"); nav({ to: "/equinos/$id", params: { id } }); },
    onError: (e: any) => toast.error(e.message),
  });

  if (!data) return <AppLayout><p>Cargando…</p></AppLayout>;
  const initial: EquinoFormState = {
    nombre: data.nombre, tipoDeSangre: data.tipoDeSangre, estadoId: data.estadoId,
    fechaDeNacimiento: data.fechaDeNacimiento, fechaDeFallecimiento: data.fechaDeFallecimiento || undefined,
    criaderoId: data.criaderoId, descripcion: data.descripcion, sexo: data.sexo, chipId: data.chipId,
    capon: data.capon, mular: data.mular, enCompetencia: data.enCompetencia,
    tipoDePasoId: data.tipoDePasoId, propietarioId: data.propietarioId,
    padreId: data.padreId, madreId: data.madreId,
  };
  return (
    <AppLayout>
      <PageHeader title={`Editar: ${data.nombre}`} subtitle="Solo se envían los campos modificados." />
      <EquinoForm initial={initial} mode="edit" onSubmit={(v) => m.mutate(v)} submitting={m.isPending} />
    </AppLayout>
  );
}
