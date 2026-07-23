import { Router } from "express";
import MenuController from "../controllers/menuControllers";
import { MenuModel } from "../models/menuModels";

const router = Router()

const menuRouter = new MenuController ({MenuModel})

router.get('/api/ingredientes', menuRouter.obtenerIng)
router.get('/api/recetas', menuRouter.obtenerRec)
router.post('/api/ingredientes', menuRouter.ingresarIng)
router.patch('/api/ingredientes/:id', menuRouter.updateIng)
router.delete('/api/ingredientes/:id', menuRouter.deleteIng)


export default router;