import { Response, Request } from "express";
import { MenuModel } from "../models/menuModels";

export default class MenuController {
    private menuModels: typeof MenuModel
    constructor({MenuModel}: {MenuModel: any}) {
        this.menuModels = MenuModel
    }

    obtenerIng = async(_req:Request, res:Response) => {
        try {
            const datos = await this.menuModels.obtenerIng();
            
            res.json(datos);
        } catch (error) {
            res.status(500).json({error: 'Error al cargar la base de datos'})
        }
    }

    obtenerRec = async (_req:Request, res:Response) => {
        try {
            const datos = await this.menuModels.obtenerRec();
            
            res.json(datos);
        } catch (error) {
            res.status(500).json({error: 'Error al cargar la base de datos'})
        }
    }

    ingresarIng = async (req:Request, res:Response) => {
        try {
            const { nombre, tipo_insumo, cantidad_ml, cantidad_botellas, unidad_medida, precio, porcentaje_alcohol, marca, tipo_alcohol, activo } = req.body;

            const inputSeguro = {
                nombre, tipo_insumo, cantidad_ml, cantidad_botellas:cantidad_botellas || 1, unidad_medida, precio, porcentaje_alcohol:porcentaje_alcohol || null, marca:marca || null, tipo_alcohol: tipo_alcohol || null, activo:activo || 1
            }

            const validarDatos = await this.menuModels.obtenerNombre(nombre)
            const id = validarDatos[0]?.id

            if (validarDatos.length === 0) {
                const newIng = await this.menuModels.guardarIng( inputSeguro );
                res.status(201).json(newIng)
            } else if (validarDatos.length >= 1 && validarDatos[0]?.activo === 1) {
                res.status(400).json({ error: "Este producto ya existe y está activo. Utiliza la función de editar." })
                return
            } else if(validarDatos.length >= 1 && validarDatos[0]?.activo === 0){
                
                if (typeof id === 'string') {
                const updateProducto = await this.menuModels.editarProductoExistente({id, input:inputSeguro });
                res.status(200).json(updateProducto)
                }
            }
        } catch (error) {
            res.status(500).json({error: 'Error al guardar el ingrediente'})
        }
    }

    updateIng = async (req:Request, res:Response) => {
        try {
            const datos = req.body;

            const {id} = req.params;

            if (typeof id === 'string') {
                const nuevosDatos = await this.menuModels.editarProducto({id, input: datos});
                res.status(200).json(nuevosDatos); 
            }
           
        } catch (error) {
            res.status(500).json({error: 'Error al guardar el ingrediente'})
        }
    }

    deleteIng = async (req:Request, res:Response) => {
        try {
            const { id } = req.params

            if (typeof id === 'string') {
                await this.menuModels.borrarProducto(id);
                res.status(200).json({ mensaje: 'Producto eliminado' }); 
            }
        } catch (error) {
            res.status(500).json({error: 'Error al eliminar el ingrediente'})
        }
    }
}