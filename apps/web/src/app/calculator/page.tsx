'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Calculator, ArrowRight, Info, Car, MapPin, AlertCircle, Search, Link as LinkIcon, CheckCircle2, ShieldCheck, Gauge, Calendar, Fuel } from 'lucide-react';
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
  const [isSearching, setIsSearching] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);

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

  const searchCars = async (query: string) => {
    setIsSearching(true);
    try {
      const { getCars } = await import('@/lib/api/cars');
      const res = await getCars({ q: query, limit: 5 });
      setSearchResults(res.items);
    } catch (err) {
      console.error(err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
      setSearchAttempted(true);
    }
  };

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
      <div className="calc-header text-white text-center">
        <div className="container relative z-10 calc-header-content">
          <div className="calc-header-icon mb-6">
            <Calculator size={32} className="text-white" />
          </div>
          <h1 className="calc-title mb-4">Smart Bojxona Kalkulyatori</h1>
          <p className="calc-subtitle text-blue-200">
            Katalogimizdagi avtomobillarni tanlang yoki to'g'ridan-to'g'ri Koreya saytlaridagi havolani kiritib, barcha xarajatlarni aniq hisoblang.
          </p>
        </div>
      </div>

      <div className="container py-12">
        <div className={result ? "calc-grid" : "max-w-2xl mx-auto"}>
          {/* Form Section */}
          <div className="calc-form-section premium-card">
            
            <div className="calc-tabs">
              <button 
                className={`calc-tab ${activeTab === 'katalog' ? 'active' : ''}`}
                onClick={() => { setActiveTab('katalog'); setResult(null); setError(''); }}
              >
                Katalogdan tanlash
              </button>
              <button 
                className={`calc-tab ${activeTab === 'url' ? 'active' : ''}`}
                onClick={() => { setActiveTab('url'); setResult(null); setError(''); }}
              >
                Koreya saytlaridan URL
              </button>
            </div>

            <div className="calc-form-inner">
              <form onSubmit={handleCalculate} className="flex flex-col gap-8">
                
                {/* STEP 1: CAR SELECTION */}
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="step-indicator">1</div>
                    <h3 className="font-bold text-xl text-primary">Avtomobilni ko'rsating</h3>
                  </div>

                  {activeTab === 'katalog' ? (
                    <div className="form-group relative">
                      <label className="form-label text-muted mb-2">Qidiruv (Marka yoki Model)</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          value={searchQuery} 
                          onChange={e => {
                            setSearchQuery(e.target.value);
                            if (e.target.value.length > 2) {
                              searchCars(e.target.value);
                            } else {
                              setSearchResults([]);
                              setSearchAttempted(false);
                            }
                            if (selectedCar && selectedCar.id !== carId) setSelectedCar(null);
                          }}
                          placeholder="Masalan: Kia K5, Hyundai Sonata..." 
                          className="form-input pl-4 py-3 shadow-sm calc-search-input"
                        />
                      </div>

                      {/* Dropdown Results */}
                      {searchQuery.length > 2 && !selectedCar && searchAttempted && (
                        <div className="search-dropdown absolute z-50 w-full mt-2 rounded-xl shadow-2xl max-h-80 overflow-y-auto">
                          {isSearching ? (
                            <div className="p-4 text-center text-muted font-medium">Qidirilmoqda...</div>
                          ) : searchResults.length > 0 ? (
                            searchResults.map((car: any) => (
                              <button
                                key={car.id}
                                type="button"
                                className="w-full text-left p-4 hover:bg-[var(--bg-main)] border-b border-[var(--border)] flex gap-4 items-center transition-colors"
                                onClick={() => {
                                  setSelectedCar(car);
                                  setCarId(car.id);
                                  setSearchQuery(`${car.year} ${car.brand} ${car.model}`);
                                  setSearchResults([]);
                                  setSearchAttempted(false);
                                }}
                              >
                                <div className="w-16 h-12 rounded overflow-hidden bg-black shrink-0">
                                  <img 
                                    src={car.media?.[0]?.url || 'https://via.placeholder.com/100'} 
                                    alt="Car" 
                                    className="w-full h-full object-cover" 
                                  />
                                </div>
                                <div>
                                  <div className="font-bold text-[var(--text-main)]">{car.year} {car.brand} {car.model}</div>
                                  <div className="text-sm text-muted font-medium">{car.engineCc} cc • {formatCurrency(car.priceUsd, 'USD')}</div>
                                </div>
                              </button>
                            ))
                          ) : (
                            <div className="p-6 text-center">
                              <div className="text-muted mb-2"><Car size={32} className="mx-auto opacity-50" /></div>
                              <p className="font-bold text-[var(--text-main)]">Mashina topilmadi</p>
                              <p className="text-sm text-muted mt-1">
                                Bunday avtomobil katalogimizda yo'q. "Koreya saytlaridan URL" bo'limidan foydalanib ko'ring.
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="form-group relative">
                      <label className="form-label text-muted mb-2">Encar, KBCha havolasi</label>
                      <div className="url-input-group">
                        <div className="relative flex-1">
                          <LinkIcon size={20} className="absolute left-4 top-4 text-muted" />
                          <input 
                            type="url" 
                            value={url} 
                            onChange={e => setUrl(e.target.value)}
                            placeholder="https://www.encar.com/..." 
                            className="form-input pl-12 shadow-sm h-full"
                          />
                        </div>
                        <button 
                          type="button" 
                          className="btn btn-primary rounded-lg font-bold shadow-md shrink-0 transition-transform active:scale-95"
                          onClick={handleParseUrl}
                          disabled={parsing || !url}
                        >
                          {parsing ? <span className="loader-sm"></span> : 'Ma\'lumot olish'}
                        </button>
                      </div>

                      {/* PREMIUM PARSED PREVIEW */}
                      {parsedCar && (
                        <div className="mt-8 parsed-car-card">
                          {parsedCar.imageUrl && (
                            <div className="parsed-car-image-container">
                              <img src={parsedCar.imageUrl} alt="Car" />
                            </div>
                          )}
                          <div className="parsed-car-content">
                            <div className="flex items-center gap-1 text-success text-xs font-bold mb-2 uppercase tracking-widest">
                              <CheckCircle2 size={14} /> Muvaffaqiyatli topildi
                            </div>
                            <h4 className="font-extrabold text-2xl mb-4 leading-tight">
                              {parsedCar.year} {parsedCar.brand} {parsedCar.model}
                            </h4>
                            <div className="flex flex-wrap gap-2 mb-4">
                              <span className="badge">
                                <Gauge size={14}/> {parsedCar.engineCc} cc
                              </span>
                              <span className="badge">
                                <Fuel size={14}/> {parsedCar.fuelType}
                              </span>
                              <span className="badge">
                                <Calendar size={14}/> {parsedCar.condition}
                              </span>
                            </div>
                            <div className="text-xl font-extrabold text-accent mt-2">
                              {formatCurrency(parsedCar.carPriceUsd, 'USD')} <span className="text-sm text-muted font-normal">taxminiy narx</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="h-px bg-border my-2 w-full"></div>

                {/* STEP 2: LOCATIONS */}
                <div className={`transition-all duration-500 ${(activeTab === 'katalog' && !carId) || (activeTab === 'url' && !parsedCar) ? 'opacity-40 pointer-events-none grayscale blur-[1px]' : 'opacity-100 blur-none'}`}>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="step-indicator">2</div>
                    <h3 className="font-bold text-xl text-primary">Manzilni tanlang</h3>
                  </div>

                  <div className="pl-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group mb-0">
                      <label className="form-label text-muted">Davlat</label>
                      <select 
                        value={countryCode} 
                        onChange={e => setCountryCode(e.target.value)}
                        className="form-select py-3 shadow-sm font-medium"
                        required
                      >
                        <option value="">Davlatni tanlang</option>
                        {countries.map(c => (
                          <option key={c.id} value={c.code}>{c.nameUz || c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group mb-0">
                      <label className="form-label text-muted">Shahar yoki Bojxona</label>
                      <select 
                        value={cityId} 
                        onChange={e => setCityId(e.target.value)}
                        className="form-select py-3 shadow-sm font-medium"
                        disabled={!countryCode || cities.length === 0}
                        required
                      >
                        <option value="">Shaharni tanlang</option>
                        {cities.map(c => (
                          <option key={c.id} value={c.id}>{c.nameUz || c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-lg flex items-start gap-3 mt-4">
                    <AlertCircle size={20} className="shrink-0 mt-0.5" />
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                )}

                <button 
                  type="submit" 
                  className="btn btn-primary btn-lg w-full mt-4 py-4 text-lg font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all"
                  disabled={loading || (activeTab === 'katalog' && (!carId || !countryCode || !cityId)) || (activeTab === 'url' && (!parsedCar || !countryCode || !cityId))}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="loader-sm"></span> Hisoblanmoqda...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Toliq Xarajatni Hisoblash <ArrowRight size={20} />
                    </span>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Result Section */}
          {result && (
            <div className="calc-result-section animate-fade-in">
              <div className="premium-card result-card">
                <div className="result-header text-center text-white">
                  <div className="relative z-10">
                    <p className="text-blue-200 text-sm mb-2 uppercase tracking-widest font-bold">Jami Xarajat (CIP)</p>
                    <div className="text-5xl font-extrabold font-outfit text-white drop-shadow-md">
                      {formatCurrency(result.total, 'USD')}
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="font-extrabold text-xl text-primary mb-6 border-b border-border pb-4 flex items-center gap-2">
                    <ShieldCheck size={24} className="text-success" /> To'lovlar Taqvimi
                  </h3>
                  
                  <div className="flex flex-col gap-4 mb-8">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-muted font-medium flex items-center gap-2">
                        <Car size={18} /> Avtomobil narxi (FOB)
                      </span>
                      <span className="font-bold text-lg text-primary">{formatCurrency(result.carPrice, 'USD')}</span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-t border-dashed border-border">
                      <span className="text-muted font-medium flex items-center gap-2">
                        <MapPin size={18} /> Logistika va Yetkazib berish
                      </span>
                      <span className="font-bold text-lg text-primary">{formatCurrency(result.shipping, 'USD')}</span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-t border-dashed border-border">
                      <span className="text-muted font-medium">Davlat Bojxona To'lovlari <br/><span className="text-xs text-gray-400">(Boj, QQS, Aksiz, Util)</span></span>
                      <span className="font-bold text-lg text-primary">
                        {formatCurrency(result.customsDuty + result.vat + result.excise + result.utilizationFee + result.registrationFee, 'USD')}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-t border-dashed border-border">
                      <span className="text-muted font-medium">KCI xizmati & Sug'urta</span>
                      <span className="font-bold text-lg text-primary">
                        {formatCurrency(result.insurance + result.additionalFees, 'USD')}
                      </span>
                    </div>
                  </div>

                  <div className="bg-blue-50/50 p-5 rounded-xl flex items-start gap-4 border border-blue-100">
                    <Info size={24} className="text-primary shrink-0" />
                    <p className="text-sm text-primary/80 font-medium leading-relaxed">
                      Eslatma: Ushbu hisoblash tizimi eng so'nggi bojxona stavkalari asosida ishlaydi. Yakuniy aniq narx valyuta kursiga qarab bir oz farq qilishi mumkin.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CalculatorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="loader-sm border-primary"></div></div>}>
      <CalculatorContent />
    </Suspense>
  );
}
