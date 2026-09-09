import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";
import { ZodError } from "zod/v3";

export const validarFormIng = (schema: ZodType) => ( async(req:Request, res:Response, next:NextFunction) => {
    try {
        const respuesta = await schema.parseAsync(req.body)
        req.body = respuesta
        next()
    } catch (error) {
        if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors,});
      }
      console.log(error)
      return res.status(500).json({ error: 'Error interno en el servidor' });
    }
})