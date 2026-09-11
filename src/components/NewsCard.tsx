import type { NewsItem } from '../types/news';

interface NewsCardProps {
  article: NewsItem;
}

export function NewsCard({ article }: NewsCardProps) {
  return (
    <article className="news-card">
      {article.image ? (
        <img
          src={article.image}
          alt=""
          className="news-image"
          loading="lazy"
        />
      ) : (
        <div className="news-image news-image-placeholder">ROUTS</div>
      )}

      <div className="news-content">
        <span className="news-source">{article.source.name}</span>

        <h2>{article.title}</h2>

        <p>{article.description}</p>

        <div className="news-footer">
          <time dateTime={article.publishedAt}>
            {new Date(article.publishedAt).toLocaleDateString('pt-BR')}
          </time>

          <a
            href={article.url}
            target="_blank"
            rel="noreferrer"
            className="read-link"
          >
            Ler notícia →
          </a>
        </div>
      </div>
    </article>
  );
}
