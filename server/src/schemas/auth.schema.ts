import { z } from "zod";
import { Role } from "../generated/prisma/enums";

export const authNewUser = z.object({
  new_username: z
    .string()
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
    .max(20, "El nombre de usuario no puede superar los 20 caracteres")
    .regex(/^[a-zA-Z0-9_]+$/, "Solo se permiten letras, números y guiones bajos"),
    
  new_password: z
    .string()
    .min(8, "La contraseña debe tener al menos 5 caracteres")
    .regex(/[A-Z]/, "Debe contener al menos una letra mayúscula")
    .regex(/[a-z]/, "Debe contener al menos una letra minúscula")
    .regex(/[0-9]/, "Debe contener al menos un número"),

  rol: z
    .enum(Role)
    .default('ADMIN')
});

export const authUser = z.object({
  username: z
    .string()
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
    .max(20, "El nombre de usuario no puede superar los 20 caracteres")
    .regex(/^[a-zA-Z0-9_]+$/, "Solo se permiten letras, números y guiones bajos"),
    
  password: z
    .string(),

  rol: z
    .enum(Role)
    .default('ADMIN')
});

export type ValidarUsers = z.infer<typeof authUser>

export type ValidarNewUsers = z.infer<typeof authNewUser>;