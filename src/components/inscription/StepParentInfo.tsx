import React from 'react';
import { Users, Phone, Mail, Briefcase, Shield } from 'lucide-react';
import { motion } from 'motion/react';

interface Props { data: any; onChange: (field: string, value: any) => void; }

export default function StepParentInfo({ data, onChange }: Props) {
  return (
    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.4 }} className="space-y-8">
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <Users className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h2 className="text-2xl font-display font-bold dark:text-white">Parent / Tuteur</h2>
        <p className="text-gray-500 text-sm mt-1">Informations du responsable légal</p>
      </div>

      {/* Relation type */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Relation *</label>
        <div className="flex gap-3">
          {[{v:'pere',l:'Père'},{v:'mere',l:'Mère'},{v:'tuteur',l:'Tuteur'}].map(r => (
            <button key={r.v} type="button" onClick={() => onChange('parentRelation', r.v)}
              className={`flex-1 py-3.5 rounded-2xl text-sm font-bold transition-all ${data.parentRelation === r.v ? 'bg-brand-gold text-brand-blue shadow-lg' : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 hover:border-brand-gold'}`}>
              {r.l}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nom Complet du Parent/Tuteur *</label>
          <input type="text" value={data.parentName || ''} onChange={e => onChange('parentName', e.target.value)} placeholder="Ex: M. Samuel Moukandjo" className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl py-3.5 px-4 text-sm dark:text-white focus:border-brand-gold transition-all" />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Profession</label>
          <input type="text" value={data.parentProfession || ''} onChange={e => onChange('parentProfession', e.target.value)} placeholder="Ex: Ingénieur" className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl py-3.5 px-4 text-sm dark:text-white focus:border-brand-gold transition-all" />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Téléphone *</label>
          <input type="tel" value={data.parentPhone || ''} onChange={e => onChange('parentPhone', e.target.value)} placeholder="+237 6XX XX XX XX" className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl py-3.5 px-4 text-sm dark:text-white focus:border-brand-gold transition-all" />
        </div>
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email</label>
          <input type="email" value={data.parentEmail || ''} onChange={e => onChange('parentEmail', e.target.value)} placeholder="parent@email.com" className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl py-3.5 px-4 text-sm dark:text-white focus:border-brand-gold transition-all" />
        </div>
      </div>

      {/* Emergency contact */}
      <div className="p-6 bg-orange-50 dark:bg-orange-900/10 rounded-3xl border border-orange-100 dark:border-orange-800/30">
        <div className="flex items-center gap-3 mb-5">
          <Shield className="w-5 h-5 text-orange-500" />
          <h3 className="text-sm font-bold text-orange-700 dark:text-orange-400 uppercase tracking-wider">Personne à Contacter en Urgence</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nom Complet</label>
            <input type="text" value={data.emergencyContactName || ''} onChange={e => onChange('emergencyContactName', e.target.value)} placeholder="Nom de la personne" className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl py-3.5 px-4 text-sm dark:text-white focus:border-brand-gold transition-all" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Téléphone</label>
            <input type="tel" value={data.emergencyContactPhone || ''} onChange={e => onChange('emergencyContactPhone', e.target.value)} placeholder="+237 6XX XX XX XX" className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl py-3.5 px-4 text-sm dark:text-white focus:border-brand-gold transition-all" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
