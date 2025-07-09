import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Play, 
  RotateCcw, 
  Target,
  Clock,
  Award,
  AlertTriangle,
  Heart,
  Activity,
  Brain,
  Droplets,
  Zap,
  LogOut,
  ArrowRight,
  Lightbulb
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import GameCascadeArea from '@/components/GameCascadeArea';
import GameHeader from '@/components/GameHeader';
import MedicalInfoPopup from '@/components/MedicalInfoPopup';
import { level2Factors as initialFactors } from '@/data/cascadeFactors';
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

interface ClinicalScenario {
  id: string;
  title: string;
  description: string;
  patientInfo: string;
  symptoms: string[];
  labValues: { [key: string]: string };
  emergencyLevel: 'mild' | 'moderate' | 'severe' | 'critical';
  timeLimit: number; // in seconds
  requiredFactors: string[];
  complications: string[];
}

const clinicalScenarios: ClinicalScenario[] = [
  {
    id: 'hemophilia_a',
    title: 'Hemophilia A Emergency',
    description: 'Patient with severe hemophilia A presenting with spontaneous bleeding',
    patientInfo: '8-year-old male with known severe hemophilia A',
    symptoms: ['Joint swelling', 'Internal bleeding', 'Prolonged bleeding time'],
    labValues: {
      'Factor VIII': '<1%',
      'aPTT': '120 sec (prolonged)',
      'PT': '12 sec (normal)',
      'Platelet count': '250,000/μL (normal)'
    },
    emergencyLevel: 'critical',
    timeLimit: 180,
    requiredFactors: ['factor8', 'factor9', 'factor10'],
    complications: ['Joint damage', 'Compartment syndrome', 'Hypovolemic shock']
  },
  {
    id: 'liver_disease',
    title: 'Liver Disease Coagulopathy',
    description: 'Cirrhotic patient with bleeding complications pre-surgery',
    patientInfo: '55-year-old with end-stage liver cirrhosis',
    symptoms: ['Easy bruising', 'Prolonged bleeding', 'Ascites'],
    labValues: {
      'PT/INR': '22 sec / 2.8',
      'aPTT': '45 sec',
      'Factor VII': '25%',
      'Albumin': '2.1 g/dL'
    },
    emergencyLevel: 'severe',
    timeLimit: 240,
    requiredFactors: ['factor7', 'factor2', 'factor10', 'factor5'],
    complications: ['Surgical bleeding', 'GI hemorrhage', 'Intracranial bleeding']
  },
  {
    id: 'dic',
    title: 'Disseminated Intravascular Coagulation',
    description: 'Septic patient developing DIC with consumption coagulopathy',
    patientInfo: '45-year-old with severe sepsis and DIC',
    symptoms: ['Bleeding', 'Thrombosis', 'Organ dysfunction'],
    labValues: {
      'D-dimer': '>4000 ng/mL',
      'Fibrinogen': '80 mg/dL',
      'Platelet count': '45,000/μL',
      'Schistocytes': 'Present'
    },
    emergencyLevel: 'critical',
    timeLimit: 120,
    requiredFactors: ['fibrinogen', 'factor13', 'factor5', 'factor2'],
    complications: ['Multi-organ failure', 'Hemorrhage', 'Thrombotic events']
  }
];

const Level2 = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [factors, setFactors] = useState<Factor[]>(initialFactors);
  const [selectedFactor, setSelectedFactor] = useState<Factor | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [level2Complete, setLevel2Complete] = useState(false);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [showMedicalInfo, setShowMedicalInfo] = useState(false);
  const [medicalInfoFactor, setMedicalInfoFactor] = useState<Factor | null>(null);
  
  // Level 2 specific states
  const [currentScenario, setCurrentScenario] = useState<ClinicalScenario>(clinicalScenarios[0]);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [patientStatus, setPatientStatus] = useState(100);
  const [scenarioTimeLeft, setScenarioTimeLeft] = useState(clinicalScenarios[0].timeLimit);
  const [correctPlacements, setCorrectPlacements] = useState(0);
  const [showScenarioDialog, setShowScenarioDialog] = useState(false);

  // Load completion status
  useEffect(() => {
    const completionStatus = localStorage.getItem('level2Complete');
    if (completionStatus === 'true') {
      setLevel2Complete(true);
    }
  }, []);

  // Game timer
  useEffect(() => {
    if (gameStarted) {
      const timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameStarted]);

  // Scenario timer and patient status
  useEffect(() => {
    if (emergencyMode && scenarioTimeLeft > 0) {
      const timer = setInterval(() => {
        setScenarioTimeLeft(prev => {
          const newTime = prev - 1;
          // Patient status deteriorates over time
          const statusDecrease = currentScenario.emergencyLevel === 'critical' ? 0.5 : 0.2;
          setPatientStatus(prevStatus => Math.max(0, prevStatus - statusDecrease));
          
          if (newTime <= 0) {
            handleScenarioTimeout();
          }
          return newTime;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [emergencyMode, scenarioTimeLeft, currentScenario]);

  const handleScenarioTimeout = () => {
    setEmergencyMode(false);
    toast({
      title: "⏰ Time's Up!",
      description: `Patient condition deteriorated. Starting next scenario...`,
      variant: "destructive",
      duration: 4000,
    });
    nextScenario();
  };

  const startGame = () => {
    setGameStarted(true);
    setShowScenarioDialog(true);
    toast({
      title: "🏥 Clinical Challenge Mode!",
      description: "Manage real-world coagulation disorders under time pressure!",
      duration: 5000,
    });
  };

  const startScenario = () => {
    setEmergencyMode(true);
    setScenarioTimeLeft(currentScenario.timeLimit);
    setPatientStatus(100);
    setShowScenarioDialog(false);
    
    if ((window as any).gameAudio) {
      (window as any).gameAudio.playEmergency();
    }

    toast({
      title: `🚨 ${currentScenario.title}`,
      description: `Emergency activated! Save the patient in ${currentScenario.timeLimit} seconds!`,
      duration: 6000,
    });
  };

  const nextScenario = () => {
    if (scenarioIndex < clinicalScenarios.length - 1) {
      const nextIndex = scenarioIndex + 1;
      setScenarioIndex(nextIndex);
      setCurrentScenario(clinicalScenarios[nextIndex]);
      setFactors(initialFactors.map(factor => ({ ...factor, isPlaced: false, position: null })));
      setSelectedFactor(null);
      setCorrectPlacements(0);
      setTimeout(() => setShowScenarioDialog(true), 1000);
    } else {
      // All scenarios completed
      setLevel2Complete(true);
      localStorage.setItem('level2Complete', 'true');
      setShowCompletionDialog(true);
    }
  };

  const handleFactorClick = (factor: Factor) => {
    if (!gameStarted || factor.isPlaced) return;
    
    if ((window as any).gameAudio) {
      (window as any).gameAudio.playClick();
    }
    
    if (selectedFactor?.id === factor.id) {
      setSelectedFactor(null);
      return;
    }
    
    setSelectedFactor(factor);
    toast({
      title: `🎯 ${factor.name} Selected`,
      description: `Click target position • Priority: ${currentScenario.requiredFactors.includes(factor.id) ? 'HIGH' : 'Normal'}`,
      duration: 3000,
    });
  };

  const handleCorrectPlacement = (factor: Factor) => {
    const updatedFactors = factors.map(f =>
      f.id === factor.id
        ? { ...f, isPlaced: true, position: f.correctPosition }
        : f
    );
    
    setFactors(updatedFactors);
    setSelectedFactor(null);
    
    // Bonus points for required factors
    const basePoints = 150;
    const bonusPoints = currentScenario.requiredFactors.includes(factor.id) ? 100 : 0;
    const emergencyBonus = emergencyMode ? 50 : 0;
    const totalPoints = basePoints + bonusPoints + emergencyBonus;
    
    setScore(prevScore => prevScore + totalPoints);
    setCorrectPlacements(prev => prev + 1);
    
    // Improve patient status for critical factors
    if (currentScenario.requiredFactors.includes(factor.id)) {
      setPatientStatus(prevStatus => Math.min(100, prevStatus + 15));
    }
    
    if ((window as any).gameAudio) {
      (window as any).gameAudio.playSuccess();
    }
    
    setMedicalInfoFactor(factor);
    setShowMedicalInfo(true);
    
    toast({
      title: "🎯 Perfect Placement!",
      description: `${factor.name} placed! +${totalPoints} points ${bonusPoints > 0 ? '(Priority factor!)' : ''}`,
      duration: 4000,
    });

    // Check scenario completion
    const requiredCompleted = currentScenario.requiredFactors.filter(reqId => 
      updatedFactors.find(f => f.id === reqId)?.isPlaced
    ).length;
    
    if (requiredCompleted === currentScenario.requiredFactors.length) {
      setEmergencyMode(false);
      const timeBonus = scenarioTimeLeft * 10;
      setScore(prevScore => prevScore + timeBonus);
      
      toast({
        title: "🏥 Patient Stabilized!",
        description: `Scenario completed! Time bonus: +${timeBonus} points`,
        duration: 5000,
      });
      
      setTimeout(() => nextScenario(), 2000);
    }
  };

  const handleIncorrectPlacement = (factor: Factor) => {
    if ((window as any).gameAudio) {
      (window as any).gameAudio.playError();
    }

    // Penalty for wrong placement in emergency
    if (emergencyMode) {
      setPatientStatus(prevStatus => Math.max(0, prevStatus - 10));
    }

    toast({
      title: "❌ Incorrect Placement",
      description: `${factor.name} doesn't belong there! ${emergencyMode ? 'Patient condition worsening!' : ''}`,
      variant: "destructive",
      duration: 4000,
    });
  };

  const handleDragStart = (e: React.DragEvent, factor: Factor) => {
    if (!gameStarted || factor.isPlaced) {
      e.preventDefault();
      return;
    }
    
    setSelectedFactor(factor);
    e.dataTransfer.setData('text/plain', factor.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const factorId = e.dataTransfer?.getData('text/plain');
    if (!factorId) return;
    
    const draggedFactor = factors.find(f => f.id === factorId);
    const dropZone = e.currentTarget as HTMLElement;
    const targetFactorId = dropZone.getAttribute('data-factor-id');
    
    if (!draggedFactor || !targetFactorId) return;
    
    if (draggedFactor.id === targetFactorId) {
      handleCorrectPlacement(draggedFactor);
    } else {
      handleIncorrectPlacement(draggedFactor);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropZoneClick = (targetFactor: Factor) => {
    if (!gameStarted || !selectedFactor || targetFactor.isPlaced) return;

    if (selectedFactor.id === targetFactor.id) {
      handleCorrectPlacement(selectedFactor);
    } else {
      handleIncorrectPlacement(selectedFactor);
    }
  };

  const resetLevel = () => {
    setFactors(initialFactors.map(factor => ({ ...factor, isPlaced: false, position: null })));
    setSelectedFactor(null);
    setScore(0);
    setTimeElapsed(0);
    setScenarioIndex(0);
    setCurrentScenario(clinicalScenarios[0]);
    setEmergencyMode(false);
    setPatientStatus(100);
    setCorrectPlacements(0);
    setShowCompletionDialog(false);
    setGameStarted(true);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-purple-900 to-slate-900 p-4 pb-32 relative overflow-hidden">
      {/* Enhanced particles for emergency mode */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(emergencyMode ? 100 : 50)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full ${
              emergencyMode ? 'animate-bounce' : 'animate-pulse'
            } ${
              i % 4 === 0 ? 'w-3 h-3 bg-red-400/40' :
              i % 4 === 1 ? 'w-2 h-2 bg-orange-400/30' :
              i % 4 === 2 ? 'w-4 h-4 bg-yellow-400/20' :
              'w-2.5 h-2.5 bg-white/20'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${emergencyMode ? 1 + Math.random() * 2 : 2 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <AudioSystem gameState={emergencyMode ? "emergency" : "playing"} level={2} />
      
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
            onClick={() => setShowHints(!showHints)}
            className="glassmorphic-card bg-purple-600/80 hover:bg-purple-700 backdrop-blur-sm border border-purple-400/30"
            disabled={!gameStarted}
          >
            <Lightbulb className="h-4 w-4 mr-2" />
            {showHints ? 'Hide Hints' : 'Show Hints'}
          </Button>
          
          <Button
            onClick={resetLevel}
            className="glassmorphic-card bg-cyan-600/80 hover:bg-cyan-700 backdrop-blur-sm border border-cyan-400/30"
            disabled={!gameStarted}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Level
          </Button>
        </div>
      </div>

      <div className="container mx-auto relative z-10 pt-36">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center mb-4 text-blue-300 hover:text-blue-100">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <div className="flex gap-6">
          {/* Left Panel */}
          <div className="w-64">
            <GameHeader
              score={score}
              timeElapsed={timeElapsed}
              placedFactorsCount={factors.filter(factor => factor.isPlaced).length}
              totalFactorsCount={factors.length}
              emergencyMode={emergencyMode}
              patientStatus={patientStatus}
              onExitGame={() => setShowExitDialog(true)}
            />

            {/* Clinical Scenario Panel */}
            {gameStarted && (
              <Card className="mt-4 glassmorphic-card bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl">
                <CardContent className="p-4">
                  <h4 className="text-white font-bold mb-3 flex items-center">
                    <Activity className="h-4 w-4 mr-2 text-red-400" />
                    Clinical Scenario
                  </h4>
                  <div className="text-sm text-gray-300 space-y-2">
                    <div className="bg-red-500/20 p-2 rounded border border-red-400/30">
                      <p className="font-bold text-red-300">{currentScenario.title}</p>
                      <p className="text-xs text-red-200">{currentScenario.patientInfo}</p>
                    </div>
                    
                    {emergencyMode && (
                      <div className="bg-yellow-500/20 p-2 rounded border border-yellow-400/30">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-yellow-300 font-bold">Time Left:</span>
                          <span className="text-yellow-200">{formatTime(scenarioTimeLeft)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-green-300 font-bold">Patient Status:</span>
                          <span className={`${patientStatus > 70 ? 'text-green-200' : patientStatus > 30 ? 'text-yellow-200' : 'text-red-200'}`}>
                            {patientStatus.toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div className="text-xs">
                      <p className="text-gray-400">Priority Factors:</p>
                      <p className="text-purple-300">{currentScenario.requiredFactors.join(', ')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {!gameStarted && (
              <Card className="mt-4 glassmorphic-card bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl">
                <CardContent className="p-6 text-center">
                  <Button 
                    onClick={startGame}
                    className="w-full bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Clinical Challenge
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Game Area */}
          <div className="flex-1">
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

      {/* Scenario Introduction Dialog */}
      <AlertDialog open={showScenarioDialog} onOpenChange={setShowScenarioDialog}>
        <AlertDialogContent className="max-w-4xl glass-card backdrop-blur-xl border border-red-400/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-2xl font-bold text-red-400 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 mr-2" />
              {currentScenario.title}
            </AlertDialogTitle>
          </AlertDialogHeader>
          
          <div className="py-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-card bg-blue-50/10 p-4 rounded-lg border border-blue-400/30">
                <h4 className="font-bold text-blue-400 mb-2">Patient Information</h4>
                <p className="text-gray-300">{currentScenario.patientInfo}</p>
                <p className="text-sm text-gray-400 mt-2">{currentScenario.description}</p>
              </div>
              
              <div className="glass-card bg-red-50/10 p-4 rounded-lg border border-red-400/30">
                <h4 className="font-bold text-red-400 mb-2">Symptoms</h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  {currentScenario.symptoms.map((symptom, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                      {symptom}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="glass-card bg-yellow-50/10 p-4 rounded-lg border border-yellow-400/30">
              <h4 className="font-bold text-yellow-400 mb-2">Laboratory Values</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {Object.entries(currentScenario.labValues).map(([test, value]) => (
                  <div key={test} className="flex justify-between">
                    <span className="text-gray-300">{test}:</span>
                    <span className="text-yellow-200 font-mono">{value}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="glass-card bg-purple-50/10 p-4 rounded-lg border border-purple-400/30">
              <h4 className="font-bold text-purple-400 mb-2">Mission Objectives</h4>
              <p className="text-gray-300 text-sm mb-2">
                Emergency Level: <Badge className={`ml-2 ${
                  currentScenario.emergencyLevel === 'critical' ? 'bg-red-600' :
                  currentScenario.emergencyLevel === 'severe' ? 'bg-orange-600' :
                  currentScenario.emergencyLevel === 'moderate' ? 'bg-yellow-600' : 'bg-blue-600'
                }`}>
                  {currentScenario.emergencyLevel.toUpperCase()}
                </Badge>
              </p>
              <p className="text-gray-300 text-sm">
                Time Limit: <span className="text-red-300 font-bold">{currentScenario.timeLimit} seconds</span>
              </p>
              <p className="text-gray-300 text-sm mt-2">
                Priority Factors: <span className="text-purple-300">{currentScenario.requiredFactors.join(', ')}</span>
              </p>
            </div>
          </div>

          <AlertDialogFooter className="flex justify-center space-x-4">
            <AlertDialogAction 
              onClick={startScenario}
              className="glass-card bg-red-600/80 hover:bg-red-700 backdrop-blur-sm border border-red-400/30"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Start Emergency Treatment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <AlertDialogContent className="max-w-2xl glass-card backdrop-blur-xl border border-emerald-400/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              🏥 Clinical Mastery Achieved! 🏥
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-lg text-white">
              Outstanding! You've successfully managed all clinical coagulation scenarios!
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="glass-card bg-blue-50/10 p-4 rounded-lg border border-blue-400/30">
                <div className="text-2xl font-bold text-blue-400">{score}</div>
                <div className="text-sm text-gray-300">Clinical Score</div>
              </div>
              <div className="glass-card bg-green-50/10 p-4 rounded-lg border border-green-400/30">
                <div className="text-2xl font-bold text-green-400">{formatTime(timeElapsed)}</div>
                <div className="text-sm text-gray-300">Total Time</div>
              </div>
              <div className="glass-card bg-purple-50/10 p-4 rounded-lg border border-purple-400/30">
                <div className="text-2xl font-bold text-purple-400">EXPERT</div>
                <div className="text-sm text-gray-300">Clinical Status</div>
              </div>
            </div>
          </div>

          <AlertDialogFooter className="flex justify-center space-x-4">
            <AlertDialogAction 
              onClick={resetLevel}
              className="glass-card bg-blue-600/80 hover:bg-blue-700"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Replay Scenarios
            </AlertDialogAction>
            <AlertDialogAction 
              onClick={() => navigate('/level3')}
              className="glass-card bg-green-600/80 hover:bg-green-700"
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              Advanced Hemostasis
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
              Exit Clinical Challenge?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-lg text-gray-300">
              Patient care is ongoing. Are you sure you want to exit?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-center space-x-4">
            <AlertDialogCancel className="glass-card border-white/20 text-white hover:bg-white/10">
              Continue Treatment
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

export default Level2;
