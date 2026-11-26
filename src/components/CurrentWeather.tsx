import { motion } from 'framer-motion';
import { Droplets, Sunrise, Sunset, Thermometer, Umbrella, Wind } from 'lucide-react';
import { CurrentWeather as Current, DailyWeather, Units } from '../types/weather';
import { getIconColor, getWeatherIcon, getWeatherLabel } from '../utils/weatherCodes';
import { formatDate, formatTime, round } from '../utils/format';

interface CurrentWeatherProps {
  location: string;
  current: Current;
  today: DailyWeather;
  units: Units;
}

const CurrentWeather = ({ location, current, today, units }: CurrentWeatherProps) => {
  const Icon = getWeatherIcon(current.weatherCode, current.isDay);
  const speedUnit = units === 'fahrenheit' ? 'mph' : 'km/h';

  const details = [
    { icon: Thermometer, label: 'Feels Like', value: `${round(current.feelsLike)}°` },
    { icon: Droplets, label: 'Humidity', value: `${current.humidity}%` },
    { icon: Wind, label: 'Wind', value: `${round(current.windSpeed)} ${speedUnit}` },
    { icon: Umbrella, label: 'Rain Chance', value: `${today.precipChance}%` },
    { icon: Sunrise, label: 'Sunrise', value: formatTime(today.sunrise) },
    { icon: Sunset, label: 'Sunset', value: formatTime(today.sunset) },
  ];

  return (
    <motion.section
      key={location}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-3xl bg-white/15 backdrop-blur-md border border-white/20 p-6 md:p-8 text-white shadow-lg"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">{location}</h2>
          <p className="text-white/80">{formatDate(current.time)}</p>

          <div className="flex items-center gap-4 mt-4">
            <Icon className={`h-20 w-20 md:h-24 md:w-24 ${getIconColor(current.weatherCode, current.isDay)}`} />
            <div>
              <p className="text-6xl md:text-7xl font-light leading-none">{round(current.temperature)}°</p>
              <p className="text-lg mt-1">{getWeatherLabel(current.weatherCode)}</p>
              <p className="text-white/80 text-sm">
                H: {round(today.high)}° &nbsp; L: {round(today.low)}°
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:w-1/2">
          {details.map(d => (
            <div key={d.label} className="rounded-2xl bg-white/10 p-3">
              <div className="flex items-center gap-2 text-white/70 text-xs uppercase tracking-wide">
                <d.icon className="h-4 w-4" />
                {d.label}
              </div>
              <p className="text-xl font-semibold mt-1">{d.value}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default CurrentWeather;
