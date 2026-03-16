
import './home.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const vagasDestaque = [
  {
    titulo: "Estágio em Desenvolvimento Web",
    empresa: "Tech Solutions",
    descricao: "Desenvolvimento de aplicações web utilizando React e Node.js.",
    requisitos: "Conhecimento em JavaScript, HTML, CSS. Desejável experiência com React.",
    cor: "#2196f3",
    icone: "💻"
  },
  {
    titulo: "Estágio em Marketing Digital",
    empresa: "Marketing Pro",
    descricao: "Auxiliar na criação de campanhas digitais e gestão de redes sociais.",
    requisitos: "Conhecimento em SEO, Google Ads e redes sociais.",
    cor: "#43a047",
    icone: "📈"
  },
  {
    titulo: "Estágio em Design Gráfico",
    empresa: "Creative Minds",
    descricao: "Criação de peças gráficas para campanhas publicitárias e redes sociais.",
    requisitos: "Conhecimento em Adobe Photoshop e Illustrator.",
    cor: "#ab47bc",
    icone: "🎨"
  }
];

function Home() {
  return (
    <div className="home-landing">
      <header className="home-header">
        <div className="home-title-block">
          <h1>
            Encontre o <span className="gradient-text">estágio perfeito</span><br />
            para sua carreira
          </h1>
          <p className="home-subtitle">
            Feito por alunos, para alunos — somos da Escola Brasilio Flores de Azevedo, em parceria com empresas especializadas em estágios que ajudam você a crescer.
          </p>
          <p className="home-tagline">
            <em>"Seu futuro começa hoje! Estamos aqui para abrir portas." </em>
          </p>

          <div className="home-actions">
            <a href="/vagas" className="home-btn primary">Buscar Vagas</a>
            <a href="#saiba-mais" className="home-btn secondary">Saiba Mais</a>
          </div>

          <div className="home-stats">
            <div>
              <span className="stat-num">+90</span>
              <span className="stat-label">vagas ativas</span>
            </div>
            <div>
              <span className="stat-num">+40</span>
              <span className="stat-label">empresas parceiras</span>
            </div>
            <div>
              <span className="stat-num">95%</span>
              <span className="stat-label">satisfação dos usuários</span>
            </div>
          </div>
        </div>

        <div className="home-image-block">
          <img
            src="../img/foto.jpg"
            alt="Jovens felizes encontrando estágio"
            className="home-illustration"
            loading="lazy"
            width="600"
          />
        </div>
      </header>

      <section className="home-benefits" id="saiba-mais">
        <h2>Por que o Neway é o melhor para você?</h2>
        <p className="home-benefits-desc">
          O Neway conecta estudantes da Escola Brasilio Flores com empresas qualificadas, focando no seu crescimento profissional e aprendizado.
        </p>
        <div className="benefits-list">
          <div className="benefit-card">
            <span className="benefit-icon" role="img" aria-label="Alvo">🎯</span>
            <h3>Vagas Personalizadas</h3>
            <p>Ajustadas para suas habilidades e interesses, para você brilhar.</p>
          </div>
          <div className="benefit-card">
            <span className="benefit-icon" role="img" aria-label="Empresa">🏢</span>
            <h3>Empresas Qualificadas</h3>
            <p>Parcerias com companhias que investem nos talentos do futuro.</p>
          </div>
          <div className="benefit-card">
            <span className="benefit-icon" role="img" aria-label="Livro">📚</span>
            <h3>Suporte Completo</h3>
            <p>Dicas valiosas para você se destacar e crescer no processo seletivo.</p>
          </div>
          <div className="benefit-card">
            <span className="benefit-icon" role="img" aria-label="Gráfico">📈</span>
            <h3>Acompanhamento</h3>
            <p>Apoio contínuo para sua evolução durante o estágio.</p>
          </div>
        </div>
      </section>

      <section className="home-vagas" id="vagas">
        <h2>Vagas em destaque</h2>
        <h4>Veja a vaga que melhor se encaixa com você!</h4>
        <div className="vagas-list">
          {vagasDestaque.map((vaga, idx) => (
            <div className="vaga-card" key={idx}>
              <span className="vaga-icon" style={{background: vaga.cor}}>{vaga.icone}</span>
              <div>
                <h3>{vaga.titulo}</h3>
                <p><strong>Empresa:</strong> {vaga.empresa}</p>
                <p><strong>descrição:</strong>{vaga.descricao}</p>
                <p><strong>requisitos:</strong>{vaga.requisitos}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="publicar-vaga" id="publicar">
  <div className="publicar-card">
    <div className="publicar-conteudo">
      <h2>É uma empresa? Publique sua vaga aqui!</h2>
      <p>
        Conecte-se com os melhores talentos da Escola Brasilio Flores de Azevedo. Preencha sua vaga com estagiários motivados e preparados!
      </p>
      <a href="/PubliqueSuaVaga" className="home-btn primary"> Publicar Vaga </a>
    </div>
  </div>
</section>
</div>

          
   

    
  );
}

export default Home;
