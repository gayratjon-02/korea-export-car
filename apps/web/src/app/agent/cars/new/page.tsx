'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, X, Save, ArrowLeft, Info, Car, Fuel, Settings, DollarSign } from 'lucide-react';
import Link from 'next/link';

export default function AgentNewCar() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: '',
    priceUsd: '',
    engineCc: '',
    fuelType: '',
    transmission: '',
    mileage: '',
    description: ''
  });

  const handleImageUpload = () => {
    // Simulate image upload
    if (images.length < 5) {
      setImages([...images, `https://images.unsplash.com/photo-1550314405-188e6be019aa?auto=format&fit=crop&q=80&w=400&hash=${Math.random()}`]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      router.push('/agent/cars');
    }, 1500);
  };

  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/agent/cars" className="w-10 h-10 rounded-full bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center text-[var(--text-main)] hover:bg-[var(--bg-main)] transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--text-main)] mb-1">Yangi Mashina Qo'shish</h1>
          <p className="text-[var(--text-muted)]">Katalogga yangi avtomobil ma'lumotlarini kiriting.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          <div className="premium-card p-8">
            <h3 className="text-xl font-bold text-[var(--text-main)] mb-6 flex items-center gap-2">
              <Car size={20} className="text-primary" /> Asosiy Ma'lumotlar
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group mb-0">
                <label className="form-label">Brend (Marka)</label>
                <input 
                  type="text" 
                  value={formData.brand}
                  onChange={e => setFormData({...formData, brand: e.target.value})}
                  className="form-input"
                  placeholder="Masalan: Hyundai"
                  required
                />
              </div>

              <div className="form-group mb-0">
                <label className="form-label">Model</label>
                <input 
                  type="text" 
                  value={formData.model}
                  onChange={e => setFormData({...formData, model: e.target.value})}
                  className="form-input"
                  placeholder="Masalan: Palisade"
                  required
                />
              </div>

              <div className="form-group mb-0">
                <label className="form-label">Ishlab chiqarilgan yili</label>
                <input 
                  type="number" 
                  value={formData.year}
                  onChange={e => setFormData({...formData, year: e.target.value})}
                  className="form-input"
                  placeholder="2023"
                  min="2010"
                  max="2025"
                  required
                />
              </div>

              <div className="form-group mb-0">
                <label className="form-label flex items-center gap-1">
                  Narxi (USD) <DollarSign size={14} className="text-green-500" />
                </label>
                <input 
                  type="number" 
                  value={formData.priceUsd}
                  onChange={e => setFormData({...formData, priceUsd: e.target.value})}
                  className="form-input font-bold text-primary"
                  placeholder="25000"
                  required
                />
              </div>
            </div>
          </div>

          <div className="premium-card p-8">
            <h3 className="text-xl font-bold text-[var(--text-main)] mb-6 flex items-center gap-2">
              <Settings size={20} className="text-primary" /> Texnik Xususiyatlari
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group mb-0">
                <label className="form-label">Dvigatel hajmi (cc)</label>
                <input 
                  type="number" 
                  value={formData.engineCc}
                  onChange={e => setFormData({...formData, engineCc: e.target.value})}
                  className="form-input"
                  placeholder="Masalan: 2500"
                  required
                />
              </div>

              <div className="form-group mb-0">
                <label className="form-label flex items-center gap-1">Yoqilg'i turi <Fuel size={14}/></label>
                <select 
                  value={formData.fuelType}
                  onChange={e => setFormData({...formData, fuelType: e.target.value})}
                  className="form-select"
                  required
                >
                  <option value="">Tanlang</option>
                  <option value="GASOLINE">Benzin</option>
                  <option value="DIESEL">Dizel</option>
                  <option value="HYBRID">Gibrid</option>
                  <option value="ELECTRIC">Elektr</option>
                  <option value="LPG">Gaz (LPG)</option>
                </select>
              </div>

              <div className="form-group mb-0">
                <label className="form-label">Yurgani (km)</label>
                <input 
                  type="number" 
                  value={formData.mileage}
                  onChange={e => setFormData({...formData, mileage: e.target.value})}
                  className="form-input"
                  placeholder="Masalan: 45000"
                  required
                />
              </div>

              <div className="form-group mb-0">
                <label className="form-label">Uzatmalar qutisi</label>
                <select 
                  value={formData.transmission}
                  onChange={e => setFormData({...formData, transmission: e.target.value})}
                  className="form-select"
                  required
                >
                  <option value="">Tanlang</option>
                  <option value="AUTO">Avtomat</option>
                  <option value="MANUAL">Mexanika</option>
                </select>
              </div>
            </div>
          </div>

          <div className="premium-card p-8">
            <h3 className="text-xl font-bold text-[var(--text-main)] mb-6">Batafsil Ta'rif</h3>
            <div className="form-group mb-0">
              <label className="form-label">Qo'shimcha ma'lumotlar, holati va komplektatsiyasi</label>
              <textarea 
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="form-input min-h-[150px] resize-y"
                placeholder="Mashinaning kraskasi toza, 1-qo'l, faqat shaharda haydalgan..."
                required
              />
            </div>
          </div>
        </div>

        {/* Right Column: Images & Submit */}
        <div className="space-y-6">
          <div className="premium-card p-6">
            <h3 className="text-lg font-bold text-[var(--text-main)] mb-4">Rasmlar ({images.length}/5)</h3>
            
            <div 
              className="border-2 border-dashed border-[var(--border)] rounded-xl h-40 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[var(--bg-main)] transition-colors mb-4"
              onClick={handleImageUpload}
            >
              <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-2">
                <Upload size={20} />
              </div>
              <p className="font-bold text-[var(--text-main)] text-sm">Rasm qo'shish</p>
              <p className="text-xs text-muted">Maksimal 5 ta rasm</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-video rounded-lg overflow-hidden bg-black group border border-[var(--border)]">
                  <img src={img} alt={`Upload ${idx}`} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  <button 
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                  {idx === 0 && (
                    <span className="absolute bottom-1 left-1 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded">Asosiy</span>
                  )}
                </div>
              ))}
            </div>

            {images.length === 0 && (
              <div className="bg-blue-50/50 p-4 rounded-lg flex gap-3 border border-blue-100 mt-4">
                <Info size={20} className="text-primary shrink-0" />
                <p className="text-xs text-primary/80 font-medium">Xaridorlar qaror qabul qilishida rasmlar juda muhim. Kamida bitta sifatli rasm yuklang.</p>
              </div>
            )}
          </div>

          <div className="premium-card p-6 sticky top-24">
            <h3 className="font-bold text-[var(--text-main)] mb-4 border-b border-[var(--border)] pb-4">Xulosa</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Holati:</span>
                <span className="font-bold text-amber-500">Kutilmoqda</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Ko'rinishi:</span>
                <span className="font-bold text-[var(--text-main)]">Katalogda ochiq</span>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-full py-4 shadow-lg hover:-translate-y-1 transition-transform flex items-center justify-center gap-2 font-bold"
              disabled={loading || images.length === 0}
            >
              {loading ? "Saqlanmoqda..." : <><Save size={20} /> E'lonni Saqlash</>}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
