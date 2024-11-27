import { prismaClient } from "../database/prismaClient.js";

export class TransacaoService {
    // Busca todas as transações
    async getAll() {
        try {
            const transacoes = await prismaClient.transacao.findMany({
                include: {
                    aluno: true,
                    professor: true,
                    usuario: true 
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
                    professor: true,
                    usuario: true // Inclui os dados do usuário relacionado
                }
                
            });
            console.log("Transações encontradas:", transacao);
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
            let transacaoProfessor = null;
            let transacaoAluno = null;
    
            // Cria a transação para o professor com o tipo `EnvioMoedas`
            if (transacaoData.professor_id) {
                transacaoProfessor = await prismaClient.transacao.create({
                    data: {
                        tipo: 'EnvioMoedas', 
                        quantidade: transacaoData.quantidade,
                        data: transacaoData.data,
                        professor: { connect: { idprofessor: parseInt(transacaoData.professor_id) } },
                        usuario: { connect: { idusuario: parseInt(transacaoData.usuario_id) } },
                        motivo: transacaoData.motivo
                    }
                });
            }
    
            // Se um aluno está associado, cria a transação correspondente para ele
           if (transacaoData.aluno_id) {
    const tipoTransacaoAluno = transacaoData.tipo || (transacaoData.quantidade < 0 ? 'TrocaMoedas' : 'RecebimentoMoedas');

    transacaoAluno = await prismaClient.transacao.create({
        data: {
            tipo: tipoTransacaoAluno,  // Certifique-se de que 'TrocaMoedas' seja passado aqui quando necessário
            quantidade: transacaoData.quantidade,
            data: transacaoData.data,
            aluno: { connect: { idaluno: parseInt(transacaoData.aluno_id) } },
            usuario: { connect: { idusuario: parseInt(transacaoData.usuario_id) } },
            motivo: transacaoData.motivo
        }
    });
}

    
            return { transacaoProfessor, transacaoAluno };
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
                    professor: transacaoData.professor_id ? { connect: { idprofessor: transacaoData.professor_id } } : undefined,
                    usuario: transacaoData.usuario_id ? { connect: { idusuario: transacaoData.usuario_id } } : undefined, // Atualiza o relacionamento com usuário
                    motivo: transacaoData.motivo
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
    async getByUsuarioId(usuarioId) {
        try {
            const userData = await prismaClient.usuario.findUnique({
                where: { idusuario: parseInt(usuarioId) },
                include: {
                    aluno: true,
                    professor: true
                }
            });
    
            if (!userData) {
                throw new Error("Usuário não encontrado");
            }
    
            let whereClause;
            if (userData.aluno) {
                whereClause = { aluno_id: userData.aluno.idaluno }; 
            } else if (userData.professor) {
                whereClause = { professor_id: userData.professor.idprofessor }; 
            } else {
                whereClause = { usuario_id: parseInt(usuarioId) };
            }
    
            const transacoes = await prismaClient.transacao.findMany({
                where: whereClause,
                include: {
                    aluno: true,
                    professor: true,
                    usuario: true
                }
            });
    
            return transacoes;
        } catch (error) {
            console.error("Erro ao buscar transações por usuário:", error.message);
            throw new Error("Erro ao buscar transações por usuário: " + error.message);
        }
    }
    
}

export default new TransacaoService();
