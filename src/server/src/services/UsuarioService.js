import { prismaClient } from "../database/prismaClient.js";

export class UsuarioService {
    async getAll() {
        try {
            const usuarios = await prismaClient.usuario.findMany({
                include: {
                  aluno: true,  // Inclui a relação com alunos
                  professor: true,  // Inclui a relação com professores
                  empresa: true,  // Inclui a relação com empresas parceiras
                }
              });
              
            return usuarios;
        } catch (error) {
            throw new Error("Erro ao buscar usuários: " + error.message);
        }
    }


    async getById(id) {
        try {
            const usuario = await prismaClient.usuario.findUnique({
                where: {
                    idusuario: parseInt(id)
                },
            });

            if (!usuario) {
                throw new Error("Usuário não encontrado");
            }

            return usuario;
        } catch (error) {
            throw new Error("Erro ao buscar usuário: " + error.message);
        }
    }


    async createUser(userData) {
        try {
            if (!userData.nome || !userData.email || !userData.senha) {
                throw new Error("Dados de usuário incompletos. Certifique-se de que nome, email e senha estão preenchidos.");
            }

            const usuario = await prismaClient.usuario.create({
                data: {
                    nome: userData.nome,
                    email: userData.email,
                    senha: userData.senha
                }
            });

            return usuario;
        } catch (error) {
            throw new Error("Erro ao cadastrar usuário: " + error.message);
        }
    }


    async updateUser(userId, userData) {
        try {
            const usuarioAtualizado = await prismaClient.usuario.update({
                where: {
                    idusuario: parseInt(userId)
                },
                data: {
                    nome: userData.nome,
                    email: userData.email,
                    senha: userData.senha
                }
            });
            return usuarioAtualizado;
        } catch (error) {
            throw new Error("Erro ao atualizar usuário: " + error.message);
        }
    }


    async deleteUser(id) {
        try {
            const usuarioDeletado = await prismaClient.usuario.delete({
                where: {
                    idusuario: parseInt(id)
                },
            });
            if (!usuarioDeletado) throw new Error("Usuário não encontrado");
            return usuarioDeletado;
        } catch (error) {
            throw new Error("Erro ao deletar usuário: " + error.message);
        }
    }


}

export default new UsuarioService();