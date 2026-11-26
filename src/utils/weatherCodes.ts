import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudMoon,
  CloudRain,
  CloudSnow,
  CloudSun,
  LucideIcon,
  Moon,
  Sun,
} from 'lucide-react';

// open-meteo uses WMO weather codes
// https://open-meteo.com/en/docs (scroll to the bottom for the table)
type Condition = 'clear' | 'partly' | 'cloudy' | 'fog' | 'drizzle' | 'rain' | 'snow' | 'storm';

const codeToCondition = (code: number): Condition => {
  if (code === 0) return 'clear';
  if (code === 1 || code === 2) return 'partly';
  if (code === 3) return 'cloudy';
  if (code === 45 || code === 48) return 'fog';
  if (code >= 51 && code <= 57) return 'drizzle';
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return 'rain';
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'snow';
  if (code >= 95) return 'storm';
  return 'cloudy';
};

const labels: Record<number, string> = {
  0: 'Clear',
  1: 'Mostly Clear',
  2: 'Partly Cloudy',
  3: 'Overcast',
  45: 'Foggy',
  48: 'Freezing Fog',
  51: 'Light Drizzle',
  53: 'Drizzle',
  55: 'Heavy Drizzle',
  56: 'Freezing Drizzle',
  57: 'Freezing Drizzle',
  61: 'Light Rain',
  63: 'Rain',
  65: 'Heavy Rain',
  66: 'Freezing Rain',
  67: 'Freezing Rain',
  71: 'Light Snow',
  73: 'Snow',
  75: 'Heavy Snow',
  77: 'Snow Grains',
  80: 'Light Showers',
  81: 'Showers',
  82: 'Heavy Showers',
  85: 'Snow Showers',
  86: 'Heavy Snow Showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm w/ Hail',
  99: 'Thunderstorm w/ Hail',
};

export const getWeatherLabel = (code: number) => labels[code] ?? 'Unknown';

export const getWeatherIcon = (code: number, isDay = true): LucideIcon => {
  switch (codeToCondition(code)) {
    case 'clear':
      return isDay ? Sun : Moon;
    case 'partly':
      return isDay ? CloudSun : CloudMoon;
    case 'fog':
      return CloudFog;
    case 'drizzle':
      return CloudDrizzle;
    case 'rain':
      return CloudRain;
    case 'snow':
      return CloudSnow;
    case 'storm':
      return CloudLightning;
    default:
      return Cloud;
  }
};

// background changes depending on the weather and if its day or night
export const getBackground = (code: number, isDay: boolean) => {
  if (!isDay) return 'from-slate-900 via-indigo-950 to-slate-800';

  switch (codeToCondition(code)) {
    case 'clear':
      return 'from-sky-400 via-sky-500 to-blue-600';
    case 'partly':
      return 'from-sky-400 via-blue-500 to-slate-500';
    case 'rain':
    case 'drizzle':
      return 'from-slate-500 via-slate-600 to-blue-800';
    case 'storm':
      return 'from-slate-700 via-gray-800 to-purple-900';
    case 'snow':
      return 'from-slate-200 via-sky-300 to-slate-400';
    default:
      return 'from-slate-400 via-slate-500 to-slate-600';
  }
};

export const getIconColor = (code: number, isDay: boolean) => {
  const condition = codeToCondition(code);
  if (condition === 'clear') return isDay ? 'text-yellow-300' : 'text-slate-200';
  if (condition === 'partly') return isDay ? 'text-yellow-200' : 'text-slate-200';
  if (condition === 'storm') return 'text-yellow-300';
  return 'text-white';
};
