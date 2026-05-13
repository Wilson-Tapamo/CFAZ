import React from 'react';
import { Trophy } from 'lucide-react';
import { motion } from 'motion/react';

interface Props { data: any; onChange: (field: string, value: any) => void; }

const positionsAvailable = ['Gardien','Défenseur Central','Latéral Droit','Latéral Gauche','Milieu Défensif','Milieu Central','Milieu Offensif','Ailier Droit','Ailier Gauche','Attaquant','Avant-Centre'];

export default function StepSportInfo({ data, onChange }: Props) {
  const positions: string[] = data.positions || [];

  const togglePosition = (pos: string) => {
    if (positions.includes(pos)) {
      onChange('positions', positions.filter(p => p !== pos));
    } else {
      onChange('positions', [...positions, pos]);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.4 }} className="space-y-8">
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <Trophy className="w-7 h-7 text-amber-600 dark:text-amber-400" />
        </div>
        <h2 className="text-2xl font-display font-bold dark:text-white">Parcours Sportif</h2>
        <p className="text-gray-500 text-sm mt-1">Expérience et pratique footballistique</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Catégorie Sportive *</label>
          <div className="flex gap-3">
            {['U13', 'U15', 'U17'].map(c => (
              <button key={c} type="button" onClick={() => onChange('category', c)}
                className={`flex-1 py-3.5 rounded-2xl text-sm font-bold transition-all ${data.category === c ? 'bg-brand-gold text-brand-blue shadow-lg' : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 hover:border-brand-gold'}`}>
                {c}
              </button>
            ))}
          </div>
        </div>
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Club Actuel (si applicable)</label>
          <input type="text" value={data.currentClub || ''} onChange={e => onChange('currentClub', e.target.value)} placeholder="Nom du club" className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl py-3.5 px-4 text-sm dark:text-white focus:border-brand-gold transition-all" />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Années de Pratique</label>
          <input type="number" min="0" max="20" value={data.yearsOfPractice || ''} onChange={e => onChange('yearsOfPractice', e.target.value)} placeholder="Ex: 3" className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl py-3.5 px-4 text-sm dark:text-white focus:border-brand-gold transition-all" />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Autres Sports Pratiqués</label>
          <input type="text" value={data.otherSports || ''} onChange={e => onChange('otherSports', e.target.value)} placeholder="Ex: Athlétisme, Natation" className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl py-3.5 px-4 text-sm dark:text-white focus:border-brand-gold transition-all" />
        </div>
      </div>

      {/* Positions */}
      <div className="space-y-3">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Poste(s) Joué(s) *</label>
        <div className="flex flex-wrap gap-2">
          {positionsAvailable.map(pos => (
            <button key={pos} type="button" onClick={() => togglePosition(pos)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${positions.includes(pos) ? 'bg-brand-gold text-brand-blue shadow-md scale-105' : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 hover:border-brand-gold hover:text-brand-gold'}`}>
              {pos}
            </button>
          ))}
        </div>
        {positions.length > 0 && (
          <p className="text-xs text-brand-gold font-medium">{positions.length} poste(s) sélectionné(s)</p>
        )}
      </div>
    </motion.div>
  );
}
