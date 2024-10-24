import { Router } from "express";

import { ProfessorController } from "../controllers/ProfessorController.js";

const router = Router();
const professorController = new ProfessorController();



router.get('/', (req, res) => professorController.getAll(req, res));
router.get('/:id', (req, res) => professorController.getById(req, res));
router.post('/', (req, res) => professorController.createProfessor(req, res));
router.delete('/:id', (req, res) => professorController.deleteProfessor(req, res));
router.put('/:id', (req, res) => professorController.updateProfessor(req, res));

export { router as ProfessorRoutes }