import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlusCircle, Search, Edit2, Trash2, Eye, Car } from 'lucide-react';
import { formatCurrency } from '@kci/utils';
import { getAgentCars } from '@/lib/api/cars';
import { ICar } from '@kci/types';
import '../agent.css';

export default function AgentCarsList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [myCars, setMyCars] = useState<ICar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const data = await getAgentCars();
      setMyCars(data);
    } catch (err: any) {
      setError(err.message || "Mashinalarni yuklashda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const filteredCars = myCars.filter(car => {
    if (statusFilter === 'active' && !car.isActive) return false;
    if (statusFilter === 'pending' && car.isActive) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!car.brand.toLowerCase().includes(q) && !car.model.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--text-main)] mb-2">Mening Mashinalarim</h1>
          <p className="text-[var(--text-muted)]">O'zingiz yuklagan barcha avtomobillarni boshqaring.</p>
        </div>
        
        <Link href="/agent/cars/new" className="btn btn-primary flex items-center gap-2 shadow-lg">
          <PlusCircle size={20} /> Yangi Qo'shish
        </Link>
      </div>

      <div className="premium-card p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-4 top-3 text-[var(--text-muted)]" size={20} />
            <input 
              type="text" 
              placeholder="Mashina qidirish..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="form-input pl-12 bg-[var(--bg-main)]"
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <select className="form-select bg-[var(--bg-main)] flex-1 sm:w-auto" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="all">Barcha holatlar</option>
              <option value="active">Faol</option>
              <option value="pending">Kutilmoqda</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="py-10 text-center text-muted flex flex-col items-center">
            <span className="loader-sm mb-4"></span>
            <p>Mashinalar yuklanmoqda...</p>
          </div>
        ) : error ? (
          <div className="py-10 text-center text-red-500 font-medium">
            {error}
          </div>
        ) : filteredCars.length === 0 ? (
          <div className="py-16 text-center text-muted">
            <Car size={48} className="mx-auto mb-4 opacity-20" />
            <p className="font-bold text-lg mb-2">Mashinalar topilmadi</p>
            <p className="text-sm">Sizda hozircha hech qanday avtomobil yo'q yoki qidiruvga mos kelmadi.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border)] text-[var(--text-muted)] text-sm uppercase tracking-wider">
                  <th className="pb-4 font-bold pl-4">Avtomobil</th>
                  <th className="pb-4 font-bold">Narxi</th>
                  <th className="pb-4 font-bold">Holati</th>
                  <th className="pb-4 font-bold">Ko'rishlar</th>
                  <th className="pb-4 font-bold text-right pr-4">Amallar</th>
                </tr>
              </thead>
              <tbody>
                {filteredCars.map((car) => (
                  <tr key={car.id} className="border-b border-[var(--border)] hover:bg-[var(--bg-main)] transition-colors">
                    <td className="py-4 pl-4">
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-14 rounded-lg overflow-hidden bg-black shrink-0 relative">
                          {car.media && car.media[0] ? (
                            <img src={car.media[0].url} alt={car.model} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500"><Car size={20}/></div>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-[var(--text-main)]">{car.year} {car.brand} {car.model}</div>
                          <div className="text-sm text-[var(--text-muted)]">{car.engineCc} cc • {car.fuelType}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 font-extrabold text-[var(--primary)]">
                      {formatCurrency(Number(car.priceUsd), 'USD')}
                    </td>
                    <td className="py-4">
                      {car.isActive ? (
                        <span className="px-3 py-1 bg-success/10 text-success text-xs font-bold rounded-full border border-success/20">FAOL</span>
                      ) : (
                        <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-xs font-bold rounded-full border border-amber-500/20">TEKSHIRUVDA</span>
                      )}
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-1 text-[var(--text-muted)] font-medium">
                        <Eye size={16} /> {car.viewCount || 0}
                      </div>
                    </td>
                    <td className="py-4 pr-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="w-8 h-8 rounded-full bg-[var(--bg-main)] text-[var(--text-muted)] flex items-center justify-center hover:text-blue-500 hover:bg-blue-50 transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-[var(--bg-main)] text-[var(--text-muted)] flex items-center justify-center hover:text-red-500 hover:bg-red-50 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
