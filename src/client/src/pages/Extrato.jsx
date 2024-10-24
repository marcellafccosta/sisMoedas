import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Extrato = () => {
    const { id } = useParams();
    const [transacoes, setTransacoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [usuarioTipo, setUsuarioTipo] = useState(null);

    useEffect(() => {
        const fetchUsuarioETransacoes = async () => {
            try {
                setLoading(true);

                // Fetch the user profile first
                const usuarioResponse = await fetch(`/api/usuario/${id}`);
                if (usuarioResponse.ok) {
                    const usuarioData = await usuarioResponse.json();

                    // Determine the user type based on the data structure
                    if (usuarioData.aluno && usuarioData.aluno.length > 0) {
                        setUsuarioTipo('aluno');
                        const alunoId = usuarioData.aluno[0].idaluno;

                        // Fetch transactions for the student
                        const transacoesResponse = await fetch(`/api/transacao/aluno/${alunoId}`);
                        if (transacoesResponse.ok) {
                            const transacoesJson = await transacoesResponse.json();
                            setTransacoes(transacoesJson);
                        } else {
                            throw new Error('Erro ao carregar as transações do aluno.');
                        }
                    } else if (usuarioData.empresa && usuarioData.empresa.length > 0) {
                        setUsuarioTipo('empresaParceira');
                        setError('Empresa parceira não possui extrato de transações.');
                    } else if (usuarioData.professor && usuarioData.professor.length > 0) {
                        setUsuarioTipo('professor');
                        setError('Professor não possui extrato de transações.');
                    } else {
                        throw new Error('Tipo de usuário desconhecido.');
                    }
                } else {
                    throw new Error('Erro ao carregar dados do usuário.');
                }
            } catch (err) {
                setError(err.message || 'Erro ao carregar as transações. Tente novamente.');
                console.error('Erro:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsuarioETransacoes();
    }, [id]);

    if (loading) {
        return <p>Carregando...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Extrato de Transações</h1>

            {usuarioTipo === 'aluno' && (
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.headerCell}>ID</th>
                            <th style={styles.headerCell}>Tipo</th>
                            <th style={styles.headerCell}>Quantidade</th>
                            <th style={styles.headerCell}>Data</th>
                            <th style={styles.headerCell}>Motivo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transacoes.map((transacao) => (
                            <tr key={transacao.idtransacao}>
                                <td style={styles.cell}>{transacao.idtransacao}</td>
                                <td style={styles.cell}>{transacao.tipo}</td>
                                <td style={styles.cell}>{transacao.quantidade}</td>
                                <td style={styles.cell}>{new Date(transacao.data).toLocaleDateString()}</td>
                                <td style={styles.cell}>{transacao.motivo || 'Sem motivo'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {usuarioTipo === 'empresaParceira' && (
                <p>Empresa parceira não possui extrato de transações.</p>
            )}

            {usuarioTipo === 'professor' && (
                <p>Professor não possui extrato de transações.</p>
            )}
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f4f4f4',
        padding: '20px',
    },
    header: {
        marginBottom: '20px',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    headerCell: {
        border: '1px solid #ccc',
        padding: '12px',
        textAlign: 'left',
        backgroundColor: '#007BFF',
        color: 'white',
    },
    cell: {
        border: '1px solid #ccc',
        padding: '12px',
        textAlign: 'left',
    },
};

export default Extrato;
