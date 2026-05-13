import React, { useState, useEffect, useMemo } from 'react';
import {
  Search, Filter, Plus, MoreHorizontal, Download, CheckCircle2, Clock, AlertCircle, 
  X, Loader2, Calendar, LayoutGrid, List, User, MapPin, Phone, BookOpen, Trophy, 
  UserCheck, ClipboardList, Star, ChevronRight, TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { api, formatCFA } from '@/lib/api';
import InscriptionWizard from '@/components/inscription/InscriptionWizard';

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

const EnrollmentDetail = ({ enrollment, onClose }: { enrollment: any; onClose: () => void }) => {
  if (!enrollment) return null;
  const student = enrollment.student;

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150]" />
      <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white dark:bg-gray-900 z-[160] shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 flex items-center justify-center text-brand-gold font-bold text-xl uppercase">
              {student?.fullName?.charAt(0)}
            </div>
            <div>
              <h3 className="text-xl font-display font-bold dark:text-white">{student?.fullName}</h3>
              <div className="flex items-center gap-2">
                <StatusBadge status={enrollment.status} />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">#{enrollment.id} • {enrollment.academicYear}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 p-4 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-2xl font-bold text-sm hover:bg-indigo-100 transition-all border border-indigo-100 dark:border-indigo-800/30">
              <ClipboardList size={18} /> Évaluation Scolaire
            </button>
            <button className="flex items-center justify-center gap-2 p-4 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-2xl font-bold text-sm hover:bg-amber-100 transition-all border border-amber-100 dark:border-amber-800/30">
              <Star size={18} /> Évaluation Sportive
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
             <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Catégorie</p>
                <p className="text-lg font-bold dark:text-white">{enrollment.category || 'N/A'}</p>
             </div>
             <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Moyenne Scolaire</p>
                <p className="text-lg font-bold dark:text-white">{student?.averageGrade || '0'}/20</p>
             </div>
          </div>

          {/* Info Sections */}
          <div className="space-y-6">
            <div className="p-6 bg-white dark:bg-gray-800/30 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
               <div className="flex items-center gap-3 mb-4">
                  <User size={18} className="text-brand-gold" />
                  <h4 className="text-sm font-bold dark:text-white uppercase tracking-wider">Informations Personnelles</h4>
               </div>
               <div className="grid grid-cols-2 gap-y-4 text-sm">
                  <div><p className="text-gray-400 text-xs">Date de Naissance</p><p className="font-medium dark:text-gray-200">{student?.dateOfBirth}</p></div>
                  <div><p className="text-gray-400 text-xs">Lieu de Naissance</p><p className="font-medium dark:text-gray-200">{student?.placeOfBirth}</p></div>
                  <div><p className="text-gray-400 text-xs">Téléphone</p><p className="font-medium dark:text-gray-200">{student?.phone || 'N/A'}</p></div>
                  <div><p className="text-gray-400 text-xs">Ville</p><p className="font-medium dark:text-gray-200">{student?.city}</p></div>
               </div>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800/30 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
               <div className="flex items-center gap-3 mb-4">
                  <Trophy size={18} className="text-brand-gold" />
                  <h4 className="text-sm font-bold dark:text-white uppercase tracking-wider">Informations Sportives</h4>
               </div>
               <div className="grid grid-cols-2 gap-y-4 text-sm">
                  <div><p className="text-gray-400 text-xs">Postes</p><p className="font-medium dark:text-gray-200">{student?.positions ? JSON.parse(student.positions).join(', ') : 'N/A'}</p></div>
                  <div><p className="text-gray-400 text-xs">Club Actuel</p><p className="font-medium dark:text-gray-200">{student?.currentClub || 'Libre'}</p></div>
                  <div><p className="text-gray-400 text-xs">Années de pratique</p><p className="font-medium dark:text-gray-200">{student?.yearsOfPractice} ans</p></div>
                  <div><p className="text-gray-400 text-xs">Étape Inscription</p><p className="font-bold text-brand-gold">Étape {enrollment.registrationStep}/6</p></div>
               </div>
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
  
  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

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
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [enrollments, search, statusFilter, categoryFilter]);

  const stats = useMemo(() => {
    const total = enrollments.length;
    const complet = enrollments.filter(e => e.status === 'complet').length;
    const incomplet = enrollments.filter(e => e.status === 'incomplet').length;
    const enCours = enrollments.filter(e => e.status === 'en_cours').length;
    return { total, complet, incomplet, enCours };
  }, [enrollments]);

  const handleExport = () => {
    const headers = ['ID', 'Nom', 'Année', 'Catégorie', 'Statut'];
    const rows = filteredEnrollments.map(e => [e.id, e.student?.fullName, e.academicYear, e.category || 'N/A', e.status]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `cfaz_inscriptions_${new Date().toISOString().split('T')[0]}.csv`);
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
          <p className="text-gray-500 dark:text-gray-400 mt-1">Gestion et suivi des dossiers d'inscription académique.</p>
        </div>
        <div className="flex items-center gap-3">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleExport}
            className="p-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-gray-500 hover:text-brand-gold transition-all shadow-sm">
            <Download size={20} />
          </motion.button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowWizard(true)}
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

        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl w-fit">
          <button onClick={() => setViewMode('table')} className={cn("p-2 rounded-xl transition-all", viewMode === 'table' ? "bg-white dark:bg-gray-700 text-brand-blue dark:text-brand-gold shadow-sm" : "text-gray-400")}>
            <List size={20} />
          </button>
          <button onClick={() => setViewMode('grid')} className={cn("p-2 rounded-xl transition-all", viewMode === 'grid' ? "bg-white dark:bg-gray-700 text-brand-blue dark:text-brand-gold shadow-sm" : "text-gray-400")}>
            <LayoutGrid size={20} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-brand-gold animate-spin" />
            <p className="text-gray-500 text-sm font-medium animate-pulse">Chargement des données...</p>
          </div>
        ) : filteredEnrollments.length > 0 ? (
          viewMode === 'table' ? (
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50 dark:bg-gray-800/50">
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">ID</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Candidat</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Année</th>
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
                        <td className="px-6 py-4 text-sm font-mono text-gray-400">#{e.id}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 font-bold text-xs overflow-hidden">
                              {e.student?.photo ? <img src={e.student.photo} className="w-full h-full object-cover" /> : e.student?.fullName?.charAt(0)}
                            </div>
                            <span className="text-sm font-semibold dark:text-white">{e.student?.fullName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{e.academicYear}</td>
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
                    <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 font-bold text-2xl overflow-hidden">
                       {e.student?.photo ? <img src={e.student.photo} className="w-full h-full object-cover" /> : e.student?.fullName?.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-display font-bold dark:text-white group-hover:text-brand-gold transition-colors truncate max-w-[150px]">{e.student?.fullName}</h3>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">#{e.id} • {e.academicYear}</p>
                    </div>
                  </div>
                  <div className="space-y-3 relative z-10">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400 uppercase font-bold tracking-widest">Catégorie</span>
                      <span className="text-sm font-bold dark:text-white">{e.category || 'N/A'}</span>
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
            <h3 className="text-lg font-bold dark:text-white">Aucun dossier trouvé</h3>
            <p className="text-gray-500 text-sm max-w-xs">Ajustez vos filtres ou effectuez une nouvelle recherche.</p>
          </div>
        )}
      </div>

      {/* Popups */}
      <AnimatePresence>
        {showWizard && <InscriptionWizard onClose={() => setShowWizard(false)} onSuccess={fetchEnrollments} />}
        {selectedEnrollment && <EnrollmentDetail enrollment={selectedEnrollment} onClose={() => setSelectedEnrollment(null)} />}
      </AnimatePresence>
    </div>
  );
}
