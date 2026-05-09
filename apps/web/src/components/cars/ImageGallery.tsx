'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ICarMedia, MediaType } from '@kci/types';
import './ImageGallery.css';

interface ImageGalleryProps {
  media: ICarMedia[];
  brand: string;
  model: string;
}

export default function ImageGallery({ media, brand, model }: ImageGalleryProps) {
  const images = media.filter(m => m.type === MediaType.IMAGE).sort((a, b) => a.sortOrder - b.sortOrder);
  const mainImage = images.length > 0 ? images[0].url : '/hero-car.png';
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="gallery-empty">
        <Image src={mainImage} alt={`${brand} ${model}`} fill className="gallery-main-img" />
      </div>
    );
  }

  return (
    <div className="gallery-container">
      <div className="gallery-main">
        <Image 
          src={images[activeIndex].url} 
          alt={`${brand} ${model} - view ${activeIndex + 1}`} 
          fill 
          priority
          className="gallery-main-img"
          sizes="(max-width: 768px) 100vw, 60vw"
        />
      </div>
      
      {images.length > 1 && (
        <div className="gallery-thumbnails">
          {images.map((img, index) => (
            <button 
              key={img.id}
              className={`thumbnail-btn ${index === activeIndex ? 'active' : ''}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`View image ${index + 1}`}
            >
              <Image 
                src={img.url} 
                alt="Thumbnail" 
                fill 
                className="thumbnail-img"
                sizes="100px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
