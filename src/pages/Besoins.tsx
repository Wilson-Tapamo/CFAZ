import React from 'react';
import { ShoppingCart, Package, Clock, CheckCircle2, XCircle, ChevronRight, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

const requisitions = [
  { id: 'REQ-01', item: '10 Ballons Select Numero 5', requestedBy: 'Coach Zambo', date: '12 Mai 2026', status: 'en_attente', urgent: true },
  { id: 'REQ-02', item: 'Table de massage fixe', requestedBy: 'Dr. Kameni (Kiné)', date: '10 Mai 2026', status: 'validé', urgent: false },
  { id: 'REQ-03', item: 'Renouvellement stocks Ibuprofène', requestedBy: 'Infirmerie', date: '08 Mai 2026', status: 'rejeté', urgent: false },
  { id: 'REQ-04', item: '20 Garnitures de poteaux', requestedBy: 'Logistique', date: '05 Mai 2026', status: 'en_attente', urgent: false },
];

const StatusLabel = ({ status }: { status: string }) => {
  const config: any = {
    en_attente: { label: 'En attente', color: 'text-yellow-600 bg-yellow-100', icon: Clock },
    validé: { label: 'Validé', color: 'text-green-600 bg-green-100', icon: CheckCircle2 },
    rejeté: { label: 'Rejeté', color: 'text-red-600 bg-red-100', icon: XCircle },
  };
  const { label, color, icon: Icon } = config[status];
  return (
    <div className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5", color)}>
       <Icon size={12} />
       {label}
    </div>
  );
};

export default function Besoins() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold dark:text-white">Besoins & Logistique</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Gérez les demandes de matériel et les besoins opérationnels.</p>
        </div>
        <button className="bg-brand-blue text-white font-bold px-6 py-3 rounded-2xl flex items-center gap-2 active:scale-95 shadow-lg">
           Soumettre un besoin
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         {/* Categories */}
         <div className="lg:col-span-1 space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">Catégories</h3>
            <div className="space-y-2">
               {[
                 { label: 'Matériel Sportif', count: 12, icon: Package, active: true },
                 { label: 'Médical', count: 5, icon: Clock, active: false },
                 { label: 'Alimentation', count: 3, icon: ShoppingCart, active: false },
                 { label: 'Maintenance', count: 8, icon: Filter, active: false },
               ].map((cat, i) => (
                 <div key={i} className={cn(
                    "flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all border",
                    cat.active ? "bg-brand-gold/10 border-brand-gold text-brand-gold" : "bg-white dark:bg-gray-900 border-transparent text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"
                 )}>
                    <div className="flex items-center gap-3">
                       <cat.icon size={18} />
                       <span className="text-sm font-semibold">{cat.label}</span>
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/50 dark:bg-black/20">{cat.count}</span>
                 </div>
               ))}
            </div>
         </div>

         {/* Requests List */}
         <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between mb-4">
               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">Demandes récentes</h3>
               <button className="flex items-center gap-2 text-xs font-bold text-brand-gold"><Filter size={14} /> Filtrer par statut</button>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
               {requisitions.map((req) => (
                 <div key={req.id} className="bg-white dark:bg-gray-900 rounded-[24px] border border-gray-100 dark:border-gray-800 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:shadow-lg transition-all group">
                    <div className="flex items-center gap-6">
                       <div className="w-14 h-14 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-gray-400 shrink-0 group-hover:text-brand-gold transition-colors">
                          <Package size={24} />
                       </div>
                       <div>
                          <div className="flex items-center gap-3 mb-1">
                             <h4 className="font-bold dark:text-white">{req.item}</h4>
                             {req.urgent && <span className="px-2 py-0.5 bg-red-500 text-white text-[8px] font-bold uppercase rounded-full">Urgent</span>}
                          </div>
                          <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
                             <p>Demandé par <span className="font-bold text-gray-700 dark:text-gray-300">{req.requestedBy}</span></p>
                             <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
                             <p>{req.date}</p>
                          </div>
                       </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-8">
                       <StatusLabel status={req.status} />
                       <div className="flex items-center gap-2">
                          {req.status === 'en_attente' && (
                             <>
                                <button className="p-2.5 rounded-xl border border-green-100 text-green-600 hover:bg-green-50 transition-colors"><CheckCircle2 size={18} /></button>
                                <button className="p-2.5 rounded-xl border border-red-100 text-red-600 hover:bg-red-50 transition-colors"><XCircle size={18} /></button>
                             </>
                          )}
                          <button className="p-2.5 rounded-xl border border-gray-100 dark:border-gray-800 text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"><ChevronRight size={18} /></button>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
