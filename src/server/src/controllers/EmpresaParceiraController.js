import EmpresaParceiraService from '../services/EmpresaParceiraService.js';
import express from "express";

export class EmpresaParceiraController {
    // Função para buscar todas as empresas parceiras
    async getAll(req, res) {
        try {
            const empresas = await EmpresaParceiraService.getAll();
            res.status(200).json(empresas);
        } catch (error) {
            console.error("Erro ao recuperar as empresas parceiras:", error.message);
            res.status(500).json({ message: "Não foi possível recuperar as empresas parceiras. Tente novamente mais tarde." });
        }
    }

    // Função para buscar uma empresa parceira por ID
    async getById(req, res) {
        try {
            const { id } = req.params;
            if (isNaN(parseInt(id))) {
                return res.status(400).json({ message: 'ID inválido.' });
            }

            const empresa = await EmpresaParceiraService.getById(id);

            if (empresa) {
                res.status(200).json(empresa);
            } else {
                return res.status(404).json({ message: `Empresa parceira com ID ${id} não encontrada.` });
            }
        } catch (error) {
            console.error("Erro ao buscar empresa parceira:", error.message);
            res.status(500).json({ message: 'Não foi possível recuperar a empresa parceira. Tente novamente mais tarde.' });
        }
    }

    // Função para criar uma nova empresa parceira
    async createEmpresaParceira(req, res) {
        try {
            const empresaData = req.body;
            const novaEmpresa = await EmpresaParceiraService.createEmpresaparceira(empresaData);
            res.status(201).json(novaEmpresa);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Função para atualizar uma empresa parceira
    async updateEmpresaParceira(req, res) {
        try {
            const { id } = req.params;
            const empresaData = req.body;

            if (isNaN(parseInt(id))) {
                return res.status(400).json({ message: 'ID inválido.' });
            }

            const empresaAtualizada = await EmpresaParceiraService.updateEmpresaparceira(id, empresaData);

            if (empresaAtualizada) {
                res.status(200).json(empresaAtualizada);
            } else {
                res.status(404).json({ message: `Empresa parceira com ID ${id} não encontrada.` });
            }
        } catch (error) {
            console.error("Erro ao atualizar empresa parceira:", error.message);
            res.status(500).json({ message: 'Não foi possível atualizar a empresa parceira. Tente novamente mais tarde.' });
        }
    }

    // Função para deletar uma empresa parceira
    async deleteEmpresaParceira(req, res) {
        try {
            const { id } = req.params;
            if (isNaN(parseInt(id))) {
                return res.status(400).json({ message: 'ID inválido.' });
            }

            const empresaDeletada = await EmpresaParceiraService.deleteEmpresaParceira(id);

            if (empresaDeletada) {
                res.status(200).json({ message: `Empresa parceira com ID ${id} deletada com sucesso.` });
            } else {
                res.status(404).json({ message: `Empresa parceira com ID ${id} não encontrada.` });
            }
        } catch (error) {
            console.error("Erro ao deletar empresa parceira:", error.message);
            res.status(500).json({ message: 'Não foi possível deletar a empresa parceira. Tente novamente mais tarde.' });
        }
    }
}
