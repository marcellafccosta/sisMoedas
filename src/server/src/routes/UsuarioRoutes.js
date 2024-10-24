import { Router } from "express";

import { UsuarioController } from "../controllers/UsuarioController.js";

const router = Router();
const usuarioController = new UsuarioController();

router.get('/', (req, res) => usuarioController.getAll(req, res));
router.get('/:id', (req, res) => usuarioController.getById(req, res));
router.post('/', (req, res) => usuarioController.createUser(req, res));
router.put('/:id', (req, res) => usuarioController.updateUser(req, res));
router.delete('/:id', (req, res) => usuarioController.deleteUser(req, res));
router.post('/login', usuarioController.loginUser);


export { router as UsuarioRoutes }