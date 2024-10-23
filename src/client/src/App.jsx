import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login.jsx'; 
import Cadastro from './pages/Cadastro.jsx';
import Perfil from './pages/Perfil.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} /> 
        <Route path="/cadastro" element={<Cadastro />} /> 
        <Route path="/perfil/:idUsuario" element={<Perfil />} /> 
      </Routes>
    </Router>
  );
}

export default App;
