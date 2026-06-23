import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const API_LOGIN_URL = 'http://localhost:8080/api/v1/usuario/login';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(API_LOGIN_URL, { email, senha });

      if (response.status === 200 && response.data) {
        const userData = response.data;
        localStorage.setItem('user', JSON.stringify(userData));

        if (userData.nivelAcesso === 'ADMIN') {
          navigate('/admin-panel');
        } else if (userData.nivelAcesso === 'EMPRESA') {
          navigate('/empresa');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Email ou senha incorretos. Tente novamente.');
      } else if (err.response) {
        setError(`Erro de servidor: ${err.response.status}.`);
      } else {
        setError('Não foi possível conectar ao servidor.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-bg">
      <div className="login-card">
        <div className="login-brand">
          <span className="login-brand-name">Neway</span>
        </div>

        <h2 className="login-title">Bem-vindo de volta</h2>
        <p className="login-subtitle">Acesse sua conta para encontrar oportunidades</p>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <p style={{ color: '#ef4444', fontSize: '0.9rem', textAlign: 'center', margin: '-4px 0 4px' }}>
              {error}
            </p>
          )}

          <label className="login-label">
            <span>E-mail</span>
            <input
              className="login-input"
              type="email"
              placeholder="email@exemplo.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
            />
          </label>

          <label className="login-label">
            <span>Senha</span>
            <input
              className="login-input"
              type="password"
              placeholder="Sua senha"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              required
            />
          </label>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="link-cadastro">
          Não tem uma conta? <Link to="/cadastro">Cadastre-se aqui</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
