import React, { useEffect, useState } from 'react';
import { Layout, Menu, Button } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import "../styles/Header.css";
import logo from "../assets/LogoSisMoeda.svg";

const { Header } = Layout;

const AppHeader = () => {
    const navigate = useNavigate();
    const idUsuario = localStorage.getItem('idusuario');
    const [tipoUsuario, setTipoUsuario] = useState(null); // Estado para o tipo de usuário
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTipoUsuario = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/usuario/${idUsuario}`);
                if (response.ok) {
                    const data = await response.json();

                    // Define o tipo de usuário com base nos relacionamentos existentes
                    if (data.aluno && data.aluno.length > 0) {
                        setTipoUsuario("aluno");
                    } else if (data.professor && data.professor.length > 0) {
                        setTipoUsuario("professor");
                    } else if (data.empresa && data.empresa.length > 0) {
                        setTipoUsuario("empresa");
                    }
                } else {
                    console.error("Erro ao buscar o tipo de usuário");
                }
            } catch (error) {
                console.error("Erro na requisição:", error);
            } finally {
                setLoading(false);
            }
        };

        if (idUsuario) {
            fetchTipoUsuario();
        } else {
            setLoading(false);
        }
    }, [idUsuario]);

    const handlePerfilClick = () => {
        if (idUsuario) {
            navigate(`/perfil/${idUsuario}`);
        } else {
            navigate('/login'); 
        }
    };

    const handleLogoClick = () => {
        navigate(`/`);
    };

    const handleLogout = () => {
        localStorage.removeItem('idusuario');
        navigate('/login');
    };

    // Definindo os itens do menu com base no tipo de usuário
    let menuItems = [
        { key: 'home', label: <Link to="/">Home</Link> },
        { key: 'vantagens', label: <Link to="/vantagens">Vantagens</Link> },
    ];

    // Adiciona o item "Extrato" somente para alunos e professores
    if (tipoUsuario === "aluno" || tipoUsuario === "professor") {
        menuItems.splice(1, 0, { key: 'extrato', label: <Link to={`/extrato/${idUsuario || 1}`}>Extrato</Link> });
    }

    if (loading) {
        return <div>Carregando...</div>;
    }

    return (
        <Header className="app-header">
            <div className="container">
                <div className="logo">
                    <img onClick={handleLogoClick} src={logo} alt="Logo SisMoeda" className="logo-image" />
                </div>
                <Menu mode="horizontal" items={menuItems} className="menu-desktop" />
                <div className="user-actions">
                    <Button type="primary" icon={<UserOutlined />} onClick={handlePerfilClick} />
                    <Button type="primary" icon={<LogoutOutlined />} onClick={handleLogout} style={{ marginLeft: '10px' }}>
                        
                    </Button>
                </div>
            </div>
        </Header>
    );
};

export default AppHeader;
