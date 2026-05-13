import React, { useState, useEffect, useMemo } from 'react';
import {
  Search, Filter, Plus, MoreHorizontal, Download, CheckCircle2, Clock, AlertCircle, X, Loader2, Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import InscriptionWizard from '@/components/inscription/InscriptionWizard';

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

export default function Inscriptions() {
  const [showForm, setShowForm] = useState(false);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [academicYear, setAcademicYear] = useState('all');

  const fetchEnrollments = async () => {
    setIsLoading(true);
    try {
      const data = await api.enrollments.list();
      setEnrollments(data.enrollments);
    } catch (error) {
      console.error('Failed to fetch enrollments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const filteredEnrollments = useMemo(() => {
    return enrollments.filter(e => {
      const matchesSearch = e.student?.fullName?.toLowerCase().includes(search.toLowerCase()) || 
                           e.studentId.toString().includes(search);
      const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
      const matchesYear = academicYear === 'all' || e.academicYear === academicYear;
      return matchesSearch && matchesStatus && matchesYear;
    });
  }, [enrollments, search, statusFilter, academicYear]);

  const handleExport = () => {
    const headers = ['ID', 'Nom Complet', 'Année Académique', 'Catégorie', 'Statut', 'Date Création'];
    const rows = filteredEnrollments.map(e => [
      e.id,
      e.student?.fullName,
      e.academicYear,
      e.category || 'N/A',
      e.status,
      new Date(e.createdAt).toLocaleDateString('fr-FR')
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `inscriptions_cfaz_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const years = useMemo(() => {
    const y = new Set(enrollments.map(e => e.academicYear));
    return Array.from(y).sort().reverse();
  }, [enrollments]);

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold dark:text-white">Inscriptions</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Suivi des dossiers d'inscription par année académique.</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowForm(true)}
          className="bg-brand-blue text-white dark:bg-brand-gold dark:text-brand-blue font-bold px-6 py-3 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2">
          <Plus size={20} /> Nouvelle Inscription
        </motion.button>
      </div>

      <div className="glass-card overflow-hidden">
        {/* Filters Header */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-2 flex-1 max-w-md border border-gray-100 dark:border-gray-700">
              <Search size={18} className="text-gray-400" />
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un dossier..." 
                className="bg-transparent border-none focus:ring-0 text-sm w-full dark:text-white" 
              />
            </div>
            <div className="flex items-center gap-3">
              <select 
                value={academicYear} 
                onChange={(e) => setAcademicYear(e.target.value)}
                className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-sm dark:text-white focus:border-brand-gold outline-none"
              >
                <option value="all">Toutes les années</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              <button 
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-white transition-all"
              >
                <Download size={16} /> Exporter
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'Tous' },
              { id: 'complet', label: 'Complets' },
              { id: 'incomplet', label: 'Incomplets' },
              { id: 'en_cours', label: 'En cours' }
            ].map(f => (
              <button 
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-bold transition-all border",
                  statusFilter === f.id 
                    ? "bg-brand-blue text-white border-brand-blue dark:bg-brand-gold dark:text-brand-blue dark:border-brand-gold shadow-md" 
                    : "bg-white text-gray-500 border-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 hover:border-brand-gold"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-10 h-10 text-brand-gold animate-spin" />
              <p className="text-gray-500 text-sm animate-pulse">Chargement des dossiers...</p>
            </div>
          ) : filteredEnrollments.length > 0 ? (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-gray-800/50">
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Candidat</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Année</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Catégorie</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Statut</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredEnrollments.map((e, i) => (
                  <motion.tr key={e.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors group">
                    <td className="px-6 py-4 text-sm font-mono text-gray-400">#{e.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 font-bold text-xs">
                          {e.student?.fullName?.charAt(0)}
                        </div>
                        <span className="text-sm font-semibold dark:text-white">{e.student?.fullName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{e.academicYear}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-brand-gold/10 text-brand-gold text-[10px] font-bold rounded uppercase tracking-wider">
                        {e.category || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(e.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4"><StatusBadge status={e.status} /></td>
                    <td className="px-6 py-4">
                      <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                        <MoreHorizontal size={16} className="text-gray-400" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-2">
                <Search size={24} className="text-gray-300" />
              </div>
              <h3 className="text-lg font-bold dark:text-white">Aucun dossier trouvé</h3>
              <p className="text-gray-500 text-sm max-w-xs text-center">Ajustez vos filtres ou lancez une nouvelle recherche pour trouver ce que vous cherchez.</p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <InscriptionWizard 
            onClose={() => setShowForm(false)} 
            onSuccess={() => { fetchEnrollments(); }} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
