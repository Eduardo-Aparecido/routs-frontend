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