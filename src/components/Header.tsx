import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="logo">
          ROUTS
        </Link>

        <nav className="nav" aria-label="Navegação principal">
          <Link to="/">Início</Link>
          <Link to="/noticias">Notícias</Link>
          <Link to="/cinema">Cinema</Link>
        </nav>
      </div>
    </header>
  );
}
