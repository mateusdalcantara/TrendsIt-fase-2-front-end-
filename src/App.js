import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './components/login';
import Register from './components/register';
import FeedInicial from './components/FeedInicial'; // Tela principal pós-login
import Diretorio from './components/Diretorio';
import Grupos from './components/Grupos';
import GrupoDetalhes from './components/GrupoDetalhes';
import Vagas from './components/Vagas';
import Eventos from './components/Eventos';


function App() {
  return (
    <Router>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Tela pós-login */}
        <Route path="/dashboard" element={<FeedInicial />} />

        {/* Telas internas acessadas pelo dashboard */}
        <Route path="/diretorio" element={<Diretorio />} />
        <Route path="/grupos" element={<Grupos />} />
        <Route path="/grupos/:id" element={<GrupoDetalhes />} />
        <Route path="/vagas" element={<Vagas />} />
        <Route path="/eventos" element={<Eventos />} />
      </Routes>
    </Router>
  );
}

export default App;
