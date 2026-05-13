/**
 * Animated Gradient Background Component
 * Creates floating multicolor light orbs with smooth animation
 * Inspired by Google 2026 design language
 */
import React from 'react';

export const GradientBackground = () => {
  return (
    <div className="gradient-bg" aria-hidden="true">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <div className="orb orb-4" />
    </div>
  );
};
