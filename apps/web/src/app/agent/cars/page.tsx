'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PlusCircle, Search, Edit2, Trash2, Eye, MoreVertical } from 'lucide-react';
import { formatCurrency } from '@kci/utils';
import '../agent.css';

export default function AgentCarsList() {
  const [searchQuery, setSearchQuery] = useState('');

  // Dummy data for visual representation of Agent's cars
  const myCars = [
    {
      id: '1',
      brand: 'Kia',
      model: 'K5',
      year: 2023,
      priceUsd: 15500,
      engineCc: 2000,
      fuelType: 'GASOLINE',
      views: 124,
      status: 'ACTIVE',
      imageUrl: 'https://images.unsplash.com/photo-1632823462998-38ba2c4eb896?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: '2',
      brand: 'Hyundai',
      model: 'Palisade',
      year: 2022,
      priceUsd: 32000,
      engineCc: 3800,
      fuelType: 'GASOLINE',
      views: 89,
      status: 'ACTIVE',
      imageUrl: 'https://images.unsplash.com/photo-1633511090164-b44c66555194?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: '3',
      brand: 'Genesis',
      model: 'G80',
      year: 2024,
      priceUsd: 45000,
      engineCc: 2500,
      fuelType: 'GASOLINE',
      views: 312,
      status: 'PENDING',
      imageUrl: 'https://images.unsplash.com/photo-1616422285623-13898a3b53c3?auto=format&fit=crop&q=80&w=400',
    }
  ];

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
            <select className="form-select bg-[var(--bg-main)] flex-1 sm:w-auto">
              <option value="all">Barcha holatlar</option>
              <option value="active">Faol</option>
              <option value="pending">Kutilmoqda</option>
              <option value="sold">Sotilgan</option>
            </select>
          </div>
        </div>

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
              {myCars.map((car) => (
                <tr key={car.id} className="border-b border-[var(--border)] hover:bg-[var(--bg-main)] transition-colors">
                  <td className="py-4 pl-4">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                        <img src={car.imageUrl} alt={car.model} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-bold text-[var(--text-main)]">{car.year} {car.brand} {car.model}</div>
                        <div className="text-sm text-[var(--text-muted)]">{car.engineCc} cc • {car.fuelType}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 font-extrabold text-[var(--primary)]">
                    {formatCurrency(car.priceUsd, 'USD')}
                  </td>
                  <td className="py-4">
                    {car.status === 'ACTIVE' ? (
                      <span className="px-3 py-1 bg-success/10 text-success text-xs font-bold rounded-full border border-success/20">FAOL</span>
                    ) : (
                      <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-xs font-bold rounded-full border border-amber-500/20">TEKSHIRUVDA</span>
                    )}
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-1 text-[var(--text-muted)] font-medium">
                      <Eye size={16} /> {car.views}
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
      </div>
    </div>
  );
}
