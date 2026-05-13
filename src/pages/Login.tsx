import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, Trophy, Zap, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await login(email, password);
    if (!result.success) {
      setError(result.error || 'Erreur de connexion');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-sans overflow-hidden relative">
      {/* Animated gradient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[5%] right-[-5%] w-[50%] h-[50%] bg-brand-gold/10 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] left-[50%] w-[30%] h-[30%] bg-pink-500/8 rounded-full blur-[100px]" />
        <div className="absolute bottom-[30%] left-[10%] w-[25%] h-[25%] bg-emerald-500/8 rounded-full blur-[100px]" />
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl rounded-[32px] overflow-hidden shadow-2xl relative z-10 border border-white/30 dark:border-gray-800">

        {/* Left Side - Info */}
        <div className="hidden md:flex flex-col justify-between p-12 bg-brand-blue text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-[20%] right-[-10%] w-[300px] h-[300px] bg-brand-gold rounded-full blur-[80px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[200px] h-[200px] bg-indigo-500 rounded-full blur-[60px]" />
          </div>
          <div className="relative z-10">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
              className="w-12 h-12 bg-brand-gold rounded-xl flex items-center justify-center mb-12">
              <span className="text-brand-blue font-bold text-xl">Z</span>
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="text-4xl font-display font-bold leading-tight mb-6">
              Construisons <span className="text-brand-gold">l'Avenir</span> du Football Camerounais.
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              className="text-blue-100/60 leading-relaxed max-w-sm">
              Gérez votre académie avec précision, discipline et innovation.
            </motion.p>
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
            className="grid grid-cols-2 gap-8 relative z-10">
            <div>
              <p className="text-2xl font-bold text-brand-gold">120+</p>
              <p className="text-xs text-blue-100/40 uppercase font-bold tracking-widest">Élèves</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-gold">15+</p>
              <p className="text-xs text-blue-100/40 uppercase font-bold tracking-widest">Coachs</p>
            </div>
          </motion.div>
          <div className="absolute bottom-0 right-0 w-full h-full opacity-10 pointer-events-none flex items-end justify-end p-8">
            <Trophy size={300} className="translate-x-1/4 translate-y-1/4 rotate-12" />
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="mb-10 block md:hidden">
              <div className="w-10 h-10 bg-brand-gold rounded-lg flex items-center justify-center mb-4">
                <span className="text-brand-blue font-bold text-lg">Z</span>
              </div>
            </div>
            <div className="mb-10">
              <h1 className="text-3xl font-display font-bold dark:text-white mb-2">Bienvenue.</h1>
              <p className="text-gray-500 text-sm">Connectez-vous à votre espace CFAZ.</p>
            </div>
          </motion.div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 rounded-2xl flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400 group-focus-within:text-brand-gold transition-colors" />
                </div>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@cfaz.cm"
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl py-4 pl-11 pr-4 focus:border-brand-gold transition-all text-sm dark:text-white" />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Mot de passe</label>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400 group-focus-within:text-brand-gold transition-colors" />
                </div>
                <input type={showPassword ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl py-4 pl-11 pr-12 focus:border-brand-gold transition-all text-sm dark:text-white" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-brand-gold">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </motion.div>

            <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              disabled={isLoading} type="submit"
              className="w-full bg-brand-blue dark:bg-brand-gold text-white dark:text-brand-blue font-bold py-4 rounded-2xl transition-all shadow-xl shadow-brand-blue/10 dark:shadow-brand-gold/10 hover:translate-y-[-2px] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50">
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Se Connecter <Zap size={18} /></>
              )}
            </motion.button>
          </form>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
            className="mt-12 flex items-center gap-4 py-6 px-6 bg-yellow-50 dark:bg-brand-gold/5 rounded-2xl border border-yellow-100 dark:border-brand-gold/10">
            <Zap size={20} className="text-brand-gold shrink-0" />
            <p className="text-[10px] text-brand-gold font-bold leading-normal uppercase">
              Accès réservé au personnel administratif de l'Académie Zo'o.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
