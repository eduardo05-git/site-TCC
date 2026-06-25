import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || 'null');

  function getActiveClass(path) {
    return location.pathname === path ? 'active-link' : '';
  }

  function handleLogout() {
    localStorage.removeItem('user');
    localStorage.removeItem('isAdmin');
    navigate('/welcome');
  }

  function LoginCadastro() {
    if (user) {
      return (
        <div className="login-entrar">
          <span className="navbar-user-nome">{user.nome?.split(' ')[0]}</span>
          <button className="navbar-logout-btn" onClick={handleLogout}>Sair</button>
        </div>
      );
    }
    return (
      <div className="login-entrar">
        <ul className="login-entre">
          <li><Link to="/welcome" className={getActiveClass('/welcome')}>Login</Link></li>
          <li><Link to="/cadastro" className={getActiveClass('/cadastro')}>Cadastro</Link></li>
        </ul>
      </div>
    );
  }

  return (
    <div className="navbar-wrapper">
      <nav className="navbar">
        <div className="navbar-logo">
          <Link to="/">Neway</Link>
        </div>
        
        <ul className="navbar-list">
          <li className={`nav-item ${getActiveClass('/')}`}>
            <Link to="/">
              Início
            </Link>
          </li>
          <li className={`nav-item ${getActiveClass('/vagas')}`}>
            <Link to="/vagas">Vagas</Link>
          </li>
          <li className={`nav-item ${getActiveClass('/perfil')}`}>
            <Link to="/perfil">Perfil</Link>
          </li>
          <li className={`nav-item ${location.pathname.startsWith('/admin') ? 'active-link' : ''}`}>
            
          </li>
        </ul>

        <div className="right-section">
          <LoginCadastro />
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
