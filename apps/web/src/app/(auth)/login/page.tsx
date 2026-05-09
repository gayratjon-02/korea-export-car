'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogIn, AlertCircle } from 'lucide-react';
import { login, setTokens } from '@/lib/api/auth';
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
      const tokens = await login({ email, password });
      setTokens(tokens);
      // Optional: fetch user profile here to redirect accordingly
      router.push('/catalog');
      router.refresh();
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
                placeholder="••••••••"
                className="auth-input"
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
