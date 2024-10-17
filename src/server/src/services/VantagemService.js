import { prismaClient } from "../database/prismaClient.js";

export class VantagemService {
    // Busca todas as vantagens
    async getAll() {
        try {
            const vantagens = await prismaClient.vantagem.findMany({
                include: {
                    empresaparceira: true // Inclui informações sobre a empresa parceira, se necessário
                }
            });
            return vantagens;
        } catch (error) {
            console.error("Erro ao buscar vantagens:", error.message);
            throw new Error("Erro ao buscar vantagens: " + error.message);
        }
    }

    // Busca uma vantagem por ID
    async getById(id) {
        try {
            const vantagem = await prismaClient.vantagem.findUnique({
                where: { idvantagem: parseInt(id) },
                include: {
                    empresaparceira: true
                }
            });
            if (!vantagem) {
                throw new Error("Vantagem não encontrada");
            }
            return vantagem;
        } catch (error) {
            console.error("Erro ao buscar vantagem:", error.message);
            throw new Error("Erro ao buscar vantagem: " + error.message);
        }
    }

    // Cria uma nova vantagem
    async createVantagem(vantagemData) {
        try {
            const vantagem = await prismaClient.vantagem.create({
                data: {
                    descricao: vantagemData.descricao,
                    customoedas: vantagemData.customoedas,
                    foto: vantagemData.foto,
                    empresaparceira: {
                        connect: { idempresa: vantagemData.empresaparceira_id }
                    }
                }
            });
            return vantagem;
        } catch (error) {
            console.error("Erro ao cadastrar vantagem:", error.message);
            throw new Error("Erro ao cadastrar vantagem: " + error.message);
        }
    }

    // Atualiza uma vantagem existente
    async updateVantagem(id, vantagemData) {
        try {
            const updatedVantagem = await prismaClient.vantagem.update({
                where: { idvantagem: parseInt(id) },
                data: {
                    descricao: vantagemData.descricao,
                    customoedas: vantagemData.customoedas,
                    foto: vantagemData.foto,
                    empresaparceira: {
                        connect: { idempresa: vantagemData.empresaparceira_id }
                    }
                }
            });
            return updatedVantagem;
        } catch (error) {
            console.error("Erro ao atualizar vantagem:", error.message);
            throw new Error("Erro ao atualizar vantagem: " + error.message);
        }
    }

    // Deleta uma vantagem pelo ID
    async deleteVantagem(id) {
        try {
            const deletedVantagem = await prismaClient.vantagem.delete({
                where: { idvantagem: parseInt(id) }
            });
            return deletedVantagem;
        } catch (error) {
            console.error("Erro ao deletar vantagem:", error.message);
            throw new Error("Erro ao deletar vantagem: " + error.message);
        }
    }
}

export default new VantagemService();
