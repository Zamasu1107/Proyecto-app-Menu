import { Router } from "express";
import MenuController from "../controllers/menuControllers";
import { MenuModel } from "../models/menuModels";
import multer from "multer";

const upload = multer({ dest: 'uploads/' });

const router = Router()

const menuRouter = new MenuController ({MenuModel})

router.get('/api/ingredientes', menuRouter.obtenerIng)
router.post('/api/ingredientes', menuRouter.ingresarIng)
router.patch('/api/ingredientes/:id', menuRouter.updateIng)
router.delete('/api/ingredientes/:id', menuRouter.deleteIng)

router.get('/api/recetas', menuRouter.obtenerRec)
router.post('/api/recetas', upload.single('imagenRF'), menuRouter.ingresarRec)
router.post('api/recetas/:id', menuRouter.prepararValRec)

export default router;