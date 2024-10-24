import ProfessorService from "../services/ProfessorService.js";
import express from "express";

export class ProfessorController {
    async getAll(req, res) {
        try {
            const professores = await ProfessorService.getAll();
            res.status(200).json(professores);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getById(req, res) {
        const { id } = req.params; // Obter o ID da requisição
        try {
            const { id } = req.params;

            if (isNaN(parseInt(id))) {
                return res.status(400).json({ message: "ID inválido" });
            }

            const professor = await ProfessorService.getById(id);
            res.status(200).json(professor);
        } catch (error) {
            console.error('Erro ao buscar professor: ', error.message);
            res.status(500).json({ error: error.message });
        }
    }

    async createProfessor(req, res) {
        try {
            const professorData = req.body;
            const novoProfessor = await ProfessorService.createProfessor(professorData);
            res.status(201).json(novoProfessor);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateProfessor(req, res) {
        const { id } = req.params;
        const professorData = req.body;

        if (isNaN(id)) {
            return res.status(400).json({ error: "ID inválido" });
        }

        try {
            const professorAtualizado = await ProfessorService.updateProfessor(id, professorData);
            if (professorAtualizado) {
                res.status(200).json(professorAtualizado);
            } else {
                return res.status(404).json({ message: `Professor com ID ${id} não encontrado.` });
            }
        } catch (error) {
            console.error('Erro ao atualizar professor:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async deleteProfessor(req, res) {
        const { id } = req.params;
        try {
            const deletedProfessor = await ProfessorService.deleteProfessor(id);
            res.status(200).json(deletedProfessor);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default new ProfessorController();
