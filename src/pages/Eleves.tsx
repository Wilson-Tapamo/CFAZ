import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Filter, MoreHorizontal, User, MapPin, Phone, Calendar, 
  ChevronRight, X, Loader2, Trophy, BookOpen, Download, UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';

// --- Student Detail Popup Component ---
const StudentDetail = ({ student, onClose }: { student: any; onClose: () => void }) => {
  if (!student) return null;

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150]" 
      />
      <motion.div 
        initial={{ y: '100%' }} 
        animate={{ y: 0 }} 
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-[80px] inset-x-0 bottom-0 lg:left-auto lg:right-0 lg:inset-y-0 w-full lg:max-w-[480px] bg-white dark:bg-gray-900 z-[160] shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 flex items-center justify-center text-brand-gold font-bold text-xl">
              {student.fullName?.charAt(0)}
            </div>
            <div>
              <h3 className="text-xl font-display font-bold dark:text-white">{student.fullName}</h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                ID: #{student.id} • {student.enrollment?.category || 'Non classé'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-12">
          {/* Main Info Grid */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date de naissance</p>
              <div className="flex items-center gap-2 text-sm dark:text-gray-200">
                <Calendar size={14} className="text-brand-gold" />
                <span>{new Date(student.dateOfBirth).toLocaleDateString('fr-FR')}</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sexe</p>
              <div className="flex items-center gap-2 text-sm dark:text-gray-200">
                <User size={14} className="text-brand-gold" />
                <span>{student.sex === 'M' ? 'Masculin' : 'Féminin'}</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Téléphone</p>
              <div className="flex items-center gap-2 text-sm dark:text-gray-200">
                <Phone size={14} className="text-brand-gold" />
                <span>{student.phone || 'Non renseigné'}</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ville</p>
              <div className="flex items-center gap-2 text-sm dark:text-gray-200">
                <MapPin size={14} className="text-brand-gold" />
                <span>{student.city} ({student.region})</span>
              </div>
            </div>
          </div>

          {/* Academic & Sports Section */}
          <div className="space-y-4">
            <div className="p-5 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800/30">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen size={18} className="text-blue-500" />
                <h4 className="text-sm font-bold dark:text-white uppercase tracking-wider">Parcours Scolaire</h4>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Établissement</span>
                  <span className="font-semibold dark:text-gray-200">{student.school}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Classe</span>
                  <span className="font-semibold dark:text-gray-200">{student.classLevel}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Moyenne</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{student.averageGrade}/20</span>
                </div>
              </div>
            </div>

            <div className="p-5 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-800/30">
              <div className="flex items-center gap-3 mb-4">
                <Trophy size={18} className="text-amber-500" />
                <h4 className="text-sm font-bold dark:text-white uppercase tracking-wider">Parcours Sportif</h4>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Poste(s)</span>
                  <span className="font-semibold dark:text-gray-200">
                    {student.positions ? JSON.parse(student.positions).join(', ') : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Club Actuel</span>
                  <span className="font-semibold dark:text-gray-200">{student.currentClub || 'Libre'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Expérience</span>
                  <span className="font-semibold dark:text-gray-200">{student.yearsOfPractice} ans</span>
                </div>
              </div>
            </div>
          </div>

          {/* Parent Info */}
          <div className="p-5 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700">
             <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Contact Parent/Tuteur</h4>
             <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold dark:text-white">{student.parentName}</span>
                <span className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-[10px] font-bold uppercase">{student.parentRelation}</span>
             </div>
             <p className="text-xs text-gray-500 mb-1">{student.parentProfession}</p>
             <p className="text-sm font-medium dark:text-gray-300">{student.parentPhone}</p>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default function Eleves() {
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const data = await api.students.list();
      setStudents(data.students);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchesSearch = s.fullName?.toLowerCase().includes(search.toLowerCase()) || 
                           s.city?.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || s.enrollment?.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [students, search, categoryFilter]);

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold dark:text-white">Annuaire des Élèves</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Liste complète des académiciens inscrits à CFAZ.</p>
        </div>
        <button className="hidden lg:flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-sm font-bold dark:text-white shadow-sm hover:shadow-md transition-all">
          <Download size={18} /> Télécharger Annuaire
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, ville..." 
            className="w-full pl-12 pr-4 py-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-800 rounded-2xl text-sm dark:text-white focus:border-brand-gold outline-none shadow-sm transition-all"
          />
        </div>
        <div className="flex gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
          {['all', 'U13', 'U15', 'U17'].map(cat => (
            <button 
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={cn(
                "px-6 py-4 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all border whitespace-nowrap",
                categoryFilter === cat 
                  ? "bg-brand-gold text-brand-blue border-brand-gold shadow-lg shadow-brand-gold/20" 
                  : "bg-white/50 dark:bg-gray-800/50 text-gray-500 border-white/30 dark:border-gray-800 hover:border-brand-gold"
              )}
            >
              {cat === 'all' ? 'Toutes Catégories' : cat}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 className="w-12 h-12 text-brand-gold animate-spin mb-4" />
          <p className="text-gray-500 font-medium animate-pulse">Chargement de l'annuaire...</p>
        </div>
      ) : filteredStudents.length > 0 ? (
        /* Responsive Grid: Cards on mobile, Table or detailed Cards on Desktop */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredStudents.map((s, i) => (
            <motion.div 
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedStudent(s)}
              className="group bg-white dark:bg-gray-900/60 backdrop-blur-md border border-white dark:border-gray-800 p-6 rounded-[32px] shadow-sm hover:shadow-xl hover:border-brand-gold/50 transition-all cursor-pointer relative overflow-hidden"
            >
              {/* Background accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
              
              <div className="flex items-start justify-between relative z-10 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-2xl group-hover:scale-110 transition-transform">
                    {s.photo ? (
                      <img src={s.photo} alt={s.fullName} className="w-full h-full object-cover rounded-3xl" />
                    ) : (
                      s.fullName?.charAt(0)
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-display font-bold dark:text-white group-hover:text-brand-gold transition-colors">{s.fullName}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">#{s.id}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300" />
                      <span className="text-[10px] font-bold text-brand-gold uppercase tracking-widest">
                        {s.enrollment?.category || 'Non classé'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 relative z-10">
                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                  <MapPin size={16} className="shrink-0" />
                  <span className="truncate">{s.city}, {s.region}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                  <UserCheck size={16} className="shrink-0" />
                  <span className="truncate">Scolarité: {s.classLevel} ({s.averageGrade}/20)</span>
                </div>
                
                <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {s.positions && JSON.parse(s.positions).slice(0, 2).map((p: string) => (
                      <div key={p} className="h-6 px-2 bg-gray-100 dark:bg-gray-800 border border-white dark:border-gray-900 rounded-md text-[8px] font-bold flex items-center dark:text-gray-300 uppercase">
                        {p}
                      </div>
                    ))}
                    {s.positions && JSON.parse(s.positions).length > 2 && (
                      <div className="h-6 px-2 bg-brand-gold/10 text-brand-gold border border-white dark:border-gray-900 rounded-md text-[8px] font-bold flex items-center uppercase">
                        +{JSON.parse(s.positions).length - 2}
                      </div>
                    )}
                  </div>
                  <ChevronRight size={20} className="text-gray-300 group-hover:text-brand-gold group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
            <User size={32} className="text-gray-300" />
          </div>
          <h2 className="text-2xl font-bold dark:text-white mb-2">Aucun élève trouvé</h2>
          <p className="text-gray-500 max-w-sm">Désolé, nous n'avons trouvé aucun élève correspondant à vos critères de recherche.</p>
        </div>
      )}

      {/* Detail Modal/Drawer */}
      <AnimatePresence>
        {selectedStudent && (
          <StudentDetail 
            student={selectedStudent} 
            onClose={() => setSelectedStudent(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
