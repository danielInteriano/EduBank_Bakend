export interface Grado {
  nombre: string;
  orden: number;
  activo: boolean;
}

export interface gradoCreado {
  nombre: string;
  orden: number;
}

export interface gradoActualizado {
  nombre?: string;
  orden?: number;
}
