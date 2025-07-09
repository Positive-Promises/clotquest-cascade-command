
import React, { useState, useEffect } from 'react';
import { Check, Zap, AlertTriangle, Target, Scissors, Shield, Sparkles } from 'lucide-react';
import { Factor } from '@/types/cascadeTypes';
import { cn } from '@/lib/utils';

interface ModernAnimatedCascadeProps {
  factors: Factor[];
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  selectedFactor?: Factor | null;
  onDropZoneClick: (factor: Factor) => void;
}

const ModernAnimatedCascade: React.FC<ModernAnimatedCascadeProps> = ({ 
  factors, 
  onDrop, 
  onDragOver, 
  selectedFactor, 
  onDropZoneClick 
}) => {
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [placementAnimation, setPlacementAnimation] = useState<string | null>(null);
  
  const placedFactors = factors.filter(factor => factor.position);
  const completionPercentage = Math.round((factors.filter(f => f.isPlaced).length / factors.length) * 100);

  useEffect(() => {
    if (placementAnimation) {
      const timer = setTimeout(() => setPlacementAnimation(null), 1000);
      return () => clearTimeout(timer);
    }
  }, [placementAnimation]);

  const handleDropZoneClick = (factor: Factor) => {
    if (!factor.isPlaced) {
      setPlacementAnimation(factor.id);
    }
    onDropZoneClick(factor);
  };

  const getDropZoneStyle = (factor: Factor) => {
    const isSelected = selectedFactor?.id === factor.id;
    const isHovered = hoveredZone === factor.id;
    const isPlaced = factor.isPlaced;
    
    let baseClasses = "absolute transition-all duration-300 cursor-pointer transform border-3 border-dashed rounded-3xl flex items-center justify-center";
    
    if (isPlaced) {
      baseClasses += " border-emerald-400 bg-gradient-to-br from-emerald-50/90 to-emerald-100/90 backdrop-blur-sm shadow-2xl scale-110 ring-4 ring-emerald-300/50";
    } else if (isSelected) {
      baseClasses += " border-amber-400 bg-gradient-to-br from-amber-50/90 to-yellow-100/90 backdrop-blur-sm shadow-2xl scale-125 animate-pulse ring-4 ring-amber-300/60 ring-offset-2";
    } else if (isHovered) {
      baseClasses += " border-blue-400 bg-gradient-to-br from-blue-50/80 to-blue-100/80 backdrop-blur-sm shadow-xl scale-110 ring-2 ring-blue-300/40";
    } else {
      switch (factor.pathway) {
        case 'fibrinolysis':
          baseClasses += " border-orange-400/60 bg-gradient-to-br from-orange-50/40 to-orange-100/40 hover:border-orange-500 hover:shadow-lg hover:scale-105";
          break;
        case 'regulatory':
          baseClasses += " border-cyan-400/60 bg-gradient-to-br from-cyan-50/40 to-cyan-100/40 hover:border-cyan-500 hover:shadow-lg hover:scale-105";
          break;
        default:
          baseClasses += " border-slate-400/60 bg-gradient-to-br from-white/60 to-slate-50/60 hover:border-blue-400 hover:shadow-lg hover:scale-105";
      }
    }

    return {
      className: baseClasses,
      style: {
        left: factor.correctPosition.x - 60,
        top: factor.correctPosition.y - 60,
        width: '120px',
        height: '120px'
      }
    };
  };

  return (
    <div className="w-full px-2 lg:px-4">
      <div
        className="relative w-full rounded-3xl border-2 border-dashed border-gray-300/30 overflow-hidden mx-auto glass-card"
        onDrop={onDrop}
        onDragOver={onDragOver}
        style={{
          minHeight: '900px',
          marginTop: '15%',
          maxWidth: '100%',
          background: `
            radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.12) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(34, 197, 94, 0.12) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.12) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(251, 146, 60, 0.12) 0%, transparent 50%),
            radial-gradient(circle at 20% 80%, rgba(14, 165, 233, 0.12) 0%, transparent 50%),
            linear-gradient(135deg, rgba(248, 250, 252, 0.95) 0%, rgba(241, 245, 249, 0.95) 100%)
          `
        }}
      >
        {/* Enhanced Background Particles */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(24)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "absolute rounded-full animate-pulse",
                i % 4 === 0 ? "w-2 h-2 bg-blue-400" :
                i % 4 === 1 ? "w-3 h-3 bg-emerald-400" :
                i % 4 === 2 ? "w-1.5 h-1.5 bg-purple-400" :
                "w-2.5 h-2.5 bg-amber-400"
              )}
              style={{
                left: `${5 + (i * 7) % 90}%`,
                top: `${10 + (i * 11) % 80}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${2 + (i % 3)}s`
              }}
            />
          ))}
        </div>

        {/* Modern Completion Header */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30">
          <div className="glass-card bg-gradient-to-r from-slate-800/90 to-slate-900/90 text-white px-8 py-4 rounded-2xl shadow-2xl border border-slate-600/50 backdrop-blur-xl">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                {completionPercentage}%
              </div>
              <div className="text-sm text-slate-300 font-medium mb-2">Cascade Mastery</div>
              <div className="w-32 h-2 bg-slate-700/50 rounded-full overflow-hidden backdrop-blur-sm">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-1000 ease-out relative"
                  style={{ width: `${completionPercentage}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full"></div>
                </div>
              </div>
            </div>
            
            {/* Sparkle Effect */}
            {completionPercentage > 0 && (
              <div className="absolute -top-2 -right-2">
                <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Pathway Labels */}
        <div className="absolute top-16 left-6 z-20">
          <div className="glass-card bg-gradient-to-br from-blue-600/90 via-blue-700/90 to-blue-800/90 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-2xl transform hover:scale-105 transition-all duration-300 border border-blue-400/30 backdrop-blur-xl">
            <Zap className="inline h-5 w-5 mr-2 animate-pulse text-blue-200" />
            <span className="text-blue-100">Intrinsic Pathway</span>
            <div className="text-xs text-blue-200 mt-1 font-normal">Contact Activation</div>
          </div>
        </div>
        
        <div className="absolute top-16 right-6 z-20">
          <div className="glass-card bg-gradient-to-br from-green-600/90 via-green-700/90 to-green-800/90 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-2xl transform hover:scale-105 transition-all duration-300 border border-green-400/30 backdrop-blur-xl">
            <AlertTriangle className="inline h-5 w-5 mr-2 animate-pulse text-green-200" />
            <span className="text-green-100">Extrinsic Pathway</span>
            <div className="text-xs text-green-200 mt-1 font-normal">Tissue Factor</div>
          </div>
        </div>
        
        <div className="absolute top-80 left-1/2 transform -translate-x-1/2 z-20">
          <div className="glass-card bg-gradient-to-br from-purple-600/90 via-purple-700/90 to-purple-800/90 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl transform hover:scale-105 transition-all duration-300 border border-purple-400/30 backdrop-blur-xl">
            <Target className="inline h-6 w-6 mr-3 animate-pulse text-purple-200" />
            <span className="text-purple-100">Common Pathway</span>
            <div className="text-sm text-purple-200 mt-1 font-normal">Final Coagulation</div>
          </div>
        </div>

        <div className="absolute bottom-40 right-10 z-20">
          <div className="glass-card bg-gradient-to-br from-orange-600/90 via-orange-700/90 to-orange-800/90 text-white px-5 py-3 rounded-2xl font-bold text-sm shadow-2xl transform hover:scale-105 transition-all duration-300 border border-orange-400/30 backdrop-blur-xl">
            <Scissors className="inline h-5 w-5 mr-2 animate-pulse text-orange-200" />
            <span className="text-orange-100">Fibrinolysis</span>
            <div className="text-xs text-orange-200 mt-1 font-normal">Clot Dissolution</div>
          </div>
        </div>

        <div className="absolute top-96 left-6 z-20">
          <div className="glass-card bg-gradient-to-br from-cyan-600/90 via-cyan-700/90 to-cyan-800/90 text-white px-4 py-3 rounded-2xl font-bold text-sm shadow-2xl transform hover:scale-105 transition-all duration-300 border border-cyan-400/30 backdrop-blur-xl">
            <Shield className="inline h-5 w-5 mr-2 animate-pulse text-cyan-200" />
            <span className="text-cyan-100">Natural Anticoagulants</span>
          </div>
        </div>

        {/* Enhanced Drop Zones with Modern Styling */}
        {factors.map(factor => {
          const dropZoneStyle = getDropZoneStyle(factor);
          return (
            <div
              key={`zone-${factor.id}`}
              onClick={() => handleDropZoneClick(factor)}
              onMouseEnter={() => setHoveredZone(factor.id)}
              onMouseLeave={() => setHoveredZone(null)}
              className={dropZoneStyle.className}
              style={dropZoneStyle.style}
            >
              {!factor.isPlaced && (
                <div className="text-center p-3 leading-tight">
                  <div className="text-sm font-semibold text-slate-700 mb-2">
                    {selectedFactor?.id === factor.id ? 'Click to Place!' : 'Drop Zone'}
                  </div>
                  {selectedFactor?.id === factor.id && (
                    <div className="relative">
                      <Target className="h-8 w-8 mx-auto text-amber-600 animate-bounce" />
                      <div className="absolute inset-0 h-8 w-8 mx-auto bg-amber-400/30 rounded-full animate-ping"></div>
                    </div>
                  )}
                  {hoveredZone === factor.id && !selectedFactor && (
                    <div className="text-xs text-blue-600 font-medium mt-1">Click factor first, then here</div>
                  )}
                </div>
              )}
              
              {factor.isPlaced && (
                <>
                  <div className="absolute -top-4 -right-4 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full p-3 animate-bounce shadow-xl">
                    <Check className="h-5 w-5 text-white" />
                  </div>
                  
                  {/* Success Celebration Effect */}
                  {placementAnimation === factor.id && (
                    <div className="absolute inset-0 pointer-events-none">
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full animate-ping"
                          style={{
                            left: `${20 + (i * 10)}%`,
                            top: `${20 + (i * 10)}%`,
                            animationDelay: `${i * 100}ms`,
                            animationDuration: '1s'
                          }}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}

        {/* Enhanced Placed Factors */}
        {placedFactors.map(factor => (
          <div
            key={`placed-${factor.id}`}
            className="absolute rounded-3xl flex items-center justify-center text-white font-bold shadow-2xl transition-all duration-500 transform ring-4 ring-emerald-400/60 scale-110 animate-bounce glass-card backdrop-blur-xl"
            style={{
              left: factor.position!.x - 60,
              top: factor.position!.y - 60,
              width: '120px',
              height: '120px',
              background: factor.pathway === 'fibrinolysis' 
                ? `linear-gradient(135deg, #f97316, #ea580c, #dc2626)`
                : factor.pathway === 'regulatory'
                  ? `linear-gradient(135deg, #06b6d4, #0891b2, #0e7490)`
                  : `linear-gradient(135deg, #3b82f6, #1d4ed8, #1e40af)`
            }}
          >
            <div className="text-center relative">
              <div className="text-lg font-bold leading-tight drop-shadow-lg">{factor.name}</div>
              {factor.cofactorFor && (
                <div className="text-sm opacity-90 font-medium">Co: {factor.cofactorFor}</div>
              )}
              
              {/* Enhanced Success Particles */}
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-yellow-300 rounded-full animate-ping"
                  style={{
                    left: `${10 + (i * 15)}%`,
                    top: `${10 + (i * 15)}%`,
                    animationDelay: `${i * 0.3}s`,
                    animationDuration: `${1.5 + (i * 0.2)}s`
                  }}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Enhanced SVG Pathways with Glow Effects */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <defs>
            <filter id="modernGlow">
              <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <linearGradient id="modernIntrinsic" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor: '#3b82f6', stopOpacity: 1}} />
              <stop offset="50%" style={{stopColor: '#6366f1', stopOpacity: 0.9}} />
              <stop offset="100%" style={{stopColor: '#1d4ed8', stopOpacity: 1}} />
            </linearGradient>
            <linearGradient id="modernExtrinsic" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor: '#10b981', stopOpacity: 1}} />
              <stop offset="50%" style={{stopColor: '#059669', stopOpacity: 0.9}} />
              <stop offset="100%" style={{stopColor: '#047857', stopOpacity: 1}} />
            </linearGradient>
          </defs>
          
          {/* Modern Pathway Arrows with Enhanced Effects */}
          <path d="M200 200 L200 250" stroke="url(#modernIntrinsic)" strokeWidth="6" className="animate-pulse" filter="url(#modernGlow)" />
          <path d="M200 270 L200 320" stroke="url(#modernIntrinsic)" strokeWidth="6" className="animate-pulse" filter="url(#modernGlow)" />
          <path d="M450 200 L450 250" stroke="url(#modernExtrinsic)" strokeWidth="6" className="animate-pulse" filter="url(#modernGlow)" />
          <path d="M325 420 L325 470" stroke="#8b5cf6" strokeWidth="6" className="animate-pulse" filter="url(#modernGlow)" />
        </svg>
      </div>
    </div>
  );
};

export default ModernAnimatedCascade;
