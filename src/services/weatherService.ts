import axios from 'axios';

const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:3000/api';

export interface Weather {
  city: string;
  state: string;
  temperature: number;
  condition: string;
  weatherCode: number;
  isDay: boolean;
  updatedAt: string;
}

export async function getWeather(): Promise<Weather> {
  const response = await axios.get<Weather>(
    `${API_URL}/weather`,
  );

  return response.data;
}

