import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Play, RotateCcw, Target, LogOut, Sparkles, ArrowRight, Lightbulb, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import GameCascadeArea from '@/components/GameCascadeArea';
import GameHeader from '@/components/GameHeader';
import MedicalInfoPopup from '@/components/MedicalInfoPopup';
import { level1Factors as initialFactors } from '@/data/cascadeFactors';
import { Factor } from '@/types/cascadeTypes';
import AudioSystem from '@/components/AudioSystem';
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

const Level1 = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [factors, setFactors] = useState<Factor[]>(initialFactors);
  const [selectedFactor, setSelectedFactor] = useState<Factor | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [level1Complete, setLevel1Complete] = useState(false);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showHintDialog, setShowHintDialog] = useState(false);
  const [showNextLevelDialog, setShowNextLevelDialog] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [draggedFactor, setDraggedFactor] = useState<Factor | null>(null);
  const [showMedicalInfo, setShowMedicalInfo] = useState(false);
  const [medicalInfoFactor, setMedicalInfoFactor] = useState<Factor | null>(null);

  // Load completion status from localStorage
  useEffect(() => {
    const completionStatus = localStorage.getItem('level1Complete');
    if (completionStatus === 'true') {
      setLevel1Complete(true);
    }
  }, []);

  useEffect(() => {
    if (gameStarted) {
      const timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameStarted]);

  // Enhanced chess-like factor selection
  const handleFactorClick = (factor: Factor) => {
    if (!gameStarted || factor.isPlaced) return;
    
    // Play click sound
    if ((window as any).gameAudio) {
      (window as any).gameAudio.playClick();
    }
    
    // If clicking the same factor, deselect it
    if (selectedFactor?.id === factor.id) {
      setSelectedFactor(null);
      toast({
        title: `${factor.name} Deselected`,
        description: "Factor deselected. Click another factor to select it.",
        duration: 2000,
      });
      return;
    }
    
    setSelectedFactor(factor);
    toast({
      title: `⚡ ${factor.name} Selected!`,
      description: `${factor.fullName} - Now click on the target position in the cascade!`,
      duration: 3000,
    });
  };

  // Enhanced drag start with better visual feedback
  const handleDragStart = (e: React.DragEvent, factor: Factor) => {
    if (!gameStarted || factor.isPlaced) {
      e.preventDefault();
      return;
    }
    
    setDraggedFactor(factor);
    setSelectedFactor(factor);
    
    // Create enhanced drag image
    const dragImage = document.createElement('div');
    dragImage.style.cssText = `
      position: absolute;
      top: -1000px;
      left: -1000px;
      width: 160px;
      height: 100px;
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.9), rgba(67, 56, 202, 0.9));
      border-radius: 16px;
      border: 2px solid rgba(255,255,255,0.4);
      color: white;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      font-size: 14px;
      box-shadow: 0 25px 50px rgba(0,0,0,0.7);
      backdrop-filter: blur(20px);
      transform: scale(1.1);
      z-index: 1000;
    `;
    dragImage.innerHTML = `<div>${factor.name}<br><small>${factor.pathway} pathway</small></div>`;
    document.body.appendChild(dragImage);
    
    e.dataTransfer.setDragImage(dragImage, 80, 50);
    e.dataTransfer.setData('text/plain', factor.id);
    e.dataTransfer.effectAllowed = 'move';
    
    setTimeout(() => {
      if (document.body.contains(dragImage)) {
        document.body.removeChild(dragImage);
      }
    }, 100);
    
    toast({
      title: `🎯 Dragging ${factor.name}`,
      description: "Drop it on the correct position in the cascade!",
      duration: 2000,
    });
  };

  const handleDragEnd = () => {
    setDraggedFactor(null);
  };

  // Enhanced drop handling with better validation
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const factorId = e.dataTransfer?.getData('text/plain');
    if (!factorId) return;
    
    const draggedFactor = factors.find(f => f.id === factorId);
    const dropZone = e.currentTarget as HTMLElement;
    const targetFactorId = dropZone.getAttribute('data-factor-id');
    
    if (!draggedFactor || !targetFactorId) return;
    
    // Check if dropping on correct position
    if (draggedFactor.id === targetFactorId) {
      handleCorrectPlacement(draggedFactor);
    } else {
      handleIncorrectPlacement(draggedFactor);
    }
    
    setDraggedFactor(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
  };

  // Enhanced click-to-place functionality
  const handleDropZoneClick = (targetFactor: Factor) => {
    if (!gameStarted || !selectedFactor || targetFactor.isPlaced) return;

    // Check if clicking on the correct position for the selected factor
    if (selectedFactor.id === targetFactor.id) {
      handleCorrectPlacement(selectedFactor);
    } else {
      handleIncorrectPlacement(selectedFactor);
    }
  };

  // Enhanced correct placement with medical info popup
  const handleCorrectPlacement = (factor: Factor) => {
    const updatedFactors = factors.map(f =>
      f.id === factor.id
        ? { ...f, isPlaced: true, position: f.correctPosition }
        : f
    );
    
    setFactors(updatedFactors);
    setScore(prevScore => prevScore + 100);
    setSelectedFactor(null);
    
    // Play success sound
    if ((window as any).gameAudio) {
      (window as any).gameAudio.playSuccess();
    }
    
    // Show medical information popup
    setMedicalInfoFactor(factor);
    setShowMedicalInfo(true);
    
    toast({
      title: "🎯 Perfect Placement!",
      description: `${factor.name} correctly placed! +100 points`,
      duration: 4000,
    });

    // Check for level completion
    const completedFactors = updatedFactors.filter(f => f.isPlaced).length;
    if (completedFactors === updatedFactors.length) {
      setLevel1Complete(true);
      localStorage.setItem('level1Complete', 'true');
      setTimeout(() => {
        setShowCompletionDialog(true);
      }, 2000);
      const timeBonus = Math.max(0, 300 - timeElapsed) * 10;
      setScore(prevScore => prevScore + timeBonus);
      toast({
        title: "🎉 Cascade Commander!",
        description: `Congratulations! All factors placed correctly! Time bonus: +${timeBonus} points`,
        duration: 6000,
      });
    }
  };

  // Enhanced incorrect placement with better feedback
  const handleIncorrectPlacement = (factor: Factor) => {
    // Play error sound
    if ((window as any).gameAudio) {
      (window as any).gameAudio.playError();
    }

    toast({
      title: "❌ Incorrect Placement",
      description: `${factor.name} doesn't belong there. Check the ${factor.pathway} pathway and try again!`,
      variant: "destructive",
      duration: 4000,
    });
  };

  const handleHintClick = () => {
    if (!selectedFactor) {
      toast({
        title: "💡 Select a Factor First",
        description: "Click on a clotting factor to select it, then click the hint button for guidance!",
        duration: 3000,
      });
      return;
    }
    setShowHintDialog(true);
  };

  const handleHintToggle = () => {
    setShowHints(!showHints);
    toast({
      title: showHints ? "🙈 Hints Hidden" : "💡 Hints Revealed",
      description: showHints ? "Challenge mode activated!" : "Drop zones now show factor names",
      duration: 3000,
    });
  };

  const handleNextLevelClick = () => {
    if (!level1Complete) {
      setShowNextLevelDialog(true);
    } else {
      navigate('/level2');
    }
  };

  const startGame = () => {
    setGameStarted(true);
    toast({
      title: "🩸 Cascade Commander Activated!",
      description: "Click factors to select them, then click their target positions. You can also drag and drop!",
      duration: 5000,
    });
  };

  const resetLevel = () => {
    setFactors(initialFactors.map(factor => ({ ...factor, isPlaced: false, position: null })));
    setSelectedFactor(null);
    setScore(0);
    setTimeElapsed(0);
    setShowCompletionDialog(false);
    setGameStarted(true);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 pb-32 relative overflow-hidden">
      {/* Enhanced Floating particles animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(75)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full animate-bounce ${
              i % 5 === 0 ? 'w-3 h-3 bg-blue-400/30' :
              i % 5 === 1 ? 'w-4 h-4 bg-purple-400/25' :
              i % 5 === 2 ? 'w-2 h-2 bg-pink-400/35' :
              i % 5 === 3 ? 'w-3.5 h-3.5 bg-green-400/20' :
              'w-2.5 h-2.5 bg-yellow-400/25'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${2 + Math.random() * 4}s`,
              boxShadow: `0 0 ${Math.random() * 10 + 5}px currentColor`
            }}
          />
        ))}
      </div>

      {/* Enhanced Audio System - Positioned at top center */}
      <AudioSystem gameState="playing" level={1} />
      
      {/* Top Control Bar - Positioned below audio system */}
      <div className="fixed top-28 left-4 right-4 z-40 flex justify-between items-center">
        <Button
          onClick={() => setShowExitDialog(true)}
          className="glassmorphic-card bg-red-600/80 hover:bg-red-700 backdrop-blur-sm border border-red-400/30 transform hover:scale-105 transition-all duration-200 shadow-xl"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Exit Game
        </Button>

        <div className="flex gap-3">
          <Button
            onClick={handleHintClick}
            className="glassmorphic-card bg-yellow-600/80 hover:bg-yellow-700 backdrop-blur-sm border border-yellow-400/30 transform hover:scale-105 transition-all duration-200 shadow-xl"
            disabled={!gameStarted}
          >
            <Lightbulb className="h-4 w-4 mr-2" />
            Hint
          </Button>

          <Button
            onClick={handleHintToggle}
            className={`glassmorphic-card backdrop-blur-sm border transform hover:scale-105 transition-all duration-200 shadow-xl ${
              showHints 
                ? 'bg-orange-600/80 hover:bg-orange-700 border-orange-400/30' 
                : 'bg-purple-600/80 hover:bg-purple-700 border-purple-400/30'
            }`}
            disabled={!gameStarted}
          >
            <Target className="h-4 w-4 mr-2" />
            {showHints ? 'Hide Labels' : 'Show Labels'}
          </Button>

          <Button
            onClick={handleNextLevelClick}
            className={`glassmorphic-card backdrop-blur-sm border transform hover:scale-105 transition-all duration-200 shadow-xl ${
              level1Complete 
                ? 'bg-green-600/80 hover:bg-green-700 border-green-400/30' 
                : 'bg-gray-600/80 hover:bg-gray-700 border-gray-400/30'
            }`}
          >
            {level1Complete ? (
              <>
                <ArrowRight className="h-4 w-4 mr-2" />
                Next Level
              </>
            ) : (
              <>
                <Lock className="h-4 w-4 mr-2" />
                Next Level
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="container mx-auto relative z-10 pt-36">
        <div className="mb-6 animate-in slide-in-from-top-4 duration-1000">
          <Link to="/" className="inline-flex items-center mb-4 text-blue-300 hover:text-blue-100 transform hover:scale-105 transition-all duration-200 glassmorphic-card px-4 py-2 rounded-xl border border-blue-400/30 backdrop-blur-sm shadow-xl">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
            <Sparkles className="ml-2 h-4 w-4 animate-pulse" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 order-2 lg:order-1">
            <GameHeader
              score={score}
              timeElapsed={timeElapsed}
              placedFactorsCount={factors.filter(factor => factor.isPlaced).length}
              totalFactorsCount={factors.length}
              emergencyMode={false}
              patientStatus={100}
              onExitGame={() => setShowExitDialog(true)}
            />

            {/* Game Instructions Panel */}
            {gameStarted && (
              <Card className="mt-4 glassmorphic-card bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl">
                <CardContent className="p-4">
                  <h4 className="text-white font-bold mb-3 flex items-center">
                    <Target className="h-4 w-4 mr-2 text-yellow-400" />
                    Chess-Style Controls
                  </h4>
                  <div className="text-sm text-gray-300 space-y-2">
                    <p>• <strong>Click</strong> a factor to select it (like chess pieces)</p>
                    <p>• <strong>Click</strong> the target drop zone to place it</p>
                    <p>• Or <strong>drag and drop</strong> factors directly</p>
                    <p>• Use <strong>Show Labels</strong> for easier placement</p>
                    <p>• Use <strong>Hint</strong> button for detailed guidance</p>
                    {selectedFactor && (
                      <div className="mt-3 p-3 bg-amber-500/20 rounded-lg border border-amber-400/30 animate-pulse">
                        <p className="text-amber-200 font-medium">
                          {selectedFactor.name} is selected!
                        </p>
                        <p className="text-xs text-amber-300 mt-1">
                          Click its target position to place it.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {!gameStarted && (
              <Card className="mt-4 glassmorphic-card bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl">
                <CardContent className="p-6 text-center">
                  <Button 
                    onClick={startGame}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Game
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="lg:col-span-3">
            <GameCascadeArea
              factors={factors}
              selectedFactor={selectedFactor}
              gameStarted={gameStarted}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDropZoneClick={handleDropZoneClick}
              onDragStart={handleDragStart}
              onFactorClick={handleFactorClick}
              showHints={showHints}
            />
          </div>
        </div>
      </div>

      {/* Medical Information Popup */}
      <MedicalInfoPopup
        factor={medicalInfoFactor}
        isOpen={showMedicalInfo}
        onClose={() => setShowMedicalInfo(false)}
      />

      {/* Hint Dialog */}
      <AlertDialog open={showHintDialog} onOpenChange={setShowHintDialog}>
        <AlertDialogContent className="max-w-2xl glass-card backdrop-blur-xl border border-yellow-400/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              💡 Hint for {selectedFactor?.name}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-lg text-white">
              {selectedFactor?.fullName}
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-6 space-y-4">
            <div className="glass-card bg-blue-50/10 p-4 rounded-lg border border-blue-400/30">
              <h4 className="font-bold text-blue-400 mb-2">Pathway</h4>
              <p className="text-gray-300 capitalize">{selectedFactor?.pathway} Pathway</p>
            </div>
            <div className="glass-card bg-green-50/10 p-4 rounded-lg border border-green-400/30">
              <h4 className="font-bold text-green-400 mb-2">Function</h4>
              <p className="text-gray-300">{selectedFactor?.description}</p>
            </div>
            <div className="glass-card bg-purple-50/10 p-4 rounded-lg border border-purple-400/30">
              <h4 className="font-bold text-purple-400 mb-2">Clinical Relevance</h4>
              <p className="text-gray-300">{selectedFactor?.clinicalRelevance}</p>
            </div>
          </div>

          <AlertDialogFooter className="flex justify-center">
            <AlertDialogAction 
              onClick={() => setShowHintDialog(false)}
              className="glass-card bg-yellow-600/80 hover:bg-yellow-700 backdrop-blur-sm border border-yellow-400/30"
            >
              <Lightbulb className="h-4 w-4 mr-2" />
              Got it!
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Next Level Dialog */}
      <AlertDialog open={showNextLevelDialog} onOpenChange={setShowNextLevelDialog}>
        <AlertDialogContent className="max-w-2xl glass-card backdrop-blur-xl border border-orange-400/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              🔒 Level Locked
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-lg text-white">
              Complete Level 1 first to unlock Level 2!
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-6 text-center">
            <div className="glass-card bg-orange-50/10 p-6 rounded-lg border border-orange-400/30">
              <Lock className="h-12 w-12 mx-auto mb-4 text-orange-400" />
              <p className="text-gray-300 text-lg">
                You need to successfully place all clotting factors in the cascade to unlock the next level.
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Current progress: {factors.filter(f => f.isPlaced).length} / {factors.length} factors placed
              </p>
            </div>
          </div>

          <AlertDialogFooter className="flex justify-center">
            <AlertDialogAction 
              onClick={() => setShowNextLevelDialog(false)}
              className="glass-card bg-orange-600/80 hover:bg-orange-700 backdrop-blur-sm border border-orange-400/30"
            >
              <Target className="h-4 w-4 mr-2" />
              Continue Playing
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <AlertDialogContent className="max-w-2xl glass-card backdrop-blur-xl border border-emerald-400/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              🩸 Level 1 Complete! 🩸
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-lg text-white">
              Excellent work! You've successfully mastered the coagulation cascade fundamentals!
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="glass-card bg-blue-50/10 p-4 rounded-lg border border-blue-400/30">
                <div className="text-2xl font-bold text-blue-400">{score}</div>
                <div className="text-sm text-gray-300">Final Score</div>
              </div>
              <div className="glass-card bg-green-50/10 p-4 rounded-lg border border-green-400/30">
                <div className="text-2xl font-bold text-green-400">{formatTime(timeElapsed)}</div>
                <div className="text-sm text-gray-300">Completion Time</div>
              </div>
              <div className="glass-card bg-purple-50/10 p-4 rounded-lg border border-purple-400/30">
                <div className="text-2xl font-bold text-purple-400">MASTER</div>
                <div className="text-sm text-gray-300">Cascade Status</div>
              </div>
            </div>
          </div>

          <AlertDialogFooter className="flex justify-center space-x-4">
            <AlertDialogAction 
              onClick={resetLevel}
              className="glass-card bg-blue-600/80 hover:bg-blue-700 backdrop-blur-sm border border-blue-400/30"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Replay Level
            </AlertDialogAction>
            <AlertDialogAction 
              onClick={() => navigate('/level2')}
              className="glass-card bg-green-600/80 hover:bg-green-700 backdrop-blur-sm border border-green-400/30"
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              Next Level
            </AlertDialogAction>
            <AlertDialogCancel 
              onClick={() => navigate('/')}
              className="glass-card border border-white/20 text-white hover:bg-white/10"
            >
              <Target className="h-4 w-4 mr-2" />
              Main Menu
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent className="glass-card bg-gradient-to-br from-slate-900/95 via-blue-900/95 to-slate-900/95 border border-red-400/30 backdrop-blur-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-2xl font-bold text-red-400">
              Exit Game?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-lg text-gray-300">
              Are you sure you want to exit? Your current progress will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-center space-x-4">
            <AlertDialogCancel className="glass-card border-white/20 text-white hover:bg-white/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => navigate('/')}
              className="bg-red-600 hover:bg-red-700"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Exit Game
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Level1;
