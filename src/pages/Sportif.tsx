import React, { useState, useMemo } from 'react';
import {
  Trophy, Dumbbell, Activity, AlertTriangle, Users, Flame, Clock, TrendingUp,
  Loader2, Calendar, Heart, User, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { api, getCurrentAcademicYear } from '@/lib/api';
import TrainingTab from '@/components/sport/TrainingTab';
import PhysicalTestsTab from '@/components/sport/PhysicalTestsTab';
import InjuriesTab from '@/components/sport/InjuriesTab';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer
} from 'recharts';

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: Trophy },
  { id: 'training', label: 'Séances', icon: Dumbbell },
  { id: 'tests', label: 'Tests Physiques', icon: Activity },
  { id: 'injuries', label: 'Blessures', icon: AlertTriangle },
];

export default function Sportif() {
  const [tab, setTab] = useState('dashboard');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const catParam = categoryFilter !== 'all' ? categoryFilter : undefined;

  const { data, isLoading: loading, refetch: fetchAll } = useQuery({
    queryKey: ['sportData', catParam, selectedStudentId],
    queryFn: async () => {
      const [enrData, sessData, testsData, injData, statsData] = await Promise.all([
        api.enrollments.list(),
        api.training.list({ category: catParam }),
        api.physicalTests.list({ category: catParam }),
        api.injuries.list({ category: catParam }),
        api.sportStats.get({ category: catParam, studentId: selectedStudentId || undefined }),
      ]);
      return {
        enrollments: enrData.enrollments,
        sessions: sessData.sessions,
        tests: testsData.tests,
        injuriesList: injData.injuries,
        stats: statsData,
      };
    },
  });

  const enrollments = data?.enrollments || [];
  const sessions = data?.sessions || [];
  const tests = data?.tests || [];
  const injuriesList = data?.injuriesList || [];
  const stats = data?.stats || null;

  // Radar Data preparation
  const radarData = useMemo(() => {
    if (!stats?.teamAverages) return [];
    
    const p = stats.playerLatest || {};
    const t = stats.teamAverages || {};

    // Helper to normalize/invert metrics where lower is better (Sprint, Agility)
    // We'll use a simple 0-100 scale for visualization purposes
    const getVal = (val: any, isInverse = false) => {
      if (val === null || val === undefined) return 0;
      if (isInverse) return Math.max(0, 100 - (val * 10)); // Rough inversion for 3-10s range
      return val;
    };

    return [
      { subject: 'Vitesse', A: getVal(t.avgSprint, true), B: getVal(p.sprint30m, true), fullMark: 100 },
      { subject: 'Endurance', A: getVal(t.avgYoyo) * 5, B: getVal(p.yoyoTest) * 5, fullMark: 100 },
      { subject: 'Détente', A: getVal(t.avgJump), B: getVal(p.verticalJump), fullMark: 100 },
      { subject: 'Agilité', A: getVal(t.avgAgility, true), B: getVal(p.agility, true), fullMark: 100 },
      { subject: 'Force', A: getVal(t.avgStrength), B: getVal(p.strength), fullMark: 100 },
      { subject: 'VMA', A: getVal(t.avgVma) * 5, B: getVal(p.vma) * 5, fullMark: 100 },
    ];
  }, [stats]);

  const activeInjuries = injuriesList.filter((i: any) => !(i.injury || i).dateReturn);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold dark:text-white">Suivi Sportif</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Performance, entraînements et santé des joueurs.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-50 dark:bg-gray-900 p-1 rounded-2xl">
            {['all', 'U13', 'U15', 'U17', 'U20'].map(cat => (
              <button key={cat} onClick={() => setCategoryFilter(cat)}
                className={cn("px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                  categoryFilter === cat ? "bg-white dark:bg-gray-800 text-brand-gold shadow-sm" : "text-gray-400")}>
                {cat === 'all' ? 'Tous' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 p-1.5 bg-gray-50 dark:bg-gray-900 rounded-2xl overflow-x-auto">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={cn("flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap",
              tab === t.id ? "bg-white dark:bg-gray-800 text-brand-gold shadow-sm" : "text-gray-400 hover:text-gray-600")}>
            <t.icon size={14} />
            {t.label}
            {t.id === 'injuries' && activeInjuries.length > 0 && (
              <span className="w-5 h-5 bg-red-500 text-white rounded-full text-[9px] flex items-center justify-center">{activeInjuries.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-brand-gold" />
          <p className="text-sm text-gray-400">Chargement des données sportives...</p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {tab === 'dashboard' && (
            <motion.div key="dash" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-900 p-6 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-500 mb-4">
                    <Flame size={24} />
                  </div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Charge Moy. / Semaine</p>
                  <p className="text-3xl font-display font-bold dark:text-white">{stats?.weeklyLoad?.avgLoad || '0'} <span className="text-sm text-gray-400">UA</span></p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                  className="bg-white dark:bg-gray-900 p-6 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 mb-4">
                    <Clock size={24} />
                  </div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Séances (7 jours)</p>
                  <p className="text-3xl font-display font-bold dark:text-white">{stats?.weeklyLoad?.totalSessions || 0}</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  className="bg-white dark:bg-gray-900 p-6 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-500 mb-4">
                    <Activity size={24} />
                  </div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Tests Enregistrés</p>
                  <p className="text-3xl font-display font-bold dark:text-white">{tests.length}</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  className="bg-white dark:bg-gray-900 p-6 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4",
                    activeInjuries.length > 0 ? "bg-red-50 dark:bg-red-900/20 text-red-500" : "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500")}>
                    {activeInjuries.length > 0 ? <AlertTriangle size={24} /> : <Heart size={24} />}
                  </div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Blessures Actives</p>
                  <p className={cn("text-3xl font-display font-bold", activeInjuries.length > 0 ? "text-red-500" : "text-emerald-500 dark:text-emerald-400")}>{activeInjuries.length}</p>
                </motion.div>
              </div>

              {/* Quick Access Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Sessions */}
                <div className="bg-white dark:bg-gray-900 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <h4 className="text-sm font-bold dark:text-white uppercase tracking-wider">Dernières Séances</h4>
                    <button onClick={() => setTab('training')} className="text-[10px] font-bold text-brand-gold uppercase hover:underline">Tout voir</button>
                  </div>
                  <div className="divide-y divide-gray-50 dark:divide-gray-800">
                    {sessions.slice(0, 4).map((s: any) => {
                      const sess = s.session || s;
                      return (
                        <div key={sess.id} className="p-4 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-brand-gold/10 flex items-center justify-center text-brand-gold text-[10px] font-bold">{sess.rpe}</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold dark:text-white truncate">{s.studentName}</p>
                            <p className="text-[10px] text-gray-400">{sess.date} • {sess.duration}min</p>
                          </div>
                          <p className="text-sm font-bold text-brand-gold">{sess.load} UA</p>
                        </div>
                      );
                    })}
                    {sessions.length === 0 && <p className="p-6 text-center text-gray-400 text-xs">Aucune séance</p>}
                  </div>
                </div>

                {/* Recent Tests */}
                <div className="bg-white dark:bg-gray-900 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <h4 className="text-sm font-bold dark:text-white uppercase tracking-wider">Derniers Tests</h4>
                    <button onClick={() => setTab('tests')} className="text-[10px] font-bold text-brand-gold uppercase hover:underline">Tout voir</button>
                  </div>
                  <div className="divide-y divide-gray-50 dark:divide-gray-800">
                    {tests.slice(0, 4).map((t: any) => {
                      const test = t.test || t;
                      return (
                        <div key={test.id} className="p-4 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-500"><Activity size={14} /></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold dark:text-white truncate">{t.studentName}</p>
                            <p className="text-[10px] text-gray-400">{test.date}</p>
                          </div>
                          {test.sprint30m && <span className="text-[10px] font-bold text-indigo-500">⚡ {test.sprint30m}s</span>}
                        </div>
                      );
                    })}
                    {tests.length === 0 && <p className="p-6 text-center text-gray-400 text-xs">Aucun test</p>}
                  </div>
                </div>

                {/* Active Injuries */}
                <div className="bg-white dark:bg-gray-900 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <h4 className="text-sm font-bold dark:text-white uppercase tracking-wider">Infirmerie</h4>
                    <button onClick={() => setTab('injuries')} className="text-[10px] font-bold text-brand-gold uppercase hover:underline">Tout voir</button>
                  </div>
                  <div className="divide-y divide-gray-50 dark:divide-gray-800">
                    {activeInjuries.slice(0, 4).map((item: any) => {
                      const inj = item.injury || item;
                      const days = Math.ceil((Date.now() - new Date(inj.dateInjury).getTime()) / 86400000);
                      return (
                        <div key={inj.id} className="p-4 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500"><AlertTriangle size={14} /></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold dark:text-white truncate">{item.studentName}</p>
                            <p className="text-[10px] text-gray-400 capitalize">{inj.type} • {inj.zone}</p>
                          </div>
                          <span className="text-[10px] font-bold text-red-500">{days}j</span>
                        </div>
                      );
                    })}
                    {activeInjuries.length === 0 && (
                      <div className="p-6 text-center">
                        <Heart size={24} className="mx-auto text-emerald-400 mb-2" />
                        <p className="text-xs text-emerald-500 font-bold">Tous aptes !</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Comparison Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Player Selector & Summary */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-white dark:bg-gray-900 p-6 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm">
                    <h4 className="text-sm font-bold dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                      <User size={16} className="text-brand-gold" /> Sélection Joueur
                    </h4>
                    <div className="relative">
                      <select 
                        value={selectedStudentId || ''} 
                        onChange={e => setSelectedStudentId(e.target.value ? Number(e.target.value) : null)}
                        className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl text-sm font-bold dark:text-white outline-none appearance-none border border-transparent focus:border-brand-gold transition-all"
                      >
                        <option value="">Sélectionner un joueur...</option>
                        {enrollments.map((e: any) => (
                          <option key={e.id} value={e.studentId}>{e.student?.fullName}</option>
                        ))}
                      </select>
                      <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>

                    {selectedStudentId && stats?.playerLatest ? (
                      <div className="mt-6 p-4 bg-brand-gold/5 rounded-2xl border border-brand-gold/10">
                        <p className="text-[10px] font-bold text-brand-gold uppercase tracking-widest mb-2">Dernier test enregistré</p>
                        <p className="text-xs font-bold dark:text-white">{stats.playerLatest.date}</p>
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          <div className="p-2 bg-white dark:bg-gray-800 rounded-lg">
                            <p className="text-[8px] text-gray-400 uppercase">VMA</p>
                            <p className="text-sm font-bold text-brand-gold">{stats.playerLatest.vma || '--'} <span className="text-[8px]">km/h</span></p>
                          </div>
                          <div className="p-2 bg-white dark:bg-gray-800 rounded-lg">
                            <p className="text-[8px] text-gray-400 uppercase">Sprint</p>
                            <p className="text-sm font-bold text-brand-gold">{stats.playerLatest.sprint30m || '--'} <span className="text-[8px]">s</span></p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-6 p-8 text-center border-2 border-dashed border-gray-50 dark:border-gray-800 rounded-2xl">
                        <p className="text-xs text-gray-400">Sélectionnez un joueur pour comparer ses performances à la moyenne de l'équipe.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Radar Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-6 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm min-h-[400px] flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-bold dark:text-white uppercase tracking-wider">Profil de Performance</h4>
                    <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
                      <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-gray-300"></div> Équipe</div>
                      <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-brand-gold"></div> Joueur</div>
                    </div>
                  </div>
                  
                  <div className="flex-1 w-full min-h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                        <PolarGrid stroke="#e5e7eb" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 'bold' }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar
                          name="Moyenne Équipe"
                          dataKey="A"
                          stroke="#9ca3af"
                          fill="#9ca3af"
                          fillOpacity={0.2}
                        />
                        <Radar
                          name="Joueur"
                          dataKey="B"
                          stroke="#EAB308"
                          fill="#EAB308"
                          fillOpacity={0.5}
                        />
                        <Tooltip 
                          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* CTA Banner */}
              <div className="bg-brand-blue rounded-[32px] p-8 lg:p-12 relative overflow-hidden text-white">
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 flex items-center justify-center pointer-events-none">
                  <Trophy size={400} />
                </div>
                <div className="relative z-10 max-w-xl">
                  <h3 className="text-2xl font-display font-bold mb-3">Centre de Formation CFAZ</h3>
                  <p className="text-blue-100/60 mb-6 text-sm">Suivi scientifique de la performance basé sur la méthode Foster (RPE × Durée), les tests physiques standardisés et le monitoring des blessures.</p>
                  <div className="flex gap-3">
                    <button onClick={() => setTab('training')} className="bg-brand-gold text-brand-blue font-bold px-6 py-3 rounded-2xl text-sm flex items-center gap-2 hover:scale-105 transition-transform shadow-xl">
                      <Dumbbell size={18} /> Saisir une séance
                    </button>
                    <button onClick={() => setTab('tests')} className="bg-white/10 text-white font-bold px-6 py-3 rounded-2xl text-sm flex items-center gap-2 hover:bg-white/20 transition-all">
                      <Activity size={18} /> Nouveau test
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {tab === 'training' && (
            <motion.div key="train" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <TrainingTab enrollments={enrollments} sessions={sessions} onRefresh={fetchAll} />
            </motion.div>
          )}

          {tab === 'tests' && (
            <motion.div key="tests" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <PhysicalTestsTab enrollments={enrollments} tests={tests} onRefresh={fetchAll} />
            </motion.div>
          )}

          {tab === 'injuries' && (
            <motion.div key="injuries" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <InjuriesTab enrollments={enrollments} injuriesList={injuriesList} onRefresh={fetchAll} />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
