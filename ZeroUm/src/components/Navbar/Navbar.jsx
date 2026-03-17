import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();

  function getActiveClass(path) {
    return location.pathname === path ? 'active-link' : '';
  }

  function LoginCadastro() {
    return (
      <div className="login-entrar">
        <ul className="login-entre">
          <li><Link to="/login" className={getActiveClass('/login')}>Login</Link></li>
          <li><Link to="/cadastro" className={getActiveClass('/cadastro')}>Cadastro</Link></li>
        </ul>
      </div>
    );
  }

  // Pop-up de notificações
  function NotificationsPopup() {
    return (
      <div className="notifications-popup">
        <ul>
          <li>Você foi aceito por uma empresa!</li>
          <li>Nova vaga disponível na área de TI.</li>
          <li>Não perca o prazo para inscrição.</li>
        </ul>
      </div>
    );
  }

  // Manipula o clique no sininho
  function handleBellClick() {
    setShowNotifications(!showNotifications);
  }

  // Número estático para a demonstração do badge na navbar parecida com a imagem
  const notifCount = 3;

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
            <Link to="/admin">Admin</Link>
          </li>
        </ul>

        <div className="right-section">
          <LoginCadastro />
          <div 
            className={`notification-bell ${showNotifications ? 'active' : ''}`} 
            onClick={handleBellClick} 
            title="Notificações"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            {notifCount > 0 && <span className="badge">{notifCount}</span>}
          </div>
          {showNotifications && <NotificationsPopup />}
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
