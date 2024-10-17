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
        try {
            const { id } = req.params;

            if (isNaN(id)) {
                return res.status(400).json({ error: "ID inválido" });
            }

            const professor = await ProfessorService.getById(id);

            if (professor) {
                res.status(200).json(professor);
            } else {
                return res.status(404).json({ message: `Professor com ID ${id} não encontrado.` });
            }
        } catch (error) {
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
        try {
            const { id } = req.params;
            const professorData = req.body;

            if (isNaN(id)) {
                return res.status(400).json({ error: "ID inválido" });
            }

            const professorAtualizado = await ProfessorService.updateProfessor(id, professorData);

            if (professorAtualizado) {
                res.status(200).json(professorAtualizado);
            } else {
                return res.status(404).json({ message: `Professor com ID ${id} não encontrado.` });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}