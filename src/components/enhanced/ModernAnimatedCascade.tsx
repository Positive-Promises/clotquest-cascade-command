
import React from 'react';
import { Droplets, Target, ArrowDown, ArrowRight, Zap, ArrowDownRight, ArrowDownLeft } from 'lucide-react';
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

  // Enhanced drop zone component with better visual hierarchy
  const DropZone: React.FC<{ 
    factorId: string; 
    pathway: 'intrinsic' | 'extrinsic' | 'common';
    size?: 'small' | 'medium' | 'large';
    className?: string;
  }> = ({ factorId, pathway, size = 'medium', className = '' }) => {
    const factor = getFactorById(factorId);
    const isPlaced = isFactorPlaced(factorId);
    const isSelected = selectedFactor?.id === factorId;
    const canDrop = selectedFactor && !isPlaced;

    const sizeClasses = {
      small: 'w-16 h-16 text-xs',
      medium: 'w-20 h-20 text-sm',
      large: 'w-24 h-24 text-base'
    };

    const pathwayColors = {
      intrinsic: 'from-blue-500/30 to-blue-700/30 border-blue-400/50',
      extrinsic: 'from-green-500/30 to-green-700/30 border-green-400/50',
      common: 'from-purple-500/30 to-purple-700/30 border-purple-400/50'
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
          "relative rounded-xl border-2 transition-all duration-300 cursor-pointer",
          "backdrop-blur-sm shadow-lg transform hover:scale-105",
          "flex items-center justify-center group",
          pathwayColors[pathway],
          isPlaced ? 'opacity-100 scale-105 shadow-xl' : 'opacity-70 hover:opacity-100',
          canDrop ? 'ring-2 ring-yellow-400/60 animate-pulse scale-110' : '',
          isSelected ? 'ring-4 ring-yellow-400/80 shadow-yellow-400/50' : '',
          className
        )}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        data-factor-id={factorId}
      >
        {/* Magnetic attraction effect when dragging */}
        {canDrop && (
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-amber-500/20 rounded-xl animate-pulse">
            <div className="absolute inset-2 border-2 border-dashed border-yellow-400/60 rounded-lg animate-spin"></div>
          </div>
        )}

        {/* Placed factor display */}
        {isPlaced && factor && (
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/30 to-emerald-700/30 rounded-xl border-2 border-emerald-400/60 flex items-center justify-center">
            <div className="text-white font-bold text-center leading-tight px-1">
              {factor.name}
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full flex items-center justify-center">
              <Target className="w-2 h-2 text-white" />
            </div>
          </div>
        )}

        {/* Hint display */}
        {showHints && !isPlaced && factor && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-xl backdrop-blur-sm">
            <div className="text-white font-bold text-center leading-tight px-1">
              {factor.name}
            </div>
          </div>
        )}

        {/* Empty zone indicator */}
        {!isPlaced && !showHints && (
          <div className="opacity-50 group-hover:opacity-100 transition-opacity">
            <Droplets className="w-6 h-6 text-white/70" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative w-full h-full min-h-[700px] p-8 rounded-2xl overflow-hidden">
      {/* Enhanced red gradient background to simulate bleeding patient */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/50 via-red-800/40 to-red-900/50 rounded-2xl"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-transparent to-red-500/20 animate-pulse"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.1)_0%,transparent_70%)]"></div>
      
      {/* Improved Cascade Layout - Three Column Grid */}
      <div className="relative z-10 grid grid-cols-12 gap-8 h-full">
        
        {/* INTRINSIC PATHWAY (Left Side) */}
        <div className="col-span-4 relative">
          <div className="text-center mb-6">
            <h3 className="text-blue-400 font-bold text-xl mb-2 flex items-center justify-center">
              <ArrowDown className="w-6 h-6 mr-2" />
              INTRINSIC PATHWAY
            </h3>
            <div className="text-blue-300 text-sm">(Contact Activation)</div>
          </div>
          
          {/* Vertical cascade layout */}
          <div className="space-y-6">
            {/* Contact factors */}
            <div className="flex justify-center space-x-4">
              <DropZone factorId="factor12" pathway="intrinsic" size="medium" />
            </div>
            
            <div className="flex justify-center">
              <ArrowDown className="text-blue-400/60 w-6 h-6 animate-bounce" />
            </div>
            
            <div className="flex justify-center space-x-6">
              <DropZone factorId="factor11" pathway="intrinsic" size="medium" />
              <DropZone factorId="factor9" pathway="intrinsic" size="medium" />
            </div>
            
            <div className="flex justify-center">
              <ArrowDown className="text-blue-400/60 w-6 h-6 animate-bounce delay-300" />
            </div>
            
            <div className="flex justify-center">
              <DropZone factorId="factor8" pathway="intrinsic" size="large" />
            </div>
            
            <div className="flex justify-center space-x-4">
              <DropZone factorId="prekallikrein" pathway="intrinsic" size="small" />
              <DropZone factorId="hmwk" pathway="intrinsic" size="small" />
            </div>
          </div>
          
          {/* Flow arrow to common pathway */}
          <div className="absolute bottom-20 right-0 transform translate-x-4">
            <ArrowDownRight className="text-blue-400/60 w-8 h-8 animate-pulse" />
          </div>
        </div>

        {/* COMMON PATHWAY (Center) */}
        <div className="col-span-4 relative">
          <div className="text-center mb-6">
            <h3 className="text-purple-400 font-bold text-xl mb-2 flex items-center justify-center">
              <Zap className="w-6 h-6 mr-2" />
              COMMON PATHWAY
            </h3>
            <div className="text-purple-300 text-sm">(Final Common Path)</div>
          </div>
          
          {/* Central convergence cascade */}
          <div className="space-y-8 flex flex-col items-center">
            {/* Convergence point */}
            <div className="flex space-x-6">
              <DropZone factorId="factor10" pathway="common" size="large" />
              <DropZone factorId="factor5" pathway="common" size="large" />
            </div>
            
            <div className="flex justify-center">
              <ArrowDown className="text-purple-400/60 w-8 h-8 animate-bounce" />
            </div>
            
            <div className="flex space-x-6">
              <DropZone factorId="factor2" pathway="common" size="large" />
              <DropZone factorId="factor1" pathway="common" size="large" />
            </div>
            
            <div className="flex justify-center">
              <ArrowDown className="text-purple-400/60 w-8 h-8 animate-bounce delay-500" />
            </div>
            
            <div className="flex space-x-6">
              <DropZone factorId="factor13" pathway="common" size="large" />
              <DropZone factorId="fibrinogen" pathway="common" size="large" />
            </div>
          </div>
          
          {/* Convergence indicators */}
          <div className="absolute top-32 -left-8">
            <ArrowRight className="text-blue-400/60 w-8 h-8 animate-pulse" />
          </div>
          <div className="absolute top-32 -right-8 rotate-180">
            <ArrowRight className="text-green-400/60 w-8 h-8 animate-pulse" />
          </div>
        </div>

        {/* EXTRINSIC PATHWAY (Right Side) */}
        <div className="col-span-4 relative">
          <div className="text-center mb-6">
            <h3 className="text-green-400 font-bold text-xl mb-2 flex items-center justify-center">
              <ArrowDown className="w-6 h-6 mr-2" />
              EXTRINSIC PATHWAY
            </h3>
            <div className="text-green-300 text-sm">(Tissue Factor)</div>
          </div>
          
          {/* Simplified extrinsic cascade */}
          <div className="space-y-8 flex flex-col items-center">
            <div className="flex justify-center">
              <DropZone factorId="factor7" pathway="extrinsic" size="large" />
            </div>
            
            <div className="flex justify-center">
              <ArrowDown className="text-green-400/60 w-6 h-6 animate-bounce" />
            </div>
            
            <div className="flex justify-center space-x-6">
              <DropZone factorId="factor3" pathway="extrinsic" size="medium" />
              <DropZone factorId="tissueFactor" pathway="extrinsic" size="medium" />
            </div>
          </div>
          
          {/* Flow arrow to common pathway */}
          <div className="absolute bottom-20 left-0 transform -translate-x-4">
            <ArrowDownLeft className="text-green-400/60 w-8 h-8 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Enhanced ambient blood cell particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              backgroundColor: `rgba(239, 68, 68, ${0.1 + Math.random() * 0.3})`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 6}s`
            }}
          />
        ))}
      </div>

      {/* Selection indicator */}
      {selectedFactor && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50">
          <div className="glass-card bg-yellow-400/20 backdrop-blur-xl border border-yellow-400/40 px-6 py-3 rounded-xl">
            <div className="text-yellow-300 font-bold text-lg text-center">
              {selectedFactor.name} Selected
              <div className="text-sm text-yellow-200/80 mt-1">Click target position to place</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernAnimatedCascade;
