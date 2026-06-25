import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Vagas.css";
import { AREAS } from "../../constants/vaga";

const API_BASE = "http://localhost:8080/api/v1";

const ICONE_POR_AREA = {
    "TI / Desenvolvimento": { icone: "dev", iconeBg: "#e8f5e9", iconeColor: "#43a047" },
    "Marketing":            { icone: "chart", iconeBg: "#e3f2fd", iconeColor: "#1976d2" },
    "Design":               { icone: "pen", iconeBg: "#f3e5f5", iconeColor: "#9c27b0" },
    "Administração":        { icone: "people", iconeBg: "#fce4ec", iconeColor: "#e91e63" },
    "Engenharia":           { icone: "support", iconeBg: "#fff3e0", iconeColor: "#f57c00" },
    "Outro":                { icone: "finance", iconeBg: "#e8eaf6", iconeColor: "#3f51b5" },
};
const ICONE_PADRAO = { icone: "finance", iconeBg: "#e8eaf6", iconeColor: "#3f51b5" };

const categorias = ["Todas", ...AREAS];

const IconeVaga = ({ tipo, color }) => {
    switch (tipo) {
        case "dev":
            return (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M8 9l-4 3 4 3M16 9l4 3-4 3M13 6l-2 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            );
        case "chart":
            return (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M18 20V10M12 20V4M6 20v-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            );
        case "pen":
            return (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 19l7-7 3 3-7 7-3-3zM18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="10" cy="14" r="1.5" fill={color}/>
                </svg>
            );
        case "support":
            return (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/>
                    <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" stroke={color} strokeWidth="2" strokeLinecap="round"/>
                </svg>
            );
        case "people":
            return (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            );
        case "finance":
            return (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <line x1="12" y1="1" x2="12" y2="23" stroke={color} strokeWidth="2" strokeLinecap="round"/>
                    <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
                </svg>
            );
        default:
            return null;
    }
};

function VagaCard({ vaga, onVerDetalhes }) {
    return (
        <div className="vaga-card-novo">
            <div className="vaga-card-left">
                <div className="vaga-icone-novo" style={{ background: vaga.iconeBg }}>
                    <IconeVaga tipo={vaga.icone} color={vaga.iconeColor} />
                </div>
            </div>

            <div className="vaga-card-body">
                <div className="vaga-card-top">
                    <h3 className="vaga-titulo">{vaga.titulo}</h3>
                    <span className="vaga-badge">{vaga.categoria}</span>
                </div>
                <p className="vaga-empresa">{vaga.empresa}</p>
                <p className="vaga-descricao">{vaga.descricao}</p>

                <div className="vaga-requisitos-box">
                    <p className="vaga-requisitos-label">Requisitos Básicos:</p>
                    <p className="vaga-requisitos-texto">{vaga.requisitos}</p>
                </div>
            </div>

            <div className="vaga-card-right">
                <button className="vaga-ver-detalhes" onClick={() => onVerDetalhes(vaga)}>
                    Ver Detalhes
                </button>
            </div>
        </div>
    );
}

function ModalDetalhes({ vaga, onFechar, alunoId, jaCandidatado, onCandidatar }) {
    const [enviando, setEnviando] = React.useState(false);
    const [erroCandidatura, setErroCandidatura] = React.useState("");

    React.useEffect(() => {
        setErroCandidatura("");
    }, [vaga]);

    if (!vaga) return null;

    async function handleCandidatar() {
        if (!alunoId) {
            setErroCandidatura("Não encontramos seu cadastro de aluno. Fale com o suporte.");
            return;
        }
        setEnviando(true);
        setErroCandidatura("");
        try {
            await onCandidatar(vaga.id);
        } catch (err) {
            setErroCandidatura("Não foi possível enviar sua candidatura. Tente novamente.");
        } finally {
            setEnviando(false);
        }
    }
    return (
        <div className="modal-overlay" onClick={onFechar}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
                <button className="modal-fechar" onClick={onFechar}>✕</button>
                <div className="modal-header">
                    <div className="vaga-icone-novo modal-icone" style={{ background: vaga.iconeBg }}>
                        <IconeVaga tipo={vaga.icone} color={vaga.iconeColor} />
                    </div>
                    <span className="vaga-badge">{vaga.categoria}</span>
                </div>
                <h2 className="modal-titulo">{vaga.titulo}</h2>
                <p className="modal-empresa">{vaga.empresa}</p>

                {(vaga.modalidade || vaga.cidade || vaga.bairro || vaga.cargaHoraria || vaga.salario) && (
                    <div className="modal-detalhes-grid">
                        {vaga.modalidade && (
                            <div className="modal-detalhe-item">
                                <span className="modal-detalhe-label">Modalidade</span>
                                <span className="modal-detalhe-valor">{vaga.modalidade}</span>
                            </div>
                        )}
                        {(vaga.cidade || vaga.bairro) && (
                            <div className="modal-detalhe-item">
                                <span className="modal-detalhe-label">Local</span>
                                <span className="modal-detalhe-valor">{[vaga.bairro, vaga.cidade].filter(Boolean).join(" - ")}</span>
                            </div>
                        )}
                        {vaga.cargaHoraria && (
                            <div className="modal-detalhe-item">
                                <span className="modal-detalhe-label">Carga horária</span>
                                <span className="modal-detalhe-valor">{vaga.cargaHoraria}</span>
                            </div>
                        )}
                        {vaga.salario && (
                            <div className="modal-detalhe-item">
                                <span className="modal-detalhe-label">Bolsa-auxílio</span>
                                <span className="modal-detalhe-valor">{vaga.salario}</span>
                            </div>
                        )}
                    </div>
                )}

                <div className="modal-secao">
                    <h4>Sobre a vaga</h4>
                    <p>{vaga.descricao}</p>
                </div>

                <div className="modal-secao">
                    <h4>Requisitos</h4>
                    <ul>
                        {(vaga.requisitos || "").split(/\n|,/).map(r => r.trim()).filter(Boolean).map((req, i) => (
                            <li key={i}>{req}</li>
                        ))}
                    </ul>
                </div>

                <div className="modal-secao">
                    <h4>Benefícios</h4>
                    <ul>
                        <li>Bolsa auxílio compatível com o mercado</li>
                        <li>Vale transporte</li>
                        <li>Ambiente colaborativo e inovador</li>
                        <li>Horário flexível</li>
                    </ul>
                </div>

                {erroCandidatura && (
                    <p style={{ color: '#ef4444', fontSize: '0.85rem', textAlign: 'center', marginBottom: '10px' }}>
                        {erroCandidatura}
                    </p>
                )}

                <button
                    className={`modal-btn-inscrever ${jaCandidatado ? "sucesso" : ""}`}
                    onClick={handleCandidatar}
                    disabled={jaCandidatado || enviando}
                >
                    {jaCandidatado ? (
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Candidatura Enviada
                        </span>
                    ) : enviando ? (
                        "Enviando..."
                    ) : (
                        "Se Candidatar"
                    )}
                </button>
            </div>
        </div>
    );
}

function Vagas() {
    const usuarioLogado = JSON.parse(localStorage.getItem("user") || "{}");

    const [vagas, setVagas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState("");
    const [filtro, setFiltro] = useState("Todas");
    const [busca, setBusca] = useState("");
    const [vagaSelecionada, setVagaSelecionada] = useState(null);

    const [alunoId, setAlunoId] = useState(null);
    const [vagasCandidatadas, setVagasCandidatadas] = useState([]);

    useEffect(() => {
        if (usuarioLogado.nivelAcesso !== "ESTUDANTE") return;
        axios.get(`${API_BASE}/aluno`)
            .then(res => {
                const meuAluno = res.data.find(a => a.usuarioId === usuarioLogado.id);
                if (meuAluno) setAlunoId(meuAluno.id);
            })
            .catch(() => {});
    }, []);

    useEffect(() => {
        if (!alunoId) return;
        axios.get(`${API_BASE}/candidatura/aluno/${alunoId}`)
            .then(res => setVagasCandidatadas(res.data.map(c => c.vagaId)))
            .catch(() => {});
    }, [alunoId]);

    async function handleCandidatar(vagaId) {
        await axios.post(`${API_BASE}/candidatura`, { alunoId, vagaId });
        setVagasCandidatadas(prev => [...prev, vagaId]);
    }

    useEffect(() => {
        setLoading(true);
        setErro("");
        Promise.all([
            axios.get(`${API_BASE}/vaga`, { params: { status: "APROVADA" } }),
            axios.get(`${API_BASE}/empresa`),
        ])
            .then(([resVagas, resEmpresas]) => {
                const empresas = resEmpresas.data;
                const nomeEmpresa = (empresaId) => {
                    const e = empresas.find(emp => emp.id === empresaId);
                    return e ? e.nome : "Empresa parceira";
                };
                const vagasEnriquecidas = resVagas.data.map(v => ({
                    ...v,
                    titulo: v.nome,
                    empresa: nomeEmpresa(v.empresaId),
                    categoria: v.area,
                    ...(ICONE_POR_AREA[v.area] || ICONE_PADRAO),
                }));
                setVagas(vagasEnriquecidas);
            })
            .catch(() => setErro("Não foi possível carregar as vagas. Verifique se o servidor está rodando."))
            .finally(() => setLoading(false));
    }, []);

    const vagasFiltradas = vagas.filter(v => {
        const matchCategoria = filtro === "Todas" || v.categoria === filtro;
        const matchBusca = v.titulo.toLowerCase().includes(busca.toLowerCase()) ||
                           v.empresa.toLowerCase().includes(busca.toLowerCase());
        return matchCategoria && matchBusca;
    });

    return (
        <div className="vagas-page">
            {/* Hero */}
            <section className="vagas-hero-novo">
                <div className="vagas-hero-glow" aria-hidden="true"></div>

                <p className="vagas-hero-label">Oportunidades</p>
                <h1 className="vagas-hero-titulo">
                    Encontre sua <span className="vagas-hero-destaque">vaga ideal</span>
                </h1>
                <p className="vagas-hero-sub">
                    Conectamos estudantes às melhores empresas. Explore estágios que vão impulsionar sua carreira.
                </p>
                <div className="vagas-busca-wrapper">
                    <svg className="busca-icone" width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <circle cx="11" cy="11" r="8" stroke="#94a3b8" strokeWidth="2"/>
                        <path d="M21 21l-4.35-4.35" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <input
                        className="vagas-busca"
                        type="text"
                        placeholder="Buscar por cargo ou empresa..."
                        value={busca}
                        onChange={e => setBusca(e.target.value)}
                    />
                </div>

                <div className="vagas-hero-stats">
                    <span><strong>+90</strong> vagas abertas</span>
                    <span className="vagas-hero-stats-divider" />
                    <span><strong>40+</strong> empresas parceiras</span>
                    <span className="vagas-hero-stats-divider" />
                    <span><strong>200+</strong> alunos contratados</span>
                </div>
            </section>

            {/* Filtros */}
            <div className="vagas-filtros-wrapper">
                <div className="vagas-filtros">
                    {categorias.map(cat => (
                        <button
                            key={cat}
                            className={`filtro-btn${filtro === cat ? " ativo" : ""}`}
                            onClick={() => setFiltro(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid de vagas */}
            <div className="vagas-grid-wrapper">
                {loading ? (
                    <div className="vagas-empty">
                        <p>Carregando vagas...</p>
                    </div>
                ) : erro ? (
                    <div className="vagas-empty">
                        <p>{erro}</p>
                    </div>
                ) : vagasFiltradas.length === 0 ? (
                    <div className="vagas-empty">
                        <p>Nenhuma vaga encontrada para este filtro.</p>
                    </div>
                ) : (
                    <div className="vagas-grid">
                        {vagasFiltradas.map((vaga) => (
                            <VagaCard key={vaga.id} vaga={vaga} onVerDetalhes={setVagaSelecionada} />
                        ))}
                    </div>
                )}

                <div className="vagas-cta">
                    <button className="vagas-cta-btn">Explorar Todas as Vagas</button>
                </div>
            </div>

            {/* Modal */}
            <ModalDetalhes
                vaga={vagaSelecionada}
                onFechar={() => setVagaSelecionada(null)}
                alunoId={alunoId}
                jaCandidatado={vagaSelecionada ? vagasCandidatadas.includes(vagaSelecionada.id) : false}
                onCandidatar={handleCandidatar}
            />
        </div>
    );
}

export default Vagas;
