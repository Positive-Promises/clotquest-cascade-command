import React from 'react';
import { Check, Zap, AlertTriangle, Target, Scissors, Shield } from 'lucide-react';
import { Factor } from '@/types/cascadeTypes';

interface AnimatedCascadeProps {
  factors: Factor[];
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  selectedFactor?: Factor | null;
  onDropZoneClick: (factor: Factor) => void;
}

const AnimatedCascade: React.FC<AnimatedCascadeProps> = ({ 
  factors, 
  onDrop, 
  onDragOver, 
  selectedFactor, 
  onDropZoneClick 
}) => {
  const placedFactors = factors.filter(factor => factor.position);
  const completionPercentage = Math.round((factors.filter(f => f.isPlaced).length / factors.length) * 100);

  return (
    <div className="w-full px-2 lg:px-4">
      <div
        className="relative w-full rounded-2xl border-2 border-dashed border-gray-300/50 overflow-hidden mx-auto"
        onDrop={onDrop}
        onDragOver={onDragOver}
        style={{
          minHeight: '800px',
          marginTop: '25%', // Moved up by 10% (was 35%, now 25%)
          maxWidth: '100%',
          background: `
            radial-gradient(circle at 15% 15%, rgba(59, 130, 246, 0.08) 0%, transparent 40%),
            radial-gradient(circle at 85% 15%, rgba(16, 185, 129, 0.08) 0%, transparent 40%),
            radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.08) 0%, transparent 40%),
            radial-gradient(circle at 85% 85%, rgba(249, 115, 22, 0.08) 0%, transparent 40%),
            radial-gradient(circle at 15% 85%, rgba(6, 182, 212, 0.08) 0%, transparent 40%),
            linear-gradient(135deg, rgba(248, 250, 252, 0.95) 0%, rgba(241, 245, 249, 0.95) 30%, rgba(238, 242, 255, 0.95) 60%, rgba(254, 242, 242, 0.95) 80%, rgba(255, 247, 237, 0.95) 100%)
          `
        }}
      >
        {/* Professional Medical Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-48 h-48 border border-blue-400 rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-32 w-32 h-32 border border-green-400 rounded-full animate-pulse delay-500"></div>
          <div className="absolute bottom-48 left-1/3 w-24 h-24 border border-purple-400 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-32 right-1/4 w-20 h-20 border border-orange-400 rounded-full animate-pulse delay-1500"></div>
          <div className="absolute bottom-48 right-20 w-28 h-28 border border-cyan-400 rounded-full animate-pulse delay-2000"></div>
        </div>

        {/* Professional Completion Header - Moved up by 25% */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-30">
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl border border-slate-600">
            <div className="text-center">
              <div className="text-2xl font-bold mb-1 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {completionPercentage}%
              </div>
              <div className="text-xs text-slate-300 font-medium">Cascade Complete</div>
              <div className="w-24 h-1.5 bg-slate-700 rounded-full mt-1 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000 ease-out"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Professional Pathway Labels - Moved up by 25% */}
        <div className="absolute top-12 left-4 z-20">
          <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-2xl transform hover:scale-105 transition-all duration-300 border border-blue-400/30">
            <Zap className="inline h-4 w-4 mr-2 animate-pulse" />
            <span className="text-blue-100">Intrinsic Pathway</span>
            <div className="text-xs text-blue-200 mt-0.5 font-normal">Contact Activation</div>
          </div>
        </div>
        
        <div className="absolute top-12 right-4 z-20">
          <div className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-2xl transform hover:scale-105 transition-all duration-300 border border-green-400/30">
            <AlertTriangle className="inline h-4 w-4 mr-2 animate-pulse" />
            <span className="text-green-100">Extrinsic Pathway</span>
            <div className="text-xs text-green-200 mt-0.5 font-normal">Tissue Factor</div>
          </div>
        </div>
        
        <div className="absolute top-64 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 text-white px-6 py-3 rounded-xl font-bold text-lg shadow-2xl transform hover:scale-105 transition-all duration-300 border border-purple-400/30">
            <Target className="inline h-5 w-5 mr-2 animate-pulse" />
            <span className="text-purple-100">Common Pathway</span>
            <div className="text-xs text-purple-200 mt-1 font-normal">Final Coagulation</div>
          </div>
        </div>

        <div className="absolute bottom-32 right-8 z-20">
          <div className="bg-gradient-to-br from-orange-600 via-orange-700 to-orange-800 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-2xl transform hover:scale-105 transition-all duration-300 border border-orange-400/30">
            <Scissors className="inline h-4 w-4 mr-2 animate-pulse" />
            <span className="text-orange-100">Fibrinolysis</span>
            <div className="text-xs text-orange-200 mt-0.5 font-normal">Clot Dissolution</div>
          </div>
        </div>

        {/* Natural Anticoagulants - Moved down by 10% */}
        <div className="absolute top-80 left-4 z-20">
          <div className="bg-gradient-to-br from-cyan-600 via-cyan-700 to-cyan-800 text-white px-3 py-2 rounded-xl font-bold text-xs shadow-2xl transform hover:scale-105 transition-all duration-300 border border-cyan-400/30">
            <Shield className="inline h-4 w-4 mr-1 animate-pulse" />
            <span className="text-cyan-100">Natural Anticoagulants</span>
          </div>
        </div>

        {/* Enhanced Drop Zones with Professional Styling */}
        {factors.map(factor => (
          <div
            key={`zone-${factor.id}`}
            onClick={() => onDropZoneClick(factor)}
            className={`absolute w-28 h-24 border-3 border-dashed rounded-2xl flex items-center justify-center transition-all duration-300 cursor-pointer transform hover:scale-105 ${
              factor.isPlaced 
                ? 'border-emerald-500 bg-emerald-50/80 shadow-xl scale-110 ring-4 ring-emerald-200' 
                : selectedFactor?.id === factor.id
                  ? 'border-amber-500 bg-amber-50/80 shadow-xl scale-110 animate-pulse ring-4 ring-amber-200'
                  : factor.pathway === 'fibrinolysis'
                    ? 'border-orange-400 bg-orange-50/60 hover:bg-orange-50/80 hover:border-orange-500 hover:shadow-lg'
                    : factor.pathway === 'regulatory'
                      ? 'border-cyan-400 bg-cyan-50/60 hover:bg-cyan-50/80 hover:border-cyan-500 hover:shadow-lg'
                      : 'border-slate-400 bg-white/60 hover:bg-white/80 hover:border-blue-400 hover:shadow-lg'
            }`}
            style={{
              left: factor.correctPosition.x - 56,
              top: factor.correctPosition.y - 48
            }}
          >
            {!factor.isPlaced && (
              <div className="text-center p-2 leading-tight">
                <div className="text-xs font-medium text-slate-600 mb-1">
                  {selectedFactor?.id === factor.id ? 'Place Here!' : 'Drop Zone'}
                </div>
                {selectedFactor?.id === factor.id && (
                  <Target className="h-5 w-5 mx-auto text-amber-600 animate-bounce" />
                )}
              </div>
            )}
            {factor.isPlaced && (
              <div className="absolute -top-3 -right-3 bg-emerald-500 rounded-full p-2 animate-bounce shadow-lg">
                <Check className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
        ))}

        {/* Professional Placed Factors */}
        {placedFactors.map(factor => (
          <div
            key={`placed-${factor.id}`}
            className={`absolute w-28 h-24 rounded-2xl flex items-center justify-center text-white font-bold shadow-2xl transition-all duration-500 transform ${
              factor.isPlaced ? 'ring-4 ring-emerald-400 ring-opacity-60 scale-110 animate-bounce' : 'hover:scale-105'
            }`}
            style={{
              left: factor.position!.x - 56,
              top: factor.position!.y - 48,
              background: factor.pathway === 'fibrinolysis' 
                ? `linear-gradient(135deg, #f97316, #ea580c, #dc2626)`
                : factor.pathway === 'regulatory'
                  ? `linear-gradient(135deg, #06b6d4, #0891b2, #0e7490)`
                  : factor.isPlaced 
                    ? `linear-gradient(135deg, #3b82f6, #1d4ed8, #1e40af)`
                    : undefined
            }}
          >
            <div className="text-center relative">
              <div className="text-sm font-bold leading-tight drop-shadow-lg">{factor.name}</div>
              {factor.cofactorFor && (
                <div className="text-xs opacity-90 font-medium">Co: {factor.cofactorFor}</div>
              )}
              {factor.isPlaced && (
                <>
                  <div className="absolute -top-4 -right-4 w-7 h-7 bg-emerald-400 rounded-full flex items-center justify-center animate-pulse shadow-lg">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-white/20 rounded-2xl animate-ping"></div>
                  
                  {/* Medical Excellence Particles */}
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1.5 h-1.5 bg-yellow-400 rounded-full animate-ping"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 2}s`,
                        animationDuration: `${1 + Math.random()}s`
                      }}
                    />
                  ))}
                </>
              )}
            </div>
          </div>
        ))}

        {/* Enhanced Professional Pathway Arrows */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <defs>
            <marker id="arrowhead" markerWidth="14" markerHeight="10" refX="14" refY="5" orient="auto">
              <polygon points="0 0, 14 5, 0 10" fill="#1e293b" />
            </marker>
            <linearGradient id="intrinsicGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor: '#3b82f6', stopOpacity: 0.9}} />
              <stop offset="100%" style={{stopColor: '#1d4ed8', stopOpacity: 0.9}} />
            </linearGradient>
            <linearGradient id="extrinsicGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor: '#10b981', stopOpacity: 0.9}} />
              <stop offset="100%" style={{stopColor: '#047857', stopOpacity: 0.9}} />
            </linearGradient>
            <linearGradient id="commonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor: '#8b5cf6', stopOpacity: 0.9}} />
              <stop offset="100%" style={{stopColor: '#6d28d9', stopOpacity: 0.9}} />
            </linearGradient>
            <linearGradient id="fibrinolysisGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor: '#f97316', stopOpacity: 0.9}} />
              <stop offset="100%" style={{stopColor: '#ea580c', stopOpacity: 0.9}} />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Professional Pathway Arrows */}
          <path d="M180 180 L180 220" stroke="url(#intrinsicGradient)" strokeWidth="5" markerEnd="url(#arrowhead)" className="animate-pulse" filter="url(#glow)" />
          <path d="M180 240 L180 280" stroke="url(#intrinsicGradient)" strokeWidth="5" markerEnd="url(#arrowhead)" className="animate-pulse" filter="url(#glow)" />
          <path d="M180 300 L230 340" stroke="url(#intrinsicGradient)" strokeWidth="5" markerEnd="url(#arrowhead)" className="animate-pulse" filter="url(#glow)" />
          
          <path d="M420 180 L420 220" stroke="url(#extrinsicGradient)" strokeWidth="5" markerEnd="url(#arrowhead)" className="animate-pulse" filter="url(#glow)" />
          <path d="M420 240 L370 340" stroke="url(#extrinsicGradient)" strokeWidth="5" markerEnd="url(#arrowhead)" className="animate-pulse" filter="url(#glow)" />
          
          <path d="M300 400 L280 440" stroke="url(#commonGradient)" strokeWidth="5" markerEnd="url(#arrowhead)" className="animate-pulse" filter="url(#glow)" />
          <path d="M300 480 L300 520" stroke="url(#commonGradient)" strokeWidth="5" markerEnd="url(#arrowhead)" className="animate-pulse" filter="url(#glow)" />
          <path d="M300 560 L300 600" stroke="#dc2626" strokeWidth="5" markerEnd="url(#arrowhead)" className="animate-pulse" filter="url(#glow)" />
          <path d="M300 640 L300 680" stroke="#dc2626" strokeWidth="5" markerEnd="url(#arrowhead)" className="animate-pulse" filter="url(#glow)" />
          
          <path d="M480 560 L530 600" stroke="url(#fibrinolysisGradient)" strokeWidth="5" markerEnd="url(#arrowhead)" className="animate-pulse" filter="url(#glow)" />
          <path d="M530 640 L430 680" stroke="url(#fibrinolysisGradient)" strokeWidth="4" strokeDasharray="10,5" className="animate-pulse" />
          
          <path d="M120 500 L250 480" stroke="#06b6d4" strokeWidth="3" strokeDasharray="6,4" className="animate-pulse" />
          <path d="M80 440 L200 420" stroke="#06b6d4" strokeWidth="3" strokeDasharray="6,4" className="animate-pulse" />
          
          <path d="M330 480 Q380 440 250 400" stroke="#7c3aed" strokeWidth="3" strokeDasharray="8,6" fill="none" className="animate-pulse" />
          <path d="M330 480 Q380 360 150 300" stroke="#7c3aed" strokeWidth="3" strokeDasharray="8,6" fill="none" className="animate-pulse" />
        </svg>
      </div>
    </div>
  );
};

export default AnimatedCascade;
