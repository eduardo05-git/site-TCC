import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PerfilVisualizacao.css';

const API_BASE = 'http://localhost:8080/api/v1';

function iniciais(nome) {
  return (nome || '?').trim().split(/\s+/).slice(0, 2).map(p => p[0]).join('').toUpperCase();
}

function PerfilVisualizacao() {
  const { alunoId } = useParams();
  const navigate = useNavigate();

  const [aluno, setAluno] = useState(null);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    axios.get(`${API_BASE}/aluno`)
      .then(res => {
        const meuAluno = res.data.find(a => String(a.id) === String(alunoId));
        if (!meuAluno) {
          setErro('Aluno não encontrado.');
          return;
        }
        setAluno(meuAluno);
        return axios.get(`${API_BASE}/usuario/${meuAluno.usuarioId}`)
          .then(res2 => setEmail(res2.data.email || ''))
          .catch(() => {});
      })
      .catch(() => setErro('Não foi possível carregar o perfil.'))
      .finally(() => setLoading(false));
  }, [alunoId]);

  return (
    <div className="pv-page">
      <div className="pv-container">
        <button type="button" className="pv-voltar" onClick={() => navigate(-1)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Voltar
        </button>

        {loading && <p className="pv-status-text">Carregando perfil...</p>}

        {!loading && (erro || !aluno) && (
          <p className="pv-status-text">{erro || 'Aluno não encontrado.'}</p>
        )}

        {!loading && aluno && (
          <PerfilConteudo aluno={aluno} email={email} />
        )}
      </div>
    </div>
  );
}

function PerfilConteudo({ aluno, email }) {
  const habilidades = aluno.habilidades
    ? aluno.habilidades.split(',').map(s => s.trim()).filter(Boolean)
    : [];
  const semDadosExtras = !aluno.bio && habilidades.length === 0 && !aluno.linkCurriculo && !aluno.linkPortfolio;

  return (
    <>
      <div className="pv-header">
        <div className="pv-avatar">{iniciais(aluno.nome)}</div>
        <div>
          <h1 className="pv-nome">{aluno.nome}</h1>
          <p className="pv-curso">{aluno.curso} · Conclusão em {aluno.conclusao}</p>
        </div>
      </div>

      <div className="pv-section">
        <span className="pv-label">RM</span>
        <p className="pv-value">{aluno.rm}</p>
      </div>

      {email && (
        <div className="pv-section">
          <span className="pv-label">Contato</span>
          <p className="pv-value">{email}</p>
        </div>
      )}

      {aluno.bio && (
        <div className="pv-section">
          <span className="pv-label">Sobre</span>
          <p className="pv-value pv-bio">{aluno.bio}</p>
        </div>
      )}

      {habilidades.length > 0 && (
        <div className="pv-section">
          <span className="pv-label">Habilidades</span>
          <div className="pv-skills">
            {habilidades.map((h, i) => <span key={i} className="pv-skill-tag">{h}</span>)}
          </div>
        </div>
      )}

      {aluno.linkCurriculo && (
        <div className="pv-section">
          <span className="pv-label">Currículo</span>
          <a className="pv-link" href={aluno.linkCurriculo} target="_blank" rel="noopener noreferrer">Abrir currículo →</a>
        </div>
      )}

      {aluno.linkPortfolio && (
        <div className="pv-section">
          <span className="pv-label">Portfólio / LinkedIn</span>
          <a className="pv-link" href={aluno.linkPortfolio} target="_blank" rel="noopener noreferrer">{aluno.linkPortfolio}</a>
        </div>
      )}

      {semDadosExtras && (
        <p className="pv-vazio">Este aluno ainda não completou o perfil.</p>
      )}
    </>
  );
}

export default PerfilVisualizacao;
