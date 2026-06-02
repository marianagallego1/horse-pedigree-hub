import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { AppLayout, PageHeader } from "@/components/AppLayout";
import { CampeonatoForm, type CampeonatoFormState } from "@/components/CampeonatoForm";
import { toast } from "sonner";

export const Route = createFileRoute("/campeonatos/nuevo")({ component: Page });

function Page() {
  const nav = useNavigate();
  const m = useMutation({
    mutationFn: (b: CampeonatoFormState) => api<{ campeonatoId: number }>("/api/v1/campeonatos", { method: "POST", body: JSON.stringify(b) }),
    onSuccess: (r) => { toast.success("Creado"); nav({ to: "/campeonatos/$id", params: { id: String(r.campeonatoId) } }); },
    onError: (e: any) => toast.error(e.message),
  });
  return (
    <AppLayout>
      <PageHeader title="Nuevo campeonato" />
      <CampeonatoForm initial={{ nombre: "" }} onSubmit={(v) => m.mutate(v)} submitting={m.isPending} />
    </AppLayout>
  );
}
