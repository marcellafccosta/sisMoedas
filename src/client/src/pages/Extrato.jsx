import React, { useState, useEffect } from "react";
import { Table, Card, Row, Col, Button } from 'antd';
import "../styles/Extrato.css";
import { useNavigate } from 'react-router-dom';
import AppHeader from "../components/Header";
const Extrato = () => {
    const navigate = useNavigate();
    const [transacoes, setTransacoes] = useState([]);
    const [saldo, setSaldo] = useState(0);

    useEffect(() => {
        const transacoesMock = [
            { key: '1', tipo: 'Crédito', quantidade: 50, data: '2024-10-20', descricao: 'Recebimento de Moedas' },
            { key: '2', tipo: 'Débito', quantidade: 20, data: '2024-10-22', descricao: 'Troca por Recompensa' },
            { key: '3', tipo: 'Débito', quantidade: 10, data: '2024-10-23', descricao: 'Envio de Moedas' },
        ];
        setTransacoes(transacoesMock);

        const saldoAtual = transacoesMock.reduce((acc, transacao) => {
            return transacao.tipo === 'Crédito' ? acc + transacao.quantidade : acc - transacao.quantidade;
        }, 0);

        setSaldo(saldoAtual);
    }, []);

    const columns = [
        {
            title: 'Descrição',
            dataIndex: 'descricao',
            key: 'descricao',
        },
        {
            title: 'Tipo',
            dataIndex: 'tipo',
            key: 'tipo',
        },
        {
            title: 'Quantidade',
            dataIndex: 'quantidade',
            key: 'quantidade',
            render: (text) => `${text} moedas`,
        },
        {
            title: 'Data',
            dataIndex: 'data',
            key: 'data',
        },
    ];


    const handleEnviarMoedas = () => {
        navigate('/');
    };

    const handleVerVantagens = () => {
        navigate('/');
    };

    return (
        <><AppHeader /><div className="extrato-container">
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Card className="saldo-card" title="Saldo Atual" bordered={false}>
                        <h2>{saldo} Moedas</h2>
                    </Card>
                </Col>
                <Col span={24}>
                    <Card title="Extrato de Transações" bordered={false}>
                        <Table columns={columns} dataSource={transacoes} pagination={false} />
                    </Card>
                </Col>
                <Col span={24} className="button-group">
                    <Button type="primary" onClick={handleEnviarMoedas} style={{ marginRight: '10px' }}>
                        Enviar Moedas
                    </Button>
                    <Button type="default" onClick={handleVerVantagens}>
                        Ver Vantagens
                    </Button>
                </Col>
            </Row>
        </div></>
    );
};

export default Extrato;
