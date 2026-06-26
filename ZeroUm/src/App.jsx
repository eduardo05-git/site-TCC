import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import Welcome from "./pages/Welcome/Welcome";
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
import Empresa from './pages/Empresa/Empresa.jsx';
import AdminPanel from './pages/Admin/AdminPanel/AdminPanel.jsx';

// Layout com Navbar e Footer (apenas para rotas autenticadas)
function LayoutComNavbar({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Rotas públicas — sem Navbar/Footer */}
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/login" element={<Login />} />

        {/* Redireciona raiz para /welcome se não logado */}
        <Route
          path="/"
          element={
            <PrivateRoute role="ESTUDANTE">
              <LayoutComNavbar>
                <Home />
              </LayoutComNavbar>
            </PrivateRoute>
          }
        />

        {/* Rotas protegidas */}
        <Route
          path="/vagas"
          element={
            <PrivateRoute role="ESTUDANTE">
              <LayoutComNavbar>
                <Vagas />
              </LayoutComNavbar>
            </PrivateRoute>
          }
        />
        <Route
          path="/perfil"
          element={
            <PrivateRoute role="ESTUDANTE">
              <LayoutComNavbar>
                <Perfil />
              </LayoutComNavbar>
            </PrivateRoute>
          }
        />
        <Route
          path="/perfil-visualizacao/:alunoId"
          element={
            <PrivateRoute role="EMPRESA">
              <PerfilVisualizacao />
            </PrivateRoute>
          }
        />
        <Route
          path="/publiquesuavaga"
          element={
            <PrivateRoute>
              <LayoutComNavbar>
                <PublicarVaga />
              </LayoutComNavbar>
            </PrivateRoute>
          }
        />

        {/* Portal da Empresa */}
        <Route
          path="/empresa"
          element={
            <PrivateRoute role="EMPRESA">
              <Empresa />
            </PrivateRoute>
          }
        />

        {/* Painel Admin unificado — sem autenticação de role */}
        <Route path="/admin-panel" element={<AdminPanel />} />

        {/* Rotas admin (protegidas pelo AdminRoute) */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminRoute><Dashboard /></AdminRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/usuarios"
          element={
            <PrivateRoute>
              <AdminRoute><UserList /></AdminRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/vagas"
          element={
            <PrivateRoute>
              <AdminRoute><AdminVagas /></AdminRoute>
            </PrivateRoute>
          }
        />

        {/* Qualquer rota desconhecida → welcome */}
        <Route path="*" element={<Navigate to="/welcome" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
