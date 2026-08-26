import { Router } from "express";
import MenuController from "../controllers/menuControllers";
import { MenuModel } from "../models/menuModels";
import multer from "multer";
import { validarAdmin, validarToken } from "../middlewares/authMiddleware";

const upload = multer({ dest: 'uploads/' });

const router = Router()

const menuRouter = new MenuController ({MenuModel})

router.get('/api/ingredientes', validarToken, validarAdmin, menuRouter.obtenerIng)
router.post('/api/ingredientes', validarToken, validarAdmin, menuRouter.ingresarIng)
router.patch('/api/ingredientes/:id', validarToken, validarAdmin, menuRouter.updateIng)
router.delete('/api/ingredientes/:id', validarToken, validarAdmin, menuRouter.deleteIng)

router.get('/api/recetas', menuRouter.obtenerRec)
router.post('/api/recetas', validarToken, validarAdmin, upload.single('imagenRF'), menuRouter.ingresarRec)
router.post('api/recetas/:id/preparar', validarToken, validarAdmin, menuRouter.prepararValRec)

export default router;