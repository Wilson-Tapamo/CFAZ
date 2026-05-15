import React, { useState } from 'react';
import { Plus, Clock, Flame, Save, Loader2, X, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';

const SESSION_TYPES = [
  { value: 'entrainement', label: 'Entraînement', color: 'bg-blue-500' },
  { value: 'match', label: 'Match', color: 'bg-red-500' },
  { value: 'physique', label: 'Physique', color: 'bg-orange-500' },
  { value: 'technique', label: 'Technique', color: 'bg-emerald-500' },
  { value: 'tactique', label: 'Tactique', color: 'bg-purple-500' },
];

const RPE_LABELS: Record<number, { label: string; color: string }> = {
  1: { label: 'Très léger', color: 'bg-green-400' },
  2: { label: 'Léger', color: 'bg-green-500' },
  3: { label: 'Modéré', color: 'bg-lime-500' },
  4: { label: 'Un peu dur', color: 'bg-yellow-400' },
  5: { label: 'Dur', color: 'bg-yellow-500' },
  6: { label: 'Dur+', color: 'bg-orange-400' },
  7: { label: 'Très dur', color: 'bg-orange-500' },
  8: { label: 'Très dur+', color: 'bg-red-400' },
  9: { label: 'Extrême', color: 'bg-red-500' },
  10: { label: 'Maximum', color: 'bg-red-700' },
};

export default function TrainingTab({ enrollments, sessions, onRefresh }: {
  enrollments: any[];
  sessions: any[];
  onRefresh: () => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    enrollmentId: '', studentId: '', date: new Date().toISOString().split('T')[0],
    duration: '90', rpe: 5, type: 'entrainement', notes: '',
  });

  const handleSave = async () => {
    if (!form.enrollmentId || !form.duration) return;
    setSaving(true);
    try {
      await api.training.create({
        enrollmentId: Number(form.enrollmentId),
        studentId: Number(form.studentId),
        date: form.date,
        duration: Number(form.duration),
        rpe: form.rpe,
        type: form.type,
        notes: form.notes,
      });
      setSuccess(true);
      setTimeout(() => { setSuccess(false); setShowForm(false); onRefresh(); }, 1500);
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const selectPlayer = (enrollmentId: string) => {
    const enr = enrollments.find((e: any) => String(e.id) === enrollmentId);
    setForm(f => ({ ...f, enrollmentId, studentId: enr ? String(enr.studentId) : '' }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold dark:text-white">Séances d'Entraînement</h3>
          <p className="text-xs text-gray-400">Charge = Durée × RPE (méthode Foster)</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-5 py-3 bg-brand-gold text-brand-blue rounded-2xl font-bold text-sm shadow-lg hover:shadow-xl transition-all">
          <Plus size={16} /> Nouvelle Séance
        </button>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowForm(false)} className="fixed inset-0 bg-black/40 z-[300]" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-lg bg-white dark:bg-gray-900 rounded-3xl shadow-2xl z-[310] p-6 space-y-6 max-h-[90vh] overflow-y-auto">
              
              {success ? (
                <div className="flex flex-col items-center py-8 gap-3">
                  <CheckCircle2 className="w-16 h-16 text-green-500" />
                  <p className="font-bold dark:text-white">Séance enregistrée !</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold dark:text-white">Saisie Séance</h3>
                    <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"><X size={18} className="text-gray-500" /></button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Joueur</label>
                      <select value={form.enrollmentId} onChange={e => selectPlayer(e.target.value)}
                        className="w-full mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm dark:text-white border-none outline-none">
                        <option value="">Sélectionner un joueur</option>
                        {enrollments.map((e: any) => (
                          <option key={e.id} value={e.id}>{e.student?.fullName} ({e.category})</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</label>
                        <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                          className="w-full mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm dark:text-white border-none outline-none" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Durée (min)</label>
                        <input type="number" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
                          className="w-full mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm dark:text-white border-none outline-none" />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Type de séance</label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {SESSION_TYPES.map(t => (
                          <button key={t.value} onClick={() => setForm(f => ({ ...f, type: t.value }))}
                            className={cn("px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                              form.type === t.value ? "bg-brand-gold text-brand-blue border-brand-gold" : "bg-gray-50 dark:bg-gray-800 text-gray-500 border-gray-100 dark:border-gray-700")}>
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        RPE (Effort Perçu) : <span className="text-brand-gold">{form.rpe}/10 — {RPE_LABELS[form.rpe]?.label}</span>
                      </label>
                      <input type="range" min="1" max="10" value={form.rpe} onChange={e => setForm(f => ({ ...f, rpe: Number(e.target.value) }))}
                        className="w-full mt-2 accent-brand-gold" />
                      <div className="flex justify-between text-[9px] text-gray-400 font-bold mt-1">
                        <span>1 - Repos</span><span>5 - Dur</span><span>10 - Max</span>
                      </div>
                    </div>

                    <div className="p-4 bg-brand-gold/10 rounded-2xl text-center">
                      <p className="text-[10px] font-bold text-brand-gold uppercase tracking-widest">Charge Calculée</p>
                      <p className="text-3xl font-display font-bold text-brand-gold">{Number(form.duration || 0) * form.rpe} <span className="text-sm">UA</span></p>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Notes (optionnel)</label>
                      <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2}
                        className="w-full mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm dark:text-white border-none outline-none resize-none" />
                    </div>
                  </div>

                  <button onClick={handleSave} disabled={saving || !form.enrollmentId}
                    className="w-full py-3 bg-brand-blue dark:bg-brand-gold text-white dark:text-brand-blue rounded-2xl font-bold text-sm shadow-lg disabled:opacity-50 flex items-center justify-center gap-2">
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {saving ? 'Enregistrement...' : 'Enregistrer la séance'}
                  </button>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Sessions List */}
      {sessions.length === 0 ? (
        <div className="p-16 text-center border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-3xl">
          <Clock size={40} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-400 font-medium">Aucune séance enregistrée</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((s: any) => {
            const session = s.session || s;
            const loadVal = session.load || (session.duration * session.rpe);
            const loadColor = loadVal > 700 ? 'text-red-500' : loadVal > 400 ? 'text-orange-500' : 'text-emerald-500';
            return (
              <div key={session.id} className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl hover:border-brand-gold/30 transition-all">
                <div className={cn("w-3 h-3 rounded-full shrink-0", SESSION_TYPES.find(t => t.value === session.type)?.color || 'bg-gray-400')} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold dark:text-white truncate">{s.studentName || 'Joueur'}</p>
                  <p className="text-[10px] text-gray-400">{session.date} • {session.duration}min • RPE {session.rpe}/10</p>
                </div>
                <div className="text-right shrink-0">
                  <p className={cn("text-lg font-display font-bold", loadColor)}>{loadVal}</p>
                  <p className="text-[9px] text-gray-400 uppercase">UA</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
