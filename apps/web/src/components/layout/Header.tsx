'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Car, Search, Calculator, User, Menu, ShieldCheck } from 'lucide-react';
import './Header.css';

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {}
    }
  }, []);

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
            <Search size={18} /> Katalog
          </Link>
          <Link href="/calculator" className="nav-link">
            <Calculator size={18} /> Kalkulyator
          </Link>
          <Link href="/agents" className="nav-link">
            Agentlar
          </Link>
        </nav>
        
        <div className="header-actions">
          {mounted ? (
            user ? (
              <Link href={user.role === 'AGENT' || user.role === 'ADMIN' ? '/agent' : '/profile'} className="user-profile-btn flex items-center gap-2 font-bold px-4 py-2 rounded-full hover:bg-[var(--bg-main)] transition-colors border border-[var(--border)]">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  {user.role === 'AGENT' ? <ShieldCheck size={16} /> : <User size={16} />}
                </div>
                <span className="hidden sm:inline-block truncate max-w-[100px]">{user.name || 'Profil'}</span>
              </Link>
            ) : (
              <Link href="/login" className="btn btn-outline login-btn">
                <User size={18} /> Sign In
              </Link>
            )
          ) : (
            <div className="w-[100px] h-[40px] rounded-full bg-[var(--bg-main)] animate-pulse"></div>
          )}
          <button className="mobile-menu-btn">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  );
}
