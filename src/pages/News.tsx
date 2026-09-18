import { useEffect, useMemo, useState } from 'react';

import { NewsCard } from '../components/NewsCard';

import {
  getNews,
  getNewsCategories,
} from '../services/newsService';

import { fallbackNews } from '../data/fallbackNews';

import type {
  NewsCategory,
  NewsItem,
} from '../types/news';

interface NewsProps {
  compact?: boolean;
}

function formatNewsDate(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
    .format(parsedDate)
    .replace('.', '');
}

export function News({ compact = false }: NewsProps) {
  const [articles, setArticles] = useState<NewsItem[]>([]);
  const [categories, setCategories] = useState<NewsCategory[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<
    number | undefined
  >();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadCategories() {
      if (compact) {
        return;
      }

      try {
        const response = await getNewsCategories();

        setCategories(response);
      } catch (err) {
        console.error(
          'Erro ao carregar categorias:',
          err,
        );
      }
    }

    loadCategories();
  }, [compact]);

  useEffect(() => {
    async function loadNews() {
      try {
        setLoading(true);
        setError('');

        const response = await getNews(
          undefined,
          selectedCategory,
        );

        setArticles(
          compact
            ? response.articles.slice(0, 6)
            : response.articles,
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Não foi possível carregar as notícias.',
        );

        setArticles(fallbackNews);
      } finally {
        setLoading(false);
      }
    }

    loadNews();
  }, [compact, selectedCategory]);

  const featuredArticle = articles[0];

  const sideArticles = useMemo(
    () => articles.slice(1, 4),
    [articles],
  );

  const remainingArticles = useMemo(
    () => articles.slice(4),
    [articles],
  );

  /*
   * Mantém o comportamento antigo caso o componente
   * seja utilizado futuramente em modo compacto.
   */
  if (compact) {
    return (
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                INFORMAÇÃO LOCAL
              </span>

              <h1>Últimas notícias</h1>
            </div>
          </div>

          {loading && (
            <div className="state">
              <p>Carregando notícias...</p>
            </div>
          )}

          {error && (
            <div className="state state-warning">
              <strong>
                API indisponível no momento.
              </strong>

              <p>{error}</p>

              <small>
                Exibindo conteúdo de demonstração.
              </small>
            </div>
          )}

          {!loading && (
            <div className="news-grid">
              {articles.map((article) => (
                <NewsCard
                  key={article.id}
                  article={article}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <main className="news-page">
      {/* ==========================================
          CABEÇALHO
      ========================================== */}

      <section className="news-page-header">
        <div className="container">
          <span className="news-page-eyebrow">
            INFORMAÇÃO LOCAL
          </span>

          <div className="news-page-title-row">
            <div>
              <h1>Notícias de Rio Verde</h1>

              <p>
                Acompanhe os principais acontecimentos,
                informações e novidades da cidade.
              </p>
            </div>
          </div>

          {/* ======================================
              CATEGORIAS
          ====================================== */}

          <div
            className="news-category-list"
            aria-label="Filtrar notícias por categoria"
          >
            <button
              type="button"
              className={`news-category-button ${
                selectedCategory === undefined
                  ? 'active'
                  : ''
              }`}
              onClick={() =>
                setSelectedCategory(undefined)
              }
            >
              Todas
            </button>

            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                className={`news-category-button ${
                  selectedCategory === category.id
                    ? 'active'
                    : ''
                }`}
                onClick={() =>
                  setSelectedCategory(category.id)
                }
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          ESTADOS
      ========================================== */}

      {loading && (
        <section className="news-page-content">
          <div className="container">
            <div className="state news-page-state">
              <p>Carregando notícias...</p>
            </div>
          </div>
        </section>
      )}

      {!loading && error && (
        <section className="news-api-warning">
          <div className="container">
            <div className="state state-warning">
              <strong>
                API indisponível no momento.
              </strong>

              <p>{error}</p>

              <small>
                Exibindo conteúdo de demonstração.
              </small>
            </div>
          </div>
        </section>
      )}

      {/* ==========================================
          DESTAQUES
      ========================================== */}

      {!loading && articles.length > 0 && (
        <>
          <section className="news-featured-section">
            <div className="container">
              <div className="news-section-heading">
                <div>
                  <span>EM DESTAQUE</span>
                  <h2>Principais notícias</h2>
                </div>
              </div>

              <div className="news-featured-layout">
                {featuredArticle && (
                  <a
                    href={featuredArticle.url}
                    target="_blank"
                    rel="noreferrer"
                    className="news-featured-main"
                  >
                    <div className="news-featured-main-image">
                      {featuredArticle.image ? (
                        <img
                          src={featuredArticle.image}
                          alt=""
                        />
                      ) : (
                        <div className="news-featured-placeholder">
                          ROUTS
                        </div>
                      )}

                      <div className="news-featured-overlay" />
                    </div>

                    <div className="news-featured-main-content">
                      <span className="news-featured-source">
                        {featuredArticle.source.name}
                      </span>

                      <h2>
                        {featuredArticle.title}
                      </h2>

                      <time
                        dateTime={
                          featuredArticle.publishedAt
                        }
                      >
                        {formatNewsDate(
                          featuredArticle.publishedAt,
                        )}
                      </time>
                    </div>
                  </a>
                )}

                <div className="news-featured-side">
                  {sideArticles.map((article) => (
                    <a
                      key={article.id}
                      href={article.url}
                      target="_blank"
                      rel="noreferrer"
                      className="news-featured-side-item"
                    >
                      <div className="news-featured-side-image">
                        {article.image ? (
                          <img
                            src={article.image}
                            alt=""
                            loading="lazy"
                          />
                        ) : (
                          <div className="news-featured-placeholder">
                            ROUTS
                          </div>
                        )}
                      </div>

                      <div className="news-featured-side-content">
                        <span>
                          {article.source.name}
                        </span>

                        <h3>{article.title}</h3>

                        <time
                          dateTime={
                            article.publishedAt
                          }
                        >
                          {formatNewsDate(
                            article.publishedAt,
                          )}
                        </time>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ======================================
              MAIS NOTÍCIAS
          ====================================== */}

          {remainingArticles.length > 0 && (
            <section className="news-more-section">
              <div className="container">
                <div className="news-section-heading news-more-heading">
                  <div>
                    <span>FIQUE POR DENTRO</span>
                    <h2>Mais notícias</h2>
                  </div>

                  <strong>
                    {remainingArticles.length}{' '}
                    {remainingArticles.length === 1
                      ? 'notícia'
                      : 'notícias'}
                  </strong>
                </div>

                <div className="news-grid news-page-grid">
                  {remainingArticles.map((article) => (
                    <NewsCard
                      key={article.id}
                      article={article}
                    />
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {!loading && articles.length === 0 && (
        <section className="news-page-content">
          <div className="container">
            <div className="state news-page-state">
              <strong>
                Nenhuma notícia encontrada.
              </strong>

              <p>
                Não há conteúdo disponível para esta
                categoria no momento.
              </p>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

