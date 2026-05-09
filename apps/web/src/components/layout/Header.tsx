import Link from 'next/link';
import { Car, Search, Calculator, User, Menu } from 'lucide-react';
import './Header.css';

export default function Header() {
  return (
    <header className="header">
      <div className="container header-container">
        <Link href="/" className="logo">
          <Car size={32} className="logo-icon" />
          <span className="logo-text">KCI</span>
          <span className="logo-subtext">Premium</span>
        </Link>
        
        <nav className="nav-desktop">
          <Link href="/catalog" className="nav-link">
            <Search size={18} /> Catalog
          </Link>
          <Link href="/calculator" className="nav-link">
            <Calculator size={18} /> Calculator
          </Link>
          <Link href="/agents" className="nav-link">
            Agents
          </Link>
        </nav>
        
        <div className="header-actions">
          <button className="btn btn-outline login-btn">
            <User size={18} /> Sign In
          </button>
          <button className="mobile-menu-btn">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  );
}
