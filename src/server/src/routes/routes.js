import { Router } from "express";
import { UsuarioRoutes } from "../routes/UsuarioRoutes.js";
import { AlunoRoutes } from "../routes/AlunoRoutes.js";


const routes = Router();

routes.use('/usuario', UsuarioRoutes);
routes.use('/aluno', AlunoRoutes);
export default routes;