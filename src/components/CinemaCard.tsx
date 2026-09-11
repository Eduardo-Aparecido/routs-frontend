import type { Cinema } from '../types/cinema';

interface CinemaCardProps {
  cinema: Cinema;
}

export function CinemaCard({ cinema }: CinemaCardProps) {
  return (
    <article className="cinema-card">
      <div className="cinema-card-header">
        <span className="cinema-label">CINEMA</span>

        <div className="cinema-icon" aria-hidden="true">
          🎬
        </div>
      </div>

      <div className="cinema-content">
        <h2>{cinema.name}</h2>

        <p className="cinema-address">
          {cinema.address}
          <br />
          {cinema.city}
        </p>

        <p>{cinema.description}</p>

        <div className="cinema-footer">
          <a
            href={cinema.programmingUrl}
            target="_blank"
            rel="noreferrer"
            className="read-link"
          >
            Ver programação →
          </a>

          <a
            href={cinema.website}
            target="_blank"
            rel="noreferrer"
            className="cinema-site-link"
          >
            Site
          </a>
        </div>
      </div>
    </article>
  );
}