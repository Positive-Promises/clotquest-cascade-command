
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { 
  Microscope, 
  FlaskConical, 
  Heart, 
  Zap, 
  Clock, 
  Coins, 
  Trophy,
  AlertCircle,
  CheckCircle,
  XCircle,
  Search,
  BookOpen,
  Target,
  Brain
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import GlassmorphicCard from '@/components/enhanced/GlassmorphicCard';
import DiagnosisAnalyzer from '@/components/DiagnosisAnalyzer';

// Patient cases for Level 2
const level2Cases = [
  {
    id: 'case1',
    title: 'Case 1: 45-year-old Male with Leg Pain',
    patient: {
      id: 'p1',
      name: 'John Smith',
      age: 45,
      gender: 'Male',
      chiefComplaint: 'Left leg pain and swelling for 3 days',
      symptoms: ['Leg pain', 'Swelling', 'Warmth in left calf', 'Difficulty walking'],
      clinicalHistory: 'Recent long-haul flight, history of smoking, sedentary lifestyle',
      physicalExam: {
        leftLeg: 'Swollen, warm, tender to touch',
        pulses: 'Palpable but diminished',
        skin: 'Slightly reddened over calf'
      }
    },
    correctDiagnosis: 'Deep Vein Thrombosis (DVT)',
    learningObjectives: [
      'Recognize clinical signs of DVT',
      'Understand risk factors for venous thromboembolism',
      'Learn appropriate diagnostic testing sequence'
    ]
  },
  {
    id: 'case2',
    title: 'Case 2: 28-year-old Female with Chest Pain',
    patient: {
      id: 'p2',
      name: 'Sarah Johnson',
      age: 28,
      gender: 'Female',
      chiefComplaint: 'Sudden onset chest pain and shortness of breath',
      symptoms: ['Sharp chest pain', 'Shortness of breath', 'Rapid heartbeat', 'Anxiety'],
      clinicalHistory: 'On oral contraceptives, recent surgery 2 weeks ago',
      physicalExam: {
        chest: 'Clear to auscultation',
        heart: 'Tachycardic, regular rhythm',
        extremities: 'No obvious swelling'
      }
    },
    correctDiagnosis: 'Pulmonary Embolism (PE)',
    learningObjectives: [
      'Identify symptoms of pulmonary embolism',
      'Understand risk factors for PE',
      'Learn diagnostic approach to suspected PE'
    ]
  }
];

// Test database with realistic results
const availableTests = [
  // Basic Tests
  {
    id: 'cbc',
    name: 'Complete Blood Count',
    category: 'basic',
    cost: 50,
    urgency: 'Routine',
    tubeType: 'EDTA (Purple top)',
    description: 'Basic blood count including hemoglobin, hematocrit, white cells, platelets'
  },
  {
    id: 'basic_metabolic',
    name: 'Basic Metabolic Panel',
    category: 'basic',
    cost: 60,
    urgency: 'Routine',
    tubeType: 'Serum (Red top)',
    description: 'Electrolytes, glucose, kidney function'
  },
  {
    id: 'liver_function',
    name: 'Liver Function Tests',
    category: 'basic',
    cost: 70,
    urgency: 'Routine',
    tubeType: 'Serum (Red top)',
    description: 'ALT, AST, bilirubin, albumin'
  },

  // Specialized Coagulation Tests
  {
    id: 'pt_inr',
    name: 'PT/INR',
    category: 'specialized',
    cost: 80,
    urgency: 'STAT',
    tubeType: 'Citrate (Blue top)',
    description: 'Prothrombin time and International Normalized Ratio'
  },
  {
    id: 'aptt',
    name: 'aPTT',
    category: 'specialized',
    cost: 80,
    urgency: 'STAT',
    tubeType: 'Citrate (Blue top)',
    description: 'Activated partial thromboplastin time'
  },
  {
    id: 'd_dimer',
    name: 'D-Dimer',
    category: 'specialized',
    cost: 120,
    urgency: 'STAT',
    tubeType: 'Citrate (Blue top)',
    description: 'Fibrin degradation product indicating clot formation and breakdown'
  },
  {
    id: 'fibrinogen',
    name: 'Fibrinogen Level',
    category: 'specialized',
    cost: 100,
    urgency: 'Routine',
    tubeType: 'Citrate (Blue top)',
    description: 'Measures fibrinogen concentration in blood'
  },
  {
    id: 'factor_viii',
    name: 'Factor VIII Activity',
    category: 'specialized',
    cost: 200,
    urgency: 'Routine',
    tubeType: 'Citrate (Blue top)',
    description: 'Measures Factor VIII clotting activity'
  },
  {
    id: 'von_willebrand',
    name: 'von Willebrand Studies',
    category: 'specialized',
    cost: 250,
    urgency: 'Routine',
    tubeType: 'Citrate (Blue top)',
    description: 'vWF antigen, activity, and multimer analysis'
  },
  {
    id: 'protein_c',
    name: 'Protein C Activity',
    category: 'specialized',
    cost: 180,
    urgency: 'Routine',
    tubeType: 'Citrate (Blue top)',
    description: 'Natural anticoagulant protein activity'
  },
  {
    id: 'protein_s',
    name: 'Protein S Activity',
    category: 'specialized',
    cost: 180,
    urgency: 'Routine',
    tubeType: 'Citrate (Blue top)',
    description: 'Natural anticoagulant protein activity'
  },
  {
    id: 'antithrombin',
    name: 'Antithrombin III',
    category: 'specialized',
    cost: 150,
    urgency: 'Routine',
    tubeType: 'Citrate (Blue top)',
    description: 'Major natural anticoagulant'
  },

  // Imaging Studies
  {
    id: 'duplex_doppler',
    name: 'Duplex Doppler Ultrasound',
    category: 'imaging',
    cost: 300,
    urgency: 'STAT',
    tubeType: 'N/A',
    description: 'Non-invasive imaging to detect blood clots in veins'
  },
  {
    id: 'venous_doppler',
    name: 'Venous Doppler Ultrasound',
    category: 'imaging',
    cost: 250,
    urgency: 'Urgent',
    tubeType: 'N/A',
    description: 'Doppler study of venous blood flow'
  },
  {
    id: 'ct_pulmonary',
    name: 'CT Pulmonary Angiogram (CTPA)',
    category: 'imaging',
    cost: 500,
    urgency: 'STAT',
    tubeType: 'N/A',
    description: 'Contrast CT to detect pulmonary embolism'
  },
  {
    id: 'v_q_scan',
    name: 'Ventilation-Perfusion Scan',
    category: 'imaging',
    cost: 400,
    urgency: 'Urgent',
    tubeType: 'N/A',
    description: 'Nuclear medicine scan to assess lung ventilation and perfusion'
  },
  {
    id: 'echocardiogram',
    name: 'Echocardiogram',
    category: 'imaging',
    cost: 350,
    urgency: 'Urgent',
    tubeType: 'N/A',
    description: 'Ultrasound of the heart to assess function and detect strain'
  },
  {
    id: 'chest_xray',
    name: 'Chest X-Ray',
    category: 'imaging',
    cost: 100,
    urgency: 'STAT',
    tubeType: 'N/A',
    description: 'Basic chest imaging'
  }
];

// Function to generate realistic test results based on patient condition
const generateTestResults = (testId: string, patientId: string) => {
  const baseResults: { [key: string]: any } = {
    'cbc': {
      'p1': { // DVT patient
        hemoglobin: { value: 13.8, unit: 'g/dL', normal: '14-18 g/dL', abnormal: false },
        hematocrit: { value: 41.2, unit: '%', normal: '42-52%', abnormal: true },
        wbc: { value: 8.2, unit: '×10³/μL', normal: '4.5-11.0', abnormal: false },
        platelets: { value: 285, unit: '×10³/μL', normal: '150-450', abnormal: false }
      },
      'p2': { // PE patient
        hemoglobin: { value: 12.9, unit: 'g/dL', normal: '12-15.5 g/dL', abnormal: false },
        hematocrit: { value: 38.4, unit: '%', normal: '36-46%', abnormal: false },
        wbc: { value: 9.8, unit: '×10³/μL', normal: '4.5-11.0', abnormal: false },
        platelets: { value: 342, unit: '×10³/μL', normal: '150-450', abnormal: false }
      }
    },
    'd_dimer': {
      'p1': { value: 2.8, unit: 'mg/L', normal: '<0.5 mg/L', abnormal: true, significance: 'High' },
      'p2': { value: 3.2, unit: 'mg/L', normal: '<0.5 mg/L', abnormal: true, significance: 'High' }
    },
    'pt_inr': {
      'p1': { pt: 12.8, inr: 1.1, unit: 'seconds', normal: 'PT: 11-13s, INR: 0.8-1.2', abnormal: false },
      'p2': { pt: 13.1, inr: 1.2, unit: 'seconds', normal: 'PT: 11-13s, INR: 0.8-1.2', abnormal: false }
    },
    'aptt': {
      'p1': { value: 32, unit: 'seconds', normal: '28-35 seconds', abnormal: false },
      'p2': { value: 31, unit: 'seconds', normal: '28-35 seconds', abnormal: false }
    },
    'duplex_doppler': {
      'p1': {
        finding: 'ABNORMAL',
        description: 'Non-compressible left popliteal vein with echogenic thrombus. No flow detected on Doppler.',
        impression: 'Acute deep vein thrombosis of left popliteal vein',
        abnormal: true
      },
      'p2': {
        finding: 'NORMAL',
        description: 'Bilateral lower extremity veins are compressible with normal flow patterns.',
        impression: 'No evidence of deep vein thrombosis',
        abnormal: false
      }
    },
    'ct_pulmonary': {
      'p1': {
        finding: 'NORMAL',
        description: 'No pulmonary embolism detected. Normal pulmonary vasculature.',
        impression: 'No acute pulmonary embolism',
        abnormal: false
      },
      'p2': {
        finding: 'ABNORMAL',
        description: 'Filling defects in right lower lobe segmental arteries consistent with pulmonary emboli.',
        impression: 'Acute pulmonary embolism in right lower lobe',
        abnormal: true
      }
    }
  };

  return baseResults[testId]?.[patientId] || { value: 'Normal', abnormal: false };
};

const Level2 = () => {
  const [currentCaseIndex, setCurrrentCaseIndex] = useState(0);
  const [selectedTests, setSelectedTests] = useState<any[]>([]);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [currency, setCurrency] = useState(2000); // Increased starting currency
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'diagnosed' | 'completed'>('playing');
  const [score, setScore] = useState(0);
  const [userDiagnosis, setUserDiagnosis] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [isCorrectDiagnosis, setIsCorrectDiagnosis] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const currentCase = level2Cases[currentCaseIndex];

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const orderTest = (test: any) => {
    if (currency >= test.cost && !selectedTests.some(t => t.id === test.id)) {
      setSelectedTests(prev => [...prev, test]);
      setCurrency(prev => prev - test.cost);
      
      // Generate results after a short delay
      setTimeout(() => {
        const result = generateTestResults(test.id, currentCase.patient.id);
        setTestResults(prev => [...prev, {
          testId: test.id,
          testName: test.name,
          result: result,
          timestamp: new Date().toLocaleTimeString()
        }]);
      }, 1000);
    }
  };

  const submitDiagnosis = () => {
    const correct = userDiagnosis.toLowerCase().includes(currentCase.correctDiagnosis.toLowerCase()) ||
                   currentCase.correctDiagnosis.toLowerCase().includes(userDiagnosis.toLowerCase());
    
    setIsCorrectDiagnosis(correct);
    
    if (correct) {
      const timeBonus = Math.max(0, 300 - timeElapsed); // Bonus for quick diagnosis
      const costBonus = Math.max(0, currency / 10); // Bonus for efficient test ordering
      const totalScore = 100 + timeBonus + costBonus;
      setScore(prev => prev + totalScore);
    }
    
    setShowFeedback(true);
    setGameState('diagnosed');
  };

  const nextCase = () => {
    if (currentCaseIndex < level2Cases.length - 1) {
      setCurrrentCaseIndex(prev => prev + 1);
      // Reset case-specific state
      setSelectedTests([]);
      setTestResults([]);
      setCurrency(2000);
      setTimeElapsed(0);
      setUserDiagnosis('');
      setShowResults(false);
      setShowFeedback(false);
      setGameState('playing');
    } else {
      setGameState('completed');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCategoryTests = (category: string) => {
    return availableTests.filter(test => test.category === category);
  };

  const getResultsForTest = (testId: string) => {
    return testResults.find(result => result.testId === testId);
  };

  if (gameState === 'completed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center text-white space-y-6">
            <Trophy className="h-24 w-24 mx-auto text-yellow-400" />
            <h1 className="text-4xl font-bold">Level 2 Complete!</h1>
            <div className="text-xl">Final Score: {score} points</div>
            <div className="space-y-4">
              <p className="text-lg text-white/80">
                Congratulations! You've successfully completed the diagnostic detective challenges.
                You've learned to identify and diagnose coagulation disorders using clinical reasoning
                and appropriate diagnostic testing.
              </p>
              <div className="flex justify-center space-x-4">
                <Button onClick={() => window.location.href = '/level3'} className="bg-blue-600 hover:bg-blue-700">
                  Continue to Level 3
                </Button>
                <Button onClick={() => window.location.href = '/'} variant="outline" className="text-white border-white/30">
                  Return to Menu
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Diagnosis Detective - Level 2</h1>
            <p className="text-white/70">Interactive case-based learning with diagnostic testing</p>
          </div>
          <ThemeToggle />
        </div>

        {/* Game Status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <GlassmorphicCard intensity="medium" color="blue">
            <div className="p-4 text-center">
              <Clock className="h-6 w-6 mx-auto mb-2 text-blue-400" />
              <div className="text-white font-bold">{formatTime(timeElapsed)}</div>
              <div className="text-white/70 text-sm">Time Elapsed</div>
            </div>
          </GlassmorphicCard>
          
          <GlassmorphicCard intensity="medium" color="green">
            <div className="p-4 text-center">
              <Coins className="h-6 w-6 mx-auto mb-2 text-green-400" />
              <div className="text-white font-bold">{currency} QUID</div>
              <div className="text-white/70 text-sm">Available Budget</div>
            </div>
          </GlassmorphicCard>
          
          <GlassmorphicCard intensity="medium" color="purple">
            <div className="p-4 text-center">
              <Trophy className="h-6 w-6 mx-auto mb-2 text-purple-400" />
              <div className="text-white font-bold">{score}</div>
              <div className="text-white/70 text-sm">Total Score</div>
            </div>
          </GlassmorphicCard>
          
          <GlassmorphicCard intensity="medium" color="orange">
            <div className="p-4 text-center">
              <Target className="h-6 w-6 mx-auto mb-2 text-orange-400" />
              <div className="text-white font-bold">Case {currentCaseIndex + 1}/{level2Cases.length}</div>
              <div className="text-white/70 text-sm">Progress</div>
            </div>
          </GlassmorphicCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient Case */}
          <div className="lg:col-span-2 space-y-6">
            <GlassmorphicCard intensity="medium" color="blue">
              <CardHeader>
                <CardTitle className="text-white">{currentCase.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-white/90 space-y-4">
                <div>
                  <h4 className="font-semibold text-blue-400 mb-2">Patient Information</h4>
                  <p><strong>Name:</strong> {currentCase.patient.name}</p>
                  <p><strong>Age:</strong> {currentCase.patient.age}</p>
                  <p><strong>Gender:</strong> {currentCase.patient.gender}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-blue-400 mb-2">Chief Complaint</h4>
                  <p>{currentCase.patient.chiefComplaint}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-blue-400 mb-2">Clinical History</h4>
                  <p>{currentCase.patient.clinicalHistory}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-blue-400 mb-2">Symptoms</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentCase.patient.symptoms.map((symptom, index) => (
                      <Badge key={index} className="bg-blue-600 text-white">
                        {symptom}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-blue-400 mb-2">Learning Objectives</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {currentCase.learningObjectives.map((objective, index) => (
                      <li key={index}>{objective}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </GlassmorphicCard>

            {/* Test Ordering Interface */}
            <GlassmorphicCard intensity="medium" color="purple">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <FlaskConical className="h-6 w-6 mr-2 text-purple-400" />
                  Diagnostic Testing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-white/10">
                    <TabsTrigger value="basic">Basic Tests</TabsTrigger>
                    <TabsTrigger value="specialized">Specialized</TabsTrigger>
                    <TabsTrigger value="imaging">Imaging</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="basic" className="space-y-4">
                    <div className="grid gap-4">
                      {getCategoryTests('basic').map(test => (
                        <div key={test.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-white font-bold text-sm">{test.name}</h4>
                            <div className="flex items-center space-x-2">
                              <Badge className="text-xs bg-green-600">
                                {test.cost} QUID
                              </Badge>
                              <Badge variant="outline" className="text-white border-white/30 text-xs">
                                {test.urgency}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-white/70 text-xs mb-2">{test.description}</p>
                          <p className="text-white/60 text-xs mb-3">Tube: {test.tubeType}</p>
                          <Button
                            size="sm"
                            onClick={() => orderTest(test)}
                            disabled={selectedTests.some(t => t.id === test.id)}
                            className="bg-green-600 hover:bg-green-700 text-white text-xs"
                          >
                            {selectedTests.some(t => t.id === test.id) ? 'Ordered' : 'Order Test'}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="specialized" className="space-y-4">
                    <div className="grid gap-4">
                      {getCategoryTests('specialized').map(test => (
                        <div key={test.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-white font-bold text-sm">{test.name}</h4>
                            <div className="flex items-center space-x-2">
                              <Badge className="text-xs bg-purple-600">
                                {test.cost} QUID
                              </Badge>
                              <Badge variant="outline" className="text-white border-white/30 text-xs">
                                {test.urgency}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-white/70 text-xs mb-2">{test.description}</p>
                          <p className="text-white/60 text-xs mb-3">Tube: {test.tubeType}</p>
                          <Button
                            size="sm"
                            onClick={() => orderTest(test)}
                            disabled={selectedTests.some(t => t.id === test.id)}
                            className="bg-purple-600 hover:bg-purple-700 text-white text-xs"
                          >
                            {selectedTests.some(t => t.id === test.id) ? 'Ordered' : 'Order Test'}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="imaging" className="space-y-6">
                    <div className="grid gap-4">
                      {getCategoryTests('imaging').map(test => (
                        <div key={test.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-white font-bold text-sm">{test.name}</h4>
                            <div className="flex items-center space-x-2">
                              <Badge className="text-xs bg-red-600">
                                {test.cost} QUID
                              </Badge>
                              <Badge variant="outline" className="text-white border-white/30 text-xs">
                                {test.urgency}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-white/70 text-xs mb-2">{test.description}</p>
                          <p className="text-white/60 text-xs mb-3">Sample: {test.tubeType}</p>
                          <Button
                            size="sm"
                            onClick={() => orderTest(test)}
                            disabled={selectedTests.some(t => t.id === test.id)}
                            className="bg-red-600 hover:bg-red-700 text-white text-xs"
                          >
                            {selectedTests.some(t => t.id === test.id) ? 'Ordered' : 'Order Study'}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </GlassmorphicCard>
          </div>

          {/* Results and Analysis Panel */}
          <div className="space-y-6">
            {/* Test Results */}
            {testResults.length > 0 && (
              <GlassmorphicCard intensity="medium" color="green">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Microscope className="h-6 w-6 mr-2 text-green-400" />
                    Test Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 max-h-96 overflow-y-auto">
                  {testResults.map((result, index) => (
                    <div key={index} className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-bold text-sm">{result.testName}</h4>
                        <Badge className={result.result.abnormal ? "bg-red-600" : "bg-green-600"}>
                          {result.result.abnormal ? "Abnormal" : "Normal"}
                        </Badge>
                      </div>
                      
                      {result.result.finding ? (
                        <div className="space-y-2">
                          <p className="text-white/80 text-xs">
                            <strong>Finding:</strong> {result.result.finding}
                          </p>
                          <p className="text-white/70 text-xs">{result.result.description}</p>
                          <p className="text-white/90 text-xs">
                            <strong>Impression:</strong> {result.result.impression}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {typeof result.result === 'object' && result.result.hemoglobin ? (
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="text-white/80">Hgb: {result.result.hemoglobin.value} {result.result.hemoglobin.unit}</div>
                              <div className="text-white/80">Hct: {result.result.hematocrit.value} {result.result.hematocrit.unit}</div>
                              <div className="text-white/80">WBC: {result.result.wbc.value} {result.result.wbc.unit}</div>
                              <div className="text-white/80">Plt: {result.result.platelets.value} {result.result.platelets.unit}</div>
                            </div>
                          ) : (
                            <p className="text-white/80 text-xs">
                              Value: {typeof result.result.value !== 'undefined' ? result.result.value : 'Processing...'} {result.result.unit || ''}
                            </p>
                          )}
                          {result.result.normal && (
                            <p className="text-white/60 text-xs">Reference: {result.result.normal}</p>
                          )}
                        </div>
                      )}
                      
                      <p className="text-white/50 text-xs mt-2">Completed: {result.timestamp}</p>
                    </div>
                  ))}
                </CardContent>
              </GlassmorphicCard>
            )}

            {/* Diagnosis Input */}
            <GlassmorphicCard intensity="medium" color="orange">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Brain className="h-6 w-6 mr-2 text-orange-400" />
                  Your Diagnosis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Input
                    value={userDiagnosis}
                    onChange={(e) => setUserDiagnosis(e.target.value)}
                    placeholder="Enter your suspected diagnosis..."
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/60"
                  />
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    onClick={submitDiagnosis}
                    disabled={!userDiagnosis.trim() || gameState === 'diagnosed'}
                    className="flex-1 bg-orange-600 hover:bg-orange-700"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Submit Diagnosis
                  </Button>
                </div>

                {/* Progress for current case */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-white/70">
                    <span>Case Progress</span>
                    <span>{selectedTests.length} tests ordered</span>
                  </div>
                  <Progress 
                    value={(selectedTests.length / Math.min(availableTests.length, 8)) * 100} 
                    className="h-2"
                  />
                </div>
              </CardContent>
            </GlassmorphicCard>

            {/* Diagnosis Analyzer Component */}
            {testResults.length > 0 && (
              <DiagnosisAnalyzer 
                patient={currentCase.patient} 
                testResults={testResults}
                onScoreUpdate={(points) => setScore(prev => prev + points)}
              />
            )}
          </div>
        </div>

        {/* Feedback Dialog */}
        <Dialog open={showFeedback} onOpenChange={setShowFeedback}>
          <DialogContent className="bg-slate-800 border-slate-600">
            <DialogHeader>
              <DialogTitle className="text-white flex items-center">
                {isCorrectDiagnosis ? (
                  <CheckCircle className="h-6 w-6 mr-2 text-green-400" />
                ) : (
                  <XCircle className="h-6 w-6 mr-2 text-red-400" />
                )}
                {isCorrectDiagnosis ? 'Correct Diagnosis!' : 'Wrong Diagnosis - Try Again!'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="text-white space-y-2">
                <p><strong>Your Diagnosis:</strong> {userDiagnosis}</p>
                <p><strong>Correct Diagnosis:</strong> {currentCase.correctDiagnosis}</p>
                
                {isCorrectDiagnosis && (
                  <div className="p-4 bg-green-900/30 rounded-lg border border-green-600/30">
                    <h4 className="font-semibold text-green-400 mb-2">Excellent Work!</h4>
                    <p className="text-sm text-white/80">
                      You correctly identified {currentCase.correctDiagnosis}. This demonstrates 
                      good clinical reasoning and appropriate use of diagnostic tests.
                    </p>
                  </div>
                )}
                
                {!isCorrectDiagnosis && (
                  <div className="p-4 bg-red-900/30 rounded-lg border border-red-600/30">
                    <h4 className="font-semibold text-red-400 mb-2">Learning Opportunity</h4>
                    <p className="text-sm text-white/80">
                      Review the test results and clinical presentation. Consider the key 
                      diagnostic features that point to {currentCase.correctDiagnosis}.
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-2">
                {isCorrectDiagnosis ? (
                  <>
                    <Button
                      onClick={nextCase}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {currentCaseIndex < level2Cases.length - 1 ? 'Next Case' : 'Complete Level'}
                    </Button>
                    <Button
                      onClick={() => window.location.href = '/'}
                      variant="outline"
                      className="text-white border-white/30"
                    >
                      Exit Game
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={() => {
                        setShowFeedback(false);
                        setGameState('playing');
                        setUserDiagnosis('');
                      }}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Try Again
                    </Button>
                    <Button
                      onClick={() => window.location.href = '/'}
                      variant="outline"
                      className="text-white border-white/30"
                    >
                      Exit Game
                    </Button>
                  </>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Level2;
