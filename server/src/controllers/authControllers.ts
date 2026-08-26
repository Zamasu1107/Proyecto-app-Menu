import { Response, Request } from "express";
import { ValidarUsers, authUser, ValidarNewUsers, authNewUser } from "../schemas/auth.schema";
import { ZodError } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AuthModel from "../models/authModels";

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

            const valUsername = await this.authModels.obtenerUsername(new_username)

            if (valUsername) {
                return res.status(409).json({error: "Error el usuario ya existe"})
            }

            const hashedPassword = await bcrypt.hash(new_password, 10);

            await this.authModels.registrarUser(new_username, hashedPassword)

            res.status(201).json({ message: "Usuario creado exitosamente" })
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({Error: error.issues});
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

            const token = jwt.sign({id: valUsername.id, username, rol: valUsername.rol}, "SECRET_KEY", { expiresIn: '1h'})

            res.cookie('access_token', token, { httpOnly: true, secure: true })
            res.status(200).json({ message: "Usuario logeado exitosamente" })  
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({Error: error.issues});
            }
            console.log(error);
            return res.status(500).json({error: "Error interno del servidor, intenta más tarde"})
        }
    }
}
