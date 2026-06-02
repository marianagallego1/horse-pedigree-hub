import type { CampeonatoFormState } from "@/components/CampeonatoForm";
import type { EquinoFormState } from "@/components/EquinoForm";

/** Envolturas Optional del API (.NET) para PATCH/PUT */
export type OptionalField<T> = { value: T };

function optStr(value: string): OptionalField<string> {
  return { value };
}

function optNum(value: number): OptionalField<number> {
  return { value };
}

function optNumNullable(value: number | null | undefined): OptionalField<number | null> {
  return { value: value ?? null };
}

function optBool(value: boolean): OptionalField<boolean> {
  return { value };
}

function optBoolNullable(value: boolean | null | undefined): OptionalField<boolean | null> {
  return { value: value ?? null };
}

function optDate(value: string): OptionalField<string> {
  return { value };
}

function optDateNullable(value: string | null | undefined): OptionalField<string | null> {
  return { value: value ?? null };
}

export function toUpdateEquinoRequest(s: EquinoFormState): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  if (s.nombre !== undefined) body.nombre = optStr(s.nombre);
  if (s.tipoDeSangre !== undefined) body.tipoDeSangre = optStr(s.tipoDeSangre);
  if (s.estadoId !== undefined) body.estadoId = optNumNullable(s.estadoId);
  if (s.fechaDeNacimiento !== undefined) body.fechaDeNacimiento = optDateNullable(s.fechaDeNacimiento || null);
  if (s.fechaDeFallecimiento !== undefined) body.fechaDeFallecimiento = optDateNullable(s.fechaDeFallecimiento || null);
  if (s.criaderoId !== undefined) body.criaderoId = optNumNullable(s.criaderoId);
  if (s.descripcion !== undefined) body.descripcion = optStr(s.descripcion);
  if (s.sexo !== undefined) body.sexo = optStr(s.sexo);
  if (s.chipId !== undefined) body.chipId = optStr(s.chipId);
  if (s.capon !== undefined) body.capon = optBoolNullable(s.capon);
  if (s.mular !== undefined) body.mular = optBoolNullable(s.mular);
  if (s.enCompetencia !== undefined) body.enCompetencia = optBool(s.enCompetencia);
  if (s.tipoDePasoId !== undefined) body.tipoDePasoId = optNumNullable(s.tipoDePasoId);
  if (s.propietarioId !== undefined) body.propietarioId = optNumNullable(s.propietarioId);
  if (s.padreId !== undefined) body.padreId = optNumNullable(s.padreId);
  if (s.madreId !== undefined) body.madreId = optNumNullable(s.madreId);
  return body;
}

export function toUpdateCampeonatoRequest(s: CampeonatoFormState): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  if (s.nombre !== undefined) body.nombre = optStr(s.nombre);
  if (s.fechaCampeonato !== undefined) body.fechaCampeonato = optDate(s.fechaCampeonato);
  if (s.ubicacion !== undefined) body.ubicacion = optStr(s.ubicacion);
  if (s.descripcion !== undefined) body.descripcion = optStr(s.descripcion);
  if (s.nivel !== undefined) body.nivel = optStr(s.nivel);
  return body;
}

export interface UpdateParticipacionInput {
  resultado?: string;
  puntaje?: number;
  posicion?: number;
  categoriaId?: number;
}

export function toUpdateEquinoCampeonatoRequest(s: UpdateParticipacionInput): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  if (s.resultado !== undefined) body.resultado = optStr(s.resultado);
  if (s.puntaje !== undefined) body.puntaje = optNum(s.puntaje);
  if (s.posicion !== undefined) body.posicion = optNum(s.posicion);
  if (s.categoriaId !== undefined) body.categoriaId = optNum(s.categoriaId);
  return body;
}
