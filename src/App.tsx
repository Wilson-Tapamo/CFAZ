/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { useAuth } from './contexts/AuthContext';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Inscriptions from './pages/Inscriptions';
import Eleves from './pages/Eleves';
import Scolaire from './pages/Scolaire';
import Sportif from './pages/Sportif';
import Finances from './pages/Finances';
import Besoins from './pages/Besoins';
import ParentSpace from './pages/ParentSpace';
import { motion } from 'motion/react';

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="w-16 h-16 bg-brand-gold rounded-2xl flex items-center justify-center mx-auto mb-4 pulse-gold">
            <span className="text-brand-blue font-bold text-2xl">Z</span>
          </div>
          <div className="w-8 h-8 border-3 border-brand-gold/30 border-t-brand-gold rounded-full animate-spin mx-auto" />
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) return <Login />;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/inscriptions" element={<Inscriptions />} />
                <Route path="/eleves" element={<Eleves />} />
                <Route path="/scolaire" element={<Scolaire />} />
                <Route path="/sportif" element={<Sportif />} />
                <Route path="/finances" element={<Finances />} />
                <Route path="/besoins" element={<Besoins />} />
                <Route path="/parent" element={<ParentSpace />} />
                <Route path="/settings" element={
                  <div className="flex items-center justify-center h-[70vh]">
                    <div className="text-center">
                      <h2 className="text-2xl font-bold mb-2 dark:text-white">Paramètres</h2>
                      <p className="text-gray-500">Page en construction...</p>
                    </div>
                  </div>
                } />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default function App() {
  return <AppContent />;
}
