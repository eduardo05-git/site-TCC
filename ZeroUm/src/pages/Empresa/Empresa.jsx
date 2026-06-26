import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Empresa.css';
import { AREAS, MODALIDADES } from '../../constants/vaga';

const API_BASE = 'http://localhost:8080/api/v1';

const AVATAR_CORES = [
  { cor: '#bfdbfe', corT: '#1e40af' },
  { cor: '#e9d5ff', corT: '#6b21a8' },
  { cor: '#bbf7d0', corT: '#15803d' },
  { cor: '#fde68a', corT: '#92400e' },
  { cor: '#fed7aa', corT: '#9a3412' },
];

function iniciais(nome) {
  return (nome || '?').trim().split(/\s+/).slice(0, 2).map(p => p[0]).join('').toUpperCase();
}

function statusCandidaturaInfo(status) {
  if (status === 'VISUALIZADA') return { label: 'Visualizada', className: 'emp-status-aprovada' };
  return { label: 'Enviada', className: 'emp-status-pendente' };
}

const formVazio = {
  nome: '', area: '', modalidade: '', cidade: '', bairro: '',
  cargaHoraria: '', salario: '', descricao: '', requisitos: '',
};

function statusInfo(status) {
  if (status === 'APROVADA') return { label: 'Aprovada', className: 'emp-status-aprovada' };
  if (status === 'RECUSADA') return { label: 'Recusada', className: 'emp-status-recusada' };
  return { label: 'Em análise', className: 'emp-status-pendente' };
}

export default function Empresa() {
  const navigate = useNavigate();
  const usuarioLogado = JSON.parse(localStorage.getItem('user') || '{}');
  const jaLogado = usuarioLogado.nivelAcesso === 'EMPRESA';

  const [step, setStep]           = useState(jaLogado ? 'dashboard' : 'gate');
  const [nomeEmpresa, setNome]    = useState(usuarioLogado.nome || '');
  const [senha, setSenha]         = useState('');
  const [aba, setAba]             = useState('vagas');

  const [empresaId, setEmpresaId]   = useState(null);
  const [vagas, setVagas]           = useState([]);
  const [loadingVagas, setLoadingVagas] = useState(false);
  const [erroVagas, setErroVagas]   = useState('');

  const [form, setForm]           = useState(formVazio);
  const [vagaEditando, setVagaEditando] = useState(null);
  const [enviando, setEnviando]   = useState(false);
  const [erroForm, setErroForm]   = useState('');
  const [publicado, setPublicado] = useState(false);

  const [candidatos, setCandidatos]       = useState([]);
  const [loadingCandidatos, setLoadingCandidatos] = useState(false);
  const [erroCandidatos, setErroCandidatos] = useState('');

  // Descobre o id da empresa do usuário logado
  useEffect(() => {
    if (!jaLogado) return;
    axios.get(`${API_BASE}/empresa`)
      .then(res => {
        const minhaEmpresa = res.data.find(e => e.usuarioId === usuarioLogado.id);
        if (minhaEmpresa) setEmpresaId(minhaEmpresa.id);
        else setErroVagas('Não encontramos o cadastro da sua empresa.');
      })
      .catch(() => setErroVagas('Não foi possível conectar ao servidor.'));
  }, [jaLogado]);

  function carregarVagas(id) {
    setLoadingVagas(true);
    setErroVagas('');
    axios.get(`${API_BASE}/vaga`, { params: { empresaId: id } })
      .then(res => setVagas(res.data))
      .catch(() => setErroVagas('Não foi possível carregar suas vagas.'))
      .finally(() => setLoadingVagas(false));
  }

  useEffect(() => {
    if (empresaId) carregarVagas(empresaId);
  }, [empresaId]);

  useEffect(() => {
    if (aba !== 'candidatos' || vagas.length === 0) return;
    setLoadingCandidatos(true);
    setErroCandidatos('');
    Promise.all([
      Promise.all(vagas.map(v => axios.get(`${API_BASE}/candidatura/vaga/${v.id}`))),
      axios.get(`${API_BASE}/aluno`),
    ])
      .then(([resCandidaturasPorVaga, resAlunos]) => {
        const alunos = resAlunos.data;
        const candidatosEnriquecidos = resCandidaturasPorVaga.flatMap((res, i) => {
          const vaga = vagas[i];
          return res.data.map(c => {
            const aluno = alunos.find(a => a.id === c.alunoId);
            return {
              ...c,
              vagaTitulo: vaga.nome,
              nome: aluno ? aluno.nome : 'Aluno removido',
              curso: aluno ? aluno.curso : '—',
            };
          });
        });
        setCandidatos(candidatosEnriquecidos);
      })
      .catch(() => setErroCandidatos('Não foi possível carregar os candidatos.'))
      .finally(() => setLoadingCandidatos(false));
  }, [aba, vagas]);

  async function marcarVisualizada(candidatura) {
    try {
      await axios.put(`${API_BASE}/candidatura/${candidatura.id}`, {
        alunoId: candidatura.alunoId,
        vagaId: candidatura.vagaId,
        statusCandidatura: 'VISUALIZADA',
      });
      setCandidatos(prev => prev.map(c => c.id === candidatura.id ? { ...c, statusCandidatura: 'VISUALIZADA' } : c));
    } catch {
      setErroCandidatos('Não foi possível atualizar o candidato.');
    }
  }

  function handleEntrar(e) {
    e.preventDefault();
    if (nomeEmpresa.trim() && senha.trim()) setStep('dashboard');
  }

  function handleForm(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function iniciarEdicao(vaga) {
    setVagaEditando(vaga);
    setForm({
      nome: vaga.nome || '',
      area: vaga.area || '',
      modalidade: vaga.modalidade || '',
      cidade: vaga.cidade || '',
      bairro: vaga.bairro || '',
      cargaHoraria: vaga.cargaHoraria || '',
      salario: vaga.salario || '',
      descricao: vaga.descricao || '',
      requisitos: vaga.requisitos || '',
    });
    setErroForm('');
    setAba('publicar');
  }

  function cancelarEdicao() {
    setVagaEditando(null);
    setForm(formVazio);
    setErroForm('');
  }

  async function handlePublicar(e) {
    e.preventDefault();
    setEnviando(true);
    setErroForm('');

    const payload = { ...form, empresaId };

    try {
      if (vagaEditando) {
        await axios.put(`${API_BASE}/vaga/${vagaEditando.id}`, payload);
      } else {
        await axios.post(`${API_BASE}/vaga`, payload);
      }
      setForm(formVazio);
      setVagaEditando(null);
      setPublicado(true);
      setTimeout(() => setPublicado(false), 3000);
      carregarVagas(empresaId);
      setAba('vagas');
    } catch (err) {
      setErroForm('Não foi possível salvar a vaga. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  }

  /* ── GATE ── */
  if (step === 'gate') return (
    <div className="emp-gate-page">
      <div className="emp-gate-card">
        <button type="button" className="emp-gate-back" onClick={() => navigate('/welcome')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Voltar
        </button>

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
          <button className={`emp-nav-item ${aba === 'publicar' ? 'active' : ''}`} onClick={() => { cancelarEdicao(); setAba('publicar'); }}>
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
              <button className="emp-btn-primary" onClick={() => { cancelarEdicao(); setAba('publicar'); }}>+ Nova vaga</button>
            </div>

            <div className="emp-stats-row">
              <div className="emp-stat-card">
                <span className="emp-stat-num">{vagas.length}</span>
                <span className="emp-stat-label">Vagas publicadas</span>
              </div>
              <div className="emp-stat-card">
                <span className="emp-stat-num">{vagas.filter(v => v.statusVaga === 'APROVADA').length}</span>
                <span className="emp-stat-label">Aprovadas</span>
              </div>
              <div className="emp-stat-card">
                <span className="emp-stat-num">{vagas.filter(v => v.statusVaga === 'PENDENTE').length}</span>
                <span className="emp-stat-label">Em análise</span>
              </div>
            </div>

            {erroVagas && <div className="emp-erro-box">{erroVagas}</div>}

            {loadingVagas && <p className="emp-loading-text">Carregando vagas...</p>}

            {!loadingVagas && !erroVagas && vagas.length === 0 && (
              <div className="emp-empty-state">Você ainda não publicou nenhuma vaga.</div>
            )}

            <div className="emp-vagas-list">
              {vagas.map(v => {
                const status = statusInfo(v.statusVaga);
                return (
                  <div className="emp-vaga-row" key={v.id}>
                    <div className="emp-vaga-info">
                      <p className="emp-vaga-titulo">{v.nome}</p>
                      <span className="emp-vaga-area">{v.area}</span>
                      {v.statusVaga === 'RECUSADA' && v.motivoRecusa && (
                        <div className="emp-motivo-recusa">
                          <strong>Motivo da recusa:</strong> {v.motivoRecusa}
                        </div>
                      )}
                    </div>
                    <div className="emp-vaga-meta">
                      <span className={`emp-status-badge ${status.className}`}>{status.label}</span>
                      {v.statusVaga === 'RECUSADA' && (
                        <button className="emp-btn-ghost" onClick={() => iniciarEdicao(v)}>Editar e reenviar</button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── ABA: PUBLICAR VAGA ── */}
        {aba === 'publicar' && (
          <div className="emp-content">
            <div className="emp-content-header">
              <div>
                <h2>{vagaEditando ? 'Editar Vaga' : 'Publicar Vaga'}</h2>
                <p>{vagaEditando
                  ? 'Ajuste os dados e reenvie — a vaga volta para análise do admin.'
                  : 'Preencha os dados e sua vaga será revisada em até 24h.'}</p>
              </div>
            </div>

            {publicado && (
              <div className="emp-success-toast">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                {vagaEditando ? 'Vaga reenviada para análise!' : 'Vaga publicada com sucesso!'}
              </div>
            )}

            {erroForm && <div className="emp-erro-box">{erroForm}</div>}

            <form className="emp-form" onSubmit={handlePublicar}>
              <div className="emp-form-row">
                <div className="emp-field">
                  <label>Título da vaga</label>
                  <input name="nome" placeholder="Ex: Estágio em Desenvolvimento Web" value={form.nome} onChange={handleForm} required />
                </div>
                <div className="emp-field">
                  <label>Área</label>
                  <select name="area" value={form.area} onChange={handleForm} required>
                    <option value="">Selecione a área</option>
                    {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
              </div>

              <div className="emp-form-row">
                <div className="emp-field">
                  <label>Modalidade</label>
                  <select name="modalidade" value={form.modalidade} onChange={handleForm} required>
                    <option value="">Selecione a modalidade</option>
                    {MODALIDADES.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div className="emp-field">
                  <label>Carga horária</label>
                  <input name="cargaHoraria" placeholder="Ex: 6h/dia" value={form.cargaHoraria} onChange={handleForm} />
                </div>
              </div>

              <div className="emp-form-row">
                <div className="emp-field">
                  <label>Cidade</label>
                  <input name="cidade" placeholder="Ex: Barueri" value={form.cidade} onChange={handleForm} />
                </div>
                <div className="emp-field">
                  <label>Bairro</label>
                  <input name="bairro" placeholder="Ex: Jardim Belval" value={form.bairro} onChange={handleForm} />
                </div>
              </div>

              <div className="emp-field">
                <label>Bolsa-auxílio</label>
                <input name="salario" placeholder="Ex: R$ 800,00 ou A combinar" value={form.salario} onChange={handleForm} />
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
                {vagaEditando && (
                  <button type="button" className="emp-btn-ghost" style={{ marginRight: 'auto' }} onClick={cancelarEdicao}>
                    Cancelar edição
                  </button>
                )}
                <button type="submit" className="emp-btn-primary" disabled={enviando}>
                  {enviando ? 'Salvando...' : (vagaEditando ? 'Reenviar vaga' : 'Publicar vaga')}
                </button>
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
                <p>Alunos que se candidataram às suas vagas.</p>
              </div>
            </div>

            {erroCandidatos && <div className="emp-erro-box">{erroCandidatos}</div>}

            {loadingCandidatos && <p className="emp-loading-text">Carregando candidatos...</p>}

            {!loadingCandidatos && !erroCandidatos && vagas.length === 0 && (
              <div className="emp-empty-state">Publique uma vaga para receber candidatos.</div>
            )}

            {!loadingCandidatos && !erroCandidatos && vagas.length > 0 && candidatos.length === 0 && (
              <div className="emp-empty-state">Nenhum candidato ainda.</div>
            )}

            <div className="emp-candidatos-grid">
              {candidatos.map((c, i) => {
                const avatarCor = AVATAR_CORES[i % AVATAR_CORES.length];
                const status = statusCandidaturaInfo(c.statusCandidatura);
                return (
                  <div className="emp-candidato-card" key={c.id}>
                    <div className="emp-cand-avatar" style={{ background: avatarCor.cor, color: avatarCor.corT }}>{iniciais(c.nome)}</div>
                    <div>
                      <p className="emp-cand-nome">{c.nome}</p>
                      <p className="emp-cand-curso">{c.curso}</p>
                      <span className="emp-cand-interesse">{c.vagaTitulo}</span>
                    </div>
                    <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                      <span className={`emp-status-badge ${status.className}`}>{status.label}</span>
                      <button className="emp-btn-ghost" onClick={() => navigate(`/perfil-visualizacao/${c.alunoId}`)}>Ver perfil</button>
                      {c.statusCandidatura !== 'VISUALIZADA' && (
                        <button className="emp-btn-ghost" onClick={() => marcarVisualizada(c)}>Marcar como visualizada</button>
                      )}
                    </div>
                  </div>
                );
              })}
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
