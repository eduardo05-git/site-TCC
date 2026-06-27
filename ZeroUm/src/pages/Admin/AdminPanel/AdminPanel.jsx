import { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPanel.css';

const API_BASE_URL = 'http://localhost:8080/api/v1/usuario';
const API_VAGA_URL = 'http://localhost:8080/api/v1/vaga';
const API_EMPRESA_URL = 'http://localhost:8080/api/v1/empresa';

export default function AdminPanel() {
  const [aba, setAba]             = useState('overview');
  const [vagas, setVagas]         = useState([]);
  const [empresas, setEmpresas]   = useState([]);
  const [totalAprovadas, setTotalAprovadas] = useState(0);
  const [loadingVagas, setLoadingVagas] = useState(false);
  const [erroVagas, setErroVagas] = useState('');
  const [vagaRecusando, setVagaRecusando] = useState(null);
  const [motivo, setMotivo]       = useState('');
  const [processando, setProcessando] = useState(null);
  const [todasVagas, setTodasVagas] = useState([]);
  const [loadingTodasVagas, setLoadingTodasVagas] = useState(false);
  const [erroTodasVagas, setErroTodasVagas] = useState('');
  const [vagaRemovendo, setVagaRemovendo] = useState(null);
  const [motivoRemocao, setMotivoRemocao] = useState('');
  const [users, setUsers]         = useState([]);
  const [editingUser, setEditing] = useState(null);
  const [formData, setFormData]   = useState({});

  function carregarVagasPendentes() {
    setLoadingVagas(true);
    setErroVagas('');
    Promise.all([
      axios.get(API_VAGA_URL, { params: { status: 'PENDENTE' } }),
      axios.get(API_EMPRESA_URL),
    ])
      .then(([resVagas, resEmpresas]) => {
        setVagas(resVagas.data);
        setEmpresas(resEmpresas.data);
      })
      .catch(() => setErroVagas('Não foi possível carregar as vagas pendentes.'))
      .finally(() => setLoadingVagas(false));
  }

  function carregarTodasVagas() {
    setLoadingTodasVagas(true);
    setErroTodasVagas('');
    Promise.all([
      axios.get(API_VAGA_URL),
      axios.get(API_EMPRESA_URL),
    ])
      .then(([resVagas, resEmpresas]) => {
        setTodasVagas(resVagas.data);
        setEmpresas(resEmpresas.data);
      })
      .catch(() => setErroTodasVagas('Não foi possível carregar as vagas.'))
      .finally(() => setLoadingTodasVagas(false));
  }

  useEffect(() => {
    if (aba === 'usuarios' || aba === 'overview') {
      axios.get(API_BASE_URL)
        .then(r => setUsers(r.data))
        .catch(() => setUsers([]));
    }
    if (aba === 'vagas' || aba === 'overview') {
      carregarVagasPendentes();
      axios.get(API_VAGA_URL, { params: { status: 'APROVADA' } })
        .then(r => setTotalAprovadas(r.data.length))
        .catch(() => {});
    }
    if (aba === 'todas-vagas') {
      carregarTodasVagas();
    }
  }, [aba]);

  function getEmpresa(empresaId) {
    return empresas.find(e => e.id === empresaId);
  }

  async function aprovar(id) {
    setProcessando(id);
    try {
      await axios.put(`${API_VAGA_URL}/${id}/aprovar`);
      setVagas(prev => prev.filter(v => v.id !== id));
      setTotalAprovadas(prev => prev + 1);
    } catch {
      setErroVagas('Não foi possível aprovar a vaga. Tente novamente.');
    } finally {
      setProcessando(null);
    }
  }

  function abrirRecusa(id) {
    setVagaRecusando(id);
    setMotivo('');
  }

  function cancelarRecusa() {
    setVagaRecusando(null);
    setMotivo('');
  }

  async function confirmarRecusa(id) {
    if (!motivo.trim()) return;
    setProcessando(id);
    try {
      await axios.put(`${API_VAGA_URL}/${id}/recusar`, { motivoRecusa: motivo.trim() });
      setVagas(prev => prev.filter(v => v.id !== id));
      setVagaRecusando(null);
      setMotivo('');
    } catch {
      setErroVagas('Não foi possível recusar a vaga. Tente novamente.');
    } finally {
      setProcessando(null);
    }
  }

  function abrirRemocao(id) {
    setVagaRemovendo(id);
    setMotivoRemocao('');
  }

  function cancelarRemocao() {
    setVagaRemovendo(null);
    setMotivoRemocao('');
  }

  async function confirmarRemocao(id) {
    if (!motivoRemocao.trim()) return;
    setProcessando(id);
    try {
      await axios.put(`${API_VAGA_URL}/${id}/recusar`, { motivoRecusa: motivoRemocao.trim() });
      setTodasVagas(prev => prev.map(v => v.id === id ? { ...v, statusVaga: 'RECUSADA', motivoRecusa: motivoRemocao.trim() } : v));
      setVagaRemovendo(null);
      setMotivoRemocao('');
    } catch {
      setErroTodasVagas('Não foi possível remover a vaga. Tente novamente.');
    } finally {
      setProcessando(null);
    }
  }

  function startEdit(user) {
    setEditing(user.id);
    setFormData({ nome: user.nome, email: user.email, nivelAcesso: user.nivelAcesso, statusUsuario: user.statusUsuario });
  }

  function handleChange(e) {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleUpdate(id) {
    axios.put(`${API_BASE_URL}/${id}`, formData)
      .then(() => { setEditing(null); axios.get(API_BASE_URL).then(r => setUsers(r.data)); })
      .catch(err => console.error(err));
  }

  function handleToggleStatus(user) {
    const novoStatus = user.statusUsuario === 'ATIVO' ? 'INATIVO' : 'ATIVO';
    const acao = novoStatus === 'INATIVO' ? 'desativar' : 'reativar';
    if (!window.confirm(`Tem certeza que deseja ${acao} o usuário ${user.nome}?`)) return;
    axios.put(`${API_BASE_URL}/${user.id}`, { statusUsuario: novoStatus })
      .then(() => setUsers(prev => prev.map(u => u.id === user.id ? { ...u, statusUsuario: novoStatus } : u)))
      .catch(err => console.error(err));
  }

  return (
    <div className="adm-page">

      {/* ── SIDEBAR ── */}
      <aside className="adm-sidebar">
        <div className="adm-logo">Neway</div>

        <div className="adm-profile">
          <div className="adm-avatar">ADM</div>
          <div>
            <p className="adm-profile-name">Administrador</p>
            <span className="adm-profile-badge">Admin</span>
          </div>
        </div>

        <nav className="adm-nav">
          <button className={`adm-nav-item ${aba === 'overview'  ? 'active' : ''}`} onClick={() => setAba('overview')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/><rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/><rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/><rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/></svg>
            Visão Geral
          </button>
          <button className={`adm-nav-item ${aba === 'vagas'    ? 'active' : ''}`} onClick={() => setAba('vagas')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" stroke="currentColor" strokeWidth="2"/></svg>
            Vagas Pendentes
            {vagas.length > 0 && <span className="adm-badge">{vagas.length}</span>}
          </button>
          <button className={`adm-nav-item ${aba === 'todas-vagas' ? 'active' : ''}`} onClick={() => setAba('todas-vagas')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 7l9-4 9 4-9 4-9-4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 12l9 4 9-4M3 17l9 4 9-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Vagas
          </button>
          <button className={`adm-nav-item ${aba === 'usuarios' ? 'active' : ''}`} onClick={() => setAba('usuarios')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            Usuários
          </button>
        </nav>

        <button className="adm-sair" onClick={() => { localStorage.removeItem('user'); window.location.href = '/welcome'; }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Sair
        </button>
      </aside>

      {/* ── MAIN ── */}
      <main className="adm-main">
        <div className="adm-main-inner">

          {/* ── OVERVIEW ── */}
          {aba === 'overview' && (
            <div className="adm-content">
              <div className="adm-header">
                <h2>Visão Geral</h2>
                <p>Resumo da plataforma Neway.</p>
              </div>

              <div className="adm-stats">
                <div className="adm-stat-card">
                  <div className="adm-stat-icon blue">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                  </div>
                  <div>
                    <p className="adm-stat-num">{users.length || '—'}</p>
                    <p className="adm-stat-label">Usuários registrados</p>
                  </div>
                </div>
                <div className="adm-stat-card">
                  <div className="adm-stat-icon yellow">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/></svg>
                  </div>
                  <div>
                    <p className="adm-stat-num">{vagas.length}</p>
                    <p className="adm-stat-label">Vagas pendentes</p>
                  </div>
                </div>
                <div className="adm-stat-card">
                  <div className="adm-stat-icon green">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <div>
                    <p className="adm-stat-num">{totalAprovadas}</p>
                    <p className="adm-stat-label">Vagas aprovadas</p>
                  </div>
                </div>
              </div>

              <div className="adm-quick-actions">
                <button className="adm-action-card" onClick={() => setAba('vagas')}>
                  <div className="adm-action-icon yellow">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" stroke="currentColor" strokeWidth="2"/></svg>
                  </div>
                  <div>
                    <p className="adm-action-title">Revisar Vagas</p>
                    <p className="adm-action-sub">{vagas.length} aguardando aprovação</p>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                <button className="adm-action-card" onClick={() => setAba('usuarios')}>
                  <div className="adm-action-icon blue">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/></svg>
                  </div>
                  <div>
                    <p className="adm-action-title">Gerenciar Usuários</p>
                    <p className="adm-action-sub">Edite e ative/desative contas</p>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
            </div>
          )}

          {/* ── VAGAS PENDENTES ── */}
          {aba === 'vagas' && (
            <div className="adm-content">
              <div className="adm-header">
                <h2>Vagas Pendentes</h2>
                <p>{vagas.length} vaga{vagas.length !== 1 ? 's' : ''} aguardando revisão.</p>
              </div>

              {erroVagas && <div className="adm-erro-box">{erroVagas}</div>}

              {loadingVagas ? (
                <div className="adm-empty"><p>Carregando vagas...</p></div>
              ) : vagas.length === 0 ? (
                <div className="adm-empty">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <p>Nenhuma vaga pendente. Excelente trabalho!</p>
                </div>
              ) : (
                <div className="adm-vagas-list">
                  {vagas.map(v => {
                    const empresa = getEmpresa(v.empresaId);
                    return (
                    <div className="adm-vaga-card" key={v.id}>
                      <div className="adm-vaga-top">
                        <div>
                          <p className="adm-vaga-titulo">{v.nome}</p>
                          <p className="adm-vaga-empresa">{empresa ? empresa.nome : '—'} · Enviado em {new Date(v.dataCadastro).toLocaleDateString('pt-BR')}</p>
                          {empresa && (
                            <p className="adm-vaga-empresa-doc">CNPJ: {empresa.cnpj || '—'} · Tel: {empresa.telefone || '—'}</p>
                          )}
                        </div>
                        <span className="adm-vaga-area">{v.area}</span>
                      </div>

                      <p className="adm-vaga-descricao">{v.descricao}</p>

                      {(v.modalidade || v.cidade || v.bairro || v.cargaHoraria || v.salario) && (
                        <div className="adm-vaga-detalhes">
                          {v.modalidade && <span><strong>Modalidade:</strong> {v.modalidade}</span>}
                          {(v.cidade || v.bairro) && <span><strong>Local:</strong> {[v.bairro, v.cidade].filter(Boolean).join(' - ')}</span>}
                          {v.cargaHoraria && <span><strong>Carga horária:</strong> {v.cargaHoraria}</span>}
                          {v.salario && <span><strong>Bolsa-auxílio:</strong> {v.salario}</span>}
                        </div>
                      )}

                      {v.requisitos && <p className="adm-vaga-req"><strong>Requisitos:</strong> {v.requisitos}</p>}
                      <div className="adm-vaga-actions">
                        <button className="adm-btn-aprovar" disabled={processando === v.id} onClick={() => aprovar(v.id)}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          Aprovar
                        </button>
                        <button className="adm-btn-rejeitar" disabled={processando === v.id} onClick={() => abrirRecusa(v.id)}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
                          Rejeitar
                        </button>
                      </div>

                      {vagaRecusando === v.id && (
                        <div className="adm-recusa-painel">
                          <label htmlFor={`adm-motivo-${v.id}`}>Motivo da recusa (obrigatório)</label>
                          <textarea
                            id={`adm-motivo-${v.id}`}
                            rows={2}
                            placeholder="Explique pra empresa o que precisa ajustar..."
                            value={motivo}
                            onChange={e => setMotivo(e.target.value)}
                            autoFocus
                          />
                          <div className="adm-recusa-actions">
                            <button className="adm-btn-cancelar-recusa" onClick={cancelarRecusa}>Cancelar</button>
                            <button
                              className="adm-btn-confirmar-recusa"
                              disabled={!motivo.trim() || processando === v.id}
                              onClick={() => confirmarRecusa(v.id)}
                            >
                              {processando === v.id ? 'Enviando...' : 'Confirmar recusa'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );})}
                </div>
              )}
            </div>
          )}

          {/* ── TODAS AS VAGAS ── */}
          {aba === 'todas-vagas' && (
            <div className="adm-content">
              <div className="adm-header">
                <h2>Vagas</h2>
                <p>{todasVagas.length} vaga{todasVagas.length !== 1 ? 's' : ''} no total — aprovadas, pendentes e recusadas.</p>
              </div>

              {erroTodasVagas && <div className="adm-erro-box">{erroTodasVagas}</div>}

              {loadingTodasVagas ? (
                <div className="adm-empty"><p>Carregando vagas...</p></div>
              ) : todasVagas.length === 0 ? (
                <div className="adm-empty"><p>Nenhuma vaga cadastrada ainda.</p></div>
              ) : (
                <div className="adm-vagas-list">
                  {todasVagas.map(v => {
                    const empresa = getEmpresa(v.empresaId);
                    const statusClasse = v.statusVaga === 'APROVADA' ? 'aprovada' : v.statusVaga === 'RECUSADA' ? 'recusada' : 'pendente';
                    return (
                      <div className="adm-vaga-card" key={v.id}>
                        <div className="adm-vaga-top">
                          <div>
                            <p className="adm-vaga-titulo">{v.nome}</p>
                            <p className="adm-vaga-empresa">{empresa ? empresa.nome : '—'} · Enviado em {new Date(v.dataCadastro).toLocaleDateString('pt-BR')}</p>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span className={`adm-status-pill ${statusClasse}`}>{v.statusVaga}</span>
                            <span className="adm-vaga-area">{v.area}</span>
                          </div>
                        </div>

                        <p className="adm-vaga-descricao">{v.descricao}</p>

                        {v.statusVaga === 'RECUSADA' && v.motivoRecusa && (
                          <p className="adm-vaga-req"><strong>Motivo:</strong> {v.motivoRecusa}</p>
                        )}

                        <div className="adm-vaga-actions">
                          <button className="adm-btn-rejeitar" disabled={processando === v.id} onClick={() => abrirRemocao(v.id)}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0l-1 14a2 2 0 01-2 2H7a2 2 0 01-2-2L4 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            Remover
                          </button>
                        </div>

                        {vagaRemovendo === v.id && (
                          <div className="adm-recusa-painel">
                            <label htmlFor={`adm-motivo-remocao-${v.id}`}>Motivo da remoção (a empresa vai ver isso)</label>
                            <textarea
                              id={`adm-motivo-remocao-${v.id}`}
                              rows={2}
                              placeholder="Explique pra empresa por que a vaga foi removida..."
                              value={motivoRemocao}
                              onChange={e => setMotivoRemocao(e.target.value)}
                              autoFocus
                            />
                            <div className="adm-recusa-actions">
                              <button className="adm-btn-cancelar-recusa" onClick={cancelarRemocao}>Cancelar</button>
                              <button
                                className="adm-btn-confirmar-recusa"
                                disabled={!motivoRemocao.trim() || processando === v.id}
                                onClick={() => confirmarRemocao(v.id)}
                              >
                                {processando === v.id ? 'Removendo...' : 'Confirmar remoção'}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── USUÁRIOS ── */}
          {aba === 'usuarios' && (
            <div className="adm-content">
              <div className="adm-header">
                <h2>Usuários</h2>
                <p>{users.length} usuário{users.length !== 1 ? 's' : ''} cadastrado{users.length !== 1 ? 's' : ''}.</p>
              </div>

              {users.length === 0 ? (
                <div className="adm-empty"><p>Nenhum usuário encontrado ou servidor offline.</p></div>
              ) : (
                <div className="adm-table-wrap">
                  <table className="adm-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>E-mail</th>
                        <th>Nível</th>
                        <th>Status</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user.id}>
                          <td className="adm-td-id">#{user.id}</td>
                          {editingUser === user.id ? (
                            <>
                              <td><input className="adm-input" name="nome"          value={formData.nome          || ''} onChange={handleChange} /></td>
                              <td><input className="adm-input" name="email"         value={formData.email         || ''} onChange={handleChange} /></td>
                              <td>
                                <select className="adm-input" name="nivelAcesso" value={formData.nivelAcesso || ''} onChange={handleChange}>
                                  <option value="ESTUDANTE">Estudante</option>
                                  <option value="EMPRESA">Empresa</option>
                                  <option value="ADMIN">Administrador</option>
                                </select>
                              </td>
                              <td>
                                <select className="adm-input" name="statusUsuario" value={formData.statusUsuario || ''} onChange={handleChange}>
                                  <option value="ATIVO">Ativo</option>
                                  <option value="INATIVO">Inativo</option>
                                </select>
                              </td>
                              <td className="adm-td-actions">
                                <button className="adm-btn-save"   onClick={() => handleUpdate(user.id)}>Salvar</button>
                                <button className="adm-btn-cancel" onClick={() => setEditing(null)}>Cancelar</button>
                              </td>
                            </>
                          ) : (
                            <>
                              <td>{user.nome}</td>
                              <td className="adm-td-email">{user.email}</td>
                              <td><span className={`adm-nivel-badge ${user.nivelAcesso?.toLowerCase()}`}>{user.nivelAcesso}</span></td>
                              <td><span className={`adm-status-badge ${user.statusUsuario === 'ATIVO' ? 'ativo' : 'inativo'}`}>{user.statusUsuario}</span></td>
                              <td className="adm-td-actions">
                                <button className="adm-btn-edit"   onClick={() => startEdit(user)}>Editar</button>
                                <button className="adm-btn-delete" onClick={() => handleToggleStatus(user)}>
                                  {user.statusUsuario === 'ATIVO' ? 'Desativar' : 'Ativar'}
                                </button>
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
