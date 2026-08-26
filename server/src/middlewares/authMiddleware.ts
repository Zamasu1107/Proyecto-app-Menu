import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { MiPayload } from "../types/esquemas";

export const validarToken = ((req:Request, res:Response, next:NextFunction) => {
    const authToken = req.cookies.access_token

    if (!authToken) { return res.status(401).json({error: 'Acceso no autorizado'});}

    try {
        const datos = jwt.verify(authToken, "SECRET_KEY") as MiPayload
        req.session = datos
        next()    
    } catch (error) {
        res.status(401).send('Acceso no autorizado');
    }
})

export const validarAdmin = ((req:Request, res:Response, next:NextFunction) => {
    if (!req.session) {
        return res.status(403).json({ error: 'No tienes permisos para realizar esta acción' });
    } else {
        if (req.session.rol === 'ADMIN') {
            next()
        } else {
            res.status(403).json({error: 'No tienes permisos para realizar esta acción'})
        }
    }
})