
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
  Lightbulb,
  Microscope,
  FileText,
  CheckCircle,
  XCircle,
  Lock
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import AudioSystem from '@/components/AudioSystem';
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

interface LabTest {
  name: string;
  value: string;
  normalRange: string;
  isAbnormal: boolean;
}

interface DiagnosticCase {
  id: string;
  patientInfo: string;
  clinicalPresentation: string;
  labTests: LabTest[];
  correctDiagnosis: string;
  possibleDiagnoses: string[];
  explanation: string;
  timeLimit: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

const diagnosticCases: DiagnosticCase[] = [
  {
    id: 'hemophilia_a',
    patientInfo: '12-year-old male with family history of bleeding disorders',
    clinicalPresentation: 'Prolonged bleeding after dental extraction, easy bruising, joint swelling',
    labTests: [
      { name: 'PT (Prothrombin Time)', value: '12 sec', normalRange: '11-13 sec', isAbnormal: false },
      { name: 'aPTT (Activated PTT)', value: '85 sec', normalRange: '25-35 sec', isAbnormal: true },
      { name: 'Factor VIII Activity', value: '2%', normalRange: '50-150%', isAbnormal: true },
      { name: 'Factor IX Activity', value: '95%', normalRange: '50-150%', isAbnormal: false },
      { name: 'Platelet Count', value: '280,000/μL', normalRange: '150,000-450,000/μL', isAbnormal: false }
    ],
    correctDiagnosis: 'Hemophilia A (Factor VIII Deficiency)',
    possibleDiagnoses: [
      'Hemophilia A (Factor VIII Deficiency)',
      'Hemophilia B (Factor IX Deficiency)', 
      'Von Willebrand Disease',
      'Acquired Factor VIII Inhibitor'
    ],
    explanation: 'Prolonged aPTT with normal PT suggests intrinsic pathway defect. Low Factor VIII with normal Factor IX confirms Hemophilia A.',
    timeLimit: 120,
    difficulty: 'easy'
  },
  {
    id: 'liver_disease',
    patientInfo: '58-year-old female with chronic alcohol use',
    clinicalPresentation: 'Easy bruising, prolonged bleeding, ascites, spider angiomata',
    labTests: [
      { name: 'PT (Prothrombin Time)', value: '22 sec', normalRange: '11-13 sec', isAbnormal: true },
      { name: 'INR', value: '2.8', normalRange: '0.8-1.2', isAbnormal: true },
      { name: 'aPTT', value: '45 sec', normalRange: '25-35 sec', isAbnormal: true },
      { name: 'Factor VII', value: '25%', normalRange: '50-150%', isAbnormal: true },
      { name: 'Factor V', value: '30%', normalRange: '50-150%', isAbnormal: true },
      { name: 'Albumin', value: '2.1 g/dL', normalRange: '3.5-5.0 g/dL', isAbnormal: true }
    ],
    correctDiagnosis: 'Chronic Liver Disease Coagulopathy',
    possibleDiagnoses: [
      'Chronic Liver Disease Coagulopathy',
      'Vitamin K Deficiency',
      'Warfarin Overdose',
      'Disseminated Intravascular Coagulation'
    ],
    explanation: 'Both PT and aPTT prolonged with decreased synthetic factors (VII, V) and albumin indicate hepatic dysfunction.',
    timeLimit: 150,
    difficulty: 'medium'
  },
  {
    id: 'dic',
    patientInfo: '45-year-old male in ICU with sepsis',
    clinicalPresentation: 'Bleeding from IV sites, petechiae, altered mental status, oliguria',
    labTests: [
      { name: 'PT', value: '28 sec', normalRange: '11-13 sec', isAbnormal: true },
      { name: 'aPTT', value: '65 sec', normalRange: '25-35 sec', isAbnormal: true },
      { name: 'D-dimer', value: '>4000 ng/mL', normalRange: '<500 ng/mL', isAbnormal: true },
      { name: 'Fibrinogen', value: '80 mg/dL', normalRange: '200-400 mg/dL', isAbnormal: true },
      { name: 'Platelet Count', value: '45,000/μL', normalRange: '150,000-450,000/μL', isAbnormal: true },
      { name: 'Schistocytes', value: 'Present', normalRange: 'Absent', isAbnormal: true }
    ],
    correctDiagnosis: 'Disseminated Intravascular Coagulation (DIC)',
    possibleDiagnoses: [
      'Disseminated Intravascular Coagulation (DIC)',
      'Thrombotic Thrombocytopenic Purpura',
      'Hemolytic Uremic Syndrome',
      'Acute Liver Failure'
    ],
    explanation: 'Consumption coagulopathy with elevated D-dimer, low fibrinogen, thrombocytopenia, and schistocytes in septic patient indicates DIC.',
    timeLimit: 180,
    difficulty: 'hard'
  },
  {
    id: 'vwd',
    patientInfo: '16-year-old female with heavy menstrual bleeding',
    clinicalPresentation: 'Menorrhagia, prolonged bleeding after surgery, family history of bleeding',
    labTests: [
      { name: 'PT', value: '12 sec', normalRange: '11-13 sec', isAbnormal: false },
      { name: 'aPTT', value: '42 sec', normalRange: '25-35 sec', isAbnormal: true },
      { name: 'vWF Antigen', value: '35%', normalRange: '50-200%', isAbnormal: true },
      { name: 'vWF Activity', value: '25%', normalRange: '50-200%', isAbnormal: true },
      { name: 'Factor VIII', value: '40%', normalRange: '50-150%', isAbnormal: true },
      { name: 'Platelet Count', value: '320,000/μL', normalRange: '150,000-450,000/μL', isAbnormal: false }
    ],
    correctDiagnosis: 'Von Willebrand Disease Type 1',
    possibleDiagnoses: [
      'Von Willebrand Disease Type 1',
      'Von Willebrand Disease Type 2',
      'Mild Hemophilia A',
      'Platelet Function Disorder'
    ],
    explanation: 'Reduced vWF antigen and activity with mildly prolonged aPTT and decreased Factor VIII suggests Type 1 vWD.',
    timeLimit: 135,
    difficulty: 'medium'
  }
];

const Level2 = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [level2Complete, setLevel2Complete] = useState(false);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showNextLevelDialog, setShowNextLevelDialog] = useState(false);
  
  // Diagnostic specific states
  const [currentCaseIndex, setCurrentCaseIndex] = useState(0);
  const [currentCase, setCurrentCase] = useState<DiagnosticCase>(diagnosticCases[0]);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<string>('');
  const [caseTimeLeft, setCaseTimeLeft] = useState(diagnosticCases[0].timeLimit);
  const [correctDiagnoses, setCorrectDiagnoses] = useState(0);
  const [showCaseDialog, setShowCaseDialog] = useState(false);
  const [caseComplete, setCaseComplete] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  // Load completion status
  useEffect(() => {
    const completionStatus = localStorage.getItem('level2Complete');
    if (completionStatus === 'true') {
      setLevel2Complete(true);
    }
  }, []);

  // Game timer
  useEffect(() => {
    if (gameStarted && !caseComplete) {
      const timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameStarted, caseComplete]);

  // Case timer
  useEffect(() => {
    if (gameStarted && caseTimeLeft > 0 && !caseComplete) {
      const timer = setInterval(() => {
        setCaseTimeLeft(prev => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            handleTimeUp();
          }
          return newTime;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameStarted, caseTimeLeft, caseComplete]);

  const startGame = () => {
    setGameStarted(true);
    setShowCaseDialog(true);
    toast({
      title: "🔬 Diagnostic Detective Activated!",
      description: "Analyze lab values to diagnose coagulation disorders!",
      duration: 5000,
    });
  };

  const startCase = () => {
    setCaseTimeLeft(currentCase.timeLimit);
    setCaseComplete(false);
    setSelectedDiagnosis('');
    setShowCaseDialog(false);
    setShowExplanation(false);
    
    toast({
      title: `🏥 Case ${currentCaseIndex + 1}`,
      description: `Analyze the lab results! Time limit: ${currentCase.timeLimit} seconds`,
      duration: 4000,
    });
  };

  const handleTimeUp = () => {
    setCaseComplete(true);
    toast({
      title: "⏰ Time's Up!",
      description: "Moving to explanation...",
      variant: "destructive",
      duration: 3000,
    });
    setTimeout(() => setShowExplanation(true), 1500);
  };

  const handleDiagnosisSubmit = () => {
    if (!selectedDiagnosis) {
      toast({
        title: "⚠️ No Diagnosis Selected",
        description: "Please select a diagnosis before submitting!",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    setCaseComplete(true);
    const isCorrect = selectedDiagnosis === currentCase.correctDiagnosis;
    
    if (isCorrect) {
      const timeBonus = Math.max(0, caseTimeLeft * 5);
      const difficultyBonus = currentCase.difficulty === 'hard' ? 200 : currentCase.difficulty === 'medium' ? 100 : 50;
      const totalPoints = 300 + timeBonus + difficultyBonus;
      
      setScore(prevScore => prevScore + totalPoints);
      setCorrectDiagnoses(prev => prev + 1);
      
      if ((window as any).gameAudio) {
        (window as any).gameAudio.playSuccess();
      }
      
      toast({
        title: "🎯 Correct Diagnosis!",
        description: `Excellent detective work! +${totalPoints} points`,
        duration: 4000,
      });
    } else {
      if ((window as any).gameAudio) {
        (window as any).gameAudio.playError();
      }
      
      toast({
        title: "❌ Incorrect Diagnosis",
        description: "Review the explanation to understand the correct diagnosis.",
        variant: "destructive",
        duration: 4000,
      });
    }
    
    setTimeout(() => setShowExplanation(true), 2000);
  };

  const nextCase = () => {
    if (currentCaseIndex < diagnosticCases.length - 1) {
      const nextIndex = currentCaseIndex + 1;
      setCurrentCaseIndex(nextIndex);
      setCurrentCase(diagnosticCases[nextIndex]);
      setShowExplanation(false);
      setTimeout(() => setShowCaseDialog(true), 1000);
    } else {
      // All cases completed
      setLevel2Complete(true);
      localStorage.setItem('level2Complete', 'true');
      setShowCompletionDialog(true);
    }
  };

  const resetLevel = () => {
    setScore(0);
    setTimeElapsed(0);
    setCurrentCaseIndex(0);
    setCurrentCase(diagnosticCases[0]);
    setCorrectDiagnoses(0);
    setShowCompletionDialog(false);
    setGameStarted(true);
    startCase();
  };

  const handleNextLevelClick = () => {
    if (!level2Complete) {
      setShowNextLevelDialog(true);
    } else {
      navigate('/level3');
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 dark:from-blue-900 dark:via-indigo-900 dark:to-slate-900 light:from-blue-100 light:via-indigo-100 light:to-slate-100 p-4 pb-32 relative overflow-hidden">
      {/* Floating particles animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full animate-pulse ${
              i % 4 === 0 ? 'w-3 h-3 bg-blue-400/30 dark:bg-blue-400/30 light:bg-blue-600/40' :
              i % 4 === 1 ? 'w-2 h-2 bg-indigo-400/25 dark:bg-indigo-400/25 light:bg-indigo-600/35' :
              i % 4 === 2 ? 'w-4 h-4 bg-purple-400/20 dark:bg-purple-400/20 light:bg-purple-600/30' :
              'w-2.5 h-2.5 bg-cyan-400/25 dark:bg-cyan-400/25 light:bg-cyan-600/35'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <AudioSystem gameState="playing" level={2} />
      
      {/* Top Control Bar */}
      <div className="fixed top-28 left-4 right-4 z-40 flex justify-between items-center">
        <div className="flex gap-3 items-center">
          <Button
            onClick={() => setShowExitDialog(true)}
            className="glassmorphic-card bg-red-600/80 hover:bg-red-700 backdrop-blur-sm border border-red-400/30 transform hover:scale-105 transition-all duration-200 shadow-xl"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Exit Game
          </Button>
          <ThemeToggle />
        </div>

        <div className="flex gap-3">
          <Button
            onClick={resetLevel}
            className="glassmorphic-card bg-cyan-600/80 hover:bg-cyan-700 backdrop-blur-sm border border-cyan-400/30 transform hover:scale-105 transition-all duration-200 shadow-xl"
            disabled={!gameStarted}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Level
          </Button>

          <Button
            onClick={handleNextLevelClick}
            className={`glassmorphic-card backdrop-blur-sm border transform hover:scale-105 transition-all duration-200 shadow-xl ${
              level2Complete 
                ? 'bg-green-600/80 hover:bg-green-700 border-green-400/30' 
                : 'bg-gray-600/80 hover:bg-gray-700 border-gray-400/30'
            }`}
          >
            {level2Complete ? (
              <>
                <ArrowRight className="h-4 w-4 mr-2" />
                Level 3: Pathology Professor
              </>
            ) : (
              <>
                <Lock className="h-4 w-4 mr-2" />
                Level 3: Pathology Professor
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="container mx-auto relative z-10 pt-36">
        <div className="mb-6 animate-in slide-in-from-top-4 duration-1000">
          <Link to="/" className="inline-flex items-center mb-4 text-blue-300 hover:text-blue-100 dark:text-blue-300 dark:hover:text-blue-100 light:text-blue-700 light:hover:text-blue-900 transform hover:scale-105 transition-all duration-200 glassmorphic-card px-4 py-2 rounded-xl border border-blue-400/30 backdrop-blur-sm shadow-xl">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
            <Microscope className="ml-2 h-4 w-4 animate-pulse" />
          </Link>
        </div>

        <div className="flex gap-6">
          {/* Left Panel */}
          <div className="w-80">
            {!gameStarted && (
              <Card className="glassmorphic-card bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl dark:bg-white/5 light:bg-black/5 dark:border-white/10 light:border-black/10 mb-4">
                <CardContent className="p-6 text-center">
                  <div className="mb-4">
                    <Microscope className="h-12 w-12 mx-auto mb-3 text-blue-400 animate-pulse" />
                    <h3 className="text-xl font-bold text-white dark:text-white light:text-black mb-2">
                      Diagnostic Detective
                    </h3>
                    <p className="text-gray-300 dark:text-gray-300 light:text-gray-700 text-sm">
                      Analyze laboratory values to diagnose coagulation disorders
                    </p>
                  </div>
                  <Button 
                    onClick={startGame}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Detective Work
                  </Button>
                </CardContent>
              </Card>
            )}

            {gameStarted && (
              <Card className="glassmorphic-card bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl dark:bg-white/5 light:bg-black/5 dark:border-white/10 light:border-black/10 mb-4">
                <CardContent className="p-4">
                  <h4 className="text-white dark:text-white light:text-black font-bold mb-3 flex items-center">
                    <Target className="h-4 w-4 mr-2 text-yellow-400" />
                    Progress
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm text-gray-300 dark:text-gray-300 light:text-gray-700 mb-1">
                        <span>Cases Solved</span>
                        <span>{correctDiagnoses}/{diagnosticCases.length}</span>
                      </div>
                      <Progress 
                        value={(correctDiagnoses / diagnosticCases.length) * 100} 
                        className="h-2"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-center text-sm">
                      <div className="glassmorphic-card bg-blue-50/10 p-2 rounded-lg">
                        <div className="text-lg font-bold text-blue-400">{score}</div>
                        <div className="text-xs text-gray-300 dark:text-gray-300 light:text-gray-700">Score</div>
                      </div>
                      <div className="glassmorphic-card bg-green-50/10 p-2 rounded-lg">
                        <div className="text-lg font-bold text-green-400">{formatTime(timeElapsed)}</div>
                        <div className="text-xs text-gray-300 dark:text-gray-300 light:text-gray-700">Time</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Current Case Info */}
            {gameStarted && !showExplanation && (
              <Card className="glassmorphic-card bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl dark:bg-white/5 light:bg-black/5 dark:border-white/10 light:border-black/10">
                <CardContent className="p-4">
                  <h4 className="text-white dark:text-white light:text-black font-bold mb-3 flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-indigo-400" />
                    Case {currentCaseIndex + 1}
                  </h4>
                  <div className="text-sm text-gray-300 dark:text-gray-300 light:text-gray-700 space-y-2">
                    <div className="bg-indigo-500/20 p-2 rounded border border-indigo-400/30">
                      <p className="font-bold text-indigo-300">Patient:</p>
                      <p className="text-xs text-indigo-200">{currentCase.patientInfo}</p>
                    </div>
                    
                    <div className="bg-blue-500/20 p-2 rounded border border-blue-400/30">
                      <p className="font-bold text-blue-300">Presentation:</p>
                      <p className="text-xs text-blue-200">{currentCase.clinicalPresentation}</p>
                    </div>
                    
                    {!caseComplete && (
                      <div className="bg-yellow-500/20 p-2 rounded border border-yellow-400/30">
                        <div className="flex justify-between items-center">
                          <span className="text-yellow-300 font-bold">Time Left:</span>
                          <span className="text-yellow-200">{formatTime(caseTimeLeft)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Game Area */}
          <div className="flex-1">
            {gameStarted && !showExplanation && (
              <Card className="glassmorphic-card bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl dark:bg-white/5 light:bg-black/5 dark:border-white/10 light:border-black/10 h-fit">
                <CardHeader>
                  <CardTitle className="text-white dark:text-white light:text-black flex items-center">
                    <Microscope className="h-5 w-5 mr-2 text-blue-400" />
                    Laboratory Results Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {/* Lab Results Table */}
                  <div className="mb-6">
                    <h5 className="text-lg font-bold text-white dark:text-white light:text-black mb-3">Laboratory Values</h5>
                    <div className="space-y-2">
                      {currentCase.labTests.map((test, index) => (
                        <div 
                          key={index}
                          className={`flex justify-between items-center p-3 rounded-lg border ${
                            test.isAbnormal 
                              ? 'bg-red-500/10 border-red-400/30' 
                              : 'bg-green-500/10 border-green-400/30'
                          }`}
                        >
                          <div className="flex-1">
                            <span className="font-medium text-white dark:text-white light:text-black">{test.name}</span>
                            <div className="text-xs text-gray-400 dark:text-gray-400 light:text-gray-600">Normal: {test.normalRange}</div>
                          </div>
                          <div className="text-right">
                            <span className={`font-bold ${
                              test.isAbnormal ? 'text-red-300' : 'text-green-300'
                            }`}>
                              {test.value}
                            </span>
                            {test.isAbnormal && (
                              <AlertTriangle className="h-4 w-4 text-red-400 inline ml-2" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Diagnosis Selection */}
                  <div className="mb-6">
                    <h5 className="text-lg font-bold text-white dark:text-white light:text-black mb-3">Select Your Diagnosis</h5>
                    <div className="space-y-2">
                      {currentCase.possibleDiagnoses.map((diagnosis, index) => (
                        <Button
                          key={index}
                          variant={selectedDiagnosis === diagnosis ? "default" : "outline"}
                          className={`w-full text-left justify-start p-4 h-auto ${
                            selectedDiagnosis === diagnosis 
                              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                              : 'bg-white/5 hover:bg-white/10 text-white dark:text-white light:text-black border-white/10'
                          }`}
                          onClick={() => setSelectedDiagnosis(diagnosis)}
                          disabled={caseComplete}
                        >
                          <div className="flex items-center">
                            {selectedDiagnosis === diagnosis && (
                              <CheckCircle className="h-4 w-4 mr-2 text-white" />
                            )}
                            {diagnosis}
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Submit Button */}
                  {!caseComplete && (
                    <Button
                      onClick={handleDiagnosisSubmit}
                      className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-3"
                      disabled={!selectedDiagnosis}
                    >
                      <FileText className="h-5 w-5 mr-2" />
                      Submit Diagnosis
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Explanation Panel */}
            {showExplanation && (
              <Card className="glassmorphic-card bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl dark:bg-white/5 light:bg-black/5 dark:border-white/10 light:border-black/10">
                <CardHeader>
                  <CardTitle className="text-white dark:text-white light:text-black flex items-center">
                    <Brain className="h-5 w-5 mr-2 text-purple-400" />
                    Case Explanation
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 mb-4">
                      {selectedDiagnosis === currentCase.correctDiagnosis ? (
                        <CheckCircle className="h-6 w-6 text-green-400" />
                      ) : (
                        <XCircle className="h-6 w-6 text-red-400" />
                      )}
                      <span className="font-bold text-lg text-white dark:text-white light:text-black">
                        {selectedDiagnosis === currentCase.correctDiagnosis ? 'Correct!' : 'Incorrect'}
                      </span>
                    </div>
                    
                    <div className="bg-green-500/10 p-4 rounded-lg border border-green-400/30">
                      <h6 className="font-bold text-green-300 mb-2">Correct Diagnosis:</h6>
                      <p className="text-green-200">{currentCase.correctDiagnosis}</p>
                    </div>
                    
                    <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-400/30">
                      <h6 className="font-bold text-blue-300 mb-2">Explanation:</h6>
                      <p className="text-blue-200">{currentCase.explanation}</p>
                    </div>
                    
                    <Button
                      onClick={nextCase}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3"
                    >
                      <ArrowRight className="h-5 w-5 mr-2" />
                      {currentCaseIndex < diagnosticCases.length - 1 ? 'Next Case' : 'Complete Level'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Case Introduction Dialog */}
      <AlertDialog open={showCaseDialog} onOpenChange={setShowCaseDialog}>
        <AlertDialogContent className="max-w-3xl glass-card backdrop-blur-xl border border-blue-400/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-2xl font-bold text-blue-400 flex items-center justify-center">
              <Microscope className="h-6 w-6 mr-2" />
              Case {currentCaseIndex + 1}: Diagnostic Challenge
            </AlertDialogTitle>
          </AlertDialogHeader>
          
          <div className="py-6 space-y-4">
            <div className="glass-card bg-blue-50/10 p-4 rounded-lg border border-blue-400/30">
              <h4 className="font-bold text-blue-400 mb-2">Mission Objective</h4>
              <p className="text-gray-300 dark:text-gray-300 light:text-gray-700">
                Analyze the laboratory results and clinical presentation to make the correct diagnosis.
              </p>
            </div>
            
            <div className="glass-card bg-yellow-50/10 p-4 rounded-lg border border-yellow-400/30">
              <h4 className="font-bold text-yellow-400 mb-2">Time Limit</h4>
              <p className="text-gray-300 dark:text-gray-300 light:text-gray-700">
                You have <span className="font-bold text-yellow-300">{currentCase.timeLimit} seconds</span> to make your diagnosis.
              </p>
            </div>
            
            <div className="glass-card bg-purple-50/10 p-4 rounded-lg border border-purple-400/30">
              <h4 className="font-bold text-purple-400 mb-2">Difficulty</h4>
              <Badge className={`${
                currentCase.difficulty === 'hard' ? 'bg-red-600' :
                currentCase.difficulty === 'medium' ? 'bg-orange-600' : 'bg-green-600'
              }`}>
                {currentCase.difficulty.toUpperCase()}
              </Badge>
            </div>
          </div>

          <AlertDialogFooter className="flex justify-center">
            <AlertDialogAction 
              onClick={startCase}
              className="glass-card bg-blue-600/80 hover:bg-blue-700 backdrop-blur-sm border border-blue-400/30"
            >
              <Microscope className="h-4 w-4 mr-2" />
              Begin Analysis
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Next Level Dialog */}
      <AlertDialog open={showNextLevelDialog} onOpenChange={setShowNextLevelDialog}>
        <AlertDialogContent className="max-w-2xl glass-card backdrop-blur-xl border border-orange-400/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              🔒 Level 3 Locked
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-lg text-white dark:text-white light:text-black">
              Complete Level 2: Diagnostic Detective first to unlock Level 3: Pathology Professor!
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-6 text-center">
            <div className="glass-card bg-orange-50/10 p-6 rounded-lg border border-orange-400/30">
              <Lock className="h-12 w-12 mx-auto mb-4 text-orange-400" />
              <p className="text-gray-300 dark:text-gray-300 light:text-gray-700 text-lg mb-4">
                You need to successfully diagnose all cases to unlock the next level.
              </p>
              <div className="glass-card bg-red-50/10 p-4 rounded-lg border border-red-400/30 mb-4">
                <h4 className="font-bold text-red-400 mb-2">Next Level Preview:</h4>
                <p className="text-gray-300 dark:text-gray-300 light:text-gray-700 text-sm">
                  🎓 <strong>Level 3: Pathology Professor</strong>
                </p>
                <p className="text-gray-400 dark:text-gray-400 light:text-gray-600 text-xs mt-1">
                  Advanced pathophysiology and complex case management!
                </p>
              </div>
              <p className="text-gray-400 dark:text-gray-400 light:text-gray-600 text-sm">
                Current progress: {correctDiagnoses} / {diagnosticCases.length} cases solved
              </p>
            </div>
          </div>

          <AlertDialogFooter className="flex justify-center">
            <AlertDialogAction 
              onClick={() => setShowNextLevelDialog(false)}
              className="glass-card bg-orange-600/80 hover:bg-orange-700 backdrop-blur-sm border border-orange-400/30"
            >
              <Target className="h-4 w-4 mr-2" />
              Continue Detecting
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Completion Dialog */}
      <AlertDialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <AlertDialogContent className="max-w-2xl glass-card backdrop-blur-xl border border-emerald-400/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              🔬 Detective Mastery Achieved! 🔬
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-lg text-white dark:text-white light:text-black">
              Outstanding diagnostic skills! You've successfully solved all coagulation cases!
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="glass-card bg-blue-50/10 p-4 rounded-lg border border-blue-400/30">
                <div className="text-2xl font-bold text-blue-400">{score}</div>
                <div className="text-sm text-gray-300 dark:text-gray-300 light:text-gray-700">Detective Score</div>
              </div>
              <div className="glass-card bg-green-50/10 p-4 rounded-lg border border-green-400/30">
                <div className="text-2xl font-bold text-green-400">{formatTime(timeElapsed)}</div>
                <div className="text-sm text-gray-300 dark:text-gray-300 light:text-gray-700">Total Time</div>
              </div>
              <div className="glass-card bg-purple-50/10 p-4 rounded-lg border border-purple-400/30">
                <div className="text-2xl font-bold text-purple-400">EXPERT</div>
                <div className="text-sm text-gray-300 dark:text-gray-300 light:text-gray-700">Detective Status</div>
              </div>
            </div>
          </div>

          <AlertDialogFooter className="flex justify-center space-x-4">
            <AlertDialogAction 
              onClick={resetLevel}
              className="glass-card bg-blue-600/80 hover:bg-blue-700 backdrop-blur-sm border border-blue-400/30"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Replay Cases
            </AlertDialogAction>
            <AlertDialogAction 
              onClick={() => {
                setShowCompletionDialog(false);
                navigate('/level3');
              }}
              className="glass-card bg-green-600/80 hover:bg-green-700 backdrop-blur-sm border border-green-400/30"
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              Level 3: Pathology Professor
            </AlertDialogAction>
            <AlertDialogCancel 
              onClick={() => navigate('/')}
              className="glass-card border border-white/20 text-white dark:text-white light:text-black hover:bg-white/10"
            >
              <Target className="h-4 w-4 mr-2" />
              Main Menu
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Exit Dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent className="glass-card bg-gradient-to-br from-slate-900/95 via-blue-900/95 to-slate-900/95 border border-red-400/30 backdrop-blur-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-2xl font-bold text-red-400">
              Exit Diagnostic Detective?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-lg text-gray-300 dark:text-gray-300 light:text-gray-700">
              Case analysis is in progress. Are you sure you want to exit?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-center space-x-4">
            <AlertDialogCancel className="glass-card border-white/20 text-white dark:text-white light:text-black hover:bg-white/10">
              Continue Analysis
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => navigate('/')}
              className="bg-red-600 hover:bg-red-700"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Exit Detective Work
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Level2;
