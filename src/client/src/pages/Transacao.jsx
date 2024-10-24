import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { message } from 'antd'; // Import message from Ant Design
import '../styles/Transacao.css'; // Import your CSS file

const Transacao = () => {
  const [usuarios, setUsuarios] = useState({});
  const [alunos, setAlunos] = useState([]);
  const [formData, setFormData] = useState({
    usuarioId: '',
    quantidade: 0,
    motivo: ''
  });
  const [saldoProfessor, setSaldoProfessor] = useState(0);
  const [mensagem, setMensagem] = useState('');
  
  const professorIdFixo = 1;
  const [messageApi, contextHolder] = message.useMessage(); // Initialize message API

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

    const fetchSaldoProfessor = async () => {
      try {
        const responseProfessor = await axios.get(`http://localhost:3000/api/professor/${professorIdFixo}`);
        setSaldoProfessor(responseProfessor.data.saldomoedas);
      } catch (error) {
        console.error('Erro ao buscar saldo do professor:', error);
        setMensagem('Erro ao buscar saldo do professor.');
      }
    };

    fetchAlunos();
    fetchSaldoProfessor();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'quantidade' ? Math.max(0, parseInt(value, 10)) || 0 : value });
  };

  const realizarTransacao = async (e) => {
    e.preventDefault();

    const quantidade = formData.quantidade;

    if (quantidade <= 0) {
      message.error('A quantidade deve ser maior que zero.');
      return;
    }

    if (quantidade > saldoProfessor) {
      message.error('Saldo insuficiente para realizar a transação.');
      return;
    }

    const usuarioSelecionado = alunos.find(aluno => aluno.usuario_id === parseInt(formData.usuarioId));

    if (!usuarioSelecionado) {
      message.error('Selecione um usuário válido.');
      return;
    }

    const novaTransacao = {
      tipo: "EnvioMoedas",
      quantidade: quantidade,
      data: new Date().toISOString(),
      aluno_id: usuarioSelecionado.idaluno,
      professor_id: professorIdFixo,
      motivo: formData.motivo,
    };

    try {
      await axios.post('http://localhost:3000/api/transacao/', novaTransacao);
      const responseAluno = await axios.get(`http://localhost:3000/api/aluno/${usuarioSelecionado.idaluno}`);
      const saldoAtualAluno = responseAluno.data.saldomoedas || 0;

      await axios.put(`http://localhost:3000/api/professor/${professorIdFixo}`, {
        saldomoedas: saldoProfessor - quantidade
      });

      await axios.put(`http://localhost:3000/api/aluno/${usuarioSelecionado.idaluno}`, {
        saldomoedas: saldoAtualAluno + quantidade
      });

      setSaldoProfessor(prevSaldo => prevSaldo - quantidade);
      message.success(`Transação realizada: Envio de ${quantidade} moedas para o Aluno: ${usuarios[usuarioSelecionado.usuario_id]}.`);
      
      setFormData({ usuarioId: '', quantidade: 0, motivo: '' });
      
      // Redirect to extrato page
      window.location.href = 'http://localhost:5173/extrato';
      
    } catch (error) {
      console.error('Erro ao realizar a transação:', error);
      message.error('Erro ao realizar a transação. Tente novamente.');
    }
  };

  return (
    <div className="transacao">
      {contextHolder} {/* Ensure this is here */}
      <div className="transacao-form">
        <h1 className="transacao-title">Realizar Transação</h1>
        <form onSubmit={realizarTransacao}>
          <label htmlFor="usuarioId">Para qual usuário?</label>
          <select
            name="usuarioId"
            value={formData.usuarioId}
            onChange={handleInputChange}
            className="select-usuario"
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
            type="text" 
            name="quantidade"
            value={formData.quantidade}
            onChange={handleInputChange}
            inputMode="numeric" 
            pattern="[0-9]*" 
            required
          />

          <label htmlFor="motivo">Motivo:</label>
          <textarea
            name="motivo"
            value={formData.motivo}
            onChange={handleInputChange}
            rows="4" 
            required
          />

          <button type="submit" className="ant-btn custom-button">Enviar Moedas</button>
        </form>

        {mensagem && <p className="mensagem">{mensagem}</p>}
        <p>Saldo disponível: {saldoProfessor} moedas</p>
      </div>
    </div>
  );
};

export default Transacao;
