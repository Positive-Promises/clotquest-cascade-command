
import React from 'react';
import { Droplets, Target, ArrowDown, ArrowRight, Zap } from 'lucide-react';
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

  // Chess-like drop zone component
  const DropZone: React.FC<{ 
    factorId: string; 
    pathway: 'intrinsic' | 'extrinsic' | 'common';
    position: { row: number; col: number };
    size?: 'small' | 'medium' | 'large';
  }> = ({ factorId, pathway, position, size = 'medium' }) => {
    const factor = getFactorById(factorId);
    const isPlaced = isFactorPlaced(factorId);
    const isSelected = selectedFactor?.id === factorId;
    const canDrop = selectedFactor && !isPlaced;

    const sizeClasses = {
      small: 'w-16 h-16',
      medium: 'w-20 h-20',
      large: 'w-24 h-24'
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
          isSelected ? 'ring-4 ring-yellow-400/80 shadow-yellow-400/50' : ''
        )}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        data-factor-id={factorId}
        style={{
          gridRow: position.row,
          gridColumn: position.col,
          background: `linear-gradient(135deg, ${pathwayColors[pathway].split(' ')[0].replace('from-', '').replace('/30', '/20')}, ${pathwayColors[pathway].split(' ')[1].replace('to-', '').replace('/30', '/20')})`
        }}
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
            <div className="text-white font-bold text-xs text-center leading-tight">
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
            <div className="text-white font-bold text-xs text-center leading-tight px-1">
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
    <div className="relative w-full h-full min-h-[600px] p-6 rounded-2xl overflow-hidden">
      {/* Red gradient background to simulate bleeding patient */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/40 via-red-800/30 to-red-900/40 rounded-2xl"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-transparent to-red-500/10 animate-pulse"></div>
      
      {/* Cascade Grid Layout */}
      <div className="relative z-10 grid grid-cols-12 grid-rows-8 gap-4 h-full">
        
        {/* INTRINSIC PATHWAY (Left Side) */}
        <div className="col-span-4 row-span-8 relative">
          <div className="absolute top-0 left-0 right-0 text-center">
            <h3 className="text-blue-400 font-bold text-lg mb-4 flex items-center justify-center">
              <ArrowDown className="w-5 h-5 mr-2" />
              INTRINSIC PATHWAY
            </h3>
          </div>
          
          {/* Intrinsic pathway factors arranged vertically */}
          <div className="grid grid-cols-3 grid-rows-6 gap-3 mt-12 h-5/6">
            <DropZone factorId="factor12" pathway="intrinsic" position={{ row: 1, col: 2 }} />
            <DropZone factorId="factor11" pathway="intrinsic" position={{ row: 2, col: 1 }} />
            <DropZone factorId="factor9" pathway="intrinsic" position={{ row: 2, col: 3 }} />
            <DropZone factorId="factor8" pathway="intrinsic" position={{ row: 3, col: 2 }} />
            <DropZone factorId="prekallikrein" pathway="intrinsic" position={{ row: 4, col: 1 }} />
            <DropZone factorId="hmwk" pathway="intrinsic" position={{ row: 4, col: 3 }} />
          </div>
          
          {/* Flow arrows */}
          <div className="absolute inset-0 pointer-events-none">
            <ArrowDown className="absolute top-20 left-1/2 transform -translate-x-1/2 text-blue-400/60 w-6 h-6 animate-bounce" />
            <ArrowDown className="absolute top-32 left-1/2 transform -translate-x-1/2 text-blue-400/60 w-6 h-6 animate-bounce delay-300" />
            <ArrowDown className="absolute top-44 left-1/2 transform -translate-x-1/2 text-blue-400/60 w-6 h-6 animate-bounce delay-700" />
          </div>
        </div>

        {/* COMMON PATHWAY (Center) */}
        <div className="col-span-4 row-span-8 relative">
          <div className="absolute top-0 left-0 right-0 text-center">
            <h3 className="text-purple-400 font-bold text-lg mb-4 flex items-center justify-center">
              <Zap className="w-5 h-5 mr-2" />
              COMMON PATHWAY
            </h3>
          </div>
          
          {/* Common pathway - convergence point */}
          <div className="grid grid-cols-2 grid-rows-6 gap-4 mt-12 h-5/6">
            <DropZone factorId="factor10" pathway="common" position={{ row: 1, col: 1 }} size="large" />
            <DropZone factorId="factor5" pathway="common" position={{ row: 1, col: 2 }} size="large" />
            <DropZone factorId="factor2" pathway="common" position={{ row: 3, col: 1 }} size="large" />
            <DropZone factorId="factor1" pathway="common" position={{ row: 3, col: 2 }} size="large" />
            <DropZone factorId="factor13" pathway="common" position={{ row: 5, col: 1 }} size="large" />
            <DropZone factorId="fibrinogen" pathway="common" position={{ row: 5, col: 2 }} size="large" />
          </div>
          
          {/* Convergence arrows */}
          <div className="absolute inset-0 pointer-events-none">
            <ArrowRight className="absolute top-1/4 -left-4 text-blue-400/60 w-8 h-8 animate-pulse" />
            <ArrowRight className="absolute top-1/4 -right-12 text-green-400/60 w-8 h-8 animate-pulse rotate-180" />
            <ArrowDown className="absolute top-1/3 left-1/2 transform -translate-x-1/2 text-purple-400/60 w-8 h-8 animate-bounce" />
          </div>
        </div>

        {/* EXTRINSIC PATHWAY (Right Side) */}
        <div className="col-span-4 row-span-8 relative">
          <div className="absolute top-0 left-0 right-0 text-center">
            <h3 className="text-green-400 font-bold text-lg mb-4 flex items-center justify-center">
              <ArrowDown className="w-5 h-5 mr-2" />
              EXTRINSIC PATHWAY
            </h3>
          </div>
          
          {/* Extrinsic pathway factors */}
          <div className="grid grid-cols-3 grid-rows-4 gap-3 mt-12 h-3/6">
            <DropZone factorId="factor7" pathway="extrinsic" position={{ row: 1, col: 2 }} />
            <DropZone factorId="factor3" pathway="extrinsic" position={{ row: 2, col: 1 }} />
            <DropZone factorId="tissueFactor" pathway="extrinsic" position={{ row: 2, col: 3 }} />
          </div>
          
          {/* Flow arrows */}
          <div className="absolute inset-0 pointer-events-none">
            <ArrowDown className="absolute top-20 left-1/2 transform -translate-x-1/2 text-green-400/60 w-6 h-6 animate-bounce" />
            <ArrowDown className="absolute top-32 left-1/2 transform -translate-x-1/2 text-green-400/60 w-6 h-6 animate-bounce delay-500" />
          </div>
        </div>
      </div>

      {/* Ambient blood cell particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-red-400/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Selection indicator */}
      {selectedFactor && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50">
          <div className="glass-card bg-yellow-400/20 backdrop-blur-xl border border-yellow-400/40 px-4 py-2 rounded-xl">
            <div className="text-yellow-300 font-bold text-sm text-center">
              {selectedFactor.name} Selected
              <div className="text-xs text-yellow-200/80 mt-1">Click target position to place</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernAnimatedCascade;
