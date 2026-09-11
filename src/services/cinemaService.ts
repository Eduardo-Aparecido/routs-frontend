import type { CinemaResponse } from '../types/cinema';

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export async function getCinemas(): Promise<CinemaResponse> {
  const response = await fetch(`${API_URL}/cinema`);

  if (!response.ok) {
    const body = await response.json().catch(() => null);

    throw new Error(
      body?.message || 'Não foi possível carregar os cinemas.',
    );
  }

  return response.json();
}