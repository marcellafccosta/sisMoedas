import React, { useEffect, useState } from "react";
import { Table, Card, Button } from 'antd';
import { useParams, Link } from 'react-router-dom';
import AppHeader from "../components/Header";
import "../styles/Extrato.css";

const Extrato = () => {
    const { idUsuario } = useParams(); 
    const [transacoes, setTransacoes] = useState([]); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 
    const [saldoMoedas, setSaldoMoedas] = useState(0);
    const [nomeUsuario, setNomeUsuario] = useState("");
    const [isAluno, setIsAluno] = useState(null); 

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/usuario/${idUsuario}`);
                if (response.ok) {
                    const data = await response.json();
                    setNomeUsuario(data.nome);
                    
                    if (data.aluno && data.aluno.length > 0) {
                        setSaldoMoedas(data.aluno[0].saldomoedas || 0);
                        setIsAluno(true); 
                    } else if (data.professor && data.professor.length > 0) {
                        setSaldoMoedas(data.professor[0].saldomoedas || 0);
                        setIsAluno(false); 
                    }
                } else {
                    setError('Erro ao buscar dados do perfil');
                }
            } catch (error) {
                setError('Erro na requisição');
                console.error("Erro ao buscar dados do perfil:", error);
            } finally {
                setLoading(false);
            }
        };

        if (idUsuario) {
            fetchProfileData();
        }
    }, [idUsuario]);

    useEffect(() => {
        const fetchTransacoes = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/transacao/usuario/${idUsuario}`);
                if (!response.ok) {
                    throw new Error('Erro ao buscar transações');
                }
                const data = await response.json();
                console.log("Dados das transações:", data); 

                if (Array.isArray(data)) {
                    const transacoesFiltradas = data.filter(transacao => 
                        (isAluno === true && transacao.tipo === 'RecebimentoMoedas') || 
                        (isAluno === false && transacao.tipo === 'EnvioMoedas')
                    );
                    setTransacoes(transacoesFiltradas);
                } else {
                    throw new Error('Formato inesperado de dados de transações');
                }
            } catch (err) {
                setError(err.message);
                console.error("Erro ao buscar transações:", err);
            }
        };

        if (isAluno !== null) {
            fetchTransacoes();
        }
    }, [idUsuario, isAluno]);

    if (loading) {
        return <div>Carregando...</div>; 
    }

    const columns = [
        {
            title: 'Tipo',
            dataIndex: 'tipo',
            key: 'tipo',
        },
        {
            title: 'Quantidade',
            dataIndex: 'quantidade',
            key: 'quantidade',
        },
        {
            title: 'Data',
            dataIndex: 'data',
            key: 'data',
            render: (text) => {
                try {
                    return new Date(text).toLocaleString();
                } catch {
                    console.warn("Data inválida:", text);
                    return "Data inválida";
                }
            },
        },
        {
            title: 'Motivo',
            dataIndex: 'motivo',
            key: 'motivo',
        },
    ];

    return (
        <>
            <AppHeader />
            <div className="extrato-container">
                <Card title={`Extrato de ${nomeUsuario}`} bordered className="extrato-card">
                    <div className="saldo">
                        <p><strong>Saldo de Moedas:</strong> {saldoMoedas} moedas</p>
                    </div>
                    {!isAluno && (
                        <div className="button-container">
                            <Link to={`/transacao/${idUsuario}`}>
                                <Button type="primary">Realizar Transação</Button>
                            </Link>
                        </div>
                    )}
                    <Table
                        dataSource={transacoes}
                        columns={columns}
                        rowKey="idtransacao"
                        locale={{ emptyText: 'Nenhuma transação encontrada.' }}
                        className="transacoes-table"
                    />
                    {error && (
                        <div className="error-message">
                            <p>Erro ao buscar transações: {error}</p>
                        </div>
                    )}
                </Card>
            </div>
        </>
    );
};

export default Extrato;
