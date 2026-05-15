import React, { useState, useEffect, useMemo } from 'react';
import {
  Search, Filter, Plus, MoreHorizontal, Download, CheckCircle2, Clock, AlertCircle, 
  X, Loader2, Calendar, LayoutGrid, List, User, MapPin, Phone, BookOpen, Trophy, 
  UserCheck, ClipboardList, Star, ChevronRight, TrendingUp, Edit3, ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { api, formatCFA, getCurrentAcademicYear } from '@/lib/api';
import InscriptionWizard from '@/components/inscription/InscriptionWizard';
import AcademicEvaluationModal from '@/components/evaluations/AcademicEvaluationModal';

// --- Components ---

const StatusBadge = ({ status }: { status: string }) => {
  const config: any = {
    complet: { label: 'Complet', classes: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle2 },
    incomplet: { label: 'Incomplet', classes: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: AlertCircle },
    en_cours: { label: 'En cours', classes: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', icon: Clock },
  };
  const { label, classes, icon: Icon } = config[status] || config.en_cours;
  return (
    <div className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", classes)}>
      <Icon size={12} /> {label}
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color, subValue }: any) => (
  <motion.div whileHover={{ y: -5 }} className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-800 p-6 rounded-[32px] shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", color)}>
        <Icon className="w-6 h-6" />
      </div>
      {subValue && <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{subValue}</span>}
    </div>
    <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">{title}</h3>
    <p className="text-3xl font-display font-bold dark:text-white">{value}</p>
  </motion.div>
);

const EnrollmentDetail = ({ enrollment, onClose, onEdit, onAcademicEval }: { enrollment: any; onClose: () => void; onEdit: (e: any) => void; onAcademicEval: (e: any) => void }) => {
  if (!enrollment) return null;
  const student = enrollment.student;
  const [activeTab, setActiveTab] = useState<'infos' | 'scolaire' | 'sportif'>('infos');
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [loadingEvals, setLoadingEvals] = useState(false);

  useEffect(() => {
    if (activeTab === 'scolaire') {
      const fetchEvals = async () => {
        setLoadingEvals(true);
        try {
          const data = await api.evaluations.list({ enrollmentId: enrollment.id });
          setEvaluations(data.evaluations);
        } catch (error) { console.error(error); }
        finally { setLoadingEvals(false); }
      };
      fetchEvals();
    }
  }, [activeTab, enrollment.id]);

  // Derived academic stats
  const academicStats = useMemo(() => {
    if (evaluations.length === 0) return null;
    const latest = evaluations[0];
    const totalGrades = evaluations.flatMap(e => e.grades || []);
    const average = totalGrades.length > 0 
      ? (totalGrades.reduce((sum, g) => sum + Number(g.score), 0) / totalGrades.length).toFixed(2)
      : 'N/A';
    
    return {
      average,
      totalEvals: evaluations.length,
      latestSequence: latest.sequence,
      latestComment: latest.behaviorComment
    };
  }, [evaluations]);

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150]" />
      <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed top-[80px] lg:top-0 inset-x-0 bottom-0 bg-white dark:bg-gray-950 z-[160] shadow-2xl flex flex-col">
        
        {/* Header - Static */}
        <div className="border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 shrink-0">
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 font-bold text-2xl overflow-hidden border border-indigo-100 dark:border-indigo-800">
                {student?.photo ? (
                  <img src={student.photo} alt={student.fullName} className="w-full h-full object-cover" />
                ) : student?.fullName?.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-display font-bold dark:text-white leading-tight">{student?.fullName}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <StatusBadge status={enrollment.status} />
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">#{enrollment.id} • {enrollment.academicYear}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => onEdit(enrollment)} className="p-2.5 bg-gray-50 dark:bg-gray-800 hover:bg-brand-gold/10 hover:text-brand-gold rounded-xl transition-all">
                <Edit3 size={18} />
              </button>
              <button onClick={onClose} className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="px-6 flex items-center gap-6">
            {[
              { id: 'infos', label: 'Infos Générales', icon: User },
              { id: 'scolaire', label: 'Suivi Scolaire', icon: BookOpen },
              { id: 'sportif', label: 'Suivi Sportif', icon: Trophy }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-2 py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-all",
                  activeTab === tab.id 
                    ? "border-brand-gold text-brand-gold" 
                    : "border-transparent text-gray-400 hover:text-gray-600"
                )}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-12">
          <div className="max-w-4xl mx-auto w-full">
            <AnimatePresence mode="wait">
              {activeTab === 'infos' && (
                <motion.div key="infos" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                  {/* Scolarité Quick View */}
                  <div className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/10 dark:to-blue-900/10 rounded-3xl border border-indigo-100 dark:border-indigo-800/30">
                    <div className="flex items-center gap-3 mb-4">
                        <BookOpen size={18} className="text-indigo-600" />
                        <h4 className="text-sm font-bold dark:text-white uppercase tracking-wider">Parcours Académique</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Établissement</p>
                          <p className="text-sm font-bold dark:text-white">{student?.school}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Classe / Niveau</p>
                          <p className="text-sm font-bold dark:text-white">{student?.classLevel}</p>
                        </div>
                    </div>
                  </div>

                  {/* Contacts Section */}
                  <div className="space-y-4">
                    <div className="p-6 bg-gray-50 dark:bg-gray-800/30 rounded-3xl border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-4">
                          <Phone size={18} className="text-brand-gold" />
                          <h4 className="text-sm font-bold dark:text-white uppercase tracking-wider">Contacts Parent / Tuteur</h4>
                        </div>
                        <div className="space-y-4">
                          <div className="flex justify-between items-start">
                              <div>
                                <p className="text-sm font-bold dark:text-white">{student?.parentName}</p>
                                <p className="text-xs text-gray-500">{student?.parentProfession}</p>
                              </div>
                              <span className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-[10px] font-bold uppercase">{student?.parentRelation}</span>
                          </div>
                          <div className="flex flex-col gap-2">
                              <a href={`tel:${student?.parentPhone}`} className="flex items-center gap-2 text-sm font-medium text-brand-blue dark:text-brand-gold hover:underline">
                                <Phone size={14} /> {student?.parentPhone}
                              </a>
                              {student?.parentEmail && (
                                <p className="text-xs text-gray-400">{student.parentEmail}</p>
                              )}
                          </div>
                        </div>
                    </div>

                    <div className="p-6 bg-red-50/50 dark:bg-red-900/10 rounded-3xl border border-red-100 dark:border-red-900/20">
                        <div className="flex items-center gap-3 mb-4">
                          <ShieldAlert size={18} className="text-red-500" />
                          <h4 className="text-sm font-bold dark:text-white uppercase tracking-wider text-red-600 dark:text-red-400">Contact d'Urgence</h4>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                              <p className="text-sm font-bold dark:text-white">{student?.emergencyContactName || 'Non renseigné'}</p>
                              <a href={`tel:${student?.emergencyContactPhone}`} className="text-sm font-bold text-red-600 dark:text-red-400 hover:underline">
                                {student?.emergencyContactPhone}
                              </a>
                          </div>
                        </div>
                    </div>
                  </div>

                  {/* Sportive Details */}
                  <div className="p-6 bg-white dark:bg-gray-800/30 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <Trophy size={18} className="text-brand-gold" />
                        <h4 className="text-sm font-bold dark:text-white uppercase tracking-wider">Détails Sportifs</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-y-6 text-sm">
                        <div><p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Catégorie</p><p className="font-bold text-brand-gold text-lg uppercase">{enrollment.category || 'N/A'}</p></div>
                        <div><p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Postes</p><p className="font-semibold dark:text-gray-200">{student?.positions ? JSON.parse(student.positions).join(', ') : 'N/A'}</p></div>
                        <div><p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Club Actuel</p><p className="font-semibold dark:text-gray-200">{student?.currentClub || 'Libre'}</p></div>
                        <div><p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Expérience</p><p className="font-semibold dark:text-gray-200">{student?.yearsOfPractice} ans</p></div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'scolaire' && (
                <motion.div key="scolaire" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                  {/* Academic Stats Dashboard */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-3xl border border-indigo-100 dark:border-indigo-800/30">
                      <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Moyenne Générale</p>
                      <p className="text-3xl font-display font-bold text-indigo-600 dark:text-indigo-400">{academicStats?.average || 'N/A'}<span className="text-sm ml-1 text-gray-400">/20</span></p>
                    </div>
                    <div className="p-6 bg-brand-gold/10 rounded-3xl border border-brand-gold/20">
                      <p className="text-[10px] font-bold text-brand-gold uppercase tracking-widest mb-1">Séquences Évaluées</p>
                      <p className="text-3xl font-display font-bold text-brand-gold">{academicStats?.totalEvals || 0}</p>
                    </div>
                    <div className="p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-3xl border border-emerald-100 dark:border-emerald-800/30">
                      <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1">Progression</p>
                      <div className="flex items-center gap-2">
                        <TrendingUp size={20} className="text-emerald-500" />
                        <p className="text-3xl font-display font-bold text-emerald-600 dark:text-emerald-400">+0.5</p>
                      </div>
                    </div>
                  </div>

                  {/* Evaluations History */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold dark:text-white uppercase tracking-wider">Historique des Bulletins</h4>
                      <div className="flex gap-2">
                        <button className="p-2 text-gray-400 hover:text-brand-gold transition-colors"><Filter size={16} /></button>
                        <button onClick={() => onAcademicEval(enrollment)} className="flex items-center gap-1 text-[10px] font-bold text-brand-gold uppercase tracking-widest hover:underline">
                          <Plus size={12} /> Nouvelle Évaluation
                        </button>
                      </div>
                    </div>

                    {loadingEvals ? (
                      <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-brand-gold" /></div>
                    ) : evaluations.length === 0 ? (
                      <div className="p-12 text-center border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-3xl text-gray-400">
                        Aucune évaluation enregistrée pour cette année académique.
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {evaluations.map((ev: any) => (
                          <div key={ev.id} className="bg-white dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
                            <div className="p-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-brand-gold/10 flex items-center justify-center text-brand-gold font-bold">
                                  {ev.sequence.charAt(ev.sequence.length - 1)}
                                </div>
                                <div>
                                  <p className="text-sm font-bold dark:text-white">{ev.sequence}</p>
                                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{new Date(ev.createdAt).toLocaleDateString('fr-FR')}</p>
                                </div>
                              </div>
                              <button className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all">
                                <Download size={16} />
                              </button>
                            </div>
                            <div className="p-5">
                              <table className="w-full text-left">
                                <thead>
                                  <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    <th className="pb-3">Matière</th>
                                    <th className="pb-3 text-center">Note</th>
                                    <th className="pb-3 text-center">Coef</th>
                                    <th className="pb-3 text-right">Total</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                  {ev.grades?.map((g: any) => (
                                    <tr key={g.id} className="text-sm">
                                      <td className="py-3 font-medium dark:text-gray-300">{g.subject}</td>
                                      <td className="py-3 text-center font-bold text-brand-blue dark:text-brand-gold">{g.score}/20</td>
                                      <td className="py-3 text-center text-gray-400">{g.coefficient}</td>
                                      <td className="py-3 text-right font-bold dark:text-white">{(Number(g.score) * Number(g.coefficient)).toFixed(2)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                              {ev.behaviorComment && (
                                <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-800/30">
                                  <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                                    <UserCheck size={12} /> Observation Comportement
                                  </p>
                                  <p className="text-xs text-gray-600 dark:text-gray-300 italic">"{ev.behaviorComment}"</p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'sportif' && (
                <motion.div key="sportif" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="h-full flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-20 h-20 bg-amber-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center mb-6">
                    <Star className="w-10 h-10 text-amber-500 animate-pulse" />
                  </div>
                  <h3 className="text-2xl font-display font-bold dark:text-white mb-2">Suivi Sportif (Beta)</h3>
                  <p className="text-gray-500 max-w-sm">Le module d'analyse technique et physique sera bientôt disponible avec des graphiques de progression détaillés.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer - Static */}
        <div className="p-6 border-t border-gray-100 dark:border-gray-800 shrink-0 bg-white dark:bg-gray-950">
          <div className="max-w-4xl mx-auto w-full flex items-center justify-between">
            <p className="text-xs text-gray-400 font-medium italic">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
            </p>
            <div className="flex gap-3">
              <button onClick={onClose} className="px-6 py-3 rounded-2xl text-sm font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                Fermer
              </button>
              {activeTab === 'infos' && (
                <button onClick={() => onEdit(enrollment)} className="px-8 py-3 bg-brand-blue dark:bg-brand-gold text-white dark:text-brand-blue rounded-2xl text-sm font-bold shadow-lg hover:shadow-xl transition-all">
                  Modifier le dossier
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};
                </div>
                <div className="flex justify-between items-center">
                   <div>
                      <p className="text-sm font-bold dark:text-white">{student?.emergencyContactName || 'Non renseigné'}</p>
                      <a href={`tel:${student?.emergencyContactPhone}`} className="text-sm font-bold text-red-600 dark:text-red-400 hover:underline">
                         {student?.emergencyContactPhone}
                      </a>
                   </div>
                </div>
             </div>
          </div>

          {/* Sportive Details */}
          <div className="p-6 bg-white dark:bg-gray-800/30 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
             <div className="flex items-center gap-3 mb-4">
                <Trophy size={18} className="text-brand-gold" />
                <h4 className="text-sm font-bold dark:text-white uppercase tracking-wider">Détails Sportifs</h4>
             </div>
             <div className="grid grid-cols-2 gap-y-6 text-sm">
                <div><p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Catégorie</p><p className="font-bold text-brand-gold text-lg uppercase">{enrollment.category || 'N/A'}</p></div>
                <div><p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Postes</p><p className="font-semibold dark:text-gray-200">{student?.positions ? JSON.parse(student.positions).join(', ') : 'N/A'}</p></div>
                <div><p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Club Actuel</p><p className="font-semibold dark:text-gray-200">{student?.currentClub || 'Libre'}</p></div>
                <div><p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Expérience</p><p className="font-semibold dark:text-gray-200">{student?.yearsOfPractice} ans</p></div>
             </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default function Inscriptions() {
  const [showWizard, setShowWizard] = useState(false);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [selectedEnrollment, setSelectedEnrollment] = useState<any>(null);
  
  // Evaluation state
  const [showAcademicEval, setShowAcademicEval] = useState(false);
  const [evalEnrollment, setEvalEnrollment] = useState<any>(null);
  
  // Edit mode state
  const [editingData, setEditingData] = useState<any>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [academicYearFilter, setAcademicYearFilter] = useState(getCurrentAcademicYear());

  const fetchEnrollments = async () => {
    setIsLoading(true);
    try {
      const data = await api.enrollments.list();
      setEnrollments(data.enrollments);
    } catch (error) { console.error(error); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchEnrollments(); }, []);

  const filteredEnrollments = useMemo(() => {
    return enrollments.filter(e => {
      const matchesSearch = e.student?.fullName?.toLowerCase().includes(search.toLowerCase()) || 
                           e.studentId.toString().includes(search);
      const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || e.category === categoryFilter;
      const matchesYear = e.academicYear === academicYearFilter;
      return matchesSearch && matchesStatus && matchesCategory && matchesYear;
    });
  }, [enrollments, search, statusFilter, categoryFilter, academicYearFilter]);

  const stats = useMemo(() => {
    // Stats also respect the academicYearFilter
    const currentYearData = enrollments.filter(e => e.academicYear === academicYearFilter);
    const total = currentYearData.length;
    const complet = currentYearData.filter(e => e.status === 'complet').length;
    const incomplet = currentYearData.filter(e => e.status === 'incomplet').length;
    const enCours = currentYearData.filter(e => e.status === 'en_cours').length;
    return { total, complet, incomplet, enCours };
  }, [enrollments, academicYearFilter]);

  const years = useMemo(() => {
    const y = new Set(enrollments.map(e => e.academicYear));
    if (y.size === 0) y.add(getCurrentAcademicYear());
    return Array.from(y).sort().reverse();
  }, [enrollments]);

  const handleEdit = (enrollment: any) => {
    setEditingData({
      ...enrollment.student,
      category: enrollment.category,
      studentId: enrollment.studentId
    });
    setSelectedEnrollment(null);
    setShowWizard(true);
  };

  const handleExport = () => {
    const headers = ['ID', 'Nom', 'Année', 'Catégorie', 'Statut'];
    const rows = filteredEnrollments.map(e => [e.id, e.student?.fullName, e.academicYear, e.category || 'N/A', e.status]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `cfaz_inscriptions_${academicYearFilter}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-bold dark:text-white">Inscriptions</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Gestion des dossiers pour l'année {academicYearFilter}</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Year Filter next to Nouvelle Inscription */}
          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 px-4 py-3 rounded-2xl shadow-sm">
            <Calendar size={18} className="text-brand-gold" />
            <select 
              value={academicYearFilter} 
              onChange={e => setAcademicYearFilter(e.target.value)}
              className="bg-transparent text-sm font-bold dark:text-white outline-none"
            >
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => { setEditingData(null); setShowWizard(true); }}
            className="bg-brand-blue text-white dark:bg-brand-gold dark:text-brand-blue font-bold px-6 py-3 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2">
            <Plus size={20} /> Nouvelle Inscription
          </motion.button>
        </div>
      </div>

      {/* Stats Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Inscriptions" value={stats.total} icon={TrendingUp} color="bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400" />
        <StatCard title="Dossiers Complets" value={stats.complet} icon={CheckCircle2} color="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" />
        <StatCard title="Dossiers Incomplets" value={stats.incomplet} icon={AlertCircle} color="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" />
        <StatCard title="En Cours" value={stats.enCours} icon={Clock} color="bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400" />
      </div>

      {/* Filters & View Toggle */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex flex-col md:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un dossier..." 
              className="w-full pl-12 pr-4 py-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-800 rounded-2xl text-sm dark:text-white outline-none focus:border-brand-gold transition-all" />
          </div>
          <div className="flex gap-2">
            {['all', 'complet', 'incomplet', 'en_cours'].map(f => (
              <button key={f} onClick={() => setStatusFilter(f)} className={cn("px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border", statusFilter === f ? "bg-brand-gold text-brand-blue border-brand-gold shadow-md" : "bg-white dark:bg-gray-800 text-gray-500 border-gray-100 dark:border-gray-700")}>
                {f === 'all' ? 'Tous' : f.replace('_', ' ')}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {['all', 'U13', 'U15', 'U17'].map(c => (
              <button key={c} onClick={() => setCategoryFilter(c)} className={cn("px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border", categoryFilter === c ? "bg-brand-blue text-white border-brand-blue" : "bg-white dark:bg-gray-800 text-gray-500 border-gray-100 dark:border-gray-700")}>
                {c === 'all' ? 'Cats' : c}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
           <button onClick={handleExport} className="hidden md:flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-brand-gold transition-all">
              <Download size={18} /> Export
           </button>
          <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl w-fit">
            <button onClick={() => setViewMode('table')} className={cn("p-2 rounded-xl transition-all", viewMode === 'table' ? "bg-white dark:bg-gray-700 text-brand-blue dark:text-brand-gold shadow-sm" : "text-gray-400")}>
              <List size={20} />
            </button>
            <button onClick={() => setViewMode('grid')} className={cn("p-2 rounded-xl transition-all", viewMode === 'grid' ? "bg-white dark:bg-gray-700 text-brand-blue dark:text-brand-gold shadow-sm" : "text-gray-400")}>
              <LayoutGrid size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-brand-gold animate-spin" />
            <p className="text-gray-500 text-sm font-medium animate-pulse">Chargement des dossiers...</p>
          </div>
        ) : filteredEnrollments.length > 0 ? (
          viewMode === 'table' ? (
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50 dark:bg-gray-800/50">
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Candidat</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Établissement</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Classe</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Catégorie</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Statut</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {filteredEnrollments.map((e, i) => (
                      <motion.tr key={e.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                        onClick={() => setSelectedEnrollment(e)}
                        className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors group cursor-pointer">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 font-bold text-xs overflow-hidden border border-white dark:border-gray-700">
                              {e.student?.photo ? <img src={e.student.photo} className="w-full h-full object-cover" /> : e.student?.fullName?.charAt(0)}
                            </div>
                            <div>
                               <p className="text-sm font-bold dark:text-white">{e.student?.fullName}</p>
                               <p className="text-[10px] text-gray-400 font-mono">#{e.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 font-medium">{e.student?.school}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 font-bold">{e.student?.classLevel}</td>
                        <td className="px-6 py-4"><span className="px-2 py-1 bg-brand-gold/10 text-brand-gold text-[10px] font-bold rounded uppercase tracking-wider">{e.category || 'N/A'}</span></td>
                        <td className="px-6 py-4"><StatusBadge status={e.status} /></td>
                        <td className="px-6 py-4 text-right">
                          <ChevronRight size={18} className="inline-block text-gray-300 group-hover:text-brand-gold transition-all" />
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEnrollments.map((e, i) => (
                <motion.div key={e.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                  onClick={() => setSelectedEnrollment(e)}
                  className="group bg-white/80 dark:bg-gray-900/60 backdrop-blur-md border border-white dark:border-gray-800 p-6 rounded-[32px] shadow-sm hover:shadow-xl hover:border-brand-gold/50 transition-all cursor-pointer relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-brand-gold/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
                  <div className="flex items-center gap-4 mb-6 relative z-10">
                    <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 font-bold text-2xl overflow-hidden border border-white/50 dark:border-gray-700 shadow-sm">
                       {e.student?.photo ? <img src={e.student.photo} className="w-full h-full object-cover" /> : e.student?.fullName?.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-display font-bold dark:text-white group-hover:text-brand-gold transition-colors truncate max-w-[150px]">{e.student?.fullName}</h3>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">#{e.id} • {e.student?.classLevel}</p>
                    </div>
                  </div>
                  <div className="space-y-3 relative z-10">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400 uppercase font-bold tracking-widest">Établissement</span>
                      <span className="text-sm font-bold dark:text-white truncate max-w-[150px]">{e.student?.school}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400 uppercase font-bold tracking-widest">Statut</span>
                      <StatusBadge status={e.status} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <Search size={24} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-bold dark:text-white">Aucun dossier trouvé pour l'année {academicYearFilter}</h3>
            <p className="text-gray-500 text-sm max-w-xs">Changez d'année académique ou ajustez vos filtres.</p>
          </div>
        )}
      </div>

      {/* Popups */}
      <AnimatePresence>
        {showWizard && (
          <InscriptionWizard 
            onClose={() => { setShowWizard(false); setEditingData(null); }} 
            onSuccess={fetchEnrollments}
            initialData={editingData}
            studentId={editingData?.studentId}
          />
        )}
        {selectedEnrollment && (
          <EnrollmentDetail 
            enrollment={selectedEnrollment} 
            onClose={() => setSelectedEnrollment(null)} 
            onEdit={handleEdit}
            onAcademicEval={(e) => {
              setEvalEnrollment(e);
              setShowAcademicEval(true);
            }}
          />
        )}
        {showAcademicEval && evalEnrollment && (
          <AcademicEvaluationModal
            student={evalEnrollment.student}
            enrollment={evalEnrollment}
            onClose={() => { setShowAcademicEval(false); setEvalEnrollment(null); }}
            onSuccess={() => { fetchEnrollments(); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
