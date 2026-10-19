export class ManejarError extends Error {
  constructor(
    mensaje: string,
    public readonly codigo: number,
  ) {
    super(mensaje);
    this.name = "ManejarError";
  }
}
