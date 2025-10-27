import { DetalleVenta } from "./detalle-venta";

export interface Venta {
    idVenta?: number, //El signo "?" indica que puede recibir nulos
    numeroDocumento?: string,
    tipoPago: string,
    fechaRegistro?: string,
    totalTexto: string,
    detalleVenta: DetalleVenta[]
}