import React from 'react';
import { BookOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { getCurrentAcademicYear } from '@/lib/api';

interface Props { data: any; onChange: (field: string, value: any) => void; }

export default function StepSchoolInfo({ data, onChange }: Props) {
  return (
    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.4 }} className="space-y-8">
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <BookOpen className="w-7 h-7 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-2xl font-display font-bold dark:text-white">Parcours Scolaire</h2>
        <p className="text-gray-500 text-sm mt-1">Informations sur la scolarité de l'élève</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Établissement Scolaire *</label>
          <input type="text" value={data.school || ''} onChange={e => onChange('school', e.target.value)} placeholder="Nom de l'école ou du lycée" className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl py-3.5 px-4 text-sm dark:text-white focus:border-brand-gold transition-all" />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Classe *</label>
          <select value={data.classLevel || ''} onChange={e => onChange('classLevel', e.target.value)} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl py-3.5 px-4 text-sm dark:text-white focus:border-brand-gold transition-all">
            <option value="">Sélectionner</option>
            {['6ème','5ème','4ème','3ème','2nde','1ère','Tle','CM2','CM1'].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Année Scolaire *</label>
          <input type="text" value={data.academicYearSchool || getCurrentAcademicYear()} onChange={e => onChange('academicYearSchool', e.target.value)} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl py-3.5 px-4 text-sm dark:text-white focus:border-brand-gold transition-all" />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Moyenne Générale (/20)</label>
          <input type="number" min="0" max="20" step="0.1" value={data.averageGrade || ''} onChange={e => onChange('averageGrade', e.target.value)} placeholder="Ex: 14.5" className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl py-3.5 px-4 text-sm dark:text-white focus:border-brand-gold transition-all" />
        </div>
      </div>

      <div className="p-5 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800/30">
        <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">💡 Les résultats scolaires sont importants car l'académie exige un suivi académique de qualité parallèlement à la formation sportive.</p>
      </div>
    </motion.div>
  );
}
