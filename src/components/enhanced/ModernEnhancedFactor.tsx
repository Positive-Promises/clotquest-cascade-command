
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, BookOpen, Video, Info, Sparkles, Target } from 'lucide-react';
import { Factor } from '@/types/cascadeTypes';
import { cn } from '@/lib/utils';

interface ModernEnhancedFactorProps {
  factor: Factor;
  onDragStart: (e: React.DragEvent, factor: Factor) => void;
  onFactorClick: (factor: Factor) => void;
  gameStarted: boolean;
  isSelected: boolean;
}

const ModernEnhancedFactor: React.FC<ModernEnhancedFactorProps> = ({ 
  factor, 
  onDragStart, 
  onFactorClick, 
  gameStarted, 
  isSelected 
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const pathwayColors = {
    intrinsic: 'from-blue-500 via-blue-600 to-blue-700',
    extrinsic: 'from-green-500 via-green-600 to-green-700',
    common: 'from-purple-500 via-purple-600 to-purple-700',
    fibrinolysis: 'from-orange-500 via-orange-600 to-orange-700',
    regulatory: 'from-cyan-500 via-cyan-600 to-cyan-700'
  };

  const handleClick = () => {
    if (gameStarted) {
      onFactorClick(factor);
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    if (gameStarted) {
      setIsDragging(true);
      // Create a larger, more visible drag image
      const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
      dragImage.style.transform = 'scale(1.2)';
      dragImage.style.opacity = '0.8';
      dragImage.style.pointerEvents = 'none';
      dragImage.style.position = 'absolute';
      dragImage.style.top = '-1000px';
      document.body.appendChild(dragImage);
      
      e.dataTransfer.setDragImage(dragImage, 75, 60);
      setTimeout(() => document.body.removeChild(dragImage), 0);
      
      onDragStart(e, factor);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="relative group">
      <div
        draggable={gameStarted}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onClick={handleClick}
        onMouseEnter={() => setShowDetails(true)}
        onMouseLeave={() => setShowDetails(false)}
        className={cn(
          "relative p-6 rounded-2xl text-white font-medium transition-all duration-300 cursor-pointer transform overflow-hidden group",
          "shadow-xl hover:shadow-2xl",
          "border border-white/20 backdrop-blur-sm",
          gameStarted ? 'cursor-pointer hover:scale-110 active:scale-95' : 'cursor-default',
          isSelected ? 'ring-4 ring-yellow-400/80 ring-offset-2 ring-offset-slate-900 scale-110 animate-pulse shadow-2xl' : 'hover:scale-105',
          isDragging ? 'opacity-50 scale-90' : '',
          // Enhanced hover states
          "hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:brightness-110"
        )}
        style={{
          background: `linear-gradient(135deg, ${pathwayColors[factor.pathway]})`
        }}
      >
        {/* Enhanced Glassmorphic Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-70"></div>
        
        {/* Enhanced Animated Background Particles */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full animate-pulse"></div>
          <div className="absolute bottom-3 left-3 w-2 h-2 bg-white rounded-full animate-ping delay-300"></div>
          <div className="absolute top-1/2 left-1/4 w-2.5 h-2.5 bg-white rounded-full animate-pulse delay-700"></div>
          {isSelected && (
            <>
              <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-ping"></div>
              <div className="absolute bottom-2 right-2 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-ping delay-500"></div>
              <div className="absolute top-4 left-1/2 w-1 h-1 bg-yellow-300 rounded-full animate-ping delay-1000"></div>
              <Sparkles className="absolute top-1 right-1 h-4 w-4 text-yellow-300 animate-pulse" />
            </>
          )}
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <Badge variant="outline" className="text-xs border-white/40 text-white bg-white/15 backdrop-blur-sm px-2 py-1 rounded-full">
              {factor.pathway}
            </Badge>
            <Info className="h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity" />
          </div>
          
          <div className="font-bold text-xl mb-2 drop-shadow-lg">{factor.name}</div>
          <div className="text-sm opacity-90 leading-tight font-medium">{factor.fullName}</div>
          
          {/* Enhanced Selection Indicators */}
          {isSelected && (
            <>
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center animate-bounce shadow-lg">
                <Target className="w-4 h-4 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-transparent to-yellow-400/20 rounded-2xl animate-pulse"></div>
            </>
          )}
          
          {/* Enhanced Pulsing Activation Indicator */}
          <div className={cn(
            "absolute -top-2 -right-2 w-4 h-4 rounded-full animate-ping",
            isSelected ? 'bg-yellow-300' : 'bg-white/60',
            "opacity-75 group-hover:opacity-100"
          )}></div>

          {/* Drag Handle Indicator */}
          {gameStarted && (
            <div className="absolute bottom-2 right-2 opacity-60 group-hover:opacity-100 transition-opacity">
              <div className="w-6 h-1 bg-white/60 rounded mb-1"></div>
              <div className="w-4 h-1 bg-white/60 rounded mb-1"></div>
              <div className="w-5 h-1 bg-white/60 rounded"></div>
            </div>
          )}
        </div>

        {/* Enhanced Click/Drag Instructions */}
        {gameStarted && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/20 backdrop-blur-sm rounded-2xl">
            <div className="text-center">
              <div className="bg-black/40 backdrop-blur-sm rounded-xl px-4 py-2 text-sm font-bold mb-2">
                {isSelected ? 'SELECTED' : 'CLICK TO SELECT'}
              </div>
              <div className="text-xs opacity-80">
                Click to select • Drag to drop zone
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Modern Tooltip */}
        {showDetails && (
          <Card className="absolute z-50 glass-card bg-gray-900/95 backdrop-blur-xl text-white border-gray-600/50 max-w-sm shadow-2xl border-2" 
                style={{
                  left: 'calc(100% + 1rem)',
                  top: 0,
                  transform: 'translateY(-25%)'
                }}>
            <CardContent className="p-5">
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-yellow-300 mb-2 text-lg flex items-center">
                    <Sparkles className="h-4 w-4 mr-2" />
                    {factor.fullName}
                  </h4>
                  <p className="text-sm text-gray-300 leading-relaxed">{factor.description}</p>
                </div>
                
                <div className="border-t border-gray-600/50 pt-3">
                  <h5 className="font-semibold text-blue-300 text-sm mb-2">Clinical Relevance</h5>
                  <p className="text-xs text-gray-300 leading-relaxed">{factor.clinicalRelevance}</p>
                </div>
                
                <div className="border-t border-gray-600/50 pt-3">
                  <h5 className="font-semibold text-red-300 text-sm mb-2">Deficiency Disorder</h5>
                  <p className="text-xs text-gray-300 leading-relaxed">{factor.deficiencyDisorder}</p>
                </div>
                
                <div className="border-t border-gray-600/50 pt-3">
                  <h5 className="font-semibold text-green-300 text-sm mb-2">Normal Range</h5>
                  <p className="text-xs text-gray-300 leading-relaxed">{factor.normalRange}</p>
                </div>

                {/* Enhanced Antagonistic Agents */}
                <div className="border-t border-gray-600/50 pt-3">
                  <h5 className="font-semibold text-red-300 text-sm mb-2">Antagonistic Agents</h5>
                  <div className="space-y-2">
                    {factor.antagonisticAgents.slice(0, 3).map((agent, index) => (
                      <div key={index} className="text-xs text-red-200 bg-red-900/40 rounded-lg px-3 py-2 backdrop-blur-sm border border-red-500/30">
                        {agent}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Enhanced Reference Links */}
                <div className="border-t border-gray-600/50 pt-3">
                  <h5 className="font-semibold text-purple-300 text-sm mb-3">Medical References</h5>
                  <div className="space-y-2">
                    {factor.referenceLinks.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-xs text-blue-400 hover:text-blue-300 transition-colors py-1 px-2 rounded hover:bg-blue-900/30"
                      >
                        {link.type === 'video' ? <Video className="h-3 w-3 mr-2" /> : 
                         link.type === 'textbook' ? <BookOpen className="h-3 w-3 mr-2" /> : 
                         <ExternalLink className="h-3 w-3 mr-2" />}
                        {link.title}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ModernEnhancedFactor;
