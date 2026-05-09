'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserPlus, AlertCircle } from 'lucide-react';
import { register as registerApi, setTokens } from '@/lib/api/auth';
import { UserRole } from '@kci/types';
import '../auth.css';

export default function RegisterPage() {
  const router = useRouter();
  
  const [role, setRole] = useState<UserRole>(UserRole.USER);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    if (password.length < 6) {
      setError('Parol kamida 6 ta belgidan iborat bo\'lishi kerak');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const tokens = await registerApi({ name, email, password, role });
      setTokens(tokens);
      
      if (role === UserRole.AGENT) {
        // Redirect agent to complete profile setup later
        router.push('/agent/onboarding');
      } else {
        router.push('/catalog');
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Ro\'yxatdan o\'tishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card animate-fade-in">
        <div className="auth-header">
          <div className="auth-icon">
            <UserPlus size={28} />
          </div>
          <h1>Ro'yxatdan o'tish</h1>
          <p>Yangi akkaunt yaratish</p>
        </div>

        <div className="auth-body">
          <div className="role-tabs">
            <button 
              type="button"
              className={`role-tab ${role === UserRole.USER ? 'active' : ''}`}
              onClick={() => setRole(UserRole.USER)}
            >
              Mijoz
            </button>
            <button 
              type="button"
              className={`role-tab ${role === UserRole.AGENT ? 'active' : ''}`}
              onClick={() => setRole(UserRole.AGENT)}
            >
              Agent / Diler
            </button>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && (
              <div className="error-message">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div className="form-group">
              <label>F.I.SH. yoki Kompaniya</label>
              <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={role === UserRole.AGENT ? "Kompaniya nomi" : "To'liq ismingiz"}
                className="auth-input"
                required
              />
            </div>

            <div className="form-group">
              <label>Elektron pochta</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="misol@gmail.com"
                className="auth-input"
                required
              />
            </div>

            <div className="form-group">
              <label>Parol</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Kamida 6 ta belgi"
                className="auth-input"
                required
                minLength={6}
              />
            </div>

            {role === UserRole.AGENT && (
              <p className="text-xs text-gray-500 text-center mt-2">
                Eslatma: Agent sifatida ro'yxatdan o'tgach, akkauntingiz admin tomonidan tasdiqlanishi kerak.
              </p>
            )}

            <button 
              type="submit" 
              className="btn btn-primary w-full mt-2"
              disabled={loading}
            >
              {loading ? "Yaratilmoqda..." : "Akkaunt Yaratish"}
            </button>
          </form>

          <div className="auth-footer">
            Allaqachon akkauntingiz bormi?{' '}
            <Link href="/login" className="auth-link">Tizimga kirish</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
