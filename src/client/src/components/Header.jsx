import React from 'react';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { Link, Routes, Route } from 'react-router-dom';
import Perfil from '../pages/Perfil.jsx';
import Home from '../pages/Home.jsx';
import Extrato from '../pages/Extrato.jsx';
import Transacao from '../pages/Transacao.jsx';
import Vantagens from '../pages/Vantagens.jsx';
import CadastroVantagem from '../pages/CadastroVantagem.jsx';
import VantagemDetalhe from '../pages/VantagemDetalhe.jsx';
import logo from '../assets/LogoSisMoeda.svg'; // Certifique-se de usar o caminho e extensão corretos

const { Header, Content, Footer } = Layout;

const items = [
  { key: 'home', label: <Link to="/">Home</Link> },
  { key: 'perfil', label: <Link to="/perfil/1">Perfil</Link> }, // Exemplo de idUsuario
  { key: 'extrato', label: <Link to="/extrato/1">Extrato</Link> }, // Exemplo de idUsuario
  { key: 'vantagens', label: <Link to="/vantagens">Vantagens</Link> },
  { key: 'cadastroVantagem', label: <Link to="/cadastroVantagem">Cadastro de Vantagem</Link> },
];

const AppHeader = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <img src={logo} alt="Logo" style={{ height: '40px', marginRight: '16px' }} />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['home']}
          items={items}
          style={{
            flex: 1,
            minWidth: 0,
          }}
        />
      </Header>
      <Content>
        <Breadcrumb
          style={{
            margin: '16px 0',
          }}
        >
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb>
        <div
          style={{
            minHeight: 'calc(100vh - 200px)', // Ajuste baseado no seu layout
            padding: 24,
            borderRadius: borderRadiusLG,
            background: colorBgContainer,
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/perfil/:idUsuario" element={<Perfil />} />
            <Route path="/extrato/:idUsuario" element={<Extrato />} />
            <Route path="/transacao/:idUsuario" element={<Transacao />} />
            <Route path="/vantagens" element={<Vantagens />} />
            <Route path="/cadastroVantagem" element={<CadastroVantagem />} />
            <Route path="/VantagemDetalhe/:id" element={<VantagemDetalhe />} />
          </Routes>
        </div>
      </Content>
      <Footer
        style={{
          textAlign: 'center',
        }}
      >
        Ant Design ©{new Date().getFullYear()} Created by Ant UED
      </Footer>
    </Layout>
  );
};

export default AppHeader;
