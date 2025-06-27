
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, X, Target } from 'lucide-react';

interface Factor {
  id: string;
  name: string;
  pathway: 'intrinsic' | 'extrinsic' | 'common';
  description: string;
}

interface HintSystemProps {
  availableFactors: Factor[];
  onClose: () => void;
  isOpen: boolean;
}

const HintSystem: React.FC<HintSystemProps> = ({ availableFactors, onClose, isOpen }) => {
  if (!isOpen || availableFactors.length === 0) return null;

  const getPathwayHint = () => {
    const intrinsicCount = availableFactors.filter(f => f.pathway === 'intrinsic').length;
    const extrinsicCount = availableFactors.filter(f => f.pathway === 'extrinsic').length;
    const commonCount = availableFactors.filter(f => f.pathway === 'common').length;

    if (intrinsicCount > 0) {
      return "💡 Start with the Intrinsic Pathway (blue) - look for factors that activate through contact!";
    } else if (extrinsicCount > 0) {
      return "💡 Focus on the Extrinsic Pathway (green) - these factors respond to tissue damage!";
    } else if (commonCount > 0) {
      return "💡 Time for the Common Pathway (purple) - these factors form the final clot!";
    }
    return "💡 Great job! You're almost there!";
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="bg-gradient-to-br from-yellow-500 to-orange-600 max-w-md w-full text-white border-2 border-white/20 shadow-2xl animate-scale-in">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold flex items-center">
              <Lightbulb className="h-6 w-6 mr-2 animate-pulse" />
              Hint
            </h3>
            <Button 
              onClick={onClose}
              variant="ghost" 
              size="sm"
              className="text-white hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4">
            <p className="text-lg font-semibold">{getPathwayHint()}</p>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm">
              <div className="w-4 h-4 bg-blue-400 rounded mr-2"></div>
              <span>Intrinsic Pathway: Contact activation</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-4 h-4 bg-green-400 rounded mr-2"></div>
              <span>Extrinsic Pathway: Tissue factor</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-4 h-4 bg-purple-400 rounded mr-2"></div>
              <span>Common Pathway: Final clot formation</span>
            </div>
          </div>
          
          <Button 
            onClick={onClose}
            className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30"
          >
            <Target className="h-4 w-4 mr-2" />
            Got it, let me try!
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default HintSystem;
