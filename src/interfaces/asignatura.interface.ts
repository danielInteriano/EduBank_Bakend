export interface Asignatura {
  id: string;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  fecha_creacion: Date;
  fecha_actualizacion: Date;
}
