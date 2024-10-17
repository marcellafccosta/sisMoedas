import { Router } from "express";

import { AlunoController } from "../controllers/AlunoController.js";

const router = Router();
const alunoController = new AlunoController();


router.get('/', (req, res) => alunoController.getAll(req, res));
router.get('/:id', (req, res) => alunoController.getById(req, res));
router.post('/', (req, res) => alunoController.createAluno(req, res));
router.delete('/:id', (req, res) => alunoController.deleteAluno(req, res));
router.put('/:id', (req, res) => alunoController.updateAluno(req, res));

export { router as AlunoRoutes }