import React, { useState } from 'react';
import { Wallet, Plus, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FEE_STRUCTURE, formatCFA } from '@/lib/api';

interface PaymentEntry { category: string; amount: number; method: string; note: string; }

interface Props {
  payments: PaymentEntry[];
  onAddPayment: (payment: PaymentEntry) => void;
}

export default function StepFinance({ payments, onAddPayment }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState('inscription');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('especes');
  const [note, setNote] = useState('');

  const getTotalPaid = (cat: string) => payments.filter(p => p.category === cat).reduce((s, p) => s + p.amount, 0);

  const handleAdd = () => {
    if (!amount || Number(amount) <= 0) return;
    onAddPayment({ category, amount: Number(amount), method, note });
    setAmount(''); setNote(''); setShowForm(false);
  };

  const categories = Object.entries(FEE_STRUCTURE) as [string, { label: string; amount: number }][];

  return (
    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.4 }} className="space-y-8">
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-rose-100 dark:bg-rose-900/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <Wallet className="w-7 h-7 text-rose-600 dark:text-rose-400" />
        </div>
        <h2 className="text-2xl font-display font-bold dark:text-white">Finance</h2>
        <p className="text-gray-500 text-sm mt-1">Suivi des versements et frais d'inscription</p>
      </div>

      {/* Fee Summary Cards */}
      <div className="space-y-4">
        {categories.map(([key, fee]) => {
          const paid = getTotalPaid(key);
          const remaining = fee.amount - paid;
          const percent = Math.min((paid / fee.amount) * 100, 100);
          const status = paid >= fee.amount ? 'paye' : paid > 0 ? 'partiel' : 'impaye';

          return (
            <div key={key} className="p-5 bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-bold dark:text-white">{fee.label}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Total: {formatCFA(fee.amount)}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${status === 'paye' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : status === 'partiel' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                  {status === 'paye' ? <CheckCircle2 className="w-3 h-3" /> : status === 'partiel' ? <Clock className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                  {status === 'paye' ? 'Soldé' : status === 'partiel' ? 'En cours' : 'Non payé'}
                </div>
              </div>
              <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${percent}%` }} transition={{ duration: 0.8, ease: 'easeOut' }}
                  className={`h-full rounded-full ${status === 'paye' ? 'bg-green-500' : 'bg-brand-gold'}`} />
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-400">Payé: {formatCFA(paid)}</span>
                <span className="text-xs font-bold text-brand-gold">Reste: {formatCFA(Math.max(remaining, 0))}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Payment history */}
      {payments.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Versements Enregistrés</h3>
          {payments.map((p, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/30 rounded-xl text-sm">
              <div>
                <span className="font-medium dark:text-white">{FEE_STRUCTURE[p.category as keyof typeof FEE_STRUCTURE]?.label}</span>
                <span className="text-gray-400 text-xs ml-2">({p.method})</span>
              </div>
              <span className="font-bold text-green-600">{formatCFA(p.amount)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Add payment */}
      <AnimatePresence>
        {showForm ? (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="p-5 bg-brand-gold/5 dark:bg-brand-gold/10 rounded-2xl border border-brand-gold/20 space-y-4">
            <h3 className="text-sm font-bold dark:text-white">Nouveau Versement</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Catégorie</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl py-3 px-4 text-sm dark:text-white">
                  {categories.map(([k, f]) => <option key={k} value={k}>{f.label}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Montant (FCFA)</label>
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Ex: 200000" className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl py-3 px-4 text-sm dark:text-white" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mode de Paiement</label>
                <select value={method} onChange={e => setMethod(e.target.value)} className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl py-3 px-4 text-sm dark:text-white">
                  <option value="especes">Espèces</option>
                  <option value="virement">Virement Bancaire</option>
                  <option value="mobile_money">Mobile Money</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Note</label>
                <input type="text" value={note} onChange={e => setNote(e.target.value)} placeholder="Optionnel" className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl py-3 px-4 text-sm dark:text-white" />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl text-sm font-bold border border-gray-200 dark:border-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">Annuler</button>
              <button type="button" onClick={handleAdd} className="px-5 py-2.5 bg-brand-gold text-brand-blue rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition-all">Enregistrer le Versement</button>
            </div>
          </motion.div>
        ) : (
          <motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowForm(true)}
            className="w-full p-4 border-2 border-dashed border-brand-gold/30 rounded-2xl flex items-center justify-center gap-3 text-brand-gold font-bold text-sm hover:border-brand-gold hover:bg-brand-gold/5 transition-all">
            <Plus className="w-5 h-5" /> Ajouter un Versement (Avance)
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
