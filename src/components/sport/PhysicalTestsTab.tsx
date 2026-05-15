import React, { useState } from 'react';
import { Plus, Activity, Save, Loader2, X, CheckCircle2, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';

const TEST_FIELDS = [
  { key: 'sprint30m', label: 'Sprint 30m', unit: 's', icon: '⚡', lower: true },
  { key: 'yoyoTest', label: 'Yo-Yo Test', unit: 'palier', icon: '🫁', lower: false },
  { key: 'verticalJump', label: 'Détente Verticale', unit: 'cm', icon: '🦘', lower: false },
  { key: 'agility', label: 'Agilité (T-Test)', unit: 's', icon: '🔀', lower: true },
  { key: 'strength', label: 'Force (Squat)', unit: 'kg', icon: '💪', lower: false },
  { key: 'vma', label: 'VMA', unit: 'km/h', icon: '🏃', lower: false },
  { key: 'jonglerie', label: 'Jonglerie', unit: 'max', icon: '⚽', lower: false },
];

export default function PhysicalTestsTab({ enrollments, tests, onRefresh }: {
  enrollments: any[]; tests: any[]; onRefresh: () => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState<any>({
    enrollmentId: '', studentId: '', date: new Date().toISOString().split('T')[0],
    sprint30m: '', yoyoTest: '', verticalJump: '', agility: '', strength: '', vma: '', jonglerie: '', notes: '',
  });

  const handleSave = async () => {
    if (!form.enrollmentId) return;
    setSaving(true);
    try {
      await api.physicalTests.create({
        enrollmentId: Number(form.enrollmentId),
        studentId: Number(form.studentId),
        date: form.date,
        sprint30m: form.sprint30m || null,
        yoyoTest: form.yoyoTest || null,
        verticalJump: form.verticalJump || null,
        agility: form.agility || null,
        strength: form.strength || null,
        vma: form.vma || null,
        jonglerie: form.jonglerie || null,
        notes: form.notes,
      });
      setSuccess(true);
      setTimeout(() => { setSuccess(false); setShowForm(false); onRefresh(); }, 1500);
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const selectPlayer = (enrollmentId: string) => {
    const enr = enrollments.find((e: any) => String(e.id) === enrollmentId);
    setForm((f: any) => ({ ...f, enrollmentId, studentId: enr ? String(enr.studentId) : '' }));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold dark:text-white">Tests Physiques</h3>
          <p className="text-xs text-gray-400">Sprint, endurance, détente, agilité, force</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-5 py-3 bg-brand-gold text-brand-blue rounded-2xl font-bold text-sm shadow-lg">
          <Plus size={16} /> Nouveau Test
        </button>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowForm(false)} className="fixed inset-0 bg-black/40 z-[300]" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-lg bg-white dark:bg-gray-900 rounded-3xl shadow-2xl z-[310] p-6 space-y-5 max-h-[90vh] overflow-y-auto">
              {success ? (
                <div className="flex flex-col items-center py-8 gap-3">
                  <CheckCircle2 className="w-16 h-16 text-green-500" />
                  <p className="font-bold dark:text-white">Test enregistré !</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold dark:text-white">Saisie Test Physique</h3>
                    <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"><X size={18} className="text-gray-500" /></button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Joueur</label>
                      <select value={form.enrollmentId} onChange={e => selectPlayer(e.target.value)}
                        className="w-full mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm dark:text-white border-none outline-none">
                        <option value="">Sélectionner</option>
                        {enrollments.map((e: any) => <option key={e.id} value={e.id}>{e.student?.fullName} ({e.category})</option>)}
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date du test</label>
                      <input type="date" value={form.date} onChange={e => setForm((f: any) => ({ ...f, date: e.target.value }))}
                        className="w-full mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm dark:text-white border-none outline-none" />
                    </div>
                    {TEST_FIELDS.map(tf => (
                      <div key={tf.key}>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{tf.icon} {tf.label} ({tf.unit})</label>
                        <input type="number" step="0.01" value={form[tf.key]} onChange={e => setForm((f: any) => ({ ...f, [tf.key]: e.target.value }))}
                          placeholder="--" className="w-full mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm dark:text-white border-none outline-none" />
                      </div>
                    ))}
                  </div>

                  <button onClick={handleSave} disabled={saving || !form.enrollmentId}
                    className="w-full py-3 bg-brand-blue dark:bg-brand-gold text-white dark:text-brand-blue rounded-2xl font-bold text-sm shadow-lg disabled:opacity-50 flex items-center justify-center gap-2">
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {saving ? 'Enregistrement...' : 'Enregistrer le test'}
                  </button>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Tests History */}
      {tests.length === 0 ? (
        <div className="p-16 text-center border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-3xl">
          <Activity size={40} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-400 font-medium">Aucun test physique enregistré</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tests.map((t: any) => {
            const test = t.test || t;
            return (
              <div key={test.id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 hover:border-brand-gold/30 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-bold dark:text-white">{t.studentName || 'Joueur'}</p>
                    <p className="text-[10px] text-gray-400">{test.date} • {t.category}</p>
                  </div>
                  <TrendingUp size={16} className="text-brand-gold" />
                </div>
                <div className="grid grid-cols-4 lg:grid-cols-7 gap-3">
                  {TEST_FIELDS.map(tf => {
                    const val = test[tf.key];
                    if (!val && val !== 0) return <div key={tf.key} className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded-xl opacity-30"><p className="text-[9px] text-gray-400">{tf.icon}</p><p className="text-xs font-bold dark:text-white">--</p></div>;
                    return (
                      <div key={tf.key} className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <p className="text-[9px] text-gray-400">{tf.icon} {tf.label.split(' ')[0]}</p>
                        <p className="text-sm font-bold text-brand-gold">{val}</p>
                        <p className="text-[8px] text-gray-400">{tf.unit}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
