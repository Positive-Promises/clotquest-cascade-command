
import React from 'react';
import { Droplets, Target, ArrowDown, ArrowRight, Zap, ArrowDownRight, ArrowDownLeft, Heart, Activity, Sparkles } from 'lucide-react';
import { Factor } from '@/types/cascadeTypes';
import { cn } from '@/lib/utils';

interface ModernAnimatedCascadeProps {
  factors: Factor[];
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  selectedFactor: Factor | null;
  onDropZoneClick: (factor: Factor) => void;
  showHints?: boolean;
}

const ModernAnimatedCascade: React.FC<ModernAnimatedCascadeProps> = ({
  factors,
  onDrop,
  onDragOver,
  selectedFactor,
  onDropZoneClick,
  showHints = false
}) => {
  const getFactorById = (id: string) => factors.find(f => f.id === id);
  const isFactorPlaced = (id: string) => factors.find(f => f.id === id)?.isPlaced || false;

  // Enhanced drop zone component with glassmorphism and 3D effects
  const DropZone: React.FC<{ 
    factorId: string; 
    pathway: 'intrinsic' | 'extrinsic' | 'common' | 'regulatory';
    size?: 'small' | 'medium' | 'large';
    className?: string;
    label?: string;
  }> = ({ factorId, pathway, size = 'medium', className = '', label }) => {
    const factor = getFactorById(factorId);
    const isPlaced = isFactorPlaced(factorId);
    const isSelected = selectedFactor?.id === factorId;
    const canDrop = selectedFactor && !isPlaced && selectedFactor.id === factorId;

    const sizeClasses = {
      small: 'w-16 h-16 text-xs',
      medium: 'w-20 h-20 text-sm',
      large: 'w-24 h-24 text-base'
    };

    const pathwayColors = {
      intrinsic: 'from-blue-500/30 via-blue-600/20 to-blue-700/30 border-blue-400/50 shadow-blue-400/20',
      extrinsic: 'from-green-500/30 via-green-600/20 to-green-700/30 border-green-400/50 shadow-green-400/20',
      common: 'from-purple-500/30 via-purple-600/20 to-purple-700/30 border-purple-400/50 shadow-purple-400/20',
      regulatory: 'from-cyan-500/30 via-cyan-600/20 to-cyan-700/30 border-cyan-400/50 shadow-cyan-400/20'
    };

    const handleClick = () => {
      if (factor && !isPlaced) {
        onDropZoneClick(factor);
      }
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onDrop(e);
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onDragOver(e);
    };

    return (
      <div
        className={cn(
          sizeClasses[size],
          "relative rounded-2xl border-2 transition-all duration-500 cursor-pointer group",
          "backdrop-blur-xl shadow-2xl transform hover:scale-110 hover:rotate-1",
          "flex items-center justify-center overflow-hidden",
          "bg-gradient-to-br",
          pathwayColors[pathway],
          isPlaced ? 'scale-105 shadow-2xl animate-pulse' : 'opacity-80 hover:opacity-100',
          canDrop ? 'ring-4 ring-yellow-400/80 animate-bounce scale-125 shadow-yellow-400/50' : '',
          isSelected ? 'ring-6 ring-yellow-400/90 shadow-yellow-400/60 animate-pulse' : '',
          className
        )}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        data-factor-id={factorId}
      >
        {/* 3D Glassmorphic Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/5 to-transparent rounded-2xl"></div>
        <div className="absolute inset-1 bg-gradient-to-tl from-white/10 via-transparent to-white/5 rounded-xl"></div>

        {/* Magnetic attraction effect when dragging */}
        {canDrop && (
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/30 to-amber-500/30 rounded-2xl animate-pulse">
            <div className="absolute inset-2 border-2 border-dashed border-yellow-400/70 rounded-xl animate-spin"></div>
            <div className="absolute inset-4 border border-dashed border-yellow-300/50 rounded-lg animate-ping"></div>
          </div>
        )}

        {/* Placed factor display with celebration effects */}
        {isPlaced && factor && (
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/40 to-emerald-700/40 rounded-2xl border-2 border-emerald-400/70 flex items-center justify-center backdrop-blur-sm">
            <div className="text-white font-bold text-center leading-tight px-2 relative z-10">
              <div className="text-xs opacity-90 mb-1">{factor.name}</div>
              <Sparkles className="w-4 h-4 mx-auto animate-pulse text-emerald-300" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center animate-bounce shadow-lg">
              <Target className="w-3 h-3 text-white" />
            </div>
            {/* Success particles */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-emerald-300 rounded-full animate-ping"
                  style={{
                    left: `${20 + (i * 10)}%`,
                    top: `${20 + (i * 8)}%`,
                    animationDelay: `${i * 200}ms`
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Hint display with elegant typography */}
        {showHints && !isPlaced && (factor || label) && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-2xl backdrop-blur-md">
            <div className="text-white font-bold text-center leading-tight px-2">
              <div className="text-xs opacity-90">{factor?.name || label}</div>
            </div>
          </div>
        )}

        {/* Empty zone indicator with pulsing animation */}
        {!isPlaced && !showHints && (
          <div className="opacity-60 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center">
            <Activity className="w-6 h-6 text-white/80 animate-pulse" />
            <div className="absolute inset-0 border-2 border-dashed border-white/30 rounded-2xl animate-pulse"></div>
          </div>
        )}

        {/* Pathway indicator */}
        <div className={cn(
          "absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold",
          pathway === 'intrinsic' && "bg-blue-500 text-white",
          pathway === 'extrinsic' && "bg-green-500 text-white",
          pathway === 'common' && "bg-purple-500 text-white",
          pathway === 'regulatory' && "bg-cyan-500 text-white"
        )}>
          {pathway[0].toUpperCase()}
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full h-full min-h-[800px] p-8 rounded-3xl overflow-hidden">
      {/* Enhanced bleeding patient background with 3D depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/60 via-red-800/50 to-red-950/60 rounded-3xl"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-transparent to-red-500/20 animate-pulse"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(220,38,38,0.15)_0%,transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(239,68,68,0.1)_0%,transparent_60%)]"></div>
      
      {/* Anatomically Correct Cascade Layout */}
      <div className="relative z-10 h-full">
        
        {/* INTRINSIC PATHWAY (Left Side) - Contact Activation System */}
        <div className="absolute left-8 top-16 w-48">
          <div className="text-center mb-6">
            <h3 className="text-blue-400 font-bold text-xl mb-2 flex items-center justify-center backdrop-blur-sm bg-blue-900/30 rounded-xl p-3 border border-blue-400/30">
              <ArrowDown className="w-6 h-6 mr-2 animate-bounce" />
              INTRINSIC PATHWAY
            </h3>
            <div className="text-blue-300 text-sm glassmorphic-card p-2 rounded-lg">Contact Activation</div>
          </div>
          
          {/* Contact System */}
          <div className="space-y-8">
            <div className="flex justify-center space-x-4">
              <DropZone factorId="factor12" pathway="intrinsic" size="medium" />
              <DropZone factorId="prekallikrein" pathway="intrinsic" size="small" />
            </div>
            
            <div className="flex justify-center">
              <ArrowDown className="text-blue-400/70 w-8 h-8 animate-bounce drop-shadow-lg" />
            </div>
            
            <div className="flex justify-center space-x-4">
              <DropZone factorId="factor11" pathway="intrinsic" size="medium" />
              <DropZone factorId="hmwk" pathway="intrinsic" size="small" />
            </div>
            
            <div className="flex justify-center">
              <ArrowDown className="text-blue-400/70 w-8 h-8 animate-bounce delay-300 drop-shadow-lg" />
            </div>
            
            <div className="flex justify-center">
              <DropZone factorId="factor9" pathway="intrinsic" size="large" />
            </div>
            
            <div className="flex justify-center">
              <ArrowDown className="text-blue-400/70 w-8 h-8 animate-bounce delay-500 drop-shadow-lg" />
            </div>
            
            <div className="flex justify-center">
              <DropZone factorId="factor8" pathway="intrinsic" size="large" />
            </div>
          </div>
          
          {/* Flow arrow to common pathway */}
          <div className="absolute -bottom-4 right-0 transform translate-x-8">
            <ArrowDownRight className="text-blue-400/70 w-12 h-12 animate-pulse drop-shadow-xl" />
          </div>
        </div>

        {/* EXTRINSIC PATHWAY (Right Side) - Tissue Factor System */}
        <div className="absolute right-8 top-16 w-48">
          <div className="text-center mb-6">
            <h3 className="text-green-400 font-bold text-xl mb-2 flex items-center justify-center backdrop-blur-sm bg-green-900/30 rounded-xl p-3 border border-green-400/30">
              <ArrowDown className="w-6 h-6 mr-2 animate-bounce" />
              EXTRINSIC PATHWAY
            </h3>
            <div className="text-green-300 text-sm glassmorphic-card p-2 rounded-lg">Tissue Factor</div>
          </div>
          
          {/* Tissue Factor System */}
          <div className="space-y-8">
            <div className="flex justify-center">
              <DropZone factorId="tissueFactor" pathway="extrinsic" size="large" />
            </div>
            
            <div className="flex justify-center">
              <ArrowDown className="text-green-400/70 w-8 h-8 animate-bounce drop-shadow-lg" />
            </div>
            
            <div className="flex justify-center">
              <DropZone factorId="factor7" pathway="extrinsic" size="large" />
            </div>
            
            <div className="flex justify-center">
              <ArrowDown className="text-green-400/70 w-8 h-8 animate-bounce delay-300 drop-shadow-lg" />
            </div>
            
            <div className="flex justify-center">
              <DropZone factorId="factor3" pathway="extrinsic" size="medium" />
            </div>
          </div>
          
          {/* Flow arrow to common pathway */}
          <div className="absolute -bottom-4 left-0 transform -translate-x-8">
            <ArrowDownLeft className="text-green-400/70 w-12 h-12 animate-pulse drop-shadow-xl" />
          </div>
        </div>

        {/* COMMON PATHWAY (Center) - Final Common Path */}
        <div className="absolute left-1/2 top-80 transform -translate-x-1/2 w-64">
          <div className="text-center mb-6">
            <h3 className="text-purple-400 font-bold text-xl mb-2 flex items-center justify-center backdrop-blur-sm bg-purple-900/30 rounded-xl p-3 border border-purple-400/30">
              <Zap className="w-6 h-6 mr-2 animate-pulse" />
              COMMON PATHWAY
            </h3>
            <div className="text-purple-300 text-sm glassmorphic-card p-2 rounded-lg">Final Common Path</div>
          </div>
          
          {/* Central convergence cascade */}
          <div className="space-y-8 flex flex-col items-center">
            {/* Convergence point - Prothrombinase Complex */}
            <div className="flex space-x-8">
              <DropZone factorId="factor10" pathway="common" size="large" />
              <DropZone factorId="factor5" pathway="common" size="large" />
            </div>
            
            <div className="flex justify-center">
              <ArrowDown className="text-purple-400/70 w-10 h-10 animate-bounce drop-shadow-xl" />
            </div>
            
            {/* Prothrombin → Thrombin */}
            <div className="flex space-x-8">
              <DropZone factorId="factor2" pathway="common" size="large" />
              <DropZone factorId="factor1" pathway="common" size="large" />
            </div>
            
            <div className="flex justify-center">
              <ArrowDown className="text-purple-400/70 w-10 h-10 animate-bounce delay-500 drop-shadow-xl" />
            </div>
            
            {/* Fibrinogen → Fibrin */}
            <div className="flex space-x-8">
              <DropZone factorId="fibrinogen" pathway="common" size="large" />
              <DropZone factorId="factor13" pathway="common" size="large" />
            </div>
          </div>
          
          {/* Convergence indicators */}
          <div className="absolute top-16 -left-16">
            <ArrowRight className="text-blue-400/70 w-10 h-10 animate-pulse drop-shadow-lg" />
          </div>
          <div className="absolute top-16 -right-16 rotate-180">
            <ArrowRight className="text-green-400/70 w-10 h-10 animate-pulse drop-shadow-lg" />
          </div>
        </div>

        {/* REGULATORY SYSTEM (Left Bottom) */}
        <div className="absolute left-8 bottom-16 w-32">
          <div className="text-center mb-4">
            <h4 className="text-cyan-400 font-bold text-sm mb-2 flex items-center justify-center backdrop-blur-sm bg-cyan-900/30 rounded-lg p-2 border border-cyan-400/30">
              <Heart className="w-4 h-4 mr-1" />
              REGULATORY
            </h4>
          </div>
          <div className="space-y-4">
            <DropZone factorId="antithrombin" pathway="regulatory" size="medium" />
          </div>
        </div>
      </div>

      {/* Enhanced ambient blood cell particles with 3D effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float opacity-60"
            style={{
              width: `${2 + Math.random() * 6}px`,
              height: `${2 + Math.random() * 6}px`,
              backgroundColor: `rgba(239, 68, 68, ${0.1 + Math.random() * 0.4})`,
              boxShadow: `0 0 ${Math.random() * 10}px rgba(239, 68, 68, 0.3)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 8}s`
            }}
          />
        ))}
      </div>

      {/* Selection indicator with glassmorphic design */}
      {selectedFactor && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 pointer-events-none z-50">
          <div className="glassmorphic-card bg-yellow-400/20 backdrop-blur-2xl border-2 border-yellow-400/50 px-8 py-4 rounded-2xl shadow-2xl">
            <div className="text-yellow-200 font-bold text-xl text-center flex items-center">
              <Sparkles className="w-6 h-6 mr-2 animate-pulse" />
              {selectedFactor.name} Selected
              <Sparkles className="w-6 h-6 ml-2 animate-pulse" />
            </div>
            <div className="text-sm text-yellow-300/90 mt-2 text-center">
              Click target position to place • {selectedFactor.pathway} pathway
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernAnimatedCascade;
