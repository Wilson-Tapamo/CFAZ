import React, { useState } from 'react';
import { 
  BookOpen, GraduationCap, TrendingUp, Search, Filter, 
  Users, Award, ChevronRight, Loader2, Calendar, Download, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useQuery } from '@tanstack/react-query';
import { api, getCurrentAcademicYear } from '@/lib/api';
import { cn } from '@/lib/utils';
import { generateBulletinPDF } from '@/lib/pdfGenerator';

export default function Scolaire() {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [academicYear] = useState(getCurrentAcademicYear());
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const handleDownload = async (report: any) => {
    setDownloadingId(report.enrollment_id);
    try {
      const data = await api.evaluations.list({ enrollmentId: report.enrollment_id });
      if (data.evaluations.length === 0) {
        alert("Aucune évaluation trouvée pour cet élève.");
        return;
      }
      await generateBulletinPDF(report, data.evaluations);
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la génération du bulletin.");
    } finally {
      setDownloadingId(null);
    }
  };

  const { data, isLoading: loading } = useQuery({
    queryKey: ['scolaireData', academicYear, categoryFilter],
    queryFn: async () => {
      const [statsData, reportsData] = await Promise.all([
        api.evaluations.stats(academicYear),
        api.evaluations.reports({ academicYear, category: categoryFilter })
      ]);
      return { stats: statsData, reports: reportsData.reports };
    }
  });

  const stats = data?.stats || null;
  const reports = data?.reports || [];

  const filteredReports = reports.filter(r => 
    r.full_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold dark:text-white">Suivi Scolaire</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Surveillez les performances académiques en temps réel.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl text-xs font-bold dark:text-white flex items-center gap-2">
              <Calendar size={14} className="text-brand-gold" />
              Année : {academicYear}
           </div>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-900 p-6 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm">
           <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 mb-4">
              <GraduationCap size={24} />
           </div>
           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Moyenne Académie</p>
           <p className="text-3xl font-display font-bold dark:text-white">{stats?.global?.average || '--'}<span className="text-sm ml-1 text-gray-400">/20</span></p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-gray-900 p-6 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm">
           <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 mb-4">
              <TrendingUp size={24} />
           </div>
           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Taux de Réussite</p>
           <p className="text-3xl font-display font-bold dark:text-white">92%</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-gray-900 p-6 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm">
           <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 flex items-center justify-center text-brand-gold mb-4">
              <Users size={24} />
           </div>
           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Total Élèves</p>
           <p className="text-3xl font-display font-bold dark:text-white">{reports.length}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white dark:bg-gray-900 p-6 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm">
           <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 mb-4">
              <Award size={24} />
           </div>
           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Major Promo</p>
           <p className="text-lg font-bold dark:text-white truncate">{stats?.topStudents?.[0]?.name || '--'}</p>
        </motion.div>
      </div>

      {/* Main Section */}
      <div className="bg-white dark:bg-gray-950 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden min-h-[600px]">
        {/* Filters Bar */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Rechercher un élève..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl text-sm dark:text-white outline-none focus:ring-2 ring-brand-gold/20"
              />
            </div>
            <div className="flex bg-gray-50 dark:bg-gray-900 p-1 rounded-2xl">
              {['all', 'U13', 'U15', 'U17', 'U20'].map(cat => (
                <button 
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                    categoryFilter === cat ? "bg-white dark:bg-gray-800 text-brand-gold shadow-sm" : "text-gray-400 hover:text-gray-600"
                  )}
                >
                  {cat === 'all' ? 'Tous' : cat}
                </button>
              ))}
            </div>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-brand-blue dark:bg-brand-gold text-white dark:text-brand-blue rounded-2xl text-sm font-bold shadow-lg">
             <Filter size={18} /> Plus de filtres
          </button>
        </div>

        {/* Content Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-brand-gold" />
              <p className="text-sm font-medium text-gray-400">Chargement des données académiques...</p>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="w-16 h-16 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mb-4 text-gray-300">
                <BookOpen size={32} />
              </div>
              <h3 className="text-lg font-bold dark:text-white">Aucun résultat</h3>
              <p className="text-sm text-gray-400 max-w-xs">Nous n'avons trouvé aucun élève correspondant à vos critères de recherche.</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-gray-900/50">
                  <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Élève</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Catégorie</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Dernière Séquence</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Moyenne /20</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Évals</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredReports.map((report, index) => (
                  <tr key={report.enrollment_id} className="group hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-all cursor-pointer">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 font-bold border border-indigo-100 dark:border-indigo-800 overflow-hidden shrink-0">
                          {report.photo ? (
                            <img src={report.photo} alt={report.full_name} className="w-full h-full object-cover" />
                          ) : report.full_name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold dark:text-white group-hover:text-brand-gold transition-colors">{report.full_name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">#{report.student_id}</span>
                            <span className="text-[9px] bg-brand-gold/10 text-brand-gold px-1.5 py-0.5 rounded-md font-black uppercase tracking-widest">
                              {index + 1}{index === 0 ? 'er' : 'ème'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-[10px] font-bold text-gray-500 uppercase">
                        {report.category}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <p className="text-sm font-semibold dark:text-gray-300">{report.last_sequence || '--'}</p>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <p className={cn(
                          "text-lg font-display font-bold",
                          Number(report.global_average) >= 12 ? "text-emerald-500" : 
                          Number(report.global_average) >= 10 ? "text-brand-gold" : 
                          report.global_average ? "text-red-500" : "text-gray-300"
                        )}>
                          {report.global_average ? Number(report.global_average).toFixed(2) : '--'}
                        </p>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                       <span className="text-xs font-bold dark:text-gray-400">{report.evaluation_count}</span>
                    </td>
                    <td className="px-8 py-5 text-right">
                       <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button 
                           onClick={(e) => { e.stopPropagation(); handleDownload(report); }}
                           disabled={downloadingId === report.enrollment_id}
                           className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-brand-gold hover:text-brand-blue hover:border-brand-gold transition-all disabled:opacity-50"
                         >
                           {downloadingId === report.enrollment_id ? (
                             <Loader2 size={14} className="animate-spin" />
                           ) : (
                             <FileText size={14} />
                           )}
                           Bulletin PDF
                         </button>
                         <button className="p-2 text-gray-300 hover:text-brand-gold hover:bg-brand-gold/10 rounded-lg transition-all">
                            <ChevronRight size={20} />
                         </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
