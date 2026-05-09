import HeroSearch from '@/components/home/HeroSearch';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Ship, Calculator } from 'lucide-react';
import './home.css';

export default function Home() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="container hero-content animate-fade-in text-center">
          <div className="hero-badge mx-auto mb-6">Direct from South Korea</div>
          <h1 className="hero-title mx-auto text-5xl md:text-7xl font-extrabold font-outfit mb-6">
            Koreyadan Mashinani<br />
            <span className="text-accent">O'zingiz Hisoblang.</span>
          </h1>
          <p className="hero-subtitle mx-auto text-lg text-gray-300 max-w-2xl mb-8">
            Marka yoki modelni yozing va O'zbekiston, Qozog'iston yoki to'g'ridan-to'g'ri o'z shahringizgacha bo'lgan barcha bojxona va logistika xarajatlarini hisoblang.
          </p>
          
          <HeroSearch />
          
          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-gray-400">
            <span className="flex items-center gap-2"><ShieldCheck size={16} className="text-primary-light"/> Shaffof xarajatlar</span>
            <span className="flex items-center gap-2"><Ship size={16} className="text-primary-light"/> To'g'ridan-to'g'ri logistika</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features container">
        <div className="section-header text-center">
          <h2>Nega aynan KCI?</h2>
          <p className="text-muted">Biz sizga Koreyadan avtomobil olib kelishning eng qulay va ishonchli usulini taklif etamiz</p>
        </div>

        <div className="features-grid">
          <div className="feature-card card">
            <div className="feature-icon bg-blue-100">
              <ShieldCheck size={32} className="text-primary" />
            </div>
            <h3>100% Kafolatlangan Holat</h3>
            <p className="text-muted">Har bir avtomobil Encar va Kcar mutaxassislari tomonidan 150+ nuqtadan tekshiriladi. Hech qanday yashirin nuqsonlarsiz.</p>
          </div>

          <div className="feature-card card">
            <div className="feature-icon bg-red-100">
              <Calculator size={32} className="text-accent" />
            </div>
            <h3>Shaffof Narxlar</h3>
            <p className="text-muted">Bojxona to'lovlari, yetkazib berish va agentlik xizmatlari avvaldan hisoblanadi. Kutilmagan to'lovlar yo'q.</p>
          </div>

          <div className="feature-card card">
            <div className="feature-icon bg-green-100">
              <Ship size={32} className="text-success" />
            </div>
            <h3>Tezkor Yetkazib Berish</h3>
            <p className="text-muted">Koreyadan Markaziy Osiyogacha xavfsiz va sug'urtalangan logistika. O'rtacha yetkazib berish vaqti 20-30 kun.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container cta-container">
          <div className="cta-content">
            <h2>Avtomobil qidiryapsizmi?</h2>
            <p>Bizning maxsus agentlarimiz sizga eng yaxshi variantlarni topishda yordam beradi.</p>
            <Link href="/agents" className="btn btn-primary btn-lg">Agent bilan bog'lanish</Link>
          </div>
          <div className="cta-image-wrapper">
            <div className="placeholder-car-shape"></div>
          </div>
        </div>
      </section>
    </div>
  );
}
