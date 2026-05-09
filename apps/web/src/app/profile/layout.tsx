'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { User, MessageSquare, Heart, LogOut, ChevronRight } from 'lucide-react';
import { removeTokens } from '@/lib/api/auth';
import { IUser } from '@kci/types';

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/login');
      return;
    }
    
    const parsedUser = JSON.parse(userStr);
    setUser(parsedUser);
  }, []);

  const handleLogout = () => {
    removeTokens();
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const navLinks = [
    { name: "Mening profilim", path: "/profile", icon: User },
    { name: "Xabarlarim", path: "/profile/messages", icon: MessageSquare },
    { name: "Saqlanganlar", path: "/profile/saved", icon: Heart },
  ];

  if (!user) return null;

  return (
    <div className="bg-[var(--bg-main)] min-h-screen pt-20 pb-12">
      <div className="container">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] font-medium mb-8">
          <Link href="/" className="hover:text-primary transition-colors">Bosh sahifa</Link>
          <ChevronRight size={14} />
          <span className="text-[var(--text-main)]">Shaxsiy kabinet</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="premium-card p-6 sticky top-24">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold uppercase">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-[var(--text-main)]">{user.name}</h3>
                  <p className="text-sm text-[var(--text-muted)]">{user.email}</p>
                </div>
              </div>

              <nav className="space-y-2 mb-8 border-b border-[var(--border)] pb-8">
                {navLinks.map((link) => {
                  const isActive = pathname === link.path;
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.path}
                      href={link.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                        isActive 
                          ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                          : 'text-[var(--text-muted)] hover:bg-[var(--bg-card)] hover:text-[var(--text-main)]'
                      }`}
                    >
                      <Icon size={20} />
                      {link.name}
                    </Link>
                  );
                })}
              </nav>

              <button 
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 w-full rounded-xl transition-all font-medium text-red-500 hover:bg-red-500/10"
              >
                <LogOut size={20} />
                Tizimdan chiqish
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
