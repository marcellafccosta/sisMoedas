import AlunoService from '../services/AlunoService.js'; // Alterado para uma importação nomeada

import express from "express";

export class AlunoController {
    // Função para buscar todos os alunos
    async getAll(req, res) {
        try {
            const alunos = await AlunoService.getAll();
            console.log("Alunos recuperados:", alunos);  // Adiciona um log para verificar os dados
            res.status(200).json(alunos);
        } catch (error) {
            console.error("Erro ao recuperar os alunos:", error.message);
            res.status(500).json({ message: "Não foi possível recuperar os alunos. Tente novamente mais tarde." });
        }
    }

    // Função para buscar um aluno pelo ID
    async getById(req, res) {
        try {
            const { id } = req.params;

            if (isNaN(parseInt(id))) {
                return res.status(400).json({ message: 'ID inválido.' });
            }

            const aluno = await AlunoService.getById(id);

            if (aluno) {
                res.status(200).json(aluno);
            } else {
                return res.status(404).json({ message: `Aluno com ID ${id} não encontrado.` });
            }
        } catch (error) {
            console.error("Erro ao buscar aluno:", error.message);
            res.status(500).json({ message: 'Não foi possível recuperar o aluno. Tente novamente mais tarde.' });
        }
    }

    // Função para criar um novo aluno
    async createAluno(req, res) {
        try {
            const alunoData = req.body;
            console.log('Dados recebidos para criação:', alunoData);

            const novoAluno = await AlunoService.createAluno(alunoData);
            res.status(201).json(novoAluno);
        } catch (error) {
            console.error("Erro ao cadastrar aluno:", error.message);
            res.status(500).json({ message: 'Não foi possível cadastrar o aluno. Tente novamente mais tarde.' });
        }
    }


     // Função para atualizar um aluno
     async updateAluno(req, res) {
        try {
            const { id } = req.params;
            const alunoData = req.body;

            // Verifica se o ID é um número válido
            if (isNaN(parseInt(id))) {
                return res.status(400).json({ message: 'ID inválido.' });
            }

            console.log('Dados recebidos para atualização:', alunoData);

            const alunoAtualizado = await AlunoService.updateAluno(id, alunoData);

            if (alunoAtualizado) {
                res.status(200).json(alunoAtualizado);
            } else {
                res.status(404).json({ message: `Aluno com ID ${id} não encontrado.` });
            }
        } catch (error) {
            console.error("Erro ao atualizar aluno:", error.message);
            res.status(500).json({ message: 'Não foi possível atualizar o aluno. Tente novamente mais tarde.' });
        }
    }

    // Função para deletar um aluno
    async deleteAluno(req, res) {
        try {
            const { id } = req.params;

            // Verifica se o ID é um número válido
            if (isNaN(parseInt(id))) {
                return res.status(400).json({ message: 'ID inválido.' });
            }

            const alunoDeletado = await AlunoService.deleteAluno(id);

            if (alunoDeletado) {
                res.status(200).json({ message: `Aluno com ID ${id} deletado com sucesso.` });
            } else {
                res.status(404).json({ message: `Aluno com ID ${id} não encontrado.` });
            }
        } catch (error) {
            console.error("Erro ao deletar aluno:", error.message);
            res.status(500).json({ message: 'Não foi possível deletar o aluno. Tente novamente mais tarde.' });
        }
    }
}
