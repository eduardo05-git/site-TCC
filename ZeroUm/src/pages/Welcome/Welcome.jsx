import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Welcome.css';

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
        tipo: 'ADMINISTRADOR',
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
    const navigate = useNavigate();

    function handleSelecionarPerfil(p) {
        setPerfil(p); setError(''); setEmail(''); setSenha(''); setStep('login');
    }
    function handleVoltar() { setStep('select'); setPerfil(null); setError(''); }

    async function handleLogin(e) {
        e.preventDefault(); setLoading(true); setError('');

        if (perfil.tipo === 'EMPRESA') {
            navigate('/empresa');
            return;
        }
        if (perfil.tipo === 'ADMINISTRADOR') {
            navigate('/admin-panel');
            return;
        }

        try {
            const res = await axios.post(API_LOGIN_URL, { email, senha, nivelAcesso: perfil.tipo });
            if (res.status === 200 && res.data) {
                localStorage.setItem('user', JSON.stringify(res.data));
                if (perfil.tipo === 'ADMINISTRADOR') { localStorage.setItem('isAdmin', 'true'); navigate('/admin-panel'); }
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
                            <Link to="/cadastro" className="wlc-register-btn">Criar conta grátis</Link>

                            {/* Temporário */}
                            <button className="wlc-skip-btn" onClick={() => {
                                localStorage.setItem('user', JSON.stringify({ nome: 'Visitante' }));
                                navigate('/');
                            }}>
                                Entrar sem login (temporário)
                            </button>
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
                                Sem conta? <Link to="/cadastro">Cadastre-se grátis</Link>
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

                {/* ── Vagas em destaque — centro ── */}
                <div className="wlc-center-card">
                    <div className="wlc-cc-header">
                        <div className="wlc-cc-header-left">
                            <span className="wlc-live-dot" />
                            Vagas em destaque
                        </div>
                        <span className="wlc-cc-header-count">90+ abertas</span>
                    </div>

                    <div className="wlc-cc-vaga">
                        <div className="wlc-cc-vaga-icon" style={{background:'rgba(37,99,235,0.25)',color:'#93c5fd'}}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><polyline points="16 18 22 12 16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><polyline points="8 6 2 12 8 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                        <div className="wlc-cc-vaga-info">
                            <p className="wlc-cc-vaga-title">Estágio Front-end React</p>
                            <p className="wlc-cc-vaga-company">Tech Solutions · São Paulo</p>
                        </div>
                        <span className="wlc-cc-tag" style={{background:'rgba(37,99,235,0.2)',color:'#93c5fd'}}>Dev</span>
                    </div>

                    <div className="wlc-cc-vaga">
                        <div className="wlc-cc-vaga-icon" style={{background:'rgba(124,58,237,0.25)',color:'#c4b5fd'}}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 19l7-7 3 3-7 7-3-3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                        <div className="wlc-cc-vaga-info">
                            <p className="wlc-cc-vaga-title">Estágio UI/UX Design</p>
                            <p className="wlc-cc-vaga-company">Creative Minds · Campinas</p>
                        </div>
                        <span className="wlc-cc-tag" style={{background:'rgba(124,58,237,0.2)',color:'#c4b5fd'}}>Design</span>
                    </div>

                    <div className="wlc-cc-vaga">
                        <div className="wlc-cc-vaga-icon" style={{background:'rgba(5,150,105,0.25)',color:'#6ee7b7'}}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><line x1="18" y1="20" x2="18" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="12" y1="20" x2="12" y2="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="6" y1="20" x2="6" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                        </div>
                        <div className="wlc-cc-vaga-info">
                            <p className="wlc-cc-vaga-title">Estágio em Marketing Digital</p>
                            <p className="wlc-cc-vaga-company">Growth Pro · Remoto</p>
                        </div>
                        <span className="wlc-cc-tag" style={{background:'rgba(5,150,105,0.2)',color:'#6ee7b7'}}>Mkt</span>
                    </div>
                </div>

                {/* ── Cards ao redor ── */}

                {/* Esquerda superior */}
                <div className="wlc-ui-card wlc-card-chart">
                    <div className="wlc-card-top-row">
                        <span className="wlc-card-label">Vagas abertas</span>
                        <span className="wlc-live-dot" />
                    </div>
                    <p className="wlc-card-num">90<span>+</span></p>
                    <svg className="wlc-graph" viewBox="0 0 140 48" fill="none" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="gFill" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#818cf8" stopOpacity=".45"/>
                                <stop offset="100%" stopColor="#818cf8" stopOpacity="0"/>
                            </linearGradient>
                        </defs>
                        <path d="M0 40 C20 36,30 32,45 26 S70 18,90 14 S115 8,140 4"
                            stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                        <path d="M0 48 L0 40 C20 36,30 32,45 26 S70 18,90 14 S115 8,140 4 L140 48 Z"
                            fill="url(#gFill)"/>
                    </svg>
                    <div className="wlc-month-row">
                        {['Jan','Fev','Mar','Abr','Mai'].map(m => <span key={m}>{m}</span>)}
                    </div>
                </div>

                {/* Direita superior */}
                <div className="wlc-ui-card wlc-card-hired">
                    <div className="wlc-card-top-row">
                        <span className="wlc-card-label">Contratados</span>
                    </div>
                    <div className="wlc-avatar-stack">
                        {['#a5b4fc','#93c5fd','#86efac'].map((c, i) => (
                            <div key={i} className="wlc-avatar" style={{ background: c }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="8" r="4" fill="rgba(255,255,255,.85)"/>
                                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="rgba(255,255,255,.85)"/>
                                </svg>
                            </div>
                        ))}
                        <span className="wlc-avatar-more">+200</span>
                    </div>
                    <p className="wlc-card-sub">este semestre</p>
                    <div className="wlc-tag-row">
                        <span className="wlc-tag">Estudante</span>
                        <span className="wlc-tag">Empresa</span>
                    </div>
                </div>

                {/* Esquerda baixo — notificação */}
                <div className="wlc-ui-card wlc-card-notif">
                    <div className="wlc-notif-icon">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"
                                stroke="#4f46e5" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    </div>
                    <div>
                        <p className="wlc-notif-title">Nova vaga!</p>
                        <p className="wlc-notif-sub">Front-end · Tech Solutions</p>
                    </div>
                    <span className="wlc-notif-badge">Agora</span>
                </div>

                {/* Direita baixo — taxa */}
                <div className="wlc-ui-card wlc-card-rate">
                    <p className="wlc-card-label">Taxa de sucesso</p>
                    <div className="wlc-rate-row">
                        <span className="wlc-rate-num">95<small>%</small></span>
                        <svg width="46" height="46" viewBox="0 0 36 36" fill="none">
                            <circle cx="18" cy="18" r="15" stroke="#f1f5f9" strokeWidth="4"/>
                            <circle cx="18" cy="18" r="15" stroke="#4f46e5" strokeWidth="4"
                                strokeDasharray="89 6" strokeDashoffset="23" strokeLinecap="round"/>
                        </svg>
                    </div>
                    <p className="wlc-card-sub">dos alunos empregados</p>
                </div>

                {/* Topo centro — tagline */}
                <div className="wlc-tagline">
                    <p className="wlc-tagline-eyebrow">Plataforma de estágios</p>
                    <h2>Encontre sua vaga<br/><em>dos sonhos.</em></h2>
                    <div className="wlc-dots-nav">
                        <span className="wlc-dot active" />
                        <span className="wlc-dot" />
                        <span className="wlc-dot" />
                    </div>
                </div>

                {/* Orbs nos cantos livres */}
                <div className="wlc-orb wlc-orb-a">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M12 3L1 9l11 6 9-4.91V17M5 13.18v4L12 21l7-3.82v-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
                <div className="wlc-orb wlc-orb-b">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="#fff" strokeWidth="2"/>
                    </svg>
                </div>
                <div className="wlc-orb wlc-orb-c">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                </div>
                <div className="wlc-orb wlc-orb-d">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="#fff" strokeWidth="2" strokeLinejoin="round"/>
                    </svg>
                </div>

            </section>

        </div>
    );
}
