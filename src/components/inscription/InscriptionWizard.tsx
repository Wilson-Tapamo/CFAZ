import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, CheckCircle2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { api, getCurrentAcademicYear } from '@/lib/api';
import StepPersonalInfo from './StepPersonalInfo';
import StepParentInfo from './StepParentInfo';
import StepSchoolInfo from './StepSchoolInfo';
import StepSportInfo from './StepSportInfo';
import StepDocuments from './StepDocuments';
import StepFinance from './StepFinance';

const STEPS = [
  { id: 1, label: 'Info Perso', short: 'Perso' },
  { id: 2, label: 'Parent/Tuteur', short: 'Parent' },
  { id: 3, label: 'Scolaire', short: 'École' },
  { id: 4, label: 'Sportif', short: 'Sport' },
  { id: 5, label: 'Documents', short: 'Docs' },
  { id: 6, label: 'Finance', short: 'Finance' },
];

interface Props {
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
  studentId?: number;
}

export default function InscriptionWizard({ onClose, onSuccess, initialData, studentId }: Props) {
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Form data
  const [formData, setFormData] = useState<any>(initialData || {
    nationality: 'Camerounaise',
    academicYearSchool: getCurrentAcademicYear(),
    positions: [],
  });

  // Documents tracking (local before save)
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, { fileName: string; fileData: string; mimeType: string }>>({});

  // Payments tracking (local before save)
  const [localPayments, setLocalPayments] = useState<{ category: string; amount: number; method: string; note: string }[]>([]);

  const onChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleDocUpload = (type: string, fileName: string, fileData: string, mimeType: string) => {
    setUploadedDocs(prev => ({ ...prev, [type]: { fileName, fileData, mimeType } }));
  };

  const handleDocRemove = (type: string) => {
    setUploadedDocs(prev => { const n = { ...prev }; delete n[type]; return n; });
  };

  const handleAddPayment = (payment: { category: string; amount: number; method: string; note: string }) => {
    setLocalPayments(prev => [...prev, payment]);
  };

  const canProceed = () => {
    if (step === 1) return formData.fullName && formData.dateOfBirth && formData.placeOfBirth && formData.sex;
    if (step === 2) return formData.parentName && formData.parentPhone;
    if (step === 3) return formData.school && formData.classLevel;
    return true;
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      let currentStudent: any;
      let currentEnrollment: any;

      if (studentId) {
        // Update existing student
        const { student } = await api.students.update(studentId, formData);
        currentStudent = student;

        // Find existing enrollment for this year or create if missing
        const { enrollments: studentEnrollments } = await api.enrollments.list({ studentId, academicYear: getCurrentAcademicYear() });
        if (studentEnrollments && studentEnrollments.length > 0) {
          currentEnrollment = studentEnrollments[0];
        } else {
          const { enrollment } = await api.enrollments.create({
            studentId,
            academicYear: getCurrentAcademicYear(),
            category: formData.category,
          });
          currentEnrollment = enrollment;
        }
      } else {
        // 1. Create student
        const { student } = await api.students.create(formData);
        currentStudent = student;

        // 2. Create enrollment
        const { enrollment } = await api.enrollments.create({
          studentId: student.id,
          academicYear: getCurrentAcademicYear(),
          category: formData.category,
        });
        currentEnrollment = enrollment;
      }

      // 3. Upload documents
      for (const [type, doc] of Object.entries(uploadedDocs)) {
        await api.documents.upload({
          studentId: currentStudent.id,
          enrollmentId: currentEnrollment.id,
          type,
          fileName: doc.fileName,
          fileData: doc.fileData,
          mimeType: doc.mimeType,
        });
      }

      // 4. Record payments
      for (const p of localPayments) {
        await api.payments.create({
          studentId: currentStudent.id,
          enrollmentId: currentEnrollment.id,
          category: p.category,
          paidAmount: p.amount,
          method: p.method,
          note: p.note,
        });
      }

      // 5. Update enrollment status
      const hasAllDocs = Object.keys(uploadedDocs).length >= 7;
      await api.enrollments.update(currentEnrollment.id, {
        status: hasAllDocs ? 'complet' : 'incomplet',
        registrationStep: 6,
      });

      setSuccess(true);
      setTimeout(() => { onSuccess(); onClose(); }, 2000);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'enregistrement');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]" />
      <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed top-[80px] lg:top-0 inset-x-0 h-[calc(100vh-80px)] lg:h-screen bg-white dark:bg-[#0a0a0a] z-[110] shadow-2xl flex flex-col overflow-hidden">

        {/* Header - Static */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 shrink-0 bg-white dark:bg-[#0a0a0a]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-bold dark:text-white">Nouvelle Inscription</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Step Progress */}
          <div className="flex items-center gap-1">
            {STEPS.map((s, i) => (
              <React.Fragment key={s.id}>
                <button onClick={() => s.id <= step && setStep(s.id)}
                  className={cn("flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap",
                    step === s.id ? "bg-brand-gold text-brand-blue" :
                      s.id < step ? "text-green-600 bg-green-50 dark:bg-green-900/20" : "text-gray-400")}>
                  {s.id < step ? <CheckCircle2 className="w-3 h-3" /> : <span>{s.id}</span>}
                  <span className="hidden sm:inline">{s.short}</span>
                </button>
                {i < STEPS.length - 1 && (
                  <div className={cn("h-0.5 flex-1 rounded-full transition-all", s.id < step ? "bg-green-400" : "bg-gray-200 dark:bg-gray-800")} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-12">
          <div className="max-w-4xl mx-auto w-full">
            {success ? (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-display font-bold dark:text-white mb-2">Inscription Réussie !</h3>
                <p className="text-gray-500">Le dossier a été enregistré avec succès.</p>
              </motion.div>
            ) : (
              <AnimatePresence mode="wait">
                {step === 1 && <StepPersonalInfo key="s1" data={formData} onChange={onChange} />}
                {step === 2 && <StepParentInfo key="s2" data={formData} onChange={onChange} />}
                {step === 3 && <StepSchoolInfo key="s3" data={formData} onChange={onChange} />}
                {step === 4 && <StepSportInfo key="s4" data={formData} onChange={onChange} />}
                {step === 5 && <StepDocuments key="s5" uploadedDocs={uploadedDocs} onUpload={handleDocUpload} onRemove={handleDocRemove} />}
                {step === 6 && <StepFinance key="s6" payments={localPayments} onAddPayment={handleAddPayment} />}
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* Footer - Static */}
        {!success && (
          <div className="p-6 border-t border-gray-100 dark:border-gray-800 shrink-0 bg-white dark:bg-[#0a0a0a]">
            <div className="max-w-4xl mx-auto w-full">
              {error && <p className="text-red-500 text-sm mb-3 font-medium">{error}</p>}
              <div className="flex items-center gap-3">
                {step > 1 && (
                  <button onClick={() => setStep(s => s - 1)} className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-white transition-all">
                    <ChevronLeft className="w-4 h-4" /> Retour
                  </button>
                )}
                <div className="flex-1" />
                {step < 6 ? (
                  <button onClick={() => canProceed() && setStep(s => s + 1)} disabled={!canProceed()}
                    className={cn("flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all shadow-lg",
                      canProceed() ? "bg-brand-blue dark:bg-brand-gold text-white dark:text-brand-blue hover:shadow-xl active:scale-[0.98]" : "bg-gray-200 text-gray-400 cursor-not-allowed")}>
                    Suivant <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button onClick={handleSave} disabled={saving}
                    className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-2xl text-sm font-bold shadow-lg hover:shadow-xl active:scale-[0.98] transition-all disabled:opacity-50">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    {saving ? 'Enregistrement...' : 'Finaliser l\'Inscription'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
}
