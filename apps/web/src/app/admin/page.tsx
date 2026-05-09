'use client';

import { useState, useEffect } from 'react';
import { Users, UserCheck, Car, Activity, ArrowUpRight } from 'lucide-react';
import { getAdminStats } from '@/lib/api/admin';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getAdminStats();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: "Jami Foydalanuvchilar", value: stats?.totalUsers || 0, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Faol Agentlar", value: stats?.totalAgents || 0, icon: UserCheck, color: "text-green-500", bg: "bg-green-500/10" },
    { title: "Kutayotgan Agentlar", value: stats?.pendingAgents || 0, icon: Activity, color: "text-orange-500", bg: "bg-orange-500/10" },
    { title: "Jami E'lonlar", value: stats?.totalCars || 0, icon: Car, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--text-main)] mb-2">Asosiy Oyna</h1>
          <p className="text-[var(--text-muted)]">Platformaning umumiy holati va statistikasi</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="premium-card p-6 h-32 animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, idx) => (
            <div key={idx} className="premium-card p-6 relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.bg} ${card.color}`}>
                  <card.icon size={24} />
                </div>
              </div>
              <div className="relative z-10">
                <div className="text-3xl font-extrabold text-[var(--text-main)] mb-1">{card.value}</div>
                <div className="text-sm font-medium text-[var(--text-muted)]">{card.title}</div>
              </div>
              <div className={`absolute -right-6 -bottom-6 opacity-5 group-hover:scale-110 transition-transform ${card.color}`}>
                <card.icon size={100} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recent Activity / Updates can go here */}
      <div className="premium-card p-8 text-center border-t-4 border-t-primary">
        <h3 className="text-xl font-bold text-[var(--text-main)] mb-2">Tizim barqaror ishlamoqda</h3>
        <p className="text-[var(--text-muted)] max-w-md mx-auto">
          Barcha API xizmatlari va ma'lumotlar bazasi normal holatda. Navbatdagi vazifa sifatida tasdiqlanmagan agentlarni tekshirib ko'ring.
        </p>
      </div>
    </div>
  );
}
