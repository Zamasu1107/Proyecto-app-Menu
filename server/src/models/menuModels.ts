import { RowDataPacket } from "mysql2/promise";
import pool from "../db/db";

export class MenuModel {
    static async obtenerIng () {
        try {
            const [inventario] =await pool.query<RowDataPacket[]>('SELECT nombre, tipo, cantidad_total, disponibilidad FROM ingredientes');

            return inventario;
        } catch (error) {
            console.log(error)
            throw new Error('No se pudo cargar la base de datos')
        }
    }

    static async obtenerRec () {
        try {
            const [inventario] = await pool.query<RowDataPacket[]>('SELECT nombre, imageRF, link_Youtube FROM recetas');

            return inventario;
        } catch (error) {
           console.log(error)
            throw new Error('No se pudo cargar la base de datos') 
        }
    }
}