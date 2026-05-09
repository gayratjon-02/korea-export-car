'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Globe, MapPin, Loader2, ShieldCheck, Phone } from 'lucide-react';
import { getMe } from '@/lib/api/users';

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getMe();
      setProfile(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="premium-card p-12 flex justify-center items-center h-full">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="premium-card p-6 md:p-8">
        <div className="flex items-center gap-3 mb-8 border-b border-[var(--border)] pb-4">
          <User size={24} className="text-primary" />
          <h2 className="text-2xl font-bold text-[var(--text-main)]">Shaxsiy ma'lumotlar</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group mb-0">
            <label className="form-label text-[var(--text-muted)] font-medium text-sm">To'liq ismingiz</label>
            <div className="form-input bg-[var(--bg-main)] py-3 px-4 flex items-center gap-3">
              <User size={18} className="text-[var(--text-muted)]" />
              <span className="font-medium text-[var(--text-main)]">{profile?.name}</span>
            </div>
          </div>

          <div className="form-group mb-0">
            <label className="form-label text-[var(--text-muted)] font-medium text-sm">Email manzilingiz</label>
            <div className="form-input bg-[var(--bg-main)] py-3 px-4 flex items-center gap-3">
              <Mail size={18} className="text-[var(--text-muted)]" />
              <span className="font-medium text-[var(--text-main)]">{profile?.email}</span>
            </div>
          </div>

          <div className="form-group mb-0">
            <label className="form-label text-[var(--text-muted)] font-medium text-sm">Telefon raqam</label>
            <div className="form-input bg-[var(--bg-main)] py-3 px-4 flex items-center gap-3">
              <Phone size={18} className="text-[var(--text-muted)]" />
              <span className="font-medium text-[var(--text-main)]">{profile?.phone || 'Kiritilmagan'}</span>
            </div>
          </div>

          <div className="form-group mb-0">
            <label className="form-label text-[var(--text-muted)] font-medium text-sm">Davlat</label>
            <div className="form-input bg-[var(--bg-main)] py-3 px-4 flex items-center gap-3">
              <Globe size={18} className="text-[var(--text-muted)]" />
              <span className="font-medium text-[var(--text-main)]">{profile?.country || 'Kiritilmagan'}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[var(--border)] flex justify-end">
          <button className="btn btn-primary px-8">Tahrirlash</button>
        </div>
      </div>

      <div className="premium-card p-6 md:p-8 bg-gradient-to-r from-blue-500/10 to-transparent border-l-4 border-l-primary">
        <div className="flex items-start gap-4">
          <ShieldCheck size={32} className="text-primary shrink-0" />
          <div>
            <h3 className="font-bold text-lg text-[var(--text-main)] mb-1">Xavfsiz Xarid</h3>
            <p className="text-[var(--text-muted)] text-sm">Sizning ma'lumotlaringiz KCI platformasi tomonidan xavfsiz himoyalangan. Dilerlar bilan faqat chat orqali muloqot qilishingizni tavsiya etamiz.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
