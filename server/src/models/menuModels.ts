import { Prisma } from "../generated/prisma/client";
import prisma from "../db/prisma/prismaDB";
import { conversionUnid } from "../utilities/conversorUnid";
import { ActualizarDatos, ClientError } from "../types/esquemas";
import { promise } from "zod";

export class MenuModel {
    static async obtenerIng () {
        const inventario = await prisma.ingrediente.findMany({ where:{ activo:true }, orderBy: { nombre: 'asc' }});

        return inventario
    }

    static async obtenerNombre (nombre:string) {
        const datos = await prisma.ingrediente.findUnique({where: {nombre: nombre,},select: {id: true,nombre: true,activo: true,},});

        return datos;
    }

    static async guardarIng (input:Prisma.IngredienteCreateInput) {
        const producto = await prisma.ingrediente.create({ data: input }) 

        return producto
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
            where: {activo: true },
            orderBy: { nombre: 'asc' },
            include: {
                recetas_ingredientes: { select: { cantidad_necesaria: true, cantidad_medida:true, id_ingrediente: true,
                    ingrediente: { select: { cantidad_total:true, nombre:true, cantidad_prod:true} }
                }}
            }
        })

        return recetas;
    }

    static async guardarRec (input:Prisma.RecetaCreateInput) {
        const nuevaReceta = await prisma.receta.create({ data:input })

        return nuevaReceta;
    }

    static async editarRec ({id, input}: {id:string, input:Prisma.RecetaUpdateInput}) {
        const updateRec = await prisma.receta.update({
            where: {id:id, activo: true},
            data: input,
            include: {
                    recetas_ingredientes: { select: { cantidad_necesaria: true, cantidad_medida:true, id_ingrediente: true,
                    ingrediente: { select: { cantidad_total:true, nombre:true, cantidad_prod:true } }
                }}
            }
        })
        return updateRec
    }

    static async borrarRec (id:string) {
        const deleteRec = await prisma.receta.update( {where: {id:id}, data:{activo: false}})

        return deleteRec
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
                            cantidad_prod:true,
                            cantidad_unitaria:true
                        }
                    }
                }
            }
            }
        });
        if (!receta) {
            throw new ClientError('La receta no existe')
        }

        const unidConvertidos = receta.recetas_ingredientes.map((ing) => {
            const cantRealDescontar = conversionUnid(ing.cantidad_necesaria.toNumber(), ing.ingrediente.unidad_medida, ing.ingrediente.tipo_medida as string) 
            return ({...ing, cantidadReal: cantRealDescontar})
        })

        const validacion = unidConvertidos.every((ing) => (ing.ingrediente.cantidad_total?.toNumber() ?? ing.ingrediente.cantidad_prod) >= ing.cantidadReal)
        if (!validacion) {
            throw new ClientError("Ingredientes insuficientes en el inventario");
        }
        
        const operacionResta = unidConvertidos.flatMap((ing) => {
            return [ 
                prisma.ingrediente.update({
                where: { 
                    id: ing.ingrediente.id,
                    cantidad_total: { gte: ing.cantidadReal }
                },
                    data: {
                        cantidad_total: {
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
        const operacion = await prisma.$transaction(operacionResta);
            
        const operacionProd = operacion.flatMap((ing) => {
            if ('cantidad_prod' in ing) {
                const productoReal = Math.floor(Number(ing.cantidad_total) / ing.cantidad_unitaria)
                    return [ prisma.ingrediente.update({
                        where: { id: ing.id }, 
                        data: {
                            cantidad_prod : {
                                set: productoReal
                            }
                        }
                    }) ]
                }
                return [] 
            })
        await Promise.all(operacionProd)
        return operacion 
    }
}