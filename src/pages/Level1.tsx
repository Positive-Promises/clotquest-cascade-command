import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { RotateCcw, Target, BookOpen, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AudioSystem from '@/components/AudioSystem';
import Tutorial from '@/components/Tutorial';
import EmergencyLight from '@/components/EmergencyLight';
import RatingSystem from '@/components/RatingSystem';
import GameHeader from '@/components/GameHeader';
import GameControls from '@/components/GameControls';
import PathwayLegend from '@/components/PathwayLegend';
import GameCascadeArea from '@/components/GameCascadeArea';
import MedicalInfoPopup from '@/components/MedicalInfoPopup';
import HintSystem from '@/components/HintSystem';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

import { level1Factors } from '@/data/cascadeFactors';

const Level1 = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [level1Complete, setLevel1Complete] = useState(false);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [patientStatus, setPatientStatus] = useState(100);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [selectedFactor, setSelectedFactor] = useState<Factor | null>(null);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showMedicalInfo, setShowMedicalInfo] = useState(false);
  const [currentMedicalFactor, setCurrentMedicalFactor] = useState<Factor | null>(null);
  const [showHint, setShowHint] = useState(false);

  // Tutorial steps for Level1
  const tutorialSteps = [
    {
      id: 1,
      title: "Welcome to Enhanced Coagulation Cascade!",
      description: "Master the complete coagulation cascade including cofactors, fibrinolysis, and regulatory systems. Use click-and-add or drag-and-drop!",
      position: "bottom" as const
    },
    {
      id: 2,
      title: "Enhanced Factor Bank",
      description: "Now includes cofactors (Factor VIII), regulatory proteins, and fibrinolysis components. Each factor shows detailed antagonistic agents.",
      position: "right" as const
    },
    {
      id: 3,
      title: "Multiple Pathways",
      description: "See the intrinsic, extrinsic, common pathways PLUS fibrinolysis and natural anticoagulant systems working together.",
      position: "left" as const
    },
    {
      id: 4,
      title: "Medical Information",
      description: "Each correct placement reveals detailed information including antagonistic agents, cofactor relationships, and clinical relevance.",
      position: "top" as const
    },
    {
      id: 5,
      title: "Ready for the Challenge!",
      description: "Experience the complete hemostatic system with enhanced educational content!",
      position: "bottom" as const
    }
  ];

  const [factors, setFactors] = useState<Factor[]>(level1Factors.map(factor => ({ ...factor })));

  // Emergency mode timer
  useEffect(() => {
    if (emergencyMode && gameStarted && patientStatus > 0) {
      const emergencyTimer = setInterval(() => {
        setPatientStatus(prev => {
          const newStatus = prev - 2;
          if (newStatus <= 0) {
            return 0;
          }
          return newStatus;
        });
      }, 1000);
      return () => clearInterval(emergencyTimer);
    }
  }, [emergencyMode, gameStarted, patientStatus]);

  // Show critical patient toast when health is low
  useEffect(() => {
    if (emergencyMode && patientStatus <= 0 && patientStatus !== 100) {
      toast({
        title: "💀 Patient Critical!",
        description: "The patient has lost too much blood. Emergency intervention required!",
        variant: "destructive"
      });
    }
  }, [patientStatus, emergencyMode, toast]);

  useEffect(() => {
    if (gameStarted) {
      const timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameStarted]);

  const showSuccessToast = useCallback((factor: Factor, isEmergency: boolean) => {
    toast({
      title: "Perfect Placement! 🎯",
      description: `${factor.name} correctly positioned! ${isEmergency ? 'Patient stabilizing!' : '+100 points'}`,
    });
  }, [toast]);

  const showErrorToast = useCallback((factor: Factor) => {
    toast({
      title: "Close, but not quite right! 🤔",
      description: `${factor.name} needs to be positioned more precisely in the cascade.`,
      variant: "destructive"
    });
  }, [toast]);

  // Enhanced click-and-add functionality
  const handleFactorClick = (factor: Factor) => {
    if (!gameStarted) return;
    
    if (selectedFactor?.id === factor.id) {
      setSelectedFactor(null);
      toast({
        title: "Factor Deselected",
        description: "Click on a factor to select it for placement.",
      });
    } else {
      setSelectedFactor(factor);
      toast({
        title: "Factor Selected! 🎯",
        description: `${factor.name} selected. Click on its target position in the cascade to place it.`,
      });
    }
  };

  const handleDropZoneClick = (targetFactor: Factor) => {
    if (!selectedFactor || !gameStarted) {
      if (!selectedFactor) {
        toast({
          title: "Select a Factor First",
          description: "Click on a factor below to select it, then click on its target position.",
          variant: "destructive"
        });
      }
      return;
    }
    
    if (selectedFactor.id === targetFactor.id) {
      setFactors(prev => prev.map(factor => {
        if (factor.id === selectedFactor.id) {
          setScore(prev => prev + 100);
          if (emergencyMode) {
            setPatientStatus(prev => Math.min(100, prev + 10));
          }
          setTimeout(() => showSuccessToast(factor, emergencyMode), 0);
          
          // Show medical info popup with enhanced information
          setCurrentMedicalFactor(factor);
          setShowMedicalInfo(true);
          
          return { ...factor, position: factor.correctPosition, isPlaced: true };
        }
        return factor;
      }));
      setSelectedFactor(null);
    } else {
      toast({
        title: "Wrong Position! ❌",
        description: `${selectedFactor.name} doesn't belong here. Try again!`,
        variant: "destructive"
      });
    }
  };

  const handleDragStart = (e: React.DragEvent, factor: Factor) => {
    e.dataTransfer.setData('factorId', factor.id);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const factorId = e.dataTransfer.getData('factorId');
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setFactors(prev => prev.map(factor => {
      if (factor.id === factorId) {
        const isCorrect = Math.abs(x - factor.correctPosition.x) < 50 && 
                         Math.abs(y - factor.correctPosition.y) < 50;
        
        if (isCorrect) {
          setScore(prev => prev + 100);
          if (emergencyMode) {
            setPatientStatus(prev => Math.min(100, prev + 10));
          }
          setTimeout(() => showSuccessToast(factor, emergencyMode), 0);
          
          // Show medical info popup with enhanced information
          setCurrentMedicalFactor(factor);
          setShowMedicalInfo(true);
          
          return { ...factor, position: factor.correctPosition, isPlaced: true };
        } else {
          setTimeout(() => showErrorToast(factor), 0);
          return { ...factor, position: { x, y }, isPlaced: false };
        }
      }
      return factor;
    }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const checkCompletion = useCallback(() => {
    const allPlaced = factors.every(factor => factor.isPlaced);
    if (allPlaced && !level1Complete) {
      setLevel1Complete(true);
      const timeBonus = Math.max(0, 300 - timeElapsed) * 10;
      const emergencyBonus = emergencyMode ? 500 : 0;
      setScore(prev => prev + timeBonus + emergencyBonus);
      setShowCompletionDialog(true);
      setTimeout(() => {
        toast({
          title: "🎉 Congratulations! You saved the patient from bleeding to death!",
          description: `Outstanding work! ${emergencyMode ? 'Patient saved!' : 'Perfect cascade assembly!'} Time bonus: +${timeBonus} ${emergencyMode ? `Emergency bonus: +${emergencyBonus}` : ''}`,
        });
      }, 0);
    }
  }, [factors, level1Complete, timeElapsed, emergencyMode, toast]);

  useEffect(() => {
    checkCompletion();
  }, [checkCompletion]);

  const resetLevel = () => {
    setFactors(prev => prev.map(factor => ({
      ...factor,
      position: null,
      isPlaced: false
    })));
    setScore(0);
    setTimeElapsed(0);
    setLevel1Complete(false);
    setEmergencyMode(false);
    setPatientStatus(100);
    setShowCompletionDialog(false);
    setSelectedFactor(null);
    setGameStarted(true);
  };

  const tryAgain = () => {
    // Reset incorrectly placed factors
    setFactors(prev => prev.map(factor => {
      if (!factor.isPlaced && factor.position) {
        return { ...factor, position: null };
      }
      return factor;
    }));
    setSelectedFactor(null);
    toast({
      title: "Try Again! 🔄",
      description: "Incorrectly placed factors have been reset. You can do this!",
    });
  };

  const startGame = () => {
    setGameStarted(true);
    setTimeout(() => {
      toast({
        title: "🎮 Game Started!",
        description: "Click on factors to select them, then click on their target positions. You can also drag and drop!",
      });
    }, 0);
  };

  const startEmergencyMode = () => {
    setEmergencyMode(true);
    setGameStarted(true);
    setPatientStatus(80);
    setTimeout(() => {
      toast({
        title: "🚨 EMERGENCY ACTIVATED!",
        description: "Patient is bleeding actively! Form the clot quickly to save their life!",
        variant: "destructive"
      });
    }, 0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const placedFactors = factors.filter(factor => factor.isPlaced);
  const unplacedFactors = factors.filter(factor => !factor.isPlaced);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 dark:from-slate-950 dark:via-blue-950 dark:to-slate-950 light:from-slate-100 light:via-blue-100 light:to-slate-100 relative overflow-hidden">
      {/* Floating particles animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/30 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <AudioSystem gameState={gameStarted ? "playing" : "menu"} level={1} />

      <GameHeader
        score={score}
        timeElapsed={timeElapsed}
        placedFactorsCount={placedFactors.length}
        totalFactorsCount={factors.length}
        emergencyMode={emergencyMode}
        patientStatus={patientStatus}
        onExitGame={() => setShowExitDialog(true)}
      />

      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 px-4 relative z-10 pb-32">
        {/* Enhanced Sidebar */}
        <div className="lg:col-span-1 order-2 lg:order-1 animate-in slide-in-from-left-4 duration-1000 delay-300">
          <GameControls
            gameStarted={gameStarted}
            onShowTutorial={() => setShowTutorial(true)}
            onStartGame={startGame}
            onStartEmergencyMode={startEmergencyMode}
            onResetLevel={resetLevel}
            onShowHint={() => setShowHint(true)}
            onTryAgain={tryAgain}
            hasUnplacedFactors={unplacedFactors.length > 0}
          />

          <PathwayLegend />

          <RatingSystem gameId="level1" onRatingSubmit={(rating) => console.log('Rating submitted:', rating)} />
        </div>

        <GameCascadeArea
          factors={factors}
          selectedFactor={selectedFactor}
          gameStarted={gameStarted}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDropZoneClick={handleDropZoneClick}
          onDragStart={handleDragStart}
          onFactorClick={handleFactorClick}
        />
      </div>

      <EmergencyLight 
        isEmergency={emergencyMode} 
        isSuccess={level1Complete && emergencyMode} 
        patientStatus={patientStatus} 
      />

      <Tutorial
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
        onSkip={() => setShowTutorial(false)}
        steps={tutorialSteps}
        currentLevel="level1"
      />

      <MedicalInfoPopup
        factor={currentMedicalFactor}
        isOpen={showMedicalInfo}
        onClose={() => setShowMedicalInfo(false)}
      />

      <HintSystem
        availableFactors={unplacedFactors}
        isOpen={showHint}
        onClose={() => setShowHint(false)}
      />

      {/* Exit Dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 border border-red-400/30 backdrop-blur-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-2xl font-bold text-red-400">
              Exit Game?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-lg text-gray-300">
              Are you sure you want to exit? Your current progress will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-center space-x-4">
            <AlertDialogCancel className="border-white/20 text-white hover:bg-white/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => navigate('/')}
              className="bg-red-600 hover:bg-red-700"
            >
              Exit Game
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Completion Dialog */}
      <AlertDialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <AlertDialogContent className="max-w-2xl bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 border border-blue-400/30 backdrop-blur-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              🎉 {emergencyMode ? 'PATIENT SAVED!' : 'Congratulations! You saved the patient from bleeding to death!'} 🎉
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-lg text-gray-300">
              {emergencyMode 
                ? "Outstanding work! You've successfully saved the patient by assembling the complete coagulation cascade under emergency conditions! The patient is stable and recovering."
                : "Congratulations! You've mastered the coagulation cascade and demonstrated excellent understanding of hemostatic mechanisms! The patient's bleeding has been controlled and they are now stable."
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 p-4 rounded-lg border border-yellow-400/30 backdrop-blur-sm">
                <div className="text-2xl font-bold text-yellow-400">{score}</div>
                <div className="text-sm text-gray-300">Final Score</div>
              </div>
              <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-4 rounded-lg border border-blue-400/30 backdrop-blur-sm">
                <div className="text-2xl font-bold text-blue-400">{formatTime(timeElapsed)}</div>
                <div className="text-sm text-gray-300">Completion Time</div>
              </div>
              <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-4 rounded-lg border border-green-400/30 backdrop-blur-sm">
                <div className="text-2xl font-bold text-green-400">{emergencyMode ? 'SAVED' : 'PERFECT'}</div>
                <div className="text-sm text-gray-300">{emergencyMode ? 'Patient Status' : 'Performance'}</div>
              </div>
            </div>
          </div>

          <AlertDialogFooter className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
            <AlertDialogAction 
              onClick={resetLevel}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Replay Level
            </AlertDialogAction>
            <AlertDialogAction 
              onClick={() => navigate('/level2')}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
            >
              <Target className="h-4 w-4 mr-2" />
              Continue to Level 2
            </AlertDialogAction>
            <AlertDialogCancel 
              onClick={() => navigate('/')}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Exit to Main Menu
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Level1;
