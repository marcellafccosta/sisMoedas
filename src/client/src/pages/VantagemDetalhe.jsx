import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Typography, Button, Spin, Modal, notification, Input, Form } from "antd"; 
import '../styles/VantagemDetalhe.css'; 
import AppHeader from "../components/Header";

const VantagemDetalhe = () => {
  const { id } = useParams(); 
  const [vantagem, setVantagem] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [editMode, setEditMode] = useState(false); 
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchVantagem = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/vantagem/${id}`);
        if (!response.ok) {
          throw new Error("Erro ao buscar a vantagem");
        }
        const data = await response.json();
        setVantagem(data); 
      } catch (error) {
        console.error("Erro ao buscar a vantagem:", error);
      } finally {
        setLoading(false); 
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

  const handleEditToggle = () => {
    setEditMode((prev) => !prev);
  };

  const handleSave = async (values) => {
    const formData = new FormData();
    formData.append("descricao", values.descricao);
    formData.append("customoedas", parseFloat(values.customoedas));

    
    if (values.foto && values.foto.length > 0) {
        formData.append("foto", values.foto[0].originFileObj);
    }
    
    formData.append("empresaparceira_id", values.empresaparceira_id);

    try {
        const response = await fetch(`http://localhost:3000/api/vantagem/${id}`, {
            method: "PUT",
            body: formData,
        });
        if (!response.ok) {
            throw new Error("Erro ao atualizar a vantagem");
        }
        notification.success({
            message: "Sucesso",
            description: "Vantagem atualizada com sucesso.",
        });
        setEditMode(false); 
        const updatedVantagem = await response.json();
        setVantagem(updatedVantagem); 
    } catch (error) {
        notification.error({
            message: "Erro",
            description: error.message,
        });
    }
};

  if (loading) {
    return <Spin size="large" style={{ display: "block", margin: "auto", marginTop: "20%" }} />; 
  }

  if (!vantagem) {
    return <Typography.Text type="danger" style={{ textAlign: "center", display: "block", marginTop: "20%" }}>Vantagem não encontrada.</Typography.Text>; // Mensagem caso não encontre a vantagem
  }

  return (
    <>
      <AppHeader />
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
          cover={editMode ? (
            <Input type="file" onChange={(e) => setVantagem({ ...vantagem, foto: e.target.files[0] })} />
          ) : (
            <img
              alt={vantagem.descricao}
              src={`http://localhost:3000/${vantagem.foto}`}
              className="vantagem-detalhe-image" />
          )}
        >
          <Typography.Title level={3} className="vantagem-detalhe-title">
            {editMode ? (
              <Input
                defaultValue={vantagem.descricao}
                onChange={(e) => setVantagem({ ...vantagem, descricao: e.target.value })}
              />
            ) : (
              vantagem.descricao
            )}
          </Typography.Title>
          <Typography.Paragraph className="vantagem-detalhe-details">
            <strong>Custo:</strong>
            {editMode ? (
              <Input
                type="number"
                defaultValue={vantagem.customoedas}
                onChange={(e) => setVantagem({ ...vantagem, customoedas: parseFloat(e.target.value) })}
              />
            ) : (
              ` ${vantagem.customoedas} moedas`
            )}
          </Typography.Paragraph>

          <div className="vantagem-detalhe-buttons">
            <Button type="primary" style={{ marginRight: "8px" }} onClick={editMode ? () => handleSave(vantagem) : handleEditToggle}>
              {editMode ? "Salvar" : "Editar"}
            </Button>
            <Button type="danger" onClick={handleDelete}>
              Excluir
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
};

export default VantagemDetalhe;
