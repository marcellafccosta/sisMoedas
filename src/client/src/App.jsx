import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login.jsx'; 
import Cadastro from './pages/Cadastro.jsx';
import Perfil from './pages/Perfil.jsx';
import AppHeader from './components/Header.jsx';
import Home from './pages/Home.jsx';
import Extrato from './pages/Extrato.jsx';

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} /> 
        <Route path="/perfil/:idUsuario" element={<Perfil />} /> 
        <Route path="/extrato" element={<Extrato />} /> 
      </Routes>
    </Router>
  );
}

export default App;
