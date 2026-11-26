import { Droplets } from 'lucide-react';
import { DailyWeather } from '../types/weather';
import { getIconColor, getWeatherIcon, getWeatherLabel } from '../utils/weatherCodes';
import { formatDay, round } from '../utils/format';

interface DailyForecastProps {
  days: DailyWeather[];
}

const DailyForecast = ({ days }: DailyForecastProps) => {
  // used to draw the temp range bars so they line up across the whole week
  const weekLow = Math.min(...days.map(d => d.low));
  const weekHigh = Math.max(...days.map(d => d.high));
  const range = weekHigh - weekLow || 1;

  return (
    <section className="rounded-3xl bg-white/15 backdrop-blur-md border border-white/20 p-5 text-white shadow-lg">
      <h3 className="text-sm uppercase tracking-wide text-white/70 mb-3">7 Day Forecast</h3>
      <ul className="divide-y divide-white/10">
        {days.map((day, i) => {
          const Icon = getWeatherIcon(day.weatherCode);
          const left = ((day.low - weekLow) / range) * 100;
          const width = ((day.high - day.low) / range) * 100;

          return (
            <li key={day.date} className="flex items-center gap-3 py-3" title={getWeatherLabel(day.weatherCode)}>
              <span className="w-14 font-medium">{formatDay(day.date, i)}</span>
              <Icon className={`h-6 w-6 shrink-0 ${getIconColor(day.weatherCode, true)}`} />
              <span className="w-12 text-xs text-sky-200 flex items-center">
                {day.precipChance > 0 && (
                  <>
                    <Droplets className="h-3 w-3 mr-0.5" />
                    {day.precipChance}%
                  </>
                )}
              </span>
              <span className="w-10 text-right text-white/70">{round(day.low)}°</span>
              <div className="flex-1 h-1.5 rounded-full bg-white/15 relative">
                <div
                  className="absolute h-full rounded-full bg-gradient-to-r from-sky-300 via-yellow-300 to-orange-400"
                  style={{ left: `${left}%`, width: `${Math.max(width, 4)}%` }}
                />
              </div>
              <span className="w-10 font-semibold">{round(day.high)}°</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default DailyForecast;
