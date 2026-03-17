import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import Vagas from "./pages/Vagas/Vagas";
import Perfil from "./pages/Perfil/Perfil";
import Login from "./pages/Login/Login";
import Cadastro from "./pages/Login/Cadastro";
import PublicarVaga from "./pages/PublicarVaga/PubliqueSuaVaga";
import PerfilVisualizacao from "./pages/Perfil/PerfilVisualizacao"; 
import UserList from './pages/UserList/UserList.jsx'; 
import AdminRoute from './components/AdminRoute/AdminRoute.jsx';
import Dashboard from './pages/Admin/Dashboard/Dashboard.jsx';
import AdminVagas from './pages/Admin/Vagas/AdminVagas.jsx';


function PerfilVisualizacaoWrapper() {
  const location = useLocation();
  const { nome, curso, ano, telefone, email, experiencia } = location.state || {};

  if (!nome) {
    return <p>Nenhum perfil carregado. Por favor, preencha o formulário primeiro.</p>;
  }

  return (
    <PerfilVisualizacao
      nome={nome}
      curso={curso}
      ano={ano}
      telefone={telefone}
      email={email}
      experiencia={experiencia}
    />
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/vagas" element={<Vagas />} />
        <Route path="/perfil" element={<Perfil />} />
        
        <Route path="/perfil-visualizacao" element={<PerfilVisualizacaoWrapper />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/publiquesuavaga" element={<PublicarVaga />} />
        
        {/* Admin Routes with Simple Access Control */}
        <Route path="/admin" element={<AdminRoute><Dashboard /></AdminRoute>} />
        <Route path="/admin/usuarios" element={<AdminRoute><UserList /></AdminRoute>} />
        <Route path="/admin/vagas" element={<AdminRoute><AdminVagas /></AdminRoute>} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
