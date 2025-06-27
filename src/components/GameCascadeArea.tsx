
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUp, Target } from 'lucide-react';
import AnimatedCascade from '@/components/AnimatedCascade';
import EnhancedFactor from '@/components/EnhancedFactor';

interface Factor {
  id: string;
  name: string;
  fullName: string;
  pathway: 'intrinsic' | 'extrinsic' | 'common' | 'fibrinolysis' | 'regulatory';
  position: { x: number; y: number } | null;
  description: string;
  color: string;
  isPlaced: boolean;
  correctPosition: { x: number; y: number };
  clinicalRelevance: string;
  deficiencyDisorder: string;
  normalRange: string;
  antagonisticAgents: string[];
  cofactorFor?: string;
  activatedBy?: string;
  referenceLinks: Array<{
    title: string;
    url: string;
    type: 'pubmed' | 'textbook' | 'video';
  }>;
}

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
    <div className="lg:col-span-3 order-1 lg:order-2 animate-in slide-in-from-right-4 duration-1000 delay-500">
      {/* Enhanced Cascade Visualization */}
      <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl dark:bg-white/5 light:bg-black/5 light:border-black/10 mb-6 transform hover:scale-[1.01] transition-all duration-300">
        <CardContent className="p-2 lg:p-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-4 gap-4">
            <h3 className="text-xl lg:text-2xl font-bold text-white dark:text-white light:text-black flex items-center">
              <ArrowUp className="h-5 w-5 lg:h-6 lg:w-6 mr-2 text-blue-400 rotate-180 animate-bounce" />
              Interactive Coagulation Cascade
            </h3>
            <div className="text-white dark:text-white light:text-black text-xs lg:text-sm bg-white/10 px-3 py-2 rounded-full backdrop-blur-sm border border-white/20 animate-pulse">
              {selectedFactor ? `${selectedFactor.name} selected - Click target position!` : 'Click factors to select, then click target positions'}
            </div>
          </div>

          {/* Professional Medical Cascade - Enhanced Layout */}
          <div className="relative w-full overflow-x-auto">
            <AnimatedCascade
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
      <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl dark:bg-white/5 light:bg-black/5 light:border-black/10 transform hover:scale-[1.01] transition-all duration-300">
        <CardContent className="p-4 lg:p-6">
          <h3 className="text-xl lg:text-2xl font-bold text-white dark:text-white light:text-black mb-4 flex items-center">
            <Target className="h-5 w-5 lg:h-6 lg:w-6 mr-2 text-yellow-400 animate-pulse" />
            Clotting Factors & Regulators
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2 mb-4">
            {unplacedFactors.slice(0, Math.ceil(unplacedFactors.length / 2)).map((factor, index) => (
              <div key={factor.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                <EnhancedFactor
                  factor={factor}
                  onDragStart={onDragStart}
                  onFactorClick={onFactorClick}
                  gameStarted={gameStarted}
                  isSelected={selectedFactor?.id === factor.id}
                />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2">
            {unplacedFactors.slice(Math.ceil(unplacedFactors.length / 2)).map((factor, index) => (
              <div key={factor.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${(index + Math.ceil(unplacedFactors.length / 2)) * 100}ms` }}>
                <EnhancedFactor
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
