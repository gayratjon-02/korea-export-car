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
    try {
      const { getCars } = await import('@/lib/api/cars');
      const res = await getCars({ q: query, limit: 5 });
      setSearchResults(res.items);
    } catch (err) {
      console.error(err);
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
      <div className="calc-header text-white text-center py-16">
        <div className="container relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-md mb-6 border border-white/20">
            <Calculator size={32} className="text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold font-outfit mb-4">Smart Bojxona Kalkulyatori</h1>
          <p className="max-w-2xl mx-auto text-blue-100 text-lg">
            Katalogimizdagi avtomobillarni tanlang yoki to'g'ridan-to'g'ri Koreya saytlaridagi havolani kiritib, barcha xarajatlarni aniq hisoblang.
          </p>
        </div>
      </div>

      <div className="container py-12">
        <div className="calc-grid">
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

            <div className="p-6 md:p-8 pt-0">
              <form onSubmit={handleCalculate} className="flex flex-col gap-8">
                
                {/* STEP 1: CAR SELECTION */}
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="step-indicator">1</div>
                    <h3 className="font-bold text-xl text-primary">Avtomobilni ko'rsating</h3>
                  </div>

                  {activeTab === 'katalog' ? (
                    <div className="form-group relative pl-10">
                      <label className="form-label text-muted mb-2">Qidiruv (Marka yoki Model)</label>
                      <div className="relative">
                        <Search size={20} className="absolute left-4 top-3.5 text-muted" />
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
                          className="form-input pl-12 py-3 text-lg font-medium shadow-sm"
                        />
                      </div>

                      {/* Dropdown Results */}
                      {searchResults.length > 0 && !selectedCar && (
                        <div className="absolute z-20 w-[calc(100%-2.5rem)] ml-10 mt-2 bg-white border border-gray-100 rounded-xl shadow-2xl max-h-80 overflow-y-auto">
                          {searchResults.map((car: any) => (
                            <button
                              key={car.id}
                              type="button"
                              className="w-full text-left p-4 hover:bg-gray-50 border-b border-gray-50 flex gap-4 items-center transition-colors"
                              onClick={() => {
                                setSelectedCar(car);
                                setCarId(car.id);
                                setSearchQuery(`${car.year} ${car.brand} ${car.model}`);
                                setSearchResults([]);
                              }}
                            >
                              <div className="w-16 h-12 rounded overflow-hidden bg-gray-100 shrink-0">
                                <img 
                                  src={car.media?.[0]?.url || 'https://via.placeholder.com/100'} 
                                  alt="Car" 
                                  className="w-full h-full object-cover" 
                                />
                              </div>
                              <div>
                                <div className="font-bold text-gray-800">{car.year} {car.brand} {car.model}</div>
                                <div className="text-sm text-gray-500 font-medium">{car.engineCc} cc • {formatCurrency(car.priceUsd, 'USD')}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="form-group pl-10">
                      <label className="form-label text-muted mb-2">Encar, KBCha havolasi</label>
                      <div className="flex gap-3">
                        <div className="relative flex-1">
                          <LinkIcon size={20} className="absolute left-4 top-3.5 text-muted" />
                          <input 
                            type="url" 
                            value={url} 
                            onChange={e => setUrl(e.target.value)}
                            placeholder="https://www.encar.com/..." 
                            className="form-input pl-12 py-3 shadow-sm"
                          />
                        </div>
                        <button 
                          type="button" 
                          className="btn btn-primary px-6 rounded-lg font-bold shadow-md shrink-0"
                          onClick={handleParseUrl}
                          disabled={parsing || !url}
                        >
                          {parsing ? <span className="loader-sm"></span> : 'Ma\'lumot olish'}
                        </button>
                      </div>

                      {/* PREMIUM PARSED PREVIEW */}
                      {parsedCar && (
                        <div className="mt-6 parsed-car-card">
                          {parsedCar.imageUrl && (
                            <div className="w-1/3 min-h-[120px] bg-gray-100">
                              <img src={parsedCar.imageUrl} alt="Car" className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div className="p-5 flex-1 flex flex-col justify-center">
                            <div className="flex items-center gap-1 text-success text-xs font-bold mb-2 uppercase tracking-wide">
                              <CheckCircle2 size={14} /> Muvaffaqiyatli topildi
                            </div>
                            <h4 className="font-extrabold text-xl text-primary mb-2 leading-tight">
                              {parsedCar.year} {parsedCar.brand} {parsedCar.model}
                            </h4>
                            <div className="flex flex-wrap gap-3 mb-3">
                              <span className="flex items-center gap-1 text-xs font-semibold text-muted bg-gray-100 px-2 py-1 rounded">
                                <Gauge size={12}/> {parsedCar.engineCc} cc
                              </span>
                              <span className="flex items-center gap-1 text-xs font-semibold text-muted bg-gray-100 px-2 py-1 rounded">
                                <Fuel size={12}/> {parsedCar.fuelType}
                              </span>
                              <span className="flex items-center gap-1 text-xs font-semibold text-muted bg-gray-100 px-2 py-1 rounded">
                                <Calendar size={12}/> {parsedCar.condition}
                              </span>
                            </div>
                            <div className="text-lg font-extrabold text-accent">
                              {formatCurrency(parsedCar.carPriceUsd, 'USD')} <span className="text-xs text-muted font-normal">taxminiy narx</span>
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
          <div className="calc-result-section">
            {!result ? (
              <div className="empty-result">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <Calculator size={40} className="text-gray-300" />
                </div>
                <h3 className="text-2xl font-bold text-gray-400 mb-3 font-outfit">Natija kutilmoqda</h3>
                <p className="text-gray-400 text-center max-w-xs leading-relaxed">
                  Chap tomondagi ma'lumotlarni kiritib hisoblash tugmasini bosing. Barcha bojxona va yo'l xarajatlari shu yerda ko'rsatiladi.
                </p>
              </div>
            ) : (
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
            )}
          </div>
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
