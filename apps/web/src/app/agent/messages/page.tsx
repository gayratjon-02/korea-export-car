'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Send, Image as ImageIcon, Car, User, Clock, CheckCircle2, ArrowRight, MessageSquare } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { getRooms, getRoomMessages } from '@/lib/api/chat';
import { formatCurrency } from '@kci/utils';
import '../agent.css';

export default function AgentMessages() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [activeRoom, setActiveRoom] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUser(user);
      
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
      const wsUrl = API_URL.replace('/api/v1', '');
      
      const newSocket = io(`${wsUrl}/chat`, {
        query: { userId: user.id },
      });
      
      newSocket.on('connect', () => console.log('Connected to chat'));
      
      newSocket.on('newMessage', (msg: any) => {
        setMessages((prev) => {
          if (!prev.find(m => m.id === msg.id)) {
            return [...prev, msg];
          }
          return prev;
        });
        
        // Update last message in rooms list
        setRooms(prevRooms => prevRooms.map(room => {
          if (room.id === msg.roomId) {
            return { ...room, messages: [msg] };
          }
          return room;
        }));
      });

      setSocket(newSocket);
      fetchRooms();

      return () => {
        newSocket.close();
      };
    }
  }, []);

  const fetchRooms = async () => {
    try {
      setLoadingRooms(true);
      const data = await getRooms();
      setRooms(data);
      if (data.length > 0) {
        handleSelectRoom(data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRooms(false);
    }
  };

  const handleSelectRoom = async (room: any) => {
    setActiveRoom(room);
    if (socket) {
      socket.emit('joinRoom', { roomId: room.id });
    }
    
    try {
      setLoadingMessages(true);
      const msgs = await getRoomMessages(room.id, 1, 50);
      setMessages(msgs.reverse()); // Reverse to show oldest at top, newest at bottom
      scrollToBottom();
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeRoom || !socket || !currentUser) return;

    socket.emit('sendMessage', {
      roomId: activeRoom.id,
      senderId: currentUser.id,
      content: inputMessage,
      type: 'TEXT'
    });

    setInputMessage('');
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="animate-fade-in h-[calc(100vh-140px)] min-h-[600px] flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-[var(--text-main)] mb-1">Xabarlar</h1>
        <p className="text-[var(--text-muted)]">Mijozlar bilan yozishmalar va so'rovlar.</p>
      </div>

      <div className="premium-card flex-1 flex overflow-hidden">
        {/* Rooms List (Sidebar) */}
        <div className={`w-full md:w-80 border-r border-[var(--border)] flex flex-col bg-[var(--bg-card)] shrink-0 ${activeRoom ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-[var(--border)]">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-[var(--text-muted)]" size={18} />
              <input 
                type="text" 
                placeholder="Mijozni qidirish..." 
                className="form-input pl-10 text-sm bg-[var(--bg-main)]"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {loadingRooms ? (
              <div className="p-8 text-center text-muted">
                <span className="loader-sm mb-2"></span>
                <p className="text-xs">Yuklanmoqda...</p>
              </div>
            ) : rooms.length === 0 ? (
              <div className="p-8 text-center text-muted">
                <p className="text-sm">Hozircha xabarlar yo'q</p>
              </div>
            ) : (
              rooms.map((room) => {
                const customer = room.user;
                const car = room.car;
                const lastMsg = room.messages?.[0];
                const isActive = activeRoom?.id === room.id;
                
                return (
                  <div 
                    key={room.id}
                    onClick={() => handleSelectRoom(room)}
                    className={`p-4 border-b border-[var(--border)] cursor-pointer transition-colors hover:bg-[var(--bg-main)] ${isActive ? 'bg-[var(--bg-main)] border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'}`}
                  >
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 overflow-hidden">
                        {customer?.avatarUrl ? (
                          <img src={customer.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <User size={18} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-[var(--text-main)] text-sm truncate">{customer?.name || 'Mijoz'}</h4>
                          {lastMsg && (
                            <span className="text-[10px] text-[var(--text-muted)] whitespace-nowrap ml-2">
                              {formatTime(lastMsg.createdAt)}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-[var(--text-muted)] truncate font-medium text-primary mb-1">
                          🚗 {car?.brand} {car?.model}
                        </div>
                        <p className="text-xs text-[var(--text-muted)] truncate">
                          {lastMsg ? lastMsg.content : 'Chat boshlandi'}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col bg-[var(--bg-main)] relative ${activeRoom ? 'flex' : 'hidden md:flex'}`}>
          {activeRoom ? (
            <>
              {/* Chat Header */}
              <div className="h-16 px-4 md:px-6 border-b border-[var(--border)] flex justify-between items-center bg-[var(--bg-card)] shrink-0">
                <div className="flex items-center gap-3">
                  <button 
                    className="md:hidden p-2 -ml-2 text-[var(--text-muted)]"
                    onClick={() => setActiveRoom(null)}
                  >
                    <ArrowRight className="rotate-180" size={20} />
                  </button>
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary overflow-hidden hidden sm:flex">
                    {activeRoom.user?.avatarUrl ? (
                      <img src={activeRoom.user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User size={18} />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--text-main)] truncate max-w-[150px]">{activeRoom.user?.name || 'Mijoz'}</h3>
                    <div className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-success"></span> Onlayn
                    </div>
                  </div>
                </div>
                
                <button className="text-primary text-xs md:text-sm font-bold flex items-center gap-1 md:gap-2 hover:underline bg-primary/10 px-3 py-1.5 rounded-full">
                  <Car size={16} /> <span className="hidden sm:inline">Mashina</span>
                </button>
              </div>

              {/* Messages List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {/* Context Card inside Chat */}
                <div className="max-w-sm mx-auto bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-3 mb-6 flex gap-3 shadow-sm">
                  <div className="w-16 h-12 rounded bg-black overflow-hidden shrink-0">
                    {activeRoom.car?.media?.[0] ? (
                       <img src={activeRoom.car.media[0].url} className="w-full h-full object-cover opacity-80" />
                    ) : <div className="w-full h-full flex items-center justify-center"><Car size={14} className="text-gray-500" /></div>}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[var(--text-main)]">{activeRoom.car?.brand} {activeRoom.car?.model}</h4>
                    <p className="text-xs text-[var(--text-muted)]">{activeRoom.car?.year} yil</p>
                  </div>
                </div>

                {loadingMessages ? (
                  <div className="text-center py-10 text-muted"><span className="loader-sm"></span></div>
                ) : (
                  messages.map((msg, idx) => {
                    const isMe = msg.senderId === currentUser?.id;
                    return (
                      <div key={msg.id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${isMe ? 'bg-primary text-white rounded-br-sm' : 'bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-main)] rounded-bl-sm'}`}>
                          <p className="text-sm">{msg.content}</p>
                          <div className={`text-[10px] mt-1 text-right flex items-center justify-end gap-1 ${isMe ? 'text-white/70' : 'text-[var(--text-muted)]'}`}>
                            {formatTime(msg.createdAt)}
                            {isMe && <CheckCircle2 size={10} />}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-[var(--bg-card)] border-t border-[var(--border)] shrink-0">
                <form onSubmit={handleSendMessage} className="flex gap-3">
                  <button type="button" className="w-12 h-12 rounded-xl flex items-center justify-center text-[var(--text-muted)] bg-[var(--bg-main)] hover:text-primary hover:bg-primary/10 transition-colors shrink-0">
                    <ImageIcon size={20} />
                  </button>
                  <input 
                    type="text" 
                    value={inputMessage}
                    onChange={e => setInputMessage(e.target.value)}
                    placeholder="Xabar yozish..." 
                    className="flex-1 form-input bg-[var(--bg-main)] border-transparent focus:bg-[var(--bg-card)] rounded-xl"
                  />
                  <button 
                    type="submit" 
                    disabled={!inputMessage.trim()}
                    className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary text-white hover:-translate-y-0.5 transition-transform disabled:opacity-50 disabled:hover:translate-y-0 shrink-0 shadow-lg shadow-primary/30"
                  >
                    <Send size={18} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted flex-col">
              <MessageSquare size={48} className="opacity-20 mb-4" />
              <p>Chatni boshlash uchun mijozni tanlang</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
