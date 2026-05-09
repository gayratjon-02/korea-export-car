'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, Car } from 'lucide-react';
import { formatCurrency } from '@kci/utils';

export default function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (val: string) => {
    setQuery(val);
    if (val.length < 2) {
      setResults([]);
      return;
    }
    
    setLoading(true);
    try {
      const { getCars } = await import('@/lib/api/cars');
      const res = await getCars({ q: val, limit: 4 });
      setResults(res.items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectCar = (carId: string) => {
    router.push(`/calculator?carId=${carId}`);
  };

  return (
    <div className="hero-search-wrapper w-full max-w-2xl mx-auto mt-8 relative z-20">
      <div className="relative flex items-center bg-white rounded-full p-2 shadow-2xl border border-gray-100">
        <div className="pl-4 text-primary">
          <Search size={24} />
        </div>
        <input 
          type="text" 
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Mashina qidiring (masalan: Kia K5, Sonata, 2023...)"
          className="w-full bg-transparent border-none text-gray-800 focus:outline-none px-4 py-3 text-lg font-medium placeholder:text-gray-400 placeholder:font-normal"
        />
        <button 
          className="btn btn-primary rounded-full px-6 py-3 font-bold text-white shrink-0 hover:scale-105 transition-transform"
          onClick={() => {
            if (results.length > 0) selectCar(results[0].id);
          }}
        >
          Hisoblash <ArrowRight size={18} className="ml-1" />
        </button>
      </div>

      {/* Auto-suggest Results Dropdown */}
      {(results.length > 0 || loading || (query.length >= 2 && results.length === 0 && !loading)) && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden text-left z-30">
          {loading ? (
            <div className="p-4 text-center text-gray-500 font-medium">Qidirilmoqda...</div>
          ) : results.length > 0 ? (
            <div className="flex flex-col">
              {results.map((car) => (
                <button
                  key={car.id}
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 border-b border-gray-50 transition-colors last:border-0 w-full text-left"
                  onClick={() => selectCar(car.id)}
                >
                  <div className="w-16 h-12 rounded overflow-hidden bg-gray-100 shrink-0">
                    {car.media && car.media[0] ? (
                      <img src={car.media[0].url} alt={car.model} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400"><Car size={20} /></div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <div className="font-bold text-gray-800 text-lg">{car.year} {car.brand} {car.model}</div>
                    <div className="text-gray-500 text-sm">{car.engineCc} cc • {car.fuelType}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-extrabold text-primary">{formatCurrency(car.priceUsd, 'USD')}</div>
                    <div className="text-xs text-accent font-semibold flex items-center justify-end gap-1">Tanlash <ArrowRight size={12}/></div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center">
              <div className="text-gray-400 mb-2"><Car size={32} className="mx-auto opacity-50" /></div>
              <p className="font-bold text-gray-700">Mashina topilmadi</p>
              <p className="text-sm text-gray-500 mt-1">
                Afsuski, ushbu nomdagi avtomobil hozircha bizning katalogda yo'q. Boshqa so'z bilan qidirib ko'ring.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
