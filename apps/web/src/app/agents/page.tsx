import Link from 'next/link';
import Image from 'next/image';
import { getAgents } from '@/lib/api/agents';
import { ShieldCheck, MapPin, Building2, UserCircle2, ArrowRight } from 'lucide-react';
import './agents.css';

export const metadata = {
  title: 'KCI Dilerlari va Agentlari',
  description: 'Ishonchli va tasdiqlangan Koreya avtomobil eksport agentlari.',
};

export default async function AgentsPage() {
  let agents = [];
  try {
    agents = await getAgents();
  } catch (error) {
    console.error('Failed to fetch agents:', error);
  }

  return (
    <div className="agents-page">
      <div className="agents-header bg-primary text-white text-center py-12">
        <div className="container">
          <ShieldCheck size={48} className="mx-auto mb-4 text-accent" />
          <h1>Ishonchli Agentlar va Dilerlar</h1>
          <p className="max-w-2xl mx-auto mt-4 text-gray-200">
            KCI platformasidagi barcha agentlar qat'iy tekshiruvdan o'tgan. O'zingizga yoqqan diler orqali avtomobil buyurtma qilishingiz mumkin.
          </p>
        </div>
      </div>

      <div className="container py-12">
        {agents.length === 0 ? (
          <div className="text-center py-12 card bg-gray-50">
            <UserCircle2 size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-400">Hozircha faol agentlar yo'q</h3>
          </div>
        ) : (
          <div className="agents-grid">
            {agents.map((agent: any) => (
              <div key={agent.id} className="agent-card card">
                <div className="agent-card-header">
                  {agent.user?.avatarUrl ? (
                    <Image 
                      src={agent.user.avatarUrl} 
                      alt={agent.companyName || agent.user.name} 
                      width={64} height={64} 
                      className="agent-avatar"
                    />
                  ) : (
                    <div className="agent-avatar-placeholder">
                      <UserCircle2 size={40} />
                    </div>
                  )}
                  <div className="agent-info">
                    <h2 className="agent-name">{agent.companyName || agent.user?.name}</h2>
                    <div className="agent-verified">
                      <ShieldCheck size={14} /> Tasdiqlangan Diler
                    </div>
                  </div>
                </div>

                <div className="agent-details">
                  {agent.address && (
                    <div className="agent-detail-row">
                      <MapPin size={16} className="text-muted" />
                      <span>{agent.address}</span>
                    </div>
                  )}
                  {agent.user?.name && agent.companyName && (
                    <div className="agent-detail-row">
                      <UserCircle2 size={16} className="text-muted" />
                      <span>Vakil: {agent.user.name}</span>
                    </div>
                  )}
                </div>

                <Link href={`/agents/${agent.id}`} className="btn btn-outline w-full agent-link-btn">
                  Batafsil ma'lumot <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
