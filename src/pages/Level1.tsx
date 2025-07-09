import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Play, RotateCcw, Target, LogOut, Sparkles, ArrowRight, Lightbulb, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import GameCascadeArea from '@/components/GameCascadeArea';
import GameHeader from '@/components/GameHeader';
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

  const handleFactorClick = (factor: Factor) => {
    if (!gameStarted || factor.isPlaced) return;
    
    setSelectedFactor(factor);
    toast({
      title: `${factor.name} Selected! ⚡`,
      description: `${factor.fullName} - Now click on the target position in the cascade to place it!`,
      duration: 3000,
    });
  };

  const handleDragStart = (e: React.DragEvent, factor: Factor) => {
    if (!gameStarted) return;
    e.dataTransfer.setData('text/plain', factor.id);
    e.dataTransfer.effectAllowed = 'move';
    
    // Provide immediate feedback
    toast({
      title: `Dragging ${factor.name} 🎯`,
      description: "Drop it on the correct position in the cascade!",
      duration: 2000,
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const factorId = e.dataTransfer.getData('text/plain');
    const factor = factors.find(f => f.id === factorId);
    if (factor && !factor.isPlaced) {
      setSelectedFactor(factor);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropZoneClick = (targetFactor: Factor) => {
    if (!gameStarted || !selectedFactor || targetFactor.isPlaced) return;

    // Implement click-to-add functionality
    if (selectedFactor.id === targetFactor.id) {
      const updatedFactors = factors.map(factor =>
        factor.id === selectedFactor.id
          ? { ...factor, isPlaced: true, position: factor.correctPosition }
          : factor
      );
      
      setFactors(updatedFactors);
      setScore(prevScore => prevScore + 100);
      setSelectedFactor(null);
      
      toast({
        title: "🎯 Perfect Placement!",
        description: `${selectedFactor.name} correctly placed! +100 points`,
        duration: 4000,
      });

      // Check for level completion
      const completedFactors = updatedFactors.filter(f => f.isPlaced).length;
      if (completedFactors === updatedFactors.length) {
        setLevel1Complete(true);
        localStorage.setItem('level1Complete', 'true');
        setShowCompletionDialog(true);
        const timeBonus = Math.max(0, 300 - timeElapsed) * 10;
        setScore(prevScore => prevScore + timeBonus);
        toast({
          title: "🎉 Cascade Commander!",
          description: `Congratulations! All factors placed correctly! Time bonus: +${timeBonus} points`,
          duration: 6000,
        });
      }
    } else {
      // Enhanced feedback for incorrect placement
      toast({
        title: "❌ Incorrect Placement",
        description: `${selectedFactor.name} doesn't belong there. Check the pathway and try again!`,
        variant: "destructive",
        duration: 4000,
      });
    }
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
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full animate-bounce ${
              i % 4 === 0 ? 'w-2 h-2 bg-blue-400/20' :
              i % 4 === 1 ? 'w-3 h-3 bg-purple-400/20' :
              i % 4 === 2 ? 'w-1.5 h-1.5 bg-pink-400/20' :
              'w-2.5 h-2.5 bg-green-400/20'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${2 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <AudioSystem gameState="playing" level={1} />
      
      {/* Top Control Bar */}
      <div className="fixed top-4 left-4 right-4 z-50 flex justify-between items-center">
        <Button
          onClick={() => setShowExitDialog(true)}
          className="glass-card bg-red-600/80 hover:bg-red-700 backdrop-blur-sm border border-red-400/30 transform hover:scale-105 transition-all duration-200"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Exit Game
        </Button>

        <div className="flex gap-2">
          <Button
            onClick={handleHintClick}
            className="glass-card bg-yellow-600/80 hover:bg-yellow-700 backdrop-blur-sm border border-yellow-400/30 transform hover:scale-105 transition-all duration-200"
            disabled={!gameStarted}
          >
            <Lightbulb className="h-4 w-4 mr-2" />
            Hint
          </Button>

          <Button
            onClick={handleNextLevelClick}
            className={`glass-card backdrop-blur-sm border transform hover:scale-105 transition-all duration-200 ${
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

      <div className="container mx-auto relative z-10 pt-16">
        <div className="mb-6 animate-in slide-in-from-top-4 duration-1000">
          <Link to="/" className="inline-flex items-center mb-4 text-blue-300 hover:text-blue-100 transform hover:scale-105 transition-all duration-200 glass-card px-4 py-2 rounded-xl border border-blue-400/30 backdrop-blur-sm">
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
              <Card className="mt-4 glass-card bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl">
                <CardContent className="p-4">
                  <h4 className="text-white font-bold mb-3 flex items-center">
                    <Target className="h-4 w-4 mr-2 text-yellow-400" />
                    How to Play
                  </h4>
                  <div className="text-sm text-gray-300 space-y-2">
                    <p>• <strong>Click</strong> a factor to select it</p>
                    <p>• <strong>Click</strong> the target drop zone to place it</p>
                    <p>• Or <strong>drag and drop</strong> factors directly</p>
                    <p>• Use <strong>Hint</strong> button for guidance</p>
                    {selectedFactor && (
                      <div className="mt-3 p-2 bg-amber-500/20 rounded-lg border border-amber-400/30">
                        <p className="text-amber-200 font-medium">
                          {selectedFactor.name} is selected!
                        </p>
                        <p className="text-xs text-amber-300">
                          Click its target position to place it.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {!gameStarted && (
              <Card className="mt-4 glass-card bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl">
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
            />
          </div>
        </div>
      </div>

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
