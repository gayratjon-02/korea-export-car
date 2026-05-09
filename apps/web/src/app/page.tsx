'use client';

import { useState, useEffect } from 'react';
import HeroSearch from '@/components/home/HeroSearch';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Ship, Calculator, Star, ArrowRight, TrendingUp, CheckCircle2 } from 'lucide-react';
import { getCars } from '@/lib/api/cars';
import { formatCurrency } from '@kci/utils';
import { ICar } from '@kci/types';
import './home.css';

export default function Home() {
  const [featuredCars, setFeaturedCars] = useState<ICar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedCars();
  }, []);

  const fetchFeaturedCars = async () => {
    try {
      const data = await getCars({ limit: 4, sortBy: 'viewCount', sortOrder: 'desc' });
      setFeaturedCars(data.items || []);
    } catch (err) {
      console.error("Failed to load featured cars", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page overflow-hidden">
      {/* Premium Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20">
        <div className="absolute inset-0 bg-[#0B0F19] z-0"></div>
        
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-1/4 -right-20 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 -left-20 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[100px]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-white/5 rotate-12"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-white/5 -rotate-12"></div>
        </div>

        <div className="container relative z-10 flex flex-col lg:flex-row items-center gap-12 pt-10 pb-20">
          
          {/* Left Text Content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white text-xs font-bold uppercase tracking-wider mb-8 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
              </span>
              Janubiy Koreyadan To'g'ridan-To'g'ri
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight font-outfit">
              Kelajak Avtomobilini <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent inline-block pb-2">Bugun Xarid Qiling.</span>
            </h1>
            
            <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              O'zbekiston, Qozog'iston va butun MDH davlatlari uchun eng tez, ishonchli va shaffof avtomobil import platformasi.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link href="/catalog" className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-lg transition-all hover:shadow-[0_0_30px_-5px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2 hover:-translate-y-1">
                Katalogga O'tish <ArrowRight size={20} />
              </Link>
              <Link href="/calculator" className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-bold text-lg transition-all backdrop-blur-md flex items-center justify-center gap-2">
                <Calculator size={20} /> Bojxonani Hisoblash
              </Link>
            </div>
            
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 mt-12 pt-12 border-t border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-400">
                  <ShieldCheck size={24} />
                </div>
                <div className="text-left">
                  <div className="text-white font-bold text-xl">100%</div>
                  <div className="text-gray-500 text-xs font-medium uppercase tracking-wider">Kafolat</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20 text-red-400">
                  <TrendingUp size={24} />
                </div>
                <div className="text-left">
                  <div className="text-white font-bold text-xl">15K+</div>
                  <div className="text-gray-500 text-xs font-medium uppercase tracking-wider">Mijozlar</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20 text-green-400">
                  <Ship size={24} />
                </div>
                <div className="text-left">
                  <div className="text-white font-bold text-xl">25 Kun</div>
                  <div className="text-gray-500 text-xs font-medium uppercase tracking-wider">Logistika</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Image/Graphic */}
          <div className="w-full lg:w-1/2 relative hidden md:block animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] to-transparent z-10"></div>
              {/* Using a premium placeholder image of a Korean Car */}
              <img 
                src="https://images.unsplash.com/photo-1633507421396-1c4b96f5b9d2?auto=format&fit=crop&q=80&w=1000" 
                alt="Premium Car" 
                className="w-full h-full object-cover relative z-0"
              />
              
              {/* Floating Cards overlay */}
              <div className="absolute top-10 -left-6 z-20 bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-xl shadow-2xl animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">K5</div>
                  <div>
                    <div className="text-white font-bold text-sm">Kia K5 2024</div>
                    <div className="text-green-400 text-xs font-medium">Bojxona: $4,200</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-20 -right-6 z-20 bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-xl shadow-2xl animate-float" style={{ animationDelay: '1.5s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-bold">EV</div>
                  <div>
                    <div className="text-white font-bold text-sm">IONIQ 5</div>
                    <div className="text-green-400 text-xs font-medium">Bojxona: $0 (Imtiyoz)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="py-20 bg-[var(--bg-main)]">
        <div className="container">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--text-main)] mb-2">Trendagi Avtomobillar</h2>
              <p className="text-[var(--text-muted)] text-lg">Xaridorlar tomonidan eng ko'p qiziqish bildirilgan modellar</p>
            </div>
            <Link href="/catalog" className="text-primary font-bold hover:underline flex items-center gap-1 group">
              Barchasini ko'rish <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><span className="loader"></span></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredCars.map(car => (
                <Link href={`/catalog/${car.id}`} key={car.id} className="premium-card group hover:border-primary/50 transition-all cursor-pointer block">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img 
                      src={car.media?.[0]?.url || 'https://images.unsplash.com/photo-1550314405-188e6be019aa?auto=format&fit=crop&q=80&w=400'} 
                      alt={car.model} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-white text-xs font-bold flex items-center gap-1">
                      <Star size={12} className="text-yellow-400 fill-yellow-400" /> {car.viewCount || 0}
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="text-xs font-bold text-primary mb-1 uppercase tracking-wider">{car.brand}</div>
                    <h3 className="font-bold text-lg text-[var(--text-main)] mb-3 group-hover:text-primary transition-colors">{car.year} {car.model}</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Koreyadagi narxi</div>
                        <div className="font-extrabold text-xl text-[var(--text-main)]">{formatCurrency(car.priceUsd, 'USD')}</div>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-[var(--bg-main)] flex items-center justify-center text-[var(--text-muted)] group-hover:bg-primary group-hover:text-white transition-colors">
                        <ArrowRight size={18} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-[var(--bg-card)] border-y border-[var(--border)]">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-[var(--text-main)] mb-6">Sizning ishonchli hamkoringiz</h2>
            <p className="text-xl text-[var(--text-muted)]">Biz orqali avtomobil xarid qilish nafaqat oson, balki 100% xavfsizdir.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                icon: ShieldCheck,
                title: "To'liq Kafolat",
                desc: "Avtomobilning holati Encar sertifikatlari va bizning maxsus dilerlarimiz tomonidan tasdiqlanadi. Har qanday yashirin nuqsonlarga qarshi kafolat."
              },
              {
                icon: Calculator,
                title: "Yashirin to'lovlarsiz",
                desc: "Bizning Smart Kalkulyator yordamida siz uyga yetib kelguncha bo'lgan barcha xarajatlarni (bojxona, logistika, xizmat) oldindan 100% aniq bilib olasiz."
              },
              {
                icon: Ship,
                title: "Tezkor Logistika",
                desc: "Janubiy Koreya portlaridan to'g'ridan-to'g'ri MDH davlatlariga xavfsiz va tezkor yetkazib berish. Barcha jarayonni onlayn kuzatish imkoniyati."
              }
            ].map((feature, idx) => (
              <div key={idx} className="bg-[var(--bg-main)] border border-[var(--border)] p-8 rounded-3xl hover:shadow-xl transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-150 transition-transform duration-700">
                  <feature.icon size={120} />
                </div>
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 relative z-10">
                  <feature.icon size={32} />
                </div>
                <h3 className="text-2xl font-bold text-[var(--text-main)] mb-4 relative z-10">{feature.title}</h3>
                <p className="text-[var(--text-muted)] leading-relaxed relative z-10">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary z-0"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center mix-blend-overlay opacity-20 z-0"></div>
        
        <div className="container relative z-10 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">O'z avtomobilingizni bugun toping</h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10">Bizning katalogimizda 10,000 dan ortiq tekshirilgan Koreya avtomobillari mavjud. Sizni o'zingizga yoqadigan mashina kutmoqda.</p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/catalog" className="px-8 py-4 bg-white text-primary rounded-xl font-bold text-lg hover:bg-blue-50 transition-colors shadow-xl">
              Katalogni Ko'rish
            </Link>
            <Link href="/register" className="px-8 py-4 bg-transparent border-2 border-white/30 hover:border-white text-white rounded-xl font-bold text-lg transition-colors">
              Ro'yxatdan O'tish
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
