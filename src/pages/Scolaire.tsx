import React from 'react';
import { BookOpen, GraduationCap, ArrowUpRight, TrendingUp, Search, Filter } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const stats = [
  { label: 'Moyenne Générale', value: '14.25', change: '+0.5', trend: 'up' },
  { label: 'Taux Réussite', value: '92%', change: '+2%', trend: 'up' },
  { label: 'Absences Total', value: '24', change: '-10%', trend: 'down' },
];

const data = [
  { month: 'T1', u13: 13, u15: 14, u17: 15 },
  { month: 'T2', u13: 13.5, u15: 14.2, u17: 14.8 },
  { month: 'T3', u13: 14.2, u15: 15, u17: 15.5 },
];

export default function Scolaire() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold dark:text-white">Suivi Scolaire</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Surveillez les performances académiques des pensionnaires.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
             <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">{stat.label}</p>
             <div className="flex items-end justify-between">
                <p className="text-3xl font-bold dark:text-white">{stat.value}</p>
                <span className={`text-xs font-bold ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                   {stat.change}
                </span>
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-[24px] border border-gray-100 dark:border-gray-800 shadow-sm">
          <h3 className="text-lg font-bold mb-6 dark:text-white">Tendances des Moyennes</h3>
          <div className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                   <XAxis dataKey="month" axisLine={false} tickLine={false} />
                   <YAxis hide domain={[10, 20]} />
                   <Tooltip />
                   <Area type="monotone" dataKey="u17" stroke="#D4AF37" fill="#D4AF37" fillOpacity={0.1} strokeWidth={3} />
                   <Area type="monotone" dataKey="u15" stroke="#0A192F" fill="#0A192F" fillOpacity={0.05} strokeWidth={2} />
                </AreaChart>
             </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-[24px] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
           <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <h3 className="text-lg font-bold dark:text-white">Bulletins en Attente</h3>
              <button className="text-[10px] font-bold text-brand-gold uppercase underline">Voir tout</button>
           </div>
           <div className="divide-y divide-gray-50 dark:divide-gray-800">
              {[
                { name: 'Samuel Ndongo', cat: 'U13', msg: 'Bulletin du 2ème trimestre manquant' },
                { name: 'Kevin Song', cat: 'U15', msg: 'Notes d\'examen à valider' },
              ].map((item, i) => (
                <div key={i} className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-brand-gold/10 rounded-xl flex items-center justify-center text-brand-gold">
                         <GraduationCap size={20} />
                      </div>
                      <div>
                         <p className="text-sm font-bold dark:text-white">{item.name} <span className="text-[10px] text-brand-gold ml-2 uppercase tracking-tighter">{item.cat}</span></p>
                         <p className="text-xs text-gray-400 mt-0.5">{item.msg}</p>
                      </div>
                   </div>
                   <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs font-bold dark:text-white">Relancer</button>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
