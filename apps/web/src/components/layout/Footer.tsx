import Link from 'next/link';
import { Car, Mail, Phone, MapPin, Facebook, Instagram, Send } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="logo">
              <Car size={32} className="logo-icon" />
              <span className="logo-text">KCI</span>
              <span className="logo-subtext text-gray-400">Premium</span>
            </Link>
            <p className="mt-4 text-sm text-gray-400">
              Janubiy Koreyadan O'zbekiston va MDH davlatlariga to'g'ridan-to'g'ri, vositachilarsiz avtomobil eksport qilish bo'yicha ishonchli platformangiz.
            </p>
            <div className="social-links mt-6 flex gap-4">
              <a href="#" aria-label="Facebook" className="social-link"><Facebook size={20} /></a>
              <a href="#" aria-label="Instagram" className="social-link"><Instagram size={20} /></a>
              <a href="#" aria-label="Telegram" className="social-link"><Send size={20} /></a>
            </div>
          </div>

          <div className="footer-links">
            <h3 className="footer-title">Platforma</h3>
            <ul>
              <li><Link href="/catalog">Avtomobillar</Link></li>
              <li><Link href="/calculator">Bojxona Kalkulyatori</Link></li>
              <li><Link href="/agents">Agentlar va Dilerlar</Link></li>
              <li><Link href="/about">Biz Haqimizda</Link></li>
            </ul>
          </div>

          <div className="footer-links">
            <h3 className="footer-title">Yordam</h3>
            <ul>
              <li><Link href="/faq">Ko'p so'raladigan savollar</Link></li>
              <li><Link href="/terms">Foydalanish shartlari</Link></li>
              <li><Link href="/privacy">Maxfiylik siyosati</Link></li>
              <li><Link href="/support">Texnik yordam</Link></li>
            </ul>
          </div>

          <div className="footer-contact">
            <h3 className="footer-title">Bog'lanish</h3>
            <div className="contact-info flex flex-col gap-3 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-primary" />
                <span>+82 10-1234-5678</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-primary" />
                <span>support@koreacarimport.com</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin size={16} className="text-primary shrink-0 mt-1" />
                <span>Incheon, Janubiy Koreya, Export Zone B-12</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom mt-12 pt-6 border-t border-gray-800 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Korea Car Import. Barcha huquqlar himoyalangan.</p>
        </div>
      </div>
    </footer>
  );
}
