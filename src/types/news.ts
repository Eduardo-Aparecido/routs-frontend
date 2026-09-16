export interface NewsSource {
  name: string;
  url: string;
}

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  image: string | null;
  publishedAt: string;
  source: NewsSource;
}

export interface NewsResponse {
  total: number;
  articles: NewsItem[];
}

export interface NewsCategory {
  id: number;
  name: string;
  slug: string;
}