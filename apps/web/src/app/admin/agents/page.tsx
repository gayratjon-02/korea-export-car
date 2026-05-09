'use client';

import { useState, useEffect } from 'react';
import { UserCheck, CheckCircle2, XCircle, Search, ShieldCheck } from 'lucide-react';
import { getPendingAgents, approveAgent, rejectAgent } from '@/lib/api/admin';

export default function AdminAgentsPage() {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const data = await getPendingAgents();
      setAgents(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    if (!confirm("Haqiqatan ham bu agentni tasdiqlaysizmi?")) return;
    try {
      await approveAgent(id);
      setAgents(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      alert("Xatolik yuz berdi");
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm("Haqiqatan ham bu so'rovni bekor qilasizmi?")) return;
    try {
      await rejectAgent(id);
      setAgents(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      alert("Xatolik yuz berdi");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--text-main)] mb-2">Agentlarni Tasdiqlash</h1>
          <p className="text-[var(--text-muted)]">Platformaga qo'shilish uchun ariza tashlagan dilerlar ro'yxati</p>
        </div>
      </div>

      <div className="premium-card overflow-hidden">
        <div className="p-4 border-b border-[var(--border)] bg-[var(--bg-main)]">
          <div className="relative max-w-sm">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input 
              type="text" 
              placeholder="Kompaniya yoki ism bo'yicha qidiruv..." 
              className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-[var(--text-muted)]">Yuklanmoqda...</div>
        ) : agents.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
              <ShieldCheck size={40} className="text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-[var(--text-main)] mb-2">Barchasi toza</h3>
            <p className="text-[var(--text-muted)]">Hozirda tasdiqlanishi kutilayotgan agentlar yo'q.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--bg-main)] text-[var(--text-muted)] uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 font-bold">Kompaniya</th>
                  <th className="px-6 py-4 font-bold">Foydalanuvchi</th>
                  <th className="px-6 py-4 font-bold">Manzil</th>
                  <th className="px-6 py-4 font-bold">Litsenziya</th>
                  <th className="px-6 py-4 font-bold text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {agents.map((agent) => (
                  <tr key={agent.id} className="hover:bg-[var(--bg-main)] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-[var(--text-main)]">{agent.companyName}</div>
                      <div className="text-xs text-[var(--text-muted)] mt-1 truncate max-w-[200px]">{agent.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-[var(--text-main)]">{agent.user?.name}</div>
                      <div className="text-xs text-[var(--text-muted)]">{agent.user?.email}</div>
                      <div className="text-xs text-[var(--text-muted)]">{agent.user?.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-[var(--text-muted)]">{agent.address || '-'}</td>
                    <td className="px-6 py-4 text-[var(--text-muted)]">{agent.license || '-'}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleApprove(agent.id)}
                          className="p-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500 hover:text-white transition-colors"
                          title="Tasdiqlash"
                        >
                          <CheckCircle2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleReject(agent.id)}
                          className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                          title="Bekor qilish"
                        >
                          <XCircle size={18} />
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
