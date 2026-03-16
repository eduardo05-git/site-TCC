import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Cadastro.css';
import InputField from '../../components/Cadastro/InputField';

function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [tipo, setTipo] = useState('estudante');
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = "http://localhost:8080/api/v1/usuario";

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const novoUsuario = { nome, email, senha, tipo };

    try {
      await axios.post(API_URL, novoUsuario);
      alert('Cadastro realizado com sucesso! Faça login para continuar.');
      navigate('/login');
    } catch (err) {
      setError('Erro no cadastro. Verifique os dados ou se o email já existe.');
      console.error("Erro no cadastro:", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="cadastro-bg">
      <div className="cadastro-card">
        <h2 className="cadastro-title">Junte-se ao Neway</h2>
        <p className="cadastro-subtitle">Seu futuro começa aqui. Cadastre-se e conquiste suas oportunidades!</p>

        <form className="cadastro-form" onSubmit={handleSubmit}>
          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
          
          <label className="cadastro-label">
            <span>Nome Completo</span>
            <InputField 
              className="cadastro-input"
              type="text" 
              value={nome}
              onChange={e => setNome(e.target.value)}
              required
              autoFocus
              label="Digite seu nome"
              id="nome-completo"
            />
          </label>

          <label className="cadastro-label">
            <span>Email</span>
            <InputField
              className="cadastro-input" 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              label="email@exemplo.com"
              id="email"
            />
          </label>

          <label className="cadastro-label">
            <span>Senha</span>
            <InputField 
              className="cadastro-input"
              type="password"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              required
              label="Mínimo 6 caracteres"
              minLength={6}
              id="senha"
            />
          </label>

          <label className="cadastro-label">
            <span>Tipo de usuário</span>
            <select 
              className="cadastro-input" 
              value={tipo} 
              onChange={e => setTipo(e.target.value)} 
              required
            >
              <option value="estudante">Estudante</option>
              <option value="administrador">Administrador</option>
              <option value="empresa">Empresa</option>
            </select>
          </label>
          
          <button type="submit" className="cadastro-btn" disabled={isLoading}>
            {isLoading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>

        <p className="link-login">
          Já tem uma conta? <a href="/login">Entre aqui</a>
        </p>
      </div>
    </div>
  );
}

export default Cadastro;