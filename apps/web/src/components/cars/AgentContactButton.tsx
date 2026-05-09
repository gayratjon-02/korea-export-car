'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquare, Loader2 } from 'lucide-react';
import { createRoom } from '@/lib/api/chat';

interface Props {
  agentId: string;
  carId: string;
}

export default function AgentContactButton({ agentId, carId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleContact = async () => {
    // Check if user is logged in
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/login');
      return;
    }

    try {
      setLoading(true);
      const room = await createRoom({ agentId, carId });
      router.push(`/profile/messages`);
    } catch (err: any) {
      alert(err.message || "Xatolik yuz berdi");
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleContact} 
      disabled={loading}
      className="btn btn-outline w-full mt-3 py-3 font-bold border-2 flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-colors"
    >
      {loading ? (
        <><Loader2 size={18} className="animate-spin" /> Ulanmoqda...</>
      ) : (
        <><MessageSquare size={18} /> Agent bilan bog'lanish</>
      )}
    </button>
  );
}
