import { Router } from "express";
import { VantagemController } from "../controllers/VantagemController.js";

const router = Router();
const vantagemController = new VantagemController();


router.get('/', (req, res) => vantagemController.getAll(req, res));
router.get('/:id', (req, res) => vantagemController.getById(req, res));
router.post('/', (req, res) => vantagemController.createVantagem(req, res));
router.delete('/:id', (req, res) => vantagemController.deleteVantagem(req, res));
router.put('/:id', (req, res) => vantagemController.updateVantagem(req, res));

export { router as VantagemRoutes }