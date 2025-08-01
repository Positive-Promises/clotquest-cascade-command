import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Beaker, 
  Microscope, 
  FlaskConical,
  TestTube,
  Clock, 
  DollarSign,
  ArrowLeft, 
  LogOut,
  Play,
  RotateCcw,
  Target,
  CheckCircle,
  AlertTriangle,
  Brain,
  Droplets,
  Activity
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import GlassmorphicCard from '@/components/enhanced/GlassmorphicCard';
import AudioSystem from '@/components/AudioSystem';
import DiagnosisAnalyzer from '@/components/DiagnosisAnalyzer';
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

interface DiagnosticTest {
  id: string;
  name: string;
  category: 'basic' | 'specialized' | 'genetic' | 'microscopy';
  cost: number;
  timeToComplete: number;
  description: string;
  indications: string[];
  normalRange: string;
  specificity: number;
  sensitivity: number;
  tubeType?: string;
}

interface TestResult {
  testId: string;
  value: string;
  interpretation: string;
  abnormalFlags: string[];
  followUpSuggestions: string[];
}

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  symptoms: string[];
  clinicalHistory: string;
}

const Level2 = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [currency, setCurrency] = useState(1000); // Starting QUID
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const [selectedTests, setSelectedTests] = useState<DiagnosticTest[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [currentTab, setCurrentTab] = useState('overview');
  const [sampleCollected, setSampleCollected] = useState(false);
  const [selectedTubeType, setSelectedTubeType] = useState('');
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [level2Complete, setLevel2Complete] = useState(false);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [gameMode, setGameMode] = useState<'quiz' | 'analysis'>('quiz');
  const [userDiagnosis, setUserDiagnosis] = useState('');

  const checkDiagnosisCorrectness = (diagnosis: string): boolean => {
    if (!currentPatient) return false;
    
    const normalizedDiagnosis = diagnosis.toLowerCase().trim();
    
    // Check for correct diagnosis based on patient case and test results
    if (currentPatient.id === 'p2') {
      // James Wilson case - should be Hemophilia A based on test results
      return normalizedDiagnosis.includes('hemophilia a') || 
             normalizedDiagnosis.includes('hemophilia') && normalizedDiagnosis.includes('a') ||
             normalizedDiagnosis.includes('factor viii deficiency');
    }
    
    if (currentPatient.id === 'p1') {
      // Maria Santos case - should be von Willebrand Disease
      return normalizedDiagnosis.includes('von willebrand') || 
             normalizedDiagnosis.includes('vwd') ||
             normalizedDiagnosis.includes('willebrand');
    }
    
    return false;
  };

  const patients: Patient[] = [
    {
      id: 'p1',
      name: 'Maria Santos',
      age: 34,
      gender: 'Female',
      symptoms: ['Easy bruising', 'Heavy menstrual bleeding', 'Bleeding gums'],
      clinicalHistory: 'Family history of bleeding disorders. Recent dental work with excessive bleeding.'
    },
    {
      id: 'p2',
      name: 'James Wilson',
      age: 8,
      gender: 'Male',
      symptoms: ['Joint swelling', 'Easy bruising', 'Muscle bleeding'],
      clinicalHistory: 'X-linked inheritance pattern. Recurrent joint bleeds since early childhood.'
    }
  ];

  const availableTests: DiagnosticTest[] = [
    // Basic Coagulation Tests
    {
      id: 'pt',
      name: 'Prothrombin Time (PT)',
      category: 'basic',
      cost: 15,
      timeToComplete: 30,
      description: 'Measures extrinsic pathway function',
      indications: ['Screening for bleeding disorders', 'Monitoring warfarin therapy'],
      normalRange: '11-13 seconds',
      specificity: 85,
      sensitivity: 90,
      tubeType: 'Blue top (sodium citrate)'
    },
    {
      id: 'aptt',
      name: 'Activated Partial Thromboplastin Time (aPTT)',
      category: 'basic',
      cost: 18,
      timeToComplete: 35,
      description: 'Measures intrinsic pathway function',
      indications: ['Screening for bleeding disorders', 'Monitoring heparin therapy'],
      normalRange: '25-35 seconds',
      specificity: 80,
      sensitivity: 85,
      tubeType: 'Blue top (sodium citrate)'
    },
    {
      id: 'inr',
      name: 'International Normalized Ratio (INR)',
      category: 'basic',
      cost: 12,
      timeToComplete: 30,
      description: 'Standardized PT measurement',
      indications: ['Anticoagulation monitoring', 'Liver function assessment'],
      normalRange: '0.8-1.2',
      specificity: 90,
      sensitivity: 88,
      tubeType: 'Blue top (sodium citrate)'
    },
    {
      id: 'bleeding_time',
      name: 'Bleeding Time',
      category: 'basic',
      cost: 25,
      timeToComplete: 15,
      description: 'Measures primary hemostasis',
      indications: ['Platelet function assessment', 'Pre-surgical screening'],
      normalRange: '2-7 minutes',
      specificity: 70,
      sensitivity: 75,
      tubeType: 'No tube required (in vivo test)'
    },
    // Specialized Tests
    {
      id: 'factor_viii',
      name: 'Factor VIII Assay',
      category: 'specialized',
      cost: 120,
      timeToComplete: 180,
      description: 'Quantifies Factor VIII activity',
      indications: ['Hemophilia A diagnosis', 'von Willebrand disease'],
      normalRange: '50-150%',
      specificity: 95,
      sensitivity: 98,
      tubeType: 'Blue top (sodium citrate)'
    },
    {
      id: 'factor_ix',
      name: 'Factor IX Assay',
      category: 'specialized',
      cost: 125,
      timeToComplete: 180,
      description: 'Quantifies Factor IX activity',
      indications: ['Hemophilia B diagnosis'],
      normalRange: '50-150%',
      specificity: 96,
      sensitivity: 97,
      tubeType: 'Blue top (sodium citrate)'
    },
    {
      id: 'vwf_antigen',
      name: 'von Willebrand Factor Antigen',
      category: 'specialized',
      cost: 90,
      timeToComplete: 120,
      description: 'Measures vWF protein levels',
      indications: ['von Willebrand disease diagnosis'],
      normalRange: '60-140%',
      specificity: 92,
      sensitivity: 89,
      tubeType: 'Blue top (sodium citrate)'
    },
    {
      id: 'platelet_aggregometry',
      name: 'Platelet Aggregometry',
      category: 'specialized',
      cost: 150,
      timeToComplete: 240,
      description: 'Measures platelet function responses',
      indications: ['Platelet function disorders', 'Drug effects on platelets'],
      normalRange: 'Variable by inducer',
      specificity: 88,
      sensitivity: 85,
      tubeType: 'Blue top (sodium citrate)'
    },
    // Genetic Tests
    {
      id: 'factor_v_leiden',
      name: 'Factor V Leiden Mutation',
      category: 'genetic',
      cost: 200,
      timeToComplete: 1440,
      description: 'DNA analysis for Factor V Leiden mutation',
      indications: ['Thrombophilia screening', 'Family history of clots'],
      normalRange: 'Normal (no mutation)',
      specificity: 99,
      sensitivity: 99,
      tubeType: 'EDTA (purple top)'
    },
    {
      id: 'prothrombin_gene',
      name: 'Prothrombin Gene Mutation',
      category: 'genetic',
      cost: 180,
      timeToComplete: 1440,
      description: 'DNA analysis for prothrombin G20210A',
      indications: ['Thrombophilia screening'],
      normalRange: 'Normal (no mutation)',
      specificity: 99,
      sensitivity: 99,
      tubeType: 'EDTA (purple top)'
    },
    // Microscopy
    {
      id: 'blood_smear',
      name: 'Peripheral Blood Smear',
      category: 'microscopy',
      cost: 35,
      timeToComplete: 45,
      description: 'Microscopic examination of blood cells',
      indications: ['Platelet count verification', 'Cell morphology assessment'],
      normalRange: 'Normal cell morphology',
      specificity: 85,
      sensitivity: 80,
      tubeType: 'EDTA (purple top)'
    }
  ];

  useEffect(() => {
    if (gameStarted) {
      const timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameStarted]);

  const startGame = () => {
    setGameStarted(true);
    setCurrentPatient(patients[0]);
    toast({
      title: "🔬 Diagnostic Detective Started!",
      description: "Welcome to the laboratory! Select appropriate tests to solve the case.",
    });
  };

  const collectSample = (tubeType: string) => {
    setSelectedTubeType(tubeType);
    setSampleCollected(true);
    setScore(prev => prev + 25);
    toast({
      title: "Sample Collected! 🩸",
      description: `${tubeType} collected successfully. +25 QUID`,
    });
  };

  const orderTest = (test: DiagnosticTest) => {
    if (currency < test.cost) {
      toast({
        title: "Insufficient Funds! 💰",
        description: `You need ${test.cost} QUID but only have ${currency} QUID.`,
        variant: "destructive",
      });
      return;
    }

    if (selectedTests.find(t => t.id === test.id)) {
      toast({
        title: "Test Already Ordered",
        description: `${test.name} has already been ordered.`,
        variant: "destructive",
      });
      return;
    }

    setSelectedTests(prev => [...prev, test]);
    setCurrency(prev => prev - test.cost);
    setScore(prev => prev + 50);
    
    toast({
      title: "Test Ordered! 📋",
      description: `${test.name} ordered. Cost: ${test.cost} QUID. +50 points`,
    });

    // Simulate test processing
    setTimeout(() => {
      const result = generateTestResult(test, currentPatient);
      setTestResults(prev => [...prev, result]);
      toast({
        title: "Results Available! ✅",
        description: `${test.name} results are ready for interpretation.`,
      });
    }, test.timeToComplete * 10); // Reduced time for gameplay
  };

  const generateTestResult = (test: DiagnosticTest, patient: Patient | null): TestResult => {
    if (!patient) return { testId: test.id, value: 'N/A', interpretation: 'No patient', abnormalFlags: [], followUpSuggestions: [] };

    // Simulate realistic results based on patient condition
    const results: { [key: string]: TestResult } = {
      'pt': {
        testId: 'pt',
        value: patient.id === 'p1' ? '14.2 seconds' : '12.8 seconds',
        interpretation: patient.id === 'p1' ? 'Slightly prolonged' : 'Normal',
        abnormalFlags: patient.id === 'p1' ? ['High'] : [],
        followUpSuggestions: patient.id === 'p1' ? ['Consider factor deficiency', 'Order mixing studies'] : []
      },
      'aptt': {
        testId: 'aptt',
        value: patient.id === 'p2' ? '68.5 seconds' : '32.1 seconds',
        interpretation: patient.id === 'p2' ? 'Significantly prolonged' : 'Normal',
        abnormalFlags: patient.id === 'p2' ? ['Critical High'] : [],
        followUpSuggestions: patient.id === 'p2' ? ['Factor VIII or IX deficiency likely', 'Order specific factor assays'] : []
      },
      'factor_viii': {
        testId: 'factor_viii',
        value: patient.id === 'p2' ? '2%' : patient.id === 'p1' ? '45%' : '85%',
        interpretation: patient.id === 'p2' ? 'Severe deficiency' : patient.id === 'p1' ? 'Mild deficiency' : 'Normal',
        abnormalFlags: patient.id === 'p2' ? ['Critical Low'] : patient.id === 'p1' ? ['Low'] : [],
        followUpSuggestions: patient.id === 'p2' ? ['Severe Hemophilia A confirmed', 'Genetic counseling recommended'] : []
      }
    };

    return results[test.id] || {
      testId: test.id,
      value: 'Normal',
      interpretation: 'Within normal limits',
      abnormalFlags: [],
      followUpSuggestions: []
    };
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const resetLevel = () => {
    setScore(0);
    setCurrency(1000);
    setTimeElapsed(0);
    setSelectedTests([]);
    setTestResults([]);
    setCurrentPatient(patients[0]);
    setSampleCollected(false);
    setSelectedTubeType('');
    setLevel2Complete(false);
    setShowCompletionDialog(false);
    setGameStarted(true);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'basic': return 'bg-green-600';
      case 'specialized': return 'bg-blue-600';
      case 'genetic': return 'bg-purple-600';
      case 'microscopy': return 'bg-orange-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-green-900 p-4 pb-20">
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, i) => (
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

      <AudioSystem gameState="playing" level={2} />
      
      <Button
        onClick={() => setShowExitDialog(true)}
        className="fixed top-4 left-4 z-50 bg-red-600/80 hover:bg-red-700 backdrop-blur-sm border border-red-400/30 transform hover:scale-105 transition-all duration-200"
      >
        <LogOut className="h-4 w-4 mr-2" />
        Exit Game
      </Button>

      <div className="container mx-auto relative z-10">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center mb-4 text-blue-300 hover:text-blue-100 transform hover:scale-105 transition-all duration-200">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          
          <GlassmorphicCard intensity="heavy" color="blue" className="p-6">
            <div className="flex flex-col lg:flex-row items-center justify-between text-white gap-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-green-400 to-purple-400 bg-clip-text text-transparent">
                  Level 2: Diagnostic Detective
                </h1>
                <p className="text-blue-200 text-lg">Master laboratory diagnostics for coagulation disorders</p>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{score}</div>
                  <div className="text-sm text-gray-300">Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{currency}</div>
                  <div className="text-sm text-gray-300">QUID</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{formatTime(timeElapsed)}</div>
                  <div className="text-sm text-gray-300">Time</div>
                </div>
              </div>
            </div>
          </GlassmorphicCard>
        </div>

        {!gameStarted ? (
          <div className="text-center">
            <GlassmorphicCard intensity="medium" className="p-12">
              <Microscope className="h-24 w-24 text-blue-400 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Enter the Laboratory?</h2>
              <p className="text-white/70 mb-8 text-lg">Step into the role of a laboratory specialist and solve coagulation mysteries!</p>
              
              {/* Game Mode Selection */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4">Select Game Mode:</h3>
                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={() => setGameMode('quiz')}
                    variant={gameMode === 'quiz' ? 'default' : 'outline'}
                    className={`px-6 py-3 ${gameMode === 'quiz' ? 'bg-blue-600 hover:bg-blue-700' : 'border-white/30 text-white hover:bg-white/10'}`}
                  >
                    <Target className="h-4 w-4 mr-2" />
                    Quiz Mode
                  </Button>
                  <Button
                    onClick={() => setGameMode('analysis')}
                    variant={gameMode === 'analysis' ? 'default' : 'outline'}
                    className={`px-6 py-3 ${gameMode === 'analysis' ? 'bg-purple-600 hover:bg-purple-700' : 'border-white/30 text-white hover:bg-white/10'}`}
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    Diagnosis Analysis
                  </Button>
                </div>
                <p className="text-white/60 mt-2 text-sm">
                  {gameMode === 'quiz' ? 'Traditional quiz format with scoring' : 'Analyze any diagnosis with evidence-based feedback'}
                </p>
              </div>
              
              <Button onClick={startGame} size="lg" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-4 text-lg">
                <Play className="h-6 w-6 mr-3" />
                Start Laboratory Session
              </Button>
            </GlassmorphicCard>
          </div>
        ) : (
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 bg-white/10 backdrop-blur-lg border border-white/20">
              <TabsTrigger value="overview" className="data-[state=active]:bg-white/20">
                <Activity className="h-4 w-4 mr-2" />
                Patient
              </TabsTrigger>
              <TabsTrigger value="collection" className="data-[state=active]:bg-white/20">
                <TestTube className="h-4 w-4 mr-2" />
                Collection
              </TabsTrigger>
              <TabsTrigger value="testing" className="data-[state=active]:bg-white/20">
                <Beaker className="h-4 w-4 mr-2" />
                Testing
              </TabsTrigger>
              <TabsTrigger value="results" className="data-[state=active]:bg-white/20">
                <FlaskConical className="h-4 w-4 mr-2" />
                Results
              </TabsTrigger>
              <TabsTrigger value="interpretation" className="data-[state=active]:bg-white/20">
                <Brain className="h-4 w-4 mr-2" />
                Analysis
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {currentPatient && (
                <GlassmorphicCard intensity="medium" color="blue">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Activity className="h-6 w-6 mr-2 text-blue-400" />
                      Patient: {currentPatient.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-white space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-bold text-blue-300 mb-2">Demographics</h4>
                        <p>Age: {currentPatient.age} years</p>
                        <p>Gender: {currentPatient.gender}</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-green-300 mb-2">Symptoms</h4>
                        <div className="space-y-1">
                          {currentPatient.symptoms.map((symptom, index) => (
                            <Badge key={index} variant="outline" className="mr-2 text-white border-white/30">
                              {symptom}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-yellow-300 mb-2">Clinical History</h4>
                      <p className="text-white/80">{currentPatient.clinicalHistory}</p>
                    </div>
                  </CardContent>
                </GlassmorphicCard>
              )}
            </TabsContent>

            <TabsContent value="collection" className="space-y-6">
              <GlassmorphicCard intensity="medium" color="green">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <TestTube className="h-6 w-6 mr-2 text-green-400" />
                    Sample Collection Station
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-white/80 mb-4">Select the appropriate tube type for blood collection:</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['Blue top (sodium citrate)', 'Purple top (EDTA)', 'Red top (no anticoagulant)'].map((tubeType) => (
                      <Button
                        key={tubeType}
                        onClick={() => collectSample(tubeType)}
                        className={`p-4 ${selectedTubeType === tubeType ? 'bg-green-600' : 'bg-white/10'} hover:bg-green-600/80 text-white border border-white/20`}
                        disabled={sampleCollected && selectedTubeType !== tubeType}
                      >
                        <Droplets className="h-4 w-4 mr-2" />
                        {tubeType}
                      </Button>
                    ))}
                  </div>
                  {sampleCollected && (
                    <div className="bg-green-500/20 p-4 rounded-lg">
                      <p className="text-green-300 font-bold">✅ Sample collected in {selectedTubeType}</p>
                      <p className="text-white/70 text-sm">Ready to proceed with testing!</p>
                    </div>
                  )}
                </CardContent>
              </GlassmorphicCard>
            </TabsContent>

            <TabsContent value="testing" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {['basic', 'specialized', 'genetic', 'microscopy'].map((category) => (
                  <GlassmorphicCard key={category} intensity="medium" color="purple">
                    <CardHeader>
                      <CardTitle className="text-white capitalize flex items-center">
                        <Beaker className="h-5 w-5 mr-2 text-purple-400" />
                        {category} Tests
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {availableTests.filter(test => test.category === category).map((test) => (
                        <div key={test.id} className="bg-white/5 p-4 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-200">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-white font-bold text-sm">{test.name}</h4>
                            <div className="flex items-center space-x-2">
                              <Badge className={`text-xs ${getCategoryColor(test.category)}`}>
                                {test.cost} QUID
                              </Badge>
                              <Badge variant="outline" className="text-white border-white/30 text-xs">
                                {test.timeToComplete}min
                              </Badge>
                            </div>
                          </div>
                          <p className="text-white/70 text-xs mb-2">{test.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-white/60">
                              Sens: {test.sensitivity}% | Spec: {test.specificity}%
                            </div>
                            <Button
                              size="sm"
                              onClick={() => orderTest(test)}
                              disabled={!sampleCollected || selectedTests.some(t => t.id === test.id)}
                              className="bg-purple-600 hover:bg-purple-700 text-white text-xs"
                            >
                              {selectedTests.some(t => t.id === test.id) ? 'Ordered' : 'Order Test'}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </GlassmorphicCard>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="results" className="space-y-6">
              <GlassmorphicCard intensity="medium" color="blue">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <FlaskConical className="h-6 w-6 mr-2 text-blue-400" />
                    Laboratory Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {testResults.length === 0 ? (
                    <p className="text-white/60 text-center py-8">No results available yet. Order tests to see results here.</p>
                  ) : (
                    <div className="space-y-4">
                      {testResults.map((result, index) => {
                        const test = availableTests.find(t => t.id === result.testId);
                        return (
                          <div key={index} className="bg-white/5 p-4 rounded-lg border border-white/10">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-white font-bold">{test?.name}</h4>
                              <div className="flex space-x-2">
                                {result.abnormalFlags.map((flag, i) => (
                                  <Badge key={i} variant="destructive" className="text-xs">
                                    {flag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="text-white/60">Result:</p>
                                <p className="text-white font-mono">{result.value}</p>
                              </div>
                              <div>
                                <p className="text-white/60">Normal Range:</p>
                                <p className="text-white/80">{test?.normalRange}</p>
                              </div>
                              <div>
                                <p className="text-white/60">Interpretation:</p>
                                <p className="text-white/80">{result.interpretation}</p>
                              </div>
                            </div>
                            {result.followUpSuggestions.length > 0 && (
                              <div className="mt-3 p-2 bg-yellow-500/20 rounded">
                                <p className="text-yellow-300 font-bold text-xs">Follow-up Suggestions:</p>
                                <ul className="text-white/80 text-xs list-disc list-inside">
                                  {result.followUpSuggestions.map((suggestion, i) => (
                                    <li key={i}>{suggestion}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </GlassmorphicCard>
            </TabsContent>

            <TabsContent value="interpretation" className="space-y-6">
              {gameMode === 'analysis' ? (
                <DiagnosisAnalyzer
                  patient={currentPatient}
                  testResults={testResults}
                  onScoreUpdate={(points) => setScore(prev => prev + points)}
                />
              ) : (
                <GlassmorphicCard intensity="medium" color="green">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Brain className="h-6 w-6 mr-2 text-green-400" />
                      Clinical Interpretation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-white space-y-4">
                    {testResults.length === 0 ? (
                      <p className="text-white/60 text-center py-8">Complete diagnostic tests to begin clinical interpretation.</p>
                    ) : (
                      <div className="space-y-4">
                        <div className="bg-white/5 p-4 rounded-lg">
                          <h4 className="font-bold text-green-300 mb-2">Diagnostic Algorithm</h4>
                          <p className="text-white/80 mb-3">Based on your test results, consider the following diagnostic pathway:</p>
                          {/* Dynamic diagnostic algorithm based on results */}
                          <div className="space-y-2 text-sm">
                            {testResults.some(r => r.abnormalFlags.includes('Critical High') && r.testId === 'aptt') && (
                              <div className="flex items-center space-x-2">
                                <CheckCircle className="h-4 w-4 text-green-400" />
                                <span>Prolonged aPTT suggests intrinsic pathway defect</span>
                              </div>
                            )}
                            {testResults.some(r => r.testId === 'factor_viii' && r.abnormalFlags.includes('Critical Low')) && (
                              <div className="flex items-center space-x-2">
                                <CheckCircle className="h-4 w-4 text-green-400" />
                                <span>Severe Factor VIII deficiency confirms Hemophilia A</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Diagnosis Input Section */}
                        <div className="bg-white/5 p-4 rounded-lg border border-white/20">
                          <h4 className="font-bold text-blue-300 mb-3">Enter Your Diagnosis</h4>
                          <div className="space-y-3">
                            <Label htmlFor="diagnosis-input" className="text-white/80">
                              Based on the clinical presentation and test results, what is your diagnosis?
                            </Label>
                            <Input
                              id="diagnosis-input"
                              value={userDiagnosis}
                              onChange={(e) => setUserDiagnosis(e.target.value)}
                              placeholder="Type your diagnosis here (e.g., Hemophilia A, von Willebrand Disease)..."
                              className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-blue-400"
                            />
                            <p className="text-white/60 text-sm">
                              Consider the patient's symptoms, family history, and laboratory findings when making your diagnosis.
                            </p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Button 
                            className="bg-green-600 hover:bg-green-700 p-4"
                            disabled={!userDiagnosis.trim()}
                            onClick={() => {
                              if (userDiagnosis.trim()) {
                                const isCorrect = checkDiagnosisCorrectness(userDiagnosis);
                                if (isCorrect) {
                                  setScore(prev => prev + 200);
                                  toast({
                                    title: "Excellent Diagnosis! 🎯",
                                    description: `Correct! ${userDiagnosis} is the right diagnosis. +200 points`,
                                  });
                                } else {
                                  setScore(prev => prev + 50);
                                  toast({
                                    title: "Good Attempt! 🤔",
                                    description: `${userDiagnosis} - Consider reviewing the test results. +50 points for effort`,
                                    variant: "destructive",
                                  });
                                }
                              }
                            }}
                          >
                            <Target className="h-4 w-4 mr-2" />
                            Submit Diagnosis
                          </Button>
                          <Button 
                            variant="outline" 
                            className="border-white/20 text-white hover:bg-white/10 p-4"
                            onClick={resetLevel}
                          >
                            <RotateCcw className="h-4 w-4 mr-2" />
                            New Case
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </GlassmorphicCard>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>

      {/* Exit Dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 border border-red-400/30 backdrop-blur-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-2xl font-bold text-red-400">
              Exit Laboratory?
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
              Exit Laboratory
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Level2;
