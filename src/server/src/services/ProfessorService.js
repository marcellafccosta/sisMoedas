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
                where: { id: parseInt(id) },
                include: {
                    usuario: true
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
            const professor = await prismaClient.professor.create({
                data: {
                    cpf: professorData.cpf,
                    departamento: professorData.departamento,
                    saldomoedas: professorData.saldomoedas,
                    usuario: {
                        create: {
                            nome: professorData.usuario.nome,
                            email: professorData.usuario.email,
                            senha: professorData.usuario.senha
                        }
                    },
                    instituicao: {
                        connect: {
                            idinstituicao: professorData.instituicao_id  // Certifique-se de que o idinstituicao seja passado corretamente
                        }
                    }
                },
                include: {
                    usuario: true,
                    instituicao: true
                }
            });
    
            return professor;
        } catch (error) {
            console.error("Erro ao cadastrar professor: ", error.message);
            throw new Error("Erro ao cadastrar professor: " + error.message);
        }
    }
    

    async updateProfessor(professorId, professorData) {
        try {
            const updatedProfessor = await prismaClient.professor.update({
                where: { id: parseInt(professorId) },
                data: professorData,
                include: {
                    usuario: true,
                    instituicao: true
                }
            })
            if (!updatedProfessor) {
                throw new Error("Professor não encontrado");
            }
            return updatedProfessor;
        } catch (error) {
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