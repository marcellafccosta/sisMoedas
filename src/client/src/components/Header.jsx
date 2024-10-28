import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import "../styles/Header.css";
import logo from "../assets/LogoSisMoeda.svg";

const { Header } = Layout;

const AppHeader = () => {
    const navigate = useNavigate();

    const idUsuario = localStorage.getItem('idusuario');

    const handleMenuClick = (path) => {
        navigate(path);
    };

    const menuItems = [
        { key: 'home', label: <Link to="/">Home</Link> },
        { key: 'extrato', label: <Link to={`/extrato/${idUsuario || 1}`}>Extrato</Link> }, // Usando idUsuario
        { key: 'vantagens', label: <Link to="/vantagens">Vantagens</Link> },
        { key: 'cadastroVantagem', label: <Link to="/cadastroVantagem">Cadastro de Vantagem</Link> },
    ];

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

    return (
        <Header className="app-header">
            <div className="container">
                <div className="logo">
                    <img onClick={handleLogoClick} src={logo} alt="Logo SisMoeda" className="logo-image" />
                </div>
                <Menu mode="horizontal" items={menuItems} className="menu-desktop" />
                <div className="user-actions" >
                    <Button type="primary" icon={<UserOutlined />} onClick={handlePerfilClick}  />
                </div>
            </div>
        </Header>
    );
};

export default AppHeader;
