import TransacaoService from '../services/TransacaoService.js';

export class TransacaoController {
    // Função para buscar todas as transações
    async getAll(req, res) {
        try {
            const transacoes = await TransacaoService.getAll();
            res.status(200).json(transacoes);
        } catch (error) {
            console.error("Erro ao recuperar transações:", error.message);
            res.status(500).json({ message: "Não foi possível recuperar as transações. Tente novamente mais tarde." });
        }
    }

    // Função para buscar uma transação por ID
    async getById(req, res) {
        try {
            const { id } = req.params;
            if (isNaN(parseInt(id))) {
                return res.status(400).json({ message: 'ID inválido.' });
            }

            const transacao = await TransacaoService.getById(id);

            if (transacao) {
                res.status(200).json(transacao);
            } else {
                res.status(404).json({ message: `Transação com ID ${id} não encontrada.` });
            }
        } catch (error) {
            console.error("Erro ao buscar transação:", error.message);
            res.status(500).json({ message: 'Não foi possível recuperar a transação. Tente novamente mais tarde.' });
        }
    }

    // Função para criar uma nova transação
    async createTransacao(req, res) {
        try {
            const transacaoData = req.body;
            const novaTransacao = await TransacaoService.createTransacao(transacaoData);
            res.status(201).json(novaTransacao);
        } catch (error) {
            console.error("Erro ao cadastrar transação:", error.message);
            res.status(500).json({ message: 'Não foi possível cadastrar a transação. Tente novamente mais tarde.' });
        }
    }

    // Função para atualizar uma transação
    async updateTransacao(req, res) {
        try {
            const { id } = req.params;
            const transacaoData = req.body;

            if (isNaN(parseInt(id))) {
                return res.status(400).json({ message: 'ID inválido.' });
            }

            const transacaoAtualizada = await TransacaoService.updateTransacao(id, transacaoData);

            if (transacaoAtualizada) {
                res.status(200).json(transacaoAtualizada);
            } else {
                res.status(404).json({ message: `Transação com ID ${id} não encontrada.` });
            }
        } catch (error) {
            console.error("Erro ao atualizar transação:", error.message);
            res.status(500).json({ message: 'Não foi possível atualizar a transação. Tente novamente mais tarde.' });
        }
    }

    // Função para deletar uma transação
    async deleteTransacao(req, res) {
        try {
            const { id } = req.params;
            if (isNaN(parseInt(id))) {
                return res.status(400).json({ message: 'ID inválido.' });
            }

            const transacaoDeletada = await TransacaoService.deleteTransacao(id);

            if (transacaoDeletada) {
                res.status(200).json({ message: `Transação com ID ${id} deletada com sucesso.` });
            } else {
                res.status(404).json({ message: `Transação com ID ${id} não encontrada.` });
            }
        } catch (error) {
            console.error("Erro ao deletar transação:", error.message);
            res.status(500).json({ message: 'Não foi possível deletar a transação. Tente novamente mais tarde.' });
        }
    }

    // Função para buscar transações por usuário ID
    async getByUsuarioId(req, res) {
        try {
            const { usuarioId } = req.params;

            if (isNaN(parseInt(usuarioId))) {
                return res.status(400).json({ message: 'ID de usuário inválido.' });
            }

            const transacoes = await TransacaoService.getByUsuarioId(usuarioId);
            
            if (transacoes && transacoes.length > 0) {
                res.status(200).json(transacoes);
            } else {
                res.status(404).json({ message: `Nenhuma transação encontrada para o usuário com ID ${usuarioId}.` });
            }
        } catch (error) {
            console.error("Erro ao buscar transações por usuario_id:", error.message);
            res.status(500).json({ message: 'Não foi possível recuperar as transações. Tente novamente mais tarde.' });
        }
    }
}

export default new TransacaoController();
