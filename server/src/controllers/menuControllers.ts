import { Response, Request } from "express";
import { MenuModel } from "../models/menuModels";
import { Prisma } from "../generated/prisma/client";
import { IngredientesRec, ValidarRec } from "../types/esquemas";

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

    ingresarIng = async (req:Request<any, any, Prisma.IngredienteCreateInput>, res:Response) => {
        try {
            const { nombre, tipo_insumo, cantidad_ml, cantidad_botellas, unidad_medida, precio, porcentaje_alcohol, marca, tipo_alcohol, activo = true } = req.body;

            const inputSeguro = {
                nombre, tipo_insumo, cantidad_ml, cantidad_botellas: cantidad_botellas || null, unidad_medida, precio, 
                porcentaje_alcohol:porcentaje_alcohol || null, marca:marca || null, tipo_alcohol: tipo_alcohol || null, activo
            }

            const validarDatos = await this.menuModels.obtenerNombre(nombre)
            const id = validarDatos[0]?.id

            if (validarDatos.length === 0) {
                const newIng = await this.menuModels.guardarIng( inputSeguro );
                res.status(201).json(newIng)
            } else if (validarDatos.length >= 1 && validarDatos[0]?.activo === true) {
                res.status(400).json({ error: "Este producto ya existe y está activo. Utiliza la función de editar." })
                return
            } else if(validarDatos.length >= 1 && validarDatos[0]?.activo === false){
                
                if (typeof id === 'string') {
                const updateProducto = await this.menuModels.editarProducto({id, input:inputSeguro });
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
                const nuevosDatos = await this.menuModels.editarProductoExistente({id, input: datos});
                res.status(200).json(nuevosDatos); 
            }
           
        } catch (error) {
            res.status(500).json({error: 'Error al guardar el ingrediente'})
        }
    }

    deleteIng = async (req:Request, res:Response) => {
        try {
            const {id} = req.params

            if (typeof id === 'string') {
                await this.menuModels.borrarProducto(id);
                res.status(200).json({ mensaje: 'Producto eliminado' }); 
            }
        } catch (error) {
            res.status(500).json({error: 'Error al eliminar el ingrediente'})
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

    ingresarRec = async (req:Request<any, any, ValidarRec>, res:Response) => {
        const {nombre, precio, categoria, link_Youtube} = req.body
        const ingredientesArray:IngredientesRec[] = JSON.parse(req.body.ingredientes as unknown as string);
        const ingredientesRec = ingredientesArray.map((item) => ({
        cantidad_necesaria: item.cantidad_necesaria, 
        cantidad_medida: item.cantidad_medida,
        ingrediente: {
                connect: { id: item.id }
            }
        })); 
        const rutaImagen = req.file ? req.file.path : 'uploads/foto.png';

        try {
            const datosRec = await this.menuModels.guardarRec({
                nombre: nombre,
                precio: precio,
                categoria: categoria,
                imageRF: rutaImagen,
                link_Youtube: link_Youtube,
                recetas_ingredientes: {
                    create: ingredientesRec
                }
            })

            res.status(201).json(datosRec)
        } catch (error) {
            res.status(500).json({error: 'Error al guardar el ingrediente'})
        }
    }

    prepararValRec = async (req:Request, res:Response) => {
        try { 
            const {id} = req.body; 
            if (!id) {
                res.status(400).json({ error: "No fue posible encontrar la receta" })
                return 
            }  
            const datos = await this.menuModels.prepararRec(id)
            res.status(201).json(datos)  
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({ error: error.message });
            }
           return res.status(500).json({ error: "Error en el servidor" });
        }
    }
}