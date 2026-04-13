import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Cadastro.css';

const API_URL = 'http://localhost:8080/api/v1/usuario';

function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nivelAcesso, setNivelAcesso] = useState('ESTUDANTE');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setError('');

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
              placeholder="Mínimo 6 caracteres"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              required
              minLength={6}
            />
          </label>

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

          <button type="submit" className="cadastro-btn" disabled={isLoading}>
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
