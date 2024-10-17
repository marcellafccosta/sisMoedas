import { Router } from "express";
import { InstituicaoController } from "../controllers/InstituicaoController.js";

const router = Router();
const instituicaoController = new InstituicaoController();


router.get('/', (req, res) => instituicaoController.getAll(req, res));
router.get('/:id', (req, res) => instituicaoController.getById(req, res));
router.post('/', (req, res) => instituicaoController.createInstituicao(req, res));
router.delete('/:id', (req, res) => instituicaoController.deleteInstituicao(req, res));
router.put('/:id', (req, res) => instituicaoController.updateInstituicao(req, res));

export { router as InstituicaoRoutes }