'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Phone, MapPin, Upload, CheckCircle2 } from 'lucide-react';
import { registerAsAgent } from '@/lib/api/users';
import '../agent.css';

export default function AgentOnboarding() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    companyName: '',
    phoneNumber: '',
    address: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await registerAsAgent({
        companyName: formData.companyName,
        phone: formData.phoneNumber,
        address: formData.address,
        description: formData.description
      });
      setStep(2);
    } catch (err: any) {
      setError(err.message || 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  if (step === 2) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center p-4">
        <div className="premium-card max-w-lg w-full p-10 text-center animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-success" />
          </div>
          <h2 className="text-3xl font-extrabold text-[var(--text-main)] mb-4">Arizangiz qabul qilindi!</h2>
          <p className="text-[var(--text-muted)] text-lg mb-8 leading-relaxed">
            Sizning dilerlik arizangiz adminlarga yuborildi. Ma'lumotlaringiz tekshirilgandan so'ng, akkauntingiz faollashtiriladi.
          </p>
          <button 
            className="btn btn-primary w-full py-4 font-bold"
            onClick={() => router.push('/agent')}
          >
            Dashboardga o'tish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)] py-12 px-4 flex justify-center">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="text-4xl font-extrabold text-[var(--text-main)] mb-3">Dilerlik Profilini To'ldirish</h1>
          <p className="text-lg text-[var(--text-muted)]">Platformada to'laqonli ishlash uchun quyidagi ma'lumotlarni kiriting.</p>
        </div>

        <div className="premium-card p-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-lg font-medium text-sm mb-6">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group mb-0">
                <label className="form-label flex items-center gap-2 text-muted">
                  <Building2 size={16} /> Kompaniya yoki Brend nomi
                </label>
                <input 
                  type="text" 
                  value={formData.companyName}
                  onChange={e => setFormData({...formData, companyName: e.target.value})}
                  className="form-input py-3 shadow-sm"
                  placeholder="Masalan: Auto Korea LLC"
                  required
                />
              </div>

              <div className="form-group mb-0">
                <label className="form-label flex items-center gap-2 text-muted">
                  <Phone size={16} /> Telefon raqam
                </label>
                <input 
                  type="tel" 
                  value={formData.phoneNumber}
                  onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
                  className="form-input py-3 shadow-sm"
                  placeholder="+998 90 123 45 67"
                  required
                />
              </div>
            </div>

            <div className="form-group mb-0">
              <label className="form-label flex items-center gap-2 text-muted">
                <MapPin size={16} /> Ofis manzili
              </label>
              <input 
                type="text" 
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
                className="form-input py-3 shadow-sm"
                placeholder="Toshkent shahar, Chilonzor tumani..."
                required
              />
            </div>

            <div className="form-group mb-0">
              <label className="form-label text-muted">Kompaniya haqida qisqacha ma'lumot</label>
              <textarea 
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="form-input py-3 shadow-sm min-h-[120px] resize-y"
                placeholder="Mijozlar siz haqingizda bilishi kerak bo'lgan asosiy ma'lumotlar..."
                required
              />
            </div>

            <div className="form-group mb-0">
              <label className="form-label flex items-center gap-2 text-muted mb-2">
                Logotip yoki Rasm yuklash
              </label>
              <div className="border-2 border-dashed border-[var(--border)] rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[var(--bg-main)] transition-colors">
                <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
                  <Upload size={24} />
                </div>
                <p className="font-bold text-[var(--text-main)] mb-1">Rasm yuklash uchun bosing</p>
                <p className="text-sm text-muted">PNG, JPG gacha 5MB</p>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary py-4 text-lg font-bold mt-4 shadow-lg hover:shadow-xl transition-all"
              disabled={loading}
            >
              {loading ? "Saqlanmoqda..." : "Profilni Tasdiqlashga Yuborish"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
