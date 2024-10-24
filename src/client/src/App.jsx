import React from 'react'; 
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'; 
import AppHeader from './components/Header.jsx'; 
import Login from './pages/Login.jsx'; 
import Cadastro from './pages/Cadastro.jsx';
import Perfil from './pages/Perfil.jsx';
import CadastroVantagem from './pages/CadastroVantagem.jsx';
import Vantagens from './pages/Vantagens.jsx';
import VantagemDetalhe from './pages/VantagemDetalhe.jsx';
import { ExceptionMap } from 'antd/es/result/index.js';
import Extrato from './pages/Extrato.jsx';
import Transacao from './pages/Transacao.jsx';


function App() {
  const location = useLocation(); // Get the current location

  // Determine if we should show the header
  const showHeader = !['/login', '/cadastro'].includes(location.pathname);

  return (
    <>
      {showHeader && <AppHeader />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/cadastroVantagem" element={<CadastroVantagem />} /> 
        <Route path="/Vantagens" element={<Vantagens />} /> 
        <Route path="/VantagemDetalhe/:id" element={<VantagemDetalhe />} /> 
        <Route path="/perfil/:idUsuario" element={<Perfil />} /> 
        <Route path="/extrato/:idUsuario" element={<Extrato />} /> 
        <Route path="/transacao/:idUsuario" element={<Transacao />} /> 

      </Routes>
    </>
  );
}

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
