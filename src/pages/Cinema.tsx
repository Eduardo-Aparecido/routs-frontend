import { useEffect, useState } from 'react';
import { getCinemas } from '../services/cinemaService';
import type { Cinema as CinemaType } from '../types/cinema';

export function Cinema() {
  const [cinemas, setCinemas] = useState<CinemaType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadCinemas() {
      try {
        setLoading(true);
        setError('');

        const response = await getCinemas();

        setCinemas(response.cinemas);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Não foi possível carregar os cinemas.',
        );
      } finally {
        setLoading(false);
      }
    }

    loadCinemas();
  }, []);

  function formatDate(date: string) {
    const [year, month, day] = date.split('-');

    return `${day}/${month}`;
  }

  return (
    <section className="section">
      <div className="container">
        {/* ==========================================
            CABEÇALHO
        ========================================== */}

        <div className="section-heading">
          <div>
            <span className="eyebrow">LAZER • RIO VERDE</span>

            <h1>Cinema em Rio Verde</h1>
          </div>
        </div>

        <p className="cinema-intro">
          Encontre os cinemas da cidade e consulte a programação de filmes e
          horários.
        </p>

        {/* ==========================================
            CARREGANDO
        ========================================== */}

        {loading && (
          <div className="state">
            <p>Carregando programação...</p>
          </div>
        )}

        {/* ==========================================
            ERRO
        ========================================== */}

        {error && (
          <div className="state state-warning">
            <strong>Não foi possível carregar os cinemas.</strong>

            <p>{error}</p>
          </div>
        )}

        {/* ==========================================
            CINEMAS
        ========================================== */}

        {!loading && !error && (
          <div className="cinema-list">
            {cinemas.map((cinema) => (
              <article className="cinema-section" key={cinema.id}>
                {/* ======================================
                    INFORMAÇÕES DO CINEMA
                ====================================== */}

                <header className="cinema-header">
                  <div>
                    <span className="eyebrow">CINEMA</span>

                    <h2>{cinema.name}</h2>

                    <p className="cinema-address">
                      {cinema.address}
                    </p>

                    <p className="cinema-description">
                      {cinema.description}
                    </p>
                  </div>
                </header>

                {/* ======================================
                    FILMES
                ====================================== */}

                <div className="movie-grid">
                  {cinema.movies.map((movie) => (
                    <article className="movie-card" key={movie.id}>
                      {/* ==================================
                          PÔSTER
                      ================================== */}

                      <div className="movie-poster">
                        {movie.poster ? (
                          <img
                            src={movie.poster}
                            alt={`Pôster de ${movie.title}`}
                            loading="lazy"
                          />
                        ) : (
                          <div className="movie-poster-placeholder">
                            <span>Sem pôster</span>
                          </div>
                        )}
                      </div>

                      {/* ==================================
                          CONTEÚDO
                      ================================== */}

                      <div className="movie-content">
                        <h3>{movie.title}</h3>

                        {/* ==============================
                            GÊNERO + CLASSIFICAÇÃO
                        ============================== */}

                        <div className="movie-meta">
                          {movie.genre && (
                            <span className="movie-genre">
                              {movie.genre}
                            </span>
                          )}

                          {movie.classification && (
                            <span className="movie-classification">
                              {movie.classification}
                            </span>
                          )}
                        </div>

                        {/* ==============================
                            DESCRIÇÃO
                        ============================== */}

                        {movie.description && (
                          <p className="movie-description">
                            {movie.description}
                          </p>
                        )}

                        {/* ==============================
                            HORÁRIOS
                        ============================== */}

                        {movie.sessions.length > 0 && (
                          <div className="movie-sessions">
                            <h4>Horários</h4>

                            {movie.sessions.map((session) => (
                              <div
                                className="session-day"
                                key={session.date}
                              >
                                <div className="session-date">
                                  {formatDate(session.date)}
                                </div>

                                <div className="session-list">
                                  {session.items.map(
                                    (item, index) => (
                                      <div
                                        className="session-item"
                                        key={`${session.date}-${item.time}-${index}`}
                                      >
                                        <div className="session-time">
                                          {item.time}
                                        </div>

                                        <div className="session-details">
                                          {item.language !==
                                            'Não informado' && (
                                            <span className="session-language">
                                              {item.language}
                                            </span>
                                          )}

                                          {item.format && (
                                            <span className="session-format">
                                              {item.format}
                                            </span>
                                          )}

                                          {item.accessibility && (
                                            <span className="session-accessibility">
                                              Acessibilidade
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    ),
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </article>
                  ))}
                </div>

                {/* ======================================
                    SITE DO CINEMA
                ====================================== */}

                <footer className="cinema-links">
                  <a
                    href={cinema.website}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Site do cinema
                  </a>
                </footer>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

