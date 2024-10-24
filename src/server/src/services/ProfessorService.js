import { prismaClient } from "../database/prismaClient.js";

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
    
            const professor = await prismaClient.professor.create({
                data: {
                    cpf: professorData.cpf,
                    departamento: professorData.departamento,
                    saldomoedas: professorData.saldomoedas || 0,
                    usuario: {
                        create: {
                            nome: professorData.usuario.nome,
                            email: professorData.usuario.email,
                            senha: professorData.usuario.senha
                        }
                    },
                    instituicao: {
                        connect: {
                            idinstituicao: parseInt(professorData.instituicao_id, 10)  // Convertendo para inteiro, se necessário
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
    
    

    async updateProfessor(professorId, professorData) {
        try {
            console.log('Dados para atualização:', {
                id: parseInt(professorId),
                cpf: professorData.cpf,
                departamento: professorData.departamento,
                saldomoedas: professorData.saldomoedas,
                nomeUsuario: professorData.usuario?.nome,
                emailUsuario: professorData.usuario?.email,
                senhaUsuario: professorData.usuario?.senha,
                instituicaoId: professorData.instituicao_id
            });
    
            const updatedProfessor = await prismaClient.professor.update({
                where: { idprofessor: parseInt(professorId) },
                data: {
                    cpf: professorData.cpf,
                    departamento: professorData.departamento,
                    saldomoedas: professorData.saldomoedas,
                    usuario: professorData.usuario ? {
                        update: {
                            nome: professorData.usuario.nome,
                            email: professorData.usuario.email,
                            senha: professorData.usuario.senha
                        }
                    } : undefined,
                    instituicao: professorData.instituicao_id ? {
                        connect: {
                            idinstituicao: parseInt(professorData.instituicao_id, 10)
                        },
                    } : undefined,
                },
                include: {
                    usuario: true,
                    instituicao: true
                }
            });
    
            if (!updatedProfessor) {
                throw new Error("Professor não encontrado");
            }
            return updatedProfessor;
        } catch (error) {
            console.error('Erro ao atualizar professor:', error);
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
            })

            await prismaClient.usuario.delete({
                where: { idusuario: professor.usuario_id }
            })

            return deletedProfessor;
        } catch (error) {
            throw new Error("Erro ao deletar professor: " + error.message);
        }
    }

}
export default new ProfessorService();