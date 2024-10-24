import React from 'react'; 
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'; 
import AppHeader from './components/Header.jsx'; 
import Login from './pages/Login.jsx'; 
import Cadastro from './pages/Cadastro.jsx'; 
import Home from './pages/Home.jsx'; 

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
