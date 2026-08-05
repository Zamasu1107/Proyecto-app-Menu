import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const validarToken = ((req:Request, res:Response, next:NextFunction) => {
    const authToken = req.cookies.access_token

    if (!authToken) { res.status(401).json({error: 'Acceso no autorizado'});}

    try {
        const datos = jwt.verify(authToken, "SECRET_KEY")
        req.session = datos
        next()    
    } catch (error) {
        res.status(401).send('Acceso no autorizado');
    }
})