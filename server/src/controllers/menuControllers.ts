import { Response, Request } from "express";
import { MenuModel } from "../models/menuModels";

export class MenuController {
    private menuModels: typeof MenuModel
    constructor({MenuModel}: {MenuModel: any}) {
        this.menuModels = MenuModel
    }

    obtenerIng = async(_req:Request, res:Response) => {
        try {
            const datos = await this.menuModels.obtenerIng();
            
            res.json(datos);
        } catch (error) {
            res.status(500).json({error: 'Error al cargar la base de datos'})
        }
    }

    obtenerRec = async (_req:Request, res:Response) => {
        try {
            const datos = await this.menuModels.obtenerRec();
            
            res.json(datos);
        } catch (error) {
            res.status(500).json({error: 'Error al cargar la base de datos'})
        }
    }
}