import { Router } from "express";
import { TransacaoController } from "../controllers/TransacaoController.js";

const router = Router();
const transacaoController = new TransacaoController();

router.get('/', (req, res) => transacaoController.getAll(req, res));
router.get('/:id', (req, res) => transacaoController.getById(req, res));
router.post('/', (req, res) => transacaoController.createTransacao(req, res));
router.put('/:id', (req, res) => transacaoController.updateTransacao(req, res));
router.delete('/:id', (req, res) => transacaoController.deleteTransacao(req, res));
router.get('/usuario/:usuarioId', (req, res) => transacaoController.getByUsuarioId(req, res)); // Nova rota

export { router as TransacaoRoutes };
