
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUp, Target, Sparkles, Zap } from 'lucide-react';
import ModernAnimatedCascade from '@/components/enhanced/ModernAnimatedCascade';
import ModernEnhancedFactor from '@/components/enhanced/ModernEnhancedFactor';
import { Factor } from '@/types/cascadeTypes';

interface GameCascadeAreaProps {
  factors: Factor[];
  selectedFactor: Factor | null;
  gameStarted: boolean;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDropZoneClick: (factor: Factor) => void;
  onDragStart: (e: React.DragEvent, factor: Factor) => void;
  onFactorClick: (factor: Factor) => void;
}

const GameCascadeArea: React.FC<GameCascadeAreaProps> = ({
  factors,
  selectedFactor,
  gameStarted,
  onDrop,
  onDragOver,
  onDropZoneClick,
  onDragStart,
  onFactorClick
}) => {
  const unplacedFactors = factors.filter(factor => !factor.isPlaced);

  return (
    <div className="w-full order-1 lg:order-2 animate-in slide-in-from-right-4 duration-1000 delay-500">
      {/* Enhanced Cascade Visualization */}
      <Card className="w-full glass-card bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl mb-6 transform hover:scale-[1.01] transition-all duration-300 relative overflow-hidden">
        {/* Ambient Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 animate-pulse"></div>
        
        <CardContent className="p-2 lg:p-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-4">
            <h3 className="text-xl lg:text-2xl font-bold text-white flex items-center">
              <div className="relative mr-3">
                <ArrowUp className="h-6 w-6 lg:h-7 lg:w-7 text-blue-400 rotate-180 animate-bounce" />
                <div className="absolute inset-0 h-6 w-6 lg:h-7 lg:w-7 bg-blue-400/30 rounded-full animate-ping"></div>
              </div>
              Interactive Coagulation Cascade
              <Sparkles className="h-5 w-5 ml-2 text-yellow-400 animate-pulse" />
            </h3>
            
            <div className="glass-card text-white text-xs lg:text-sm bg-white/10 px-4 py-3 rounded-2xl backdrop-blur-sm border border-white/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 animate-pulse"></div>
              <div className="relative z-10 flex items-center">
                <Zap className="h-4 w-4 mr-2 text-amber-400 animate-pulse" />
                {selectedFactor ? (
                  <span className="font-semibold">
                    <span className="text-amber-300">{selectedFactor.name}</span> selected - Click target position!
                  </span>
                ) : (
                  <span>Click factors to select, then click target positions</span>
                )}
              </div>
            </div>
          </div>

          {/* Modern Cascade Area */}
          <div className="relative w-full -mx-2 lg:-mx-4">
            <ModernAnimatedCascade
              factors={factors}
              onDrop={onDrop}
              onDragOver={onDragOver}
              selectedFactor={selectedFactor}
              onDropZoneClick={onDropZoneClick}
            />
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Factor Selection Panel */}
      <Card className="w-full glass-card bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl transform hover:scale-[1.01] transition-all duration-300 relative overflow-hidden">
        {/* Ambient Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-blue-500/5 to-purple-500/5 animate-pulse"></div>
        
        <CardContent className="p-4 lg:p-6 relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl lg:text-2xl font-bold text-white flex items-center">
              <div className="relative mr-3">
                <Target className="h-6 w-6 lg:h-7 lg:w-7 text-yellow-400 animate-pulse" />
                <div className="absolute inset-0 h-6 w-6 lg:h-7 lg:w-7 bg-yellow-400/30 rounded-full animate-ping"></div>
              </div>
              Clotting Factors & Regulators
            </h3>
            
            <div className="glass-card bg-gradient-to-r from-emerald-500/20 to-blue-500/20 px-4 py-2 rounded-xl border border-white/20 backdrop-blur-sm">
              <div className="text-white text-sm font-semibold">
                {unplacedFactors.length} factors remaining
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-3 mb-4">
            {unplacedFactors.slice(0, Math.ceil(unplacedFactors.length / 2)).map((factor, index) => (
              <div key={factor.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                <ModernEnhancedFactor
                  factor={factor}
                  onDragStart={onDragStart}
                  onFactorClick={onFactorClick}
                  gameStarted={gameStarted}
                  isSelected={selectedFactor?.id === factor.id}
                />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-3">
            {unplacedFactors.slice(Math.ceil(unplacedFactors.length / 2)).map((factor, index) => (
              <div key={factor.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${(index + Math.ceil(unplacedFactors.length / 2)) * 100}ms` }}>
                <ModernEnhancedFactor
                  factor={factor}
                  onDragStart={onDragStart}
                  onFactorClick={onFactorClick}
                  gameStarted={gameStarted}
                  isSelected={selectedFactor?.id === factor.id}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameCascadeArea;
