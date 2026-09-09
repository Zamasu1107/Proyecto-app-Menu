import { Router } from "express";
import MenuController from "../controllers/menuControllers";
import { MenuModel } from "../models/menuModels";
import multer from "multer";
import { validarAdmin, validarToken } from "../middlewares/authMiddleware";
import { validarFormRec } from "../middlewares/recMiddleware";
import { editRec, validarArrayIng } from "../schemas/recetas.schema";
import { validarFormIng } from "../middlewares/ingMiddleware";
import { ingresarIng } from "../schemas/ingrediente.schema";

const upload = multer({ dest: 'uploads/' });

const router = Router()

const menuRouter = new MenuController ({MenuModel})

router.get('/api/ingredientes', validarToken, validarAdmin, menuRouter.obtenerIng)
router.post('/api/ingredientes', validarToken, validarAdmin, validarFormIng(ingresarIng), menuRouter.ingresarIng)
router.patch('/api/ingredientes/:id', validarToken, validarAdmin, menuRouter.updateIng)
router.delete('/api/ingredientes/:id', validarToken, validarAdmin, menuRouter.deleteIng)

router.get('/api/recetas', menuRouter.obtenerRec)
router.post('/api/recetas', validarToken, validarAdmin, upload.single('imagenRF'), validarFormRec(validarArrayIng), menuRouter.ingresarRec)
router.patch('/api/recetas/:id', validarToken, validarAdmin, upload.single('imagenRF'), validarFormRec(editRec), menuRouter.updateRec)
router.delete('/api/recetas/:id', validarToken, validarAdmin, menuRouter.deleteRec)
router.patch('/api/recetas/:id/preparar', menuRouter.prepararValRec)

export default router;