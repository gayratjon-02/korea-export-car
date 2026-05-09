import { getCars } from '@/lib/api/cars';
import CarCard from '@/components/cars/CarCard';
import './catalog.css';
import { Search, Filter } from 'lucide-react';

import { ICar } from '@kci/types';

export default async function CatalogPage() {
  let cars: ICar[] = [];
  let total = 0;
  
  try {
    const res = await getCars();
    cars = res.items;
    total = res.total;
  } catch (error) {
    console.error('Error fetching cars:', error);
  }

  return (
    <div className="catalog-page">
      <div className="catalog-header bg-primary text-white">
        <div className="container">
          <h1>Avtomobillar Katalogi</h1>
          <p>Koreyadan to'g'ridan-to'g'ri eksport qilinadigan eng sara avtomobillar</p>
        </div>
      </div>

      <div className="container catalog-container">
        <aside className="catalog-sidebar">
          <div className="card filter-card">
            <div className="filter-header">
              <h3><Filter size={18} /> Filtrlar</h3>
            </div>
            
            <div className="filter-group">
              <label>Qidiruv</label>
              <div className="search-input-wrapper">
                <Search size={16} className="search-icon" />
                <input type="text" placeholder="Model yoki marka..." className="form-input" />
              </div>
            </div>

            <div className="filter-group">
              <label>Brend</label>
              <select className="form-select">
                <option value="">Barchasi</option>
                <option value="Hyundai">Hyundai</option>
                <option value="Kia">Kia</option>
                <option value="Genesis">Genesis</option>
                <option value="BMW">BMW</option>
                <option value="Mercedes-Benz">Mercedes-Benz</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Narx (USD)</label>
              <div className="price-inputs">
                <input type="number" placeholder="Dan" className="form-input" />
                <span>-</span>
                <input type="number" placeholder="Gacha" className="form-input" />
              </div>
            </div>

            <button className="btn btn-primary w-full mt-4">
              Filtrni qo'llash
            </button>
          </div>
        </aside>

        <main className="catalog-content">
          <div className="catalog-toolbar">
            <div className="results-count">
              <strong>{total}</strong> ta avtomobil topildi
            </div>
            <div className="sort-wrapper">
              <select className="form-select">
                <option value="newest">Eng yangilari</option>
                <option value="price_asc">Arzonlari oldin</option>
                <option value="price_desc">Qimmatlari oldin</option>
              </select>
            </div>
          </div>

          {cars.length > 0 ? (
            <div className="cars-grid">
              {cars.map(car => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          ) : (
            <div className="empty-state card">
              <Search size={48} className="text-muted" />
              <h3>Avtomobillar topilmadi</h3>
              <p className="text-muted">Hozircha bazada avtomobillar mavjud emas yoki filterga mos kelmadi.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
