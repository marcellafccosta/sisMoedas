import React from 'react';
import { Button, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import "../styles/Home.css";
import logo from "../assets/LogoSisMoeda.svg"; 
import AppHeader from '../components/Header';

const Home = () => {
    return (
        <><AppHeader /><div className="homepage-container">
            <div className="hero-section">
                <img src={logo} alt="Logo SisMoedas" className="hero-logo" />
                <h1>Bem-vindo ao SisMoedas</h1>
                <p>Uma plataforma simples para gerenciar suas moedas virtuais e recompensas estudantis.</p>
                <Button type="primary" size="large">
                    <Link to="/cadastro">Comece Agora</Link>
                </Button>
            </div>
            <div className="info-section">
                <Row gutter={[32, 32]}>
                    <Col xs={24} md={12} lg={8}>
                        <div className="info-card">
                            <h2>Sobre Nós</h2>
                            <p>
                                O SisMoedas é uma plataforma inovadora para ajudar estudantes e instituições a
                                gerenciarem moedas virtuais baseadas em mérito e participação.
                            </p>
                        </div>
                    </Col>
                    <Col xs={24} md={12} lg={8}>
                        <div className="info-card">
                            <h2>Funcionalidades</h2>
                            <p>
                                Registre-se, ganhe moedas, troque por recompensas e monitore seu progresso de forma fácil
                                e intuitiva.
                            </p>
                        </div>
                    </Col>
                    <Col xs={24} md={12} lg={8}>
                        <div className="info-card">
                            <h2>Benefícios</h2>
                            <p>
                                Com o SisMoedas, você pode acumular recompensas, desenvolver habilidades, e se destacar
                                na sua instituição, ganhando prêmios e reconhecimento.
                            </p>
                        </div>
                    </Col>
                </Row>
            </div>
        </div></>
    );
};

export default Home;
