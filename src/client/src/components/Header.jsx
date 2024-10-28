import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import "../styles/Header.css";
import logo from "../assets/LogoSisMoeda.svg";

const { Header } = Layout;

const AppHeader = () => {
    const navigate = useNavigate();

    // Obtém o ID do usuário logado do localStorage
    const idUsuario = localStorage.getItem('idusuario');

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
        {
            key: '4',
            label: 'Extrato',
            onClick: () => handleMenuClick('/extrato'),
        },
        {
            key: '5',
            label: 'Vantagens',
            onClick: () => handleMenuClick('/vantagens'),
        },
    ];

    const handlePerfilClick = () => {
        if (idUsuario) {
            navigate(`/perfil/${idUsuario}`);
        } else {
            navigate('/login'); // Redireciona para login caso não haja usuário logado
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
                <div className="user-actions">
                    <Button type="primary" icon={<UserOutlined />} onClick={handlePerfilClick} />
                </div>
            </div>
        </Header>
    );
};

export default AppHeader;
