import { useEffect, useState } from 'react';
import { NewsCard } from '../components/NewsCard';
import { getNews } from '../services/newsService';
import { fallbackNews } from '../data/fallbackNews';
import type { NewsItem } from '../types/news';

interface NewsProps {
  compact?: boolean;
}

export function News({ compact = false }: NewsProps) {
  const [articles, setArticles] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadNews() {
      try {
        setLoading(true);
        setError('');

        const response = await getNews();
        setArticles(compact ? response.articles.slice(0, 6) : response.articles);
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
  }, [compact]);

  return (
    <section className="section">
      <div className="container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">INFORMAÇÃO LOCAL</span>
            <h1>{compact ? 'Últimas notícias' : 'Notícias de Rio Verde'}</h1>
          </div>
        </div>

        {loading && (
          <div className="state">
            <p>Carregando notícias...</p>
          </div>
        )}

        {error && (
          <div className="state state-warning">
            <strong>API indisponível no momento.</strong>
            <p>{error}</p>
            <small>Exibindo conteúdo de demonstração.</small>
          </div>
        )}

        {!loading && (
          <div className="news-grid">
            {articles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
