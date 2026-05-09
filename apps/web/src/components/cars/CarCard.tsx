import Image from 'next/image';
import Link from 'next/link';
import { ICar, FuelType, CarCondition } from '@kci/types';
import { formatUsd } from '@kci/utils';
import './CarCard.css';

interface CarCardProps {
  car: ICar;
}

export default function CarCard({ car }: CarCardProps) {
  const mainImage = car.media?.find(m => m.sortOrder === 0)?.url || '/hero-car.png';

  const formatCondition = (condition: string) => {
    return condition === CarCondition.NEW ? 'Yangi' : 'Ishlatilgan';
  };

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

  return (
    <div className="car-card card">
      <Link href={`/catalog/${car.id}`} className="car-card-image-link">
        <div className="car-card-image-wrapper">
          <Image 
            src={mainImage} 
            alt={`${car.brand} ${car.model}`} 
            fill 
            className="car-card-image"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="car-card-badge">
            {formatCondition(car.condition)}
          </div>
        </div>
      </Link>
      
      <div className="car-card-content">
        <h3 className="car-title">
          <Link href={`/catalog/${car.id}`}>
            {car.brand} {car.model} <span className="text-muted">{car.year}</span>
          </Link>
        </h3>
        
        <div className="car-price">
          {formatUsd(car.priceUsd)}
        </div>
        
        <div className="car-specs">
          <div className="spec-item">
            <span className="spec-label">Dvigatel</span>
            <span className="spec-value">{car.engineCc ? `${(car.engineCc / 1000).toFixed(1)}L` : 'N/A'}</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Yoqilg'i</span>
            <span className="spec-value">{formatFuel(car.fuelType)}</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Yurgan</span>
            <span className="spec-value">{car.mileage ? `${car.mileage.toLocaleString()} km` : '0 km'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
