import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Ship, Clock, Calculator } from 'lucide-react';
import './home.css';

export default function Home() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="container hero-content animate-fade-in">
          <div className="hero-badge">Direct from South Korea</div>
          <h1 className="hero-title">
            Premium Cars.<br />
            <span className="text-accent">Transparent Prices.</span>
          </h1>
          <p className="hero-subtitle">
            Import the finest vehicles directly from South Korea to Uzbekistan, Kazakhstan, and the UAE. Save up to 20% by cutting out the middleman.
          </p>
          <div className="hero-actions">
            <Link href="/catalog" className="btn btn-primary btn-lg">
              View Catalog <ArrowRight size={20} />
            </Link>
            <Link href="/calculator" className="btn btn-secondary btn-lg">
              Calculate Customs <Calculator size={20} />
            </Link>
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
