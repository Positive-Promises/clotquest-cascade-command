
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, BookOpen, Video, Info } from 'lucide-react';

interface Factor {
  id: string;
  name: string;
  fullName: string;
  pathway: 'intrinsic' | 'extrinsic' | 'common';
  description: string;
  color: string;
  isPlaced: boolean;
  clinicalRelevance: string;
  deficiencyDisorder: string;
  normalRange: string;
  videoLink?: string;
  referenceLinks: Array<{
    title: string;
    url: string;
    type: 'pubmed' | 'textbook' | 'video';
  }>;
}

interface EnhancedFactorProps {
  factor: Factor;
  onDragStart: (e: React.DragEvent, factor: Factor) => void;
  onFactorClick: (factor: Factor) => void;
  gameStarted: boolean;
  isSelected: boolean;
}

const EnhancedFactor: React.FC<EnhancedFactorProps> = ({ 
  factor, 
  onDragStart, 
  onFactorClick, 
  gameStarted, 
  isSelected 
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const pathwayColors = {
    intrinsic: 'from-blue-500 to-blue-700',
    extrinsic: 'from-green-500 to-green-700',
    common: 'from-purple-500 to-purple-700'
  };

  const handleClick = () => {
    if (gameStarted) {
      onFactorClick(factor);
    }
  };

  return (
    <div className="relative">
      <div
        draggable={gameStarted}
        onDragStart={(e) => onDragStart(e, factor)}
        onClick={handleClick}
        onMouseEnter={() => setShowDetails(true)}
        onMouseLeave={() => setShowDetails(false)}
        className={`${factor.color} p-4 rounded-xl ${gameStarted ? 'cursor-pointer' : 'cursor-default'} text-white font-medium transition-all duration-300 hover:scale-105 hover:shadow-2xl transform relative overflow-hidden group ${
          isSelected ? 'ring-4 ring-yellow-400 ring-opacity-75 scale-110 animate-pulse' : ''
        }`}
        style={{
          background: `linear-gradient(135deg, ${pathwayColors[factor.pathway]})`
        }}
      >
        {/* Enhanced animated background particles */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <div className="absolute bottom-3 left-3 w-1 h-1 bg-white rounded-full animate-ping delay-300"></div>
          <div className="absolute top-1/2 left-1/4 w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-700"></div>
          {isSelected && (
            <>
              <div className="absolute top-1 left-1 w-1 h-1 bg-yellow-300 rounded-full animate-ping"></div>
              <div className="absolute bottom-1 right-1 w-1 h-1 bg-yellow-300 rounded-full animate-ping delay-500"></div>
              <div className="absolute top-3 left-1/2 w-0.5 h-0.5 bg-yellow-300 rounded-full animate-ping delay-1000"></div>
            </>
          )}
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline" className="text-xs border-white/30 text-white bg-white/10">
              {factor.pathway}
            </Badge>
            <Info className="h-4 w-4 opacity-70" />
          </div>
          <div className="font-bold text-lg mb-1">{factor.name}</div>
          <div className="text-sm opacity-90 leading-tight">{factor.fullName}</div>
          
          {/* Enhanced selection indicator */}
          {isSelected && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
              <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
            </div>
          )}
          
          {/* Pulsing activation indicator */}
          <div className={`absolute -top-1 -right-1 w-3 h-3 ${isSelected ? 'bg-yellow-300' : 'bg-yellow-300'} rounded-full animate-ping opacity-75 group-hover:opacity-100`}></div>
        </div>

        {/* Click indicator */}
        {gameStarted && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="bg-black/30 backdrop-blur-sm rounded-lg px-2 py-1 text-xs font-bold">
              {isSelected ? 'SELECTED' : 'CLICK TO SELECT'}
            </div>
          </div>
        )}

        {/* Enhanced tooltip with better positioning */}
        {showDetails && (
          <Card className="absolute z-50 bg-gray-900/95 backdrop-blur-lg text-white border-gray-600 max-w-sm shadow-2xl" 
                style={{
                  left: 'calc(100% + 1rem)',
                  top: 0,
                  transform: 'translateY(-25%)'
                }}>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-bold text-yellow-300 mb-1">{factor.fullName}</h4>
                  <p className="text-xs text-gray-300">{factor.description}</p>
                </div>
                
                <div>
                  <h5 className="font-semibold text-blue-300 text-sm mb-1">Clinical Relevance</h5>
                  <p className="text-xs text-gray-300">{factor.clinicalRelevance}</p>
                </div>
                
                <div>
                  <h5 className="font-semibold text-red-300 text-sm mb-1">Deficiency Disorder</h5>
                  <p className="text-xs text-gray-300">{factor.deficiencyDisorder}</p>
                </div>
                
                <div>
                  <h5 className="font-semibold text-green-300 text-sm mb-1">Normal Range</h5>
                  <p className="text-xs text-gray-300">{factor.normalRange}</p>
                </div>

                {/* Reference links */}
                <div className="border-t border-gray-600 pt-2">
                  <h5 className="font-semibold text-purple-300 text-sm mb-2">References</h5>
                  <div className="space-y-1">
                    {factor.referenceLinks.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-xs text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        {link.type === 'video' ? <Video className="h-3 w-3 mr-1" /> : 
                         link.type === 'textbook' ? <BookOpen className="h-3 w-3 mr-1" /> : 
                         <ExternalLink className="h-3 w-3 mr-1" />}
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

export default EnhancedFactor;
