
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, BookOpen, ExternalLink, Shield, Zap, AlertCircle } from 'lucide-react';

interface Factor {
  id: string;
  name: string;
  fullName: string;
  pathway: 'intrinsic' | 'extrinsic' | 'common' | 'fibrinolysis' | 'regulatory';
  description: string;
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
    common: 'from-purple-500 to-purple-700',
    fibrinolysis: 'from-orange-500 to-orange-700',
    regulatory: 'from-cyan-500 to-cyan-700'
  };

  const pathwayIcons = {
    intrinsic: <Zap className="h-5 w-5" />,
    extrinsic: <AlertCircle className="h-5 w-5" />,
    common: <BookOpen className="h-5 w-5" />,
    fibrinolysis: <Shield className="h-5 w-5" />,
    regulatory: <Shield className="h-5 w-5" />
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className={`bg-gradient-to-br ${pathwayColors[factor.pathway]} max-w-2xl w-full text-white border-2 border-white/20 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              {pathwayIcons[factor.pathway]}
              <h3 className="text-xl font-bold ml-2">🎉 Perfect Placement!</h3>
            </div>
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
              <h4 className="font-bold text-lg mb-2 flex items-center">
                {pathwayIcons[factor.pathway]}
                <span className="ml-2">{factor.fullName}</span>
              </h4>
              <p className="text-sm opacity-90">{factor.description}</p>
              
              {/* Cofactor and activation information */}
              {(factor.cofactorFor || factor.activatedBy) && (
                <div className="mt-3 space-y-1">
                  {factor.cofactorFor && (
                    <div className="text-xs bg-white/10 rounded px-2 py-1 inline-block mr-2">
                      <strong>Cofactor for:</strong> {factor.cofactorFor}
                    </div>
                  )}
                  {factor.activatedBy && (
                    <div className="text-xs bg-white/10 rounded px-2 py-1 inline-block">
                      <strong>Activated by:</strong> {factor.activatedBy}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h5 className="font-semibold mb-2 flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                Clinical Relevance
              </h5>
              <p className="text-sm opacity-90">{factor.clinicalRelevance}</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h5 className="font-semibold mb-2 flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                Deficiency Disorder
              </h5>
              <p className="text-sm opacity-90">{factor.deficiencyDisorder}</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h5 className="font-semibold mb-2">Normal Range</h5>
              <p className="text-sm opacity-90">{factor.normalRange}</p>
            </div>

            {/* Enhanced Antagonistic Agents Section */}
            <div className="bg-red-500/20 backdrop-blur-sm rounded-lg p-4 border border-red-400/30">
              <h5 className="font-semibold mb-3 flex items-center text-red-100">
                <Shield className="h-4 w-4 mr-2" />
                Antagonistic Agents & Inhibitors
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {factor.antagonisticAgents.map((agent, index) => (
                  <div
                    key={index}
                    className="bg-red-600/30 rounded-lg px-3 py-2 text-sm border border-red-400/20"
                  >
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-red-300 rounded-full mr-2 animate-pulse"></div>
                      {agent}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-2 text-xs opacity-75 italic">
                These agents can inhibit or antagonize {factor.name} function in clinical settings.
              </div>
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
          
          <div className="flex gap-2 mt-6">
            <Button 
              onClick={onClose}
              className="flex-1 bg-white/20 hover:bg-white/30 text-white border border-white/30"
            >
              Continue Game
            </Button>
            <Button 
              onClick={() => {
                navigator.clipboard.writeText(`${factor.fullName}: ${factor.description}`);
                // Could add a toast here if needed
              }}
              variant="outline"
              className="bg-white/10 hover:bg-white/20 text-white border-white/30"
            >
              Copy Info
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicalInfoPopup;
