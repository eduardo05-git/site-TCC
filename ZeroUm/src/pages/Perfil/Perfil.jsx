import React, { useState, useEffect } from 'react';

import axios from 'axios';
import './Perfil.css';
import { DropzoneArea } from './DropzoneArea';

const API_BASE_URL = 'http://localhost:8080/api/v1/usuario';

const minhasVagasMock = [
  {
    id: 1,
    titulo: 'Estágio Front-end React',
    empresa: 'Tech Solutions',
    status: 'pendente',
    data: '12/10/2026'
  },
  {
    id: 2,
    titulo: 'Estágio em Marketing Digital',
    empresa: 'Growth Pro',
    status: 'recusada',
    data: '08/10/2026'
  },
  {
    id: 3,
    titulo: 'Estágio em UI/UX Design',
    empresa: 'Creative Minds Studio',
    status: 'entrou em contato',
    data: '01/10/2026'
  }
];

function Perfil() {
  const usuarioLogado = JSON.parse(localStorage.getItem('user') || '{}');

  const [nome, setNome] = useState(usuarioLogado.nome || '');
  const [email, setEmail] = useState(usuarioLogado.email || '');
  const [links, setLinks] = useState('');
  const [bio, setBio] = useState('');
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState('');

  // Estado para as habilidades
  const [skills, setSkills] = useState(['JavaScript', 'React', 'CSS', 'HTML']);
  const [newSkill, setNewSkill] = useState('');
  const [activeTab, setActiveTab] = useState('dados');

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault();
      if (newSkill.trim() !== '' && !skills.includes(newSkill.trim())) {
        setSkills([...skills, newSkill.trim()]);
        setNewSkill('');
      }
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!usuarioLogado.id) {
      setFeedback('Usuário não identificado. Faça login novamente.');
      return;
    }
    setSaving(true);
    setFeedback('');
    try {
      const dadosAtualizados = { nome, email };
      const response = await axios.put(`${API_BASE_URL}/${usuarioLogado.id}`, dadosAtualizados);
      localStorage.setItem('user', JSON.stringify({ ...usuarioLogado, ...response.data }));
      setFeedback('Perfil salvo com sucesso!');
      setTimeout(() => setFeedback(''), 3000);
    } catch (err) {
      setFeedback('Erro ao salvar. Verifique o servidor.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="perfil-page">
      <div className="perfil-container border-gradient">
        {/* Banner/Header do Perfil */}
        <div className="perfil-header">
          <div className="perfil-cover"></div>
          <div className="perfil-avatar-wrapper">
            <div className="perfil-avatar">
              <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="perfil-avatar-icon">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
          </div>
        </div>

        <div className="perfil-body">
          {/* Coluna Lateral (Informações Rápidas) */}
          <aside className="perfil-sidebar">
            <h1 className="perfil-name">{nome || 'Usuário'}</h1>
            <p className="perfil-role">{usuarioLogado.nivelAcesso === 'ESTUDANTE' ? 'Estudante' : usuarioLogado.nivelAcesso === 'EMPRESA' ? 'Empresa' : usuarioLogado.nivelAcesso || 'Usuário'}</p>

            <div className="perfil-contact-info">
              <div className="info-item">
                <span className="info-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </span>
                <span>{email || '—'}</span>
              </div>
            </div>
            
            <div className="perfil-skills">
              <h3>Habilidades</h3>
              <div className="skills-tags">
                {skills.map((skill, index) => (
                  <span key={index} className="skill-tag">
                    {skill}
                    <button type="button" className="remove-skill-btn" onClick={() => handleRemoveSkill(skill)}>×</button>
                  </span>
                ))}
              </div>
              
              <div className="add-skill-form">
                <input 
                  type="text" 
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={handleAddSkill}
                  placeholder="Nova habilidade..."
                  className="add-skill-input"
                />
                <button type="button" className="add-skill-btn" onClick={handleAddSkill}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </button>
              </div>
              
            </div>
          </aside>

          {/* Área Principal (Formulários e Bio) */}
          <main className="perfil-content">
            <div className="perfil-tabs">
              <button 
                type="button"
                className={`perfil-tab-btn ${activeTab === 'dados' ? 'ativo' : ''}`}
                onClick={() => setActiveTab('dados')}
              >
                Meu Perfil
              </button>
              <button 
                type="button"
                className={`perfil-tab-btn ${activeTab === 'vagas' ? 'ativo' : ''}`}
                onClick={() => setActiveTab('vagas')}
              >
                Minhas Vagas
              </button>
            </div>

            {activeTab === 'dados' ? (
              <form className="perfil-form" onSubmit={handleSubmit}>

                {feedback && (
                <p style={{ color: feedback.includes('sucesso') ? '#4ade80' : '#f87171', marginBottom: '12px' }}>
                  {feedback}
                </p>
              )}

              <div className="perfil-section">
                <h2>Dados da Conta</h2>
                <div className="perfil-field">
                  <label>Nome</label>
                  <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Seu nome completo" />
                </div>
                <div className="perfil-field">
                  <label>E-mail</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" />
                </div>
              </div>

              <div className="perfil-section">
                <h2>Sobre Mim</h2>
                <div className="perfil-field">
                  <textarea
                    rows="4"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Escreva um breve resumo sobre você..."
                  ></textarea>
                </div>
              </div>

              <div className="perfil-section split-section">
                <div className="perfil-field half-width">
                  <label>Documento / Currículo</label>
                  <div className="dropzone-wrapper">
                    <DropzoneArea />
                  </div>
                </div>

                <div className="perfil-field half-width links-section">
                  <label>Links Relevantes (Portfólio/LinkedIn)</label>
                  <input
                    type="url"
                    value={links}
                    onChange={(e) => setLinks(e.target.value)}
                    placeholder="https://meu-portfolio.com"
                  />
                  <small className="help-text">Insira URLs que ajudem as empresas a verem seu trabalho.</small>
                </div>
              </div>

              <div className="perfil-actions">
                <button type="submit" className="btn-save-perfil" disabled={saving}>
                  {saving ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>

            </form>
            ) : (
              <div className="perfil-form">
                <div className="perfil-section">
                  <h2>Acompanhamento de Vagas</h2>
                  <div className="minhas-vagas-grid">
                    {minhasVagasMock.map(vaga => (
                      <div key={vaga.id} className="minhas-vagas-card">
                        <div className="card-vaga-top">
                          <h3>{vaga.titulo}</h3>
                          <span className={`badge-status status-${vaga.status.replace(/ /g, '-')}`}>
                            {vaga.status}
                          </span>
                        </div>
                        <p className="card-vaga-empresa">{vaga.empresa}</p>
                        <p className="card-vaga-data">Candidatura em: {vaga.data}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>

      </div>
    </div>
  );
}

export default Perfil;
