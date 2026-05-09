'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Calculator, ArrowRight, Info, Car, MapPin, AlertCircle, Search, Link as LinkIcon, CheckCircle2 } from 'lucide-react';
import { getCountries, getCities, calculateCost, parseExternalUrl } from '@/lib/api/calculator';
import { formatCurrency } from '@kci/utils';
import { ICountry, ICity, ICalculationResult } from '@kci/types';
import './calculator.css';

function CalculatorContent() {
  const searchParams = useSearchParams();
  const initialCarId = searchParams?.get('carId') || '';

  const [activeTab, setActiveTab] = useState<'katalog' | 'url'>('katalog');

  // Locations
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  const [countryCode, setCountryCode] = useState('');
  const [cityId, setCityId] = useState('');
  
  // Catalog flow
  const [carId, setCarId] = useState(initialCarId);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedCar, setSelectedCar] = useState<any>(null);

  const searchCars = async (query: string) => {
    try {
      const { getCars } = await import('@/lib/api/cars');
      const res = await getCars({ q: query, limit: 5 });
      setSearchResults(res.items);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (initialCarId && !selectedCar) {
      import('@/lib/api/cars').then(({ getCarById }) => {
        getCarById(initialCarId).then(car => {
          setSelectedCar(car);
          setSearchQuery(`${car.year} ${car.brand} ${car.model}`);
        }).catch(console.error);
      });
    }
  }, [initialCarId]);
  
  // URL flow
  const [url, setUrl] = useState('');
  const [parsing, setParsing] = useState(false);
  const [parsedCar, setParsedCar] = useState<any>(null);

  // General State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<ICalculationResult | null>(null);

  useEffect(() => {
    getCountries().then(setCountries).catch(console.error);
  }, []);

  useEffect(() => {
    if (countryCode) {
      getCities(countryCode).then(setCities).catch(console.error);
      setCityId('');
    } else {
      setCities([]);
    }
  }, [countryCode]);

  const handleParseUrl = async () => {
    if (!url) return;
    setParsing(true);
    setError('');
    setParsedCar(null);
    setResult(null);

    try {
      const data = await parseExternalUrl(url);
      setParsedCar(data);
    } catch (err: any) {
      setError(err.message || "Saytdan ma'lumot olishda xatolik");
    } finally {
      setParsing(false);
    }
  };

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!countryCode || !cityId) {
      setError('Iltimos davlat va shaharni tanlang');
      return;
    }
    if (activeTab === 'katalog' && !carId) {
      setError('Avtomobil ID sini kiriting');
      return;
    }
    if (activeTab === 'url' && !parsedCar) {
      setError('Avval URL orqali mashinani qidirib toping');
      return;
    }
    
    setError('');
    setLoading(true);
    setResult(null);

    try {
      const payload = activeTab === 'katalog' 
        ? { carId, countryCode, cityId }
        : { countryCode, cityId, manualCar: parsedCar };
        
      const res = await calculateCost(payload);
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Hisoblashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="calc-page">
      <div className="calc-header bg-primary text-white text-center py-12">
        <div className="container">
          <Calculator size={48} className="mx-auto mb-4 text-accent" />
          <h1>Smart Bojxona Kalkulyatori</h1>
          <p className="max-w-2xl mx-auto mt-4 text-gray-200">
            Katalogimizdagi avtomobillarni yoki to'g'ridan-to'g'ri Koreya saytlaridagi (Encar, KBCha) havolalarni kiritib, to'liq xarajatni hisoblang.
          </p>
        </div>
      </div>

      <div className="container py-12">
        <div className="calc-grid">
          {/* Form Section */}
          <div className="calc-form-section card">
            
            <div className="calc-tabs flex border-b border-gray-100">
              <button 
                className={`flex-1 py-4 text-sm font-bold border-b-2 transition-all ${activeTab === 'katalog' ? 'border-primary text-primary' : 'border-transparent text-muted hover:bg-gray-50'}`}
                onClick={() => { setActiveTab('katalog'); setResult(null); setError(''); }}
              >
                Katalogdan tanlash
              </button>
              <button 
                className={`flex-1 py-4 text-sm font-bold border-b-2 transition-all ${activeTab === 'url' ? 'border-primary text-primary' : 'border-transparent text-muted hover:bg-gray-50'}`}
                onClick={() => { setActiveTab('url'); setResult(null); setError(''); }}
              >
                Boshqa saytdan URL
              </button>
            </div>

            <div className="p-8">
              <form onSubmit={handleCalculate} className="calc-form flex flex-col gap-6">
                
                {/* DYNAMIC INPUT AREA */}
                {activeTab === 'katalog' ? (
                  <div className="form-group relative">
                    <label className="form-label">Katalogdan mashina qidirish</label>
                    <div className="relative">
                      <Search size={18} className="absolute left-3 top-3.5 text-muted" />
                      <input 
                        type="text" 
                        value={searchQuery} 
                        onChange={e => {
                          setSearchQuery(e.target.value);
                          if (e.target.value.length > 2) {
                            searchCars(e.target.value);
                          } else {
                            setSearchResults([]);
                          }
                          if (selectedCar && selectedCar.id !== carId) setSelectedCar(null);
                        }}
                        placeholder="Masalan: Kia K5, Hyundai Sonata..." 
                        className="form-input pl-10"
                      />
                    </div>

                    {/* Dropdown Results */}
                    {searchResults.length > 0 && !selectedCar && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-100 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {searchResults.map((car: any) => (
                          <button
                            key={car.id}
                            type="button"
                            className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-50 flex gap-3 items-center"
                            onClick={() => {
                              setSelectedCar(car);
                              setCarId(car.id);
                              setSearchQuery(`${car.year} ${car.brand} ${car.model}`);
                              setSearchResults([]);
                            }}
                          >
                            <img 
                              src={car.media?.[0]?.url || 'https://via.placeholder.com/100'} 
                              alt="Car" 
                              className="w-12 h-8 object-cover rounded" 
                            />
                            <div>
                              <div className="font-semibold text-sm text-gray-800">{car.year} {car.brand} {car.model}</div>
                              <div className="text-xs text-gray-500">{car.engineCc} cc • {formatCurrency(car.priceUsd, 'USD')}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="form-group">
                    <label className="form-label">Avtomobil Havolasi (Encar, KBCha va h.k.)</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <LinkIcon size={18} className="absolute left-3 top-3.5 text-muted" />
                        <input 
                          type="url" 
                          value={url} 
                          onChange={e => setUrl(e.target.value)}
                          placeholder="https://www.encar.com/..." 
                          className="form-input pl-10"
                        />
                      </div>
                      <button 
                        type="button" 
                        className="btn btn-secondary shrink-0"
                        onClick={handleParseUrl}
                        disabled={parsing || !url}
                      >
                        {parsing ? <span className="loader-sm"></span> : <Search size={18} />} Izlash
                      </button>
                    </div>

                    {/* PARSED PREVIEW */}
                    {parsedCar && (
                      <div className="mt-4 p-4 border border-blue-100 bg-blue-50 rounded-lg flex items-start gap-4">
                        {parsedCar.imageUrl && (
                          <img src={parsedCar.imageUrl} alt="Car" className="w-20 h-16 object-cover rounded shadow-sm" />
                        )}
                        <div>
                          <div className="flex items-center gap-1 text-primary text-xs font-bold mb-1">
                            <CheckCircle2 size={12} /> Ma'lumot olindi
                          </div>
                          <h4 className="font-bold text-sm leading-tight mb-1">{parsedCar.year} {parsedCar.brand} {parsedCar.model}</h4>
                          <p className="text-xs text-gray-600">
                            {parsedCar.engineCc} cc • ~{formatCurrency(parsedCar.carPriceUsd, 'USD')}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="h-px bg-gray-100 my-2"></div>

                <div className="form-group">
                  <label className="form-label">Qabul qiluvchi davlat</label>
                  <select 
                    value={countryCode} 
                    onChange={e => setCountryCode(e.target.value)}
                    className="form-select"
                    required
                  >
                    <option value="">Davlatni tanlang</option>
                    {countries.map(c => (
                      <option key={c.id} value={c.code}>{c.nameUz || c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Shahar / Bojxona posti</label>
                  <select 
                    value={cityId} 
                    onChange={e => setCityId(e.target.value)}
                    className="form-select"
                    disabled={!countryCode || cities.length === 0}
                    required
                  >
                    <option value="">Shaharni tanlang</option>
                    {cities.map(c => (
                      <option key={c.id} value={c.id}>{c.nameUz || c.name}</option>
                    ))}
                  </select>
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-md flex items-start gap-3 mt-2">
                    <AlertCircle size={20} className="shrink-0 mt-0.5" />
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                <button 
                  type="submit" 
                  className="btn btn-primary btn-lg w-full mt-4"
                  disabled={loading || (activeTab === 'url' && !parsedCar)}
                >
                  {loading ? 'Hisoblanmoqda...' : 'Hisoblash'} <ArrowRight size={20} />
                </button>
              </form>
            </div>
          </div>

          {/* Result Section */}
          <div className="calc-result-section">
            {!result ? (
              <div className="empty-result card flex flex-col items-center justify-center text-center p-12 h-full">
                <Calculator size={64} className="text-muted mb-4 opacity-50" />
                <h3 className="text-xl font-bold text-muted mb-2">Natija bu yerda ko'rinadi</h3>
                <p className="text-muted text-sm max-w-sm opacity-80">
                  Kerakli ma'lumotlarni kiritib, "Hisoblash" tugmasini bosing va barcha to'lovlar ro'yxati shu yerda hosil bo'ladi.
                </p>
              </div>
            ) : (
              <div className="result-card card overflow-hidden">
                <div className="bg-primary text-white p-6 text-center">
                  <p className="text-blue-200 text-sm mb-1 uppercase tracking-wider font-semibold">Yakuniy Narx (CIP)</p>
                  <div className="text-4xl font-extrabold font-outfit text-accent">
                    {formatCurrency(result.total, 'USD')}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-lg mb-4 border-b pb-2">To'lovlar Taqvimi</h3>
                  
                  <div className="breakdown-list flex flex-col gap-3 mb-6">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 flex items-center gap-2">
                        <Car size={16} /> Avtomobil narxi (FOB)
                      </span>
                      <span className="font-semibold">{formatCurrency(result.carPrice, 'USD')}</span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Yetkazib berish (Logistika)</span>
                      <span className="font-semibold">{formatCurrency(result.shipping, 'USD')}</span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Bojxona (Boj + QQS + Aksiz)</span>
                      <span className="font-semibold">{formatCurrency(result.customsDuty + result.vat + result.excise + result.utilizationFee + result.registrationFee, 'USD')}</span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">KCI Agentlik xizmati & Sug'urta</span>
                      <span className="font-semibold">
                        {formatCurrency(result.insurance + result.additionalFees, 'USD')}
                      </span>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3 border border-blue-100">
                    <Info size={20} className="text-primary shrink-0 mt-0.5" />
                    <p className="text-xs text-primary leading-relaxed">
                      Eslatma: Boshqa saytlardan olingan URL orqali hisoblashlar taxminiy hisoblanadi. Aniqlik kiritish uchun agentlarimiz bilan bog'laning.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CalculatorPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-muted">Kalkulyator yuklanmoqda...</div>}>
      <CalculatorContent />
    </Suspense>
  );
}
