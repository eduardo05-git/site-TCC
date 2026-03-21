import React, { useState } from "react";
import "./Vagas.css";

const vagas = [
    {
        titulo: "Estágio Front-end React",
        empresa: "Tech Solutions",
        categoria: "Desenvolvimento",
        descricao: "Junte-se ao nosso time ágil desenvolvendo interfaces incríveis de alta performance.",
        requisitos: "JavaScript ES6, HTML5, CSS3. Mente criativa e facilidade com React.",
        iconeBg: "#e8f5e9",
        iconeColor: "#43a047",
        icone: "dev",
    },
    {
        titulo: "Estágio em Marketing Digital",
        empresa: "Growth Pro",
        categoria: "Comunicação",
        descricao: "Ajude marcas a quebrarem recordes com estratégias de tráfego pago e social media.",
        requisitos: "Noções de SEO, Google Ads e ferramentas de análise. Muita criatividade.",
        iconeBg: "#e3f2fd",
        iconeColor: "#1976d2",
        icone: "chart",
    },
    {
        titulo: "Estágio em UI/UX Design",
        empresa: "Creative Minds Studio",
        categoria: "Design",
        descricao: "Desenho de protótipos encantadores com foco na jornada do usuário.",
        requisitos: "Domínio de Figma. Noções básicas de usabilidade. Paixão por cores.",
        iconeBg: "#f3e5f5",
        iconeColor: "#9c27b0",
        icone: "pen",
    },
    {
        titulo: "Estágio em Suporte Técnico",
        empresa: "InfoHelp",
        categoria: "TI",
        descricao: "Atendimento ao cliente e resolução de problemas técnicos de forma ágil.",
        requisitos: "Boa comunicação, conhecimento básico em informática e redes.",
        iconeBg: "#fff3e0",
        iconeColor: "#f57c00",
        icone: "support",
    },
    {
        titulo: "Estágio em Recursos Humanos",
        empresa: "RH Mais",
        categoria: "RH",
        descricao: "Auxiliar nos processos de recrutamento, seleção e cultura organizacional.",
        requisitos: "Cursando Administração, Psicologia ou áreas afins.",
        iconeBg: "#fce4ec",
        iconeColor: "#e91e63",
        icone: "people",
    },
    {
        titulo: "Estágio em Finanças",
        empresa: "Finance Group",
        categoria: "Finanças",
        descricao: "Apoio em análises financeiras e elaboração de relatórios estratégicos.",
        requisitos: "Excel intermediário, cursando Administração ou Economia.",
        iconeBg: "#e8eaf6",
        iconeColor: "#3f51b5",
        icone: "finance",
    },
];

const categorias = ["Todas", "Desenvolvimento", "Comunicação", "Design", "TI", "RH", "Finanças"];

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

function ModalDetalhes({ vaga, onFechar }) {
    if (!vaga) return null;
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

                <div className="modal-secao">
                    <h4>Sobre a vaga</h4>
                    <p>{vaga.descricao}</p>
                </div>

                <div className="modal-secao">
                    <h4>Requisitos</h4>
                    <ul>
                        {vaga.requisitos.split(',').map((req, i) => (
                            <li key={i}>{req.trim()}</li>
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

                <button className="modal-btn-inscrever">Se Candidatar</button>
            </div>
        </div>
    );
}

function Vagas() {
    const [filtro, setFiltro] = useState("Todas");
    const [busca, setBusca] = useState("");
    const [vagaSelecionada, setVagaSelecionada] = useState(null);

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
                {vagasFiltradas.length === 0 ? (
                    <div className="vagas-empty">
                        <p>Nenhuma vaga encontrada para este filtro.</p>
                    </div>
                ) : (
                    <div className="vagas-grid">
                        {vagasFiltradas.map((vaga, i) => (
                            <VagaCard key={i} vaga={vaga} onVerDetalhes={setVagaSelecionada} />
                        ))}
                    </div>
                )}

                <div className="vagas-cta">
                    <button className="vagas-cta-btn">Explorar Todas as Vagas</button>
                </div>
            </div>

            {/* Modal */}
            <ModalDetalhes vaga={vagaSelecionada} onFechar={() => setVagaSelecionada(null)} />
        </div>
    );
}

export default Vagas;
