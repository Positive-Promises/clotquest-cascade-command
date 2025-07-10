
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

  // Enhanced drop zone component
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
      small: 'w-12 h-12 text-xs',
      medium: 'w-16 h-16 text-sm',
      large: 'w-18 h-18 text-base'
    };

    const pathwayColors = {
      intrinsic: 'from-blue-500/30 via-blue-600/20 to-blue-700/30 border-blue-400/50',
      extrinsic: 'from-green-500/30 via-green-600/20 to-green-700/30 border-green-400/50',
      common: 'from-purple-500/30 via-purple-600/20 to-purple-700/30 border-purple-400/50',
      regulatory: 'from-cyan-500/30 via-cyan-600/20 to-cyan-700/30 border-cyan-400/50'
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
          "relative rounded-xl border-2 transition-all duration-300 cursor-pointer group",
          "backdrop-blur-xl shadow-lg transform hover:scale-105",
          "flex items-center justify-center overflow-hidden",
          "bg-gradient-to-br",
          pathwayColors[pathway],
          isPlaced ? 'scale-105 shadow-xl animate-pulse' : 'opacity-80 hover:opacity-100',
          canDrop ? 'ring-4 ring-yellow-400/80 animate-bounce scale-110' : '',
          isSelected ? 'ring-4 ring-yellow-400/90 animate-pulse' : '',
          className
        )}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        data-factor-id={factorId}
      >
        {/* Glassmorphic Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-transparent rounded-xl"></div>
        
        {/* Magnetic attraction effect when dragging */}
        {canDrop && (
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/30 to-amber-500/30 rounded-xl animate-pulse">
            <div className="absolute inset-2 border-2 border-dashed border-yellow-400/70 rounded-lg animate-spin"></div>
          </div>
        )}

        {/* Placed factor display */}
        {isPlaced && factor && (
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/40 to-emerald-700/40 rounded-xl border-2 border-emerald-400/70 flex items-center justify-center backdrop-blur-sm">
            <div className="text-white font-bold text-center leading-tight px-1 relative z-10">
              <div className="text-xs opacity-90">{factor.name}</div>
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center animate-bounce shadow-lg">
              <Target className="w-2 h-2 text-white" />
            </div>
          </div>
        )}

        {/* Hint display */}
        {showHints && !isPlaced && (factor || label) && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-xl backdrop-blur-md">
            <div className="text-white font-bold text-center leading-tight px-1">
              <div className="text-xs opacity-90">{factor?.name || label}</div>
            </div>
          </div>
        )}

        {/* Empty zone indicator */}
        {!isPlaced && !showHints && (
          <div className="opacity-60 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center">
            <Activity className="w-4 h-4 text-white/80 animate-pulse" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative w-full h-[580px] p-6 rounded-2xl overflow-hidden">
      {/* Enhanced bleeding patient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/60 via-red-800/50 to-red-950/60 rounded-2xl"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-transparent to-red-500/20 animate-pulse"></div>
      
      {/* Cascade Layout - Redesigned for better Factor VIII visibility */}
      <div className="relative z-10 h-full">
        
        {/* INTRINSIC PATHWAY (Left Side) - Restructured */}
        <div className="absolute left-8 top-8 w-32">
          <div className="text-center mb-3">
            <h3 className="text-blue-400 font-bold text-sm mb-2 flex items-center justify-center backdrop-blur-sm bg-blue-900/30 rounded-lg p-2 border border-blue-400/30">
              <ArrowDown className="w-4 h-4 mr-1 animate-bounce" />
              INTRINSIC PATHWAY
            </h3>
          </div>
          
          {/* Contact System */}
          <div className="space-y-4">
            <div className="flex justify-center space-x-2">
              <DropZone factorId="factor12" pathway="intrinsic" size="small" />
              <DropZone factorId="prekallikrein" pathway="intrinsic" size="small" />
            </div>
            
            <div className="flex justify-center">
              <ArrowDown className="text-blue-400/70 w-5 h-5 animate-bounce" />
            </div>
            
            <div className="flex justify-center space-x-2">
              <DropZone factorId="factor11" pathway="intrinsic" size="small" />
              <DropZone factorId="hmwk" pathway="intrinsic" size="small" />
            </div>
            
            <div className="flex justify-center">
              <ArrowDown className="text-blue-400/70 w-5 h-5 animate-bounce delay-200" />
            </div>
            
            <div className="flex justify-center">
              <DropZone factorId="factor9" pathway="intrinsic" size="medium" />
            </div>
            
            <div className="flex justify-center">
              <ArrowDown className="text-blue-400/70 w-5 h-5 animate-bounce delay-400" />
            </div>
            
            {/* Tenase Complex - Factor VIII positioned clearly */}
            <div className="bg-blue-900/20 border border-blue-400/40 rounded-lg p-3 backdrop-blur-sm">
              <div className="text-center mb-2">
                <div className="text-blue-300 text-xs font-semibold">TENASE COMPLEX</div>
              </div>
              <div className="flex justify-center">
                <DropZone factorId="factor8" pathway="intrinsic" size="medium" />
              </div>
              <div className="text-center text-blue-300 text-xs mt-1 opacity-80">
                VIIIa + IXa
              </div>
            </div>
          </div>
          
          {/* Flow arrow to Factor X */}
          <div className="absolute -bottom-8 right-0 transform translate-x-4">
            <ArrowDownRight className="text-blue-400/70 w-8 h-8 animate-pulse" />
          </div>
        </div>

        {/* EXTRINSIC PATHWAY (Right Side) - Repositioned */}
        <div className="absolute right-8 top-8 w-32">
          <div className="text-center mb-3">
            <h3 className="text-green-400 font-bold text-sm mb-2 flex items-center justify-center backdrop-blur-sm bg-green-900/30 rounded-lg p-2 border border-green-400/30">
              <ArrowDown className="w-4 h-4 mr-1 animate-bounce" />
              EXTRINSIC PATHWAY
            </h3>
          </div>
          
          {/* Tissue Factor System */}
          <div className="space-y-4">
            <div className="flex justify-center">
              <DropZone factorId="tissueFactor" pathway="extrinsic" size="medium" />
            </div>
            
            <div className="flex justify-center">
              <ArrowDown className="text-green-400/70 w-5 h-5 animate-bounce" />
            </div>
            
            <div className="flex justify-center">
              <DropZone factorId="factor7" pathway="extrinsic" size="medium" />
            </div>
            
            <div className="flex justify-center">
              <ArrowDown className="text-green-400/70 w-5 h-5 animate-bounce delay-200" />
            </div>
            
            {/* TF-VIIa Complex */}
            <div className="bg-green-900/20 border border-green-400/40 rounded-lg p-3 backdrop-blur-sm">
              <div className="text-center mb-2">
                <div className="text-green-300 text-xs font-semibold">TF-VIIa</div>
              </div>
              <div className="flex justify-center">
                <DropZone factorId="factor3" pathway="extrinsic" size="medium" />
              </div>
            </div>
          </div>
          
          {/* Flow arrow to Factor X */}
          <div className="absolute -bottom-8 left-0 transform -translate-x-4">
            <ArrowDownLeft className="text-green-400/70 w-8 h-8 animate-pulse" />
          </div>
        </div>

        {/* COMMON PATHWAY (Center) - Enhanced */}
        <div className="absolute left-1/2 top-48 transform -translate-x-1/2 w-52">
          <div className="text-center mb-3">
            <h3 className="text-purple-400 font-bold text-sm mb-2 flex items-center justify-center backdrop-blur-sm bg-purple-900/30 rounded-lg p-2 border border-purple-400/30">
              <Zap className="w-4 h-4 mr-1 animate-pulse" />
              COMMON PATHWAY
            </h3>
          </div>
          
          {/* Central cascade */}
          <div className="space-y-4 flex flex-col items-center">
            {/* Prothrombinase Complex */}
            <div className="bg-purple-900/20 border border-purple-400/40 rounded-lg p-4 backdrop-blur-sm w-full">
              <div className="text-center mb-2">
                <div className="text-purple-300 text-xs font-semibold">PROTHROMBINASE COMPLEX</div>
              </div>
              <div className="flex space-x-4 justify-center">
                <DropZone factorId="factor10" pathway="common" size="medium" />
                <DropZone factorId="factor5" pathway="common" size="medium" />
              </div>
              <div className="text-center text-purple-300 text-xs mt-2 opacity-80">
                Xa + Va
              </div>
            </div>
            
            <div className="flex justify-center">
              <ArrowDown className="text-purple-400/70 w-6 h-6 animate-bounce" />
            </div>
            
            {/* Prothrombin → Thrombin */}
            <div className="flex space-x-4">
              <DropZone factorId="factor2" pathway="common" size="medium" />
              <DropZone factorId="factor1" pathway="common" size="medium" />
            </div>
            
            <div className="flex justify-center">
              <ArrowDown className="text-purple-400/70 w-6 h-6 animate-bounce delay-300" />
            </div>
            
            {/* Fibrinogen → Fibrin */}
            <div className="bg-red-900/20 border border-red-400/40 rounded-lg p-4 backdrop-blur-sm w-full">
              <div className="text-center mb-2">
                <div className="text-red-300 text-xs font-semibold">FIBRIN FORMATION</div>
              </div>
              <div className="flex space-x-4 justify-center">
                <DropZone factorId="fibrinogen" pathway="common" size="medium" />
                <DropZone factorId="factor13" pathway="common" size="medium" />
              </div>
              <div className="text-center text-red-300 text-xs mt-2 opacity-80">
                Fibrinogen → Fibrin
              </div>
            </div>
          </div>
          
          {/* Convergence indicators - Enhanced */}
          <div className="absolute top-0 -left-12">
            <div className="flex items-center">
              <ArrowRight className="text-blue-400/70 w-8 h-8 animate-pulse" />
              <div className="text-blue-300 text-xs ml-1 font-semibold rotate-12">INTRINSIC</div>
            </div>
          </div>
          <div className="absolute top-0 -right-12 rotate-180">
            <div className="flex items-center">
              <ArrowRight className="text-green-400/70 w-8 h-8 animate-pulse" />
              <div className="text-green-300 text-xs ml-1 font-semibold -rotate-12">EXTRINSIC</div>
            </div>
          </div>
        </div>

        {/* REGULATORY SYSTEM (Bottom Left) - Repositioned to avoid obstruction */}
        <div className="absolute left-8 bottom-8 w-40">
          <div className="text-center mb-3">
            <h4 className="text-cyan-400 font-bold text-sm mb-2 flex items-center justify-center backdrop-blur-sm bg-cyan-900/30 rounded-lg p-2 border border-cyan-400/30">
              <Heart className="w-4 h-4 mr-1" />
              REGULATORY FACTORS
            </h4>
          </div>
          <div className="bg-cyan-900/10 border border-cyan-400/30 rounded-lg p-3 backdrop-blur-sm">
            <div className="grid grid-cols-3 gap-2">
              <DropZone factorId="antithrombin" pathway="regulatory" size="small" />
              <DropZone factorId="proteinC" pathway="regulatory" size="small" />
              <DropZone factorId="proteinS" pathway="regulatory" size="small" />
            </div>
            <div className="text-center text-cyan-300 text-xs mt-2 opacity-80">
              Natural Anticoagulants
            </div>
          </div>
        </div>

        {/* FIBRINOLYSIS PATHWAY (Bottom Right) */}
        <div className="absolute right-8 bottom-8 w-36">
          <div className="text-center mb-3">
            <h4 className="text-orange-400 font-bold text-sm mb-2 flex items-center justify-center backdrop-blur-sm bg-orange-900/30 rounded-lg p-2 border border-orange-400/30">
              <Sparkles className="w-4 h-4 mr-1" />
              FIBRINOLYSIS
            </h4>
          </div>
          <div className="bg-orange-900/10 border border-orange-400/30 rounded-lg p-3 backdrop-blur-sm">
            <div className="text-center">
              <div className="text-orange-300 text-sm font-semibold mb-1">tPA → Plasmin</div>
              <div className="text-orange-300 text-xs opacity-80">Fibrin → FDPs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced ambient blood cell particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float opacity-40"
            style={{
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              backgroundColor: `rgba(239, 68, 68, ${0.1 + Math.random() * 0.3})`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${5 + Math.random() * 8}s`
            }}
          />
        ))}
      </div>

      {/* Selection indicator - Enhanced */}
      {selectedFactor && (
        <div className="fixed top-32 left-1/2 transform -translate-x-1/2 pointer-events-none z-50">
          <div className="glassmorphic-card bg-yellow-400/20 backdrop-blur-2xl border-2 border-yellow-400/50 px-6 py-3 rounded-2xl shadow-2xl">
            <div className="text-yellow-200 font-bold text-lg text-center flex items-center">
              <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
              {selectedFactor.name} Selected
              <Sparkles className="w-5 h-5 ml-2 animate-pulse" />
            </div>
            <div className="text-sm text-yellow-300/90 mt-1 text-center">
              Click target position • {selectedFactor.pathway} pathway
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernAnimatedCascade;
