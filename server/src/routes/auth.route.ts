import { Router } from "express";
import AuthModel from "../models/authModels";
import AuthController from "../controllers/authControllers";

const authrouter = Router()

const authRouter = new AuthController ({AuthModel})

authrouter.post('/api/register', authRouter.authRegister)
authrouter.post('/api/login', authRouter.authLogin)

export default authrouter;