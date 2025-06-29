
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Play, RotateCcw, Target, LogOut } from 'lucide-react';
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
      title: `${factor.name} Selected`,
      description: `${factor.fullName} - Click on the target position in the cascade!`,
    });
  };

  const handleDragStart = (e: React.DragEvent, factor: Factor) => {
    if (!gameStarted) return;
    e.dataTransfer.setData('text/plain', factor.id);
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
  };

  const handleDropZoneClick = (targetFactor: Factor) => {
    if (!gameStarted || !selectedFactor || targetFactor.isPlaced) return;

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
        title: "Perfect Placement! 🎯",
        description: `${selectedFactor.name} correctly placed! +100 points`,
      });

      // Check for level completion
      const completedFactors = updatedFactors.filter(f => f.isPlaced).length;
      if (completedFactors === updatedFactors.length) {
        setLevel1Complete(true);
        setShowCompletionDialog(true);
        const timeBonus = Math.max(0, 300 - timeElapsed) * 10;
        setScore(prevScore => prevScore + timeBonus);
        toast({
          title: "🎉 Cascade Commander!",
          description: `Congratulations! All factors placed correctly! Time bonus: +${timeBonus} points`,
        });
      }
    } else {
      toast({
        title: "Incorrect Placement ❌",
        description: `${selectedFactor.name} doesn't belong there. Try again!`,
        variant: "destructive",
      });
    }
  };

  const startGame = () => {
    setGameStarted(true);
    toast({
      title: "🩸 Coagulation Cascade Started!",
      description: "Select factors and place them in the correct positions to complete the cascade!",
    });
  };

  const resetLevel = () => {
    setFactors(initialFactors.map(factor => ({ ...factor, isPlaced: false, position: null })));
    setSelectedFactor(null);
    setScore(0);
    setTimeElapsed(0);
    setLevel1Complete(false);
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
      {/* Floating particles animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/20 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <AudioSystem gameState="playing" level={1} />
      
      <Button
        onClick={() => setShowExitDialog(true)}
        className="fixed top-4 left-4 z-50 bg-red-600/80 hover:bg-red-700 backdrop-blur-sm border border-red-400/30 transform hover:scale-105 transition-all duration-200"
      >
        <LogOut className="h-4 w-4 mr-2" />
        Exit Game
      </Button>

      <div className="container mx-auto relative z-10">
        <div className="mb-6 animate-in slide-in-from-top-4 duration-1000">
          <Link to="/" className="inline-flex items-center mb-4 text-blue-300 hover:text-blue-100 transform hover:scale-105 transition-all duration-200">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 order-2 lg:order-1">
            <GameHeader
              title="Level 1: Coagulation Cascade Commander"
              subtitle="Master the intricate sequence of clotting factor activation"
              gameStarted={gameStarted}
              score={score}
              timeElapsed={formatTime(timeElapsed)}
              level1Complete={level1Complete}
              onStartGame={startGame}
              onResetLevel={resetLevel}
            />
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

      {/* Completion Dialog */}
      <AlertDialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-2xl font-bold text-blue-600">
              🩸 Level 1 Complete! 🩸
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-lg">
              Excellent work! You've successfully mastered the coagulation cascade fundamentals!
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{score}</div>
                <div className="text-sm text-gray-600">Final Score</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{formatTime(timeElapsed)}</div>
                <div className="text-sm text-gray-600">Completion Time</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">MASTER</div>
                <div className="text-sm text-gray-600">Cascade Status</div>
              </div>
            </div>
          </div>

          <AlertDialogFooter className="flex justify-center space-x-4">
            <AlertDialogAction 
              onClick={resetLevel}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Replay Level
            </AlertDialogAction>
            <AlertDialogAction 
              onClick={() => navigate('/level2')}
              className="bg-green-600 hover:bg-green-700"
            >
              <Target className="h-4 w-4 mr-2" />
              Next Level
            </AlertDialogAction>
            <AlertDialogCancel 
              onClick={() => navigate('/')}
            >
              <Target className="h-4 w-4 mr-2" />
              Main Menu
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
