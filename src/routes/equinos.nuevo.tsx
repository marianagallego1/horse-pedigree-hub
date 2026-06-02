import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Equino } from "@/lib/types";
import { AppLayout, PageHeader } from "@/components/AppLayout";
import { EquinoForm, type EquinoFormState } from "@/components/EquinoForm";
import { toast } from "sonner";

export const Route = createFileRoute("/equinos/nuevo")({ component: Page });

function Page() {
  const nav = useNavigate();
  const [state] = useState<EquinoFormState>({
    nombre: "", tipoDeSangre: "", estadoId: 1, fechaDeNacimiento: "",
    criaderoId: undefined, descripcion: "", sexo: "M", chipId: "",
    capon: false, mular: false, enCompetencia: false,
    tipoDePasoId: undefined, propietarioId: undefined, padreId: undefined, madreId: undefined,
  });
  const m = useMutation({
    mutationFn: (body: EquinoFormState) =>
      api<Equino>("/api/v1/equinos", { method: "POST", body: JSON.stringify(body) }),
    onSuccess: (res) => {
      toast.success("Equino creado");
      nav({ to: "/equinos/$id", params: { id: String(res.equinoId) } });
    },
    onError: (e: any) => toast.error(e.message),
  });
  return (
    <AppLayout>
      <PageHeader title="Nuevo equino" subtitle="Registra un caballo en el sistema." />
      <EquinoForm initial={state} onSubmit={(v) => m.mutate(v)} submitting={m.isPending} />
    </AppLayout>
  );
}
