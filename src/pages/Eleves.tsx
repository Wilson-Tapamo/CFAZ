import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  MapPin, 
  Calendar, 
  Activity,
  GraduationCap,
  Trophy,
  Wallet,
  Phone,
  Mail,
  User as UserIcon,
  ChevronRight,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

const students = [
  { id: 'S001', name: 'Albert Moukandjo', age: 14, category: 'U15', status: 'interne', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Albert' },
  { id: 'S002', name: 'Benjamin Toko', age: 15, category: 'U15', status: 'externe', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Benjamin' },
  { id: 'S003', name: 'Claude Onguene', age: 13, category: 'U13', status: 'interne', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Claude' },
  { id: 'S004', name: 'David Eto\'o', age: 16, category: 'U17', status: 'interne', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David' },
];

const athleticData = [
  { subject: 'Vitesse', A: 85, fullMark: 100 },
  { subject: 'Endurance', A: 92, fullMark: 100 },
  { subject: 'Technique', A: 78, fullMark: 100 },
  { subject: 'Discipline', A: 95, fullMark: 100 },
  { subject: 'Force', A: 70, fullMark: 100 },
];

const academicHistory = [
  { trim: 'T1 2025', moyenne: 14.2 },
  { trim: 'T2 2025', moyenne: 13.8 },
  { trim: 'T3 2025', moyenne: 15.1 },
  { trim: 'T1 2026', moyenne: 14.8 },
];

export default function Eleves() {
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold dark:text-white">Élèves</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Gérez le registre complet des pensionnaires de l'académie.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl px-4 py-2 text-sm font-medium shadow-sm">
             <UsersIcon className="w-4 h-4 text-brand-gold mr-2" />
             <span className="dark:text-white">124 Élèves inscrits</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Student List */}
        <div className="lg:col-span-4 space-y-4">
           <div className="flex items-center gap-3 bg-white dark:bg-gray-900 rounded-2xl p-2 border border-gray-100 dark:border-gray-800 shadow-sm">
              <Search className="w-4 h-4 text-gray-400 ml-2" />
              <input type="text" placeholder="Rechercher..." className="bg-transparent border-none focus:ring-0 text-sm flex-1" />
           </div>
           
           <div className="space-y-3">
              {students.map((student) => (
                <motion.div 
                  key={student.id}
                  whileHover={{ x: 4 }}
                  onClick={() => setSelectedStudent(student)}
                  className={cn(
                    "p-4 rounded-3xl border transition-all cursor-pointer flex items-center gap-4 group",
                    selectedStudent?.id === student.id 
                      ? "bg-brand-blue text-white border-brand-blue shadow-lg shadow-brand-blue/20" 
                      : "bg-white dark:bg-gray-900 border-slate-100 dark:border-gray-800 hover:border-brand-gold/30"
                  )}
                >
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden relative border-2 border-transparent group-hover:border-brand-gold transition-all">
                     <img src={student.image} alt={student.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                     <p className="text-sm font-bold truncate">{student.name}</p>
                     <div className="flex items-center gap-2 mt-1">
                        <span className={cn(
                          "text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider",
                          selectedStudent?.id === student.id ? "bg-white/20 text-white" : "bg-brand-gold/10 text-brand-gold"
                        )}>
                          {student.category}
                        </span>
                        <span className="text-[10px] opacity-60 font-medium">#{student.id}</span>
                     </div>
                  </div>
                  <ChevronRight size={16} className={cn("transition-transform", selectedStudent?.id === student.id ? "translate-x-1" : "text-slate-300")} />
                </motion.div>
              ))}
           </div>
        </div>

        {/* Student Detail View */}
        <div className="lg:col-span-8">
           <AnimatePresence mode="wait">
              {selectedStudent ? (
                <motion.div 
                  key={selectedStudent.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white dark:bg-gray-900 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden"
                >
                  {/* Profile Header */}
                  <div className="bg-brand-blue p-8 lg:p-12 relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                     
                     <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                        <div className="w-32 h-32 rounded-3xl bg-white p-1 border-4 border-white/20 shadow-2xl relative overflow-hidden shrink-0">
                           <img src={selectedStudent.image} alt={selectedStudent.name} className="w-full h-full object-cover rounded-2xl" />
                        </div>
                        <div className="text-center md:text-left flex-1">
                           <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                              <span className="px-3 py-1 bg-brand-gold text-brand-blue text-[10px] font-bold rounded-full uppercase tracking-widest">Élite Académie</span>
                              <span className="px-3 py-1 bg-white/10 text-white border border-white/20 text-[10px] font-bold rounded-full uppercase tracking-widest">{selectedStudent.status}</span>
                           </div>
                           <h2 className="text-3xl font-display font-bold text-white mb-2">{selectedStudent.name}</h2>
                           <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-blue-100/60 text-sm font-medium">
                              <div className="flex items-center gap-2"><MapPin size={14} /> Yaoundé, CMR</div>
                              <div className="flex items-center gap-2"><Calendar size={14} /> Né le 12 Juin 2012 ({selectedStudent.age} ans)</div>
                              <div className="flex items-center gap-2"><Activity size={14} /> Groupe O+</div>
                           </div>
                        </div>
                        <div className="flex gap-2">
                           <button className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl text-white transition-colors"><Mail size={18} /></button>
                           <button className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl text-white transition-colors"><Phone size={18} /></button>
                           <button className="p-3 bg-brand-gold text-brand-blue rounded-2xl font-bold text-sm px-6">Editer</button>
                        </div>
                     </div>
                  </div>

                  {/* Tabs */}
                  <div className="border-b border-gray-100 dark:border-gray-800 px-8">
                     <div className="flex items-center gap-8">
                        {[
                          { id: 'general', label: 'Général', icon: UserIcon },
                          { id: 'scolaire', label: 'Scolaire', icon: GraduationCap },
                          { id: 'sportif', label: 'Sportif', icon: Trophy },
                          { id: 'financier', label: 'Financier', icon: Wallet },
                        ].map((tab) => (
                          <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                              "py-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider relative transition-colors",
                              activeTab === tab.id ? "text-brand-gold" : "text-gray-400 hover:text-gray-600"
                            )}
                          >
                            <tab.icon size={16} />
                            {tab.label}
                            {activeTab === tab.id && (
                              <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-brand-gold rounded-t-full" />
                            )}
                          </button>
                        ))}
                     </div>
                  </div>

                  {/* Tab Content */}
                  <div className="p-8 lg:p-12">
                     {activeTab === 'general' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                           <div className="space-y-6">
                              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Informations Personnelles</h3>
                              <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                                <div>
                                   <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Tuteur Légal</p>
                                   <p className="text-sm font-semibold dark:text-white">M. Samuel Moukandjo</p>
                                </div>
                                <div>
                                   <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Profession</p>
                                   <p className="text-sm font-semibold dark:text-white">Opérateur Logistique</p>
                                </div>
                                <div>
                                   <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Contact Tuteur</p>
                                   <p className="text-sm font-semibold dark:text-white">+237 6XX XX XX XX</p>
                                </div>
                                <div>
                                   <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Quartier</p>
                                   <p className="text-sm font-semibold dark:text-white">Bastos, Yaoundé</p>
                                </div>
                              </div>
                           </div>
                           <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-3xl border border-gray-100 dark:border-gray-800">
                               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Checklist Dossier</h3>
                               <div className="space-y-3">
                                  {['Acte de Naissance', 'Carnet de Santé', 'Bulletins 2024', 'Fiche d\'inscription'].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                       <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white">
                                          <Activity size={12} /> {/* Hacky checkmark */}
                                       </div>
                                       <span className="text-sm font-medium dark:text-gray-300">{item}</span>
                                    </div>
                                  ))}
                               </div>
                           </div>
                        </div>
                     )}

                     {activeTab === 'scolaire' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                           <div className="space-y-6">
                              <div className="flex items-center justify-between">
                                 <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Evolution des Moyennes</h3>
                                 <div className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase">Progression Positive</div>
                              </div>
                              <div className="h-[200px] w-full">
                                 <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={academicHistory}>
                                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                       <XAxis dataKey="trim" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#6B7280'}} />
                                       <YAxis domain={[10, 20]} axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#6B7280'}} />
                                       <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                       <Line type="monotone" dataKey="moyenne" stroke="#D4AF37" strokeWidth={3} dot={{ r: 4, fill: '#D4AF37' }} activeDot={{ r: 6 }} />
                                    </LineChart>
                                 </ResponsiveContainer>
                              </div>
                           </div>
                           <div className="space-y-3">
                              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Derniers Bulletins</h3>
                              {[
                                { title: 'Trimestre 1 2026', note: '14.8/20', status: 'Excellent' },
                                { title: 'Trimestre 3 2025', note: '15.1/20', status: 'Félicitations' },
                              ].map((b, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 group hover:border-brand-gold transition-colors">
                                   <div>
                                      <p className="text-sm font-bold dark:text-white">{b.title}</p>
                                      <p className="text-[10px] text-gray-500 font-bold uppercase">{b.status}</p>
                                   </div>
                                   <div className="text-right">
                                      <p className="text-lg font-bold text-brand-gold">{b.note}</p>
                                      <button className="text-[10px] text-gray-400 hover:text-brand-gold font-bold uppercase underline">Voir PDF</button>
                                   </div>
                                </div>
                              ))}
                           </div>
                        </div>
                     )}

                     {activeTab === 'sportif' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                           <div className="h-[300px] w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={athleticData}>
                                  <PolarGrid stroke="#E5E7EB" />
                                  <PolarAngleAxis dataKey="subject" tick={{fontSize: 10, fontWeight: 600, fill: '#6B7280'}} />
                                  <PolarRadiusAxis angle={30} domain={[0, 100]} axisLine={false} tick={false} />
                                  <Radar name={selectedStudent.name} dataKey="A" stroke="#FACC15" strokeWidth={2} fill="#FACC15" fillOpacity={0.6} />
                                </RadarChart>
                              </ResponsiveContainer>
                           </div>
                           <div className="space-y-4">
                              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Points Forts & Axes de Travail</h3>
                              <div className="space-y-3">
                                 <div className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/20 rounded-2xl">
                                    <p className="text-[10px] text-green-700 dark:text-green-400 font-bold uppercase tracking-widest mb-1">Forces</p>
                                    <p className="text-xs font-medium dark:text-gray-300">Excellente vision de jeu, dépassement de soi et endurance au dessus du lot.</p>
                                 </div>
                                 <div className="p-4 bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/20 rounded-2xl">
                                    <p className="text-[10px] text-orange-700 dark:text-orange-400 font-bold uppercase tracking-widest mb-1">Axes de Travail</p>
                                    <p className="text-xs font-medium dark:text-gray-300">Travail à intensifier sur le pied faible et la finition devant le but.</p>
                                 </div>
                              </div>
                           </div>
                        </div>
                     )}

                     {activeTab === 'financier' && (
                        <div className="space-y-6">
                           <div className="grid grid-cols-3 gap-6">
                               <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800">
                                  <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Total Payé</p>
                                  <p className="text-lg font-bold dark:text-white">450.000 FCFA</p>
                               </div>
                               <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800">
                                  <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Reste à Payer</p>
                                  <p className="text-lg font-bold text-red-500 text-brand-gold">50.000 FCFA</p>
                               </div>
                               <div className="p-4 bg-brand-gold/10 rounded-2xl border border-brand-gold/20">
                                  <p className="text-[10px] text-brand-gold font-bold uppercase mb-1">Bourse</p>
                                  <p className="text-lg font-bold text-brand-gold">Demi-bourse</p>
                               </div>
                           </div>
                           <table className="w-full text-left text-sm">
                              <thead>
                                 <tr className="text-gray-400 uppercase text-[10px] font-bold tracking-widest border-b border-gray-100 dark:border-gray-800">
                                    <th className="py-4">Date</th>
                                    <th className="py-4">Description</th>
                                    <th className="py-4 text-right">Montant</th>
                                 </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                 <tr>
                                    <td className="py-4 text-gray-500">10 Mar 2026</td>
                                    <td className="py-4 font-medium dark:text-white">Pension et Internat - T2</td>
                                    <td className="py-4 text-right font-bold">150.000 FCFA</td>
                                 </tr>
                                 <tr>
                                    <td className="py-4 text-gray-500">05 Jan 2026</td>
                                    <td className="py-4 font-medium dark:text-white">Uniforme et Equipements</td>
                                    <td className="py-4 text-right font-bold">45.000 FCFA</td>
                                 </tr>
                              </tbody>
                           </table>
                        </div>
                     )}
                  </div>
                </motion.div>
              ) : (
                <div className="h-full min-h-[600px] flex flex-col items-center justify-center bg-white dark:bg-gray-900 rounded-[32px] border border-dashed border-gray-200 dark:border-gray-800 transition-all">
                   <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                      <UserIcon size={32} className="text-gray-300" />
                   </div>
                   <h3 className="text-xl font-display font-bold dark:text-white mb-2">Sélectionnez un élève</h3>
                   <p className="text-gray-500 dark:text-gray-400 text-sm max-w-[280px] text-center">Cliquez sur un profil dans la liste de gauche pour voir les détails complets.</p>
                </div>
              )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

const UsersIcon = (props: any) => <Users {...props} />;
