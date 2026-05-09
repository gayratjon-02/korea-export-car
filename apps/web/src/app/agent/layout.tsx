'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Car, PlusCircle, MessageSquare, User, LogOut, Menu, X, ShieldCheck } from 'lucide-react';
import { clearTokens } from '@/lib/api/auth';
import './agent.css';

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {}
    }
  }, []);

  const handleLogout = () => {
    clearTokens();
    router.push('/login');
    router.refresh();
  };

  const menuItems = [
    { name: 'Dashboard', path: '/agent', icon: LayoutDashboard },
    { name: 'Mashinalarim', path: '/agent/cars', icon: Car },
    { name: 'Yangi Qo\'shish', path: '/agent/cars/new', icon: PlusCircle },
    { name: 'Xabarlar', path: '/agent/messages', icon: MessageSquare },
    { name: 'Profil', path: '/agent/profile', icon: User },
  ];

  return (
    <div className="agent-layout">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`agent-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <Link href="/" className="flex items-center gap-2">
            <Car size={28} className="text-primary" />
            <span className="font-extrabold text-xl tracking-tight">KCI <span className="text-primary">Diler</span></span>
          </Link>
          <button 
            className="md:hidden text-gray-500" 
            onClick={() => setSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <div className="sidebar-user px-6 py-6 border-b border-[var(--border)]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg overflow-hidden shrink-0">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                user?.name?.substring(0, 2).toUpperCase() || 'DL'
              )}
            </div>
            <div className="min-w-0">
              <div className="font-bold text-sm text-[var(--text-main)] truncate">{user?.agent?.companyName || user?.name || 'Yuklanmoqda...'}</div>
              <div className="text-xs flex items-center gap-1 mt-0.5">
                {user?.agent?.isApproved ? (
                  <><ShieldCheck size={12} className="text-success shrink-0" /> <span className="text-success font-medium truncate">Tasdiqlangan Diler</span></>
                ) : (
                  <><span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span> <span className="text-amber-500 font-medium truncate">Tekshiruvda</span></>
                )}
              </div>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <p className="px-6 py-3 text-xs font-bold text-muted uppercase tracking-wider">Asosiy Menyu</p>
          <ul>
            {menuItems.map((item) => {
              const isActive = pathname === item.path || (item.path !== '/agent' && pathname.startsWith(item.path));
              return (
                <li key={item.path}>
                  <Link 
                    href={item.path} 
                    className={`nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon size={20} className="nav-icon" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={20} />
            Chiqish
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="agent-main">
        <header className="agent-header md:hidden">
          <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 text-gray-600">
            <Menu size={24} />
          </button>
          <div className="font-bold">KCI Diler</div>
          <div className="w-8"></div> {/* Spacer for centering */}
        </header>
        
        <div className="agent-content">
          {children}
        </div>
      </main>
    </div>
  );
}
