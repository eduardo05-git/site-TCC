import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Welcome.css';

const API_BASE = 'http://localhost:8080/api/v1';

const AREA_VISUAL = {
    'TI / Desenvolvimento': {
        tag: 'Dev', bg: 'rgba(37,99,235,0.2)', cor: '#93c5fd',
        icone: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><polyline points="16 18 22 12 16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><polyline points="8 6 2 12 8 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    },
    'Marketing': {
        tag: 'Mkt', bg: 'rgba(251,146,60,0.2)', cor: '#fdba74',
        icone: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><line x1="18" y1="20" x2="18" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="12" y1="20" x2="12" y2="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="6" y1="20" x2="6" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
    },
    'Design': {
        tag: 'Design', bg: 'rgba(5,150,105,0.2)', cor: '#6ee7b7',
        icone: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 19l7-7 3 3-7 7-3-3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    },
    'Administração': {
        tag: 'Adm', bg: 'rgba(219,39,119,0.2)', cor: '#f9a8d4',
        icone: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    },
    'Engenharia': {
        tag: 'Eng', bg: 'rgba(217,119,6,0.2)', cor: '#fcd34d',
        icone: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
    },
    'Outro': {
        tag: 'Vaga', bg: 'rgba(99,102,241,0.2)', cor: '#a5b4fc',
        icone: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><line x1="12" y1="1" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
    },
};
const AREA_VISUAL_PADRAO = AREA_VISUAL['Outro'];

const perfis = [
    {
        tipo: 'ESTUDANTE',
        label: 'Estudante',
        descricao: 'Encontre estágios e impulsione sua carreira.',
        cor: '#4f46e5',
        corLight: '#eef2ff',
        icone: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 3L1 9l11 6 9-4.91V17M5 13.18v4L12 21l7-3.82v-4"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        ),
    },
    {
        tipo: 'EMPRESA',
        label: 'Empresa',
        descricao: 'Publique vagas e encontre os melhores talentos.',
        cor: '#0284c7',
        corLight: '#e0f2fe',
        icone: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        ),
    },
    {
        tipo: 'ADMIN',
        label: 'Administrador',
        descricao: 'Gerencie usuários, vagas e a plataforma.',
        cor: '#7c3aed',
        corLight: '#f5f3ff',
        icone: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
                <path d="M20 21a8 8 0 10-16 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M18 14l1.5 1.5L22 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        ),
    },
];

const API_LOGIN_URL = 'http://localhost:8080/api/v1/usuario/login';

export default function Welcome() {
    const [step, setStep]       = useState('select');
    const [perfil, setPerfil]   = useState(null);
    const [email, setEmail]     = useState('');
    const [senha, setSenha]     = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState('');
    const [vagasDestaque, setVagasDestaque] = useState([]);
    const [totalVagas, setTotalVagas] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        Promise.all([
            axios.get(`${API_BASE}/vaga`, { params: { status: 'APROVADA' } }),
            axios.get(`${API_BASE}/empresa`),
        ])
            .then(([resVagas, resEmpresas]) => {
                const vagas = resVagas.data;
                const empresas = resEmpresas.data;
                setTotalVagas(vagas.length);

                const sorteadas = [...vagas].sort(() => Math.random() - 0.5).slice(0, 3);
                setVagasDestaque(sorteadas.map(v => {
                    const empresa = empresas.find(e => e.id === v.empresaId);
                    return {
                        ...v,
                        empresaNome: empresa ? empresa.nome : 'Empresa parceira',
                        visual: AREA_VISUAL[v.area] || AREA_VISUAL_PADRAO,
                    };
                }));
            })
            .catch(() => {});
    }, []);

    function handleSelecionarPerfil(p) {
        setPerfil(p); setError(''); setEmail(''); setSenha(''); setStep('login');
    }
    function handleVoltar() { setStep('select'); setPerfil(null); setError(''); }

    async function handleLogin(e) {
        e.preventDefault(); setLoading(true); setError('');

        try {
            const res = await axios.post(API_LOGIN_URL, { email, senha, nivelAcesso: perfil.tipo });
            if (res.status === 200 && res.data) {
                localStorage.setItem('user', JSON.stringify(res.data));
                if (res.data.nivelAcesso === 'ADMIN') navigate('/admin-panel');
                else if (res.data.nivelAcesso === 'EMPRESA') navigate('/empresa');
                else navigate('/');
            }
        } catch (err) {
            if (err.response?.status === 401) setError('E-mail ou senha incorretos.');
            else if (err.response) setError(`Erro no servidor (${err.response.status}).`);
            else setError('Servidor indisponível. Verifique o back-end.');
        } finally { setLoading(false); }
    }

    return (
        <div className="wlc-page">

            {/* ════════════ ESQUERDA ════════════ */}
            <aside className="wlc-left">
                <div className="wlc-dots" aria-hidden />

                {/* Logo */}
                <div className="wlc-logo">
                    <span className="wlc-logo-nome">Neway</span>
                </div>

                <div className="wlc-panel">

                    {/* ── SELEÇÃO ── */}
                    {step === 'select' && (
                        <div className="wlc-select">
                            <div className="wlc-heading">
                                <p className="wlc-eyebrow">Plataforma de estágios</p>
                                <h1>
                                    Bem-vindo<br/>
                                    <span className="wlc-accent">de volta.</span>
                                </h1>
                                <p className="wlc-sub">Como você deseja acessar hoje?</p>
                            </div>

                            <div className="wlc-perfis">
                                {perfis.map((p, i) => (
                                    <button
                                        key={p.tipo}
                                        className="wlc-card"
                                        style={{ '--c': p.cor, '--cl': p.corLight, animationDelay: `${0.12 + i * 0.08}s` }}
                                        onClick={() => handleSelecionarPerfil(p)}
                                    >
                                        <span className="wlc-card-icon">{p.icone}</span>
                                        <span className="wlc-card-body">
                                            <strong>{p.label}</strong>
                                            <small>{p.descricao}</small>
                                        </span>
                                        <svg className="wlc-card-arrow" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </button>
                                ))}
                            </div>

                            <div className="wlc-divider"><span>Primeira vez aqui?</span></div>
                            <Link to="/cadastro" className="wlc-register-btn">Criar conta</Link>
                        </div>
                    )}

                    {/* ── LOGIN ── */}
                    {step === 'login' && perfil && (
                        <div className="wlc-login">
                            <button className="wlc-back" onClick={handleVoltar}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                    <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
                                </svg>
                                Voltar
                            </button>

                            <div className="wlc-heading">
                                <p className="wlc-eyebrow" style={{ color: perfil.cor }}>
                                    Acesso · {perfil.label}
                                </p>
                                <h1>
                                    Entre na<br/>
                                    <span className="wlc-accent">sua conta.</span>
                                </h1>
                            </div>

                            <form className="wlc-form" onSubmit={handleLogin}>
                                {error && (
                                    <div className="wlc-error">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                            <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
                                        </svg>
                                        {error}
                                    </div>
                                )}

                                <div className="wlc-field">
                                    <label>E-mail</label>
                                    <div className="wlc-input-wrap">
                                        <svg className="wlc-iicon" width="15" height="15" viewBox="0 0 24 24" fill="none">
                                            <path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z" stroke="currentColor" strokeWidth="2"/>
                                            <path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                        </svg>
                                        <input type="email" placeholder="seu@email.com"
                                            value={email} onChange={e => setEmail(e.target.value)}
                                            required autoFocus style={{ '--c': perfil.cor }}/>
                                    </div>
                                </div>

                                <div className="wlc-field">
                                    <label>Senha</label>
                                    <div className="wlc-input-wrap">
                                        <svg className="wlc-iicon" width="15" height="15" viewBox="0 0 24 24" fill="none">
                                            <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2"/>
                                            <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                        </svg>
                                        <input type="password" placeholder="••••••••"
                                            value={senha} onChange={e => setSenha(e.target.value)}
                                            required style={{ '--c': perfil.cor }}/>
                                    </div>
                                </div>

                                <button className="wlc-submit" disabled={loading}
                                    style={{ '--c': perfil.cor }}>
                                    {loading ? <span className="wlc-spinner"/> : 'Entrar'}
                                </button>
                            </form>

                            <p className="wlc-foot-link">
                                Sem conta? <Link to="/cadastro">Cadastre-se</Link>
                            </p>
                        </div>
                    )}
                </div>

                <p className="wlc-legal">© 2025 Neway · Todos os direitos reservados</p>
            </aside>

            {/* ════════════ DIREITA ════════════ */}
            <section className="wlc-right">
                <div className="wlc-right-bg" />
                <div className="wlc-right-glow" />

                {/* Escadas geométricas */}
                <div className="wlc-stairs wlc-stairs-tr" aria-hidden>
                    {[0,1,2,3,4,5].map(i => <div key={i} className="wlc-stair" style={{ '--i': i }} />)}
                </div>
                <div className="wlc-stairs wlc-stairs-bl" aria-hidden>
                    {[0,1,2,3,4,5].map(i => <div key={i} className="wlc-stair" style={{ '--i': i }} />)}
                </div>

                {/* Tagline */}
                <div className="wlc-tagline">
                    <p className="wlc-tagline-eyebrow">Plataforma de estágios</p>
                    <h2>Encontre sua vaga<br/><em>dos sonhos.</em></h2>
                </div>

                {/* Vagas em destaque */}
                <div className="wlc-center-card">
                    <div className="wlc-cc-header">
                        <div className="wlc-cc-header-left">
                            <span className="wlc-live-dot" />
                            Vagas em destaque
                        </div>
                        <span className="wlc-cc-header-count">
                            {totalVagas === null ? '...' : `${totalVagas} abertas`}
                        </span>
                    </div>

                    {vagasDestaque.map(v => (
                        <div className="wlc-cc-vaga" key={v.id}>
                            <div className="wlc-cc-vaga-icon" style={{ background: v.visual.bg.replace('0.2)', '0.25)'), color: v.visual.cor }}>
                                {v.visual.icone}
                            </div>
                            <div className="wlc-cc-vaga-info">
                                <p className="wlc-cc-vaga-title">{v.nome}</p>
                                <p className="wlc-cc-vaga-company">{v.empresaNome} · {v.cidade || v.modalidade || 'Brasil'}</p>
                            </div>
                            <span className="wlc-cc-tag" style={{ background: v.visual.bg, color: v.visual.cor }}>{v.visual.tag}</span>
                        </div>
                    ))}
                </div>

            </section>

        </div>
    );
}
