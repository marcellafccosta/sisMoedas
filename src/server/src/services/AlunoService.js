import { prismaClient } from "../database/prismaClient.js";

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
    async getById(id){
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
            console.log('Dados recebidos para criação de aluno:', alunoData); // Verificar dados recebidos
    
            const aluno = await prismaClient.aluno.create({
                data: {
                    cpf: alunoData.cpf,
                    rg: alunoData.rg,
                    curso: alunoData.curso,
                    saldomoedas: alunoData.saldomoedas,
                    usuario: {
                        create: {  // Certifique-se de que o usuário está sendo criado aqui
                            nome: alunoData.nome,
                            email: alunoData.email,
                            senha: alunoData.senha,
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
                }
            });
    
            console.log('Aluno e usuário criados com sucesso:', aluno); // Log para confirmar criação
            return aluno;
    
        } catch (error) {
            console.error("Erro ao cadastrar aluno:", error.message); // Log de erro
            throw new Error("Erro ao cadastrar aluno: " + error.message);
        }
    }
    
    

    // Atualiza um aluno existente e seu endereço associado
   // Atualiza um aluno existente e seu endereço associado
async updateAluno(alunoId, alunoData) {
    try {
        const updatedAluno = await prismaClient.aluno.update({
            where: { idaluno: parseInt(alunoId) },
            data: {
                cpf: alunoData.cpf,
                rg: alunoData.rg,
                curso: alunoData.curso,
                saldomoedas: alunoData.saldomoedas,
                usuario: {
                    connect: { idusuario: alunoData.usuario_id },  // Conectar o usuário
                },
                endereco: {
                    update: {
                        logradouro: alunoData.endereco.logradouro,
                        bairro: alunoData.endereco.bairro,
                        cidade: alunoData.endereco.cidade,
                        estado: alunoData.endereco.estado,
                        numero: alunoData.endereco.numero,
                        complemento: alunoData.endereco.complemento,
                        cep: alunoData.endereco.cep,
                    },
                },
            },
            include: {  // Inclui os dados completos de usuário e endereço no retorno
                endereco: true,
                usuario: true,
            },
        });
        if (!updatedAluno) {
            throw new Error("Aluno não encontrado");
        }
        return updatedAluno;
    } catch (error) {
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
