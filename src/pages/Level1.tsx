import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { RotateCcw, Target, BookOpen } from 'lucide-react';
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
  pathway: 'intrinsic' | 'extrinsic' | 'common';
  position: { x: number; y: number } | null;
  description: string;
  color: string;
  isPlaced: boolean;
  correctPosition: { x: number; y: number };
  clinicalRelevance: string;
  deficiencyDisorder: string;
  normalRange: string;
  referenceLinks: Array<{
    title: string;
    url: string;
    type: 'pubmed' | 'textbook' | 'video';
  }>;
}

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

  // Tutorial steps for Level 1
  const tutorialSteps = [
    {
      id: 1,
      title: "Welcome to Coagulation Cascade Commander!",
      description: "This level teaches you the complete coagulation cascade. Click on factors to select them, then click on their target positions.",
      position: "bottom" as const
    },
    {
      id: 2,
      title: "Factor Bank",
      description: "Click on any factor to select it. You can also drag and drop them to their correct positions.",
      position: "right" as const
    },
    {
      id: 3,
      title: "Emergency Mode",
      description: "Try Emergency Mode for a thrilling challenge - save a bleeding patient by forming the clot quickly!",
      position: "top" as const
    },
    {
      id: 4,
      title: "Cascade Visualization",
      description: "Click on selected factors' target positions or drag them here. Look for the pathway colors to guide you.",
      position: "left" as const
    },
    {
      id: 5,
      title: "Educational Content",
      description: "Hover over any factor for detailed medical information, clinical relevance, and research links.",
      position: "top" as const
    },
    {
      id: 6,
      title: "Ready to Start!",
      description: "You're ready to master the coagulation cascade! Click 'Start Normal Mode' to begin your journey.",
      position: "bottom" as const
    }
  ];

  const [factors, setFactors] = useState<Factor[]>([
    {
      id: 'f12',
      name: 'Factor XII',
      fullName: 'Hageman Factor (Contact Factor)',
      pathway: 'intrinsic',
      position: null,
      description: 'Initiates the intrinsic pathway when activated by contact with negatively charged surfaces like collagen or glass',
      color: 'bg-blue-500',
      isPlaced: false,
      correctPosition: { x: 150, y: 50 },
      clinicalRelevance: 'Deficiency rarely causes bleeding but prolongs aPTT. Important in laboratory activation of coagulation cascade.',
      deficiencyDisorder: 'Factor XII deficiency (usually asymptomatic)',
      normalRange: '50-150% of pooled normal plasma',
      referenceLinks: [
        {
          title: 'Factor XII and Contact Activation',
          url: 'https://pubmed.ncbi.nlm.nih.gov/25861491/',
          type: 'pubmed'
        }
      ]
    },
    {
      id: 'f11',
      name: 'Factor XI',
      fullName: 'Plasma Thromboplastin Antecedent',
      pathway: 'intrinsic',
      position: null,
      description: 'Activated by Factor XIIa and also by thrombin in a positive feedback loop. Activates Factor IX.',
      color: 'bg-blue-600',
      isPlaced: false,
      correctPosition: { x: 150, y: 120 },
      clinicalRelevance: 'Deficiency causes mild to moderate bleeding, especially after trauma or surgery. Common in Ashkenazi Jewish population.',
      deficiencyDisorder: 'Hemophilia C (Factor XI deficiency)',
      normalRange: '50-150% of pooled normal plasma',
      referenceLinks: [
        {
          title: 'Factor XI Deficiency',
          url: 'https://pubmed.ncbi.nlm.nih.gov/29920516/',
          type: 'pubmed'
        }
      ]
    },
    {
      id: 'f9',
      name: 'Factor IX',
      fullName: 'Christmas Factor',
      pathway: 'intrinsic',
      position: null,
      description: 'Vitamin K-dependent factor, key component of the intrinsic pathway. Forms tenase complex with Factor VIIIa.',
      color: 'bg-blue-700',
      isPlaced: false,
      correctPosition: { x: 150, y: 190 },
      clinicalRelevance: 'Deficiency causes Hemophilia B, an X-linked bleeding disorder affecting males primarily.',
      deficiencyDisorder: 'Hemophilia B (Christmas Disease)',
      normalRange: '50-150% of pooled normal plasma',
      referenceLinks: [
        {
          title: 'Hemophilia B: Christmas Disease',
          url: 'https://pubmed.ncbi.nlm.nih.gov/30620421/',
          type: 'pubmed'
        }
      ]
    },
    {
      id: 'f7',
      name: 'Factor VII',
      fullName: 'Proconvertin (Stable Factor)',
      pathway: 'extrinsic',
      position: null,
      description: 'Vitamin K-dependent factor activated by tissue factor. Initiates extrinsic pathway after tissue injury.',
      color: 'bg-green-500',
      isPlaced: false,
      correctPosition: { x: 350, y: 120 },
      clinicalRelevance: 'First factor to decrease with warfarin therapy. Deficiency causes bleeding similar to hemophilia.',
      deficiencyDisorder: 'Factor VII deficiency (rare autosomal recessive)',
      normalRange: '50-150% of pooled normal plasma',
      referenceLinks: [
        {
          title: 'Factor VII Deficiency',
          url: 'https://pubmed.ncbi.nlm.nih.gov/28301907/',
          type: 'pubmed'
        }
      ]
    },
    {
      id: 'tf',
      name: 'Tissue Factor',
      fullName: 'Factor III (Thromboplastin)',
      pathway: 'extrinsic',
      position: null,
      description: 'Membrane-bound glycoprotein released by damaged tissue. Forms complex with Factor VII to initiate coagulation.',
      color: 'bg-green-600',
      isPlaced: false,
      correctPosition: { x: 350, y: 50 },
      clinicalRelevance: 'Primary initiator of hemostasis. Expression increased in inflammation, cancer, and atherosclerosis.',
      deficiencyDisorder: 'No hereditary deficiency described (incompatible with life)',
      normalRange: 'Not routinely measured in clinical practice',
      referenceLinks: [
        {
          title: 'Tissue Factor in Hemostasis',
          url: 'https://pubmed.ncbi.nlm.nih.gov/31648335/',
          type: 'pubmed'
        }
      ]
    },
    {
      id: 'f10',
      name: 'Factor X',
      fullName: 'Stuart-Prower Factor',
      pathway: 'common',
      position: null,
      description: 'Vitamin K-dependent factor, convergence point of intrinsic and extrinsic pathways. Forms prothrombinase complex.',
      color: 'bg-purple-500',
      isPlaced: false,
      correctPosition: { x: 250, y: 280 },
      clinicalRelevance: 'Critical convergence point. Deficiency causes moderate to severe bleeding disorder.',
      deficiencyDisorder: 'Factor X deficiency (rare autosomal recessive)',
      normalRange: '50-150% of pooled normal plasma',
      referenceLinks: [
        {
          title: 'Factor X Structure and Function',
          url: 'https://pubmed.ncbi.nlm.nih.gov/26990094/',
          type: 'pubmed'
        }
      ]
    },
    {
      id: 'f5',
      name: 'Factor V',
      fullName: 'Proaccelerin (Labile Factor)',
      pathway: 'common',
      position: null,
      description: 'Non-enzymatic cofactor for Factor Xa in the prothrombinase complex. Essential for thrombin generation.',
      color: 'bg-purple-600',
      isPlaced: false,
      correctPosition: { x: 200, y: 350 },
      clinicalRelevance: 'Factor V Leiden mutation causes activated protein C resistance and thrombophilia.',
      deficiencyDisorder: 'Factor V deficiency (parahemophilia) or Factor V Leiden (thrombophilia)',
      normalRange: '50-150% of pooled normal plasma',
      referenceLinks: [
        {
          title: 'Factor V Leiden and Thrombosis',
          url: 'https://pubmed.ncbi.nlm.nih.gov/29923465/',
          type: 'pubmed'
        }
      ]
    },
    {
      id: 'f2',
      name: 'Factor II',
      fullName: 'Prothrombin',
      pathway: 'common',
      position: null,
      description: 'Vitamin K-dependent zymogen converted to thrombin by prothrombinase complex. Central enzyme of hemostasis.',
      color: 'bg-purple-700',
      isPlaced: false,
      correctPosition: { x: 250, y: 420 },
      clinicalRelevance: 'Thrombin has multiple functions: converts fibrinogen to fibrin, activates factors V, VIII, XI, and XIII.',
      deficiencyDisorder: 'Prothrombin deficiency (very rare) or Prothrombin G20210A mutation (thrombophilia)',
      normalRange: '80-120% of pooled normal plasma',
      referenceLinks: [
        {
          title: 'Thrombin Generation and Function',
          url: 'https://pubmed.ncbi.nlm.nih.gov/25854643/',
          type: 'pubmed'
        }
      ]
    },
    {
      id: 'fibrinogen',
      name: 'Fibrinogen',
      fullName: 'Factor I',
      pathway: 'common',
      position: null,
      description: 'Soluble plasma protein converted to insoluble fibrin by thrombin. Forms the structural basis of blood clots.',
      color: 'bg-red-500',
      isPlaced: false,
      correctPosition: { x: 250, y: 490 },
      clinicalRelevance: 'Acute phase reactant. Low levels cause bleeding; high levels increase thrombotic risk.',
      deficiencyDisorder: 'Afibrinogenemia, hypofibrinogenemia, or dysfibrinogenemia',
      normalRange: '200-400 mg/dL (2.0-4.0 g/L)',
      referenceLinks: [
        {
          title: 'Fibrinogen Disorders',
          url: 'https://pubmed.ncbi.nlm.nih.gov/29436322/',
          type: 'pubmed'
        }
      ]
    }
  ]);

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
    } else {
      setSelectedFactor(factor);
      toast({
        title: "Factor Selected! 🎯",
        description: `${factor.name} selected. Click on its target position to place it.`,
      });
    }
  };

  const handleDropZoneClick = (targetFactor: Factor) => {
    if (!selectedFactor || !gameStarted) return;
    
    if (selectedFactor.id === targetFactor.id) {
      setFactors(prev => prev.map(factor => {
        if (factor.id === selectedFactor.id) {
          setScore(prev => prev + 100);
          if (emergencyMode) {
            setPatientStatus(prev => Math.min(100, prev + 10));
          }
          setTimeout(() => showSuccessToast(factor, emergencyMode), 0);
          
          // Show medical info popup
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
          
          // Show medical info popup
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
      
      {/* Exit Button */}
      <Button
        onClick={() => setShowExitDialog(true)}
        className="fixed top-4 left-4 z-50 bg-red-600/80 hover:bg-red-700 backdrop-blur-sm border border-red-400/30"
      >
        <LogOut className="h-4 w-4 mr-2" />
        Exit Game
      </Button>

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
