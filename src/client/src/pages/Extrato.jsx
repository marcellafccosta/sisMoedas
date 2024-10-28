import React, { useEffect, useState } from "react";
import { Descriptions, Card, Button } from 'antd';
import { useParams, Link } from 'react-router-dom';

const Extrato = () => {
    const { idUsuario } = useParams(); // Captura o ID do usuário da URL
    console.log("ID do Usuário:", idUsuario); // Verifica se o ID é capturado corretamente
    const [transacoes, setTransacoes] = useState([]); // Estado para armazenar as transações
    const [loading, setLoading] = useState(true); // Estado de carregamento
    const [error, setError] = useState(null); // Estado para erros

    useEffect(() => {
        const fetchTransacoes = async () => {
            if (!idUsuario) {
                setError('ID do usuário não fornecido.');
                setLoading(false);
                return;
            }
            console.log("Buscando transações para ID:", idUsuario);
            try {
                const response = await fetch(`http://localhost:3000/api/transacao/usuario/${idUsuario}`);
                if (!response.ok) {
                    throw new Error('Erro ao buscar transações');
                }
                const data = await response.json();
                setTransacoes(data); // Armazena as transações no estado
            } catch (err) {
                setError(err.message); // Armazena mensagem de erro
            } finally {
                setLoading(false); // Atualiza estado de carregamento
            }
        };

        fetchTransacoes(); // Chama a função para buscar transações
    }, [idUsuario]); // Re-executa o efeito se o ID mudar

    // Renderiza o componente
    if (loading) {
        return <div>Carregando...</div>; // Mensagem de carregamento
    }

    if (error) {
        return <div>Erro: {error}</div>; // Mensagem de erro
    }

    return (
        <div className="extrato-container">
            <Card title={`Extrato do Usuário ${idUsuario}`} bordered>
                <Link to={`/transacao/${idUsuario}`}>
                    <Button type="primary" style={{ marginBottom: '20px' }}>
                        Realizar Transação
                    </Button>
                </Link>
                <Descriptions bordered column={1}>
                    {transacoes.length === 0 ? (
                        <Descriptions.Item label="Transações">Nenhuma transação encontrada.</Descriptions.Item>
                    ) : (
                        transacoes.map(transacao => (
                            <Descriptions.Item key={transacao.idtransacao} label={`Transação ID: ${transacao.idtransacao}`}>
                                <p><strong>Tipo:</strong> {transacao.tipo}</p>
                                <p><strong>Quantidade:</strong> {transacao.quantidade}</p>
                                <p><strong>Data:</strong> {new Date(transacao.data).toLocaleString()}</p>
                                <p><strong>Motivo:</strong> {transacao.motivo}</p>
                                <hr />
                            </Descriptions.Item>
                        ))
                    )}
                </Descriptions>
            </Card>
        </div>
    );
};

export default Extrato;
