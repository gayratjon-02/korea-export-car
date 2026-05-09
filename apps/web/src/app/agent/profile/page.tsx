'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Building, ShieldCheck, Camera, Save } from 'lucide-react';
import { getMe } from '@/lib/api/users';
import '../agent.css';

export default function AgentProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  
  // Local state for edits
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getMe();
      setProfile(data);
      setName(data.name || '');
      setPhone(data.phone || '');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Add real update logic here
    setTimeout(() => setSaving(false), 1000);
  };

  return (
    <div className="animate-fade-in max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[var(--text-main)] mb-2">Profil Sozlamalari</h1>
        <p className="text-[var(--text-muted)]">Shaxsiy va dilerlik ma'lumotlaringizni tahrirlang.</p>
      </div>

      {loading ? (
        <div className="py-20 text-center flex flex-col items-center">
          <span className="loader-sm mb-4"></span>
          <p className="text-muted">Yuklanmoqda...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Column - Avatar & Badge */}
          <div className="md:col-span-1 space-y-6">
            <div className="premium-card p-6 flex flex-col items-center text-center">
              <div className="relative mb-4 group cursor-pointer">
                <div className="w-32 h-32 rounded-full border-4 border-[var(--bg-main)] bg-[var(--bg-main)] overflow-hidden shadow-xl">
                  {profile?.avatarUrl ? (
                    <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100 dark:bg-gray-800">
                      <User size={48} />
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <Camera size={24} />
                </div>
              </div>

              <h2 className="text-xl font-bold text-[var(--text-main)]">{profile?.name}</h2>
              <p className="text-sm text-[var(--text-muted)] mb-4">{profile?.email}</p>

              <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-bold border border-primary/20">
                <ShieldCheck size={14} /> Rasmiy Diler
              </div>
            </div>

            {profile?.agent && (
              <div className="premium-card p-6 bg-gradient-to-b from-[var(--bg-card)] to-[var(--bg-main)] border-t-4 border-t-primary">
                <h3 className="font-bold text-[var(--text-main)] mb-4 flex items-center gap-2">
                  <Building size={16} className="text-primary" /> Kompaniya
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-[var(--text-muted)] block text-xs">Nomi:</span>
                    <span className="font-semibold text-[var(--text-main)]">{profile.agent.companyName}</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)] block text-xs">Litsenziya:</span>
                    <span className="font-semibold text-[var(--text-main)]">{profile.agent.license || 'Kiritilmagan'}</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)] block text-xs">Holati:</span>
                    {profile.agent.isApproved ? (
                      <span className="text-success font-bold">Tasdiqlangan</span>
                    ) : (
                      <span className="text-amber-500 font-bold">Tekshiruvda</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Form */}
          <div className="md:col-span-2">
            <div className="premium-card p-8">
              <h3 className="text-xl font-bold text-[var(--text-main)] mb-6">Asosiy Ma'lumotlar</h3>
              
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group mb-0">
                    <label className="form-label">To'liq Ism</label>
                    <div className="relative">
                      <User className="absolute left-4 top-3.5 text-[var(--text-muted)]" size={18} />
                      <input 
                        type="text" 
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="form-input pl-11"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group mb-0">
                    <label className="form-label">Telefon Raqam</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-3.5 text-[var(--text-muted)]" size={18} />
                      <input 
                        type="text" 
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="form-input pl-11"
                        placeholder="+998 90 123 45 67"
                      />
                    </div>
                  </div>

                  <div className="form-group mb-0 md:col-span-2">
                    <label className="form-label">Email (O'zgartirib bo'lmaydi)</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-3.5 text-[var(--text-muted)]" size={18} />
                      <input 
                        type="email" 
                        value={profile?.email || ''}
                        disabled
                        className="form-input pl-11 opacity-70 cursor-not-allowed bg-[var(--bg-main)]"
                      />
                    </div>
                  </div>

                  {profile?.agent && (
                    <div className="form-group mb-0 md:col-span-2">
                      <label className="form-label">Manzil (Kompaniya)</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-3.5 text-[var(--text-muted)]" size={18} />
                        <input 
                          type="text" 
                          defaultValue={profile.agent.address || ''}
                          disabled
                          className="form-input pl-11 opacity-70 cursor-not-allowed bg-[var(--bg-main)]"
                        />
                      </div>
                      <p className="text-xs text-[var(--text-muted)] mt-1">Kompaniya manzilini o'zgartirish uchun admin bilan bog'laning.</p>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-[var(--border)] flex justify-end">
                  <button 
                    type="submit" 
                    className="btn btn-primary px-8 flex items-center gap-2"
                    disabled={saving}
                  >
                    {saving ? "Saqlanmoqda..." : <><Save size={18} /> Saqlash</>}
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
