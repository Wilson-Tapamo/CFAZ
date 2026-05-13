import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UserPlus, 
  Users, 
  BookOpen, 
  Trophy, 
  Wallet, 
  ShoppingCart, 
  Settings, 
  LogOut,
  ChevronLeft,
  Menu,
  X,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Tableau de bord', path: '/' },
  { icon: UserPlus, label: 'Inscriptions', path: '/inscriptions' },
  { icon: Users, label: 'Élèves', path: '/eleves' },
  { icon: BookOpen, label: 'Suivi scolaire', path: '/scolaire' },
  { icon: Trophy, label: 'Suivi sportif', path: '/sportif' },
  { icon: Wallet, label: 'Finances', path: '/finances' },
  { icon: ShoppingCart, label: 'Besoins', path: '/besoins' },
  { icon: User, label: 'Espace Parents', path: '/parent' },
  { icon: Settings, label: 'Paramètres', path: '/settings' },
];

export const Sidebar = ({ 
  isCollapsed, 
  setIsCollapsed,
  mobileOpen,
  setMobileOpen
}: { 
  isCollapsed: boolean; 
  setIsCollapsed: (v: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}) => {
  const location = useLocation();

  const SidebarContent = () => (
    <div className="flex flex-col h-full py-6">
      {/* Logo */}
      <div className={cn(
        "flex items-center px-6 mb-10 transition-all duration-300",
        isCollapsed ? "justify-center" : "justify-start"
      )}>
        <div className="w-10 h-10 bg-brand-gold rounded-xl flex items-center justify-center shrink-0">
          <span className="text-brand-blue font-bold text-xl">Z</span>
        </div>
        {!isCollapsed && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="ml-3 overflow-hidden"
          >
            <h1 className="font-display font-bold text-xl text-white whitespace-nowrap">CFAZ</h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest leading-none">Académie</p>
          </motion.div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center p-3 rounded-xl transition-all duration-200 group relative",
                isActive 
                  ? "bg-brand-gold text-brand-blue shadow-lg shadow-brand-gold/20" 
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className={cn("w-5 h-5 shrink-0", isActive ? "text-brand-blue" : "text-gray-400 group-hover:text-white")} />
              {!isCollapsed && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="ml-3 font-medium text-sm whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User info at bottom */}
      <div className="px-4 mt-auto pt-6 border-t border-white/5">
        <div className={cn(
          "flex items-center gap-3 p-2",
          isCollapsed ? "justify-center" : "justify-start"
        )}>
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xs font-bold text-white shrink-0">
            JD
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">Samuel Zo’o</p>
              <p className="text-xs text-slate-500 truncate lowercase font-medium">PDG / Fondateur</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.div 
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="fixed inset-y-0 left-0 w-[280px] bg-brand-blue z-[70] lg:hidden"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className={cn(
        "hidden lg:flex flex-col bg-brand-blue h-screen sticky top-0 transition-all duration-300 z-50 border-r border-white/5",
        isCollapsed ? "w-20" : "w-64"
      )}>
        <SidebarContent />
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-brand-gold rounded-full flex items-center justify-center text-brand-blue shadow-lg hover:scale-110 transition-transform"
        >
          <ChevronLeft className={cn("w-4 h-4 transition-transform", isCollapsed && "rotate-180")} />
        </button>
      </div>
    </>
  );
};
