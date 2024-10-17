import { prismaClient } from "../database/prismaClient.js";

export class EmpresaParceiraService {
    // Busca todas as empresas parceiras
    async getAll() {
        try {
            const empresas = await prismaClient.empresaparceira.findMany({
                include: {
                    usuario: true,  // Inclui o usuário relacionado
                    vantagem: true  // Inclui as vantagens relacionadas
                }
            });
            return empresas;
        } catch (error) {
            console.error("Erro ao buscar empresas parceiras:", error.message);
            throw new Error("Erro ao buscar empresas parceiras: " + error.message);
        }
    }

    // Busca uma empresa parceira por ID
    async getById(id) {
        try {
            const empresa = await prismaClient.empresaparceira.findUnique({
                where: { idempresa: parseInt(id) },
                include: {
                    usuario: true,
                    vantagem: true
                }
            });
            if (!empresa) {
                throw new Error("Empresa parceira não encontrada");
            }
            return empresa;
        } catch (error) {
            console.error("Erro ao buscar empresa parceira:", error.message);
            throw new Error("Erro ao buscar empresa parceira: " + error.message);
        }
    }

    // Cria uma nova empresa parceira
    async createEmpresaparceira(empresaData) {
        try {
            const empresa = await prismaClient.empresaparceira.create({
                data: {
                    cnpj: empresaData.cnpj,
                    usuario: {
                        create: {  // Criar o usuário junto com os dados de empresa
                            nome: empresaData.nome,   // Nome está sendo corretamente lido do corpo
                            email: empresaData.email, // E-mail está sendo corretamente lido do corpo
                            senha: empresaData.senha  // Senha está sendo corretamente lida do corpo
                        }
                    }
                }
            });
            return empresa;
        } catch (error) {
            console.error("Erro ao cadastrar empresa parceira:", error.message);
            throw new Error("Erro ao cadastrar empresa parceira: " + error.message);
        }
    }

    // Atualiza uma empresa parceira
    async updateEmpresaparceira(empresaId, empresaData) {
        try {
            const updatedEmpresa = await prismaClient.empresaparceira.update({
                where: { idempresa: parseInt(empresaId) },
                data: {
                    cnpj: empresaData.cnpj,
                    usuario: {
                        update: {
                            nome: empresaData.nome,
                            email: empresaData.email,
                            senha: empresaData.senha
                        }
                    }
                },
                include: {
                    usuario: true,
                    vantagem: true
                }
            });
            if (!updatedEmpresa) {
                throw new Error("Empresa parceira não encontrada");
            }
            return updatedEmpresa;
        } catch (error) {
            console.error("Erro ao atualizar empresa parceira:", error.message);
            throw new Error("Erro ao atualizar empresa parceira: " + error.message);
        }
    }

    // Deleta uma empresa parceira
    async deleteEmpresaParceira(id) {
        try {
            // Verifica se a empresa parceira existe e inclui o usuário associado
            const empresa = await prismaClient.empresaparceira.findUnique({
                where: { idempresa: parseInt(id) },
                include: {
                    usuario: true  // Inclui o relacionamento com o usuário
                }
            });
    
            if (!empresa) {
                throw new Error("Empresa parceira não encontrada");
            }
    
            // Exclui todas as vantagens associadas à empresa parceira
            await prismaClient.vantagem.deleteMany({
                where: { empresaparceira_id: parseInt(id) },
            });
    
            // Exclui a empresa parceira e o usuário relacionado
            const deletedEmpresa = await prismaClient.empresaparceira.delete({
                where: { idempresa: parseInt(id) }
            });
    
            // Exclui o usuário associado
            await prismaClient.usuario.delete({
                where: { idusuario: empresa.usuario_id }  // Deleta o usuário associado à empresa parceira
            });
    
            return deletedEmpresa;
        } catch (error) {
            throw new Error("Erro ao deletar empresa parceira: " + error.message);
        }
    }
    
    
    
}

export default new EmpresaParceiraService();
