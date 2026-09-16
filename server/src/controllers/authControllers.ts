import { Response, Request } from "express";
import { ValidarUsers, authUser, ValidarNewUsers, authNewUser, admitedEnv } from "../schemas/auth.schema";
import { ZodError } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AuthModel from "../models/authModels";
import 'dotenv/config';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

export default class AuthController {
    private authModels: typeof AuthModel
    constructor({AuthModel}: {AuthModel: any}) {
        this.authModels = AuthModel;
    }
    authRegister =  async(req:Request, res:Response) => {
        try {
            const newUser = req.body
            const valUser: ValidarNewUsers = authNewUser.parse(newUser)

            const {new_username, new_password} = valUser

            const hashedPassword = await bcrypt.hash(new_password, 10);

            const createdUser = await this.authModels.registrarUser(new_username, hashedPassword)

            const token = jwt.sign({id: createdUser.id, username: createdUser.username, rol: createdUser.rol}, admitedEnv.SECRET_KEY, { expiresIn: '10h'})

            return res.json({ 
                        msg: "Bienvenido nuevo usuario", 
                        token: token
                    });
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({Error: error.issues});
            } else if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    return res.status(409).json({ error: "El usuario ya existe" })
                }
            }
            console.log(error);
            return res.status(500).json({error: "Error interno del servidor, intenta más tarde"})
        }
    }

    authLogin =  async(req:Request, res:Response) => {
        try {
            const user = req.body
            const valUser: ValidarUsers = authUser.parse(user)

            const {username, password} = valUser

            const valUsername = await this.authModels.obtenerUsername(username)
            if (!valUsername) {
                return res.status(401).json({error: "El usuario o la contraseña son incorrectos"})
            }

            const validarPassword = await bcrypt.compare(password, valUsername.password);
            if (!validarPassword) {
                return res.status(401).json({error: "El usuario o la contraseña son incorrectos"})
            }

            const token = jwt.sign({id: valUsername.id, username, rol: valUsername.rol}, admitedEnv.SECRET_KEY, { expiresIn: '10h'})

            return res.json({ 
                        msg: "Bienvenido de nuevo", 
                        token: token
                    });
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({Error: error.issues});
            } 
            console.log(error);
            return res.status(500).json({error: "Error interno del servidor, intenta más tarde"})
        }
    }

    authCheck = async(req:Request, res:Response) => {
        if (req.cookies.access_token) {
            return res.send(true)
        } else {
            return res.send(false)
        }
    }
}
