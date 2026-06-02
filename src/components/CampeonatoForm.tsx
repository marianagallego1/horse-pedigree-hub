import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export interface CampeonatoFormState {
  nombre: string;
  fechaCampeonato?: string;
  ubicacion?: string;
  descripcion?: string;
  nivel?: string;
}

export function CampeonatoForm({
  initial, onSubmit, submitting,
}: { initial: CampeonatoFormState; onSubmit: (v: CampeonatoFormState) => void; submitting?: boolean }) {
  const [s, setS] = useState<CampeonatoFormState>(initial);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const out: CampeonatoFormState = { ...s };
    (["fechaCampeonato","ubicacion","descripcion","nivel"] as const).forEach((k) => {
      if ((out as any)[k] === "") (out as any)[k] = undefined;
    });
    onSubmit(out);
  };
  return (
    <form onSubmit={submit}>
      <Card className="max-w-2xl"><CardContent className="p-6 space-y-4">
        <div><Label>Nombre*</Label><Input required value={s.nombre} onChange={(e) => setS({ ...s, nombre: e.target.value })} /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><Label>Fecha</Label><Input type="date" value={s.fechaCampeonato || ""} onChange={(e) => setS({ ...s, fechaCampeonato: e.target.value })} /></div>
          <div><Label>Nivel</Label><Input value={s.nivel || ""} onChange={(e) => setS({ ...s, nivel: e.target.value })} /></div>
        </div>
        <div><Label>Ubicación</Label><Input value={s.ubicacion || ""} onChange={(e) => setS({ ...s, ubicacion: e.target.value })} /></div>
        <div><Label>Descripción</Label><Textarea value={s.descripcion || ""} onChange={(e) => setS({ ...s, descripcion: e.target.value })} /></div>
        <Button type="submit" disabled={submitting}>{submitting ? "Guardando…" : "Guardar"}</Button>
      </CardContent></Card>
    </form>
  );
}
