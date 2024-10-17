import { Router } from "express";
import { UsuarioRoutes } from "../routes/UsuarioRoutes.js";
import { AlunoRoutes } from "../routes/AlunoRoutes.js";
import { ProfessorRoutes } from "./ProfessorRoutes.js";
import { InstituicaoRoutes } from "./InstituicaoRoutes.js";


const routes = Router();

routes.use('/usuario', UsuarioRoutes);
routes.use('/aluno', AlunoRoutes);
routes.use('/professor', ProfessorRoutes);
routes.use('/instituicao', InstituicaoRoutes);
export default routes;