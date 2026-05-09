'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Send, Image as ImageIcon, Car, User, CheckCircle2, ArrowRight, MessageSquare, ShieldCheck } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { getRooms, getRoomMessages } from '@/lib/api/chat';
import { formatCurrency } from '@kci/utils';

export default function UserMessagesPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [activeRoom, setActiveRoom] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [userId, setUserId] = useState('');
  const [isMobileListVisible, setIsMobileListVisible] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUserId(JSON.parse(userStr).id);
    }
    
    fetchRooms();

    // Initialize Socket
    const token = localStorage.getItem('accessToken');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
    // Extract base URL from API URL (e.g., http://localhost:4000)
    const baseUrl = apiUrl.replace('/api/v1', '');
    
    const newSocket = io(baseUrl, {
      auth: { token },
      transports: ['websocket'],
    });

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket');
    });

    newSocket.on('newMessage', (msg) => {
      setMessages(prev => {
        // Only add if it belongs to active room and doesn't already exist
        if (msg.roomId === activeRoom?.id && !prev.find(m => m.id === msg.id)) {
          return [...prev, msg];
        }
        return prev;
      });
      // Move room to top and update last message
      setRooms(prev => {
        const updated = prev.map(r => r.id === msg.roomId ? { ...r, lastMessageAt: new Date().toISOString() } : r);
        return updated.sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
      });
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [activeRoom]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const fetchRooms = async () => {
    try {
      const res = await getRooms();
      setRooms(res);
    } catch (err) {
      console.error('Failed to load rooms', err);
    }
  };

  const handleSelectRoom = async (room: any) => {
    setActiveRoom(room);
    setIsMobileListVisible(false);
    if (socket) {
      socket.emit('joinRoom', { roomId: room.id });
    }
    try {
      const res = await getRoomMessages(room.id);
      setMessages(res.items.reverse()); // Reverse to show oldest at top, newest at bottom
    } catch (err) {
      console.error('Failed to load messages', err);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeRoom || !socket) return;

    socket.emit('sendMessage', {
      roomId: activeRoom.id,
      content: newMessage,
      type: 'text'
    });

    setNewMessage('');
  };

  return (
    <div className="premium-card h-[calc(100vh-160px)] min-h-[600px] flex overflow-hidden relative">
      
      {/* Rooms List (Sidebar) */}
      <div className={`w-full md:w-80 border-r border-[var(--border)] flex flex-col bg-[var(--bg-main)] absolute md:relative z-20 h-full transition-transform duration-300 ${isMobileListVisible ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-4 border-b border-[var(--border)]">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input 
              type="text" 
              placeholder="Qidiruv..." 
              className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {rooms.length === 0 ? (
            <div className="p-8 text-center text-[var(--text-muted)]">
              <MessageSquare size={32} className="mx-auto mb-3 opacity-50" />
              <p className="text-sm">Hozircha xabarlar yo'q</p>
            </div>
          ) : (
            rooms.map((room) => (
              <button 
                key={room.id}
                onClick={() => handleSelectRoom(room)}
                className={`w-full text-left p-4 border-b border-[var(--border)] flex items-start gap-3 hover:bg-[var(--bg-card)] transition-colors ${activeRoom?.id === room.id ? 'bg-[var(--bg-card)] border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'}`}
              >
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-primary shrink-0 font-bold overflow-hidden">
                  {room.agent?.companyName?.charAt(0) || 'A'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-[var(--text-main)] truncate">{room.agent?.companyName || 'Diler'}</h4>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] truncate mb-1">
                    Mashina: {room.car?.brand} {room.car?.model}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col bg-[var(--bg-card)] absolute md:relative z-10 w-full h-full transition-transform duration-300 ${!isMobileListVisible ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}>
        
        {activeRoom ? (
          <>
            {/* Chat Header */}
            <div className="h-16 border-b border-[var(--border)] px-4 flex items-center justify-between bg-[var(--bg-main)]">
              <div className="flex items-center gap-3">
                <button 
                  className="md:hidden p-2 -ml-2 text-[var(--text-muted)]"
                  onClick={() => setIsMobileListVisible(true)}
                >
                  <ArrowRight size={20} className="rotate-180" />
                </button>
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-primary font-bold">
                  {activeRoom.agent?.companyName?.charAt(0) || 'A'}
                </div>
                <div>
                  <h3 className="font-bold text-[var(--text-main)] flex items-center gap-1">
                    {activeRoom.agent?.companyName || 'Diler'} <ShieldCheck size={14} className="text-success" />
                  </h3>
                  <p className="text-xs text-success">Onlayn</p>
                </div>
              </div>
            </div>

            {/* Context Card (Car Info) */}
            {activeRoom.car && (
              <div className="bg-[var(--bg-main)] p-3 border-b border-[var(--border)] flex items-center gap-3 shadow-sm z-10 relative">
                <div className="w-16 h-12 bg-black rounded overflow-hidden shrink-0">
                  <img src={activeRoom.car.media?.[0]?.url || 'https://images.unsplash.com/photo-1550314405-188e6be019aa?auto=format&fit=crop&w=100&q=80'} alt="Car" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-bold mb-0.5">Siz qiziqqan avtomobil</p>
                  <h4 className="font-bold text-sm text-[var(--text-main)] truncate">{activeRoom.car.year} {activeRoom.car.brand} {activeRoom.car.model}</h4>
                </div>
                <div className="text-right shrink-0 hidden sm:block">
                  <div className="font-bold text-primary">{formatCurrency(activeRoom.car.priceUsd, 'USD')}</div>
                </div>
              </div>
            )}

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center bg-[var(--bg-main)] p-6 rounded-2xl border border-[var(--border)] max-w-sm">
                    <ShieldCheck size={40} className="text-primary mx-auto mb-4" />
                    <h4 className="font-bold text-[var(--text-main)] mb-2">Xavfsiz muloqot</h4>
                    <p className="text-sm text-[var(--text-muted)]">Ushbu chat KCI tizimi tomonidan himoyalangan. Dilerga barcha savollaringizni berishingiz mumkin.</p>
                  </div>
                </div>
              ) : (
                messages.map((msg, i) => {
                  const isMine = msg.senderId === userId;
                  return (
                    <div key={i} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                        isMine 
                          ? 'bg-primary text-white rounded-br-sm' 
                          : 'bg-[var(--bg-main)] border border-[var(--border)] text-[var(--text-main)] rounded-bl-sm'
                      }`}>
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                        <div className={`text-[10px] mt-1 text-right flex items-center justify-end gap-1 ${isMine ? 'text-blue-200' : 'text-[var(--text-muted)]'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {isMine && <CheckCircle2 size={12} />}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-[var(--bg-main)] border-t border-[var(--border)]">
              <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                <button type="button" className="p-3 text-[var(--text-muted)] hover:text-primary transition-colors shrink-0">
                  <ImageIcon size={20} />
                </button>
                <div className="flex-1 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden focus-within:border-primary transition-colors">
                  <textarea 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                    placeholder="Xabar yozing..." 
                    className="w-full max-h-32 min-h-[44px] bg-transparent p-3 text-sm focus:outline-none resize-none"
                    rows={1}
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={!newMessage.trim()}
                  className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shrink-0 hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/30"
                >
                  <Send size={18} className="ml-1" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-[var(--text-muted)] p-8">
            <div className="w-24 h-24 bg-[var(--bg-main)] rounded-full flex items-center justify-center mb-6">
              <MessageSquare size={40} className="text-primary/50" />
            </div>
            <h3 className="text-xl font-bold text-[var(--text-main)] mb-2">Chatni boshlash</h3>
            <p className="text-center max-w-sm">Dilerlar bilan yozishmalarni ko'rish uchun chap tomondan mijozni tanlang.</p>
          </div>
        )}

      </div>
    </div>
  );
}
