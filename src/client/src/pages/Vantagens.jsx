import React, { useEffect, useState } from "react";
import {
  Typography,
  Grid,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Card } from "antd";
import { Pagination, Button } from "antd"; // importando Pagination do Ant Design
import AppHeader from '../components/Header'; // Importando o AppHeader
import "../styles/Vantagens.css"; 

const Vantagens = () => {
  const [vantagens, setVantagens] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentVantagens, setCurrentVantagens] = useState([]);
  const [totalVantagens, setTotalVantagens] = useState(0);
  const [vantagensPerPage] = useState(15);
  const [tipoUsuario, setTipoUsuario] = useState(null); // Estado para armazenar o tipo de usuário
  const navigate = useNavigate(); // Usando o hook useNavigate

  useEffect(() => {
    const fetchVantagens = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/vantagem");
        if (!response.ok) {
          throw new Error("Erro ao buscar as vantagens");
        }
        const data = await response.json();
        setVantagens(data);
        setTotalVantagens(data.length); // Atualiza o total de vantagens
      } catch (error) {
        console.error("Erro ao buscar as vantagens:", error);
      }
    };

    const fetchTipoUsuario = async () => {
      const idUsuario = localStorage.getItem("idusuario");
      if (idUsuario) {
        try {
          const response = await fetch(`http://localhost:3000/api/usuario/${idUsuario}`);
          if (response.ok) {
            const data = await response.json();
            if (data.empresa && data.empresa.length > 0) {
              setTipoUsuario("empresa");
            } else {
              setTipoUsuario("outro");
            }
          }
        } catch (error) {
          console.error("Erro ao buscar tipo de usuário:", error);
        }
      }
    };

    fetchVantagens();
    fetchTipoUsuario();
  }, []);

  useEffect(() => {
    const indexOfLastVantagem = currentPage * vantagensPerPage;
    const indexOfFirstVantagem = indexOfLastVantagem - vantagensPerPage;
    const currentVantagens = vantagens.slice(indexOfFirstVantagem, indexOfLastVantagem);
    setCurrentVantagens(currentVantagens);
  }, [currentPage, vantagens]);

  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  const handleNavigateToCadastro = () => {
    navigate("/CadastroVantagem"); // Navega para a página de cadastro
  };

  const handleNavigateToDetail = (id) => {
    navigate(`/VantagemDetalhe/${id}`); // Navega para a página de detalhe da vantagem
  };

  return (
    <div>
      <AppHeader />
      <div className="vantagens-container" style={{ overflowY: "auto" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <h2 style={{color: "#04448B"}}>Vantagens</h2>
          {tipoUsuario === "empresa" && ( 
            <Button
              variant="contained"
              onClick={handleNavigateToCadastro}
              className="cadastro-button"
            >
              Cadastrar Vantagem
            </Button>
          )}
        </Box>

        <div className="vantagens-grid-container"> {/* Novo contêiner para os cards */}
          <Grid container spacing={5}>
            {currentVantagens.map((vantagem, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Card
                  hoverable
                  cover={
                    <div className="vantagem-image-container">
                      <img
                        src={`http://localhost:3000/${vantagem.foto}`}
                        alt={vantagem.descricao}
                        className="vantagem-image"
                      />
                    </div>
                  }
                  className="vantagem-card"
                  onClick={() => handleNavigateToDetail(vantagem.idvantagem)}
                >
                  <div className="vantagem-details">
                    <Typography variant="h6" component="h2" className="vantagem-description">
                      {vantagem.descricao}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Custo: {vantagem.customoedas} moedas
                    </Typography>
                  </div>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>

        <Box display="flex" justifyContent="center" marginTop={2}>
          <Pagination
            current={currentPage}
            total={totalVantagens}
            pageSize={vantagensPerPage}
            onChange={handleChangePage}
            showSizeChanger={false}
            className="pagination"
          />
        </Box>
      </div>
    </div>
  );
};

export default Vantagens;
