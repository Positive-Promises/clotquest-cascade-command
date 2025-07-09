
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
      
      // Enhanced drag image creation for better visibility
      const dragImage = document.createElement('div');
      dragImage.style.cssText = `
        position: absolute;
        top: -1000px;
        left: -1000px;
        width: 120px;
        height: 80px;
        background: linear-gradient(135deg, ${pathwayColors[factor.pathway]});
        border-radius: 12px;
        border: 2px solid rgba(255,255,255,0.3);
        color: white;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        font-size: 14px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        backdrop-filter: blur(10px);
        transform: scale(1.1);
        z-index: 1000;
      `;
      dragImage.innerHTML = `<div>${factor.name}<br><small>${factor.pathway}</small></div>`;
      document.body.appendChild(dragImage);
      
      e.dataTransfer.setDragImage(dragImage, 60, 40);
      e.dataTransfer.setData('text/plain', factor.id);
      
      setTimeout(() => {
        if (document.body.contains(dragImage)) {
          document.body.removeChild(dragImage);
        }
      }, 0);
      
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
          "relative p-3 rounded-xl text-white font-medium transition-all duration-300 cursor-pointer transform overflow-hidden group",
          "shadow-lg hover:shadow-xl min-h-[80px] w-full",
          "border border-white/20 backdrop-blur-sm",
          gameStarted ? 'cursor-grab hover:cursor-grabbing hover:scale-105 active:scale-95' : 'cursor-default',
          isSelected ? 'ring-2 ring-yellow-400/80 ring-offset-1 ring-offset-slate-900 scale-105 animate-pulse shadow-xl' : 'hover:scale-102',
          isDragging ? 'opacity-60 scale-95 cursor-grabbing' : '',
          "hover:shadow-[0_10px_25px_rgba(0,0,0,0.3)] hover:brightness-110"
        )}
        style={{
          background: `linear-gradient(135deg, ${pathwayColors[factor.pathway]})`
        }}
      >
        {/* Enhanced Glassmorphic Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-transparent opacity-70"></div>
        
        {/* Enhanced Animated Background Particles */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <div className="absolute bottom-1 left-1 w-1 h-1 bg-white rounded-full animate-ping delay-300"></div>
          <div className="absolute top-1/2 left-1/4 w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-700"></div>
          {isSelected && (
            <>
              <div className="absolute top-1 left-1 w-1 h-1 bg-yellow-300 rounded-full animate-ping"></div>
              <div className="absolute bottom-1 right-1 w-1 h-1 bg-yellow-300 rounded-full animate-ping delay-500"></div>
              <Sparkles className="absolute top-0.5 right-0.5 h-3 w-3 text-yellow-300 animate-pulse" />
            </>
          )}
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline" className="text-xs border-white/40 text-white bg-white/15 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px]">
              {factor.pathway}
            </Badge>
            <Info className="h-3 w-3 opacity-70 group-hover:opacity-100 transition-opacity" />
          </div>
          
          <div className="font-bold text-sm mb-1 drop-shadow-lg">{factor.name}</div>
          <div className="text-xs opacity-90 leading-tight font-medium line-clamp-2">{factor.fullName}</div>
          
          {/* Enhanced Selection Indicators */}
          {isSelected && (
            <>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center animate-bounce shadow-lg">
                <Target className="w-3 h-3 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-transparent to-yellow-400/20 rounded-xl animate-pulse"></div>
            </>
          )}
          
          {/* Drag Handle Indicator */}
          {gameStarted && (
            <div className="absolute bottom-1 right-1 opacity-40 group-hover:opacity-80 transition-opacity">
              <div className="w-3 h-0.5 bg-white/60 rounded mb-0.5"></div>
              <div className="w-2 h-0.5 bg-white/60 rounded mb-0.5"></div>
              <div className="w-2.5 h-0.5 bg-white/60 rounded"></div>
            </div>
          )}
        </div>

        {/* Enhanced Click/Drag Instructions */}
        {gameStarted && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/20 backdrop-blur-sm rounded-xl">
            <div className="text-center">
              <div className="bg-black/40 backdrop-blur-sm rounded-lg px-2 py-1 text-xs font-bold mb-1">
                {isSelected ? 'SELECTED' : 'CLICK/DRAG'}
              </div>
              <div className="text-[10px] opacity-80">
                {isDragging ? 'Dragging...' : 'Click to select'}
              </div>
            </div>
          </div>
        )}

        {/* Compact Tooltip for Side Layout */}
        {showDetails && (
          <Card className="absolute z-50 glass-card bg-gray-900/95 backdrop-blur-xl text-white border-gray-600/50 max-w-xs shadow-2xl border-2" 
                style={{
                  left: 'calc(100% + 0.5rem)',
                  top: '50%',
                  transform: 'translateY(-50%)'
                }}>
            <CardContent className="p-3">
              <div className="space-y-2">
                <div>
                  <h4 className="font-bold text-yellow-300 mb-1 text-sm flex items-center">
                    <Sparkles className="h-3 w-3 mr-1" />
                    {factor.fullName}
                  </h4>
                  <p className="text-xs text-gray-300 leading-relaxed">{factor.description}</p>
                </div>
                
                <div className="border-t border-gray-600/50 pt-2">
                  <h5 className="font-semibold text-blue-300 text-xs mb-1">Clinical Relevance</h5>
                  <p className="text-xs text-gray-300 leading-relaxed">{factor.clinicalRelevance}</p>
                </div>
                
                <div className="border-t border-gray-600/50 pt-2">
                  <h5 className="font-semibold text-green-300 text-xs mb-1">Normal Range</h5>
                  <p className="text-xs text-gray-300 leading-relaxed">{factor.normalRange}</p>
                </div>

                {/* Compact Reference Links */}
                <div className="border-t border-gray-600/50 pt-2">
                  <h5 className="font-semibold text-purple-300 text-xs mb-2">References</h5>
                  <div className="space-y-1">
                    {factor.referenceLinks.slice(0, 2).map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-xs text-blue-400 hover:text-blue-300 transition-colors py-0.5 px-1 rounded hover:bg-blue-900/30"
                      >
                        {link.type === 'video' ? <Video className="h-2 w-2 mr-1" /> : 
                         link.type === 'textbook' ? <BookOpen className="h-2 w-2 mr-1" /> : 
                         <ExternalLink className="h-2 w-2 mr-1" />}
                        {link.title.substring(0, 25)}...
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
