import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { RestaurantCard } from '../components/restaurants/RestaurantCard';

import { getNews } from '../services/newsService';
import { getRestaurants } from '../services/restaurantService';
import { getCinemas } from '../services/cinemaService';

import type { NewsItem } from '../types/news';
import type { Restaurant } from '../types/restaurant';
import type { Cinema as CinemaType } from '../types/cinema';

const NEWS_LIMIT = 6;
const RESTAURANT_LIMIT = 4;
const MOVIE_LIMIT = 4;

interface MovieItem {
  id: string;
  title: string;
  poster: string | null;
  genre: string | null;
  classification: string | null;
  description: string | null;
}

function formatNewsDate(date?: string | null) {
  if (!date) {
    return null;
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
  })
    .format(parsedDate)
    .replace('.', '');
}

export function Home() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [cinemas, setCinemas] = useState<CinemaType[]>([]);

  const [newsLoading, setNewsLoading] = useState(true);
  const [restaurantsLoading, setRestaurantsLoading] = useState(true);
  const [cinemaLoading, setCinemaLoading] = useState(true);

  const [newsError, setNewsError] = useState('');
  const [restaurantsError, setRestaurantsError] = useState('');
  const [cinemaError, setCinemaError] = useState('');

  useEffect(() => {
    async function loadNews() {
      try {
        setNewsLoading(true);
        setNewsError('');

        const response = await getNews();

        setNews(response.articles.slice(0, NEWS_LIMIT));
      } catch (err) {
        setNewsError(
          err instanceof Error
            ? err.message
            : 'Não foi possível carregar as notícias.',
        );
      } finally {
        setNewsLoading(false);
      }
    }

    loadNews();
  }, []);

  useEffect(() => {
    async function loadRestaurants() {
      try {
        setRestaurantsLoading(true);
        setRestaurantsError('');

        const response = await getRestaurants();

        setRestaurants(
          response.restaurants.slice(0, RESTAURANT_LIMIT),
        );
      } catch (err) {
        setRestaurantsError(
          err instanceof Error
            ? err.message
            : 'Não foi possível carregar os restaurantes.',
        );
      } finally {
        setRestaurantsLoading(false);
      }
    }

    loadRestaurants();
  }, []);

  useEffect(() => {
    async function loadCinema() {
      try {
        setCinemaLoading(true);
        setCinemaError('');

        const response = await getCinemas();

        setCinemas(response.cinemas);
      } catch (err) {
        setCinemaError(
          err instanceof Error
            ? err.message
            : 'Não foi possível carregar a programação.',
        );
      } finally {
        setCinemaLoading(false);
      }
    }

    loadCinema();
  }, []);

  const movies = useMemo(() => {
    const movieMap = new Map<string, MovieItem>();

    cinemas.forEach((cinema) => {
      cinema.movies.forEach((movie) => {
        if (!movieMap.has(movie.id)) {
          movieMap.set(movie.id, {
            id: movie.id,
            title: movie.title,
            poster: movie.poster,
            genre: movie.genre,
            classification: movie.classification,
            description: movie.description,
          });
        }
      });
    });

    return Array.from(movieMap.values()).slice(0, MOVIE_LIMIT);
  }, [cinemas]);

  const featuredNews = news[0];
  const secondaryNews = news.slice(1, 3);
  const latestNews = news.slice(3, 6);

  return (
    <>
      {/* ==========================================
          DESTAQUES
      ========================================== */}

      <section className="home-editorial">
        <div className="container">
          {newsLoading && (
            <div className="state home-featured-state">
              <p>Carregando destaques...</p>
            </div>
          )}

          {!newsLoading && newsError && (
            <div className="state state-warning home-featured-state">
              <strong>
                Não foi possível carregar os destaques.
              </strong>

              <p>{newsError}</p>
            </div>
          )}

          {!newsLoading && !newsError && featuredNews && (
            <div className="home-featured-grid">
              <a
                href={featuredNews.url}
                target="_blank"
                rel="noreferrer"
                className="home-main-story"
              >
                {featuredNews.image ? (
                  <img
                    src={featuredNews.image}
                    alt=""
                    className="home-story-image"
                  />
                ) : (
                  <div className="home-story-placeholder">
                    ROUTS
                  </div>
                )}

                <div className="home-story-overlay" />

                <div className="home-main-story-content">
                  <span className="home-story-category">
                    {featuredNews.source?.name || 'Rio Verde'}
                  </span>

                  <h1>{featuredNews.title}</h1>

                  <div className="home-story-meta">
                    {formatNewsDate(featuredNews.publishedAt) && (
                      <span>
                        {formatNewsDate(
                          featuredNews.publishedAt,
                        )}
                      </span>
                    )}

                    <span>Rio Verde, GO</span>
                  </div>
                </div>
              </a>

              <div className="home-secondary-stories">
                {secondaryNews.map((article) => (
                  <a
                    key={article.id}
                    href={article.url}
                    target="_blank"
                    rel="noreferrer"
                    className="home-secondary-story"
                  >
                    {article.image ? (
                      <img
                        src={article.image}
                        alt=""
                        className="home-story-image"
                      />
                    ) : (
                      <div className="home-story-placeholder">
                        ROUTS
                      </div>
                    )}

                    <div className="home-story-overlay" />

                    <div className="home-secondary-story-content">
                      <span className="home-story-category">
                        {article.source?.name || 'Notícias'}
                      </span>

                      <h2>{article.title}</h2>

                      {formatNewsDate(article.publishedAt) && (
                        <span className="home-secondary-date">
                          {formatNewsDate(
                            article.publishedAt,
                          )}
                        </span>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {!newsLoading &&
            !newsError &&
            news.length === 0 && (
              <div className="state home-featured-state">
                <p>
                  Nenhuma notícia disponível no momento.
                </p>
              </div>
            )}
        </div>
      </section>

      {/* ==========================================
          CONTEÚDO PRINCIPAL
      ========================================== */}

      <section className="home-dashboard">
        <div className="container home-dashboard-grid">
          {/* ÚLTIMAS NOTÍCIAS */}

          <div className="home-dashboard-column home-latest-column">
            <div className="home-panel-heading">
              <div>
                <span className="home-panel-eyebrow">
                  FIQUE POR DENTRO
                </span>

                <h2>Últimas notícias</h2>
              </div>

              <Link
                to="/noticias"
                className="home-panel-link"
              >
                Ver todas →
              </Link>
            </div>

            {!newsLoading &&
              !newsError &&
              latestNews.length > 0 && (
                <div className="home-latest-list">
                  {latestNews.map((article) => (
                    <a
                      key={article.id}
                      href={article.url}
                      target="_blank"
                      rel="noreferrer"
                      className="home-latest-item"
                    >
                      <div className="home-latest-image">
                        {article.image ? (
                          <img
                            src={article.image}
                            alt=""
                            loading="lazy"
                          />
                        ) : (
                          <span>ROUTS</span>
                        )}
                      </div>

                      <div className="home-latest-content">
                        <span className="home-latest-source">
                          {article.source?.name || 'Notícias'}
                        </span>

                        <h3>{article.title}</h3>

                        {formatNewsDate(
                          article.publishedAt,
                        ) && (
                          <time>
                            {formatNewsDate(
                              article.publishedAt,
                            )}
                          </time>
                        )}
                      </div>
                    </a>
                  ))}
                </div>
              )}

            {!newsLoading &&
              !newsError &&
              latestNews.length === 0 && (
                <div className="home-panel-empty">
                  Mais notícias aparecerão aqui.
                </div>
              )}
          </div>

          {/* GASTRONOMIA */}

          <div className="home-dashboard-column home-food-column">
            <div className="home-panel-heading">
              <div>
                <span className="home-panel-eyebrow">
                  SABORES DA CIDADE
                </span>

                <h2>Gastronomia</h2>
              </div>

              <Link
                to="/restaurantes"
                className="home-panel-link"
              >
                Ver todos →
              </Link>
            </div>

            {restaurantsLoading && (
              <div className="home-panel-empty">
                Carregando restaurantes...
              </div>
            )}

            {!restaurantsLoading && restaurantsError && (
              <div className="home-panel-empty">
                Não foi possível carregar os restaurantes.
              </div>
            )}

            {!restaurantsLoading &&
              !restaurantsError &&
              restaurants.length > 0 && (
                <div className="home-restaurant-row">
                  {restaurants.map((restaurant) => (
                    <RestaurantCard
                      key={restaurant.id}
                      restaurant={restaurant}
                      variant="compact"
                    />
                  ))}
                </div>
              )}

            {!restaurantsLoading &&
              !restaurantsError &&
              restaurants.length === 0 && (
                <div className="home-panel-empty">
                  Nenhum restaurante disponível.
                </div>
              )}
          </div>
        </div>
      </section>

      {/* ==========================================
          CINEMA
      ========================================== */}

      <section className="home-cinema-section">
        <div className="container">
          <div className="home-cinema-heading">
            <div>
              <span className="home-panel-eyebrow">
                LAZER • RIO VERDE
              </span>

              <h2>Em cartaz nos cinemas</h2>

              <p>
                Confira alguns dos filmes em exibição na cidade.
              </p>
            </div>

            <Link
              to="/cinema"
              className="home-panel-link"
            >
              Ver programação →
            </Link>
          </div>

          {cinemaLoading && (
            <div className="home-panel-empty">
              Carregando programação...
            </div>
          )}

          {!cinemaLoading && cinemaError && (
            <div className="home-panel-empty">
              Não foi possível carregar a programação.
            </div>
          )}

          {!cinemaLoading &&
            !cinemaError &&
            movies.length > 0 && (
              <div className="home-movie-grid">
                {movies.map((movie) => (
                  <Link
                    to="/cinema"
                    className="home-movie-card"
                    key={movie.id}
                  >
                    <div className="home-movie-poster">
                      {movie.poster ? (
                        <img
                          src={movie.poster}
                          alt={`Pôster de ${movie.title}`}
                          loading="lazy"
                        />
                      ) : (
                        <div className="home-movie-placeholder">
                          Sem pôster
                        </div>
                      )}

                      {movie.classification && (
                        <span className="home-movie-classification">
                          {movie.classification}
                        </span>
                      )}
                    </div>

                    <div className="home-movie-content">
                      <h3>{movie.title}</h3>

                      {movie.genre && (
                        <p className="home-movie-genre">
                          {movie.genre}
                        </p>
                      )}

                      <span className="home-movie-action">
                        Ver sessões →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}

          {!cinemaLoading &&
            !cinemaError &&
            movies.length === 0 && (
              <div className="home-panel-empty">
                Nenhum filme disponível no momento.
              </div>
            )}
        </div>
      </section>
    </>
  );
}
