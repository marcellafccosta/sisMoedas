import { prismaClient } from "../database/prismaClient.js";
const SALT_ROUNDS = 10;
import bcrypt from 'bcrypt';
export class AlunoService {
    // Busca todos os alunos, incluindo endereço e usuário
    async getAll() {
        try {
            const alunos = await prismaClient.aluno.findMany({
                include: {
                    endereco: true,
                    usuario: true,
                }
            });
            return alunos;
        } catch (error) {
            console.error("Erro ao buscar alunos:", error.message); // Adicione um log
            throw new Error("Erro ao buscar alunos: " + error.message);
        }
    }

    // Busca um aluno por ID, incluindo o relacionamento com endereço e usuário
    async getById(id) {
        try {
            const aluno = await prismaClient.aluno.findUnique({
                where: { idaluno: parseInt(id) },
                include: {
                    endereco: true,
                    usuario: true,
                }
            });
            if (!aluno) {
                throw new Error("Aluno não encontrado");
            }
            return aluno;
        } catch (error) {
            throw new Error("Erro ao buscar aluno: " + error.message);
        }
    }

    // Cria um novo aluno e conecta ou cria um endereço associado
    async createAluno(alunoData) {
        try {
            if (!alunoData.usuario || !alunoData.usuario.nome || !alunoData.usuario.email || !alunoData.usuario.senha) {
                throw new Error("Dados de usuário incompletos para o cadastro do aluno.");
            }
            console.log('Dados recebidos para criação de aluno:', alunoData); // Verificar dados recebidos
    
            // Criptografa a senha antes de salvar no banco de dados
            const senhaCriptografada = await bcrypt.hash(alunoData.usuario.senha, SALT_ROUNDS);
    
            const aluno = await prismaClient.aluno.create({
                data: {
                    cpf: alunoData.cpf,
                    rg: alunoData.rg,
                    curso: alunoData.curso,
                    saldomoedas: alunoData.saldomoedas || 0,
                    usuario: {
                        create: {  
                            nome: alunoData.usuario.nome,
                            email: alunoData.usuario.email,
                            senha: senhaCriptografada, // Salva a senha criptografada
                        }
                    },
                    endereco: {
                        create: {
                            logradouro: alunoData.endereco.logradouro,
                            bairro: alunoData.endereco.bairro,
                            cidade: alunoData.endereco.cidade,
                            estado: alunoData.endereco.estado,
                            numero: alunoData.endereco.numero,
                            complemento: alunoData.endereco.complemento,
                            cep: alunoData.endereco.cep,
                        }
                    }
                },
                include: {  // Inclui os dados completos de endereço e usuário no retorno
                    endereco: true,
                    usuario: true,
                }
            });
    
            console.log('Aluno e usuário criados com sucesso:', aluno); // Log para confirmar criação
            return aluno;
    
        } catch (error) {
            console.error("Erro ao cadastrar aluno:", error.message); // Log de erro
            throw new Error("Erro ao cadastrar aluno: " + error.message);
        }
    }


    async updateAluno(alunoId, alunoData) {
        try {
            // Verificar se o aluno existe
            const alunoExistente = await prismaClient.aluno.findUnique({
                where: { idaluno: parseInt(alunoId) },
                include: {
                    usuario: true,
                    endereco: true
                }
            });
    
            if (!alunoExistente) {
                throw new Error("Aluno não encontrado");
            }
    
            // Preparando os dados atualizados com valores condicionais para cada campo
            const dadosAtualizados = {
                cpf: alunoData.cpf !== undefined ? alunoData.cpf : alunoExistente.cpf,
                rg: alunoData.rg !== undefined ? alunoData.rg : alunoExistente.rg,
                curso: alunoData.curso !== undefined ? alunoData.curso : alunoExistente.curso,
                saldomoedas: alunoData.saldomoedas !== undefined ? alunoData.saldomoedas : alunoExistente.saldomoedas,
                usuario: alunoData.usuario_id ? { connect: { idusuario: alunoData.usuario_id } } : undefined,
                endereco: alunoData.endereco ? {
                    update: {
                        logradouro: alunoData.endereco.logradouro || alunoExistente.endereco.logradouro,
                        bairro: alunoData.endereco.bairro || alunoExistente.endereco.bairro,
                        cidade: alunoData.endereco.cidade || alunoExistente.endereco.cidade,
                        estado: alunoData.endereco.estado || alunoExistente.endereco.estado,
                        numero: alunoData.endereco.numero !== undefined ? parseInt(alunoData.endereco.numero, 10) : alunoExistente.endereco.numero,
                        complemento: alunoData.endereco.complemento || alunoExistente.endereco.complemento,
                        cep: alunoData.endereco.cep || alunoExistente.endereco.cep,
                    }
                } : undefined,
            };
    
            // Removendo campos `undefined` para evitar erros
            Object.keys(dadosAtualizados).forEach(key => {
                if (dadosAtualizados[key] === undefined) delete dadosAtualizados[key];
            });
    
            // Atualizando dados do aluno
            const alunoAtualizado = await prismaClient.aluno.update({
                where: { idaluno: parseInt(alunoId) },
                data: dadosAtualizados,
                include: {
                    endereco: true,
                    usuario: true,
                },
            });
    
            return alunoAtualizado;
        } catch (error) {
            console.error("Erro ao atualizar aluno: ", error.message);
            throw new Error("Erro ao atualizar aluno: " + error.message);
        }
    }
    

    // Deleta um aluno pelo ID
    async deleteAluno(id) {
        try {
            // Verifique se o aluno existe
            const aluno = await prismaClient.aluno.findUnique({
                where: { idaluno: parseInt(id) },
                include: { usuario: true } // Inclua o usuário para deletá-lo
            });

            if (!aluno) {
                throw new Error("Aluno não encontrado");
            }

            // Primeiro, delete o aluno
            const deletedAluno = await prismaClient.aluno.delete({
                where: { idaluno: parseInt(id) }
            });

            // Agora, delete o usuário associado
            await prismaClient.usuario.delete({
                where: { idusuario: aluno.usuario_id }
            });

            return deletedAluno;
        } catch (error) {
            throw new Error("Erro ao deletar aluno: " + error.message);
        }
    }

}


export default new AlunoService();
