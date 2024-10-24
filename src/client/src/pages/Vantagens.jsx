import { useEffect, useState } from "react";
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

    fetchVantagens();
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
      <div className="vantagens-container" style={{ overflowY: "auto" }}> {/* Adicione uma classe para o contêiner */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <h2>Vantagens</h2>
          <Button
            variant="contained"
            onClick={handleNavigateToCadastro} // Usando a função handleNavigateToCadastro
            className="cadastro-button" // Classe para estilização
          >
            Cadastrar Vantagem
          </Button>
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
                        className="vantagem-image" // Classe para a imagem
                      />
                    </div>
                  }
                  className="vantagem-card" // Classe para o card
                  onClick={() => handleNavigateToDetail(vantagem.idvantagem)} // Usando a função handleNavigateToDetail
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
        </div> {/* Fechando o novo contêiner */}

        <Box display="flex" justifyContent="center" marginTop={2}>
          <Pagination
            current={currentPage}
            total={totalVantagens}
            pageSize={vantagensPerPage}
            onChange={handleChangePage}
            showSizeChanger={false}
            className="pagination" // Classe para a paginação
          />
        </Box>
      </div>
    </div>
  );
};

export default Vantagens;
