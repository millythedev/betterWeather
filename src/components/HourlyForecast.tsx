import { Droplets } from 'lucide-react';
import { HourlyWeather } from '../types/weather';
import { getIconColor, getWeatherIcon } from '../utils/weatherCodes';
import { formatHour, round } from '../utils/format';

interface HourlyForecastProps {
  hours: HourlyWeather[];
}

const HourlyForecast = ({ hours }: HourlyForecastProps) => {
  return (
    <section className="rounded-3xl bg-white/15 backdrop-blur-md border border-white/20 p-5 text-white shadow-lg">
      <h3 className="text-sm uppercase tracking-wide text-white/70 mb-3">Next 24 Hours</h3>
      <div className="flex gap-3 overflow-x-auto pb-2 scroll-thin">
        {hours.map((hour, i) => {
          const Icon = getWeatherIcon(hour.weatherCode, hour.isDay);
          return (
            <div key={hour.time} className="flex flex-col items-center min-w-[64px] rounded-2xl bg-white/10 py-3 px-2">
              <span className="text-sm text-white/80">{i === 0 ? 'Now' : formatHour(hour.time)}</span>
              <Icon className={`h-7 w-7 my-2 ${getIconColor(hour.weatherCode, hour.isDay)}`} />
              <span className="text-lg font-semibold">{round(hour.temperature)}°</span>
              {hour.precipChance > 0 && (
                <span className="flex items-center text-xs text-sky-200 mt-1">
                  <Droplets className="h-3 w-3 mr-0.5" />
                  {hour.precipChance}%
                </span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default HourlyForecast;
