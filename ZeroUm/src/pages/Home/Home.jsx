import './home.css';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import estudante from '../../assets/estudante.png';

const vagasDestaque = [
  {
    titulo: "Estágio Front-end React",
    empresa: "Tech Solutions",
    descricao: "Junte-se ao nosso time ágil desenvolvendo interfaces incríveis de alta performance.",
    requisitos: "JavaScript ES6, HTML5, CSS3. Mente criativa e facilidade com React.",
    area: "Desenvolvimento",
    icone: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
    )
  },
  {
    titulo: "Estágio em Marketing Digital",
    empresa: "Growth Pro",
    descricao: "Ajude marcas a quebrarem recordes com estratégias de tráfego pago e social media.",
    requisitos: "Noções de SEO, Google Ads e ferramentas de análise. Muita criatividade.",
    area: "Comunicação",
    icone: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
    )
  },
  {
    titulo: "Estágio em UI/UX Design",
    empresa: "Creative Minds Studio",
    descricao: "Desenho de protótipos encantadores com foco na jornada absurda do usuário.",
    requisitos: "Domínio de Figma. Noções básicas de usabilidade. Paixão por cores.",
    area: "Design",
    icone: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.586 7.586"></path><circle cx="11" cy="11" r="2"></circle></svg>
    )
  }
];

function Home() {
  return (
    <div className="home-modern-landing">
      {/* 1. HERO VIBRANTE E DINÂMICO */}
      <section className="hero-section">
        <div className="hero-glow-bg"></div> {/* Efeito de vidro/Glow */}

        <div className="hero-content">
          <div className="status-pill">
            <span className="pulse-dot"></span> Vagas exclusivas da Escola Brasilio Flores de Azevedo
          </div>

          <h1 className="hero-title">
            Destrave a sua <br />
            <span className="text-gradient">Carreira Profissional</span>
          </h1>

          <p className="hero-subtitle">
            Feito por alunos, para alunos. Encontre estágios nas melhores empresas de tecnologia e destrave seu futuro ainda na escola.
          </p>

          <div className="hero-buttons">
            <Link to="/vagas" className="btn-glow primary">Encontrar meu Estágio</Link>
            <a href="#bento-benefits" className="btn-glow secondary">Explorar o Neway</a>
          </div>

          <div className="hero-stats-row">
            <div className="stat-pill"><strong>+90</strong> vagas vivas</div>
            <div className="stat-pill"><strong>40+</strong> empresas parceiras</div>
            <div className="stat-pill"><strong>95%</strong> de alunos empregados</div>
          </div>
        </div>

        {/* IMAGEM HERO */}
        <div className="hero-img-wrap">
          <div className="hero-img-blob"></div>
          <div className="hero-img-ring"></div>
          <div className="hero-img-ring-inner"></div>
          <div className="hero-img-dot hero-img-dot-1"></div>
          <div className="hero-img-dot hero-img-dot-2"></div>
          <div className="hero-img-dot hero-img-dot-3"></div>
          <img src={estudante} alt="Estudante Neway" className="hero-img" />

          <div className="hero-img-badge badge-top">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            <div>
              <strong>+90 vagas abertas</strong>
              <span>essa semana</span>
            </div>
          </div>

          <div className="hero-img-badge badge-bottom">
            <div className="badge-avatars">
              <div className="badge-av" style={{background:'#bfdbfe',color:'#1e40af'}}>M</div>
              <div className="badge-av" style={{background:'#bbf7d0',color:'#15803d'}}>A</div>
              <div className="badge-av" style={{background:'#fde68a',color:'#92400e'}}>F</div>
            </div>
            <div>
              <strong>200+ alunos</strong>
              <span>já encontraram seu estágio</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAIXA DE STATS */}
      <div className="stats-bar">
        <div className="stats-bar-item">
          <div className="stats-bar-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
          </div>
          <strong>+90</strong>
          <span>vagas ativas</span>
        </div>
        <div className="stats-bar-divider" />
        <div className="stats-bar-item">
          <div className="stats-bar-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <strong>40+</strong>
          <span>empresas parceiras</span>
        </div>
        <div className="stats-bar-divider" />
        <div className="stats-bar-item">
          <div className="stats-bar-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          </div>
          <strong>200+</strong>
          <span>alunos contratados</span>
        </div>
        <div className="stats-bar-divider" />
        <div className="stats-bar-item">
          <div className="stats-bar-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <strong>100%</strong>
          <span>gratuito para alunos</span>
        </div>
      </div>

      {/* 2. COMO FUNCIONA */}
      <section className="how-section" id="bento-benefits">
        <div className="section-header center">
          <div className="how-label">Simples assim</div>
          <h2>Do cadastro ao estágio em 3 passos</h2>
          <p>Uma plataforma construída para ser direta. Sem burocracia, sem perda de tempo.</p>
        </div>

        <div className="how-tracks">
          {/* TRILHA ALUNO */}
          <div className="how-track">
            <div className="track-header student-track">
              <span className="track-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </span>
              <h3>Para Alunos</h3>
            </div>
            <div className="how-steps">
              <div className="how-step">
                <div className="step-number">01</div>
                <div className="step-body">
                  <h4>Crie seu Perfil</h4>
                  <p>Monte um perfil com suas habilidades, currículo e portfólio em minutos.</p>
                </div>
              </div>
              <div className="step-connector"></div>
              <div className="how-step">
                <div className="step-number">02</div>
                <div className="step-body">
                  <h4>Explore as Vagas</h4>
                  <p>Veja todas as oportunidades validadas e aprovadas pela escola.</p>
                </div>
              </div>
              <div className="step-connector"></div>
              <div className="how-step">
                <div className="step-number">03</div>
                <div className="step-body">
                  <h4>Candidate-se</h4>
                  <p>Envie sua candidatura e aguarde o contato direto da empresa.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="tracks-divider">
            <div className="divider-line"></div>
            <span>ou</span>
            <div className="divider-line"></div>
          </div>

          {/* TRILHA EMPRESA */}
          <div className="how-track">
            <div className="track-header company-track">
              <span className="track-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              </span>
              <h3>Para Empresas</h3>
            </div>
            <div className="how-steps">
              <div className="how-step">
                <div className="step-number accent">01</div>
                <div className="step-body">
                  <h4>Cadastre sua Empresa</h4>
                  <p>Crie uma conta e apresente sua empresa para os futuros talentos.</p>
                </div>
              </div>
              <div className="step-connector accent-connector"></div>
              <div className="how-step">
                <div className="step-number accent">02</div>
                <div className="step-body">
                  <h4>Publique uma Vaga</h4>
                  <p>Descreva a vaga e ela vai para revisão. Aprovamos e publicamos em até 24h.</p>
                </div>
              </div>
              <div className="step-connector accent-connector"></div>
              <div className="how-step">
                <div className="step-number accent">03</div>
                <div className="step-body">
                  <h4>Encontre seu Talento</h4>
                  <p>Receba candidaturas de alunos qualificados e motivados da Brasilio Flores.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SHOWCASE DE VAGAS EM DESTAQUE */}
      <section className="vagas-showcase-section">
        <div className="section-header">
          <h2>Oportunidades em Destaque: </h2>
          <p>Oportunidades em destaque abertas essa semana.</p>
        </div>

        <div className="vagas-grid-modern">
          {vagasDestaque.map((vaga, idx) => (
            <div className="vaga-modern-card" key={idx}>
              <div className="vaga-card-header">
                <div className="vaga-icon-wrap">{vaga.icone}</div>
                <span className="vaga-area-tag">{vaga.area}</span>
              </div>

              <div className="vaga-card-body">
                <h3>{vaga.titulo}</h3>
                <p className="vaga-company">{vaga.empresa}</p>
                <p className="vaga-desc">{vaga.descricao}</p>
                <div className="vaga-req">
                  <strong>Requisitos Básicos:</strong>
                  <span>{vaga.requisitos}</span>
                </div>
              </div>

              <div className="vaga-card-footer">
                <Link to="/vagas" className="btn-apply-ghost">Ver Detalhes</Link>
              </div>
            </div>
          ))}
        </div>

        <div className="view-all-wrapper">
          <Link to="/vagas" className="btn-glow outline">Explorar Todas as Vagas</Link>
        </div>
      </section>

      {/* 4. DEPOIMENTOS */}
      <section className="depo-section">
        <div className="depo-header">
          <div className="how-label">Histórias reais</div>
          <h2>Quem já decolou pelo Neway</h2>
        </div>

        <div className="depo-layout">
          {/* Card destaque — grande, à esquerda */}
          <div className="depo-featured">
            <div className="depo-quote-mark">
              <svg width="48" height="36" viewBox="0 0 48 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 36V22.5C0 9.9 7.8 2.1 23.4 0L25.8 4.2C18.6 5.7 14.1 9.3 12.6 15H21V36H0ZM27 36V22.5C27 9.9 34.8 2.1 50.4 0L52.8 4.2C45.6 5.7 41.1 9.3 39.6 15H48V36H27Z" fill="currentColor"/>
              </svg>
            </div>
            <p className="depo-text">
              Eu não acreditava que conseguiria um estágio ainda no 2º ano. O Neway me conectou com a TechFlow em menos de duas semanas. Hoje sou estagiário de Front-end e já estou contribuindo em projetos reais.
            </p>
            <div className="depo-author">
              <div className="depo-avatar depo-avatar-blue">MR</div>
              <div>
                <strong>Mateus Rocha</strong>
                <span>Desenvolvimento Web · TechFlow</span>
              </div>
            </div>
            <div className="depo-badge">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              Contratado em 12 dias
            </div>
          </div>

          {/* Cards menores — à direita */}
          <div className="depo-stack">
            <div className="depo-card">
              <p className="depo-text-sm">
                "A plataforma é muito mais simples do que os outros portais. Publiquei meu perfil, apliquei pra três vagas e fui chamada pra entrevista na mesma semana."
              </p>
              <div className="depo-author-sm">
                <div className="depo-avatar depo-avatar-purple">AL</div>
                <div>
                  <strong>Ana Lima</strong>
                  <span>Design UX · Creative Minds</span>
                </div>
              </div>
            </div>

            <div className="depo-card depo-card-dark">
              <p className="depo-text-sm">
                "Achei que estágio em TI pra quem está no ensino médio era impossível. O Neway prova que não. Hoje trabalho com infraestrutura e aprendo mais do que na teoria."
              </p>
              <div className="depo-author-sm">
                <div className="depo-avatar depo-avatar-green">FS</div>
                <div>
                  <strong>Felipe Santos</strong>
                  <span>TI Infraestrutura · InfraTech</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CTA BANNER (FOCO EM EMPRESAS) */}
      <section className="cta-empresa-section">
        <div className="cta-glass-box">
          <h2>Seu próximo Prodígio está Aqui.</h2>
          <p>Conecte-se diretamente com os talentos promissores e cheios de vontade de aprender da Escola Brasilio Flores de Azevedo.</p>
          <Link to="/cadastro" state={{ tipo: 'EMPRESA' }} className="btn-glow white-glow">Cadastrar minha empresa</Link>
        </div>
      </section>

    </div>
  );
}

export default Home;
