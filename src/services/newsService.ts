import type {
  NewsCategory,
  NewsResponse,
} from '../types/news';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export async function getNews(
  query?: string,
  category?: number,
): Promise<NewsResponse> {
  const url = new URL(`${API_URL}/news`);

  if (query?.trim()) {
    url.searchParams.set('q', query.trim());
  }

  if (category) {
    url.searchParams.set('category', String(category));
  }

  const response = await fetch(url);

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message || 'Não foi possível carregar as notícias.');
  }

  return response.json();
}

export async function getNewsCategories(): Promise<NewsCategory[]> {
  const response = await fetch(`${API_URL}/news/categories`);

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(
      body?.message || 'Não foi possível carregar as categorias.',
    );
  }

  return response.json();
}