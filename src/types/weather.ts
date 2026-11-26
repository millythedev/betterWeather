export type Units = 'fahrenheit' | 'celsius';

export interface Place {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string; // state / province
}

export interface CurrentWeather {
  time: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  weatherCode: number;
  isDay: boolean;
}

export interface HourlyWeather {
  time: string;
  temperature: number;
  weatherCode: number;
  precipChance: number;
  isDay: boolean;
}

export interface DailyWeather {
  date: string;
  weatherCode: number;
  high: number;
  low: number;
  precipChance: number;
  sunrise: string;
  sunset: string;
}

export interface Forecast {
  current: CurrentWeather;
  hourly: HourlyWeather[];
  daily: DailyWeather[];
}
