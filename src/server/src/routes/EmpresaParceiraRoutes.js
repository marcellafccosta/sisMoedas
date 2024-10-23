import { Router } from "express";

import { EmpresaParceiraController } from "../controllers/EmpresaParceiraController.js"; 

const router = Router();
const empresaParceiraController = new EmpresaParceiraController();

router.get('/', (req, res) => empresaParceiraController.getAll(req, res));
router.get('/:id', (req, res) => empresaParceiraController.getById(req, res));
router.post('/', (req, res) => empresaParceiraController.createEmpresaParceira(req, res));
router.delete('/:id', (req, res) => empresaParceiraController.deleteEmpresaParceira(req, res));
router.put('/:id', (req, res) => empresaParceiraController.updateEmpresaParceira(req, res));

export { router as EmpresaParceiraRoutes }