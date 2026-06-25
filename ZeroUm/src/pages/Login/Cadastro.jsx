import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Cadastro.css';

const API_USUARIO_URL = 'http://localhost:8080/api/v1/usuario';
const API_EMPRESA_URL = 'http://localhost:8080/api/v1/empresa';
const API_ALUNO_URL = 'http://localhost:8080/api/v1/aluno';

function Cadastro() {
  const location = useLocation();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [senhaFoco, setSenhaFoco] = useState(false);
  const [nivelAcesso, setNivelAcesso] = useState(location.state?.tipo || 'ESTUDANTE');
  const [cnpj, setCnpj] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cep, setCep] = useState('');
  const [numero, setNumero] = useState('');
  const [informacao, setInformacao] = useState('');
  const [rm, setRm] = useState('');
  const [curso, setCurso] = useState('');
  const [conclusao, setConclusao] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
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

  function formatarDataDigitada(valor) {
    const digitos = valor.replace(/\D/g, '').slice(0, 8);
    if (digitos.length > 4) return `${digitos.slice(0, 2)}/${digitos.slice(2, 4)}/${digitos.slice(4)}`;
    if (digitos.length > 2) return `${digitos.slice(0, 2)}/${digitos.slice(2)}`;
    return digitos;
  }

  function dataParaISO(dataBR) {
    const [dia, mes, ano] = dataBR.split('/');
    if (!dia || !mes || !ano || ano.length !== 4) return null;
    return `${ano}-${mes}-${dia}`;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!senhaValida) {
      setError('A senha não atende a todos os requisitos abaixo.');
      return;
    }

    let dataNascimentoISO = null;
    if (nivelAcesso === 'ESTUDANTE') {
      dataNascimentoISO = dataParaISO(dataNascimento);
      if (!dataNascimentoISO) {
        setError('Data de nascimento inválida. Use o formato DD/MM/AAAA.');
        return;
      }
    }

    setIsLoading(true);
    try {
      const resUsuario = await axios.post(API_USUARIO_URL, { nome, email, senha, nivelAcesso });

      if (nivelAcesso === 'EMPRESA') {
        try {
          await axios.post(API_EMPRESA_URL, {
            usuarioId: resUsuario.data.id,
            nome,
            cnpj,
            telefone,
            cep,
            numero,
            informacao,
          });
        } catch (errEmpresa) {
          setError('Usuário criado, mas não foi possível salvar os dados da empresa. Fale com o suporte.');
          console.error('Erro ao criar empresa:', errEmpresa);
          setIsLoading(false);
          return;
        }
      }

      if (nivelAcesso === 'ESTUDANTE') {
        try {
          await axios.post(API_ALUNO_URL, {
            usuarioId: resUsuario.data.id,
            nome,
            rm,
            curso,
            conclusao,
            dataNascimento: dataNascimentoISO,
          });
        } catch (errAluno) {
          setError('Usuário criado, mas não foi possível salvar os dados do aluno. Fale com o suporte.');
          console.error('Erro ao criar aluno:', errAluno);
          setIsLoading(false);
          return;
        }
      }

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

          {nivelAcesso === 'ESTUDANTE' && (
            <>
              <div style={{ display: 'flex', gap: '12px' }}>
                <label className="cadastro-label" style={{ flex: 1 }}>
                  <span>RM (matrícula)</span>
                  <input
                    className="cadastro-input"
                    type="text"
                    placeholder="rm12345"
                    value={rm}
                    onChange={e => setRm(e.target.value)}
                    required
                  />
                </label>
                <label className="cadastro-label" style={{ flex: 1 }}>
                  <span>Data de nascimento</span>
                  <input
                    className="cadastro-input"
                    type="text"
                    inputMode="numeric"
                    placeholder="DD/MM/AAAA"
                    value={dataNascimento}
                    onChange={e => setDataNascimento(formatarDataDigitada(e.target.value))}
                    maxLength={10}
                    required
                  />
                </label>
              </div>

              <label className="cadastro-label">
                <span>Curso</span>
                <input
                  className="cadastro-input"
                  type="text"
                  placeholder="Ex: Informática"
                  value={curso}
                  onChange={e => setCurso(e.target.value)}
                  required
                />
              </label>

              <label className="cadastro-label">
                <span>Previsão de conclusão</span>
                <input
                  className="cadastro-input"
                  type="text"
                  placeholder="Ex: DEZEMBRO/2026"
                  value={conclusao}
                  onChange={e => setConclusao(e.target.value)}
                  required
                />
              </label>
            </>
          )}

          {nivelAcesso === 'EMPRESA' && (
            <>
              <label className="cadastro-label">
                <span>CNPJ</span>
                <input
                  className="cadastro-input"
                  type="text"
                  placeholder="00.000.000/0000-00"
                  value={cnpj}
                  onChange={e => setCnpj(e.target.value)}
                  required
                />
              </label>

              <label className="cadastro-label">
                <span>Telefone</span>
                <input
                  className="cadastro-input"
                  type="text"
                  placeholder="(11) 99999-9999"
                  value={telefone}
                  onChange={e => setTelefone(e.target.value)}
                  required
                />
              </label>

              <div style={{ display: 'flex', gap: '12px' }}>
                <label className="cadastro-label" style={{ flex: 2 }}>
                  <span>CEP</span>
                  <input
                    className="cadastro-input"
                    type="text"
                    placeholder="00000000"
                    value={cep}
                    onChange={e => setCep(e.target.value)}
                    required
                  />
                </label>
                <label className="cadastro-label" style={{ flex: 1 }}>
                  <span>Número</span>
                  <input
                    className="cadastro-input"
                    type="text"
                    placeholder="150"
                    value={numero}
                    onChange={e => setNumero(e.target.value)}
                    required
                  />
                </label>
              </div>

              <label className="cadastro-label">
                <span>Sobre a empresa</span>
                <input
                  className="cadastro-input"
                  type="text"
                  placeholder="Ex: Empresa de tecnologia"
                  value={informacao}
                  onChange={e => setInformacao(e.target.value)}
                  required
                />
              </label>
            </>
          )}

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
