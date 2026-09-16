import axios from 'axios';

export interface Restaurant {
  id: string;
  name: string;
  image: string | null;
  address: string | null;
  neighborhood: string | null;
  phone: string | null;
  instagram: string | null;
  mapsUrl: string | null;
}

export interface RestaurantResponse {
  city: string;
  total: number;
  restaurants: Restaurant[];
}

const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:3000/api';

export async function getRestaurants(): Promise<RestaurantResponse> {
  const response = await axios.get<RestaurantResponse>(
    `${API_URL}/restaurants`,
  );

  return response.data;
}

