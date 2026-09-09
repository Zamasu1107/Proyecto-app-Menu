import { z } from "zod";

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

export const editRec = z.object({
    id: z
    .uuid(),
    nombre: z
    .string()
    .min(1)
    .optional(),
    precio: z
    .coerce.number()
    .positive()
    .optional(),
    imagenRF: z
    .instanceof(File, { message: "Se requiere un archivo de imagen válido" })
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Solo se aceptan formatos .jpg, .jpeg, .png y .gif.")
    .optional(),
    link_Youtube: z
    .url()
    .startsWith('https://')
    .optional(),
    ingredientes: z
    .string() 
    .transform((val) => JSON.parse(val))
    .pipe(z.array(z.object({
      id_ingrediente: z
      .uuid(),
      cantidad_necesaria: z
      .coerce.number()
      .optional(),
      cantidad_medida: z
      .string()
      .optional()
    })))
}) 

const validarIng = z.object({
    id_ingrediente: z
    .uuid(),
    cantidad_necesaria: z
    .coerce.number()
    .optional(),
    cantidad_medida: z
    .string()
    .optional()
})

export const validarArrayIng = z.string().transform((val) => {
    const parsed = JSON.parse(val);
    
    return parsed
}).pipe(z.array(validarIng));