import React, { useState } from 'react';
import { Plus, Save, Loader2, X, CheckCircle2, AlertTriangle, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';

const INJURY_TYPES = ['muscle', 'choc', 'ligament', 'fracture', 'tendinite', 'entorse'];
const ZONES = ['cuisse', 'genou', 'cheville', 'pied', 'mollet', 'hanche', 'épaule', 'dos', 'tête'];
const SEVERITIES = [
  { value: 'legere', label: 'Légère', color: 'bg-yellow-100 text-yellow-700', days: '1-7 jours' },
  { value: 'moderee', label: 'Modérée', color: 'bg-orange-100 text-orange-700', days: '7-28 jours' },
  { value: 'grave', label: 'Grave', color: 'bg-red-100 text-red-700', days: '28+ jours' },
];

export default function InjuriesTab({ enrollments, injuriesList, onRefresh }: {
  enrollments: any[]; injuriesList: any[]; onRefresh: () => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    enrollmentId: '', studentId: '', type: 'muscle', zone: 'cuisse',
    severity: 'legere', dateInjury: new Date().toISOString().split('T')[0],
    dateReturn: '', treatment: '', notes: '',
  });

  const handleSave = async () => {
    if (!form.enrollmentId) return;
    setSaving(true);
    try {
      await api.injuries.create({
        enrollmentId: Number(form.enrollmentId),
        studentId: Number(form.studentId),
        type: form.type, zone: form.zone, severity: form.severity,
        dateInjury: form.dateInjury,
        dateReturn: form.dateReturn || null,
        treatment: form.treatment, notes: form.notes,
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

  const active = injuriesList.filter((i: any) => !(i.injury || i).dateReturn);
  const recovered = injuriesList.filter((i: any) => (i.injury || i).dateReturn);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold dark:text-white">Gestion des Blessures</h3>
          <p className="text-xs text-gray-400">{active.length} blessure(s) active(s)</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-5 py-3 bg-red-500 text-white rounded-2xl font-bold text-sm shadow-lg">
          <Plus size={16} /> Déclarer Blessure
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
                  <p className="font-bold dark:text-white">Blessure enregistrée</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold dark:text-white">Déclarer une Blessure</h3>
                    <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"><X size={18} className="text-gray-500" /></button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Joueur</label>
                      <select value={form.enrollmentId} onChange={e => selectPlayer(e.target.value)}
                        className="w-full mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm dark:text-white border-none outline-none">
                        <option value="">Sélectionner</option>
                        {enrollments.map((e: any) => <option key={e.id} value={e.id}>{e.student?.fullName} ({e.category})</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Type</label>
                        <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                          className="w-full mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm dark:text-white border-none outline-none capitalize">
                          {INJURY_TYPES.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Zone</label>
                        <select value={form.zone} onChange={e => setForm(f => ({ ...f, zone: e.target.value }))}
                          className="w-full mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm dark:text-white border-none outline-none capitalize">
                          {ZONES.map(z => <option key={z} value={z} className="capitalize">{z}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Gravité</label>
                      <div className="flex gap-2 mt-2">
                        {SEVERITIES.map(s => (
                          <button key={s.value} onClick={() => setForm(f => ({ ...f, severity: s.value }))}
                            className={cn("flex-1 p-3 rounded-xl text-xs font-bold text-center transition-all border-2",
                              form.severity === s.value ? "border-brand-gold shadow-md " + s.color : "border-gray-100 dark:border-gray-700 text-gray-400")}>
                            {s.label}<br /><span className="text-[9px] font-normal">{s.days}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date blessure</label>
                        <input type="date" value={form.dateInjury} onChange={e => setForm(f => ({ ...f, dateInjury: e.target.value }))}
                          className="w-full mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm dark:text-white border-none outline-none" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date retour (opt.)</label>
                        <input type="date" value={form.dateReturn} onChange={e => setForm(f => ({ ...f, dateReturn: e.target.value }))}
                          className="w-full mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm dark:text-white border-none outline-none" />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Traitement</label>
                      <textarea value={form.treatment} onChange={e => setForm(f => ({ ...f, treatment: e.target.value }))} rows={2}
                        placeholder="Repos, kiné, strapping..." className="w-full mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm dark:text-white border-none outline-none resize-none" />
                    </div>
                  </div>
                  <button onClick={handleSave} disabled={saving || !form.enrollmentId}
                    className="w-full py-3 bg-red-500 text-white rounded-2xl font-bold text-sm shadow-lg disabled:opacity-50 flex items-center justify-center gap-2">
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {saving ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Active Injuries */}
      {active.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-red-500 uppercase tracking-widest flex items-center gap-2"><AlertTriangle size={14} /> Blessures Actives</h4>
          {active.map((item: any) => {
            const inj = item.injury || item;
            const sev = SEVERITIES.find(s => s.value === inj.severity);
            const days = Math.ceil((Date.now() - new Date(inj.dateInjury).getTime()) / 86400000);
            return (
              <div key={inj.id} className="p-4 bg-red-50/50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-2xl flex items-center gap-4">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center text-red-500 shrink-0">
                  <AlertTriangle size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold dark:text-white truncate">{item.studentName}</p>
                  <p className="text-[10px] text-gray-500 capitalize">{inj.type} • {inj.zone} • {days}j d'absence</p>
                </div>
                <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase shrink-0", sev?.color)}>{sev?.label}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Recovered */}
      {recovered.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2"><Heart size={14} /> Historique (Rétablis)</h4>
          {recovered.map((item: any) => {
            const inj = item.injury || item;
            return (
              <div key={inj.id} className="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl flex items-center gap-4 opacity-70">
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-500 shrink-0">
                  <Heart size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold dark:text-white truncate">{item.studentName}</p>
                  <p className="text-[10px] text-gray-500 capitalize">{inj.type} • {inj.zone} • {inj.dateInjury} → {inj.dateReturn}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {injuriesList.length === 0 && (
        <div className="p-16 text-center border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-3xl">
          <Heart size={40} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-400 font-medium">Aucune blessure déclarée — Bonne nouvelle !</p>
        </div>
      )}
    </div>
  );
}
