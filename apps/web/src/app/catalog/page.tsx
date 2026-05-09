'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal, ArrowRight, X, Loader2, Calendar, MapPin, Gauge } from 'lucide-react';
import Link from 'next/link';
import { getCars } from '@/lib/api/cars';
import { ICar } from '@kci/types';
import { formatCurrency } from '@kci/utils';
import './catalog.css';

export default function CatalogPage() {
  const [cars, setCars] = useState<ICar[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [q, setQ] = useState('');
  const [brand, setBrand] = useState('');
  const [priceFrom, setPriceFrom] = useState('');
  const [priceTo, setPriceTo] = useState('');
  const [yearFrom, setYearFrom] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    fetchCars();
  }, [brand, sortBy, sortOrder]);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const params: any = {
        limit: 20,
        sortBy,
        sortOrder,
      };
      if (q) params.q = q;
      if (brand) params.brand = brand;
      if (priceFrom) params.priceFrom = priceFrom;
      if (priceTo) params.priceTo = priceTo;
      if (yearFrom) params.yearFrom = yearFrom;
      
      const res = await getCars(params);
      setCars(res.items);
      setTotal(res.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCars();
    setMobileFilterOpen(false);
  };

  const clearFilters = () => {
    setQ('');
    setBrand('');
    setPriceFrom('');
    setPriceTo('');
    setYearFrom('');
    setSortBy('createdAt');
    setSortOrder('desc');
    // fetchCars will be triggered by brand/sort effect, but to be safe:
    setTimeout(fetchCars, 0);
  };

  return (
    <div className="bg-[var(--bg-main)] min-h-screen pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0B0F19] to-[#1A233A] text-white pt-24 pb-12">
        <div className="container relative z-10 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-3 font-outfit">Avtomobillar Katalogi</h1>
            <p className="text-blue-200 text-lg">Koreyadan to'g'ridan-to'g'ri MDH davlatlariga eksport</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 text-center">
            <div className="text-3xl font-extrabold text-white">{total}+</div>
            <div className="text-xs text-blue-200 uppercase tracking-widest font-bold">Avtomobillar</div>
          </div>
        </div>
      </div>

      <div className="container mt-8 flex flex-col lg:flex-row gap-8">
        
        {/* Mobile Filter Toggle */}
        <button 
          className="lg:hidden w-full premium-card p-4 flex items-center justify-center gap-2 font-bold text-[var(--text-main)]"
          onClick={() => setMobileFilterOpen(true)}
        >
          <SlidersHorizontal size={20} /> Filtrlarni ochish
        </button>

        {/* Sidebar Filters */}
        <aside className={`fixed inset-0 z-50 lg:static lg:block lg:w-80 shrink-0 ${mobileFilterOpen ? 'block' : 'hidden'}`}>
          <div className="absolute inset-0 bg-black/60 lg:hidden" onClick={() => setMobileFilterOpen(false)}></div>
          
          <div className="premium-card p-6 relative z-10 h-full lg:h-auto overflow-y-auto w-[85%] lg:w-full ml-auto lg:ml-0 bg-[var(--bg-card)]">
            <div className="flex items-center justify-between mb-6 border-b border-[var(--border)] pb-4">
              <h3 className="font-bold text-xl text-[var(--text-main)] flex items-center gap-2">
                <Filter size={20} className="text-primary" /> Filtrlar
              </h3>
              <button className="lg:hidden text-[var(--text-muted)]" onClick={() => setMobileFilterOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleApplyFilters} className="space-y-6">
              <div className="form-group mb-0">
                <label className="form-label font-bold text-sm">Qidiruv</label>
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-3.5 text-[var(--text-muted)]" />
                  <input 
                    type="text" 
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Model yoki marka..." 
                    className="form-input pl-10 bg-[var(--bg-main)] focus:bg-[var(--bg-card)]" 
                  />
                </div>
              </div>

              <div className="form-group mb-0">
                <label className="form-label font-bold text-sm">Brend</label>
                <select 
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="form-select bg-[var(--bg-main)]"
                >
                  <option value="">Barchasi</option>
                  <option value="Hyundai">Hyundai</option>
                  <option value="Kia">Kia</option>
                  <option value="Genesis">Genesis</option>
                  <option value="Samsung">Samsung (Renault)</option>
                  <option value="Chevrolet">Chevrolet</option>
                  <option value="BMW">BMW</option>
                  <option value="Mercedes-Benz">Mercedes-Benz</option>
                </select>
              </div>

              <div className="form-group mb-0">
                <label className="form-label font-bold text-sm">Narx (USD)</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="number" 
                    value={priceFrom}
                    onChange={(e) => setPriceFrom(e.target.value)}
                    placeholder="Dan" 
                    className="form-input w-full bg-[var(--bg-main)]" 
                  />
                  <span className="text-[var(--text-muted)]">-</span>
                  <input 
                    type="number" 
                    value={priceTo}
                    onChange={(e) => setPriceTo(e.target.value)}
                    placeholder="Gacha" 
                    className="form-input w-full bg-[var(--bg-main)]" 
                  />
                </div>
              </div>

              <div className="form-group mb-0">
                <label className="form-label font-bold text-sm">Ishlab chiqarilgan yili</label>
                <select 
                  value={yearFrom}
                  onChange={(e) => setYearFrom(e.target.value)}
                  className="form-select bg-[var(--bg-main)]"
                >
                  <option value="">Barchasi</option>
                  <option value="2024">2024 va undan yangi</option>
                  <option value="2022">2022 va undan yangi</option>
                  <option value="2020">2020 va undan yangi</option>
                  <option value="2018">2018 va undan yangi</option>
                </select>
              </div>

              <div className="pt-4 border-t border-[var(--border)] flex flex-col gap-3">
                <button type="submit" className="btn btn-primary w-full py-3 shadow-lg shadow-primary/30">
                  Filtrni qo'llash
                </button>
                <button type="button" onClick={clearFilters} className="text-sm font-bold text-[var(--text-muted)] hover:text-[var(--text-main)] w-full py-2">
                  Tozalash
                </button>
              </div>
            </form>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 premium-card p-4">
            <div className="text-sm font-medium text-[var(--text-muted)]">
              <strong className="text-[var(--text-main)] text-lg mr-1">{total}</strong> natija
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-sm text-[var(--text-muted)] font-medium hidden sm:block">Saralash:</span>
              <select 
                className="form-select text-sm py-2 bg-[var(--bg-main)] min-w-[200px]"
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [s, o] = e.target.value.split('-');
                  setSortBy(s);
                  setSortOrder(o);
                }}
              >
                <option value="createdAt-desc">Eng yangilari</option>
                <option value="priceUsd-asc">Arzonlari oldin</option>
                <option value="priceUsd-desc">Qimmatlari oldin</option>
                <option value="year-desc">Yili yangilari</option>
                <option value="viewCount-desc">Ko'p ko'rilganlar</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="py-32 flex justify-center"><Loader2 className="animate-spin text-primary" size={48} /></div>
          ) : cars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {cars.map(car => (
                <Link href={`/catalog/${car.id}`} key={car.id} className="premium-card group hover:border-primary/50 transition-all cursor-pointer flex flex-col overflow-hidden">
                  <div className="relative aspect-[4/3] bg-black">
                    <img 
                      src={car.media?.[0]?.url || 'https://images.unsplash.com/photo-1550314405-188e6be019aa?auto=format&fit=crop&q=80&w=400'} 
                      alt={car.model} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-white text-xs font-bold uppercase tracking-wider">
                      {car.condition === 'new' ? 'Yangi' : 'Minilgan'}
                    </div>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="text-xs font-extrabold text-primary mb-1 uppercase tracking-wider">{car.brand}</div>
                    <h3 className="font-bold text-xl text-[var(--text-main)] mb-4 group-hover:text-primary transition-colors line-clamp-1">{car.year} {car.model}</h3>
                    
                    <div className="grid grid-cols-2 gap-y-3 mb-5 mt-auto">
                      <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] font-medium">
                        <Gauge size={14} className="text-primary/70" /> {car.engineCc} cc
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] font-medium">
                        <MapPin size={14} className="text-primary/70" /> {car.mileage?.toLocaleString() || 0} km
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] font-medium">
                        <Calendar size={14} className="text-primary/70" /> {car.fuelType}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-bold">Koreyadagi narxi</div>
                        <div className="font-extrabold text-2xl text-[var(--text-main)]">{formatCurrency(car.priceUsd, 'USD')}</div>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        <ArrowRight size={18} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="premium-card py-20 text-center flex flex-col items-center">
              <div className="w-24 h-24 bg-[var(--bg-main)] rounded-full flex items-center justify-center mb-6">
                <Search size={48} className="text-[var(--text-muted)] opacity-50" />
              </div>
              <h3 className="text-2xl font-bold text-[var(--text-main)] mb-2">Mashina topilmadi</h3>
              <p className="text-[var(--text-muted)] max-w-md mx-auto">Siz izlayotgan mezonlarga mos keladigan avtomobil hozircha bazamizda yo'q. Qidiruv parametrlarini o'zgartirib ko'ring.</p>
              <button onClick={clearFilters} className="mt-8 btn btn-primary">Barcha mashinalarni ko'rish</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
