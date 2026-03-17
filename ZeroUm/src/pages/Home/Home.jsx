import './home.css';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

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

        {/* Gráficos de "Caixas Flutuantes" subitituindo a velha imagem estática */}
        <div className="hero-floating-elements">
          <div className="float-card card-1"><span className="icon">🚀</span> Aceleração</div>
          <div className="float-card card-2"><span className="icon">💼</span> Vagas Top-Tier</div>
          <div className="float-card card-3"><span className="icon">🎯</span> Match Perfeito</div>
        </div>
      </section>

      {/* 2. POR QUE O NEWAY? - ESTILO BENTO GRID */}
      <section className="bento-section" id="bento-benefits">
        <div className="section-header center">
          <h2>Mais do que um simples portal</h2>
          <p>Desenvolvemos um sistema focado no sucesso de quem está começando.</p>
        </div>

        <div className="bento-grid">
          {/* Item 1 - Grande Destaque Lateral */}
          <div className="bento-item span-col-2 bg-gradient">
            <div className="bento-content">
              <h3>Match Ultra Personalizado</h3>
              <p>O Neway não te joga em qualquer vaga. Lemos o seu <strong>Perfil</strong> e destacamos vagas perfeitas ajustadas às suas habilidades exclusivas.</p>
            </div>
            <div className="bento-icon-huge">🎯</div>
          </div>

          {/* Item 2 - Quadrado Normal */}
          <div className="bento-item glass-panel">
            <div className="bento-content">
              <h3>Empresas Auditadas</h3>
              <p>Só parceiros verificados que buscam talentos junior.</p>
            </div>
          </div>

          {/* Item 3 - Quadrado Normal com cor de marca */}
          <div className="bento-item solid-blue">
            <div className="bento-content">
              <h3>Direto ao Ponto</h3>
              <p>Processos seletivos sem enrolação, comunicação direta com o RH.</p>
            </div>
          </div>

          {/* Item 4 - Comprido na base */}
          <div className="bento-item span-col-3 soft-shadow">
            <div className="bento-content horizontal">
              <div className="icon">📚</div>
              <div>
                <h3>Material de Apoio</h3>
                <p>Nós fornecemos todo suporte para montar seu currículo e treinar para entrevistas usando nossa base de conhecimento colaborativa.</p>
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

      {/* 4. CTA BANNER (FOCO EM EMPRESAS) */}
      <section className="cta-empresa-section">
        <div className="cta-glass-box">
          <h2>Seu próximo Prodígio está Aqui.</h2>
          <p>Conecte-se diretamente com os talentos promissores e cheios de vontade de aprender da Escola Brasilio Flores de Azevedo.</p>
          <Link to="/PubliqueSuaVaga" className="btn-glow white-glow">Publicar Vaga Grátis</Link>
        </div>
      </section>

    </div>
  );
}

export default Home;
