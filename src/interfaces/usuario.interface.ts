export interface iUsuarioDB {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  password_hash: string;
  rol: string;
  imagen_url: string;
  activo: boolean;
  google?: boolean;
  fecha_creacion: Date;
  fecha_actualizacion: Date;
}
