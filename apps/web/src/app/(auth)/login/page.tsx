'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogIn, AlertCircle } from 'lucide-react';
import { login, setAuthData } from '@/lib/api/auth';
import '../auth.css';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setError('');
    setLoading(true);

    try {
      const response = await login({ email, password });
      setAuthData(response);
      if (response.user?.role === 'AGENT' || response.user?.role === 'ADMIN') {
        window.location.href = '/agent';
      } else {
        window.location.href = '/catalog';
      }
    } catch (err: any) {
      setError(err.message || 'Kirishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card animate-fade-in">
        <div className="auth-header">
          <div className="auth-icon">
            <LogIn size={28} />
          </div>
          <h1>Tizimga kirish</h1>
          <p>Korea Car Import platformasiga xush kelibsiz</p>
        </div>

        <div className="auth-body">
          <form onSubmit={handleSubmit} className="auth-form">
            {error && (
              <div className="error-message">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div className="form-group flex flex-col">
              <label className="form-label">Elektron pochta</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="misol@gmail.com"
                className="form-input"
                required
              />
            </div>

            <div className="form-group flex flex-col">
              <label className="form-label">Parol</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input"
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-full mt-2"
              disabled={loading}
            >
              {loading ? 'Kirilmoqda...' : 'Kirish'}
            </button>
          </form>

          <div className="auth-footer">
            Akkauntingiz yo'qmi?{' '}
            <Link href="/register" className="auth-link">Ro'yxatdan o'tish</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
