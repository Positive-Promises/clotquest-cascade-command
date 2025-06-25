import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowUp, Check, Target, BookOpen, Clock, Play, RotateCcw, AlertTriangle, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import EnhancedFactor from '@/components/EnhancedFactor';
import AnimatedCascade from '@/components/AnimatedCascade';
import AudioSystem from '@/components/AudioSystem';
import Tutorial from '@/components/Tutorial';
import EmergencyLight from '@/components/EmergencyLight';
import RatingSystem from '@/components/RatingSystem';
import ThemeToggle from '@/components/ThemeToggle';
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

  // Tutorial steps for Level 1
  const tutorialSteps = [
    {
      id: 1,
      title: "Welcome to Coagulation Cascade Commander!",
      description: "This level teaches you the complete coagulation cascade. Drag factors from the left panel to their correct positions.",
      position: "bottom" as const
    },
    {
      id: 2,
      title: "Factor Bank",
      description: "These are your clotting factors. Each has detailed medical information when you hover over them.",
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
      description: "Drag factors here to their correct positions. Look for the pathway colors to guide you.",
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
          // Use callback to avoid render phase state update
          setTimeout(() => showSuccessToast(factor, emergencyMode), 0);
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
          title: "🎉 Cascade Mastered!",
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
    setGameStarted(true);
  };

  const startGame = () => {
    setGameStarted(true);
    setTimeout(() => {
      toast({
        title: "🎮 Game Started!",
        description: "Drag and drop factors to their correct positions in the cascade. Use tooltips for educational content!",
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

  const unplacedFactors = factors.filter(factor => !factor.isPlaced);
  const placedFactors = factors.filter(factor => factor.isPlaced);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 dark:from-slate-950 dark:via-blue-950 dark:to-slate-950 light:from-slate-100 light:via-blue-100 light:to-slate-100 relative">
      <AudioSystem gameState={gameStarted ? "playing" : "menu"} level={1} />
      
      {/* Emergency Light - Now smaller and at bottom */}
      <EmergencyLight 
        isEmergency={emergencyMode} 
        isSuccess={level1Complete && emergencyMode} 
        patientStatus={patientStatus} 
      />
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDYwIDAgTCAwIDAgMCA2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIxIiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] bg-repeat"></div>
      </div>

      {/* Enhanced Header with Theme Toggle */}
      <div className="container mx-auto mb-6 px-4 relative z-10">
        <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl dark:bg-white/5 light:bg-black/5 light:border-black/10">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row items-center justify-between text-white dark:text-white light:text-black gap-4">
              <div className="text-center lg:text-left">
                <h1 className="text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Level 1: Coagulation Cascade Commander
                </h1>
                <p className="text-blue-200 dark:text-blue-200 light:text-blue-800 text-base lg:text-lg">Master the intricate dance of hemostasis through interactive learning</p>
                {emergencyMode && (
                  <div className="mt-2 flex items-center justify-center lg:justify-start">
                    <AlertTriangle className="h-4 w-4 mr-2 text-red-400 animate-bounce" />
                    <span className="text-red-400 font-bold text-sm">Emergency Mode Active - Patient Status: {patientStatus}%</span>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-4 lg:space-x-8">
                <ThemeToggle />
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-yellow-400 animate-pulse">{score}</div>
                  <div className="text-xs lg:text-sm text-gray-300 dark:text-gray-300 light:text-gray-700">Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-green-400">{formatTime(timeElapsed)}</div>
                  <div className="text-xs lg:text-sm text-gray-300 dark:text-gray-300 light:text-gray-700">Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-blue-400">{placedFactors.length}/{factors.length}</div>
                  <div className="text-xs lg:text-sm text-gray-300 dark:text-gray-300 light:text-gray-700">Placed</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 px-4 relative z-10 pb-20">
        {/* Enhanced Sidebar */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <Card className="bg-white/5 backdrop-blur-xl border border-white/10 h-fit shadow-xl dark:bg-white/5 light:bg-black/5 light:border-black/10">
            <CardContent className="p-6">
              <h3 className="text-xl lg:text-2xl font-bold text-white dark:text-white light:text-black mb-4 flex items-center">
                <Target className="h-5 w-5 lg:h-6 lg:w-6 mr-2 text-yellow-400" />
                Game Controls
              </h3>

              <div className="space-y-3">
                {!gameStarted && (
                  <>
                    <Button 
                      onClick={() => setShowTutorial(true)} 
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Start Tutorial
                    </Button>
                    <Button 
                      onClick={startGame} 
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Normal Mode
                    </Button>
                    <Button 
                      onClick={startEmergencyMode} 
                      className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 shadow-lg"
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Emergency Mode
                    </Button>
                  </>
                )}

                {gameStarted && (
                  <Button 
                    onClick={resetLevel} 
                    variant="outline" 
                    className="w-full border-white/20 text-white hover:bg-white/10 backdrop-blur-sm"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset Challenge
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Pathway Legend */}
          <Card className="bg-white/5 backdrop-blur-xl border border-white/10 mt-4 shadow-xl dark:bg-white/5 light:bg-black/5 light:border-black/10">
            <CardContent className="p-4">
              <h4 className="text-white dark:text-white light:text-black font-bold mb-3 text-lg">Pathway Guide</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center p-3 rounded-lg bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-400/30">
                  <div className="w-4 h-4 bg-gradient-to-br from-blue-400 to-blue-600 rounded mr-3 flex-shrink-0"></div>
                  <div>
                    <div className="text-white font-semibold">Intrinsic Pathway</div>
                    <div className="text-blue-200 text-xs">Contact activation (XII, XI, IX)</div>
                  </div>
                </div>
                <div className="flex items-center p-3 rounded-lg bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-400/30">
                  <div className="w-4 h-4 bg-gradient-to-br from-green-400 to-green-600 rounded mr-3 flex-shrink-0"></div>
                  <div>
                    <div className="text-white font-semibold">Extrinsic Pathway</div>
                    <div className="text-green-200 text-xs">Tissue factor activation (VII, TF)</div>
                  </div>
                </div>
                <div className="flex items-center p-3 rounded-lg bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-400/30">
                  <div className="w-4 h-4 bg-gradient-to-br from-purple-400 to-purple-600 rounded mr-3 flex-shrink-0"></div>
                  <div>
                    <div className="text-white font-semibold">Common Pathway</div>
                    <div className="text-purple-200 text-xs">Final clot formation (X, V, II, I)</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rating System */}
          <RatingSystem gameId="level1" onRatingSubmit={(rating) => console.log('Rating submitted:', rating)} />
        </div>

        {/* Main Game Area */}
        <div className="lg:col-span-3 order-1 lg:order-2">
          {/* Cascade Visualization */}
          <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl dark:bg-white/5 light:bg-black/5 light:border-black/10 mb-6">
            <CardContent className="p-4 lg:p-6">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-4">
                <h3 className="text-xl lg:text-2xl font-bold text-white dark:text-white light:text-black flex items-center">
                  <ArrowUp className="h-5 w-5 lg:h-6 lg:w-6 mr-2 text-blue-400 rotate-180" />
                  Interactive Coagulation Cascade
                </h3>
                <div className="text-white dark:text-white light:text-black text-xs lg:text-sm bg-white/10 px-3 py-2 rounded-full backdrop-blur-sm border border-white/20">
                  Hover over factors for detailed educational content
                </div>
              </div>

              <div className="relative min-h-[400px] lg:min-h-[500px]">
                <AnimatedCascade
                  factors={factors}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                />
              </div>
            </CardContent>
          </Card>

          {/* Factor Buttons - Now Below Cascade in 2 Rows */}
          <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl dark:bg-white/5 light:bg-black/5 light:border-black/10">
            <CardContent className="p-4 lg:p-6">
              <h3 className="text-xl lg:text-2xl font-bold text-white dark:text-white light:text-black mb-4 flex items-center">
                <Target className="h-5 w-5 lg:h-6 lg:w-6 mr-2 text-yellow-400" />
                Clotting Factors
              </h3>
              
              {/* Two rows of factors */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-4">
                {unplacedFactors.slice(0, Math.ceil(unplacedFactors.length / 2)).map(factor => (
                  <EnhancedFactor
                    key={factor.id}
                    factor={factor}
                    onDragStart={handleDragStart}
                    gameStarted={gameStarted}
                  />
                ))}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {unplacedFactors.slice(Math.ceil(unplacedFactors.length / 2)).map(factor => (
                  <EnhancedFactor
                    key={factor.id}
                    factor={factor}
                    onDragStart={handleDragStart}
                    gameStarted={gameStarted}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tutorial Component */}
      <Tutorial
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
        onSkip={() => setShowTutorial(false)}
        steps={tutorialSteps}
        currentLevel="level1"
      />

      {/* Completion Dialog */}
      <AlertDialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <AlertDialogContent className="max-w-2xl bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 border border-blue-400/30 backdrop-blur-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              🎉 {emergencyMode ? 'PATIENT SAVED!' : 'Level 1 Complete!'} 🎉
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-lg text-gray-300">
              {emergencyMode 
                ? "Outstanding work! You've successfully saved the patient by assembling the complete coagulation cascade under emergency conditions! The patient is stable and recovering."
                : "Congratulations! You've mastered the coagulation cascade and demonstrated excellent understanding of hemostatic mechanisms!"
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
              Next Level
            </AlertDialogAction>
            <AlertDialogCancel 
              onClick={() => navigate('/')}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Main Menu
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Level1;
