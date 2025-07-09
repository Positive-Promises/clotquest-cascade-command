
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
  showHints?: boolean;
}

const GameCascadeArea: React.FC<GameCascadeAreaProps> = ({
  factors,
  selectedFactor,
  gameStarted,
  onDrop,
  onDragOver,
  onDropZoneClick,
  onDragStart,
  onFactorClick,
  showHints = false
}) => {
  const unplacedFactors = factors.filter(factor => !factor.isPlaced);
  
  // Split factors into left (8) and right (8) sides
  const leftFactors = unplacedFactors.slice(0, 8);
  const rightFactors = unplacedFactors.slice(8, 16);

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

          {/* Modern Cascade Area with Factors on Sides */}
          <div className="grid grid-cols-12 gap-4 items-center">
            {/* Left Side Factors */}
            <div className="col-span-2 space-y-3">
              <h4 className="text-white font-bold text-sm text-center mb-4 flex items-center justify-center">
                <Target className="h-4 w-4 mr-1 text-blue-400" />
                Factors
              </h4>
              {leftFactors.map((factor, index) => (
                <div key={factor.id} className="animate-in fade-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${index * 100}ms` }}>
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

            {/* Central Cascade Area */}
            <div className="col-span-8 relative">
              <ModernAnimatedCascade
                factors={factors}
                onDrop={onDrop}
                onDragOver={onDragOver}
                selectedFactor={selectedFactor}
                onDropZoneClick={onDropZoneClick}
                showHints={showHints}
              />
            </div>

            {/* Right Side Factors */}
            <div className="col-span-2 space-y-3">
              <h4 className="text-white font-bold text-sm text-center mb-4 flex items-center justify-center">
                <Target className="h-4 w-4 mr-1 text-green-400" />
                Factors
              </h4>
              {rightFactors.map((factor, index) => (
                <div key={factor.id} className="animate-in fade-in slide-in-from-right-4 duration-500" style={{ animationDelay: `${(index + 8) * 100}ms` }}>
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
          </div>
        </CardContent>
      </Card>

      {/* Progress and Statistics Panel */}
      <Card className="w-full glass-card bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl transform hover:scale-[1.01] transition-all duration-300 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-blue-500/5 to-purple-500/5 animate-pulse"></div>
        
        <CardContent className="p-4 lg:p-6 relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl lg:text-2xl font-bold text-white flex items-center">
              <div className="relative mr-3">
                <Target className="h-6 w-6 lg:h-7 lg:w-7 text-yellow-400 animate-pulse" />
                <div className="absolute inset-0 h-6 w-6 lg:h-7 lg:w-7 bg-yellow-400/30 rounded-full animate-ping"></div>
              </div>
              Game Progress
            </h3>
            
            <div className="glass-card bg-gradient-to-r from-emerald-500/20 to-blue-500/20 px-4 py-2 rounded-xl border border-white/20 backdrop-blur-sm">
              <div className="text-white text-sm font-semibold">
                {factors.filter(f => f.isPlaced).length} / {factors.length} factors placed
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card bg-blue-50/10 p-4 rounded-lg border border-blue-400/30 text-center">
              <div className="text-2xl font-bold text-blue-400">{factors.filter(f => f.pathway === 'intrinsic' && f.isPlaced).length}</div>
              <div className="text-sm text-gray-300">Intrinsic Pathway</div>
            </div>
            <div className="glass-card bg-green-50/10 p-4 rounded-lg border border-green-400/30 text-center">
              <div className="text-2xl font-bold text-green-400">{factors.filter(f => f.pathway === 'extrinsic' && f.isPlaced).length}</div>
              <div className="text-sm text-gray-300">Extrinsic Pathway</div>
            </div>
            <div className="glass-card bg-purple-50/10 p-4 rounded-lg border border-purple-400/30 text-center">
              <div className="text-2xl font-bold text-purple-400">{factors.filter(f => f.pathway === 'common' && f.isPlaced).length}</div>
              <div className="text-sm text-gray-300">Common Pathway</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameCascadeArea;
