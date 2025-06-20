import React from 'react';
import { Check, Zap, AlertTriangle } from 'lucide-react';

interface Factor {
  id: string;
  name: string;
  fullName: string;
  pathway: 'intrinsic' | 'extrinsic' | 'common';
  position: { x: number; y: number } | null;
  isPlaced: boolean;
  correctPosition: { x: number; y: number };
  color: string;
}

interface AnimatedCascadeProps {
  factors: Factor[];
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
}

const AnimatedCascade: React.FC<AnimatedCascadeProps> = ({ factors, onDrop, onDragOver }) => {
  const placedFactors = factors.filter(factor => factor.position);
  const completionPercentage = Math.round((factors.filter(f => f.isPlaced).length / factors.length) * 100);

  return (
    <div
      className="relative bg-gradient-to-b from-blue-50 via-purple-50 to-red-50 rounded-2xl p-8 min-h-[700px] border-4 border-dashed border-gray-300 overflow-hidden"
      onDrop={onDrop}
      onDragOver={onDragOver}
      style={{
        background: `
          radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 60% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
          linear-gradient(135deg, #f0f9ff 0%, #faf5ff 50%, #fef2f2 100%)
        `
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border border-blue-300 rounded-full animate-pulse"></div>
        <div className="absolute top-20 right-20 w-24 h-24 border border-green-300 rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-20 left-1/3 w-20 h-20 border border-purple-300 rounded-full animate-pulse delay-700"></div>
      </div>

      {/* Pathway labels with enhanced styling */}
      <div className="absolute top-6 left-6">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
          <Zap className="inline h-5 w-5 mr-2" />
          Intrinsic Pathway
        </div>
      </div>
      
      <div className="absolute top-6 right-6">
        <div className="bg-gradient-to-r from-green-600 to-green-800 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
          <AlertTriangle className="inline h-5 w-5 mr-2" />
          Extrinsic Pathway
        </div>
      </div>
      
      <div className="absolute bottom-40 left-1/2 transform -translate-x-1/2">
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
          Common Pathway
        </div>
      </div>

      {/* Progress indicator */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
        <div className="bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">{completionPercentage}%</div>
            <div className="text-sm text-gray-600">Complete</div>
          </div>
        </div>
      </div>

      {/* Enhanced drop zones */}
      {factors.map(factor => (
        <div
          key={`zone-${factor.id}`}
          className={`absolute w-24 h-20 border-3 border-dashed rounded-xl flex items-center justify-center transition-all duration-300 ${
            factor.isPlaced 
              ? 'border-green-400 bg-green-100/50 shadow-lg' 
              : 'border-gray-400 bg-white/30 hover:bg-white/50 hover:border-blue-400'
          }`}
          style={{
            left: factor.correctPosition.x - 48,
            top: factor.correctPosition.y - 40
          }}
        >
          {!factor.isPlaced && (
            <div className="text-xs text-gray-600 text-center p-2 leading-tight">
              <div className="font-semibold">{factor.name}</div>
              <div className="opacity-70">Drop here</div>
            </div>
          )}
          {factor.isPlaced && (
            <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1 animate-bounce">
              <Check className="h-4 w-4 text-white" />
            </div>
          )}
        </div>
      ))}

      {/* Placed factors with enhanced visuals */}
      {placedFactors.map(factor => (
        <div
          key={`placed-${factor.id}`}
          className={`absolute w-24 h-20 ${factor.color} rounded-xl flex items-center justify-center text-white font-bold shadow-2xl transition-all duration-500 transform ${
            factor.isPlaced ? 'ring-4 ring-green-400 ring-opacity-60 scale-110' : 'hover:scale-105'
          }`}
          style={{
            left: factor.position!.x - 48,
            top: factor.position!.y - 40,
            background: factor.isPlaced 
              ? `linear-gradient(135deg, ${factor.color.replace('bg-', '').split('-')[0]}-500, ${factor.color.replace('bg-', '').split('-')[0]}-700)`
              : undefined
          }}
        >
          <div className="text-center relative">
            <div className="text-sm leading-tight">{factor.name}</div>
            {factor.isPlaced && (
              <>
                <div className="absolute -top-3 -right-3 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center animate-pulse">
                  <Check className="h-3 w-3 text-white" />
                </div>
                <div className="absolute inset-0 bg-white/20 rounded-xl animate-ping"></div>
              </>
            )}
          </div>
        </div>
      ))}

      {/* Enhanced pathway arrows with animation */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <marker id="arrowhead" markerWidth="12" markerHeight="9" refX="12" refY="4.5" orient="auto">
            <polygon points="0 0, 12 4.5, 0 9" fill="#374151" />
          </marker>
          <linearGradient id="pathwayGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor: '#3b82f6', stopOpacity: 0.8}} />
            <stop offset="100%" style={{stopColor: '#8b5cf6', stopOpacity: 0.8}} />
          </linearGradient>
        </defs>
        
        {/* Animated intrinsic pathway arrows */}
        <path d="M150 90 L150 120" stroke="url(#pathwayGradient)" strokeWidth="4" markerEnd="url(#arrowhead)" className="animate-pulse" />
        <path d="M150 160 L150 190" stroke="url(#pathwayGradient)" strokeWidth="4" markerEnd="url(#arrowhead)" className="animate-pulse" />
        <path d="M150 230 L200 270" stroke="url(#pathwayGradient)" strokeWidth="4" markerEnd="url(#arrowhead)" className="animate-pulse" />
        
        {/* Animated extrinsic pathway arrows */}
        <path d="M350 90 L350 120" stroke="#10b981" strokeWidth="4" markerEnd="url(#arrowhead)" className="animate-pulse" />
        <path d="M350 160 L300 270" stroke="#10b981" strokeWidth="4" markerEnd="url(#arrowhead)" className="animate-pulse" />
        
        {/* Animated common pathway arrows */}
        <path d="M250 320 L230 350" stroke="#8b5cf6" strokeWidth="4" markerEnd="url(#arrowhead)" className="animate-pulse" />
        <path d="M250 390 L250 420" stroke="#8b5cf6" strokeWidth="4" markerEnd="url(#arrowhead)" className="animate-pulse" />
        <path d="M250 460 L250 490" stroke="#dc2626" strokeWidth="4" markerEnd="url(#arrowhead)" className="animate-pulse" />
      </svg>

      {/* Enhanced patient visualization */}
      <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-lg rounded-2xl p-6 max-w-sm shadow-2xl border border-gray-200">
        <div className="flex items-center mb-3">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse"></div>
          <div className="font-bold text-gray-800">Patient Status</div>
        </div>
        <div className="text-sm text-gray-700 mb-3 leading-relaxed">
          A patient with a deep laceration requires immediate hemostasis. 
          The coagulation cascade must be properly activated to form a stable clot and prevent hemorrhage.
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-blue-100 p-2 rounded">
            <div className="font-semibold text-blue-800">Blood Loss</div>
            <div className="text-blue-600">{Math.max(0, 100 - completionPercentage)}%</div>
          </div>
          <div className="bg-green-100 p-2 rounded">
            <div className="font-semibold text-green-800">Clot Formation</div>
            <div className="text-green-600">{completionPercentage}%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedCascade;
