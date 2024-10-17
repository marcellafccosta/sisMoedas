import VantagemService from '../services/VantagemService.js';

export class VantagemController {
    // Função para buscar todas as vantagens
    async getAll(req, res) {
        try {
            const vantagens = await VantagemService.getAll();
            res.status(200).json(vantagens);
        } catch (error) {
            console.error("Erro ao recuperar vantagens:", error.message);
            res.status(500).json({ message: "Não foi possível recuperar as vantagens. Tente novamente mais tarde." });
        }
    }

    // Função para buscar uma vantagem por ID
    async getById(req, res) {
        try {
            const { id } = req.params;
            const vantagem = await VantagemService.getById(id);
            if (vantagem) {
                res.status(200).json(vantagem);
            } else {
                res.status(404).json({ message: `Vantagem com ID ${id} não encontrada.` });
            }
        } catch (error) {
            console.error("Erro ao buscar vantagem:", error.message);
            res.status(500).json({ message: "Não foi possível buscar a vantagem. Tente novamente mais tarde." });
        }
    }

    // Função para criar uma nova vantagem
    async createVantagem(req, res) {
        try {
            const vantagemData = req.body;
            const novaVantagem = await VantagemService.createVantagem(vantagemData);
            res.status(201).json(novaVantagem);
        } catch (error) {
            console.error("Erro ao cadastrar vantagem:", error.message);
            res.status(500).json({ message: "Não foi possível cadastrar a vantagem. Tente novamente mais tarde." });
        }
    }

    // Função para atualizar uma vantagem
    async updateVantagem(req, res) {
        try {
            const { id } = req.params;
            const vantagemData = req.body;
            const vantagemAtualizada = await VantagemService.updateVantagem(id, vantagemData);
            if (vantagemAtualizada) {
                res.status(200).json(vantagemAtualizada);
            } else {
                res.status(404).json({ message: `Vantagem com ID ${id} não encontrada.` });
            }
        } catch (error) {
            console.error("Erro ao atualizar vantagem:", error.message);
            res.status(500).json({ message: "Não foi possível atualizar a vantagem. Tente novamente mais tarde." });
        }
    }

    // Função para deletar uma vantagem
    async deleteVantagem(req, res) {
        try {
            const { id } = req.params;
            const vantagemDeletada = await VantagemService.deleteVantagem(id);
            if (vantagemDeletada) {
                res.status(200).json({ message: `Vantagem com ID ${id} deletada com sucesso.` });
            } else {
                res.status(404).json({ message: `Vantagem com ID ${id} não encontrada.` });
            }
        } catch (error) {
            console.error("Erro ao deletar vantagem:", error.message);
            res.status(500).json({ message: "Não foi possível deletar a vantagem. Tente novamente mais tarde." });
        }
    }
}

export default new VantagemController();
