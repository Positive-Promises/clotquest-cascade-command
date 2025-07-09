
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
    <div className="w-full order-1 lg:order-2 animate-in slide-in-from-right-4 duration-1000 delay-500">
      {/* Enhanced Cascade Visualization */}
      <Card className="w-full glassmorphic-card bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl mb-6 transform hover:scale-[1.01] transition-all duration-300 relative overflow-hidden">
        {/* Enhanced Ambient Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.1)_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(168,85,247,0.1)_0%,transparent_50%)]"></div>
        
        <CardContent className="p-2 lg:p-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4">
            <h3 className="text-2xl lg:text-3xl font-bold text-white flex items-center">
              <div className="relative mr-4">
                <Activity className="h-8 w-8 lg:h-9 lg:w-9 text-red-400 animate-pulse" />
                <div className="absolute inset-0 h-8 w-8 lg:h-9 lg:w-9 bg-red-400/30 rounded-full animate-ping"></div>
              </div>
              Interactive Coagulation Cascade
              <Sparkles className="h-6 w-6 ml-3 text-yellow-400 animate-pulse" />
            </h3>
            
            <div className="glassmorphic-card text-white text-sm lg:text-base bg-white/10 px-6 py-4 rounded-2xl backdrop-blur-sm border border-white/20 relative overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 animate-pulse"></div>
              <div className="relative z-10 flex items-center">
                <Zap className="h-5 w-5 mr-3 text-amber-400 animate-pulse" />
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

          {/* World-Class Cascade Area */}
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

      {/* Enhanced Factor Selection Panel */}
      <Card className="w-full glassmorphic-card bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl mb-6 transform hover:scale-[1.01] transition-all duration-300 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-blue-500/5 to-purple-500/5 animate-pulse"></div>
        
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl lg:text-2xl font-bold text-white flex items-center">
              <div className="relative mr-3">
                <Target className="h-6 w-6 lg:h-7 lg:w-7 text-blue-400 animate-pulse" />
                <div className="absolute inset-0 h-6 w-6 lg:h-7 lg:w-7 bg-blue-400/30 rounded-full animate-ping"></div>
              </div>
              Available Clotting Factors
            </h3>
            
            <div className="glassmorphic-card bg-gradient-to-r from-emerald-500/20 to-blue-500/20 px-4 py-2 rounded-xl border border-white/20 backdrop-blur-sm">
              <div className="text-white text-sm font-semibold">
                {factors.filter(f => f.isPlaced).length} / {factors.length} factors placed
              </div>
            </div>
          </div>

          {/* Organized Factor Display by Pathway */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Intrinsic Pathway Factors */}
            {intrinsicFactors.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-blue-400 font-bold text-sm text-center mb-4 flex items-center justify-center glassmorphic-card p-2 rounded-lg bg-blue-900/20 border border-blue-400/30">
                  <Activity className="h-4 w-4 mr-2" />
                  Intrinsic ({intrinsicFactors.length})
                </h4>
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
            )}

            {/* Extrinsic Pathway Factors */}
            {extrinsicFactors.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-green-400 font-bold text-sm text-center mb-4 flex items-center justify-center glassmorphic-card p-2 rounded-lg bg-green-900/20 border border-green-400/30">
                  <Zap className="h-4 w-4 mr-2" />
                  Extrinsic ({extrinsicFactors.length})
                </h4>
                {extrinsicFactors.map((factor, index) => (
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
            )}

            {/* Common Pathway Factors */}
            {commonFactors.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-purple-400 font-bold text-sm text-center mb-4 flex items-center justify-center glassmorphic-card p-2 rounded-lg bg-purple-900/20 border border-purple-400/30">
                  <Target className="h-4 w-4 mr-2" />
                  Common ({commonFactors.length})
                </h4>
                {commonFactors.map((factor, index) => (
                  <div key={factor.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${(index + 16) * 100}ms` }}>
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
            )}

            {/* Regulatory Factors */}
            {regulatoryFactors.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-cyan-400 font-bold text-sm text-center mb-4 flex items-center justify-center glassmorphic-card p-2 rounded-lg bg-cyan-900/20 border border-cyan-400/30">
                  <Heart className="h-4 w-4 mr-2" />
                  Regulatory ({regulatoryFactors.length})
                </h4>
                {regulatoryFactors.map((factor, index) => (
                  <div key={factor.id} className="animate-in fade-in slide-in-from-top-4 duration-500" style={{ animationDelay: `${(index + 24) * 100}ms` }}>
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
            )}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Progress and Statistics Panel */}
      <Card className="w-full glassmorphic-card bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl transform hover:scale-[1.01] transition-all duration-300 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-blue-500/5 to-purple-500/5 animate-pulse"></div>
        
        <CardContent className="p-4 lg:p-6 relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl lg:text-2xl font-bold text-white flex items-center">
              <div className="relative mr-3">
                <Target className="h-6 w-6 lg:h-7 lg:w-7 text-yellow-400 animate-pulse" />
                <div className="absolute inset-0 h-6 w-6 lg:h-7 lg:w-7 bg-yellow-400/30 rounded-full animate-ping"></div>
              </div>
              Pathway Progress
            </h3>
            
            <div className="glassmorphic-card bg-gradient-to-r from-emerald-500/20 to-blue-500/20 px-4 py-2 rounded-xl border border-white/20 backdrop-blur-sm">
              <div className="text-white text-sm font-semibold">
                {Math.round((factors.filter(f => f.isPlaced).length / factors.length) * 100)}% Complete
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="glassmorphic-card bg-blue-50/10 p-4 rounded-lg border border-blue-400/30 text-center transform hover:scale-105 transition-all duration-200">
              <div className="text-3xl font-bold text-blue-400 mb-1">{factors.filter(f => f.pathway === 'intrinsic' && f.isPlaced).length}</div>
              <div className="text-sm text-gray-300">Intrinsic Pathway</div>
              <div className="text-xs text-blue-300 mt-1">Contact Activation</div>
            </div>
            <div className="glassmorphic-card bg-green-50/10 p-4 rounded-lg border border-green-400/30 text-center transform hover:scale-105 transition-all duration-200">
              <div className="text-3xl font-bold text-green-400 mb-1">{factors.filter(f => f.pathway === 'extrinsic' && f.isPlaced).length}</div>
              <div className="text-sm text-gray-300">Extrinsic Pathway</div>
              <div className="text-xs text-green-300 mt-1">Tissue Factor</div>
            </div>
            <div className="glassmorphic-card bg-purple-50/10 p-4 rounded-lg border border-purple-400/30 text-center transform hover:scale-105 transition-all duration-200">
              <div className="text-3xl font-bold text-purple-400 mb-1">{factors.filter(f => f.pathway === 'common' && f.isPlaced).length}</div>
              <div className="text-sm text-gray-300">Common Pathway</div>
              <div className="text-xs text-purple-300 mt-1">Final Common Path</div>
            </div>
            <div className="glassmorphic-card bg-cyan-50/10 p-4 rounded-lg border border-cyan-400/30 text-center transform hover:scale-105 transition-all duration-200">
              <div className="text-3xl font-bold text-cyan-400 mb-1">{factors.filter(f => f.pathway === 'regulatory' && f.isPlaced).length}</div>
              <div className="text-sm text-gray-300">Regulatory System</div>
              <div className="text-xs text-cyan-300 mt-1">Natural Inhibitors</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameCascadeArea;
