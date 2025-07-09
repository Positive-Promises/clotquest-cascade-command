
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUp, Target, Sparkles, Zap, Activity, Heart } from 'lucide-react';
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
  
  // Split factors by pathway for better organization
  const intrinsicFactors = unplacedFactors.filter(f => f.pathway === 'intrinsic');
  const extrinsicFactors = unplacedFactors.filter(f => f.pathway === 'extrinsic');
  const commonFactors = unplacedFactors.filter(f => f.pathway === 'common');
  const regulatoryFactors = unplacedFactors.filter(f => f.pathway === 'regulatory');

  return (
    <div className="w-full flex gap-4">
      {/* Left Side - Intrinsic and Common Factors */}
      <div className="w-48 space-y-4">
        <Card className="glassmorphic-card bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl">
          <CardContent className="p-4">
            <h4 className="text-blue-400 font-bold text-sm text-center mb-3 flex items-center justify-center glassmorphic-card p-2 rounded-lg bg-blue-900/20 border border-blue-400/30">
              <Activity className="h-4 w-4 mr-2" />
              Intrinsic ({intrinsicFactors.length})
            </h4>
            <div className="space-y-2">
              {intrinsicFactors.map((factor, index) => (
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
          </CardContent>
        </Card>

        <Card className="glassmorphic-card bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl">
          <CardContent className="p-4">
            <h4 className="text-purple-400 font-bold text-sm text-center mb-3 flex items-center justify-center glassmorphic-card p-2 rounded-lg bg-purple-900/20 border border-purple-400/30">
              <Target className="h-4 w-4 mr-2" />
              Common ({commonFactors.length})
            </h4>
            <div className="space-y-2">
              {commonFactors.map((factor, index) => (
                <div key={factor.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${(index + 8) * 100}ms` }}>
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

      {/* Center - Cascade Game Area */}
      <div className="flex-1">
        <Card className="w-full glassmorphic-card bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl transform hover:scale-[1.01] transition-all duration-300 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 animate-pulse"></div>
          
          <CardContent className="p-4 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white flex items-center">
                <div className="relative mr-3">
                  <Activity className="h-6 w-6 text-red-400 animate-pulse" />
                  <div className="absolute inset-0 h-6 w-6 bg-red-400/30 rounded-full animate-ping"></div>
                </div>
                Interactive Coagulation Cascade
                <Sparkles className="h-5 w-5 ml-2 text-yellow-400 animate-pulse" />
              </h3>
              
              <div className="glassmorphic-card text-white text-sm bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/20">
                <div className="flex items-center">
                  <Zap className="h-4 w-4 mr-2 text-amber-400 animate-pulse" />
                  {selectedFactor ? (
                    <span className="font-semibold">
                      <span className="text-amber-300">{selectedFactor.name}</span> selected
                    </span>
                  ) : (
                    <span>Click factors to select</span>
                  )}
                </div>
              </div>
            </div>

            {/* Cascade Area - Smaller and More Compact */}
            <div className="relative">
              <ModernAnimatedCascade
                factors={factors}
                onDrop={onDrop}
                onDragOver={onDragOver}
                selectedFactor={selectedFactor}
                onDropZoneClick={onDropZoneClick}
                showHints={showHints}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Side - Extrinsic and Regulatory Factors */}
      <div className="w-48 space-y-4">
        <Card className="glassmorphic-card bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl">
          <CardContent className="p-4">
            <h4 className="text-green-400 font-bold text-sm text-center mb-3 flex items-center justify-center glassmorphic-card p-2 rounded-lg bg-green-900/20 border border-green-400/30">
              <Zap className="h-4 w-4 mr-2" />
              Extrinsic ({extrinsicFactors.length})
            </h4>
            <div className="space-y-2">
              {extrinsicFactors.map((factor, index) => (
                <div key={factor.id} className="animate-in fade-in slide-in-from-right-4 duration-500" style={{ animationDelay: `${(index + 4) * 100}ms` }}>
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

        <Card className="glassmorphic-card bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl">
          <CardContent className="p-4">
            <h4 className="text-cyan-400 font-bold text-sm text-center mb-3 flex items-center justify-center glassmorphic-card p-2 rounded-lg bg-cyan-900/20 border border-cyan-400/30">
              <Heart className="h-4 w-4 mr-2" />
              Regulatory ({regulatoryFactors.length})
            </h4>
            <div className="space-y-2">
              {regulatoryFactors.map((factor, index) => (
                <div key={factor.id} className="animate-in fade-in slide-in-from-top-4 duration-500" style={{ animationDelay: `${(index + 16) * 100}ms` }}>
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

        {/* Progress Statistics */}
        <Card className="glassmorphic-card bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl">
          <CardContent className="p-4">
            <h4 className="text-yellow-400 font-bold text-sm text-center mb-3 flex items-center justify-center glassmorphic-card p-2 rounded-lg bg-yellow-900/20 border border-yellow-400/30">
              <Target className="h-4 w-4 mr-2" />
              Progress
            </h4>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {factors.filter(f => f.isPlaced).length}/{factors.length}
              </div>
              <div className="text-xs text-gray-300">Factors Placed</div>
              <div className="text-lg font-bold text-emerald-400 mt-2">
                {Math.round((factors.filter(f => f.isPlaced).length / factors.length) * 100)}%
              </div>
              <div className="text-xs text-gray-300">Complete</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GameCascadeArea;
