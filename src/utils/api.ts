import { DailyWeather, Forecast, HourlyWeather, Place, Units } from '../types/weather';

// open-meteo is free and doesn't need an api key
const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

export const searchPlaces = async (query: string): Promise<Place[]> => {
  if (query.trim().length < 2) return [];

  const res = await fetch(`${GEO_URL}?name=${encodeURIComponent(query.trim())}&count=6&language=en&format=json`);
  if (!res.ok) throw new Error('city search failed');

  const data = await res.json();
  return data.results ?? [];
};

// shape of what open-meteo sends back (only the parts i use)
interface ForecastResponse {
  current: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    precipitation: number;
    weather_code: number;
    is_day: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
    precipitation_probability: number[];
    is_day: number[];
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
    sunrise: string[];
    sunset: string[];
  };
}

export const fetchForecast = async (lat: number, lon: number, units: Units): Promise<Forecast> => {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: 'temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,precipitation,weather_code,is_day',
    hourly: 'temperature_2m,weather_code,precipitation_probability,is_day',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset',
    temperature_unit: units,
    wind_speed_unit: units === 'fahrenheit' ? 'mph' : 'kmh',
    precipitation_unit: units === 'fahrenheit' ? 'inch' : 'mm',
    timezone: 'auto',
    forecast_days: '7',
  });

  const res = await fetch(`${FORECAST_URL}?${params}`);
  if (!res.ok) throw new Error('forecast request failed');
  const data: ForecastResponse = await res.json();

  // hourly comes back as 7 days worth, only want the next 24 hours from now
  const nowHour = data.current.time.slice(0, 13); // "2025-06-01T14"
  let start = data.hourly.time.findIndex(t => t.startsWith(nowHour));
  if (start === -1) start = 0;

  const hourly: HourlyWeather[] = data.hourly.time.slice(start, start + 24).map((time, i) => ({
    time,
    temperature: data.hourly.temperature_2m[start + i],
    weatherCode: data.hourly.weather_code[start + i],
    precipChance: data.hourly.precipitation_probability[start + i] ?? 0,
    isDay: data.hourly.is_day[start + i] === 1,
  }));

  const daily: DailyWeather[] = data.daily.time.map((date, i) => ({
    date,
    weatherCode: data.daily.weather_code[i],
    high: data.daily.temperature_2m_max[i],
    low: data.daily.temperature_2m_min[i],
    precipChance: data.daily.precipitation_probability_max[i] ?? 0,
    sunrise: data.daily.sunrise[i],
    sunset: data.daily.sunset[i],
  }));

  return {
    current: {
      time: data.current.time,
      temperature: data.current.temperature_2m,
      feelsLike: data.current.apparent_temperature,
      humidity: data.current.relative_humidity_2m,
      windSpeed: data.current.wind_speed_10m,
      precipitation: data.current.precipitation,
      weatherCode: data.current.weather_code,
      isDay: data.current.is_day === 1,
    },
    hourly,
    daily,
  };
};

// skip the state if its the same as the city name (like "Tokyo, Tokyo, Japan")
export const placeLabel = (place: Place) =>
  [place.name, place.admin1 !== place.name ? place.admin1 : undefined, place.country].filter(Boolean).join(', ');
