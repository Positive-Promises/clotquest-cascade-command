
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
  Award,
  Heart,
  Activity,
  Droplets,
  LogOut,
  ArrowRight,
  Lightbulb,
  AlertTriangle,
  Microscope
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import GameHeader from '@/components/GameHeader';
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

interface PlateletStep {
  id: number;
  name: string;
  description: string;
  detailedInfo: string;
  isCompleted: boolean;
  isActive: boolean;
  requiredClicks: number;
  currentClicks: number;
  position: { x: number; y: number };
  color: string;
  molecularTargets: string[];
  clinicalRelevance: string;
}

interface BloodComponent {
  id: string;
  name: string;
  type: 'platelet' | 'rbc' | 'wbc' | 'plasma';
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  isActivated: boolean;
  size: number;
}

const Level3 = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [level3Complete, setLevel3Complete] = useState(false);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showStepInfoDialog, setShowStepInfoDialog] = useState(false);
  const [selectedStepInfo, setSelectedStepInfo] = useState<PlateletStep | null>(null);
  const [flowRate, setFlowRate] = useState(50); // Blood flow simulation
  const [vesselDamage, setVesselDamage] = useState(0);
  const [plugStability, setPlugStability] = useState(0);

  const [plateletSteps, setPlateletSteps] = useState<PlateletStep[]>([
    {
      id: 1,
      name: 'Vascular Injury',
      description: 'Endothelial damage exposes subendothelial collagen and releases von Willebrand factor',
      detailedInfo: 'When blood vessels are injured, the protective endothelial layer is disrupted, exposing the underlying subendothelial matrix rich in collagen fibers. This triggers the immediate release of von Willebrand factor (vWF) from Weibel-Palade bodies.',
      isCompleted: false,
      isActive: true,
      requiredClicks: 3,
      currentClicks: 0,
      position: { x: 50, y: 80 },
      color: 'bg-red-500',
      molecularTargets: ['Collagen I', 'Collagen III', 'von Willebrand Factor', 'Tissue Factor'],
      clinicalRelevance: 'Vessel wall integrity is crucial - diseases affecting collagen (Ehlers-Danlos) or vWF (von Willebrand disease) impair this step.'
    },
    {
      id: 2,
      name: 'Platelet Adhesion',
      description: 'Platelets bind to exposed collagen via GPIa/IIa and to vWF via GPIb/IX/V complex',
      detailedInfo: 'Circulating platelets recognize the injury site through specific glycoprotein receptors. GP Ia/IIa (integrin α2β1) binds directly to collagen, while GP Ib/IX/V complex binds to vWF under high shear conditions.',
      isCompleted: false,
      isActive: false,
      requiredClicks: 5,
      currentClicks: 0,
      position: { x: 200, y: 120 },
      color: 'bg-blue-500',
      molecularTargets: ['GP Ia/IIa', 'GP Ib/IX/V', 'Integrin α2β1', 'vWF A1 domain'],
      clinicalRelevance: 'Bernard-Soulier syndrome (GP Ib deficiency) and Glanzmann thrombasthenia affect platelet adhesion.'
    },
    {
      id: 3,
      name: 'Platelet Activation',
      description: 'Shape change, degranulation, and exposure of phosphatidylserine on platelet surface',
      detailedInfo: 'Adhered platelets undergo dramatic cytoskeletal reorganization, changing from smooth discs to spiny spheres with pseudopodia. Dense and α-granules release their contents, including ADP, serotonin, and fibrinogen.',
      isCompleted: false,
      isActive: false,
      requiredClicks: 6,
      currentClicks: 0,
      position: { x: 380, y: 90 },
      color: 'bg-green-500',
      molecularTargets: ['P2Y12 receptor', 'Thromboxane A2', 'Phosphatidylserine', 'α-granules', 'Dense granules'],
      clinicalRelevance: 'Aspirin inhibits TXA2 synthesis, clopidogrel blocks P2Y12 - major targets for antiplatelet therapy.'
    },
    {
      id: 4,
      name: 'Platelet Aggregation',
      description: 'Platelet-to-platelet binding via fibrinogen bridges and activated GP IIb/IIIa',
      detailedInfo: 'Activated GP IIb/IIIa (integrin αIIbβ3) receptors bind fibrinogen, creating bridges between platelets. This creates the primary hemostatic plug through platelet-platelet interactions.',
      isCompleted: false,
      isActive: false,
      requiredClicks: 8,
      currentClicks: 0,
      position: { x: 280, y: 200 },
      color: 'bg-purple-500',
      molecularTargets: ['GP IIb/IIIa', 'Fibrinogen', 'Integrin αIIbβ3', 'ADP', 'Thrombin'],
      clinicalRelevance: 'GP IIb/IIIa antagonists (abciximab, eptifibatide) prevent this step in acute coronary syndromes.'
    },
    {
      id: 5,
      name: 'Plug Stabilization',
      description: 'Fibrin formation via coagulation cascade stabilizes and reinforces the platelet plug',
      detailedInfo: 'The coagulation cascade generates thrombin, which converts fibrinogen to fibrin. Factor XIIIa cross-links fibrin fibers, creating a stable mesh that reinforces the platelet plug.',
      isCompleted: false,
      isActive: false,
      requiredClicks: 4,
      currentClicks: 0,
      position: { x: 120, y: 220 },
      color: 'bg-orange-500',
      molecularTargets: ['Thrombin', 'Fibrinogen', 'Factor XIIIa', 'Fibrin polymer'],
      clinicalRelevance: 'Final common pathway of hemostasis - targeted by anticoagulants like warfarin and direct thrombin inhibitors.'
    }
  ]);

  const [bloodComponents, setBloodComponents] = useState<BloodComponent[]>([]);

  // Initialize blood flow simulation
  useEffect(() => {
    const initialComponents: BloodComponent[] = [];
    
    // Create platelets
    for (let i = 0; i < 15; i++) {
      initialComponents.push({
        id: `platelet_${i}`,
        name: 'Platelet',
        type: 'platelet',
        position: { x: Math.random() * 400, y: Math.random() * 300 + 50 },
        velocity: { x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2 },
        isActivated: false,
        size: 8
      });
    }
    
    // Create RBCs
    for (let i = 0; i < 10; i++) {
      initialComponents.push({
        id: `rbc_${i}`,
        name: 'Red Blood Cell',
        type: 'rbc',
        position: { x: Math.random() * 400, y: Math.random() * 300 + 50 },
        velocity: { x: (Math.random() - 0.5) * 3, y: (Math.random() - 0.5) * 3 },
        isActivated: false,
        size: 12
      });
    }
    
    setBloodComponents(initialComponents);
  }, []);

  // Animate blood flow
  useEffect(() => {
    if (!gameStarted) return;
    
    const animationFrame = setInterval(() => {
      setBloodComponents(prev => prev.map(component => ({
        ...component,
        position: {
          x: (component.position.x + component.velocity.x * (flowRate / 50)) % 450,
          y: component.position.y + (Math.sin(Date.now() * 0.001 + component.position.x * 0.01) * 0.5)
        }
      })));
    }, 50);
    
    return () => clearInterval(animationFrame);
  }, [gameStarted, flowRate]);

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
          const basePoints = 200;
          const complexityBonus = step.requiredClicks * 25;
          const totalPoints = basePoints + complexityBonus;
          
          setScore(prevScore => prevScore + totalPoints);
          
          // Update vessel damage and plug stability
          setVesselDamage(prev => Math.min(100, prev + 15));
          if (stepId >= 3) {
            setPlugStability(prev => Math.min(100, prev + 20));
          }
          
          // Activate platelets in simulation
          if (stepId === 3) {
            setBloodComponents(prev => prev.map(comp => 
              comp.type === 'platelet' ? { ...comp, isActivated: true, size: 12 } : comp
            ));
          }
          
          // Reduce flow rate as plug forms
          if (stepId >= 4) {
            setFlowRate(prev => Math.max(10, prev - 15));
          }
          
          if ((window as any).gameAudio) {
            (window as any).gameAudio.playSuccess();
          }
          
          toast({
            title: `🎯 ${step.name} Complete!`,
            description: `${step.description} +${totalPoints} points`,
            duration: 4000,
          });
          
          // Activate next step
          const nextStep = prev.find(s => s.id === stepId + 1);
          if (nextStep) {
            toast({
              title: "⚡ Next Phase Activated!",
              description: `${nextStep.name} is now active. Continue the hemostatic process!`,
              duration: 3000,
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

  const handleStepRightClick = (e: React.MouseEvent, step: PlateletStep) => {
    e.preventDefault();
    setSelectedStepInfo(step);
    setShowStepInfoDialog(true);
  };

  const checkCompletion = () => {
    const allCompleted = plateletSteps.every(step => step.isCompleted);
    if (allCompleted && !level3Complete) {
      setLevel3Complete(true);
      localStorage.setItem('level3Complete', 'true');
      const timeBonus = Math.max(0, 300 - timeElapsed) * 15;
      const stabilityBonus = plugStability * 5;
      const totalBonus = timeBonus + stabilityBonus;
      setScore(prev => prev + totalBonus);
      setShowCompletionDialog(true);
      toast({
        title: "🩸 Hemostasis Master!",
        description: `Perfect platelet plug formation! Bonus: +${totalBonus} points`,
        duration: 6000,
      });
    }
  };

  useEffect(() => {
    checkCompletion();
  }, [plateletSteps]);

  const startGame = () => {
    setGameStarted(true);
    toast({
      title: "🩸 Advanced Hemostasis Challenge!",
      description: "Master platelet plug formation with real-time blood flow simulation!",
      duration: 5000,
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
    setVesselDamage(0);
    setPlugStability(0);
    setFlowRate(50);
    setBloodComponents(prev => prev.map(comp => ({
      ...comp,
      isActivated: false,
      size: comp.type === 'platelet' ? 8 : 12
    })));
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
      <AudioSystem gameState="playing" level={3} />
      
      {/* Top Control Bar */}
      <div className="fixed top-28 left-4 right-4 z-40 flex justify-between items-center">
        <Button
          onClick={() => setShowExitDialog(true)}
          className="glassmorphic-card bg-red-600/80 hover:bg-red-700 backdrop-blur-sm border border-red-400/30"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Exit Game
        </Button>

        <div className="flex gap-3">
          <Button
            onClick={resetLevel}
            className="glassmorphic-card bg-cyan-600/80 hover:bg-cyan-700 backdrop-blur-sm border border-cyan-400/30"
            disabled={!gameStarted}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Challenge
          </Button>
        </div>
      </div>

      <div className="container mx-auto pt-36">
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
                  Level 3: Advanced Hemostasis & Platelet Function
                </h1>
                <p className="text-purple-200 text-base lg:text-lg">Master primary hemostasis with molecular-level precision</p>
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
            <GameHeader
              score={score}
              timeElapsed={timeElapsed}
              placedFactorsCount={completedSteps}
              totalFactorsCount={totalSteps}
              emergencyMode={false}
              patientStatus={plugStability}
              onExitGame={() => setShowExitDialog(true)}
            />

            {!gameStarted && (
              <Card className="bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 shadow-xl mt-4">
                <CardContent className="p-6 text-center">
                  <Button onClick={startGame} className="w-full bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700">
                    <Play className="h-4 w-4 mr-2" />
                    Start Advanced Hemostasis
                  </Button>
                </CardContent>
              </Card>
            )}

            {gameStarted && (
              <Button onClick={resetLevel} variant="outline" className="w-full border-white text-white hover:bg-white hover:text-purple-900 mt-4">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset Challenge
              </Button>
            )}

            {/* Hemodynamic Parameters */}
            {gameStarted && (
              <Card className="bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 shadow-xl mt-4">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-red-400" />
                    Hemodynamics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-white/5 p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-blue-300 font-semibold text-sm">Blood Flow Rate</span>
                      <span className="text-blue-200">{flowRate}%</span>
                    </div>
                    <Progress value={flowRate} className="h-2 bg-blue-900/30" />
                  </div>
                  
                  <div className="bg-white/5 p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-red-300 font-semibold text-sm">Vessel Damage</span>
                      <span className="text-red-200">{vesselDamage}%</span>
                    </div>
                    <Progress value={vesselDamage} className="h-2 bg-red-900/30" />
                  </div>
                  
                  <div className="bg-white/5 p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-green-300 font-semibold text-sm">Plug Stability</span>
                      <span className="text-green-200">{plugStability}%</span>
                    </div>
                    <Progress value={plugStability} className="h-2 bg-green-900/30" />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step Progress */}
            <Card className="bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 shadow-xl mt-4">
              <CardHeader>
                <CardTitle className="text-white text-lg">Hemostatic Steps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {plateletSteps.map(step => (
                  <div key={step.id} className="bg-white/5 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-semibold text-sm">{step.name}</span>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={step.isCompleted ? "default" : step.isActive ? "secondary" : "outline"}
                          className={`text-xs ${
                            step.isCompleted ? 'bg-green-600' : 
                            step.isActive ? 'bg-yellow-600' : 'bg-gray-600'
                          }`}
                        >
                          {step.isCompleted ? 'Complete' : step.isActive ? 'Active' : 'Waiting'}
                        </Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 text-blue-400 hover:text-blue-300"
                          onClick={() => {
                            setSelectedStepInfo(step);
                            setShowStepInfoDialog(true);
                          }}
                        >
                          <Microscope className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <Progress 
                      value={(step.currentClicks / step.requiredClicks) * 100} 
                      className="h-2" 
                    />
                    <p className="text-white/60 text-xs mt-1">
                      {step.currentClicks}/{step.requiredClicks} interactions
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
                  <Droplets className="h-6 w-6 mr-2 text-red-400" />
                  Real-Time Blood Vessel Cross-Section
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative bg-gradient-to-b from-pink-50 to-red-50 rounded-2xl p-8 min-h-[500px] overflow-hidden border-4 border-red-300">
                  {/* Vessel wall representation */}
                  <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-pink-200 to-pink-300 opacity-60"></div>
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-pink-200 to-pink-300 opacity-60"></div>
                  
                  {/* Injury site indicator */}
                  <div className="absolute left-8 top-16 w-32 h-8 bg-red-600/70 rounded animate-pulse border-2 border-red-800">
                    <div className="text-white text-xs font-bold text-center mt-1">INJURY SITE</div>
                  </div>
                  
                  {/* Blood flow animation */}
                  <div className="absolute inset-0 pointer-events-none">
                    {bloodComponents.map(component => (
                      <div
                        key={component.id}
                        className={`absolute rounded-full transition-all duration-100 ${
                          component.type === 'platelet' 
                            ? component.isActivated 
                              ? 'bg-yellow-400 shadow-yellow-400/50 shadow-lg animate-pulse' 
                              : 'bg-gray-400'
                            : component.type === 'rbc'
                            ? 'bg-red-500'
                            : 'bg-white'
                        }`}
                        style={{
                          left: component.position.x,
                          top: component.position.y,
                          width: component.size,
                          height: component.size,
                          zIndex: component.type === 'platelet' ? 20 : 10
                        }}
                        title={component.name}
                      />
                    ))}
                  </div>
                  
                  {/* Platelet steps - Interactive zones */}
                  {plateletSteps.map(step => (
                    <div
                      key={step.id}
                      className={`absolute w-20 h-20 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 transform ${
                        step.isActive ? 'hover:scale-110 animate-pulse shadow-2xl' : ''
                      } ${
                        step.isCompleted ? 'scale-110 shadow-2xl ring-4 ring-green-400 bg-gradient-to-br from-green-400 to-green-600' : 
                        step.isActive ? 'shadow-xl ring-4 ring-yellow-400 bg-gradient-to-br from-yellow-400 to-yellow-600' : 
                        'opacity-40 bg-gradient-to-br from-gray-400 to-gray-600'
                      }`}
                      style={{
                        left: step.position.x,
                        top: step.position.y
                      }}
                      onClick={() => handleStepClick(step.id)}
                      onContextMenu={(e) => handleStepRightClick(e, step)}
                      title={`${step.name} - Right-click for details`}
                    >
                      <div className="text-center text-white">
                        <div className="text-sm font-bold">{step.id}</div>
                        <div className="text-xs leading-tight">{step.name.split(' ')[0]}</div>
                        {step.isActive && (
                          <div className="text-xs">
                            {step.currentClicks}/{step.requiredClicks}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Plug formation visualization */}
                  {plugStability > 0 && (
                    <div 
                      className="absolute bg-gradient-to-r from-purple-600/80 to-blue-600/80 rounded-lg animate-pulse"
                      style={{
                        left: 40,
                        top: 180,
                        width: Math.min(plugStability * 2, 120),
                        height: Math.min(plugStability / 2, 40),
                        opacity: plugStability / 100
                      }}
                    >
                      <div className="text-white text-xs font-bold text-center mt-2">
                        STABLE PLUG
                      </div>
                    </div>
                  )}

                  {/* Educational overlay */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-4">
                    <h4 className="font-bold text-gray-800 mb-2 text-sm flex items-center">
                      <Microscope className="h-4 w-4 mr-2" />
                      Advanced Primary Hemostasis
                    </h4>
                    <p className="text-xs text-gray-700 mb-2">
                      Click active steps in sequence to simulate molecular-level platelet plug formation. 
                      Right-click steps for detailed molecular information.
                    </p>
                    <div className="flex gap-4 text-xs">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-gray-400 rounded-full mr-1"></div>
                        <span>Resting Platelets</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-yellow-400 rounded-full mr-1 animate-pulse"></div>
                        <span>Activated Platelets</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                        <span>Red Blood Cells</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Step Information Dialog */}
      <AlertDialog open={showStepInfoDialog} onOpenChange={setShowStepInfoDialog}>
        <AlertDialogContent className="max-w-4xl glass-card backdrop-blur-xl border border-purple-400/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-2xl font-bold text-purple-400 flex items-center justify-center">
              <Microscope className="h-6 w-6 mr-2" />
              {selectedStepInfo?.name} - Molecular Details
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-lg text-white">
              {selectedStepInfo?.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-6 space-y-4">
            <div className="glass-card bg-blue-50/10 p-4 rounded-lg border border-blue-400/30">
              <h4 className="font-bold text-blue-400 mb-2">Detailed Mechanism</h4>
              <p className="text-gray-300 text-sm">{selectedStepInfo?.detailedInfo}</p>
            </div>
            
            <div className="glass-card bg-green-50/10 p-4 rounded-lg border border-green-400/30">
              <h4 className="font-bold text-green-400 mb-2">Molecular Targets</h4>
              <div className="flex flex-wrap gap-2">
                {selectedStepInfo?.molecularTargets.map((target, index) => (
                  <Badge key={index} className="bg-green-600/20 text-green-300 border border-green-400/30">
                    {target}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="glass-card bg-red-50/10 p-4 rounded-lg border border-red-400/30">
              <h4 className="font-bold text-red-400 mb-2">Clinical Relevance</h4>
              <p className="text-gray-300 text-sm">{selectedStepInfo?.clinicalRelevance}</p>
            </div>
          </div>

          <AlertDialogFooter className="flex justify-center">
            <AlertDialogAction 
              onClick={() => setShowStepInfoDialog(false)}
              className="glass-card bg-purple-600/80 hover:bg-purple-700 backdrop-blur-sm border border-purple-400/30"
            >
              <Microscope className="h-4 w-4 mr-2" />
              Continue Analysis
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Completion Dialog */}
      <AlertDialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <AlertDialogContent className="max-w-2xl glass-card backdrop-blur-xl border border-emerald-400/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              🩸 Hemostasis Mastery Achieved! 🩸
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-lg text-white">
              Outstanding! You've achieved molecular-level mastery of primary hemostasis and platelet function!
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="glass-card bg-yellow-50/10 p-4 rounded-lg border border-yellow-400/30">
                <div className="text-2xl font-bold text-yellow-400">{score}</div>
                <div className="text-sm text-gray-300">Master Score</div>
              </div>
              <div className="glass-card bg-blue-50/10 p-4 rounded-lg border border-blue-400/30">
                <div className="text-2xl font-bold text-blue-400">{formatTime(timeElapsed)}</div>
                <div className="text-sm text-gray-300">Completion Time</div>
              </div>
              <div className="glass-card bg-purple-50/10 p-4 rounded-lg border border-purple-400/30">
                <div className="text-2xl font-bold text-purple-400">EXPERT</div>
                <div className="text-sm text-gray-300">Hemostasis Status</div>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <Badge className="bg-gradient-to-r from-emerald-400 to-blue-400 text-white px-4 py-2 text-lg">
                🏆 Hemostasis & Thrombosis Specialist
              </Badge>
            </div>
          </div>

          <AlertDialogFooter className="flex justify-center space-x-4">
            <AlertDialogAction 
              onClick={resetLevel}
              className="glass-card bg-purple-600/80 hover:bg-purple-700"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Master Again
            </AlertDialogAction>
            <AlertDialogAction 
              onClick={() => navigate('/level4')}
              className="glass-card bg-green-600/80 hover:bg-green-700"
            >
              <Award className="h-4 w-4 mr-2" />
              Expert Challenges
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
        <AlertDialogContent className="glass-card bg-gradient-to-br from-slate-900/95 via-red-900/95 to-slate-900/95 border border-red-400/30 backdrop-blur-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-2xl font-bold text-red-400">
              Exit Advanced Challenge?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-lg text-gray-300">
              Your hemostasis analysis progress will be lost. Are you sure you want to exit?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-center space-x-4">
            <AlertDialogCancel className="glass-card border-white/20 text-white hover:bg-white/10">
              Continue Analysis
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => navigate('/')}
              className="bg-red-600 hover:bg-red-700"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Exit Challenge
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Level3;
