import React from 'react';
import { BookOpen, Trophy, Bell, User, Star, ChevronRight } from 'lucide-react';

export default function ParentSpace() {
  return (
    <div className="max-w-md mx-auto space-y-6 pb-20 animate-in slide-in-from-bottom duration-500">
      <div className="flex items-center justify-between px-2">
         <div>
            <h2 className="text-xl font-display font-bold dark:text-white">Salut, M. Moukandjo</h2>
            <p className="text-xs text-gray-500">Suivi de Albert (U15)</p>
         </div>
         <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-brand-gold">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Parent" alt="parent" />
         </div>
      </div>

      <div className="bg-brand-blue rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
         <div className="relative z-10">
            <p className="text-[10px] text-blue-100/60 font-bold uppercase tracking-widest mb-1">Dernière performance</p>
            <h3 className="text-2xl font-bold mb-4">Albert élu "Homme du match" 🏆</h3>
            <div className="flex items-center gap-4">
               <div className="bg-white/10 px-3 py-1 rounded-full text-[10px] font-bold">Vitesse: 18km/h</div>
               <div className="bg-white/10 px-3 py-1 rounded-full text-[10px] font-bold">Passes: 92%</div>
            </div>
         </div>
         <Trophy className="absolute top-1/2 right-4 -translate-y-1/2 opacity-10" size={120} />
      </div>

      <div className="grid grid-cols-2 gap-4">
         <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="w-10 h-10 bg-brand-gold/10 text-brand-gold rounded-2xl flex items-center justify-center mb-4">
               <BookOpen size={20} />
            </div>
            <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Moyenne</p>
            <p className="text-xl font-bold dark:text-white">14.8/20</p>
         </div>
         <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="w-10 h-10 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-4">
               <Trophy size={20} />
            </div>
            <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Technique</p>
            <p className="text-xl font-bold dark:text-white">85/100</p>
         </div>
      </div>

      <div className="space-y-3">
         <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">Notifications</h3>
         {[
           { icon: Bell, msg: 'Paiement du T2 confirmé', time: 'Il y a 2h' },
           { icon: Star, msg: 'Nouveau rapport de coach disponible', time: 'Aujourd\'hui' },
         ].map((n, i) => (
           <div key={i} className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 group">
              <div className="w-10 h-10 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-brand-gold transition-colors">
                 <n.icon size={18} />
              </div>
              <div className="flex-1">
                 <p className="text-sm font-medium dark:text-white">{n.msg}</p>
                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{n.time}</p>
              </div>
              <ChevronRight size={16} className="text-gray-300" />
           </div>
         ))}
      </div>
    </div>
  );
}
