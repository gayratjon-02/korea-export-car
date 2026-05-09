'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Calculator, ArrowRight, Info, Car, MapPin, AlertCircle, DollarSign } from 'lucide-react';
import { getCountries, getCities, calculateCost } from '@/lib/api/calculator';
import { formatCurrency } from '@kci/utils';
import { ICountry, ICity, ICalculationResult } from '@kci/types';
import './calculator.css';

function CalculatorContent() {
  const searchParams = useSearchParams();
  const initialCarId = searchParams?.get('carId') || '';

  const [countries, setCountries] = useState<ICountry[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  
  const [carId, setCarId] = useState(initialCarId);
  const [countryCode, setCountryCode] = useState('');
  const [cityId, setCityId] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<ICalculationResult | null>(null);

  useEffect(() => {
    getCountries().then(setCountries).catch(console.error);
  }, []);

  useEffect(() => {
    if (countryCode) {
      getCities(countryCode).then(setCities).catch(console.error);
      setCityId(''); // reset city when country changes
    } else {
      setCities([]);
    }
  }, [countryCode]);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!carId || !countryCode || !cityId) {
      setError('Iltimos barcha maydonlarni to\'ldiring');
      return;
    }
    
    setError('');
    setLoading(true);
    setResult(null);

    try {
      const res = await calculateCost({ carId, countryCode, cityId });
      setResult(res);
    } catch (err) {
      setError('Hisoblashda xatolik yuz berdi. Balki mashina ID noto\'g\'ridir?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="calc-page">
      <div className="calc-header bg-primary text-white text-center py-12">
        <div className="container">
          <Calculator size={48} className="mx-auto mb-4 text-accent" />
          <h1>Bojxona va Yetkazish Kalkulyatori</h1>
          <p className="max-w-2xl mx-auto mt-4 text-gray-200">
            Avtomobilning O'zbekiston, Qozog'iston yoki boshqa MDH davlatlarigacha bo'lgan yakuniy narxini (CIP) hisoblang. Bojxona, logistika va barcha xizmatlar inobatga olingan.
          </p>
        </div>
      </div>

      <div className="container py-12">
        <div className="calc-grid">
          {/* Form Section */}
          <div className="calc-form-section card p-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b pb-4">
              <MapPin className="text-primary" /> Ma'lumotlarni kiriting
            </h2>

            <form onSubmit={handleCalculate} className="calc-form flex flex-col gap-6">
              <div className="form-group">
                <label className="block text-sm font-semibold mb-2">Avtomobil ID si</label>
                <div className="relative">
                  <Car size={18} className="absolute left-3 top-3.5 text-gray-400" />
                  <input 
                    type="text" 
                    value={carId} 
                    onChange={e => setCarId(e.target.value)}
                    placeholder="Masalan: cm3k29..." 
                    className="form-input pl-10 w-full"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  ID raqamni katalogdagi avtomobil sahifasidan olishingiz mumkin.
                </p>
              </div>

              <div className="form-group">
                <label className="block text-sm font-semibold mb-2">Qabul qiluvchi davlat</label>
                <select 
                  value={countryCode} 
                  onChange={e => setCountryCode(e.target.value)}
                  className="form-select w-full"
                  required
                >
                  <option value="">Davlatni tanlang</option>
                  {countries.map(c => (
                    <option key={c.id} value={c.code}>{c.nameUz || c.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="block text-sm font-semibold mb-2">Shahar / Bojxona posti</label>
                <select 
                  value={cityId} 
                  onChange={e => setCityId(e.target.value)}
                  className="form-select w-full"
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
                <div className="bg-red-50 text-red-600 p-4 rounded-md flex items-start gap-3">
                  <AlertCircle size={20} className="shrink-0 mt-0.5" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <button 
                type="submit" 
                className="btn btn-primary btn-lg w-full mt-4"
                disabled={loading}
              >
                {loading ? 'Hisoblanmoqda...' : 'Hisoblash'} <ArrowRight size={20} />
              </button>
            </form>
          </div>

          {/* Result Section */}
          <div className="calc-result-section">
            {!result ? (
              <div className="empty-result card flex flex-col items-center justify-center text-center p-12 h-full bg-gray-50">
                <Calculator size={64} className="text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-400 mb-2">Natija bu yerda ko'rinadi</h3>
                <p className="text-gray-500 text-sm max-w-sm">
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
                      <span className="font-semibold">{formatCurrency(result.carPrice.usd, 'USD')}</span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Yetkazib berish (Logistika)</span>
                      <span className="font-semibold">{formatCurrency(result.shipping.amount, 'USD')}</span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Bojxona (Boj + QQS + Aksiz)</span>
                      <span className="font-semibold">{formatCurrency(result.customs.subtotal, 'USD')}</span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">KCI Agentlik xizmati & Sug'urta</span>
                      <span className="font-semibold">
                        {formatCurrency(result.insurance.amount + (result.additionalCosts.brokerFee || 0), 'USD')}
                      </span>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3 border border-blue-100">
                    <Info size={20} className="text-primary shrink-0 mt-0.5" />
                    <p className="text-xs text-primary leading-relaxed">
                      {result.disclaimer}
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
    <Suspense fallback={<div className="p-12 text-center">Loading calculator...</div>}>
      <CalculatorContent />
    </Suspense>
  );
}
