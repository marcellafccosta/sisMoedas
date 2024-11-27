import VantagemService from '../services/VantagemService.js';
import TransacaoService from '../services/TransacaoService.js';
import AlunoService from '../services/AlunoService.js'; // Para obter dados do aluno
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
    
            // Verifica se o customoedas está presente e tenta convertê-lo para float
            if (vantagemData.customoedas) {
                vantagemData.customoedas = parseFloat(vantagemData.customoedas);
            }
    
            // Verifica se a conversão foi bem-sucedida
            if (isNaN(vantagemData.customoedas)) {
                return res.status(400).json({ message: "O custo em moedas deve ser um número válido." });
            }
    
            // Verifica se o idempresa está presente e tenta convertê-lo para inteiro
            if (vantagemData.empresaparceira_id) {
                vantagemData.empresaparceira_id = parseInt(vantagemData.empresaparceira_id, 10);
            }
    
            // Verifica se a conversão foi bem-sucedida
            if (isNaN(vantagemData.empresaparceira_id)) {
                return res.status(400).json({ message: "O ID da empresa parceira deve ser um número válido." });
            }
    
            // Verifica se um arquivo de imagem foi enviado e adiciona o caminho ao objeto vantagemData
            if (req.file) {
                vantagemData.foto = req.file.path; // Caminho do arquivo salvo pelo multer
            }
    
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

    async trocarVantagem(req, res) {
        try {
            const { idVantagem, idAluno } = req.body;

            // Verifica se o usuário logado é um aluno
            const aluno = await AlunoService.getById(idAluno);
            if (!aluno) {
                return res.status(403).json({ message: "Apenas alunos podem trocar vantagens." });
            }

            // Busca a vantagem e verifica o custo
            const vantagem = await VantagemService.getById(idVantagem);
            if (!vantagem) {
                return res.status(404).json({ message: "Vantagem não encontrada." });
            }

            // Verifica se o aluno tem saldo suficiente
            if (aluno.saldomoedas < vantagem.customoedas) {
                return res.status(400).json({ message: "Saldo insuficiente para realizar a troca." });
            }

            // Desconta o saldo do aluno e atualiza a transação
            aluno.saldomoedas -= vantagem.customoedas;
            await AlunoService.updateSaldo(idAluno, aluno.saldomoedas); // Função para atualizar o saldo do aluno

            // Cria uma nova transação de troca
            await TransacaoService.createTransacao({
                tipo: "TrocaMoedas",
                quantidade: -vantagem.customoedas,
                data: new Date(),
                aluno_id: idAluno,
                usuario_id: aluno.usuario_id,
                motivo: `Troca pela vantagem: ${vantagem.descricao}`
            });

            res.status(200).json({ message: "Vantagem trocada com sucesso.", saldoAtual: aluno.saldomoedas });
        } catch (error) {
            console.error("Erro ao trocar vantagem:", error.message);
            res.status(500).json({ message: "Não foi possível realizar a troca. Tente novamente mais tarde." });
        }
    }
}

export default new VantagemController();
