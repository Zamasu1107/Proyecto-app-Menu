import z from "zod";

export const ingresarIng = z.object({
    nombre: z
    .string()
    .min(1)
    .max(25),
    cantidad_total: z
    .coerce.number()
    .positive()
    .min(1),
    cantidad_unitaria: z
    .coerce.number()
    .positive()
    .min(1),
    unidad_medida: z
    .string(),
    precio: z
    .coerce.number()
    .positive()
    .min(1),
    porcentaje_alcohol: z
    .coerce.number()
    .positive()
    .min(1)
    .nullable(),
    marca: z
    .string()
    .max(25)
    .nullable(),
    tipo_alcohol: z
    .string()
    .min(1)
    .max(25)
    .nullable(),
    tipo_insumo: z
    .string()
    .min(1)
    .max(25),
    cantidad_prod: z
    .coerce.number()
    .positive()
    .min(1)
})