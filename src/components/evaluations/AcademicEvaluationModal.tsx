import React, { useState } from 'react';
import { 
  X, Camera, Edit3, Save, Plus, Trash2, CheckCircle2, 
  Loader2, BookOpen, UserCheck, AlertCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { api, getCurrentAcademicYear } from '@/lib/api';

interface Props {
  student: any;
  enrollment: any;
  onClose: () => void;
  onSuccess: () => void;
}

const SEQUENCES = ['Séquence 1', 'Séquence 2', 'Séquence 3', 'Séquence 4', 'Séquence 5', 'Séquence 6'];

export default function AcademicEvaluationModal({ student, enrollment, onClose, onSuccess }: Props) {
  const [mode, setMode] = useState<'choice' | 'manual' | 'ai'>('choice');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [sequence, setSequence] = useState(SEQUENCES[0]);
  const [behavior, setBehavior] = useState('');
  const [grades, setGrades] = useState<{ subject: string; score: string; coefficient: string }[]>([
    { subject: 'Mathématiques', score: '', coefficient: '2' },
    { subject: 'Français', score: '', coefficient: '2' },
    { subject: 'Anglais', score: '', coefficient: '2' },
  ]);

  const addGradeRow = () => {
    setGrades([...grades, { subject: '', score: '', coefficient: '1' }]);
  };

  const removeGradeRow = (index: number) => {
    setGrades(grades.filter((_, i) => i !== index));
  };

  const updateGrade = (index: number, field: string, value: string) => {
    const newGrades = [...grades];
    (newGrades[index] as any)[field] = value;
    setGrades(newGrades);
  };

  const handleSave = async () => {
    if (!sequence) return setError('Veuillez sélectionner une séquence');
    if (grades.some(g => !g.subject || !g.score)) return setError('Veuillez remplir toutes les matières et notes');

    setSaving(true);
    setError('');
    try {
      await api.fetch('/api/academic-evaluations', {
        method: 'POST',
        body: JSON.stringify({
          studentId: student.id,
          enrollmentId: enrollment.id,
          sequence,
          academicYear: enrollment.academicYear || getCurrentAcademicYear(),
          behaviorComment: behavior,
          grades: grades
        })
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
      <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed top-[80px] inset-x-0 bottom-0 lg:left-auto lg:right-0 lg:inset-y-0 w-full lg:max-w-3xl bg-white dark:bg-[#0a0a0a] z-[210] shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-display font-bold dark:text-white">Évaluation Scolaire</h2>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
              {student.fullName} • {enrollment.academicYear}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          {success ? (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-display font-bold dark:text-white mb-2">Évaluation Enregistrée !</h3>
              <p className="text-gray-500">Les notes ont été ajoutées avec succès au dossier.</p>
            </motion.div>
          ) : mode === 'choice' ? (
            <div className="h-full flex flex-col items-center justify-center gap-8 max-w-sm mx-auto text-center">
              <div className="w-20 h-20 bg-brand-gold/10 rounded-3xl flex items-center justify-center text-brand-gold">
                <BookOpen size={40} />
              </div>
              <div>
                <h3 className="text-2xl font-display font-bold dark:text-white mb-2">Méthode de saisie</h3>
                <p className="text-gray-500 text-sm">Comment souhaitez-vous entrer les notes du bulletin ?</p>
              </div>
              <div className="grid grid-cols-1 gap-4 w-full">
                <button onClick={() => setMode('ai')} className="group flex items-center gap-4 p-6 bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-[32px] hover:border-brand-gold transition-all text-left">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                    <Camera size={24} />
                  </div>
                  <div>
                    <p className="font-bold dark:text-white">Filmer le bulletin</p>
                    <p className="text-xs text-gray-400">Remplissage auto avec l'IA (Beta)</p>
                  </div>
                </button>
                <button onClick={() => setMode('manual')} className="group flex items-center gap-4 p-6 bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-[32px] hover:border-brand-gold transition-all text-left">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                    <Edit3 size={24} />
                  </div>
                  <div>
                    <p className="font-bold dark:text-white">Saisie manuelle</p>
                    <p className="text-xs text-gray-400">Remplir le tableau des notes</p>
                  </div>
                </button>
              </div>
            </div>
          ) : mode === 'ai' ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <Camera size={40} className="text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold dark:text-white mb-2">Fonctionnalité IA bientôt disponible</h3>
              <p className="text-gray-500 text-sm max-w-xs mb-8">Nous travaillons sur une technologie permettant d'extraire automatiquement les notes d'une photo ou d'une vidéo du bulletin.</p>
              <button onClick={() => setMode('manual')} className="text-brand-gold font-bold text-sm hover:underline">
                Utiliser la saisie manuelle pour le moment
              </button>
            </div>
          ) : (
            <div className="space-y-8 pb-12">
              {/* Sequence Selector */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Séquence / Période</label>
                <div className="flex flex-wrap gap-2">
                  {SEQUENCES.map(s => (
                    <button key={s} onClick={() => setSequence(s)}
                      className={cn("px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                        sequence === s ? "bg-brand-gold text-brand-blue border-brand-gold shadow-md" : "bg-gray-50 dark:bg-gray-800 text-gray-500 border-gray-100 dark:border-gray-700")}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grades Table */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tableau des Notes</label>
                  <button onClick={addGradeRow} className="text-xs font-bold text-brand-gold flex items-center gap-1 hover:underline">
                    <Plus size={14} /> Ajouter une matière
                  </button>
                </div>
                <div className="glass-card overflow-hidden">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-800/50">
                        <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Matière</th>
                        <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-24">Note (/20)</th>
                        <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-20">Coef</th>
                        <th className="px-4 py-3 w-12"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {grades.map((g, i) => (
                        <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                          <td className="px-4 py-3">
                            <input type="text" value={g.subject} onChange={e => updateGrade(i, 'subject', e.target.value)} placeholder="Nom de la matière" 
                              className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold dark:text-white placeholder:text-gray-300" />
                          </td>
                          <td className="px-4 py-3">
                            <input type="number" min="0" max="20" step="0.25" value={g.score} onChange={e => updateGrade(i, 'score', e.target.value)} placeholder="00.00" 
                              className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold text-brand-blue dark:text-brand-gold placeholder:text-gray-300" />
                          </td>
                          <td className="px-4 py-3">
                            <input type="number" min="1" max="10" value={g.coefficient} onChange={e => updateGrade(i, 'coefficient', e.target.value)} placeholder="1" 
                              className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold dark:text-white" />
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button onClick={() => removeGradeRow(i)} className="p-1.5 text-gray-300 hover:text-red-500 transition-colors">
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Behavior Comment */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <UserCheck size={16} className="text-brand-gold" />
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Commentaires sur le comportement</label>
                </div>
                <textarea 
                  value={behavior}
                  onChange={e => setBehavior(e.target.value)}
                  placeholder="Appréciation générale sur le comportement de l'élève en classe..." 
                  rows={4}
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-[24px] p-4 text-sm dark:text-white outline-none focus:border-brand-gold transition-all"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!success && mode === 'manual' && (
          <div className="p-6 border-t border-gray-100 dark:border-gray-800 shrink-0">
            {error && (
              <div className="flex items-center gap-2 text-red-500 text-xs font-bold mb-4 bg-red-50 dark:bg-red-900/20 p-3 rounded-xl">
                <AlertCircle size={14} /> {error}
              </div>
            )}
            <div className="flex items-center gap-3">
              <button onClick={() => setMode('choice')} className="px-6 py-3 rounded-2xl text-sm font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                Annuler
              </button>
              <div className="flex-1" />
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 px-8 py-3 bg-brand-blue dark:bg-brand-gold text-white dark:text-brand-blue rounded-2xl text-sm font-bold shadow-lg hover:shadow-xl active:scale-[0.98] transition-all disabled:opacity-50">
                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {saving ? 'Enregistrement...' : 'Enregistrer les notes'}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
}
