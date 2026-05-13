import React, { useState } from 'react';
import {
  Search, Filter, Plus, MoreHorizontal, Download, CheckCircle2, Clock, AlertCircle, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import InscriptionWizard from '@/components/inscription/InscriptionWizard';

const candidates = [
  { id: 'C001', name: 'Moussa Diallo', age: 14, category: 'U15', date: '12/05/2026', status: 'complet' },
  { id: 'C002', name: 'Samuel Ndongo', age: 12, category: 'U13', date: '11/05/2026', status: 'incomplet' },
  { id: 'C003', name: 'Marc Atangana', age: 16, category: 'U17', date: '10/05/2026', status: 'en_attente' },
  { id: 'C004', name: 'Alain Biyik', age: 15, category: 'U15', date: '08/05/2026', status: 'complet' },
  { id: 'C005', name: 'Kevin Song', age: 13, category: 'U15', date: '05/05/2026', status: 'complet' },
];

const StatusBadge = ({ status }: { status: string }) => {
  const config: any = {
    complet: { label: 'Complet', classes: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle2 },
    incomplet: { label: 'Incomplet', classes: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: AlertCircle },
    en_attente: { label: 'En attente', classes: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', icon: Clock },
  };
  const { label, classes, icon: Icon } = config[status] || config.en_attente;
  return (
    <div className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", classes)}>
      <Icon size={12} /> {label}
    </div>
  );
};

export default function Inscriptions() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold dark:text-white">Inscriptions</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Gérez les nouveaux candidats et les dossiers d'inscription.</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowForm(true)}
          className="bg-brand-blue text-white dark:bg-brand-gold dark:text-brand-blue font-bold px-6 py-3 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2">
          <Plus size={20} /> Nouvelle Inscription
        </motion.button>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-2 flex-1 max-w-md">
            <Search size={18} className="text-gray-400" />
            <input type="text" placeholder="Rechercher un candidat..." className="bg-transparent border-none focus:ring-0 text-sm w-full dark:text-white" />
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-white transition-all">
              <Filter size={16} /> Filtres
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-white transition-all">
              <Download size={16} /> Exporter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-800/50">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">ID</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Candidat</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Âge</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Catégorie</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Statut</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {candidates.map((c, i) => (
                <motion.tr key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono text-gray-400">{c.id}</td>
                  <td className="px-6 py-4 text-sm font-semibold dark:text-white">{c.name}</td>
                  <td className="px-6 py-4 text-sm font-medium dark:text-gray-300">{c.age} ans</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 bg-brand-gold/10 text-brand-gold text-[10px] font-bold rounded uppercase tracking-wider">{c.category}</span></td>
                  <td className="px-6 py-4 text-sm text-gray-500">{c.date}</td>
                  <td className="px-6 py-4"><StatusBadge status={c.status} /></td>
                  <td className="px-6 py-4">
                    <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <MoreHorizontal size={16} className="text-gray-400" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inscription Wizard Modal */}
      <AnimatePresence>
        {showForm && (
          <InscriptionWizard onClose={() => setShowForm(false)} onSuccess={() => { /* refresh list */ }} />
        )}
      </AnimatePresence>
    </div>
  );
}
