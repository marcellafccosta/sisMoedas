import { prismaClient } from "../database/prismaClient.js";

export class InstituicaoService {
    // Busca todas as instituições, incluindo o endereço e os professores associados
    async getAll() {
        try {
            const instituicoes = await prismaClient.instituicao.findMany({
                include: {
                    endereco: true,
                    professor: true,
                }
            });
            return instituicoes;
        } catch (error) {
            console.error("Erro ao buscar instituições:", error.message);
            throw new Error("Erro ao buscar instituições: " + error.message);
        }
    }

    // Busca uma instituição por ID, incluindo o endereço e os professores associados
    async getById(id) {
        try {
            const instituicao = await prismaClient.instituicao.findUnique({
                where: { idinstituicao: parseInt(id) },
                include: {
                    endereco: true,
                    professor: true,
                }
            });
            if (!instituicao) {
                throw new Error("Instituição não encontrada");
            }
            return instituicao;
        } catch (error) {
            console.error("Erro ao buscar instituição:", error.message);
            throw new Error("Erro ao buscar instituição: " + error.message);
        }
    }

    // Cria uma nova instituição e conecta ou cria um endereço associado
    async createInstituicao(instituicaoData) {
        try {
            const instituicao = await prismaClient.instituicao.create({
                data: {
                    nome: instituicaoData.nome,
                    endereco: {
                        create: {
                            logradouro: instituicaoData.endereco.logradouro,
                            bairro: instituicaoData.endereco.bairro,
                            cidade: instituicaoData.endereco.cidade,
                            estado: instituicaoData.endereco.estado,
                            numero: instituicaoData.endereco.numero,
                            complemento: instituicaoData.endereco.complemento,
                            cep: instituicaoData.endereco.cep,
                        }
                    }
                },
                include: {
                    endereco: true
                }
            });

            console.log('Instituição criada com sucesso:', instituicao);
            return instituicao;

        } catch (error) {
            console.error("Erro ao cadastrar instituição:", error.message);
            throw new Error("Erro ao cadastrar instituição: " + error.message);
        }
    }

    // Atualiza uma instituição existente e seu endereço associado
    async updateInstituicao(instituicaoId, instituicaoData) {
        try {
            const updatedInstituicao = await prismaClient.instituicao.update({
                where: { idinstituicao: parseInt(instituicaoId) },
                data: {
                    nome: instituicaoData.nome,
                    endereco: {
                        update: {
                            logradouro: instituicaoData.endereco.logradouro,
                            bairro: instituicaoData.endereco.bairro,
                            cidade: instituicaoData.endereco.cidade,
                            estado: instituicaoData.endereco.estado,
                            numero: instituicaoData.endereco.numero,
                            complemento: instituicaoData.endereco.complemento,
                            cep: instituicaoData.endereco.cep,
                        }
                    }
                },
                include: { endereco: true, professor: true }, // Inclui os dados completos de endereço e professor
            });
            return updatedInstituicao;
        } catch (error) {
            console.error("Erro ao atualizar instituição:", error.message);
            throw new Error("Erro ao atualizar instituição: " + error.message);
        }
    }
    

    // Deleta uma instituição pelo ID
    async deleteInstituicao(id) {
        try {
            // Atualiza os professores para remover o vínculo com a instituição
            await prismaClient.professor.updateMany({
                where: { instituicao_id: parseInt(id) },
                data: { instituicao_id: null }  // Define instituicao_id como null
            });
    
            // Agora deleta a instituição
            const deletedInstituicao = await prismaClient.instituicao.delete({
                where: { idinstituicao: parseInt(id) },
            });
    
            return deletedInstituicao;
        } catch (error) {
            console.error("Erro ao deletar instituição:", error.message);
            throw new Error("Erro ao deletar instituição: " + error.message);
        }
    }
    
    
}

export default new InstituicaoService();
