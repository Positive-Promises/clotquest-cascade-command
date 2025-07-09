import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Play, 
  RotateCcw, 
  Zap, 
  Target,
  Clock,
  Award
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
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

interface PlateletStep {
  id: number;
  name: string;
  description: string;
  isCompleted: boolean;
  isActive: boolean;
  requiredClicks: number;
  currentClicks: number;
  position: { x: number; y: number };
  color: string;
}

const Level3 = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [level3Complete, setLevel3Complete] = useState(false);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);

  const [plateletSteps, setPlateletSteps] = useState<PlateletStep[]>([
    {
      id: 1,
      name: 'Vessel Injury',
      description: 'Blood vessel is damaged, exposing collagen and von Willebrand factor',
      isCompleted: false,
      isActive: true,
      requiredClicks: 3,
      currentClicks: 0,
      position: { x: 100, y: 100 },
      color: 'bg-red-500'
    },
    {
      id: 2,
      name: 'Platelet Adhesion',
      description: 'Platelets bind to exposed collagen via GP Ia/IIa and to vWF via GP Ib/IX/V',
      isCompleted: false,
      isActive: false,
      requiredClicks: 5,
      currentClicks: 0,
      position: { x: 300, y: 150 },
      color: 'bg-blue-500'
    },
    {
      id: 3,
      name: 'Platelet Activation',
      description: 'Adhered platelets become activated, change shape, and release granule contents',
      isCompleted: false,
      isActive: false,
      requiredClicks: 4,
      currentClicks: 0,
      position: { x: 500, y: 100 },
      color: 'bg-green-500'
    },
    {
      id: 4,
      name: 'Platelet Aggregation',
      description: 'Activated platelets recruit more platelets via fibrinogen bridges and GP IIb/IIIa',
      isCompleted: false,
      isActive: false,
      requiredClicks: 6,
      currentClicks: 0,
      position: { x: 350, y: 300 },
      color: 'bg-purple-500'
    },
    {
      id: 5,
      name: 'Plug Stabilization',
      description: 'Platelet plug is stabilized by fibrin formation from the coagulation cascade',
      isCompleted: false,
      isActive: false,
      requiredClicks: 3,
      currentClicks: 0,
      position: { x: 150, y: 350 },
      color: 'bg-orange-500'
    }
  ]);

  useEffect(() => {
    if (gameStarted) {
      const timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameStarted]);

  const handleStepClick = (stepId: number) => {
    if (!gameStarted) return;

    setPlateletSteps(prev => prev.map(step => {
      if (step.id === stepId && step.isActive) {
        const newClicks = step.currentClicks + 1;
        const isCompleted = newClicks >= step.requiredClicks;
        
        if (isCompleted) {
          setScore(prevScore => prevScore + 200);
          toast({
            title: "Step Completed! 🎯",
            description: `${step.name} successfully completed! +200 points`,
          });
          
          // Activate next step
          const nextStep = prev.find(s => s.id === stepId + 1);
          if (nextStep) {
            toast({
              title: "Next Step Activated! ⚡",
              description: `${nextStep.name} is now active. Click to proceed!`,
            });
          }
        }
        
        return {
          ...step,
          currentClicks: newClicks,
          isCompleted,
          isActive: !isCompleted
        };
      } else if (step.id === stepId + 1 && prev.find(s => s.id === stepId)?.currentClicks === prev.find(s => s.id === stepId)?.requiredClicks - 1) {
        return { ...step, isActive: true };
      }
      return step;
    }));
  };

  const checkCompletion = () => {
    const allCompleted = plateletSteps.every(step => step.isCompleted);
    if (allCompleted && !level3Complete) {
      setLevel3Complete(true);
      const timeBonus = Math.max(0, 180 - timeElapsed) * 15; // 3 minute target
      setScore(prev => prev + timeBonus);
      setShowCompletionDialog(true);
      toast({
        title: "🎉 Hemostasis Master!",
        description: `Perfect! You've successfully formed a stable platelet plug! Time bonus: +${timeBonus} points`,
      });
    }
  };

  useEffect(() => {
    checkCompletion();
  }, [plateletSteps]);

  const startGame = () => {
    setGameStarted(true);
    toast({
      title: "🩸 Hemostasis Challenge Started!",
      description: "Click on each step in sequence to form a stable platelet plug and stop the bleeding!",
    });
  };

  const resetLevel = () => {
    setPlateletSteps(prev => prev.map((step, index) => ({
      ...step,
      isCompleted: false,
      isActive: index === 0,
      currentClicks: 0
    })));
    setScore(0);
    setTimeElapsed(0);
    setLevel3Complete(false);
    setShowCompletionDialog(false);
    setGameStarted(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const completedSteps = plateletSteps.filter(step => step.isCompleted).length;
  const totalSteps = plateletSteps.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-purple-900 to-blue-900 p-4 pb-20">
      <div className="container mx-auto">
        <Link to="/" className="inline-flex items-center mb-4 text-blue-300 hover:text-blue-100">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        {/* Header */}
        <Card className="bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 shadow-2xl mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row items-center justify-between text-white gap-4">
              <div className="text-center lg:text-left">
                <h1 className="text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-red-400 to-purple-400 bg-clip-text text-transparent">
                  Level 3: Platelet Plug Formation
                </h1>
                <p className="text-purple-200 text-base lg:text-lg">Master primary hemostasis through interactive platelet activation</p>
              </div>
              <div className="flex items-center space-x-4 lg:space-x-8">
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-yellow-400">{score}</div>
                  <div className="text-sm text-gray-300">Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-green-400">{formatTime(timeElapsed)}</div>
                  <div className="text-sm text-gray-300">Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-blue-400">{completedSteps}/{totalSteps}</div>
                  <div className="text-sm text-gray-300">Steps</div>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <Progress value={progressPercentage} className="h-3" />
              <p className="text-center text-white mt-2 text-sm">Hemostasis Progress: {Math.round(progressPercentage)}%</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Control Panel */}
          <div className="lg:col-span-1">
            <Card className="bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 shadow-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Target className="h-6 w-6 mr-2 text-red-400" />
                  Hemostasis Control
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!gameStarted && (
                  <Button onClick={startGame} className="w-full bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700">
                    <Play className="h-4 w-4 mr-2" />
                    Start Hemostasis
                  </Button>
                )}

                {gameStarted && (
                  <Button onClick={resetLevel} variant="outline" className="w-full border-white text-white hover:bg-white hover:text-purple-900">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset Challenge
                  </Button>
                )}

                <div className="bg-white/10 p-4 rounded-lg">
                  <h4 className="text-white font-bold mb-2">Instructions</h4>
                  <p className="text-white/80 text-sm">
                    Click on each step in sequence to progress through platelet plug formation. 
                    Each step requires multiple clicks to complete.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Step Progress */}
            <Card className="bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 shadow-xl mt-4">
              <CardHeader>
                <CardTitle className="text-white text-lg">Step Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {plateletSteps.map(step => (
                  <div key={step.id} className="bg-white/5 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-semibold text-sm">{step.name}</span>
                      <Badge 
                        variant={step.isCompleted ? "default" : step.isActive ? "secondary" : "outline"}
                        className={`text-xs ${
                          step.isCompleted ? 'bg-green-600' : 
                          step.isActive ? 'bg-yellow-600' : 'bg-gray-600'
                        }`}
                      >
                        {step.isCompleted ? 'Done' : step.isActive ? 'Active' : 'Waiting'}
                      </Badge>
                    </div>
                    <Progress 
                      value={(step.currentClicks / step.requiredClicks) * 100} 
                      className="h-2" 
                    />
                    <p className="text-white/60 text-xs mt-1">
                      {step.currentClicks}/{step.requiredClicks} clicks
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Interactive Vessel Visualization */}
          <div className="lg:col-span-3">
            <Card className="bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Zap className="h-6 w-6 mr-2 text-red-400" />
                  Blood Vessel Cross-Section
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative bg-gradient-to-b from-pink-100 to-red-100 rounded-2xl p-8 min-h-[400px] lg:min-h-[500px] overflow-hidden border-4 border-red-300">
                  {/* Vessel wall representation */}
                  <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-pink-200 to-pink-300 opacity-50"></div>
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-pink-200 to-pink-300 opacity-50"></div>
                  
                  {/* Blood flow representation */}
                  <div className="absolute inset-0 bg-gradient-to-r from-red-200 via-red-300 to-red-200 opacity-30 animate-pulse"></div>
                  
                  {/* Platelet steps */}
                  {plateletSteps.map(step => (
                    <div
                      key={step.id}
                      className={`absolute w-24 h-24 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 transform ${
                        step.isActive ? 'hover:scale-110 animate-pulse' : ''
                      } ${
                        step.isCompleted ? 'scale-110 shadow-2xl ring-4 ring-green-400' : 
                        step.isActive ? 'shadow-xl ring-4 ring-yellow-400' : 'opacity-50'
                      } ${step.color}`}
                      style={{
                        left: step.position.x,
                        top: step.position.y
                      }}
                      onClick={() => handleStepClick(step.id)}
                    >
                      <div className="text-center text-white">
                        <div className="text-xs font-bold">{step.id}</div>
                        <div className="text-[10px] leading-tight">{step.name.split(' ')[0]}</div>
                        {step.isActive && (
                          <div className="text-[8px]">
                            {step.currentClicks}/{step.requiredClicks}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Educational overlay - moved to prevent overlap */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
                    <h4 className="font-bold text-gray-800 mb-1 text-sm">Primary Hemostasis</h4>
                    <p className="text-xs text-gray-700">
                      Click the active steps in sequence to simulate platelet plug formation. 
                      This is the body's immediate response to vascular injury.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Completion Dialog */}
      <AlertDialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-2xl font-bold text-purple-600">
              🩸 Level 3 Complete! 🩸
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-lg">
              Excellent work! You've successfully demonstrated mastery of primary hemostasis and platelet plug formation!
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{score}</div>
                <div className="text-sm text-gray-600">Final Score</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{formatTime(timeElapsed)}</div>
                <div className="text-sm text-gray-600">Completion Time</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">MASTER</div>
                <div className="text-sm text-gray-600">Hemostasis Status</div>
              </div>
            </div>
          </div>

          <AlertDialogFooter className="flex justify-center space-x-4">
            <AlertDialogAction 
              onClick={resetLevel}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Replay Level
            </AlertDialogAction>
            <AlertDialogAction 
              onClick={() => navigate('/level4')}
              className="bg-green-600 hover:bg-green-700"
            >
              <Award className="h-4 w-4 mr-2" />
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
    </div>
  );
};

export default Level3;
