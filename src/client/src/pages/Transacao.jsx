import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Transacao = () => {
  const [usuarios, setUsuarios] = useState({}); // Alterado para objeto
  const [alunos, setAlunos] = useState([]);
  const [formData, setFormData] = useState({
    tipoTransacao: 'Envio',
    usuarioId: '',
    quantidade: 0,
    motivo: ''
  });
  const [saldoProfessor, setSaldoProfessor] = useState(1000); // Saldo inicial do professor
  const [mensagem, setMensagem] = useState('');
  
  const professorIdFixo = 1; // ID fixo do professor

  useEffect(() => {
    const fetchAlunos = async () => {
      try {
        const responseAlunos = await axios.get('http://localhost:3000/api/aluno/');
        setAlunos(responseAlunos.data);

        const usuariosMap = {};
        for (const aluno of responseAlunos.data) {
          const responseUsuario = await axios.get(`http://localhost:3000/api/usuario/${aluno.usuario_id}`);
          usuariosMap[responseUsuario.data.idusuario] = responseUsuario.data.nome;
        }
        setUsuarios(usuariosMap);
      } catch (error) {
        console.error('Erro ao buscar alunos e usuários:', error);
        setMensagem('Erro ao buscar alunos e usuários.');
      }
    };

    fetchAlunos();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'quantidade' ? Math.max(0, parseInt(value, 10)) || 0 : value });
  };

  const realizarTransacao = async (e) => {
    e.preventDefault();

    const quantidade = formData.quantidade;

    if (quantidade <= 0) {
        setMensagem('A quantidade deve ser maior que zero.');
        return;
    }

    if (quantidade > saldoProfessor) {
        setMensagem('Saldo insuficiente para realizar a transação.');
        return;
    }

    const usuarioSelecionado = alunos.find(aluno => aluno.usuario_id === parseInt(formData.usuarioId));

    if (!usuarioSelecionado) {
        setMensagem('Selecione um usuário válido.');
        return;
    }

    const novaTransacao = {
        tipo: "EnvioMoedas", // Atualizado para o valor correto
        quantidade: quantidade,
        data: new Date().toISOString(), // Usar toISOString para formatar a data
        aluno_id: usuarioSelecionado.idaluno, // ID do aluno
        professor_id: professorIdFixo, // ID do professor fixo
        motivo: formData.motivo,
    };

    try {
        // Enviar a transação para o backend
        await axios.post('http://localhost:3000/api/transacao/', novaTransacao);

        // Atualizar o saldo do professor no backend
        await axios.put(`http://localhost:3000/api/professor/saldomoedas/${professorIdFixo}`, {
            quantidade: quantidade
        });

        // Atualizar o saldo do aluno no backend
        await axios.put(`http://localhost:3000/api/aluno/saldomoedas/${usuarioSelecionado.idaluno}`, {
            quantidade: quantidade
        });

        // Atualizar o saldo localmente no frontend
        setSaldoProfessor(prevSaldo => prevSaldo - quantidade);

        setMensagem(`Transação realizada: Envio de ${quantidade} moedas para o Aluno: ${usuarios[usuarioSelecionado.usuario_id]}.`);

        // Resetar o formulário
        setFormData({ tipoTransacao: 'Envio', usuarioId: '', quantidade: 0, motivo: '' });
    } catch (error) {
        console.error('Erro ao realizar a transação:', error);
        setMensagem('Erro ao realizar a transação. Tente novamente.');
    }
};


  return (
    <div className="transacao">
      <h1>Realizar Transação</h1>
      <form onSubmit={realizarTransacao}>
        <label htmlFor="tipoTransacao">Tipo de Transação:</label>
        <select
          name="tipoTransacao"
          value={formData.tipoTransacao}
          onChange={handleInputChange}
        >
          <option value="Envio">Envio de Moedas</option>
        </select>

        <label htmlFor="usuarioId">Para qual usuário?</label>
        <select
          name="usuarioId"
          value={formData.usuarioId}
          onChange={handleInputChange}
        >
          <option value="">Selecione um aluno</option>
          {alunos.length > 0 ? (
            alunos.map(aluno => (
              <option key={aluno.idaluno} value={aluno.usuario_id}>
                {usuarios[aluno.usuario_id] || 'Usuário não encontrado'} (ID: {aluno.idaluno})
              </option>
            ))
          ) : (
            <option value="">Nenhum aluno disponível</option>
          )}
        </select>

        <label htmlFor="quantidade">Quantidade de Moedas:</label>
        <input
          type="number"
          name="quantidade"
          value={formData.quantidade}
          onChange={handleInputChange}
          min="1"
          required
        />

        <label htmlFor="motivo">Motivo:</label>
        <input
          type="text"
          name="motivo"
          value={formData.motivo}
          onChange={handleInputChange}
        />

        <button type="submit">Enviar Moedas</button>
      </form>

      {mensagem && <p>{mensagem}</p>}

      <p>Saldo disponível: {saldoProfessor} moedas</p>
    </div>
  );
};

export default Transacao;
