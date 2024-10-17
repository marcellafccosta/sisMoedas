import { prismaClient } from "../database/prismaClient.js";

export class TransacaoService {
    // Busca todas as transações
    async getAll() {
        try {
            const transacoes = await prismaClient.transacao.findMany({
                include: {
                    aluno: true,
                    professor: true
                }
            });
            return transacoes;
        } catch (error) {
            console.error("Erro ao buscar transações:", error.message);
            throw new Error("Erro ao buscar transações: " + error.message);
        }
    }

    // Busca uma transação por ID
    async getById(id) {
        try {
            const transacao = await prismaClient.transacao.findUnique({
                where: { idtransacao: parseInt(id) },
                include: {
                    aluno: true,
                    professor: true
                }
            });
            if (!transacao) {
                throw new Error("Transação não encontrada");
            }
            return transacao;
        } catch (error) {
            console.error("Erro ao buscar transação:", error.message);
            throw new Error("Erro ao buscar transação: " + error.message);
        }
    }

    // Cria uma nova transação
    async createTransacao(transacaoData) {
        try {
            const transacao = await prismaClient.transacao.create({
                data: {
                    tipo: transacaoData.tipo,
                    quantidade: transacaoData.quantidade,
                    data: transacaoData.data,
                    aluno: transacaoData.aluno_id ? { connect: { idaluno: transacaoData.aluno_id } } : undefined,
                    professor: transacaoData.professor_id ? { connect: { idprofessor: transacaoData.professor_id } } : undefined
                }
            });
            return transacao;
        } catch (error) {
            console.error("Erro ao cadastrar transação:", error.message);
            throw new Error("Erro ao cadastrar transação: " + error.message);
        }
    }

    // Atualiza uma transação existente
    async updateTransacao(id, transacaoData) {
        try {
            const updatedTransacao = await prismaClient.transacao.update({
                where: { idtransacao: parseInt(id) },
                data: {
                    tipo: transacaoData.tipo,
                    quantidade: transacaoData.quantidade,
                    data: transacaoData.data,
                    aluno: transacaoData.aluno_id ? { connect: { idaluno: transacaoData.aluno_id } } : undefined,
                    professor: transacaoData.professor_id ? { connect: { idprofessor: transacaoData.professor_id } } : undefined
                }
            });
            return updatedTransacao;
        } catch (error) {
            console.error("Erro ao atualizar transação:", error.message);
            throw new Error("Erro ao atualizar transação: " + error.message);
        }
    }

    // Deleta uma transação
    async deleteTransacao(id) {
        try {
            const deletedTransacao = await prismaClient.transacao.delete({
                where: { idtransacao: parseInt(id) }
            });
            return deletedTransacao;
        } catch (error) {
            console.error("Erro ao deletar transação:", error.message);
            throw new Error("Erro ao deletar transação: " + error.message);
        }
    }
}

export default new TransacaoService();
