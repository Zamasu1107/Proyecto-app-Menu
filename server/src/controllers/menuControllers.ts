import { Response, Request } from "express";
import { MenuModel } from "../models/menuModels";
import { Prisma } from "../generated/prisma/client";
import { ClientError, IngredientesRec, ValidarRec } from "../types/esquemas";
import { tipoFamilias } from "../utilities/conversorUnid";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

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
            console.log(error)
            res.status(500).json({error: 'Error al cargar la base de datos'})
        }
    }

    ingresarIng = async (req:Request<any, any, Prisma.IngredienteCreateInput>, res:Response) => {
        try {
            const { nombre, tipo_insumo, cantidad_total, cantidad_prod, unidad_medida,precio, porcentaje_alcohol, marca, tipo_alcohol, cantidad_unitaria, activo = true } = req.body;

            let familiaCalculada = tipoFamilias[tipo_insumo]!

            if (tipo_insumo === 'frescos' && unidad_medida === 'pza') {
                familiaCalculada = 'PIEZA'
            }

            const cantidadReal = (Number(cantidad_total) || 1) * (cantidad_prod || 1);
            
            const inputSeguro = {
                nombre, tipo_insumo, cantidad_total: cantidadReal, cantidad_unitaria: cantidad_unitaria, cantidad_prod: cantidad_prod || 1, unidad_medida, precio, 
                porcentaje_alcohol:porcentaje_alcohol || null, marca:marca || null, tipo_alcohol: tipo_alcohol || null, activo, tipo_medida: familiaCalculada
            }
        
            const validarDatos = await this.menuModels.obtenerNombre(nombre)
            const id = validarDatos?.id

            if (!validarDatos) {
                const newIng = await this.menuModels.guardarIng( inputSeguro );
                res.status(201).json(newIng)
            } else if (validarDatos && validarDatos.activo === true) {
                res.status(400).json({ error: "Este producto ya existe y está activo. Utiliza la función de editar." })
                return
            } else if(validarDatos && validarDatos.activo === false){
                if (typeof id === 'string') {
                const updateProducto = await this.menuModels.editarProducto({id, input:inputSeguro });
                res.status(200).json(updateProducto)
                }
            }
        } catch (error) {
            console.log(error);
            res.status(400).json({error: 'Error al guardar el ingrediente'})
        }
    }

    updateIng = async (req:Request, res:Response) => {
        try {
            const {cantidad_total, cantidad_prod} = req.body;

            const prodSuma = cantidad_prod * cantidad_total

            const inputSeguro = { cantidad_prod: cantidad_prod, prodSuma }

            const {id} = req.params;

            if (typeof id !== 'string') return res.status(400).json({error : 'Datos Incorrectos'}); 

            const nuevosDatos = await this.menuModels.editarProductoExistente({id, input: inputSeguro});
            res.status(200).json(nuevosDatos); 
           
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    return res.status(404).json({error: 'Error al encontrar el ingrediente o no existe'})
                }
            }
            console.log(error);
            res.status(500).json({error: 'Error en el servidor'})
        }
    }

    deleteIng = async (req:Request, res:Response) => {
        try {
            const {id} = req.params

            if (typeof id !== 'string') return res.status(400).json({error : 'Datos Incorrectos'});

            await this.menuModels.borrarProducto(id);
            res.status(200).json({ mensaje: 'Producto eliminado' }); 
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    return res.status(404).json({error: 'Error al encontrar el ingrediente o no existe'})
                }
            }
            console.log(error);
            res.status(500).json({error: 'Error en el servidor'})
        }
    }


    obtenerRec = async (_req:Request, res:Response) => {
        try {
            const datos = await this.menuModels.obtenerRec();
            
            res.json(datos);
        } catch (error) {
            console.log(error);
            res.status(500).json({error: 'Error al cargar la base de datos'})
        }
    }

    ingresarRec = async (req:Request<any, any, ValidarRec>, res:Response) => {
        const {nombre, precio, categoria, link_Youtube} = req.body 
        const ingredientesRec = req.body.ingredientes.map((item) => ({
        cantidad_necesaria: item.cantidad_necesaria, 
        cantidad_medida: item.cantidad_medida,
        ingrediente: {
                connect: { id: item.id_ingrediente }
            }
        })); 
        const rutaImagen = req.file?.filename || 'foto.png';

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
            console.log(error);
            res.status(400).json({error: 'Error al guardar la receta'})
        }
    }

    updateRec = async (req:Request<any, any, ValidarRec>, res:Response) => {
        const {nombre, precio, link_Youtube} = req.body
        const ingredientesRec = req.body.ingredientes.map((item) => ({
        cantidad_necesaria: item.cantidad_necesaria, 
        cantidad_medida: item.cantidad_medida,
        ingrediente: {
                connect: { id: item.id_ingrediente }
            }
        })); 
        const rutaImagen: string | undefined = req.file?.filename || 'foto.png';
        const {id} = req.params;

        try {
            const datosRec = {
                id: id, 
                input: {
                    nombre: nombre,
                    ...(precio && {precio: Number(precio)}),
                    link_Youtube: link_Youtube,
                    ...(req.file && {imageRF : rutaImagen}),
                    recetas_ingredientes: {
                        deleteMany: {},
                        create: ingredientesRec
                    }
                }
            }
            const nuevosDatos = await this.menuModels.editarRec(datosRec)

            res.status(200).json(nuevosDatos)
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    return res.status(404).json({error: 'Error al actualizar la receta'})
                }
            }
            console.log(error);
            res.status(500).json({error: 'Error en el servidor'})
        }
    }

    deleteRec = async (req:Request, res:Response) => {
        try {
            const {id} = req.params
            if (typeof id !== 'string') return res.status(400).json({ mensaje: 'No se encontro la receta' });

            await this.menuModels.borrarRec(id)
            res.status(200).json({ mensaje: 'Receta eliminada' });
        } catch (error) {
            console.log(error);
            res.status(400).json({error: 'Error al eliminar la receta'})
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
            res.status(200).json(datos)  
        } catch (error) {
            if (error instanceof ClientError) {
                    res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: "Error en el servidor" });
            }
        }
    }
}