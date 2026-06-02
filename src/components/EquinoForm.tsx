import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

export interface EquinoFormState {
  nombre: string;
  tipoDeSangre?: string;
  estadoId?: number;
  fechaDeNacimiento?: string;
  fechaDeFallecimiento?: string;
  criaderoId?: number;
  descripcion?: string;
  sexo?: string;
  chipId?: string;
  capon?: boolean;
  mular?: boolean;
  enCompetencia?: boolean;
  tipoDePasoId?: number;
  propietarioId?: number;
  padreId?: number;
  madreId?: number;
}

function num(v: string): number | undefined {
  if (v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

export function EquinoForm({
  initial, onSubmit, submitting, mode = "create",
}: { initial: EquinoFormState; onSubmit: (v: EquinoFormState) => void; submitting?: boolean; mode?: "create" | "edit" }) {
  const [s, setS] = useState<EquinoFormState>(initial);
  const set = <K extends keyof EquinoFormState>(k: K, v: EquinoFormState[K]) => setS((p) => ({ ...p, [k]: v }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    // strip empty strings for optional fields
    const out: EquinoFormState = { ...s };
    (["tipoDeSangre","fechaDeNacimiento","fechaDeFallecimiento","descripcion","sexo","chipId"] as const).forEach((k) => {
      if ((out as any)[k] === "") (out as any)[k] = undefined;
    });
    onSubmit(out);
  };

  return (
    <form onSubmit={submit} className="grid lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2"><CardContent className="p-6 space-y-4">
        <h3 className="font-serif text-xl">Datos generales</h3>
        <div className="grid grid-cols-2 gap-4">
          <div><Label>Nombre*</Label><Input required value={s.nombre} onChange={(e) => set("nombre", e.target.value)} /></div>
          <div><Label>Tipo de sangre</Label><Input value={s.tipoDeSangre || ""} onChange={(e) => set("tipoDeSangre", e.target.value)} /></div>
          <div><Label>Estado ID</Label><Input type="number" value={s.estadoId ?? ""} onChange={(e) => set("estadoId", num(e.target.value))} /></div>
          <div><Label>Sexo</Label><Input value={s.sexo || ""} onChange={(e) => set("sexo", e.target.value)} placeholder="M / H" /></div>
          <div><Label>Fecha de nacimiento</Label><Input type="date" value={s.fechaDeNacimiento || ""} onChange={(e) => set("fechaDeNacimiento", e.target.value)} /></div>
          {mode === "edit" && <div><Label>Fecha de fallecimiento</Label><Input type="date" value={s.fechaDeFallecimiento || ""} onChange={(e) => set("fechaDeFallecimiento", e.target.value)} /></div>}
          <div><Label>Chip ID</Label><Input value={s.chipId || ""} onChange={(e) => set("chipId", e.target.value)} /></div>
          <div><Label>Tipo de paso ID</Label><Input type="number" value={s.tipoDePasoId ?? ""} onChange={(e) => set("tipoDePasoId", num(e.target.value))} /></div>
        </div>
        <div><Label>Descripción</Label><Textarea value={s.descripcion || ""} onChange={(e) => set("descripcion", e.target.value)} /></div>
      </CardContent></Card>

      <Card><CardContent className="p-6 space-y-4">
        <h3 className="font-serif text-xl">Relaciones</h3>
        <div><Label>Criadero ID</Label><Input type="number" value={s.criaderoId ?? ""} onChange={(e) => set("criaderoId", num(e.target.value))} /></div>
        <div><Label>Propietario ID</Label><Input type="number" value={s.propietarioId ?? ""} onChange={(e) => set("propietarioId", num(e.target.value))} /></div>
        <div><Label>Padre ID</Label><Input type="number" value={s.padreId ?? ""} onChange={(e) => set("padreId", num(e.target.value))} /></div>
        <div><Label>Madre ID</Label><Input type="number" value={s.madreId ?? ""} onChange={(e) => set("madreId", num(e.target.value))} /></div>

        <div className="space-y-2 pt-3 border-t">
          <label className="flex items-center gap-2"><input type="checkbox" checked={!!s.capon} onChange={(e) => set("capon", e.target.checked)} /> Capón</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={!!s.mular} onChange={(e) => set("mular", e.target.checked)} /> Mular</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={!!s.enCompetencia} onChange={(e) => set("enCompetencia", e.target.checked)} /> En competencia</label>
        </div>

        <Button type="submit" disabled={submitting} className="w-full">{submitting ? "Guardando…" : "Guardar"}</Button>
      </CardContent></Card>
    </form>
  );
}
