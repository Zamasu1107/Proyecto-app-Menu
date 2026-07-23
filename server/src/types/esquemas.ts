import { RowDataPacket } from "mysql2/promise";

export interface Ingredientes {
    nombre:string; 
    tipo_insumo:string;
    cantidad_ml:number;
    unidad_medida:string; 
    precio:number;
    porcentaje_alcohol:number | null;
    marca: string | null; 
    tipo_alcohol:string | null;
    cantidad_botellas: number | 1;
    activo:number | 1;
}

export interface ValidarDatos extends RowDataPacket {
    id:string;
    nombre:string; 
    activo: number | 0;
}