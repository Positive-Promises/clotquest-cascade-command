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
  Activity,
  Zap,
  Heart
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
import { level2Patients, getPatientsByDifficulty, getRandomPatient } from '@/data/level2Cases';

interface DiagnosticTest {
  id: string;
  name: string;
  category: 'basic' | 'specialized' | 'genetic' | 'microscopy' | 'imaging';
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

// Enhanced diagnostic tests with missing tests added
const availableTests: DiagnosticTest[] = [
  // Basic Tests
  {
    id: 'pt',
    name: 'Prothrombin Time (PT)',
    category: 'basic',
    cost: 50,
    timeToComplete: 3,
    description: 'Measures extrinsic coagulation pathway function',
    indications: ['Bleeding disorders', 'Liver function', 'Warfarin monitoring'],
    normalRange: '11-13 seconds',
    specificity: 85,
    sensitivity: 90,
    tubeType: 'Blue top (sodium citrate)'
  },
  {
    id: 'aptt',
    name: 'Activated Partial Thromboplastin Time (aPTT)',
    category: 'basic',
    cost: 50,
    timeToComplete: 3,
    description: 'Measures intrinsic coagulation pathway function',
    indications: ['Bleeding disorders', 'Heparin monitoring', 'Factor deficiencies'],
    normalRange: '25-35 seconds',
    specificity: 80,
    sensitivity: 95,
    tubeType: 'Blue top (sodium citrate)'
  },
  {
    id: 'platelet_count',
    name: 'Platelet Count',
    category: 'basic',
    cost: 30,
    timeToComplete: 2,
    description: 'Counts circulating platelets',
    indications: ['Bleeding disorders', 'Thrombocytopenia', 'Complete blood count'],
    normalRange: '150,000-450,000/μL',
    specificity: 95,
    sensitivity: 98,
    tubeType: 'Purple top (EDTA)'
  },
  {
    id: 'bleeding_time',
    name: 'Bleeding Time',
    category: 'basic',
    cost: 40,
    timeToComplete: 15,
    description: 'Measures primary hemostasis function',
    indications: ['Platelet function disorders', 'von Willebrand disease'],
    normalRange: '2-7 minutes',
    specificity: 70,
    sensitivity: 75,
    tubeType: 'No tube required'
  },
  {
    id: 'inr',
    name: 'INR (International Normalized Ratio)',
    category: 'basic',
    cost: 45,
    timeToComplete: 3,
    description: 'Standardized PT for warfarin monitoring',
    indications: ['Warfarin monitoring', 'Liver function assessment'],
    normalRange: '0.9-1.2',
    specificity: 90,
    sensitivity: 92,
    tubeType: 'Blue top (sodium citrate)'
  },
  {
    id: 'd_dimer',
    name: 'D-Dimer',
    category: 'basic',
    cost: 80,
    timeToComplete: 4,
    description: 'Measures fibrin degradation products',
    indications: ['DVT/PE screening', 'DIC diagnosis', 'Thrombosis workup'],
    normalRange: '<500 ng/mL',
    specificity: 40,
    sensitivity: 95,
    tubeType: 'Blue top (sodium citrate)'
  },
  {
    id: 'fibrinogen',
    name: 'Fibrinogen Level',
    category: 'basic',
    cost: 70,
    timeToComplete: 4,
    description: 'Measures fibrinogen concentration',
    indications: ['DIC diagnosis', 'Bleeding disorders', 'Liver function'],
    normalRange: '200-400 mg/dL',
    specificity: 85,
    sensitivity: 80,
    tubeType: 'Blue top (sodium citrate)'
  },

  // Specialized Tests
  {
    id: 'factor_viii',
    name: 'Factor VIII Activity',
    category: 'specialized',
    cost: 150,
    timeToComplete: 4,
    description: 'Measures Factor VIII coagulant activity',
    indications: ['Hemophilia A', 'von Willebrand disease'],
    normalRange: '50-150%',
    specificity: 95,
    sensitivity: 98,
    tubeType: 'Blue top (sodium citrate)'
  },
  {
    id: 'factor_ix',
    name: 'Factor IX Activity',
    category: 'specialized',
    cost: 150,
    timeToComplete: 4,
    description: 'Measures Factor IX coagulant activity',
    indications: ['Hemophilia B', 'Factor IX deficiency'],
    normalRange: '50-150%',
    specificity: 95,
    sensitivity: 98,
    tubeType: 'Blue top (sodium citrate)'
  },
  {
    id: 'vwf_antigen',
    name: 'von Willebrand Factor Antigen',
    category: 'specialized',
    cost: 120,
    timeToComplete: 5,
    description: 'Measures vWF protein levels',
    indications: ['von Willebrand disease', 'Bleeding disorders'],
    normalRange: '50-150%',
    specificity: 90,
    sensitivity: 95,
    tubeType: 'Blue top (sodium citrate)'
  },
  {
    id: 'vwf_activity',
    name: 'von Willebrand Factor Activity (Ristocetin)',
    category: 'specialized',
    cost: 130,
    timeToComplete: 6,
    description: 'Measures vWF functional activity',
    indications: ['von Willebrand disease classification'],
    normalRange: '50-150%',
    specificity: 88,
    sensitivity: 92,
    tubeType: 'Blue top (sodium citrate)'
  },
  {
    id: 'antithrombin',
    name: 'Antithrombin III',
    category: 'specialized',
    cost: 140,
    timeToComplete: 5,
    description: 'Natural anticoagulant protein',
    indications: ['Thrombophilia workup', 'Recurrent thrombosis'],
    normalRange: '80-120%',
    specificity: 90,
    sensitivity: 85,
    tubeType: 'Blue top (sodium citrate)'
  },
  {
    id: 'protein_c',
    name: 'Protein C Activity',
    category: 'specialized',
    cost: 160,
    timeToComplete: 6,
    description: 'Natural anticoagulant protein',
    indications: ['Thrombophilia screening', 'Family history of clots'],
    normalRange: '70-130%',
    specificity: 88,
    sensitivity: 82,
    tubeType: 'Blue top (sodium citrate)'
  },
  {
    id: 'protein_s',
    name: 'Protein S Activity',
    category: 'specialized',
    cost: 160,
    timeToComplete: 6,
    description: 'Cofactor for protein C anticoagulant activity',
    indications: ['Thrombophilia workup', 'Recurrent DVT/PE'],
    normalRange: '65-140%',
    specificity: 85,
    sensitivity: 78,
    tubeType: 'Blue top (sodium citrate)'
  },

  // Genetic Tests
  {
    id: 'factor_v_leiden',
    name: 'Factor V Leiden Mutation',
    category: 'genetic',
    cost: 200,
    timeToComplete: 24,
    description: 'Genetic test for thrombophilia',
    indications: ['Recurrent thrombosis', 'Family history of clots'],
    normalRange: 'No mutation detected',
    specificity: 99,
    sensitivity: 99,
    tubeType: 'Purple top (EDTA)'
  },
  {
    id: 'prothrombin_gene',
    name: 'Prothrombin Gene Mutation',
    category: 'genetic',
    cost: 200,
    timeToComplete: 24,
    description: 'Genetic test for prothrombin G20210A',
    indications: ['Recurrent thrombosis', 'Unexplained clots'],
    normalRange: 'No mutation detected',
    specificity: 99,
    sensitivity: 99,
    tubeType: 'Purple top (EDTA)'
  },
  {
    id: 'mthfr_mutation',
    name: 'MTHFR Gene Mutation',
    category: 'genetic',
    cost: 180,
    timeToComplete: 24,
    description: 'Genetic test for methylenetetrahydrofolate reductase',
    indications: ['Thrombophilia workup', 'Hyperhomocysteinemia'],
    normalRange: 'No significant mutations',
    specificity: 95,
    sensitivity: 92,
    tubeType: 'Purple top (EDTA)'
  },

  // Microscopy & Morphology
  {
    id: 'peripheral_smear',
    name: 'Peripheral Blood Smear',
    category: 'microscopy',
    cost: 80,
    timeToComplete: 8,
    description: 'Microscopic examination of blood cells',
    indications: ['Abnormal CBC', 'Suspected hematologic disorder'],
    normalRange: 'Normal morphology',
    specificity: 85,
    sensitivity: 80,
    tubeType: 'Purple top (EDTA)'
  },
  {
    id: 'bone_marrow',
    name: 'Bone Marrow Biopsy',
    category: 'microscopy',
    cost: 500,
    timeToComplete: 48,
    description: 'Microscopic examination of bone marrow',
    indications: ['Suspected hematologic malignancy', 'Unexplained cytopenias'],
    normalRange: 'Normal cellularity and morphology',
    specificity: 95,
    sensitivity: 90,
    tubeType: 'Bone marrow aspirate'
  },

  // Imaging Tests (NEW)
  {
    id: 'duplex_doppler',
    name: 'Duplex Doppler Ultrasound',
    category: 'imaging',
    cost: 250,
    timeToComplete: 20,
    description: 'Combines B-mode ultrasound with Doppler flow assessment',
    indications: ['DVT diagnosis', 'Venous insufficiency', 'Arterial disease'],
    normalRange: 'No evidence of thrombosis',
    specificity: 95,
    sensitivity: 98,
    tubeType: 'No sample required'
  },
  {
    id: 'venous_doppler',
    name: 'Venous Doppler Ultrasound',
    category: 'imaging',
    cost: 200,
    timeToComplete: 15,
    description: 'Evaluates venous blood flow and patency',
    indications: ['DVT screening', 'Leg swelling', 'Suspected thrombosis'],
    normalRange: 'Patent veins with normal flow',
    specificity: 92,
    sensitivity: 95,
    tubeType: 'No sample required'
  },
  {
    id: 'ct_pulmonary_angio',
    name: 'CT Pulmonary Angiogram',
    category: 'imaging',
    cost: 400,
    timeToComplete: 30,
    description: 'CT scan with contrast to evaluate pulmonary vessels',
    indications: ['Pulmonary embolism', 'Chest pain', 'Shortness of breath'],
    normalRange: 'No pulmonary embolism detected',
    specificity: 96,
    sensitivity: 94,
    tubeType: 'No sample required'
  },
  {
    id: 'echocardiogram',
    name: 'Echocardiogram',
    category: 'imaging',
    cost: 300,
    timeToComplete: 25,
    description: 'Ultrasound of the heart to assess cardiac function',
    indications: ['Heart strain from PE', 'Cardiac function assessment'],
    normalRange: 'Normal cardiac structure and function',
    specificity: 85,
    sensitivity: 80,
    tubeType: 'No sample required'
  }
];

const Level2 = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [currency, setCurrency] = useState(2000); // Increased starting money
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
  const [selectedDifficulty, setSelectedDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [caseNumber, setCaseNumber] = useState(1);
  const [totalCases, setTotalCases] = useState(3);
  const [showDiagnosisResult, setShowDiagnosisResult] = useState(false);
  const [diagnosisCorrect, setDiagnosisCorrect] = useState(false);

  const checkDiagnosisCorrectness = (diagnosis: string): boolean => {
    if (!currentPatient) return false;
    
    const normalizedDiagnosis = diagnosis.toLowerCase().trim();
    const level2Patient = level2Patients.find(p => p.id === currentPatient.id);
    
    if (!level2Patient) return false;
    
    const correctDiagnosis = level2Patient.correctDiagnosis.toLowerCase();
    
    // More comprehensive keyword matching
    const keywordMap: { [key: string]: string[] } = {
      'von willebrand disease': ['vwd', 'von willebrand', 'willebrand'],
      'hemophilia a': ['hemophilia a', 'factor viii deficiency', 'factor 8 deficiency', 'haemophilia a'],
      'hemophilia b': ['hemophilia b', 'factor ix deficiency', 'factor 9 deficiency', 'haemophilia b'],
      'thrombotic thrombocytopenic purpura (ttp)': ['ttp', 'thrombotic thrombocytopenic purpura'],
      'hemolytic uremic syndrome (hus)': ['hus', 'hemolytic uremic syndrome'],
      'immune thrombocytopenic purpura (itp)': ['itp', 'immune thrombocytopenic purpura', 'idiopathic thrombocytopenic purpura'],
      'disseminated intravascular coagulation (dic)': ['dic', 'disseminated intravascular coagulation'],
      'factor v leiden mutation': ['factor v leiden', 'factor 5 leiden', 'leiden'],
      'warfarin over-anticoagulation': ['warfarin toxicity', 'over anticoagulation', 'warfarin overdose'],
      'liver disease coagulopathy': ['liver disease', 'hepatic coagulopathy', 'cirrhosis'],
      'platelet function disorder': ['platelet dysfunction', 'platelet function defect'],
      'myelodysplastic syndrome': ['myelodysplastic', 'mds']
    };

    const keywords = keywordMap[correctDiagnosis] || [];
    return normalizedDiagnosis.includes(correctDiagnosis) ||
           correctDiagnosis.includes(normalizedDiagnosis) ||
           keywords.some(keyword => normalizedDiagnosis.includes(keyword));
  };

  // Enhanced test result generation based on actual patient conditions
  const generateTestResult = (test: DiagnosticTest, patient: Patient | null): TestResult => {
    if (!patient) return { testId: test.id, value: 'N/A', interpretation: 'No patient', abnormalFlags: [], followUpSuggestions: [] };

    const level2Patient = level2Patients.find(p => p.id === patient.id);
    const condition = level2Patient?.correctDiagnosis.toLowerCase() || '';

    // Condition-specific test results
    const conditionResults: { [key: string]: { [key: string]: TestResult } } = {
      'von willebrand disease': {
        'bleeding_time': {
          testId: 'bleeding_time',
          value: '12 minutes',
          interpretation: 'Prolonged bleeding time',
          abnormalFlags: ['High'],
          followUpSuggestions: ['Check von Willebrand studies', 'Consider platelet function testing']
        },
        'vwf_antigen': {
          testId: 'vwf_antigen',
          value: '35%',
          interpretation: 'Low von Willebrand factor antigen',
          abnormalFlags: ['Low'],
          followUpSuggestions: ['Confirm with vWF activity', 'Consider desmopressin trial']
        },
        'vwf_activity': {
          testId: 'vwf_activity',
          value: '25%',
          interpretation: 'Severely reduced vWF activity',
          abnormalFlags: ['Critical Low'],
          followUpSuggestions: ['von Willebrand Disease confirmed', 'Multimer analysis recommended']
        }
      },
      'hemophilia a': {
        'aptt': {
          testId: 'aptt',
          value: '68.5 seconds',
          interpretation: 'Significantly prolonged aPTT',
          abnormalFlags: ['Critical High'],
          followUpSuggestions: ['Factor VIII or IX deficiency likely', 'Order specific factor assays']
        },
        'factor_viii': {
          testId: 'factor_viii',
          value: '2%',
          interpretation: 'Severe Factor VIII deficiency',
          abnormalFlags: ['Critical Low'],
          followUpSuggestions: ['Severe Hemophilia A confirmed', 'Genetic counseling recommended']
        }
      },
      'factor v leiden mutation': {
        'd_dimer': {
          testId: 'd_dimer',
          value: '850 ng/mL',
          interpretation: 'Elevated D-dimer',
          abnormalFlags: ['High'],
          followUpSuggestions: ['Suggests recent thrombosis', 'Consider imaging studies']
        },
        'duplex_doppler': {
          testId: 'duplex_doppler',
          value: 'Acute thrombus in left femoral vein',
          interpretation: 'Deep vein thrombosis identified',
          abnormalFlags: ['Abnormal'],
          followUpSuggestions: ['DVT confirmed', 'Anticoagulation therapy indicated']
        },
        'factor_v_leiden': {
          testId: 'factor_v_leiden',
          value: 'Heterozygous mutation detected',
          interpretation: 'Factor V Leiden mutation present',
          abnormalFlags: ['Abnormal'],
          followUpSuggestions: ['Thrombophilia confirmed', 'Long-term anticoagulation consideration']
        }
      },
      'thrombotic thrombocytopenic purpura (ttp)': {
        'platelet_count': {
          testId: 'platelet_count',
          value: '15,000/μL',
          interpretation: 'Severe thrombocytopenia',
          abnormalFlags: ['Critical Low'],
          followUpSuggestions: ['TTP suspected', 'Urgent hematology consultation']
        },
        'peripheral_smear': {
          testId: 'peripheral_smear',
          value: 'Schistocytes present, fragmented RBCs',
          interpretation: 'Microangiopathic hemolytic anemia',
          abnormalFlags: ['Abnormal'],
          followUpSuggestions: ['Consistent with TTP', 'Plasmapheresis indicated']
        }
      },
      'disseminated intravascular coagulation (dic)': {
        'platelet_count': {
          testId: 'platelet_count',
          value: '45,000/μL',
          interpretation: 'Severe thrombocytopenia',
          abnormalFlags: ['Critical Low'],
          followUpSuggestions: ['DIC likely', 'Check coagulation studies']
        },
        'd_dimer': {
          testId: 'd_dimer',
          value: '4500 ng/mL',
          interpretation: 'Markedly elevated D-dimer',
          abnormalFlags: ['Critical High'],
          followUpSuggestions: ['Consistent with DIC', 'Treat underlying cause']
        },
        'fibrinogen': {
          testId: 'fibrinogen',
          value: '85 mg/dL',
          interpretation: 'Low fibrinogen',
          abnormalFlags: ['Low'],
          followUpSuggestions: ['DIC pattern confirmed', 'Consider cryoprecipitate']
        }
      }
    };

    // Get condition-specific result or default normal result
    const conditionResult = conditionResults[condition]?.[test.id];
    if (conditionResult) {
      return conditionResult;
    }

    // Default normal results
    return {
      testId: test.id,
      value: test.normalRange.includes('-') ? 
        test.normalRange.split('-')[0] + ' (Normal)' : 
        'Normal',
      interpretation: 'Within normal limits',
      abnormalFlags: [],
      followUpSuggestions: []
    };
  };

  useEffect(() => {
    if (gameStarted) {
      const timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameStarted]);

  // Convert level2Patients to the expected Patient interface
  const convertToPatient = (level2Patient: any): Patient => {
    return {
      id: level2Patient.id,
      name: level2Patient.name,
      age: level2Patient.age,
      gender: level2Patient.gender,
      symptoms: level2Patient.symptoms,
      clinicalHistory: level2Patient.clinicalHistory
    };
  };

  const startGame = () => {
    setGameStarted(true);
    const randomPatient = getRandomPatient();
    setCurrentPatient(convertToPatient(randomPatient));
    setCaseNumber(1);
    setScore(0);
    setCurrency(2000);
    setSelectedTests([]);
    setTestResults([]);
    setSampleCollected(false);
    setSelectedTubeType('');
    setUserDiagnosis('');
    setCurrentTab('overview');
    toast({
      title: "🔬 Diagnostic Detective Started!",
      description: `Welcome to the laboratory! Case 1/${totalCases} - ${selectedDifficulty} difficulty`,
    });
  };

  const nextCase = () => {
    if (caseNumber < totalCases) {
      const difficultyPatients = getPatientsByDifficulty(selectedDifficulty);
      const randomPatient = difficultyPatients[Math.floor(Math.random() * difficultyPatients.length)];
      setCurrentPatient(convertToPatient(randomPatient));
      setCaseNumber(prev => prev + 1);
      
      // Reset case-specific state
      setSelectedTests([]);
      setTestResults([]);
      setSampleCollected(false);
      setSelectedTubeType('');
      setUserDiagnosis('');
      setCurrentTab('overview');
      
      toast({
        title: "📋 New Case Loaded!",
        description: `Case ${caseNumber + 1}/${totalCases}`,
      });
    } else {
      // Complete level
      setLevel2Complete(true);
      setShowCompletionDialog(true);
    }
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

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const resetLevel = () => {
    setScore(0);
    setCurrency(2000);
    setTimeElapsed(0);
    setSelectedTests([]);
    setTestResults([]);
    const randomPatient = getRandomPatient();
    setCurrentPatient(convertToPatient(randomPatient));
    setSampleCollected(false);
    setSelectedTubeType('');
    setLevel2Complete(false);
    setShowCompletionDialog(false);
    setGameStarted(true);
    setCaseNumber(1);
    setUserDiagnosis('');
    setCurrentTab('overview');
  };

  const submitDiagnosis = () => {
    if (!userDiagnosis.trim()) return;

    const isCorrect = checkDiagnosisCorrectness(userDiagnosis);
    setDiagnosisCorrect(isCorrect);
    setShowDiagnosisResult(true);

    if (isCorrect) {
      setScore(prev => prev + 200);
    } else {
      setScore(prev => prev + 50);
    }
  };

  const handleDiagnosisResult = (nextCase: boolean) => {
    setShowDiagnosisResult(false);
    if (nextCase && diagnosisCorrect) {
      if (caseNumber < totalCases) {
        // Move to next case
        const difficultyPatients = getPatientsByDifficulty(selectedDifficulty);
        const randomPatient = difficultyPatients[Math.floor(Math.random() * difficultyPatients.length)];
        setCurrentPatient(convertToPatient(randomPatient));
        setCaseNumber(prev => prev + 1);
        
        // Reset case-specific state
        setSelectedTests([]);
        setTestResults([]);
        setSampleCollected(false);
        setSelectedTubeType('');
        setUserDiagnosis('');
        setCurrentTab('overview');
        
        toast({
          title: "📋 New Case Loaded!",
          description: `Case ${caseNumber + 1}/${totalCases}`,
        });
      } else {
        setLevel2Complete(true);
        setShowCompletionDialog(true);
      }
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'basic': return 'bg-green-600';
      case 'specialized': return 'bg-blue-600';
      case 'genetic': return 'bg-purple-600';
      case 'microscopy': return 'bg-orange-600';
      case 'imaging': return 'bg-orange-600';
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
                {gameStarted && (
                  <p className="text-green-300 text-sm mt-1">
                    Case {caseNumber}/{totalCases} • {selectedDifficulty} difficulty
                  </p>
                )}
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
              
              {/* Difficulty Selection */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-4">Select Difficulty:</h3>
                <div className="flex justify-center space-x-4 mb-4">
                  {(['beginner', 'intermediate', 'advanced'] as const).map((diff) => (
                    <Button
                      key={diff}
                      onClick={() => setSelectedDifficulty(diff)}
                      variant={selectedDifficulty === diff ? 'default' : 'outline'}
                      className={`px-6 py-3 capitalize ${selectedDifficulty === diff ? 'bg-green-600 hover:bg-green-700' : 'border-white/30 text-white hover:bg-white/10'}`}
                    >
                      {diff}
                    </Button>
                  ))}
                </div>
                <p className="text-white/60 text-sm">
                  {selectedDifficulty === 'beginner' && 'Classic hereditary bleeding disorders'}
                  {selectedDifficulty === 'intermediate' && 'Complex cases with multiple factors'}
                  {selectedDifficulty === 'advanced' && 'Emergency situations requiring rapid diagnosis'}
                </p>
              </div>

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
                  {gameMode === 'quiz' ? 'Traditional quiz format with scoring and progression through cases' : 'Analyze any diagnosis with evidence-based feedback and educational exploration'}
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
            <TabsList className="grid w-full grid-cols-6 bg-white/10 backdrop-blur-lg border border-white/20">
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
              <TabsTrigger value="imaging" className="data-[state=active]:bg-white/20">
                <Zap className="h-4 w-4 mr-2" />
                Imaging
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

            <TabsContent value="imaging" className="space-y-6">
              <GlassmorphicCard intensity="medium" color="orange">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Zap className="h-6 w-6 mr-2 text-orange-400" />
                    Imaging Studies
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {availableTests.filter(test => test.category === 'imaging').map((test) => (
                    <div key={test.id} className="bg-white/5 p-4 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-200">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-bold text-sm">{test.name}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge className="text-xs bg-orange-600">
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
                          disabled={selectedTests.some(t => t.id === test.id)}
                          className="bg-orange-600 hover:bg-orange-700 text-white text-xs"
                        >
                          {selectedTests.some(t => t.id === test.id) ? 'Ordered' : 'Order Study'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </GlassmorphicCard>
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
                            {testResults.some(r => r.testId === 'vwf_antigen' && r.abnormalFlags.includes('Low')) && (
                              <div className="flex items-center space-x-2">
                                <CheckCircle className="h-4 w-4 text-green-400" />
                                <span>Low vWF antigen suggests von Willebrand Disease</span>
                              </div>
                            )}
                            {testResults.some(r => r.testId === 'd_dimer' && r.abnormalFlags.includes('High')) && (
                              <div className="flex items-center space-x-2">
                                <AlertTriangle className="h-4 w-4 text-yellow-400" />
                                <span>Elevated D-Dimer suggests thrombosis or DIC</span>
                              </div>
                            )}
                            {testResults.some(r => r.testId === 'duplex_doppler' && r.abnormalFlags.includes('Abnormal')) && (
                              <div className="flex items-center space-x-2">
                                <CheckCircle className="h-4 w-4 text-green-400" />
                                <span>Duplex Doppler confirms deep vein thrombosis</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Enhanced Diagnosis Input Section */}
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
                              placeholder="Type your diagnosis here..."
                              className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-blue-400"
                            />
                            <Button 
                              className="w-full bg-green-600 hover:bg-green-700 p-4"
                              disabled={!userDiagnosis.trim()}
                              onClick={submitDiagnosis}
                            >
                              <Target className="h-4 w-4 mr-2" />
                              Submit Diagnosis
                            </Button>
                          </div>
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

      {/* Diagnosis Result Dialog */}
      <AlertDialog open={showDiagnosisResult} onOpenChange={() => {}}>
        <AlertDialogContent className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 border border-blue-400/30 backdrop-blur-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className={`text-center text-2xl font-bold ${diagnosisCorrect ? 'text-green-400' : 'text-red-400'}`}>
              {diagnosisCorrect ? '🎯 CORRECT DIAGNOSIS!' : '❌ WRONG DIAGNOSIS'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-lg text-gray-300">
              {diagnosisCorrect ? (
                <>
                  Excellent work! You correctly diagnosed: <strong>{userDiagnosis}</strong>
                  <br />+200 points earned!
                </>
              ) : (
                <>
                  <strong>{userDiagnosis}</strong> is not the correct diagnosis.
                  <br />Review the test results and try again. +50 points for effort.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-center space-x-4">
            {diagnosisCorrect ? (
              <>
                <AlertDialogAction 
                  onClick={() => handleDiagnosisResult(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {caseNumber < totalCases ? 'NEXT CASE' : 'COMPLETE LEVEL'}
                </AlertDialogAction>
                <AlertDialogAction 
                  onClick={() => navigate('/')}
                  className="bg-gray-600 hover:bg-gray-700"
                >
                  EXIT GAME
                </AlertDialogAction>
              </>
            ) : (
              <>
                <AlertDialogAction 
                  onClick={() => handleDiagnosisResult(false)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  TRY AGAIN
                </AlertDialogAction>
                <AlertDialogAction 
                  onClick={() => navigate('/')}
                  className="bg-red-600 hover:bg-red-700"
                >
                  EXIT GAME
                </AlertDialogAction>
              </>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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

      {/* Completion Dialog */}
      <AlertDialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <AlertDialogContent className="bg-gradient-to-br from-slate-900 via-blue-900 to-green-900 border border-green-400/30 backdrop-blur-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-2xl font-bold text-green-400">
              Level Complete!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-lg text-gray-300">
              Congratulations! You have completed all cases for Level 2.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-center space-x-4">
            <AlertDialogAction 
              onClick={() => {
                resetLevel();
                setShowCompletionDialog(false);
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Play Again
            </AlertDialogAction>
            <AlertDialogAction 
              onClick={() => navigate('/')}
              className="bg-green-600 hover:bg-green-700"
            >
              Exit to Home
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Level2;
