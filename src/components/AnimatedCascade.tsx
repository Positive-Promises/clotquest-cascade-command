
import React from 'react';
import { Check, Zap, AlertTriangle, Target, Scissors } from 'lucide-react';

interface Factor {
  id: string;
  name: string;
  fullName: string;
  pathway: 'intrinsic' | 'extrinsic' | 'common' | 'fibrinolysis' | 'regulatory';
  position: { x: number; y: number } | null;
  isPlaced: boolean;
  correctPosition: { x: number; y: number };
  color: string;
  cofactorFor?: string;
  activatedBy?: string;
}

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
    <div
      className="relative bg-gradient-to-b from-blue-50 via-purple-50 to-red-50 rounded-2xl p-8 min-h-[800px] border-4 border-dashed border-gray-300 overflow-hidden mt-16"
      onDrop={onDrop}
      onDragOver={onDragOver}
      style={{
        background: `
          radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 60% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 90% 70%, rgba(249, 115, 22, 0.1) 0%, transparent 50%),
          linear-gradient(135deg, #f0f9ff 0%, #faf5ff 50%, #fef2f2 70%, #fff7ed 100%)
        `
      }}
    >
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border border-blue-300 rounded-full animate-pulse"></div>
        <div className="absolute top-20 right-20 w-24 h-24 border border-green-300 rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-40 left-1/3 w-20 h-20 border border-purple-300 rounded-full animate-pulse delay-700"></div>
        <div className="absolute bottom-20 right-1/4 w-16 h-16 border border-orange-300 rounded-full animate-pulse delay-1000"></div>
        
        {/* Additional floating elements */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/20 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Enhanced pathway labels */}
      <div className="absolute top-2 left-6">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg transform hover:scale-105 transition-transform">
          <Zap className="inline h-5 w-5 mr-2 animate-pulse" />
          Intrinsic Pathway
        </div>
      </div>
      
      <div className="absolute top-2 right-6">
        <div className="bg-gradient-to-r from-green-600 to-green-800 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg transform hover:scale-105 transition-transform">
          <AlertTriangle className="inline h-5 w-5 mr-2 animate-pulse" />
          Extrinsic Pathway
        </div>
      </div>
      
      <div className="absolute bottom-80 left-1/2 transform -translate-x-1/2">
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg transform hover:scale-105 transition-transform">
          Common Pathway
        </div>
      </div>

      {/* Fibrinolysis pathway label */}
      <div className="absolute bottom-40 right-6">
        <div className="bg-gradient-to-r from-orange-600 to-orange-800 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg transform hover:scale-105 transition-transform">
          <Scissors className="inline h-5 w-5 mr-2 animate-pulse" />
          Fibrinolysis
        </div>
      </div>

      {/* Regulatory systems label */}
      <div className="absolute top-40 left-2">
        <div className="bg-gradient-to-r from-cyan-600 to-cyan-800 text-white px-3 py-2 rounded-full font-bold text-sm shadow-lg transform hover:scale-105 transition-transform rotate-90">
          Natural Anticoagulants
        </div>
      </div>

      {/* Progress indicator */}
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
        <div className="bg-white/95 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border transform hover:scale-105 transition-transform">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800 animate-pulse">{completionPercentage}%</div>
            <div className="text-sm text-gray-600">Complete</div>
          </div>
        </div>
      </div>

      {/* Drop zones for all factors */}
      {factors.map(factor => (
        <div
          key={`zone-${factor.id}`}
          onClick={() => onDropZoneClick(factor)}
          className={`absolute w-24 h-20 border-3 border-dashed rounded-xl flex items-center justify-center transition-all duration-300 cursor-pointer ${
            factor.isPlaced 
              ? 'border-green-400 bg-green-100/50 shadow-lg scale-110' 
              : selectedFactor?.id === factor.id
                ? 'border-yellow-400 bg-yellow-100/50 shadow-lg scale-105 animate-pulse'
                : factor.pathway === 'fibrinolysis'
                  ? 'border-orange-400 bg-orange-100/30 hover:bg-orange-100/50 hover:border-orange-500 hover:scale-105'
                  : factor.pathway === 'regulatory'
                    ? 'border-cyan-400 bg-cyan-100/30 hover:bg-cyan-100/50 hover:border-cyan-500 hover:scale-105'
                    : 'border-gray-400 bg-white/30 hover:bg-white/50 hover:border-blue-400 hover:scale-105'
          }`}
          style={{
            left: factor.correctPosition.x - 48,
            top: factor.correctPosition.y - 40
          }}
        >
          {!factor.isPlaced && (
            <div className="text-xs text-gray-600 text-center p-2 leading-tight">
              <div className="opacity-70">
                {selectedFactor?.id === factor.id ? '👆 Place here!' : 'Drop here'}
              </div>
              {selectedFactor?.id === factor.id && (
                <Target className="h-4 w-4 mx-auto mt-1 text-yellow-600 animate-bounce" />
              )}
            </div>
          )}
          {factor.isPlaced && (
            <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1 animate-bounce">
              <Check className="h-4 w-4 text-white" />
            </div>
          )}
        </div>
      ))}

      {/* Placed factors with enhanced effects */}
      {placedFactors.map(factor => (
        <div
          key={`placed-${factor.id}`}
          className={`absolute w-24 h-20 ${factor.color} rounded-xl flex items-center justify-center text-white font-bold shadow-2xl transition-all duration-500 transform ${
            factor.isPlaced ? 'ring-4 ring-green-400 ring-opacity-60 scale-110 animate-bounce' : 'hover:scale-105'
          }`}
          style={{
            left: factor.position!.x - 48,
            top: factor.position!.y - 40,
            background: factor.pathway === 'fibrinolysis' 
              ? `linear-gradient(135deg, orange, darkorange)`
              : factor.pathway === 'regulatory'
                ? `linear-gradient(135deg, cyan, darkcyan)`
                : factor.isPlaced 
                  ? `linear-gradient(135deg, ${factor.color.replace('bg-', '').split('-')[0]}-500, ${factor.color.replace('bg-', '').split('-')[0]}-700)`
                  : undefined
          }}
        >
          <div className="text-center relative">
            <div className="text-sm leading-tight">{factor.name}</div>
            {factor.cofactorFor && (
              <div className="text-xs opacity-75">+{factor.cofactorFor}</div>
            )}
            {factor.isPlaced && (
              <>
                <div className="absolute -top-3 -right-3 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center animate-pulse">
                  <Check className="h-3 w-3 text-white" />
                </div>
                <div className="absolute inset-0 bg-white/20 rounded-xl animate-ping"></div>
                
                {/* Celebration particles */}
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-ping"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 1}s`
                    }}
                  />
                ))}
              </>
            )}
          </div>
        </div>
      ))}

      {/* Enhanced pathway arrows with more complex routing */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <marker id="arrowhead" markerWidth="12" markerHeight="9" refX="12" refY="4.5" orient="auto">
            <polygon points="0 0, 12 4.5, 0 9" fill="#374151" />
          </marker>
          <linearGradient id="pathwayGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor: '#3b82f6', stopOpacity: 0.8}} />
            <stop offset="50%" style={{stopColor: '#8b5cf6', stopOpacity: 0.9}} />
            <stop offset="100%" style={{stopColor: '#3b82f6', stopOpacity: 0.8}} />
          </linearGradient>
          <linearGradient id="fibrinolysisGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor: '#f97316', stopOpacity: 0.8}} />
            <stop offset="100%" style={{stopColor: '#ea580c', stopOpacity: 0.9}} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Intrinsic pathway arrows */}
        <path d="M150 90 L150 120" stroke="url(#pathwayGradient)" strokeWidth="4" markerEnd="url(#arrowhead)" className="animate-pulse" filter="url(#glow)" />
        <path d="M150 160 L150 190" stroke="url(#pathwayGradient)" strokeWidth="4" markerEnd="url(#arrowhead)" className="animate-pulse" filter="url(#glow)" />
        <path d="M150 230 L200 270" stroke="url(#pathwayGradient)" strokeWidth="4" markerEnd="url(#arrowhead)" className="animate-pulse" filter="url(#glow)" />
        
        {/* Factor VIII cofactor connection */}
        <path d="M100 240 L150 220" stroke="#60a5fa" strokeWidth="2" strokeDasharray="5,5" className="animate-pulse" />
        
        {/* Extrinsic pathway arrows */}
        <path d="M350 90 L350 120" stroke="#10b981" strokeWidth="4" markerEnd="url(#arrowhead)" className="animate-pulse" filter="url(#glow)" />
        <path d="M350 160 L300 270" stroke="#10b981" strokeWidth="4" markerEnd="url(#arrowhead)" className="animate-pulse" filter="url(#glow)" />
        
        {/* Common pathway arrows */}
        <path d="M250 320 L230 350" stroke="#8b5cf6" strokeWidth="4" markerEnd="url(#arrowhead)" className="animate-pulse" filter="url(#glow)" />
        <path d="M250 390 L250 420" stroke="#8b5cf6" strokeWidth="4" markerEnd="url(#arrowhead)" className="animate-pulse" filter="url(#glow)" />
        <path d="M250 460 L250 490" stroke="#dc2626" strokeWidth="4" markerEnd="url(#arrowhead)" className="animate-pulse" filter="url(#glow)" />
        <path d="M250 530 L250 550" stroke="#dc2626" strokeWidth="4" markerEnd="url(#arrowhead)" className="animate-pulse" filter="url(#glow)" />
        
        {/* Factor XIII cross-linking */}
        <path d="M250 580 L300 590" stroke="#b91c1c" strokeWidth="3" markerEnd="url(#arrowhead)" className="animate-pulse" />
        
        {/* Fibrinolysis pathway arrows */}
        <path d="M400 450 L450 500" stroke="url(#fibrinolysisGradient)" strokeWidth="4" markerEnd="url(#arrowhead)" className="animate-pulse" filter="url(#glow)" />
        <path d="M450 530 L350 570" stroke="url(#fibrinolysisGradient)" strokeWidth="3" strokeDasharray="8,4" className="animate-pulse" />
        
        {/* Regulatory system inhibition arrows */}
        <path d="M100 400 L200 380" stroke="#06b6d4" strokeWidth="2" strokeDasharray="3,3" className="animate-pulse" />
        <path d="M50 350 L150 320" stroke="#06b6d4" strokeWidth="2" strokeDasharray="3,3" className="animate-pulse" />
        
        {/* Thrombin feedback loops */}
        <path d="M280 420 Q320 380 200 340" stroke="#7c3aed" strokeWidth="2" strokeDasharray="5,5" fill="none" className="animate-pulse" />
        <path d="M280 420 Q320 300 120 230" stroke="#7c3aed" strokeWidth="2" strokeDasharray="5,5" fill="none" className="animate-pulse" />
      </svg>
    </div>
  );
};

export default AnimatedCascade;
