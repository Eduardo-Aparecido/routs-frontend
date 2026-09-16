import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { NewsCard } from '../components/NewsCard';
import { RestaurantCard } from '../components/restaurants/RestaurantCard';

import { getNews } from '../services/newsService';
import { getRestaurants } from '../services/restaurantService';
import { getCinemas } from '../services/cinemaService';

import type { NewsItem } from '../types/news';
import type { Restaurant } from '../types/restaurant';
import type { Cinema as CinemaType } from '../types/cinema';

const NEWS_LIMIT = 3;
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

  return (
    <>
      {/* ==========================================
          HERO
      ========================================== */}

      <section className="hero">
        <div className="container">
          <span className="eyebrow">RIO VERDE • GOIÁS</span>

          <h1>
            Descubra o que está acontecendo em Rio Verde.
          </h1>

          <p>
            Notícias, gastronomia, cinema e tudo o que acontece
            pela cidade em um só lugar.
          </p>

          <Link to="/noticias" className="button">
            Explorar o ROUTS
          </Link>
        </div>
      </section>

      {/* ==========================================
          NOTÍCIAS
      ========================================== */}

      <section className="section home-section">
        <div className="container">
          <div className="home-section-heading">
            <div>
              <span className="eyebrow">
                INFORMAÇÃO LOCAL
              </span>

              <h2>Principais notícias</h2>

              <p>
                O que está acontecendo em Rio Verde e região.
              </p>
            </div>

            <Link to="/noticias" className="home-section-link">
              Ver todas →
            </Link>
          </div>

          {newsLoading && (
            <div className="state">
              <p>Carregando notícias...</p>
            </div>
          )}

          {!newsLoading && newsError && (
            <div className="state state-warning">
              <strong>
                Não foi possível carregar as notícias.
              </strong>

              <p>{newsError}</p>
            </div>
          )}

          {!newsLoading && !newsError && news.length > 0 && (
            <div className="news-grid home-news-grid">
              {news.map((article) => (
                <NewsCard
                  key={article.id}
                  article={article}
                />
              ))}
            </div>
          )}

          {!newsLoading && !newsError && news.length === 0 && (
            <div className="state">
              <p>Nenhuma notícia disponível no momento.</p>
            </div>
          )}
        </div>
      </section>

      {/* ==========================================
          RESTAURANTES
      ========================================== */}

      <section className="section home-section home-section-muted">
        <div className="container">
          <div className="home-section-heading">
            <div>
              <span className="eyebrow">
                GASTRONOMIA • RIO VERDE
              </span>

              <h2>Bateu aquela fome?</h2>

              <p>
                Encontre restaurantes e lugares para comer em Rio Verde.
              </p>
            </div>

            <Link
              to="/restaurantes"
              className="home-section-link"
            >
              Ver todos →
            </Link>
          </div>

          {restaurantsLoading && (
            <div className="state">
              <p>Carregando restaurantes...</p>
            </div>
          )}

          {!restaurantsLoading && restaurantsError && (
            <div className="state state-warning">
              <strong>
                Não foi possível carregar os restaurantes.
              </strong>

              <p>{restaurantsError}</p>
            </div>
          )}

          {!restaurantsLoading &&
            !restaurantsError &&
            restaurants.length > 0 && (
              <div className="restaurant-row home-restaurant-row">
                {restaurants.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
                  />
                ))}
              </div>
            )}

          {!restaurantsLoading &&
            !restaurantsError &&
            restaurants.length === 0 && (
              <div className="state">
                <p>
                  Nenhum restaurante disponível no momento.
                </p>
              </div>
            )}
        </div>
      </section>

      {/* ==========================================
          CINEMA
      ========================================== */}

      <section className="section home-section">
        <div className="container">
          <div className="home-section-heading">
            <div>
              <span className="eyebrow">
                LAZER • RIO VERDE
              </span>

              <h2>O que está passando na telona?</h2>

              <p>
                Confira os filmes em cartaz nos cinemas de Rio Verde.
              </p>
            </div>

            <Link
              to="/cinema"
              className="home-section-link"
            >
              Ver programação →
            </Link>
          </div>

          {cinemaLoading && (
            <div className="state">
              <p>Carregando programação...</p>
            </div>
          )}

          {!cinemaLoading && cinemaError && (
            <div className="state state-warning">
              <strong>
                Não foi possível carregar a programação.
              </strong>

              <p>{cinemaError}</p>
            </div>
          )}

          {!cinemaLoading &&
            !cinemaError &&
            movies.length > 0 && (
              <div className="home-movie-grid">
                {movies.map((movie) => (
                  <article
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
                    </div>

                    <div className="home-movie-content">
                      <h3>{movie.title}</h3>

                      <div className="home-movie-meta">
                        {movie.genre && (
                          <span>{movie.genre}</span>
                        )}

                        {movie.classification && (
                          <span>
                            {movie.classification}
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

          {!cinemaLoading &&
            !cinemaError &&
            movies.length === 0 && (
              <div className="state">
                <p>
                  Nenhum filme disponível no momento.
                </p>
              </div>
            )}
        </div>
      </section>
    </>
  );
}

