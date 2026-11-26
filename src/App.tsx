import { useCallback, useEffect, useState } from 'react';
import { CloudSun } from 'lucide-react';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import HourlyForecast from './components/HourlyForecast';
import DailyForecast from './components/DailyForecast';
import { fetchForecast, placeLabel } from './utils/api';
import { getBackground } from './utils/weatherCodes';
import { Forecast, Place, Units } from './types/weather';

// default to college station since thats where i am
const DEFAULT_PLACE: Place = {
  id: 4682464,
  name: 'College Station',
  latitude: 30.628,
  longitude: -96.3344,
  country: 'United States',
  admin1: 'Texas',
};

// remember the last city and unit so it doesnt reset every time
const loadSaved = <T,>(key: string, fallback: T): T => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? (JSON.parse(saved) as T) : fallback;
  } catch {
    return fallback;
  }
};

const save = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // private browsing or storage blocked, not a big deal
  }
};

function App() {
  const [place, setPlace] = useState<Place>(() => loadSaved('bw-place', DEFAULT_PLACE));
  const [units, setUnits] = useState<Units>(() => loadSaved('bw-units', 'fahrenheit'));
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadWeather = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchForecast(place.latitude, place.longitude, units);
      setForecast(data);
    } catch (err) {
      console.error(err);
      setError('Could not load the weather right now. Try again in a bit.');
    } finally {
      setIsLoading(false);
    }
  }, [place, units]);

  useEffect(() => {
    loadWeather();
  }, [loadWeather]);

  const handleSelectPlace = (newPlace: Place) => {
    setPlace(newPlace);
    save('bw-place', newPlace);
  };

  const handleUnits = (newUnits: Units) => {
    setUnits(newUnits);
    save('bw-units', newUnits);
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setError('Your browser does not support location.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      pos => {
        handleSelectPlace({
          id: 0,
          name: 'My Location',
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      () => setError('Location permission was denied, search for a city instead.')
    );
  };

  const background = forecast
    ? getBackground(forecast.current.weatherCode, forecast.current.isDay)
    : 'from-sky-400 via-sky-500 to-blue-600';

  return (
    <div className={`min-h-screen bg-gradient-to-br ${background} transition-colors duration-700`}>
      <div className="container mx-auto max-w-5xl px-4 py-6 md:py-10">
        <header className="flex flex-col md:flex-row md:items-center gap-4 md:justify-between mb-8">
          <div className="flex items-center gap-2 text-white">
            <CloudSun className="h-8 w-8 text-yellow-300" />
            <h1 className="text-2xl md:text-3xl font-bold">Better Weather</h1>
          </div>

          <div className="flex items-center gap-3 md:flex-1 md:justify-end">
            <SearchBar onSelectPlace={handleSelectPlace} onUseLocation={handleUseLocation} />

            <div className="flex rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 overflow-hidden shrink-0">
              {(['fahrenheit', 'celsius'] as Units[]).map(u => (
                <button
                  key={u}
                  onClick={() => handleUnits(u)}
                  className={`px-3 py-3 text-sm font-semibold transition-colors ${
                    units === u ? 'bg-white text-sky-700' : 'text-white hover:bg-white/20'
                  }`}
                >
                  °{u === 'fahrenheit' ? 'F' : 'C'}
                </button>
              ))}
            </div>
          </div>
        </header>

        {error && (
          <div className="mb-6 rounded-2xl bg-red-500/80 text-white p-4 flex items-center justify-between gap-4">
            <p>{error}</p>
            <button
              onClick={loadWeather}
              className="shrink-0 bg-white text-red-600 px-4 py-1.5 rounded-xl font-semibold hover:bg-red-50"
            >
              Retry
            </button>
          </div>
        )}

        {isLoading && !forecast ? (
          <div className="flex flex-col items-center justify-center h-64 text-white">
            <CloudSun className="h-16 w-16 animate-bounce text-yellow-300" />
            <p className="mt-4 text-lg">Loading weather...</p>
          </div>
        ) : (
          forecast && (
            <main className={`space-y-6 transition-opacity ${isLoading ? 'opacity-60' : 'opacity-100'}`}>
              <CurrentWeather
                location={placeLabel(place)}
                current={forecast.current}
                today={forecast.daily[0]}
                units={units}
              />
              <HourlyForecast hours={forecast.hourly} />
              <DailyForecast days={forecast.daily} />
            </main>
          )
        )}

        <footer className="text-center text-white/60 text-sm mt-10">
          weather data from{' '}
          <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">
            Open-Meteo
          </a>
        </footer>
      </div>
    </div>
  );
}

export default App;
