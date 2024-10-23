import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login.jsx'; 
import Cadastro from './pages/Cadastro.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} /> 
        <Route path="/cadastro" element={<Cadastro />} /> 
      </Routes>
    </Router>
  );
}

export default App;
