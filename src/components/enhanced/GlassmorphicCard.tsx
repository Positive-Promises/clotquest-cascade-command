
import React from 'react';
import { cn } from '@/lib/utils';

interface GlassmorphicCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'light' | 'medium' | 'heavy';
  color?: 'neutral' | 'blue' | 'purple' | 'green' | 'red' | 'orange';
  hover?: boolean;
  animated?: boolean;
}

const GlassmorphicCard: React.FC<GlassmorphicCardProps> = ({
  children,
  className = '',
  intensity = 'medium',
  color = 'neutral',
  hover = true,
  animated = true
}) => {
  const intensityClasses = {
    light: 'bg-white/5 backdrop-blur-sm border border-white/10',
    medium: 'bg-white/10 backdrop-blur-md border border-white/20',
    heavy: 'bg-white/15 backdrop-blur-lg border border-white/30'
  };

  const colorClasses = {
    neutral: 'shadow-xl',
    blue: 'shadow-blue-500/20 shadow-2xl border-blue-400/20',
    purple: 'shadow-purple-500/20 shadow-2xl border-purple-400/20',
    green: 'shadow-green-500/20 shadow-2xl border-green-400/20',
    red: 'shadow-red-500/20 shadow-2xl border-red-400/20',
    orange: 'shadow-orange-500/20 shadow-2xl border-orange-400/20'
  };

  const hoverClasses = hover 
    ? 'hover:bg-white/20 hover:border-white/40 hover:shadow-2xl hover:scale-[1.02]' 
    : '';

  const animatedClasses = animated 
    ? 'transition-all duration-300 ease-out transform' 
    : '';

  return (
    <div className={cn(
      'rounded-2xl relative overflow-hidden',
      intensityClasses[intensity],
      colorClasses[color],
      hoverClasses,
      animatedClasses,
      className
    )}>
      {/* Glassmorphic effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Animated border effect */}
      {animated && (
        <div className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
        </div>
      )}
    </div>
  );
};

export default GlassmorphicCard;
