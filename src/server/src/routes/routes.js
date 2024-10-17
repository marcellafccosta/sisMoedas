import { Router } from "express";
import { UsuarioRoutes } from "../routes/UsuarioRoutes.js";
import { AlunoRoutes } from "../routes/AlunoRoutes.js";
import { ProfessorRoutes } from "./ProfessorRoutes.js";
import { InstituicaoRoutes } from "./InstituicaoRoutes.js";
import { EmpresaParceiraRoutes } from "./EmpresaParceiraRoutes.js";
import { VantagemRoutes } from "./VantagemRoutes.js";


const routes = Router();

routes.use('/usuario', UsuarioRoutes);
routes.use('/aluno', AlunoRoutes);
routes.use('/professor', ProfessorRoutes);
routes.use('/instituicao', InstituicaoRoutes);
routes.use('/empresaparceira', EmpresaParceiraRoutes);
routes.use('/vantagem', VantagemRoutes);
export default routes;