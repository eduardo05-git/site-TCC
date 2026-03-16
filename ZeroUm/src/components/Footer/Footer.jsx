import './Footer.css';
import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="footer-container">
            <div className="footer-top-grid">
                
                <div className="footer-column brand-column">
                    <h4>Sobre o Neway</h4>
                    <p>
                        Portal de Estágios para a Escola Brásilio Flores de Azevedo.<br />
                        Feito de aluno para aluno.
                    </p>
                </div>

                <div className="footer-column links-column">
                    <h4>Explore</h4>
                    <Link to="/">Início</Link>
                    <Link to="/vagas">Vagas</Link>
                    <Link to="/perfil">Perfil</Link>
                    <Link to="/PubliqueSuaVaga">Publicar Vaga</Link>
                </div>

                <div className="footer-column contact-column">
                    <h4>Contato</h4>
                    <a href="mailto:contato@newayestagios.com" className="contact-link">
                        <i className="fas fa-envelope"></i> contato@newayestagios.com
                    </a>
                    <span className="contact-link">
                        <i className="fas fa-phone"></i> (11) 99999-9999
                    </span>
                    <span className="contact-link">
                        <i className="fas fa-map-marker-alt"></i> Jardim Belval, Barueri - SP
                    </span>
                </div>

                <div className="footer-column social-column">
                    <h4>Siga-nos</h4>
                    <div className="social-links-grid">
                        <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i> @newayestagios</a>
                        <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin"></i> @newayestagios</a>
                        <a href="#" aria-label="Facebook"><i className="fab fa-facebook"></i> @newayestagios</a>
                    </div>
                </div>

            </div>

            <div className="footer-bottom-bar">
                <span>&copy; 2025 Portal de Estágios Neway</span>
                <span>Política de Privacidade</span>
            </div>

            <div className="footer-giant-text">
                neway
            </div>
        </footer>
    );
}

export default Footer;