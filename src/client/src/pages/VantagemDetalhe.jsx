import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Typography, Button, Spin, Modal, notification } from "antd"; // Importando componentes do Ant Design
import '../styles/VantagemDetalhe.css'; // Importando o CSS

const VantagemDetalhe = () => {
  const { id } = useParams(); // Pegando o ID da URL
  const [vantagem, setVantagem] = useState(null); // Estado para armazenar os dados da vantagem
  const [loading, setLoading] = useState(true); // Estado para controle de loading
  const navigate = useNavigate(); // Hook para navegação

  useEffect(() => {
    const fetchVantagem = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/vantagem/${id}`);
        if (!response.ok) {
          throw new Error("Erro ao buscar a vantagem");
        }
        const data = await response.json();
        setVantagem(data); // Atualizando o estado com os dados da vantagem
      } catch (error) {
        console.error("Erro ao buscar a vantagem:", error);
      } finally {
        setLoading(false); // Finaliza o loading após a requisição
      }
    };

    fetchVantagem();
  }, [id]);

  const handleDelete = () => {
    Modal.confirm({
      title: 'Excluir Vantagem',
      content: 'Tem certeza de que deseja excluir esta vantagem?',
      onOk: async () => {
        try {
          const response = await fetch(`http://localhost:3000/api/vantagem/${id}`, {
            method: 'DELETE',
          });
          if (!response.ok) {
            throw new Error('Erro ao excluir a vantagem');
          }
          notification.success({
            message: 'Sucesso',
            description: 'Vantagem excluída com sucesso.',
          });
          navigate('/Vantagens'); // Redirecionar após exclusão
        } catch (error) {
          notification.error({
            message: 'Erro',
            description: error.message,
          });
        }
      },
    });
  };

  if (loading) {
    return <Spin size="large" style={{ display: "block", margin: "auto", marginTop: "20%" }} />; // Exibe um carregando enquanto busca os dados
  }

  if (!vantagem) {
    return <Typography.Text type="danger" style={{ textAlign: "center", display: "block", marginTop: "20%" }}>Vantagem não encontrada.</Typography.Text>; // Mensagem caso não encontre a vantagem
  }

  return (
    <div className="vantagem-detalhe-container">
      <button 
        className="vantagem-detalhe-back-button" 
        onClick={() => navigate('/Vantagens')}
      >
        Voltar
      </button>
      <Card
        hoverable
        className="vantagem-detalhe-card"
        cover={
          <img
            alt={vantagem.descricao}
            src={`http://localhost:3000/${vantagem.foto}`}
            className="vantagem-detalhe-image"
          />
        }
      >
        <Typography.Title level={3} className="vantagem-detalhe-title">{vantagem.customoedas}</Typography.Title>
        <Typography.Paragraph className="vantagem-detalhe-details">
          <strong>Custo:</strong> {vantagem.descricao} moedas
        </Typography.Paragraph>
        
        <div className="vantagem-detalhe-buttons">
          <Button type="primary" style={{ marginRight: "8px" }}>
            Editar
          </Button>
          <Button type="danger" onClick={handleDelete}>
            Excluir
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default VantagemDetalhe;
