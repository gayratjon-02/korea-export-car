'use client';

import { Car, Eye, MessageSquare, TrendingUp } from 'lucide-react';

export default function AgentDashboard() {
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[var(--text-main)] mb-2">Dashboard</h1>
        <p className="text-[var(--text-muted)]">KCI platformasidagi statistikangiz va so'nggi ma'lumotlar.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {/* Stat Cards */}
        <div className="stat-card">
          <div className="stat-icon bg-blue-500 shadow-lg shadow-blue-500/30">
            <Car size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-muted uppercase tracking-wider mb-1">Mening Mashinalarim</p>
            <h3 className="text-3xl font-extrabold text-[var(--text-main)]">12</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-emerald-500 shadow-lg shadow-emerald-500/30">
            <Eye size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-muted uppercase tracking-wider mb-1">Jami Ko'rishlar</p>
            <h3 className="text-3xl font-extrabold text-[var(--text-main)]">1,482</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-amber-500 shadow-lg shadow-amber-500/30">
            <MessageSquare size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-muted uppercase tracking-wider mb-1">Yangi Xabarlar</p>
            <h3 className="text-3xl font-extrabold text-[var(--text-main)]">5</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-purple-500 shadow-lg shadow-purple-500/30">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-muted uppercase tracking-wider mb-1">Konversiya</p>
            <h3 className="text-3xl font-extrabold text-[var(--text-main)]">4.2%</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="premium-card p-6">
            <h2 className="text-xl font-bold text-[var(--text-main)] mb-6">So'nggi qo'shilgan mashinalar</h2>
            <div className="text-center py-10 text-[var(--text-muted)]">
              <Car size={48} className="mx-auto mb-4 opacity-20" />
              <p>Hozircha mashinalar yuklanmagan yoki yuklanyapti.</p>
            </div>
          </div>
        </div>
        <div>
          <div className="premium-card p-6">
            <h2 className="text-xl font-bold text-[var(--text-main)] mb-6">So'nggi Xabarlar</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 p-4 rounded-xl bg-[var(--bg-main)] border border-[var(--border)]">
                  <div className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center text-white font-bold shrink-0">
                    M
                  </div>
                  <div>
                    <h4 className="font-bold text-[var(--text-main)] text-sm mb-1">Mijoz {i}</h4>
                    <p className="text-xs text-[var(--text-muted)] line-clamp-2">Assalomu alaykum, Kia K5 haqida to'liqroq ma'lumot bersangiz, bojxona bilan qanchaga tushadi?</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
