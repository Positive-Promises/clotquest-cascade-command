
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, ArrowRight, ArrowLeft, Users, Trophy, Play } from 'lucide-react';

interface TutorialStep {
  id: number;
  title: string;
  description: string;
  target?: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

interface TutorialProps {
  isOpen: boolean;
  onClose: () => void;
  onSkip: () => void;
  steps: TutorialStep[];
  currentLevel: string;
}

const Tutorial: React.FC<TutorialProps> = ({ isOpen, onClose, onSkip, steps, currentLevel }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    if (window.confirm('Are you sure you want to skip the tutorial? You can always access it later from the How to Play menu.')) {
      onSkip();
    }
  };

  if (!isOpen || !isVisible) return null;

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative">
        {/* Spotlight effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse opacity-30 blur-xl"></div>
        </div>
        
        <Card className="w-full max-w-md bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 border border-blue-400/30 shadow-2xl">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <Badge variant="outline" className="text-blue-300 border-blue-300">
                Step {currentStep + 1} of {steps.length}
              </Badge>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSkip}
                  className="text-gray-400 hover:text-white"
                >
                  Skip
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-3">
              {currentStepData.title}
            </h3>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              {currentStepData.description}
            </p>

            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="border-blue-400 text-blue-300 hover:bg-blue-400/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              <div className="flex space-x-1">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentStep ? 'bg-blue-400' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>

              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Tutorial;
