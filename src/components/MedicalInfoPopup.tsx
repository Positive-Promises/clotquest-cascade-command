
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, BookOpen, ExternalLink } from 'lucide-react';

interface Factor {
  id: string;
  name: string;
  fullName: string;
  pathway: 'intrinsic' | 'extrinsic' | 'common';
  description: string;
  clinicalRelevance: string;
  deficiencyDisorder: string;
  normalRange: string;
  referenceLinks: Array<{
    title: string;
    url: string;
    type: 'pubmed' | 'textbook' | 'video';
  }>;
}

interface MedicalInfoPopupProps {
  factor: Factor | null;
  isOpen: boolean;
  onClose: () => void;
}

const MedicalInfoPopup: React.FC<MedicalInfoPopupProps> = ({ factor, isOpen, onClose }) => {
  if (!isOpen || !factor) return null;

  const pathwayColors = {
    intrinsic: 'from-blue-500 to-blue-700',
    extrinsic: 'from-green-500 to-green-700',
    common: 'from-purple-500 to-purple-700'
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className={`bg-gradient-to-br ${pathwayColors[factor.pathway]} max-w-lg w-full text-white border-2 border-white/20 shadow-2xl animate-scale-in`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">🎉 Perfect Placement!</h3>
            <Button 
              onClick={onClose}
              variant="ghost" 
              size="sm"
              className="text-white hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h4 className="font-bold text-lg mb-2">{factor.fullName}</h4>
              <p className="text-sm opacity-90">{factor.description}</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h5 className="font-semibold mb-2 flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                Clinical Relevance
              </h5>
              <p className="text-sm opacity-90">{factor.clinicalRelevance}</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h5 className="font-semibold mb-2">Deficiency Disorder</h5>
              <p className="text-sm opacity-90">{factor.deficiencyDisorder}</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h5 className="font-semibold mb-2">Normal Range</h5>
              <p className="text-sm opacity-90">{factor.normalRange}</p>
            </div>

            {factor.referenceLinks.length > 0 && (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <h5 className="font-semibold mb-2">Learn More</h5>
                <div className="space-y-1">
                  {factor.referenceLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-blue-200 hover:text-blue-100 transition-colors"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      {link.title}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <Button 
            onClick={onClose}
            className="w-full mt-4 bg-white/20 hover:bg-white/30 text-white border border-white/30"
          >
            Continue Game
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicalInfoPopup;
