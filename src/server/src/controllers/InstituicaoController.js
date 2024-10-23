import InstituicaoService from '../services/InstituicaoService.js';

export class InstituicaoController {
    // Função para buscar todas as instituições
    async getAll(req, res) {
        try {
            const instituicoes = await InstituicaoService.getAll();
            res.status(200).json(instituicoes);
        } catch (error) {
            console.error("Erro ao recuperar as instituições:", error.message);
            res.status(500).json({ message: "Não foi possível recuperar as instituições. Tente novamente mais tarde." });
        }
    }

    // Função para buscar uma instituição pelo ID
    async getById(req, res) {
        try {
            const { id } = req.params;

            if (isNaN(parseInt(id))) {
                return res.status(400).json({ message: 'ID inválido.' });
            }

            const instituicao = await InstituicaoService.getById(id);

            if (instituicao) {
                res.status(200).json(instituicao);
            } else {
                return res.status(404).json({ message: `Instituição com ID ${id} não encontrada.` });
            }
        } catch (error) {
            console.error("Erro ao buscar instituição:", error.message);
            res.status(500).json({ message: 'Não foi possível recuperar a instituição. Tente novamente mais tarde.' });
        }
    }

    // Função para criar uma nova instituição
    async createInstituicao(req, res) {
        try {
            const instituicaoData = req.body;
            const novaInstituicao = await InstituicaoService.createInstituicao(instituicaoData);
            res.status(201).json(novaInstituicao);
        } catch (error) {
            console.error("Erro ao cadastrar instituição:", error.message);
            res.status(500).json({ message: 'Não foi possível cadastrar a instituição. Tente novamente mais tarde.' });
        }
    }

    // Função para atualizar uma instituição existente
    async updateInstituicao(req, res) {
        try {
            const { id } = req.params;
            const instituicaoData = req.body;

            const instituicaoAtualizada = await InstituicaoService.updateInstituicao(id, instituicaoData);

            if (instituicaoAtualizada) {
                res.status(200).json(instituicaoAtualizada);
            } else {
                res.status(404).json({ message: `Instituição com ID ${id} não encontrada.` });
            }
        } catch (error) {
            console.error("Erro ao atualizar instituição:", error.message);
            res.status(500).json({ message: 'Não foi possível atualizar a instituição. Tente novamente mais tarde.' });
        }
    }

    // Função para deletar uma instituição
    async deleteInstituicao(req, res) {
        try {
            const { id } = req.params;

            if (isNaN(parseInt(id))) {
                return res.status(400).json({ message: 'ID inválido.' });
            }

            const instituicaoDeletada = await InstituicaoService.deleteInstituicao(id);

            if (instituicaoDeletada) {
                res.status(200).json({ message: `Instituição com ID ${id} deletada com sucesso.` });
            } else {
                res.status(404).json({ message: `Instituição com ID ${id} não encontrada.` });
            }
        } catch (error) {
            console.error("Erro ao deletar instituição:", error.message);
            res.status(500).json({ message: 'Não foi possível deletar a instituição. Tente novamente mais tarde.' });
        }
    }
}
