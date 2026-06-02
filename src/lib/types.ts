export interface AuthenticatedUser {
  usuarioId: number;
  nombre: string;
  apellido: string;
  username: string;
  email: string;
  rolId: number;
  rolDescripcion: string;
}
export interface LoginResponse {
  accessToken: string;
  expiresAtUtc: string;
  user: AuthenticatedUser;
}
export interface CatalogoRef { id: number; descripcion: string; }
export interface EquinoRef { id: number; nombre: string; }
export interface PropietarioRef { id: number; nombre: string; apellido: string; alias?: string; }

export interface EquinoListItem {
  equinoId: number;
  nombre: string;
  tipoDeSangre?: string;
  estadoId: number;
  estadoDescripcion: string;
  propietarioId?: number;
  propietarioNombreCompleto?: string;
  tipoDePasoId?: number;
  tipoDePasoDescripcion?: string;
  fechaDeFallecimiento?: string | null;
  fechaDeCreacion: string;
}
export interface Equino {
  equinoId: number;
  nombre: string;
  tipoDeSangre?: string;
  estadoId: number;
  estado?: CatalogoRef;
  fechaDeNacimiento?: string;
  fechaDeFallecimiento?: string | null;
  criaderoId?: number;
  criadero?: CatalogoRef;
  descripcion?: string;
  sexo?: string;
  chipId?: string;
  capon?: boolean;
  mular?: boolean;
  enCompetencia?: boolean;
  tipoDePasoId?: number;
  tipoDePaso?: CatalogoRef;
  propietarioId?: number;
  propietario?: PropietarioRef;
  padreId?: number;
  padre?: EquinoRef;
  madreId?: number;
  madre?: EquinoRef;
  fechaDeCreacion: string;
  fechaDeActualizacion?: string;
}
export interface EquinoGenealogiaAncestro {
  equinoId: number;
  nombre: string;
  padre?: EquinoRef | null;
  madre?: EquinoRef | null;
}
export interface EquinoGenealogia {
  equinoId: number;
  nombre: string;
  padre?: EquinoGenealogiaAncestro | null;
  madre?: EquinoGenealogiaAncestro | null;
}
export interface EquinoDesempeno {
  equinoId: number; equinoNombre: string;
  totalCampeonatos: number; victorias: number; derrotas: number;
}
export interface Campeonato {
  campeonatoId: number; nombre: string; fechaCampeonato: string;
  ubicacion?: string; descripcion?: string; nivel?: string;
}
export interface EquinoCampeonato {
  equinoCampeonatoId: number; equinoId: number; campeonatoId: number;
  categoriaId?: number; resultado?: string; puntaje?: number; posicion?: number;
}
export interface EquinoCampeonatoDetalle extends EquinoCampeonato {
  equinoNombre: string; campeonatoNombre: string; fechaCampeonato: string;
  campeonatoUbicacion?: string; campeonatoDescripcion?: string; campeonatoNivel?: string;
  categoriaDescripcion?: string;
}
export interface EquinoCampeonatoHistorial {
  equinoCampeonatoId: number; campeonatoId: number; campeonatoNombre: string;
  fechaCampeonato: string; campeonatoUbicacion?: string; campeonatoNivel?: string;
  categoriaId?: number; categoriaDescripcion?: string;
  resultado?: string; puntaje?: number; posicion?: number;
}
export interface EquinosPorEstadoItem {
  estadoId: number; estadoDescripcion: string; totalEquinos: number;
}
export interface EstadisticasGenerales {
  totalEquinos: number; equinosVivos: number; equinosFallecidos: number;
  equinosEnCompetencia: number; totalCampeonatos: number; totalParticipaciones: number;
  totalVictorias: number; totalDerrotas: number; participacionesSinResultado: number;
  porcentajeVictorias: number;
}
export interface HealthResponse { status: string; database: string; }
