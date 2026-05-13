import React from 'react';
import { Search, Bell, Sun, Moon, LogOut, Menu } from 'lucide-react';
import { useThemeContext } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'motion/react';

export const Header = ({ onMenuClick }: { onMenuClick: () => void }) => {
  const { theme, toggleTheme } = useThemeContext();
  const { user, logout } = useAuth();

  return (
    <header className="h-20 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-white/30 dark:border-gray-800 flex items-center justify-between px-4 lg:px-8 z-40 sticky top-0">
      {/* Mobile menu button */}
      <button onClick={onMenuClick} className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
        <Menu className="w-6 h-6" />
      </button>

      {/* Search */}
      <div className="relative w-96 hidden md:block">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
          <Search className="w-4 h-4" />
        </span>
        <input type="text"
          className="w-full pl-10 pr-4 py-2.5 bg-gray-50/80 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50 rounded-xl text-sm focus:border-brand-gold dark:text-white transition-all"
          placeholder="Rechercher un élève, un paiement..." />
      </div>

      <div className="flex items-center gap-3">
        {/* System status */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase tracking-widest">En ligne</span>
        </div>

        {/* Theme toggle */}
        <motion.button whileTap={{ scale: 0.9 }} onClick={toggleTheme}
          className="p-2.5 text-slate-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors relative overflow-hidden">
          <motion.div key={theme} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} transition={{ duration: 0.3 }}>
            {theme === 'dark' ? <Sun className="w-5 h-5 text-brand-gold" /> : <Moon className="w-5 h-5" />}
          </motion.div>
        </motion.button>

        {/* Notifications */}
        <button className="relative p-2.5 text-slate-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-900" />
        </button>

        {/* User */}
        <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-gray-200 dark:border-gray-700">
          <div className="text-right">
            <p className="text-xs font-bold dark:text-white">{user?.fullName || 'Admin'}</p>
            <p className="text-[10px] text-gray-400">{user?.role || 'admin'}</p>
          </div>
          <button onClick={logout} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all" title="Déconnexion">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
