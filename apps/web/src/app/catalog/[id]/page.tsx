import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCarById } from '@/lib/api/cars';
import { formatCurrency, formatMileage, formatEngineCc } from '@kci/utils';
import { FuelType, CarCondition } from '@kci/types';
import ImageGallery from '@/components/cars/ImageGallery';
import AgentContactButton from '@/components/cars/AgentContactButton';
import { ShieldCheck, ArrowLeft, Calculator, MessageSquare, Info, MapPin, Settings, CheckCircle2, ChevronRight, Share2, Heart } from 'lucide-react';
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
    <div className="bg-[var(--bg-main)] min-h-screen pb-20 pt-20">
      <div className="container py-8">
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--text-muted)] font-medium mb-8">
          <Link href="/" className="hover:text-primary transition-colors">Bosh sahifa</Link>
          <ChevronRight size={14} />
          <Link href="/catalog" className="hover:text-primary transition-colors">Katalog</Link>
          <ChevronRight size={14} />
          <span className="text-[var(--text-main)]">{car.brand} {car.model}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Gallery & Specs */}
          <div className="lg:col-span-2 space-y-8">
            <div className="premium-card overflow-hidden">
              <ImageGallery media={car.media || []} brand={car.brand} model={car.model} />
            </div>

            <div className="premium-card p-6 md:p-8">
              <h2 className="text-2xl font-bold text-[var(--text-main)] mb-6 flex items-center gap-2 border-b border-[var(--border)] pb-4">
                <Settings size={24} className="text-primary" /> Texnik Parametrlar
              </h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                <div className="bg-[var(--bg-main)] p-4 rounded-xl border border-[var(--border)]">
                  <span className="block text-xs text-[var(--text-muted)] uppercase tracking-wider font-bold mb-1">Ishlab chiqarilgan yil</span>
                  <span className="block font-bold text-lg text-[var(--text-main)]">{car.year}</span>
                </div>
                <div className="bg-[var(--bg-main)] p-4 rounded-xl border border-[var(--border)]">
                  <span className="block text-xs text-[var(--text-muted)] uppercase tracking-wider font-bold mb-1">Yurgan masofasi</span>
                  <span className="block font-bold text-lg text-[var(--text-main)]">{car.mileage ? formatMileage(car.mileage) : '0 km'}</span>
                </div>
                <div className="bg-[var(--bg-main)] p-4 rounded-xl border border-[var(--border)]">
                  <span className="block text-xs text-[var(--text-muted)] uppercase tracking-wider font-bold mb-1">Dvigatel hajmi</span>
                  <span className="block font-bold text-lg text-[var(--text-main)]">{car.engineCc ? formatEngineCc(car.engineCc) : 'N/A'}</span>
                </div>
                <div className="bg-[var(--bg-main)] p-4 rounded-xl border border-[var(--border)]">
                  <span className="block text-xs text-[var(--text-muted)] uppercase tracking-wider font-bold mb-1">Yoqilg'i turi</span>
                  <span className="block font-bold text-lg text-[var(--text-main)]">{formatFuel(car.fuelType)}</span>
                </div>
                <div className="bg-[var(--bg-main)] p-4 rounded-xl border border-[var(--border)]">
                  <span className="block text-xs text-[var(--text-muted)] uppercase tracking-wider font-bold mb-1">Rangi</span>
                  <span className="block font-bold text-lg text-[var(--text-main)]">{car.color || 'Noma\'lum'}</span>
                </div>
                <div className="bg-[var(--bg-main)] p-4 rounded-xl border border-[var(--border)]">
                  <span className="block text-xs text-[var(--text-muted)] uppercase tracking-wider font-bold mb-1">Uzatmalar qutisi</span>
                  <span className="block font-bold text-lg text-[var(--text-main)]">{car.transmission || 'Avtomat'}</span>
                </div>
              </div>
            </div>

            {car.description && (
              <div className="premium-card p-6 md:p-8">
                <h2 className="text-2xl font-bold text-[var(--text-main)] mb-6 flex items-center gap-2 border-b border-[var(--border)] pb-4">
                  <Info size={24} className="text-primary" /> Diler Izohi
                </h2>
                <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-[var(--text-muted)]">
                  {car.description.split('\n').map((line: string, i: number) => (
                    <p key={i} className="mb-2">{line}</p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Pricing & Action */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              
              <div className="premium-card p-6 md:p-8 border-t-4 border-t-primary relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Calculator size={100} />
                </div>
                
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div>
                    <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full mb-3 uppercase tracking-wider">
                      {isNew ? 'Yangi Avtomobil' : 'Minilgan Avtomobil'}
                    </div>
                    <h1 className="text-3xl font-extrabold text-[var(--text-main)] mb-1 font-outfit leading-tight">{car.brand} {car.model}</h1>
                    <p className="text-[var(--text-muted)] font-medium">{car.year} yil</p>
                  </div>
                </div>

                <div className="bg-[var(--bg-main)] rounded-2xl p-6 my-8 border border-[var(--border)] relative z-10 text-center">
                  <div className="text-xs text-[var(--text-muted)] uppercase tracking-widest font-bold mb-2">Avtomobil Narxi (FOB)</div>
                  <div className="text-4xl font-extrabold text-primary mb-2 font-outfit">{formatCurrency(car.priceUsd, 'USD')}</div>
                  <div className="text-sm text-[var(--text-muted)] font-medium">≈ {formatCurrency(car.priceKrw, 'KRW')}</div>
                </div>

                <div className="bg-success/10 border border-success/20 rounded-xl p-4 flex items-start gap-3 mb-8 relative z-10">
                  <ShieldCheck size={24} className="text-success shrink-0" />
                  <div>
                    <strong className="block text-success text-sm mb-1">100% Holat Kafolati</strong>
                    <p className="text-xs text-[var(--text-muted)] font-medium">Ushbu avtomobil sertifikatlangan diler tomonidan taqdim etilgan.</p>
                  </div>
                </div>

                <div className="space-y-3 relative z-10">
                  <Link href={`/calculator?carId=${car.id}`} className="btn btn-primary w-full py-4 text-lg font-bold shadow-xl shadow-primary/20 hover:-translate-y-1 transition-transform flex justify-center items-center gap-2">
                    <Calculator size={20} /> Bojxona Hisoblash
                  </Link>
                  
                  <AgentContactButton agentId={car.agentId} carId={car.id} />
                </div>
                
                <div className="mt-6 flex justify-center gap-4 border-t border-[var(--border)] pt-6 relative z-10">
                  <button className="flex items-center gap-2 text-sm font-bold text-[var(--text-muted)] hover:text-primary transition-colors">
                    <Heart size={18} /> Saqlash
                  </button>
                  <button className="flex items-center gap-2 text-sm font-bold text-[var(--text-muted)] hover:text-primary transition-colors">
                    <Share2 size={18} /> Ulashish
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
