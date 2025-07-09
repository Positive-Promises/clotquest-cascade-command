
import React from 'react';
import { Factor } from '@/types/cascadeTypes';
import { cn } from '@/lib/utils';

interface ModernAnimatedCascadeProps {
  factors: Factor[];
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  selectedFactor: Factor | null;
  onDropZoneClick: (factor: Factor) => void;
}

const ModernAnimatedCascade: React.FC<ModernAnimatedCascadeProps> = ({
  factors,
  onDrop,
  onDragOver,
  selectedFactor,
  onDropZoneClick,
}) => {
  const intrinsicFactors = factors.filter(f => f.pathway === 'intrinsic');
  const extrinsicFactors = factors.filter(f => f.pathway === 'extrinsic');
  const commonFactors = factors.filter(f => f.pathway === 'common');

  const DropZone = ({ factor, pathway }: { factor: Factor; pathway: string }) => {
    const isCorrectTarget = selectedFactor?.id === factor.id;
    const isOccupied = factor.isPlaced;
    
    return (
      <div
        onClick={() => !isOccupied && onDropZoneClick(factor)}
        onDrop={onDrop}
        onDragOver={onDragOver}
        className={cn(
          "relative w-24 h-20 border-2 border-dashed rounded-xl transition-all duration-300 cursor-pointer transform hover:scale-105",
          "backdrop-blur-sm shadow-lg",
          isCorrectTarget ? 
            "border-yellow-400 bg-yellow-400/20 animate-pulse shadow-yellow-400/50" :
            isOccupied ? 
              "border-green-400 bg-green-400/20" :
              pathway === 'intrinsic' ? "border-blue-400/50 bg-blue-400/10 hover:bg-blue-400/20" :
              pathway === 'extrinsic' ? "border-green-400/50 bg-green-400/10 hover:bg-green-400/20" :
              "border-purple-400/50 bg-purple-400/10 hover:bg-purple-400/20"
        )}
      >
        {/* Target Indicator */}
        {isCorrectTarget && (
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400/30 to-amber-400/30 animate-pulse">
            <div className="absolute inset-0 rounded-xl border-2 border-yellow-400 animate-ping"></div>
          </div>
        )}
        
        {/* Factor Display */}
        {isOccupied ? (
          <div className={cn(
            "absolute inset-0 rounded-xl p-2 text-white font-bold text-center flex items-center justify-center text-xs",
            pathway === 'intrinsic' ? "bg-gradient-to-br from-blue-500 to-blue-700" :
            pathway === 'extrinsic' ? "bg-gradient-to-br from-green-500 to-green-700" :
            "bg-gradient-to-br from-purple-500 to-purple-700"
          )}>
            <div>
              <div className="font-bold">{factor.name}</div>
              <div className="text-xs opacity-80">{factor.pathway}</div>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-white/60 text-xs font-medium">{factor.name}</div>
              <div className="text-white/40 text-xs">{isCorrectTarget ? 'Drop here!' : 'Drop zone'}</div>
            </div>
          </div>
        )}

        {/* Ambient particles for enhanced visual appeal */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-1 right-1 w-1 h-1 bg-white rounded-full animate-pulse"></div>
          <div className="absolute bottom-1 left-1 w-0.5 h-0.5 bg-white rounded-full animate-ping delay-300"></div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full glass-card bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
      {/* Enhanced Cascade Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Coagulation Cascade
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full animate-pulse"></div>
      </div>

      {/* Cascade Pathways */}
      <div className="space-y-12">
        {/* Intrinsic Pathway */}
        <div className="space-y-6">
          <div className="flex items-center justify-center">
            <div className="glass-card bg-blue-500/20 px-6 py-3 rounded-2xl border border-blue-400/30">
              <h3 className="text-xl font-bold text-blue-300 text-center">Intrinsic Pathway</h3>
              <p className="text-blue-200 text-sm text-center opacity-80">Contact Activation</p>
            </div>
          </div>
          
          <div className="flex justify-center items-center gap-8 flex-wrap">
            {intrinsicFactors.map((factor, index) => (
              <div key={factor.id} className="animate-in fade-in slide-in-from-top-4 duration-500" style={{ animationDelay: `${index * 150}ms` }}>
                <DropZone factor={factor} pathway="intrinsic" />
                {index < intrinsicFactors.length - 1 && (
                  <div className="absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <div className="w-8 h-0.5 bg-blue-400 rounded-full animate-pulse"></div>
                    <div className="absolute -right-1 -top-1 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Extrinsic Pathway */}
        <div className="space-y-6">
          <div className="flex items-center justify-center">
            <div className="glass-card bg-green-500/20 px-6 py-3 rounded-2xl border border-green-400/30">
              <h3 className="text-xl font-bold text-green-300 text-center">Extrinsic Pathway</h3>
              <p className="text-green-200 text-sm text-center opacity-80">Tissue Factor</p>
            </div>
          </div>
          
          <div className="flex justify-center items-center gap-8 flex-wrap">
            {extrinsicFactors.map((factor, index) => (
              <div key={factor.id} className="animate-in fade-in slide-in-from-top-4 duration-500" style={{ animationDelay: `${(index + intrinsicFactors.length) * 150}ms` }}>
                <DropZone factor={factor} pathway="extrinsic" />
                {index < extrinsicFactors.length - 1 && (
                  <div className="absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <div className="w-8 h-0.5 bg-green-400 rounded-full animate-pulse"></div>
                    <div className="absolute -right-1 -top-1 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Convergence Arrow */}
        <div className="flex justify-center">
          <div className="glass-card bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-green-500/20 px-4 py-2 rounded-xl border border-white/20">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
              <span className="text-white font-medium text-sm">Convergence</span>
              <div className="w-4 h-0.5 bg-gradient-to-r from-purple-400 to-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Common Pathway */}
        <div className="space-y-6">
          <div className="flex items-center justify-center">
            <div className="glass-card bg-purple-500/20 px-6 py-3 rounded-2xl border border-purple-400/30">
              <h3 className="text-xl font-bold text-purple-300 text-center">Common Pathway</h3>
              <p className="text-purple-200 text-sm text-center opacity-80">Final Clot Formation</p>
            </div>
          </div>
          
          <div className="flex justify-center items-center gap-8 flex-wrap">
            {commonFactors.map((factor, index) => (
              <div key={factor.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${(index + intrinsicFactors.length + extrinsicFactors.length) * 150}ms` }}>
                <DropZone factor={factor} pathway="common" />
                {index < commonFactors.length - 1 && (
                  <div className="absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <div className="w-8 h-0.5 bg-purple-400 rounded-full animate-pulse"></div>
                    <div className="absolute -right-1 -top-1 w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Final Product */}
        <div className="flex justify-center">
          <div className="glass-card bg-gradient-to-r from-red-500/30 via-pink-500/30 to-red-600/30 px-8 py-4 rounded-2xl border border-red-400/40 animate-pulse">
            <h3 className="text-2xl font-bold text-red-300 text-center">FIBRIN CLOT</h3>
            <p className="text-red-200 text-sm text-center opacity-80">Hemostasis Achieved</p>
          </div>
        </div>
      </div>

      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-purple-400/10 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-green-400/10 rounded-full animate-ping delay-500"></div>
      </div>
    </div>
  );
};

export default ModernAnimatedCascade;
