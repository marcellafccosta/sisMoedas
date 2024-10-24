import React, { useEffect, useState } from 'react';

const Extrato = () => {
    const [transacoes, setTransacoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTransacoes = async () => {
            try {
                const data = await TransacaoService.getAll();
                setTransacoes(data);
            } catch (err) {
                setError('Erro ao carregar transações. Tente novamente.');
            } finally {
                setLoading(false);
            }
        };

        fetchTransacoes();
    }, []);

    if (loading) {
        return <p>Carregando...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Extrato de Transações</h1>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.headerCell}>ID</th>
                        <th style={styles.headerCell}>Descrição</th>
                        <th style={styles.headerCell}>Valor</th>
                        <th style={styles.headerCell}>Data</th>
                    </tr>
                </thead>
                <tbody>
                    {transacoes.map(transacao => (
                        <tr key={transacao.id}>
                            <td style={styles.cell}>{transacao.id}</td>
                            <td style={styles.cell}>{transacao.descricao}</td>
                            <td style={styles.cell}>{transacao.valor}</td>
                            <td style={styles.cell}>{new Date(transacao.data).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// Estilos em formato de objeto
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh', // Ocupe 100% da altura da janela
        backgroundColor: '#f4f4f4', // Cor de fundo suave
        padding: '20px', // Espaçamento ao redor
    },
    header: {
        marginBottom: '20px', // Espaço abaixo do título
    },
    table: {
        width: '100%', // Ocupe toda a largura disponível
        borderCollapse: 'collapse', // Remove espaços entre bordas de células
    },
    headerCell: {
        border: '1px solid #ccc', // Borda das células do cabeçalho
        padding: '12px', // Espaçamento interno das células
        textAlign: 'left', // Alinhamento à esquerda do texto
        backgroundColor: '#007BFF', // Cor de fundo do cabeçalho
        color: 'white', // Cor do texto do cabeçalho
    },
    cell: {
        border: '1px solid #ccc', // Borda das células
        padding: '12px', // Espaçamento interno das células
        textAlign: 'left', // Alinhamento à esquerda do texto
    },
};

// Exporta o componente
export default Extrato;
