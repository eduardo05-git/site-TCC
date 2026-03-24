import { useState } from 'react';
import './Empresa.css';

const candidatosMock = [
  { id: 1, nome: 'Mateus Rocha',    curso: 'Desenvolvimento Web',  ano: '3º Ano', interesse: 'Front-end React',       avatar: 'MR', cor: '#bfdbfe', corT: '#1e40af' },
  { id: 2, nome: 'Ana Lima',        curso: 'Design Gráfico',       ano: '2º Ano', interesse: 'UI/UX Design',           avatar: 'AL', cor: '#e9d5ff', corT: '#6b21a8' },
  { id: 3, nome: 'Felipe Santos',   curso: 'Infraestrutura de TI', ano: '3º Ano', interesse: 'Suporte / Infra',        avatar: 'FS', cor: '#bbf7d0', corT: '#15803d' },
  { id: 4, nome: 'Julia Mendes',    curso: 'Marketing Digital',    ano: '2º Ano', interesse: 'Marketing / Redes Soc.', avatar: 'JM', cor: '#fde68a', corT: '#92400e' },
  { id: 5, nome: 'Carlos Oliveira', curso: 'Desenvolvimento Web',  ano: '1º Ano', interesse: 'Back-end / APIs',        avatar: 'CO', cor: '#fed7aa', corT: '#9a3412' },
];

const vagasMock = [
  { id: 1, titulo: 'Estágio Front-end React', area: 'TI', candidatos: 8,  status: 'Ativa' },
  { id: 2, titulo: 'Estágio em Marketing',    area: 'Marketing', candidatos: 5, status: 'Ativa' },
];

export default function Empresa() {
  const [step, setStep]           = useState('gate');
  const [nomeEmpresa, setNome]    = useState('');
  const [senha, setSenha]         = useState('');
  const [aba, setAba]             = useState('vagas');
  const [vagas, setVagas]         = useState(vagasMock);
  const [form, setForm]           = useState({ titulo: '', area: '', descricao: '', requisitos: '' });
  const [publicado, setPublicado] = useState(false);

  function handleEntrar(e) {
    e.preventDefault();
    if (nomeEmpresa.trim() && senha.trim()) setStep('dashboard');
  }

  function handleForm(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handlePublicar(e) {
    e.preventDefault();
    setVagas(prev => [...prev, { id: Date.now(), titulo: form.titulo, area: form.area, candidatos: 0, status: 'Ativa' }]);
    setForm({ titulo: '', area: '', descricao: '', requisitos: '' });
    setPublicado(true);
    setTimeout(() => setPublicado(false), 3000);
  }

  /* ── GATE ── */
  if (step === 'gate') return (
    <div className="emp-gate-page">
      <div className="emp-gate-card">
        <div className="emp-gate-logo">Neway</div>
        <h1>Acesso Empresas</h1>
        <p>Entre com os dados da sua empresa para gerenciar vagas e candidatos.</p>

        <form onSubmit={handleEntrar} className="emp-gate-form">
          <div className="emp-field">
            <label>Nome da empresa</label>
            <input
              type="text"
              placeholder="Ex: Tech Solutions"
              value={nomeEmpresa}
              onChange={e => setNome(e.target.value)}
              required
            />
          </div>
          <div className="emp-field">
            <label>Senha</label>
            <input
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="emp-btn-primary">Entrar no portal</button>
        </form>
      </div>
    </div>
  );

  /* ── DASHBOARD ── */
  return (
    <div className="emp-page">

      {/* Sidebar */}
      <aside className="emp-sidebar">
        <div className="emp-sidebar-logo">Neway</div>

        <div className="emp-sidebar-empresa">
          <div className="emp-sidebar-avatar">{nomeEmpresa.slice(0,2).toUpperCase()}</div>
          <div>
            <p className="emp-sidebar-name">{nomeEmpresa}</p>
            <span className="emp-sidebar-badge">Empresa</span>
          </div>
        </div>

        <nav className="emp-nav">
          <button className={`emp-nav-item ${aba === 'vagas' ? 'active' : ''}`} onClick={() => setAba('vagas')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" stroke="currentColor" strokeWidth="2"/></svg>
            Minhas Vagas
          </button>
          <button className={`emp-nav-item ${aba === 'publicar' ? 'active' : ''}`} onClick={() => setAba('publicar')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            Publicar Vaga
          </button>
          <button className={`emp-nav-item ${aba === 'candidatos' ? 'active' : ''}`} onClick={() => setAba('candidatos')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            Candidatos
          </button>
        </nav>

        <button className="emp-sair" onClick={() => setStep('gate')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Sair
        </button>
      </aside>

      {/* Conteúdo */}
      <main className="emp-main">
        <div className="emp-main-inner">

        {/* ── ABA: MINHAS VAGAS ── */}
        {aba === 'vagas' && (
          <div className="emp-content">
            <div className="emp-content-header">
              <div>
                <h2>Minhas Vagas</h2>
                <p>Gerencie as vagas publicadas pela sua empresa.</p>
              </div>
              <button className="emp-btn-primary" onClick={() => setAba('publicar')}>+ Nova vaga</button>
            </div>

            <div className="emp-stats-row">
              <div className="emp-stat-card">
                <span className="emp-stat-num">{vagas.length}</span>
                <span className="emp-stat-label">Vagas ativas</span>
              </div>
              <div className="emp-stat-card">
                <span className="emp-stat-num">{vagas.reduce((a, v) => a + v.candidatos, 0)}</span>
                <span className="emp-stat-label">Total de candidatos</span>
              </div>
              <div className="emp-stat-card">
                <span className="emp-stat-num">{candidatosMock.length}</span>
                <span className="emp-stat-label">Alunos disponíveis</span>
              </div>
            </div>

            <div className="emp-vagas-list">
              {vagas.map(v => (
                <div className="emp-vaga-row" key={v.id}>
                  <div className="emp-vaga-info">
                    <p className="emp-vaga-titulo">{v.titulo}</p>
                    <span className="emp-vaga-area">{v.area}</span>
                  </div>
                  <div className="emp-vaga-meta">
                    <span className="emp-vaga-candidatos">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/></svg>
                      {v.candidatos} candidatos
                    </span>
                    <span className="emp-status-badge">{v.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ABA: PUBLICAR VAGA ── */}
        {aba === 'publicar' && (
          <div className="emp-content">
            <div className="emp-content-header">
              <div>
                <h2>Publicar Vaga</h2>
                <p>Preencha os dados e sua vaga será revisada em até 24h.</p>
              </div>
            </div>

            {publicado && (
              <div className="emp-success-toast">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Vaga publicada com sucesso!
              </div>
            )}

            <form className="emp-form" onSubmit={handlePublicar}>
              <div className="emp-form-row">
                <div className="emp-field">
                  <label>Título da vaga</label>
                  <input name="titulo" placeholder="Ex: Estágio em Desenvolvimento Web" value={form.titulo} onChange={handleForm} required />
                </div>
                <div className="emp-field">
                  <label>Área</label>
                  <select name="area" value={form.area} onChange={handleForm} required>
                    <option value="">Selecione a área</option>
                    <option>TI / Desenvolvimento</option>
                    <option>Marketing</option>
                    <option>Design</option>
                    <option>Administração</option>
                    <option>Engenharia</option>
                    <option>Outro</option>
                  </select>
                </div>
              </div>

              <div className="emp-field">
                <label>Descrição da vaga</label>
                <textarea name="descricao" placeholder="Descreva as responsabilidades, rotina e benefícios..." value={form.descricao} onChange={handleForm} required rows={4} />
              </div>

              <div className="emp-field">
                <label>Requisitos</label>
                <textarea name="requisitos" placeholder="Ex: JavaScript, noções de HTML/CSS, proatividade..." value={form.requisitos} onChange={handleForm} required rows={3} />
              </div>

              <div className="emp-form-footer">
                <button type="submit" className="emp-btn-primary">Publicar vaga</button>
              </div>
            </form>
          </div>
        )}

        {/* ── ABA: CANDIDATOS ── */}
        {aba === 'candidatos' && (
          <div className="emp-content">
            <div className="emp-content-header">
              <div>
                <h2>Candidatos Interessados</h2>
                <p>Alunos da Escola Brasilio Flores disponíveis para estágio.</p>
              </div>
            </div>

            <div className="emp-candidatos-grid">
              {candidatosMock.map(c => (
                <div className="emp-candidato-card" key={c.id}>
                  <div className="emp-cand-avatar" style={{ background: c.cor, color: c.corT }}>{c.avatar}</div>
                  <div>
                    <p className="emp-cand-nome">{c.nome}</p>
                    <p className="emp-cand-curso">{c.curso} · {c.ano}</p>
                    <span className="emp-cand-interesse">{c.interesse}</span>
                  </div>
                  <button className="emp-btn-ghost" style={{ marginTop: 'auto' }}>Ver perfil</button>
                </div>
              ))}
            </div>
          </div>
        )}

        </div>

        <footer className="emp-footer">
          <div className="emp-footer-grid">
            <div>
              <p className="emp-footer-brand">Neway</p>
              <p>Portal de Estágios para a Escola<br/>Brásilio Flores de Azevedo.<br/>Feito de aluno para aluno.</p>
            </div>
            <div>
              <p className="emp-footer-title">Explore</p>
              <a href="/">Início</a>
              <a href="/vagas">Vagas</a>
              <a href="/perfil">Perfil</a>
            </div>
            <div>
              <p className="emp-footer-title">Contato</p>
              <p>contato@newayestagios.com</p>
              <p>(11) 99999-9999</p>
              <p>Jardim Belval, Barueri - SP</p>
            </div>
            <div>
              <p className="emp-footer-title">Siga-nos</p>
              <p>@newayestagios</p>
              <p>@newayestagios</p>
              <p>@newayestagios</p>
            </div>
          </div>
          <div className="emp-footer-bottom">
            <span>© 2025 Portal de Estágios Neway</span>
            <span>Política de Privacidade</span>
          </div>
          <div className="emp-footer-giant">neway</div>
        </footer>
      </main>
    </div>
  );
}
