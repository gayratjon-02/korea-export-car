'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Car, Eye, MessageSquare, TrendingUp, ArrowRight, Activity, PlusCircle } from 'lucide-react';
import { getAgentCars } from '@/lib/api/cars';
import { ICar } from '@kci/types';
import './agent.css';

export default function AgentDashboard() {
  const [cars, setCars] = useState<ICar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await getAgentCars();
      setCars(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalViews = cars.reduce((sum, car) => sum + (car.viewCount || 0), 0);
  const activeCars = cars.filter(c => c.isActive).length;
  const recentCars = cars.slice(0, 3); // Get latest 3

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-[var(--text-main)] mb-2">Asosiy Panel</h1>
        <p className="text-[var(--text-muted)]">Bugungi ko'rsatkichlar va so'nggi faollik.</p>
      </div>

      {loading ? (
        <div className="py-20 text-center flex flex-col items-center">
          <span className="loader-sm mb-4"></span>
          <p className="text-muted">Ma'lumotlar yuklanmoqda...</p>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="premium-card p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[var(--text-muted)] font-medium">Faol E'lonlar</h3>
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <Car size={20} />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-[var(--text-main)]">{activeCars}</div>
              <p className="text-xs text-green-500 mt-2 font-medium flex items-center gap-1">
                Jami: {cars.length} ta
              </p>
            </div>

            <div className="premium-card p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[var(--text-muted)] font-medium">Ko'rishlar</h3>
                <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                  <Eye size={20} />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-[var(--text-main)]">{totalViews}</div>
              <p className="text-xs text-[var(--text-muted)] mt-2 font-medium">Barcha mashinalardagi umumiy</p>
            </div>

            <div className="premium-card p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[var(--text-muted)] font-medium">Xabarlar</h3>
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                  <MessageSquare size={20} />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-[var(--text-main)]">0</div>
              <p className="text-xs text-[var(--text-muted)] mt-2 font-medium">O'qilmagan xabarlar yo'q</p>
            </div>

            <div className="premium-card p-6 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/10 rounded-full blur-xl"></div>
              <div className="flex items-center justify-between mb-4 relative z-10">
                <h3 className="text-[var(--text-muted)] font-medium">Yangi Qo'shish</h3>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <PlusCircle size={20} />
                </div>
              </div>
              <Link href="/agent/cars/new" className="text-sm font-bold text-primary mt-auto flex items-center gap-1 hover:underline relative z-10">
                Mashina qo'shish <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="premium-card p-6">
                <div className="flex items-center justify-between mb-6 border-b border-[var(--border)] pb-4">
                  <h3 className="text-lg font-bold text-[var(--text-main)] flex items-center gap-2">
                    <Activity size={18} className="text-primary" /> So'nggi Qo'shilganlar
                  </h3>
                  <Link href="/agent/cars" className="text-sm font-medium text-primary hover:underline">
                    Barchasi
                  </Link>
                </div>

                <div className="space-y-4">
                  {recentCars.length === 0 ? (
                    <div className="text-center py-6 text-muted text-sm">Hozircha mashina yo'q</div>
                  ) : recentCars.map(car => (
                    <div key={car.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-[var(--bg-main)] transition-colors border border-transparent hover:border-[var(--border)]">
                      <div className="w-16 h-12 rounded bg-black shrink-0 overflow-hidden relative">
                        {car.media && car.media[0] ? (
                          <img src={car.media[0].url} alt={car.model} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500"><Car size={16}/></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-[var(--text-main)] truncate">{car.brand} {car.model}</h4>
                        <p className="text-xs text-[var(--text-muted)]">{car.year} y • {car.engineCc} cc</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-primary">${Number(car.priceUsd).toLocaleString()}</div>
                        <div className="text-[10px] text-[var(--text-muted)] flex items-center justify-end gap-1"><Eye size={10} /> {car.viewCount || 0}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="premium-card p-6 bg-gradient-to-br from-primary/5 to-transparent">
                <h3 className="text-lg font-bold text-[var(--text-main)] mb-2">Platforma Yangiliklari</h3>
                <p className="text-sm text-[var(--text-muted)] mb-4 leading-relaxed">
                  Hurmatli diler! Bizning portal endi sizning qulayligingiz uchun yanada ko'proq imkoniyatlarni taqdim etadi. Tez orada Mijozlar bilan jonli chat funksiyasi ishga tushadi.
                </p>
                <button className="text-sm font-bold text-primary hover:underline">Batafsil o'qish &rarr;</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
