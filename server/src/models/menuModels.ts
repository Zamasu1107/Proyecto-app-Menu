import { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import pool from "../db/db";
import { Ingredientes, ValidarDatos } from "../types/esquemas";

export class MenuModel {
    static async obtenerIng () {
        try {
            const [inventario] =await pool.query<RowDataPacket[]>('SELECT *, BIN_TO_UUID(id) as id FROM ingredientes WHERE activo = 1');

            return inventario;
        } catch (error) {
            console.log(error)
            throw new Error('No se pudo cargar la base de datos')
        }
    }

    static async obtenerNombre (nombre:string) {
        try {

            const [datos] =await pool.query<ValidarDatos[]>('SELECT BIN_TO_UUID(id) as id, nombre, activo FROM ingredientes WHERE nombre = ?;', nombre);

            return datos;
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

    static async guardarIng (input:Ingredientes) {
        try {

            const {nombre, tipo_insumo, cantidad_ml, cantidad_botellas, unidad_medida, precio, porcentaje_alcohol, marca, tipo_alcohol} = input

            const [producto] = await pool.query<ResultSetHeader>('INSERT INTO ingredientes (nombre, tipo_insumo, cantidad_ml, cantidad_botellas, unidad_medida, precio, porcentaje_alcohol, marca, tipo_alcohol) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [nombre, tipo_insumo, cantidad_ml, cantidad_botellas, unidad_medida, precio, porcentaje_alcohol, marca, tipo_alcohol]) 

            return producto
        } catch (error) {
            console.log(error)
            throw new Error('No se pudo guardar el ingrediente')
        }
    }

    static async editarProductoExistente ({ id, input}: {id:string, input:Ingredientes}) {
        const [updateIng] = await pool.query<ResultSetHeader>('UPDATE ingredientes SET ?, activo = 1 WHERE id = UUID_TO_BIN(?);', [input, id])
        
        return updateIng.affectedRows > 0;
    }

    static async editarProducto ({ id, input}: {id:string, input:Ingredientes}) {
        const [updateIng] = await pool.query<ResultSetHeader>('UPDATE ingredientes SET ? WHERE id = UUID_TO_BIN(?);', [input, id])

        return updateIng.affectedRows > 0;
    }

    static async borrarProducto (id:string) {
        const [deleteIng] = await pool.query<ResultSetHeader>('UPDATE ingredientes SET activo = 0 WHERE id = UUID_TO_BIN(?);', id)

        return deleteIng.affectedRows > 0;
    }
}