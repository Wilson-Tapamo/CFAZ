import React from 'react';
import { Wallet, TrendingUp, TrendingDown, Clock, CheckCircle2, Download, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

const transactions = [
  { id: 'T001', type: 'revenu', label: 'Pension Samuel Ndongo', date: 'Hier', amount: '150.000 FCFA', status: 'confirmé' },
  { id: 'T002', type: 'depense', label: 'Achat Ballons Select (10)', date: 'Hier', amount: '85.000 FCFA', status: 'validé' },
  { id: 'T003', type: 'revenu', label: 'Pension Albert Moukandjo', date: 'Il y a 2 jours', amount: '225.000 FCFA', status: 'confirmé' },
  { id: 'T004', type: 'depense', label: 'Frais de transport match U17', date: 'Il y a 3 jours', amount: '25.000 FCFA', status: 'confirmé' },
];

export default function Finances() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold dark:text-white">Finances</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Suivi budgétaire, paiements et dépenses de fonctionnement.</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-3 rounded-xl transition-all shadow-sm">
              <Download size={20} className="text-gray-400" />
           </button>
           <button className="bg-brand-blue text-white font-bold px-6 py-3 rounded-2xl flex items-center gap-2 active:scale-95 shadow-lg shadow-brand-blue/10">
              <Plus size={20} />
              Nouvelle Transaction
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="bg-white dark:bg-gray-900 p-8 rounded-[24px] border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="w-12 h-12 bg-green-100 text-green-700 rounded-2xl flex items-center justify-center mb-6">
               <TrendingUp size={24} />
            </div>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Total Revenus (Mai)</p>
            <p className="text-3xl font-bold dark:text-white mb-2">1.250.000 <span className="text-sm font-medium opacity-60">FCFA</span></p>
            <div className="flex items-center gap-2 text-green-500 text-xs font-bold bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded w-fit uppercase">
               <TrendingUp size={12} /> +12% vs Avril
            </div>
         </div>

         <div className="bg-white dark:bg-gray-900 p-8 rounded-[24px] border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="w-12 h-12 bg-red-100 text-red-700 rounded-2xl flex items-center justify-center mb-6">
               <TrendingDown size={24} />
            </div>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Total Dépenses (Mai)</p>
            <p className="text-3xl font-bold dark:text-white mb-2">480.000 <span className="text-sm font-medium opacity-60">FCFA</span></p>
            <div className="flex items-center gap-2 text-red-500 text-xs font-bold bg-red-50 dark:bg-red-500/10 px-2 py-1 rounded w-fit uppercase">
               <TrendingDown size={12} /> +2% vs Avril
            </div>
         </div>

         <div className="bg-brand-gold p-8 rounded-[24px] shadow-lg shadow-brand-gold/20 flex flex-col justify-center">
            <p className="text-[10px] text-brand-blue/60 font-bold uppercase tracking-widest mb-1">Solde de Caisse</p>
            <p className="text-3xl font-bold text-brand-blue mb-4">770.000 <span className="text-sm font-medium opacity-60">FCFA</span></p>
            <div className="w-full h-1.5 bg-brand-blue/10 rounded-full overflow-hidden">
               <div className="w-[62%] h-full bg-brand-blue"></div>
            </div>
            <p className="text-[10px] text-brand-blue/60 mt-2 font-bold uppercase tracking-widest">62% Objectif atteint</p>
         </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-[28px] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
         <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <h3 className="text-lg font-bold dark:text-white">Dernières Transactions</h3>
            <button className="text-[10px] font-bold text-brand-gold uppercase underline">Voir l'historique complet</button>
         </div>
         <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {transactions.map((t) => (
              <div key={t.id} className="p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                 <div className="flex items-center gap-6">
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0",
                      t.type === 'revenu' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    )}>
                       {t.type === 'revenu' ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                    </div>
                    <div>
                       <p className="font-bold dark:text-white">{t.label}</p>
                       <div className="flex items-center gap-3 mt-1.5">
                          <div className="flex items-center gap-1 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                             <Clock size={12} /> {t.date}
                          </div>
                          <div className="w-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                          <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                             ID: {t.id}
                          </div>
                       </div>
                    </div>
                 </div>
                 <div className="flex items-center justify-between sm:justify-end gap-12 w-full sm:w-auto">
                    <div className="text-right">
                       <p className={cn("text-xl font-bold tabular-nums", t.type === 'revenu' ? "text-green-600 dark:text-green-400" : "dark:text-white")}>
                          {t.type === 'depense' ? '-' : '+'}{t.amount}
                       </p>
                    </div>
                    <div className={cn(
                      "px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2",
                      t.status === 'confirmé' ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"
                    )}>
                       <CheckCircle2 size={12} /> {t.status}
                    </div>
                 </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
}
