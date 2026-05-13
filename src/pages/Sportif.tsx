import React from 'react';
import { Trophy, Star, TrendingUp, Users, Search, PlayCircle } from 'lucide-react';

const categories = [
  { name: 'U13', coach: 'Zambo', students: 24, status: 'Entraînement' },
  { name: 'U15', coach: 'Milla', students: 32, status: 'Compétition' },
  { name: 'U17', coach: 'Eto\'o', students: 28, status: 'Récupération' },
  { name: 'Seniors', coach: 'Song', students: 25, status: 'Entraînement' },
];

export default function Sportif() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold dark:text-white">Suivi Sportif</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Évaluation des performances physiques et techniques.</p>
        </div>
        <button className="bg-brand-gold text-brand-blue font-bold px-6 py-3 rounded-2xl shadow-lg shadow-brand-gold/20 flex items-center gap-2 active:scale-95">
           <Star size={18} />
           Saisie Évaluations
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
         {categories.map((cat, i) => (
           <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-[24px] border border-gray-100 dark:border-gray-800 shadow-sm group hover:border-brand-gold transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                 <div className="w-12 h-12 bg-brand-blue text-white rounded-2xl flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                    {cat.name}
                 </div>
                 <div className="text-[10px] font-bold px-2 py-1 bg-green-100 text-green-700 rounded-full uppercase tracking-widest">{cat.status}</div>
              </div>
              <h3 className="text-sm font-bold dark:text-white">Coach {cat.coach}</h3>
              <p className="text-xs text-gray-500 mt-1">{cat.students} Joueurs actifs</p>
              
              <div className="mt-6 pt-6 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
                 <div className="flex -space-x-2">
                    {[1,2,3].map(j => (
                      <div key={j} className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-900 bg-gray-200 overflow-hidden">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${cat.name}${j}`} alt="avatar" />
                      </div>
                    ))}
                    <div className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-900 bg-brand-gold flex items-center justify-center text-[10px] font-bold text-brand-blue">+{cat.students - 3}</div>
                 </div>
                 <button className="text-brand-gold p-2 hover:bg-brand-gold/10 rounded-lg transition-colors">
                    <TrendingUp size={20} />
                 </button>
              </div>
           </div>
         ))}
      </div>

      <div className="bg-brand-blue rounded-[32px] p-8 lg:p-12 relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 flex items-center justify-center pointer-events-none">
             <Trophy size={400} />
          </div>
          <div className="relative z-10 max-w-xl">
             <h3 className="text-3xl font-display font-bold mb-4">Analyse de Performance Vidéo</h3>
             <p className="text-blue-100/60 mb-8">Comparez les mouvements techniques de vos joueurs avec les standards professionnels pour une progression accélérée.</p>
             <button className="bg-brand-gold text-brand-blue font-bold px-8 py-4 rounded-2xl flex items-center gap-3 hover:scale-105 transition-transform shadow-xl shadow-brand-gold/20">
                <PlayCircle size={24} />
                Lancer l'Analyseur
             </button>
          </div>
      </div>
    </div>
  );
}
