import React, { useState } from 'react';
import { 
  X, Save, Loader2, Trophy, CheckCircle2, AlertCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';

interface Props {
  student: any;
  enrollment: any;
  onClose: () => void;
  onSuccess: () => void;
}

const TEST_FIELDS = [
  { key: 'sprint30m', label: 'Sprint 30m', unit: 's', icon: '⚡' },
  { key: 'yoyoTest', label: 'Yo-Yo Test', unit: 'palier', icon: '🫁' },
  { key: 'verticalJump', label: 'Détente Verticale', unit: 'cm', icon: '🦘' },
  { key: 'agility', label: 'Agilité (T-Test)', unit: 's', icon: '🔀' },
  { key: 'strength', label: 'Force (Squat)', unit: 'kg', icon: '💪' },
  { key: 'vma', label: 'VMA', unit: 'km/h', icon: '🏃' },
  { key: 'jonglerie', label: 'Jonglerie', unit: 'max', icon: '⚽' },
];

export default function SportEvaluationModal({ student, enrollment, onClose, onSuccess }: Props) {
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [formValues, setFormValues] = useState<any>({
    sprint30m: '',
    yoyoTest: '',
    verticalJump: '',
    agility: '',
    strength: '',
    vma: '',
    jonglerie: '',
    notes: ''
  });

  const handleInputChange = (key: string, value: string) => {
    setFormValues((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await api.physicalTests.create({
        enrollmentId: enrollment.id,
        studentId: student.id,
        date,
        sprint30m: formValues.sprint30m ? Number(formValues.sprint30m) : null,
        yoyoTest: formValues.yoyoTest ? Number(formValues.yoyoTest) : null,
        verticalJump: formValues.verticalJump ? Number(formValues.verticalJump) : null,
        agility: formValues.agility ? Number(formValues.agility) : null,
        strength: formValues.strength ? Number(formValues.strength) : null,
        vma: formValues.vma ? Number(formValues.vma) : null,
        jonglerie: formValues.jonglerie ? Number(formValues.jonglerie) : null,
        notes: formValues.notes
      });
      setSuccess(true);
      setTimeout(() => { onSuccess(); onClose(); }, 2000);
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]" />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-2xl max-h-[90vh] bg-white dark:bg-[#0a0a0a] z-[210] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between shrink-0 bg-white dark:bg-[#0a0a0a]">
          <div>
            <h2 className="text-xl font-display font-bold dark:text-white">Évaluation Sportive</h2>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
              {student.fullName} • Catégorie {enrollment.category || 'N/A'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          {success ? (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-display font-bold dark:text-white mb-2">Évaluation Enregistrée !</h3>
              <p className="text-gray-500">Les tests physiques ont été ajoutés avec succès au dossier.</p>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {/* Date selection */}
              <div className="w-full">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date du test</label>
                <input 
                  type="date" 
                  value={date} 
                  onChange={e => setDate(e.target.value)}
                  className="w-full mt-1.5 p-3.5 bg-gray-50 dark:bg-gray-850 rounded-2xl text-sm font-bold dark:text-white border-none outline-none focus:ring-2 focus:ring-brand-gold/20" 
                />
              </div>

              {/* Grid of physical metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {TEST_FIELDS.map(tf => (
                  <div key={tf.key} className="p-4 bg-gray-50/50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800/80 flex flex-col justify-between">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
                      <span>{tf.icon}</span> {tf.label} ({tf.unit})
                    </label>
                    <input 
                      type="number" 
                      step="0.01" 
                      placeholder="--"
                      value={formValues[tf.key]} 
                      onChange={e => handleInputChange(tf.key, e.target.value)}
                      className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm font-bold text-brand-blue dark:text-brand-gold placeholder:text-gray-300 dark:placeholder:text-gray-700" 
                    />
                  </div>
                ))}
              </div>

              {/* General observation */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Observations / Remarques</label>
                <textarea 
                  value={formValues.notes}
                  onChange={e => handleInputChange('notes', e.target.value)}
                  placeholder="Remarques sur la forme du joueur, ses axes d'amélioration ou observations physiques..." 
                  rows={3}
                  className="w-full bg-gray-50 dark:bg-gray-850 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 text-sm dark:text-white outline-none focus:ring-2 focus:ring-brand-gold/20 transition-all"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!success && (
          <div className="p-6 border-t border-gray-100 dark:border-gray-800 shrink-0 bg-white dark:bg-[#0a0a0a]">
            <div className="flex items-center gap-3">
              <button onClick={onClose} className="px-6 py-3 rounded-2xl text-sm font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                Annuler
              </button>
              <div className="flex-1" />
              {error && (
                <div className="flex items-center gap-1 text-red-500 text-xs font-bold mr-4 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">
                  <AlertCircle size={12} /> {error}
                </div>
              )}
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 px-8 py-3 bg-brand-gold text-brand-blue rounded-2xl text-sm font-bold shadow-lg hover:shadow-xl active:scale-[0.98] transition-all disabled:opacity-50">
                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {saving ? 'Enregistrement...' : 'Enregistrer le test'}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
}
