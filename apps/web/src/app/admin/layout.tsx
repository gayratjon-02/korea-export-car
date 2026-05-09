'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, UserCheck, Settings, LogOut } from 'lucide-react';
import { clearTokens } from '@/lib/api/auth';
import { IUser } from '@kci/types';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
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
    if (parsedUser.role !== 'ADMIN') {
      router.push('/');
      return;
    }
    
    setUser(parsedUser);
  }, [router]);

  const handleLogout = () => {
    clearTokens();
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const menuItems = [
    { name: "Asosiy Oyna", path: "/admin", icon: LayoutDashboard },
    { name: "Agentlarni Tasdiqlash", path: "/admin/agents", icon: UserCheck },
    { name: "Foydalanuvchilar", path: "/admin/users", icon: Users },
    { name: "Sozlamalar", path: "/admin/settings", icon: Settings },
  ];

  if (!user) return null;

  return (
    <div className="flex h-screen bg-[var(--bg-main)]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0B0F19] text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-white/10">
          <Link href="/admin" className="text-2xl font-extrabold font-outfit text-white">
            KCI <span className="text-primary">Admin</span>
          </Link>
          <div className="mt-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm truncate">{user.name}</div>
              <div className="text-xs text-blue-300">Administrator</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
                  isActive 
                    ? 'bg-primary text-white' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-400 hover:bg-red-500/10 transition-colors font-medium"
          >
            <LogOut size={20} />
            Tizimdan chiqish
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[var(--bg-card)]">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
