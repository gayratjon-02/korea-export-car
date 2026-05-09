import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getAgentById } from '@/lib/api/agents';
import { getCars } from '@/lib/api/cars';
import CarCard from '@/components/cars/CarCard';
import StartChatButton from '@/components/chat/StartChatButton';
import { ShieldCheck, MapPin, Building2, UserCircle2, MessageSquare, Phone } from 'lucide-react';
import '../agents.css';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const agent = await getAgentById(params.id);
    return {
      title: `${agent.companyName || agent.user?.name} | KCI Diler`,
    };
  } catch (e) {
    return { title: 'Agent topilmadi' };
  }
}

export default async function AgentProfilePage({ params }: Props) {
  let agent;
  let cars = [];
  
  try {
    agent = await getAgentById(params.id);
    const res = await getCars({ agentId: params.id, limit: 20 });
    cars = res.items;
  } catch (error) {
    notFound();
  }

  return (
    <div className="agent-profile-page">
      <div className="container py-8">
        <div className="agent-profile-header card">
          <div className="profile-top">
            {agent.user?.avatarUrl ? (
              <Image 
                src={agent.user.avatarUrl} 
                alt={agent.companyName || agent.user.name} 
                width={100} height={100} 
                className="profile-avatar"
              />
            ) : (
              <div className="profile-avatar-placeholder">
                <Building2 size={48} />
              </div>
            )}
            
            <div className="profile-info">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="profile-name">{agent.companyName || agent.user?.name}</h1>
                <span className="badge-verified bg-blue-100 text-primary px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                  <ShieldCheck size={14} /> Tasdiqlangan
                </span>
              </div>
              <p className="profile-rep text-gray-500 mb-4">
                Vakil: {agent.user?.name} • A'zo bo'lgan vaqti: {new Date(agent.createdAt).getFullYear()}
              </p>

              <div className="profile-stats flex gap-6">
                <div className="stat">
                  <span className="stat-value">{cars.length}</span>
                  <span className="stat-label">Sotuvdagi mashinalar</span>
                </div>
              </div>
            </div>

            <div className="profile-actions">
              <StartChatButton agentId={agent.id} />
              {agent.user?.phone && (
                <a href={`tel:${agent.user.phone}`} className="btn btn-outline w-full flex items-center justify-center gap-2">
                  <Phone size={18} /> Qo'ng'iroq qilish
                </a>
              )}
            </div>
          </div>

          {agent.address && (
            <div className="profile-bottom border-t border-gray-100 mt-6 pt-6">
              <div className="flex items-start gap-2 text-gray-600">
                <MapPin size={20} className="text-primary shrink-0" />
                <span><strong>Manzil:</strong> {agent.address}</span>
              </div>
            </div>
          )}
        </div>

        <div className="agent-cars-section mt-12">
          <h2 className="text-2xl font-bold mb-6">Agent mashinalari</h2>
          
          {cars.length === 0 ? (
            <div className="text-center py-12 card bg-gray-50">
              <p className="text-gray-500">Bu agent hozircha mashina yuklamagan.</p>
            </div>
          ) : (
            <div className="cars-grid">
              {cars.map((car: any) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
