import { Router } from "express";
import { MenuController } from "../controllers/menuControllers";
import { MenuModel } from "../models/menuModels";

const router = Router()

const menuRouter = new MenuController ({MenuModel})

router.get('/ingredientes', menuRouter.obtenerIng)
router.get('/recetas', menuRouter.obtenerRec)


export default router;