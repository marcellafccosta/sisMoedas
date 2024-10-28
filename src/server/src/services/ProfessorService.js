import { prismaClient } from "../database/prismaClient.js";
const SALT_ROUNDS = 10;
import bcrypt from 'bcrypt';
export class ProfessorService {
    async getAll() {
        try {
            const professores = await prismaClient.professor.findMany({
                include: {
                    usuario: true
                }
            });
            return professores;
        } catch (error) {
            console.error("Erro ao buscar professores: ", error.message);
            throw new Error("Erro ao buscar professores: " + error.message);
        }
    }

    async getById(id) {
        try {
            const professor = await prismaClient.professor.findUnique({
                where: { idprofessor: parseInt(id) },
                include: {
                    usuario: true,
                    instituicao: true
                }
            });
            if (!professor) {
                throw new Error("Professor não encontrado");
            }
            return professor;
        } catch (error) {
            throw new Error("Erro ao buscar professor por ID: " + error.message);
        }
    }

    async createProfessor(professorData) {
        try {
            if (!professorData.usuario || !professorData.usuario.nome || !professorData.usuario.email || !professorData.usuario.senha) {
                throw new Error("Dados de usuário incompletos para o cadastro do professor.");
            }
    
            const senhaCriptografada = await bcrypt.hash(professorData.usuario.senha, SALT_ROUNDS);
            
            // Criptografando a senha antes de salvar no banco de dados
            const professor = await prismaClient.professor.create({
                data: {
                    cpf: professorData.cpf,
                    departamento: professorData.departamento,
                    usuario: {
                        create: {
                            nome: professorData.usuario.nome,
                            email: professorData.usuario.email,
                            senha: senhaCriptografada // Usando a senha criptografada
                        }
                    },
                    instituicao: {
                        connect: {
                            idinstituicao: parseInt(professorData.instituicao_id, 10)
                        }
                    }
                },
                include: {
                    usuario: true,
                    instituicao: true
                }
            });

            console.log("Professor cadastrado com sucesso:", professor);
            return professor;
        } catch (error) {
            console.error("Erro ao cadastrar professor: ", error.message);
            throw new Error("Erro ao cadastrar professor: " + error.message);
        }
    }

    async updateProfessor(idprofessor, professorData) {
        try {
            const professorExistente = await prismaClient.professor.findUnique({
                where: { idprofessor: parseInt(idprofessor) },
                include: {
                    usuario: true,
                    instituicao: true
                }
            });

            if (!professorExistente) {
                throw new Error("Professor não encontrado");
            }

            const dadosAtualizados = {
                cpf: professorData.cpf || professorExistente.cpf,
                departamento: professorData.departamento || professorExistente.departamento,
                saldomoedas: professorData.saldomoedas || professorExistente.saldomoedas
            };

            const professorAtualizado = await prismaClient.professor.update({
                where: { idprofessor: parseInt(idprofessor) },
                data: {
                    ...dadosAtualizados,
                    usuario: professorData.usuario ? {
                        update: {
                            nome: professorData.usuario.nome || professorExistente.usuario.nome,
                            email: professorData.usuario.email || professorExistente.usuario.email,
                            senha: professorData.usuario.senha || professorExistente.usuario.senha
                        }
                    } : undefined,
                    instituicao: professorData.instituicao_id ? {
                        connect: { idinstituicao: parseInt(professorData.instituicao_id) }
                    } : undefined
                },
                include: {
                    usuario: true,
                    instituicao: true
                }
            });

            return professorAtualizado;
        } catch (error) {
            console.error("Erro ao atualizar professor: ", error.message);
            throw new Error("Erro ao atualizar professor: " + error.message);
        }
    }
    
    
    

    async deleteProfessor(id) {
        try {
            const professor = await prismaClient.professor.findUnique({
                where: { id: parseInt(id) },
                include: {
                    usuario: true
                }
            });

            if (!professor) {
                throw new Error("Professor não encontrado");
            }

            const deletedProfessor = await prismaClient.professor.delete({
                where: { id: parseInt(id) }
            });

            await prismaClient.usuario.delete({
                where: { idusuario: professor.usuario_id }
            });

            return deletedProfessor;
        } catch (error) {
            console.error("Erro ao deletar professor: ", error.message);
            throw new Error("Erro ao deletar professor: " + error.message);
        }
    }
}

export default new ProfessorService();
