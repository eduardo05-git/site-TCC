import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Cadastro.css';

const API_URL = 'http://localhost:8080/api/v1/usuario';

function Cadastro() {
  const location = useLocation();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [senhaFoco, setSenhaFoco] = useState(false);
  const [nivelAcesso, setNivelAcesso] = useState(location.state?.tipo || 'ESTUDANTE');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const regrasSenha = {
    minLength: senha.length >= 6,
    maiuscula: /[A-Z]/.test(senha),
    minuscula: /[a-z]/.test(senha),
    especial: /[^A-Za-z0-9]/.test(senha),
  };
  const senhaValida = Object.values(regrasSenha).every(Boolean);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!senhaValida) {
      setError('A senha não atende a todos os requisitos abaixo.');
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(API_URL, { nome, email, senha, nivelAcesso });
      navigate('/login');
    } catch (err) {
      setError('Erro no cadastro. Verifique os dados ou se o e-mail já existe.');
      console.error('Erro no cadastro:', err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="cadastro-bg">
      <div className="cadastro-card">
        <button type="button" className="cadastro-back" onClick={() => navigate('/welcome')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Voltar
        </button>

        <div className="cadastro-brand">
          <span className="cadastro-brand-name">Neway</span>
        </div>

        <h2 className="cadastro-title">Crie sua conta</h2>
        <p className="cadastro-subtitle">Seu futuro começa aqui</p>

        <form className="cadastro-form" onSubmit={handleSubmit}>
          {error && (
            <p style={{ color: '#ef4444', fontSize: '0.9rem', textAlign: 'center', margin: '-4px 0 4px' }}>
              {error}
            </p>
          )}

          <label className="cadastro-label">
            <span>Nome completo</span>
            <input
              className="cadastro-input"
              type="text"
              placeholder="Seu nome completo"
              value={nome}
              onChange={e => setNome(e.target.value)}
              required
              autoFocus
            />
          </label>

          <label className="cadastro-label">
            <span>E-mail</span>
            <input
              className="cadastro-input"
              type="email"
              placeholder="email@exemplo.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="cadastro-label">
            <span>Senha</span>
            <input
              className="cadastro-input"
              type="password"
              placeholder="Crie uma senha segura"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              onFocus={() => setSenhaFoco(true)}
              required
            />
          </label>

          {(senhaFoco || senha) && (
            <ul className="senha-checklist">
              <li className={regrasSenha.minLength ? 'ok' : ''}>
                <span className="senha-check-icon">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                Mínimo de 6 caracteres
              </li>
              <li className={regrasSenha.maiuscula ? 'ok' : ''}>
                <span className="senha-check-icon">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                Uma letra maiúscula
              </li>
              <li className={regrasSenha.minuscula ? 'ok' : ''}>
                <span className="senha-check-icon">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                Uma letra minúscula
              </li>
              <li className={regrasSenha.especial ? 'ok' : ''}>
                <span className="senha-check-icon">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                Um caractere especial (!@#$%...)
              </li>
            </ul>
          )}

          <label className="cadastro-label">
            <span>Tipo de usuário</span>
            <select
              className="cadastro-input"
              value={nivelAcesso}
              onChange={e => setNivelAcesso(e.target.value)}
              required
            >
              <option value="ESTUDANTE">Estudante</option>
              <option value="EMPRESA">Empresa</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </label>

          <button type="submit" className="cadastro-btn" disabled={isLoading || !senhaValida}>
            {isLoading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>

        <p className="link-login">
          Já tem uma conta? <Link to="/login">Entre aqui</Link>
        </p>
      </div>
    </div>
  );
}

export default Cadastro;
