import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminVagas.css';

const API_BASE = 'http://localhost:8080/api/v1';

function AdminVagas() {
  const [vagas, setVagas] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  const [vagaRecusando, setVagaRecusando] = useState(null); // id da vaga com painel de recusa aberto
  const [motivo, setMotivo] = useState('');
  const [processando, setProcessando] = useState(null); // id da vaga em requisição (aprovar/recusar)

  function carregarDados() {
    setLoading(true);
    setErro('');
    Promise.all([
      axios.get(`${API_BASE}/vaga`, { params: { status: 'PENDENTE' } }),
      axios.get(`${API_BASE}/empresa`),
    ])
      .then(([resVagas, resEmpresas]) => {
        setVagas(resVagas.data);
        setEmpresas(resEmpresas.data);
      })
      .catch(() => setErro('Não foi possível carregar as vagas pendentes.'))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    carregarDados();
  }, []);

  function getEmpresa(empresaId) {
    return empresas.find(e => e.id === empresaId);
  }

  async function handleAprovar(id) {
    setProcessando(id);
    try {
      await axios.put(`${API_BASE}/vaga/${id}/aprovar`);
      setVagas(prev => prev.filter(v => v.id !== id));
    } catch {
      setErro('Não foi possível aprovar a vaga. Tente novamente.');
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
      await axios.put(`${API_BASE}/vaga/${id}/recusar`, { motivoRecusa: motivo.trim() });
      setVagas(prev => prev.filter(v => v.id !== id));
      setVagaRecusando(null);
      setMotivo('');
    } catch {
      setErro('Não foi possível recusar a vaga. Tente novamente.');
    } finally {
      setProcessando(null);
    }
  }

  return (
    <div className="admin-vagas-container">
      <h2>Gerenciamento de Vagas Pendentes</h2>
      <p className="vagas-count">Total de vagas aguardando aprovação: {vagas.length}</p>

      {erro && <div className="vagas-erro-box">{erro}</div>}

      <div className="vagas-table-wrapper">
        <table className="vagas-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título da Vaga</th>
              <th>Empresa</th>
              <th>Data de Envio</th>
              <th>Requisitos Resumidos</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '30px' }}>
                  Carregando vagas...
                </td>
              </tr>
            ) : vagas.length === 0 ? (
              <tr>
                <td colSpan="6" style={{textAlign: 'center', padding: '30px'}}>
                  Nenhuma vaga pendente no momento. Excelente trabalho! 🎉
                </td>
              </tr>
            ) : (
              vagas.map(vaga => {
                const empresa = getEmpresa(vaga.empresaId);
                return (
                <React.Fragment key={vaga.id}>
                  <tr>
                    <td>{vaga.id}</td>
                    <td><strong>{vaga.nome}</strong></td>
                    <td>
                      {empresa ? empresa.nome : '—'}
                      {empresa && <div className="empresa-doc">CNPJ: {empresa.cnpj || '—'} · Tel: {empresa.telefone || '—'}</div>}
                    </td>
                    <td>{new Date(vaga.dataCadastro).toLocaleDateString('pt-BR')}</td>
                    <td className="text-truncate" title={vaga.requisitos}>
                      {vaga.requisitos && vaga.requisitos.length > 50
                        ? `${vaga.requisitos.substring(0, 50)}...`
                        : vaga.requisitos}
                    </td>
                    <td className="action-buttons">
                      <button
                        className="approve-btn"
                        disabled={processando === vaga.id}
                        onClick={() => handleAprovar(vaga.id)}
                      >
                        ✔️ Aprovar
                      </button>
                      <button
                        className="reject-btn"
                        disabled={processando === vaga.id}
                        onClick={() => abrirRecusa(vaga.id)}
                      >
                        ❌ Recusar
                      </button>
                    </td>
                  </tr>

                  <tr className="detalhes-row">
                    <td colSpan="6">
                      <div className="vaga-detalhes-painel">
                        <p className="vaga-detalhes-descricao">{vaga.descricao}</p>
                        {(vaga.modalidade || vaga.cidade || vaga.bairro || vaga.cargaHoraria || vaga.salario) && (
                          <div className="vaga-detalhes-grid">
                            {vaga.modalidade && <span><strong>Modalidade:</strong> {vaga.modalidade}</span>}
                            {(vaga.cidade || vaga.bairro) && <span><strong>Local:</strong> {[vaga.bairro, vaga.cidade].filter(Boolean).join(' - ')}</span>}
                            {vaga.cargaHoraria && <span><strong>Carga horária:</strong> {vaga.cargaHoraria}</span>}
                            {vaga.salario && <span><strong>Bolsa-auxílio:</strong> {vaga.salario}</span>}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>

                  {vagaRecusando === vaga.id && (
                    <tr className="recusa-row">
                      <td colSpan="6">
                        <div className="recusa-painel">
                          <label htmlFor={`motivo-${vaga.id}`}>Motivo da recusa (obrigatório)</label>
                          <textarea
                            id={`motivo-${vaga.id}`}
                            rows={2}
                            placeholder="Explique pra empresa o que precisa ajustar..."
                            value={motivo}
                            onChange={e => setMotivo(e.target.value)}
                            autoFocus
                          />
                          <div className="recusa-painel-actions">
                            <button className="recusa-cancelar-btn" onClick={cancelarRecusa}>
                              Cancelar
                            </button>
                            <button
                              className="recusa-confirmar-btn"
                              disabled={!motivo.trim() || processando === vaga.id}
                              onClick={() => confirmarRecusa(vaga.id)}
                            >
                              {processando === vaga.id ? 'Enviando...' : 'Confirmar recusa'}
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );})
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminVagas;
