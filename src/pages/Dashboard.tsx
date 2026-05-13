import React from 'react';
import { 
  Users, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  MoreVertical,
  Trophy,
  UserPlus,
  BookOpen
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line
} from 'recharts';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

const kpis = [
  { label: 'Total Élèves', value: '124', change: '+12%', icon: Users, trend: 'up' },
  { label: 'Revenus Mensuels', value: '1.2M FCFA', change: '+5%', icon: TrendingUp, trend: 'up' },
  { label: 'Dépenses', value: '450K FCFA', change: '-2%', icon: TrendingDown, trend: 'down' },
  { label: 'Dossiers Incomplets', value: '08', change: 'En baisse', icon: AlertCircle, trend: 'down' },
];

const financialData = [
  { month: 'Jan', revenus: 800000, depenses: 400000 },
  { month: 'Feb', revenus: 950000, depenses: 420000 },
  { month: 'Mar', revenus: 1100000, depenses: 450000 },
  { month: 'Apr', revenus: 1200000, depenses: 480000 },
  { month: 'May', revenus: 1050000, depenses: 410000 },
  { month: 'Jun', revenus: 1300000, depenses: 500000 },
];

const studentPerformance = [
  { name: 'U13', sportif: 85, scolaire: 78 },
  { name: 'U15', sportif: 88, scolaire: 72 },
  { name: 'U17', sportif: 92, scolaire: 80 },
  { name: 'Seniors', sportif: 95, scolaire: 75 },
];

const recentActivity = [
  { id: 1, type: 'inscription', user: 'Jean-Paul M.', time: 'Il y a 2h', status: 'confirmé' },
  { id: 2, type: 'note', user: 'Samuel E. (U17)', time: 'Il y a 4h', status: 'moyenne 15.5/20' },
  { id: 3, type: 'paiement', user: 'Parent de Marc O.', time: 'Il y a 6h', status: 'validé' },
  { id: 4, type: 'besoin', user: 'Coach Zambo', time: 'Hier', status: 'en attente de 10 ballons' },
];

const StatCard = ({ label, value, change, icon: Icon, trend, progress, progressColor }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-gray-800 transition-all"
  >
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <div className="flex items-end justify-between">
      <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{value}</h3>
      <span className={cn(
        "text-xs font-bold",
        trend === 'up' ? "text-green-500" : trend === 'down' ? "text-red-500" : "text-slate-400"
      )}>
        {change}
      </span>
    </div>
    <div className="w-full bg-slate-100 dark:bg-gray-800 h-1 mt-4 rounded-full overflow-hidden">
      <div className={cn("h-full rounded-full transition-all duration-1000", progressColor)} style={{ width: `${progress}%` }}></div>
    </div>
  </motion.div>
);

export default function Dashboard() {
  const kpis = [
    { label: 'Élèves Actifs', value: '412', change: '+12%', trend: 'up', progress: 75, progressColor: 'bg-blue-500' },
    { label: 'Revenu Mensuel', value: '12.4M', change: 'CFA', trend: 'none', progress: 50, progressColor: 'bg-brand-gold' },
    { label: 'Performance Sport', value: '78%', change: '+5%', trend: 'up', progress: 78, progressColor: 'bg-green-500' },
    { label: 'Dossiers Incomplets', value: '14', change: 'Attention', trend: 'down', progress: 25, progressColor: 'bg-red-400' },
  ];

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-20">
      {/* Welcome */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold dark:text-white">Tableau de bord</h2>
          <p className="text-slate-500 dark:text-slate-400">Bienvenue, voici l'état actuel de l'académie.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-800 rounded-xl text-sm font-medium shadow-sm transition-all hover:bg-slate-50">
            Générer Rapport
          </button>
          <button className="px-4 py-2 bg-brand-blue text-white rounded-xl text-sm font-medium shadow-lg shadow-brand-blue/10 active:scale-95 transition-all">
            Nouvelle Inscription
          </button>
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => (
          <StatCard key={idx} {...kpi} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-8 rounded-3xl border border-slate-100 dark:border-gray-800 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold dark:text-white">Flux Financier (Année)</h3>
            <select className="bg-slate-100 dark:bg-gray-800 border-none rounded-lg text-xs font-semibold px-3 py-1 dark:text-white">
              <option>2026</option>
            </select>
          </div>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={financialData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FACC15" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#FACC15" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 600}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 600}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="revenus" stroke="#FACC15" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="depenses" stroke="#0F172A" strokeWidth={3} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories / Performance */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-slate-100 dark:border-gray-800 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold dark:text-white">Progression Globale</h3>
          </div>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studentPerformance} layout="vertical" barGap={8}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600, fill: '#64748b'}} width={60} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="sportif" fill="#FACC15" radius={[0, 4, 4, 0]} barSize={8} />
                <Bar dataKey="scolaire" fill="#0F172A" radius={[0, 4, 4, 0]} barSize={8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 space-y-3 px-2">
             <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-brand-gold"></div>
                <span className="text-[11px] text-slate-500 uppercase tracking-wider font-bold">Sportive</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-brand-blue"></div>
                <span className="text-[11px] text-slate-500 uppercase tracking-wider font-bold">Scolaire</span>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-1 bg-white dark:bg-gray-900 p-8 rounded-3xl border border-slate-100 dark:border-gray-800 shadow-sm flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold dark:text-white">Activités Récentes</h3>
            <button className="text-brand-gold hover:underline text-xs font-bold">Voir tout</button>
          </div>
          <div className="space-y-6 flex-1">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center gap-3">
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                  activity.type === 'inscription' ? "bg-blue-50 text-blue-500" :
                  activity.type === 'note' ? "bg-green-50 text-green-500" :
                  activity.type === 'paiement' ? "bg-yellow-50 text-yellow-600" : "bg-red-50 text-red-500"
                )}>
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold dark:text-white">{activity.user}</p>
                  <p className="text-[10px] text-slate-400">{activity.time} • {activity.status}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-slate-50 dark:border-gray-800">
            <button className="w-full py-2 bg-slate-50 dark:bg-gray-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-slate-100 transition-colors">
              Voir tout l'historique
            </button>
          </div>
        </div>

        {/* Quick Actions / Shortcuts */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-brand-blue p-8 rounded-3xl relative overflow-hidden group cursor-pointer">
             <div className="relative z-10">
                <h3 className="text-xl font-bold text-white mb-2">Nouvelle Inscription</h3>
                <p className="text-blue-200/60 text-sm mb-6 max-w-[200px]">Ajoutez rapidement un nouveau talent à l'académie.</p>
                <div className="w-12 h-12 bg-brand-gold rounded-2xl flex items-center justify-center text-brand-blue group-hover:rotate-12 transition-transform">
                  <UserPlus className="w-6 h-6" />
                </div>
             </div>
             <div className="absolute top-0 right-0 w-48 h-full opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                <Trophy className="w-full h-full text-white" />
             </div>
          </div>

          <div className="bg-brand-gold p-8 rounded-3xl relative overflow-hidden group cursor-pointer">
             <div className="relative z-10">
                <h3 className="text-xl font-bold text-brand-blue mb-2">Saisie des Notes</h3>
                <p className="text-brand-blue/60 text-sm mb-6 max-w-[200px]">Mettez à jour les résultats scolaires du trimestre.</p>
                <div className="w-12 h-12 bg-brand-blue rounded-2xl flex items-center justify-center text-brand-gold group-hover:-rotate-12 transition-transform">
                  <BookOpen className="w-6 h-6" />
                </div>
             </div>
             <div className="absolute top-0 right-0 w-48 h-full opacity-20 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                <Users className="w-full h-full text-brand-blue" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
