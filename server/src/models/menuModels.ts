import { Prisma } from "../generated/prisma/client";
import prisma from "../db/prisma/prismaDB";
import { conversionUnid } from "../utilities/conversorUnid";
import { ActualizarDatos } from "../types/esquemas";

export class MenuModel {
    static async obtenerIng () {
        try {
            const inventario = await prisma.ingrediente.findMany({ where:{ activo:true}});

            return inventario
        } catch (error) {
            console.log(error)
            throw new Error('No se pudo cargar la base de datos')
        }
    }

    static async obtenerNombre (nombre:string) {
        try {

            const datos = await prisma.ingrediente.findMany({where: {nombre: nombre,},select: {id: true,nombre: true,activo: true,},});

            return datos;
        } catch (error) {
            console.log(error)
            throw new Error('No se pudo cargar la base de datos')
        }
    }

    static async guardarIng (input:Prisma.IngredienteCreateInput) {
        try {
            const producto = await prisma.ingrediente.create({ data: input }) 

            return producto
        } catch (error) {
            console.log(error)
            throw new Error('No se pudo guardar el ingrediente')
        }
    }

    static async editarProductoExistente ({ id, input}: {id:string, input:ActualizarDatos}) {
        const updateIng = await prisma.ingrediente.update({ 
            where: { id: id, activo: true}, 
                data: { 
                    cantidad_prod:{ increment: input.cantidad_prod}, 
                    cantidad_total: {increment: input.prodSuma}
                }
            })
        
        return updateIng;
    }

    static async editarProducto ({ id, input}: {id:string, input:Prisma.IngredienteCreateInput}) {
        const updateIng = await prisma.ingrediente.update({ where: { id: id}, data:input})

        return updateIng;
    }

    static async borrarProducto (id:string) {
        const deleteIng = await prisma.ingrediente.update( {where: { id:id }, data: {activo:false}})

        return deleteIng
    }


    static async obtenerRec () {
        const recetas = await prisma.receta.findMany({
            include: {
                recetas_ingredientes: { select: { cantidad_necesaria: true, cantidad_medida:true,
                    ingrediente: { select: { cantidad_total:true, nombre:true, cantidad_prod:true} }
                }}
            }
        })

        // const recetasPosibles = recetas.filter((rec) => 
        //     rec.recetas_ingredientes.length > 0 && rec.recetas_ingredientes.every(ing => 
        //         (ing.ingrediente.cantidad_total ?? ing.ingrediente.cantidad_prod) >= ing.cantidad_necesaria))

        return recetas;
    }

    static async guardarRec (input:Prisma.RecetaCreateInput) {
        try {
            const nuevaReceta = await prisma.receta.create({ data:input })

            return nuevaReceta;
        } catch (error) {
            console.log(error)
            throw new Error('No se pudo guardar el ingrediente')
        }
    }

    static async prepararRec (id:string) {
        const receta = await prisma.receta.findUnique({
            where: {id: id},
            include: {
                recetas_ingredientes: {
                    select: { cantidad_necesaria: true,
                        id_ingrediente: true,
                        id_receta: true,
                        ingrediente: {
                        select: {
                            cantidad_total: true,
                            id: true,
                            unidad_medida: true,
                            tipo_medida:true,
                            cantidad_prod:true
                        }
                    }
                }
            }
            }
        });
        if (!receta) {
            throw new Error('La receta no existe')
        }

        const unidConvertidos = receta.recetas_ingredientes.map((ing) => {
            const cantRealDescontar = conversionUnid(ing.cantidad_necesaria.toNumber(), ing.ingrediente.unidad_medida, ing.ingrediente.tipo_medida as string) 
            return ({...ing, cantidadReal: cantRealDescontar})
        })

        const validacion = unidConvertidos.every((ing) => ing.ingrediente.cantidad_total?.toNumber() ?? ing.ingrediente.cantidad_prod >= ing.cantidadReal)
        if (!validacion) {
            throw new Error ("Ingredientes insuficientes en el inventario");
        }
        const operacionResta = unidConvertidos.flatMap((ing) => {
            return [ 
                prisma.ingrediente.update({
                where: { 
                    id: ing.ingrediente.id,
                    cantidad_ml :{ gte: ing.cantidadReal}
                },
                    data: {
                        cantidad_ml: {
                            decrement: ing.cantidadReal
                        }
                    }
                }),
                prisma.historial_recetas.create({
                    data: {
                        cantidad_descont : ing.cantidadReal,
                        ingrediente : { connect : {id: ing.id_ingrediente}},
                        receta : { connect : {id: ing.id_receta}}
                    }
                })
                ]
            });
        const operacion = await prisma.$transaction(operacionResta)
        return operacion 
    }
}