import { Link } from 'react-router-dom';
import { News } from './News';

export function Home() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <span className="eyebrow">RIO VERDE • GOIÁS</span>

          <h1>Descubra o que está acontecendo em Rio Verde.</h1>

          <p>
            O ROUTS reúne as principais notícias e informações da região em um
            só lugar.
          </p>

          <Link to="/noticias" className="button">
            Ver notícias
          </Link>
        </div>
      </section>

      <News compact />
    </>
  );
}
