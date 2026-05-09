import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCarById } from '@/lib/api/cars';
import { formatCurrency, formatMileage, formatEngineCc } from '@kci/utils';
import { FuelType, CarCondition } from '@kci/types';
import ImageGallery from '@/components/cars/ImageGallery';
import { ShieldCheck, ArrowLeft, Calculator, MessageSquare, Info } from 'lucide-react';
import './car-details.css';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const car = await getCarById(params.id);
    return {
      title: `${car.brand} ${car.model} ${car.year} | KCI`,
      description: `Sotuvda ${car.brand} ${car.model}. Narxi: ${formatCurrency(car.priceUsd, 'USD')}. Janubiy Koreyadan eksport.`,
    };
  } catch (e) {
    return { title: 'Car Not Found | KCI' };
  }
}

export default async function CarDetailsPage({ params }: Props) {
  let car;
  try {
    car = await getCarById(params.id);
  } catch (error) {
    notFound();
  }

  const formatFuel = (fuel: string) => {
    const map: Record<string, string> = {
      [FuelType.GASOLINE]: 'Benzin',
      [FuelType.DIESEL]: 'Dizel',
      [FuelType.HYBRID]: 'Gibrid',
      [FuelType.ELECTRIC]: 'Elektr',
      [FuelType.LPG]: 'Gaz (LPG)'
    };
    return map[fuel] || fuel;
  };

  const isNew = car.condition === CarCondition.NEW;

  return (
    <div className="car-details-page">
      <div className="container py-8">
        <Link href="/catalog" className="back-link">
          <ArrowLeft size={16} /> Katalogga qaytish
        </Link>

        <div className="car-details-grid">
          {/* Left Column: Gallery & Specs */}
          <div className="car-details-main">
            <div className="car-header-mobile">
              <div className="car-badge">{isNew ? 'Yangi' : 'Ishlatilgan'}</div>
              <h1>{car.year} {car.brand} {car.model}</h1>
              <div className="car-price-mobile">{formatCurrency(car.priceUsd, 'USD')}</div>
            </div>

            <ImageGallery media={car.media || []} brand={car.brand} model={car.model} />

            <div className="car-section card">
              <h2>Texnik parametrlar</h2>
              <div className="specs-grid">
                <div className="spec-box">
                  <span className="spec-name">Yili</span>
                  <span className="spec-val">{car.year}</span>
                </div>
                <div className="spec-box">
                  <span className="spec-name">Yurgan masofasi</span>
                  <span className="spec-val">{car.mileage ? formatMileage(car.mileage) : '0 km'}</span>
                </div>
                <div className="spec-box">
                  <span className="spec-name">Dvigatel</span>
                  <span className="spec-val">{car.engineCc ? formatEngineCc(car.engineCc) : 'N/A'}</span>
                </div>
                <div className="spec-box">
                  <span className="spec-name">Yoqilg'i</span>
                  <span className="spec-val">{formatFuel(car.fuelType)}</span>
                </div>
                <div className="spec-box">
                  <span className="spec-name">Rangi</span>
                  <span className="spec-val">{car.color || 'Noma\'lum'}</span>
                </div>
                <div className="spec-box">
                  <span className="spec-name">Uzatmalar qutisi</span>
                  <span className="spec-val">{car.transmission || 'Avtomat'}</span>
                </div>
              </div>
            </div>

            {car.description && (
              <div className="car-section card">
                <h2>Qo'shimcha ma'lumot</h2>
                <div className="car-description">
                  {car.description.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Pricing & Action */}
          <div className="car-details-sidebar">
            <div className="car-pricing-card card">
              <div className="car-header-desktop">
                <div className="car-badge">{isNew ? 'Yangi' : 'Ishlatilgan'}</div>
                <h1>{car.year} {car.brand} {car.model}</h1>
              </div>

              <div className="price-block">
                <div className="price-label">FOB Narxi (Koreyada)</div>
                <div className="price-value text-accent">{formatCurrency(car.priceUsd, 'USD')}</div>
                <div className="price-krw">≈ {formatCurrency(car.priceKrw, 'KRW')}</div>
              </div>

              <div className="guarantee-box bg-blue-100">
                <ShieldCheck size={24} className="text-primary" />
                <div>
                  <strong>100% Kafolatlangan</strong>
                  <p>KCI mutaxassislari tomonidan tekshirilgan.</p>
                </div>
              </div>

              <div className="action-buttons">
                <Link href={`/calculator?carId=${car.id}`} className="btn btn-primary w-full">
                  <Calculator size={18} /> Bojxona va Yetkazishni Hisoblash
                </Link>
                <button className="btn btn-outline w-full mt-2">
                  <MessageSquare size={18} /> Agent bilan bog'lanish
                </button>
              </div>

              <div className="info-note">
                <Info size={16} />
                <p>Yakuniy narx (CIP) sizning mamlakatingizga qarab o'zgaradi. Aniq hisoblash uchun kalkulyatordan foydalaning.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
