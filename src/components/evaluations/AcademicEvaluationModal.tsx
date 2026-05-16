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
      await api.evaluations.create({
        studentId: student.id,
        enrollmentId: enrollment.id,
        sequence,
        academicYear: enrollment.academicYear || getCurrentAcademicYear(),
        behaviorComment: behavior,
        grades: grades
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
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-4xl max-h-[90vh] bg-white dark:bg-[#0a0a0a] z-[210] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header - Static */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between shrink-0 bg-white dark:bg-[#0a0a0a]">
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

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-12">
          <div className="max-w-4xl mx-auto w-full">
            {success ? (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-display font-bold dark:text-white mb-2">Évaluation Enregistrée !</h3>
                <p className="text-gray-500">Les notes ont été ajoutées avec succès au dossier.</p>
              </motion.div>
            ) : mode === 'choice' ? (
              <div className="flex flex-col items-center justify-center gap-8 max-w-sm mx-auto text-center py-12">
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
              <div className="flex flex-col items-center justify-center text-center py-12 px-8">
                {saving ? (
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-6">
                      <Loader2 size={40} className="text-indigo-600 animate-spin" />
                    </div>
                    <h3 className="text-xl font-bold dark:text-white mb-2">Analyse en cours...</h3>
                    <p className="text-gray-500 text-sm max-w-xs">Gemini AI extrait les notes et appréciations du bulletin. Cela peut prendre quelques secondes.</p>
                  </div>
                ) : (
                  <>
                    <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-6">
                      <Camera size={40} className="text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-bold dark:text-white mb-2">Scanner le bulletin</h3>
                    <p className="text-gray-500 text-sm max-w-xs mb-8">Prenez une photo bien nette du bulletin scolaire ou téléchargez une image pour remplir automatiquement le formulaire.</p>
                    
                    {error && (
                      <div className="flex items-center gap-2 text-red-500 text-xs font-bold mb-6 bg-red-50 dark:bg-red-900/20 p-4 rounded-2xl w-full max-w-md">
                        <AlertCircle size={14} /> {error}
                      </div>
                    )}
                    
                    <label className="bg-indigo-600 text-white font-bold px-8 py-4 rounded-2xl cursor-pointer hover:bg-indigo-700 transition-all shadow-lg flex items-center gap-2 mb-4">
                      <Plus size={20} /> Choisir une photo
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          
                          setSaving(true);
                          setError('');
                          try {
                            const reader = new FileReader();
                            reader.readAsDataURL(file);
                            reader.onload = async () => {
                              const base64 = reader.result as string;
                              
                              // Compress image before sending (Vercel 4.5MB limit)
                              const img = new Image();
                              img.src = base64;
                              img.onload = async () => {
                                const canvas = document.createElement('canvas');
                                const MAX_WIDTH = 1000;
                                const MAX_HEIGHT = 1000;
                                let width = img.width;
                                let height = img.height;

                                if (width > height) {
                                  if (width > MAX_WIDTH) {
                                    height *= MAX_WIDTH / width;
                                    width = MAX_WIDTH;
                                  }
                                } else {
                                  if (height > MAX_HEIGHT) {
                                    width *= MAX_HEIGHT / height;
                                    height = MAX_HEIGHT;
                                  }
                                }
                                canvas.width = width;
                                canvas.height = height;
                                const ctx = canvas.getContext('2d');
                                ctx?.drawImage(img, 0, 0, width, height);
                                const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);

                                try {
                                  const result = await api.ai.extractBulletin(compressedBase64);
                                  if (result.grades) {
                                    setGrades(result.grades.map(g => ({
                                      subject: g.subject,
                                      score: String(g.score),
                                      coefficient: String(g.coefficient || 1)
                                    })));
                                  }
                                  if (result.behavior) setBehavior(result.behavior);
                                  setMode('manual');
                                } catch (err: any) {
                                  console.error("AI Error:", err);
                                  setError(`Erreur IA : ${err.message || "Échec de l'analyse."}`);
                                } finally {
                                  setSaving(false);
                                }
                              };
                            };
                          } catch (err: any) {
                            setError("Échec de la lecture de l'image. Utilisez la saisie manuelle.");
                            setSaving(false);
                          }
                        }}
                      />
                    </label>

                    <button onClick={() => setMode('manual')} className="text-gray-400 font-bold text-sm hover:underline">
                      Préférer la saisie manuelle
                    </button>
                  </>
                )}
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
        </div>

        {/* Footer - Static */}
        {!success && mode === 'manual' && (
          <div className="p-6 border-t border-gray-100 dark:border-gray-800 shrink-0 bg-white dark:bg-[#0a0a0a]">
            <div className="max-w-4xl mx-auto w-full">
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
          </div>
        )}
      </motion.div>
    </>
  );
}
