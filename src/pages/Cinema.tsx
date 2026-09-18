import { useEffect, useState } from 'react';

import { getCinemas } from '../services/cinemaService';

import type {
  Cinema as CinemaType,
  Movie,
} from '../types/cinema';

export function Cinema() {
  const [cinemas, setCinemas] = useState<CinemaType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedDates, setSelectedDates] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    async function loadCinemas() {
      try {
        setLoading(true);
        setError('');

        const response = await getCinemas();

        setCinemas(response.cinemas);

        const initialDates: Record<string, string> = {};

        response.cinemas.forEach((cinema) => {
          cinema.movies.forEach((movie) => {
            if (movie.sessions.length > 0) {
              initialDates[movie.id] =
                movie.sessions[0].date;
            }
          });
        });

        setSelectedDates(initialDates);
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
    const [, month, day] = date.split('-');

    return `${day}/${month}`;
  }

  function formatDayName(date: string) {
    const [year, month, day] = date
      .split('-')
      .map(Number);

    const localDate = new Date(
      year,
      month - 1,
      day,
    );

    return new Intl.DateTimeFormat('pt-BR', {
      weekday: 'short',
    })
      .format(localDate)
      .replace('.', '')
      .toUpperCase();
  }

  function isToday(date: string) {
    const today = new Date();

    const year = today.getFullYear();

    const month = String(
      today.getMonth() + 1,
    ).padStart(2, '0');

    const day = String(
      today.getDate(),
    ).padStart(2, '0');

    return date === `${year}-${month}-${day}`;
  }

  function isTomorrow(date: string) {
    const tomorrow = new Date();

    tomorrow.setDate(
      tomorrow.getDate() + 1,
    );

    const year = tomorrow.getFullYear();

    const month = String(
      tomorrow.getMonth() + 1,
    ).padStart(2, '0');

    const day = String(
      tomorrow.getDate(),
    ).padStart(2, '0');

    return date === `${year}-${month}-${day}`;
  }

  function getSelectedSession(movie: Movie) {
    const selectedDate =
      selectedDates[movie.id] ||
      movie.sessions[0]?.date;

    return movie.sessions.find(
      (session) =>
        session.date === selectedDate,
    );
  }

  function selectDate(
    movieId: string,
    date: string,
  ) {
    setSelectedDates((current) => ({
      ...current,
      [movieId]: date,
    }));
  }

  return (
    <main className="cinema-page">
      {/* ==========================================
          CABEÇALHO DA PÁGINA
      ========================================== */}

      <section className="cinema-page-header">
        <div className="container">
          <span className="cinema-page-eyebrow">
            LAZER • RIO VERDE
          </span>

          <h1>Cinema em Rio Verde</h1>

          <p>
            Confira os filmes em cartaz, horários e
            programação dos cinemas da cidade.
          </p>
        </div>
      </section>

      {/* ==========================================
          CONTEÚDO
      ========================================== */}

      <section className="cinema-page-content">
        <div className="container">
          {/* ======================================
              CARREGANDO
          ====================================== */}

          {loading && (
            <div className="state cinema-page-state">
              <p>Carregando programação...</p>
            </div>
          )}

          {/* ======================================
              ERRO
          ====================================== */}

          {error && (
            <div className="state state-warning">
              <strong>
                Não foi possível carregar os cinemas.
              </strong>

              <p>{error}</p>
            </div>
          )}

          {/* ======================================
              CINEMAS
          ====================================== */}

          {!loading && !error && (
            <div className="cinema-list">
              {cinemas.map((cinema) => (
                <article
                  className="cinema-section"
                  key={cinema.id}
                >
                  {/* ==============================
                      CABEÇALHO DO CINEMA
                  ============================== */}

                  <header className="cinema-header">
                    <div className="cinema-header-info">
                      <span className="eyebrow">
                        CINEMA
                      </span>

                      <h2>{cinema.name}</h2>

                      <p className="cinema-address">
                        {cinema.address}
                      </p>

                      {cinema.description && (
                        <p className="cinema-description">
                          {cinema.description}
                        </p>
                      )}
                    </div>

                    {cinema.website && (
                      <a
                        href={cinema.website}
                        target="_blank"
                        rel="noreferrer"
                        className="cinema-website-button"
                      >
                        Site do cinema
                        <span aria-hidden="true">↗</span>
                      </a>
                    )}
                  </header>

                  {/* ==============================
                      CABEÇALHO DOS FILMES
                  ============================== */}

                  <div className="cinema-movies-heading">
                    <div>
                      <span>PROGRAMAÇÃO</span>

                      <h3>Filmes em cartaz</h3>
                    </div>

                    <strong>
                      {cinema.movies.length}{' '}
                      {cinema.movies.length === 1
                        ? 'filme'
                        : 'filmes'}
                    </strong>
                  </div>

                  {/* ==============================
                      FILMES
                  ============================== */}

                  <div className="movie-grid">
                    {cinema.movies.map((movie) => {
                      const selectedSession =
                        getSelectedSession(movie);

                      return (
                        <article
                          className="movie-card"
                          key={movie.id}
                        >
                          {/* ========================
                              PÔSTER
                          ======================== */}

                          <div className="movie-poster">
                            {movie.poster ? (
                              <img
                                src={movie.poster}
                                alt={`Pôster de ${movie.title}`}
                                loading="lazy"
                              />
                            ) : (
                              <div className="movie-poster-placeholder">
                                <span>
                                  Sem pôster
                                </span>
                              </div>
                            )}
                          </div>

                          {/* ========================
                              CONTEÚDO
                          ======================== */}

                          <div className="movie-content">
                            <h3>{movie.title}</h3>

                            {/* ======================
                                META
                            ====================== */}

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

                              {movie.duration && (
                                <span className="movie-duration">
                                  {movie.duration}
                                </span>
                              )}
                            </div>

                            {/* ======================
                                DESCRIÇÃO
                            ====================== */}

                            {movie.description && (
                              <p className="movie-description">
                                {movie.description}
                              </p>
                            )}

                            {/* ======================
                                PROGRAMAÇÃO
                            ====================== */}

                            {movie.sessions.length > 0 && (
                              <div className="movie-sessions">
                                <h4>Horários</h4>

                                {/* ==================
                                    DIAS
                                ================== */}

                                <div className="session-days-scroll">
                                  {movie.sessions.map(
                                    (session) => {
                                      const selected =
                                        session.date ===
                                        (selectedDates[
                                          movie.id
                                        ] ||
                                          movie
                                            .sessions[0]
                                            ?.date);

                                      return (
                                        <button
                                          type="button"
                                          key={
                                            session.date
                                          }
                                          className={`session-day-button ${
                                            selected
                                              ? 'active'
                                              : ''
                                          }`}
                                          onClick={() =>
                                            selectDate(
                                              movie.id,
                                              session.date,
                                            )
                                          }
                                        >
                                          <span className="session-day-name">
                                            {isToday(
                                              session.date,
                                            )
                                              ? 'HOJE'
                                              : isTomorrow(
                                                    session.date,
                                                  )
                                                ? 'AMANHÃ'
                                                : formatDayName(
                                                    session.date,
                                                  )}
                                          </span>

                                          <span className="session-day-date">
                                            {formatDate(
                                              session.date,
                                            )}
                                          </span>
                                        </button>
                                      );
                                    },
                                  )}
                                </div>

                                {/* ==================
                                    HORÁRIOS DO DIA
                                ================== */}

                                {selectedSession && (
                                  <div className="session-selected">
                                    <div className="session-selected-title">
                                      Horários de{' '}
                                      {isToday(
                                        selectedSession.date,
                                      )
                                        ? 'hoje'
                                        : formatDate(
                                            selectedSession.date,
                                          )}
                                    </div>

                                    {/* ================
                                        GRADE
                                    ================ */}

                                    <div className="session-list">
                                      {selectedSession.items.map(
                                        (
                                          item,
                                          index,
                                        ) => (
                                          <div
                                            className="session-item"
                                            key={`${selectedSession.date}-${item.time}-${index}`}
                                          >
                                            <div className="session-time">
                                              {item.time}
                                            </div>

                                            <div className="session-details">
                                              {item.language &&
                                                item.language !==
                                                  'Não informado' && (
                                                  <span className="session-language">
                                                    {
                                                      item.language
                                                    }
                                                  </span>
                                                )}

                                              {item.format && (
                                                <span className="session-format">
                                                  {
                                                    item.format
                                                  }
                                                </span>
                                              )}

                                              {item.room && (
                                                <span className="session-room">
                                                  {
                                                    item.room
                                                  }
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
                                )}
                              </div>
                            )}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </article>
              ))}
            </div>
          )}

          {!loading &&
            !error &&
            cinemas.length === 0 && (
              <div className="state cinema-page-state">
                <strong>
                  Nenhuma programação encontrada.
                </strong>

                <p>
                  Não há cinemas disponíveis no
                  momento.
                </p>
              </div>
            )}
        </div>
      </section>
    </main>
  );
}

