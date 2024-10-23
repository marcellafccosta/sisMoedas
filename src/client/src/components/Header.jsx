import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import "../styles/Header.css";
import logo from "../assets/LogoSisMoeda.svg";

const { Header } = Layout;

const AppHeader = () => {
    const navigate = useNavigate();
    const idUsuario = 16; // Certifique-se de definir o idUsuario corretamente

    const handleMenuClick = (path) => {
        navigate(path);
    };

    const menuItems = [
        {
            key: '1',
            label: 'Home',
            onClick: () => handleMenuClick('/'),
        },
       
        {
            key: '2',
            label: 'Login',
            onClick: () => handleMenuClick('/login'),
        },
        {
            key: '3',
            label: 'Cadastro',
            onClick: () => handleMenuClick('/cadastro'),
        },
    ];

    const handlePerfilClick = () => {
        navigate(`/perfil/${idUsuario}`);
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
                <div className="user-actions">
                    <Button type="primary" icon={<UserOutlined />} onClick={handlePerfilClick}>
                    </Button>
                </div>
            </div>
        </Header>
    );
};

export default AppHeader;
