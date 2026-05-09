'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquare } from 'lucide-react';

interface Props {
  agentId: string;
}

export default function StartChatButton({ agentId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStartChat = async () => {
    // Basic unauthenticated redirect for now, or authenticated room creation
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!token) {
      router.push(`/login?redirect=/agents/${agentId}`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'}/chat/rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ agentId, carId: 'none' }) // 'none' is fallback for general chat
      });

      if (!res.ok) throw new Error('Failed to create chat');
      
      const room = await res.json();
      router.push(`/chat/${room.id}`);
    } catch (error) {
      console.error(error);
      alert('Chat ochishda xatolik. Tizimga qaytadan kiring.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleStartChat}
      disabled={loading}
      className="btn btn-primary w-full flex items-center justify-center gap-2 mb-2"
    >
      <MessageSquare size={18} /> {loading ? 'Ochilmoqda...' : 'Chat Yozish'}
    </button>
  );
}
