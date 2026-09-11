import type { NewsResponse } from '../types/news';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export async function getNews(query?: string): Promise<NewsResponse> {
  const url = new URL(`${API_URL}/news`);

  if (query?.trim()) {
    url.searchParams.set('q', query.trim());
  }

  const response = await fetch(url);

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message || 'Não foi possível carregar as notícias.');
  }

  return response.json();
}
