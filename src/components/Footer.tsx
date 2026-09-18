import { Link } from 'react-router-dom';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-main">
        {/* ==========================================
            MARCA
        ========================================== */}

        <div className="footer-brand">
          <Link
            to="/"
            className="footer-logo"
            aria-label="ROUTS - Página inicial"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="footer-logo-icon"
            >
              <path
                d="M12 22s8-7.1 8-13a8 8 0 1 0-16 0c0 5.9 8 13 8 13Z"
                fill="currentColor"
              />

              <circle
                cx="12"
                cy="9"
                r="3"
                fill="currentColor"
                className="footer-logo-dot"
              />
            </svg>

            <div>
              <strong>ROUTS</strong>
              <span>DESCUBRA RIO VERDE</span>
            </div>
          </Link>

          <p>
            Seu guia para descobrir Rio Verde.
            Informação, lazer, gastronomia e tudo
            o que acontece na cidade.
          </p>
        </div>

        {/* ==========================================
            NAVEGAÇÃO
        ========================================== */}

        <div className="footer-navigation">
          <span className="footer-title">
            EXPLORE
          </span>

          <nav
            className="footer-links"
            aria-label="Navegação do rodapé"
          >
            <Link to="/">Início</Link>
            <Link to="/noticias">Notícias</Link>
            <Link to="/cinema">Cinema</Link>
            <Link to="/restaurantes">
              Gastronomia
            </Link>
          </nav>
        </div>
      </div>

      {/* ==========================================
          RODAPÉ INFERIOR
      ========================================== */}

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
            <span>
            © {currentYear} ROUTS · Rio Verde, Goiás
            </span>

            <span>
            Feito para Rio Verde · Dados meteorológicos:{' '}
            <a
                href="https://open-meteo.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-weather-credit"
            >
                Open-Meteo
            </a>
            </span>
        </div>
      </div>
    </footer>
  );
}

