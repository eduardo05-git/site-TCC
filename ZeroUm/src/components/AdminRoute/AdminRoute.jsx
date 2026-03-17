import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./AdminRoute.css";

function AdminRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const location = useLocation();

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (isAdmin === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === "admin123") {
      localStorage.setItem("isAdmin", "true");
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Senha incorreta. Tente novamente.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login-wrapper">
        <div className="admin-login-glass">
          <div className="admin-login-icon">🔒</div>
          <h2>Área Restrita</h2>
          <p>Acesse o painel de controle do sistema</p>
          <form onSubmit={handleLogin} className="admin-login-form">
            <input
              type="password"
              placeholder="Digite sua senha de administrador"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <span className="admin-error-msg">{error}</span>}
            <button type="submit" className="admin-btn">Acessar Painel</button>
          </form>
        </div>
      </div>
    );
  }

  const navLinks = [
    { path: "/admin", label: "Dashboard", icon: "📊" },
    { path: "/admin/usuarios", label: "Gerenciar Usuários", icon: "👥" },
    { path: "/admin/vagas", label: "Gerenciar Vagas", icon: "📋" }
  ];

  return (
    <div className="admin-layout-modern">
      {/* Sidebar Overlay for Mobile could be added later, for now we keep it simple */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <Link to="/" className="admin-logo" title="Voltar ao site">
            Neway<span className="admin-badge">Admin</span>
          </Link>
        </div>
        
        <nav className="admin-sidebar-nav">
          <ul>
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`admin-nav-link ${location.pathname === link.path ? "active" : ""}`}
                >
                  <span className="nav-icon">{link.icon}</span>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="admin-sidebar-footer">
          <button onClick={handleLogout} className="admin-logout-btn">
            <span className="nav-icon">🚪</span> Sair do Painel
          </button>
        </div>
      </aside>

      <main className="admin-main-content">
        <header className="admin-top-header">
          <div className="admin-greeting">
            <h3>Bem-vindo ao Painel de Controle! 👋</h3>
          </div>
          <div className="admin-user-profile">
            <div className="admin-avatar">A</div>
            <span>Administrador</span>
          </div>
        </header>
        
        <div className="admin-page-glass">
          {children}
        </div>
      </main>
    </div>
  );
}

export default AdminRoute;
