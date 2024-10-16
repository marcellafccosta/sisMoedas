import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login.jsx'; // Ensure correct path to Login component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} /> {/* Ensure this is correctly written */}
        {/* Other routes */}
      </Routes>
    </Router>
  );
}

export default App;
