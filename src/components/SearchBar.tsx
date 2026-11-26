import { useEffect, useRef, useState } from 'react';
import { LocateFixed, MapPin, Search } from 'lucide-react';
import { searchPlaces, placeLabel } from '../utils/api';
import { Place } from '../types/weather';

interface SearchBarProps {
  onSelectPlace: (place: Place) => void;
  onUseLocation: () => void;
}

const SearchBar = ({ onSelectPlace, onUseLocation }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Place[]>([]);
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  // wait till they stop typing before hitting the api
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const places = await searchPlaces(query);
        setResults(places);
        setOpen(true);
      } catch (err) {
        console.error(err);
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // close the dropdown if you click somewhere else
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const pick = (place: Place) => {
    onSelectPlace(place);
    setQuery('');
    setResults([]);
    setOpen(false);
  };

  return (
    <div ref={boxRef} className="relative w-full max-w-xl">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute z-10 left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/70" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => results.length > 0 && setOpen(true)}
            onKeyDown={e => {
              if (e.key === 'Enter' && results.length > 0) pick(results[0]);
            }}
            placeholder="Search for a city..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/20 backdrop-blur-md text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/60"
          />
        </div>
        <button
          onClick={onUseLocation}
          title="Use my location"
          className="px-4 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition-colors"
        >
          <LocateFixed className="h-5 w-5" />
        </button>
      </div>

      {open && results.length > 0 && (
        <ul className="absolute z-20 mt-2 w-full rounded-2xl bg-white shadow-xl overflow-hidden">
          {results.map(place => (
            <li key={place.id}>
              <button
                onClick={() => pick(place)}
                className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-sky-50 text-gray-800"
              >
                <MapPin className="h-4 w-4 text-sky-500 shrink-0" />
                <span>{placeLabel(place)}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
