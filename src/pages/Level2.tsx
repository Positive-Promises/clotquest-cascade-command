
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  Microscope, 
  TestTube, 
  Clock, 
  Target, 
  CheckCircle, 
  XCircle, 
  ArrowRight,
  AlertTriangle,
  BookOpen,
  Brain,
  Stethoscope
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LabTest {
  id: string;
  name: string;
  fullName: string;
  cost: number;
  timeMinutes: number;
  category: 'basic' | 'specialized' | 'genetic';
  description: string;
  normalRange: string;
  clinicalUse: string;
}

interface PatientCase {
  id: string;
  name: string;
  age: number;
  gender: string;
  chiefComplaint: string;
  history: string;
  physicalExam: string;
  symptoms: string[];
  correctTests: string[];
  correctDiagnosis: string;
  incorrectTests: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

const Level2 = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentCase, setCurrentCase] = useState(0);
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [budget, setBudget] = useState(1000);
  const [phase, setPhase] = useState<'assessment' | 'testing' | 'diagnosis' | 'complete'>('assessment');
  const [finalDiagnosis, setFinalDiagnosis] = useState('');

  const labTests: LabTest[] = [
    {
      id: 'pt',
      name: 'PT/INR',
      fullName: 'Prothrombin Time/International Normalized Ratio',
      cost: 50,
      timeMinutes: 30,
      category: 'basic',
      description: 'Evaluates extrinsic and common coagulation pathways',
      normalRange: 'PT: 11-13 seconds, INR: 0.8-1.2',
      clinicalUse: 'Monitor warfarin therapy, liver function, vitamin K deficiency'
    },
    {
      id: 'aptt',
      name: 'aPTT',
      fullName: 'Activated Partial Thromboplastin Time',
      cost: 45,
      timeMinutes: 25,
      category: 'basic',
      description: 'Evaluates intrinsic and common coagulation pathways',
      normalRange: '25-35 seconds',
      clinicalUse: 'Monitor heparin therapy, hemophilia screening'
    },
    {
      id: 'platelet',
      name: 'Platelet Count',
      fullName: 'Platelet Count and Function',
      cost: 30,
      timeMinutes: 15,
      category: 'basic',
      description: 'Quantifies platelet number and basic function',
      normalRange: '150,000-450,000/μL',
      clinicalUse: 'Bleeding disorders, thrombocytopenia evaluation'
    },
    {
      id: 'bleeding_time',
      name: 'Bleeding Time',
      fullName: 'Template Bleeding Time',
      cost: 40,
      timeMinutes: 45,
      category: 'basic',
      description: 'Measures primary hemostasis in vivo',
      normalRange: '2-9 minutes',
      clinicalUse: 'Platelet function disorders, von Willebrand disease'
    },
    {
      id: 'fibrinogen',
      name: 'Fibrinogen',
      fullName: 'Fibrinogen Level',
      cost: 60,
      timeMinutes: 20,
      category: 'specialized',
      description: 'Measures fibrinogen concentration',
      normalRange: '200-400 mg/dL',
      clinicalUse: 'DIC, liver disease, congenital deficiency'
    },
    {
      id: 'factor8',
      name: 'Factor VIII',
      fullName: 'Factor VIII Activity Assay',
      cost: 120,
      timeMinutes: 60,
      category: 'specialized',
      description: 'Measures Factor VIII clotting activity',
      normalRange: '50-150% of normal',
      clinicalUse: 'Hemophilia A diagnosis and monitoring'
    },
    {
      id: 'factor9',
      name: 'Factor IX',
      fullName: 'Factor IX Activity Assay',
      cost: 120,
      timeMinutes: 60,
      category: 'specialized',
      description: 'Measures Factor IX clotting activity',
      normalRange: '50-150% of normal',
      clinicalUse: 'Hemophilia B diagnosis and monitoring'
    },
    {
      id: 'vwf',
      name: 'vWF Studies',
      fullName: 'von Willebrand Factor Studies',
      cost: 150,
      timeMinutes: 90,
      category: 'specialized',
      description: 'Comprehensive vWF antigen, activity, and multimer analysis',
      normalRange: 'vWF:Ag 50-150%, vWF:RCo >50%',
      clinicalUse: 'von Willebrand disease diagnosis and classification'
    },
    {
      id: 'protein_c',
      name: 'Protein C',
      fullName: 'Protein C Activity',
      cost: 100,
      timeMinutes: 50,
      category: 'specialized',
      description: 'Measures anticoagulant Protein C activity',
      normalRange: '70-140% of normal',
      clinicalUse: 'Thrombophilia evaluation, hereditary deficiency'
    },
    {
      id: 'factor5_leiden',
      name: 'Factor V Leiden',
      fullName: 'Factor V Leiden Mutation',
      cost: 200,
      timeMinutes: 120,
      category: 'genetic',
      description: 'PCR-based detection of Factor V Leiden mutation',
      normalRange: 'Negative for mutation',
      clinicalUse: 'Thrombophilia workup, recurrent VTE'
    }
  ];

  const patientCases: PatientCase[] = [
    {
      id: 'case1',
      name: 'James Miller',
      age: 12,
      gender: 'Male',
      chiefComplaint: 'Excessive bleeding after dental extraction',
      history: 'Previously healthy child with no significant medical history. Family history significant for maternal uncle with bleeding problems.',
      physicalExam: 'Large hematoma at extraction site, scattered bruises on legs',
      symptoms: ['prolonged bleeding', 'easy bruising', 'family history of bleeding'],
      correctTests: ['aptt', 'factor8', 'factor9'],
      correctDiagnosis: 'Hemophilia A',
      incorrectTests: ['pt', 'bleeding_time', 'factor5_leiden'],
      difficulty: 'easy'
    },
    {
      id: 'case2',
      name: 'Sarah Johnson',
      age: 28,
      gender: 'Female',
      chiefComplaint: 'Heavy menstrual bleeding and easy bruising',
      history: 'Lifelong history of heavy periods, nosebleeds, and bruising. Sister has similar symptoms.',
      physicalExam: 'Petechiae on arms, pallor consistent with anemia',
      symptoms: ['menorrhagia', 'epistaxis', 'mucocutaneous bleeding', 'family history'],
      correctTests: ['platelet', 'bleeding_time', 'vwf'],
      correctDiagnosis: 'von Willebrand Disease',
      incorrectTests: ['factor8', 'factor5_leiden', 'protein_c'],
      difficulty: 'medium'
    },
    {
      id: 'case3',
      name: 'Robert Chen',
      age: 45,
      gender: 'Male',
      chiefComplaint: 'Recurrent deep vein thrombosis',
      history: 'Third episode of DVT in 5 years. No obvious precipitating factors. Started on warfarin.',
      physicalExam: 'Swollen left calf, positive Homan\'s sign',
      symptoms: ['recurrent VTE', 'young age', 'no clear risk factors'],
      correctTests: ['pt', 'protein_c', 'factor5_leiden'],
      correctDiagnosis: 'Hereditary Thrombophilia',
      incorrectTests: ['bleeding_time', 'factor8', 'vwf'],
      difficulty: 'hard'
    }
  ];

  const currentPatient = patientCases[currentCase];

  useEffect(() => {
    if (gameStarted) {
      const timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);    
    }
  }, [gameStarted]);

  const handleTestSelection = (testId: string) => {
    const test = labTests.find(t => t.id === testId);
    if (!test) return;

    if (selectedTests.includes(testId)) {
      setSelectedTests(prev => prev.filter(id => id !== testId));
      setBudget(prev => prev + test.cost);
    } else {
      if (budget >= test.cost) {
        setSelectedTests(prev => [...prev, testId]);
        setBudget(prev => prev - test.cost);
      } else {
        toast({
          title: "Insufficient Budget",
          description: "You don't have enough budget for this test.",
          variant: "destructive"
        });
      }
    }
  };

  const runTests = () => {
    if (selectedTests.length === 0) {
      toast({
        title: "No Tests Selected",
        description: "Please select at least one test to run.",
        variant: "destructive"
      });
      return;
    }

    // Simulate test results based on current case
    const results: Record<string, any> = {};
    const patient = currentPatient;

    selectedTests.forEach(testId => {
      const test = labTests.find(t => t.id === testId);
      if (!test) return;

      // Generate realistic results based on the patient's condition
      switch (patient.correctDiagnosis) {
        case 'Hemophilia A':
          if (testId === 'aptt') results[testId] = { value: 65, unit: 'seconds', abnormal: true };
          else if (testId === 'factor8') results[testId] = { value: 15, unit: '% of normal', abnormal: true };
          else if (testId === 'pt') results[testId] = { value: 12, unit: 'seconds', abnormal: false };
          else results[testId] = { value: 'Normal', abnormal: false };
          break;
        case 'von Willebrand Disease':
          if (testId === 'bleeding_time') results[testId] = { value: 12, unit: 'minutes', abnormal: true };
          else if (testId === 'vwf') results[testId] = { value: 25, unit: '% of normal', abnormal: true };
          else if (testId === 'platelet') results[testId] = { value: 280000, unit: '/μL', abnormal: false };
          else results[testId] = { value: 'Normal', abnormal: false };
          break;
        case 'Hereditary Thrombophilia':
          if (testId === 'protein_c') results[testId] = { value: 45, unit: '% of normal', abnormal: true };
          else if (testId === 'factor5_leiden') results[testId] = { value: 'Heterozygous mutation detected', abnormal: true };
          else results[testId] = { value: 'Normal', abnormal: false };
          break;
        default:
          results[testId] = { value: 'Normal', abnormal: false };
      }
    });

    setTestResults(results);
    setPhase('testing');

    // Calculate score based on test selection efficiency
    const correctTestsSelected = selectedTests.filter(test => patient.correctTests.includes(test)).length;
    const incorrectTestsSelected = selectedTests.filter(test => patient.incorrectTests.includes(test)).length;
    const efficiency = (correctTestsSelected / selectedTests.length) * 100;
    
    setScore(prev => prev + Math.round(efficiency * 10) - (incorrectTestsSelected * 50));

    toast({
      title: "Tests Complete!",
      description: `Results are ready. Efficiency: ${efficiency.toFixed(1)}%`,
    });
  };

  const submitDiagnosis = () => {
    if (!finalDiagnosis) {
      toast({
        title: "No Diagnosis Selected",
        description: "Please select a diagnosis before submitting.",
        variant: "destructive"
      });
      return;
    }

    const isCorrect = finalDi{agnosis === currentPatient.correctDiagnosis;
    
    if (isCorrect) {
      setScore(prev => prev + 500);
      toast({
        title: "Correct Diagnosis!",
        description: `Excellent work! +500 points`,
      });
    } else {
      toast({
        title: "Incorrect Diagnosis",
        description: `The correct diagnosis was: ${currentPatient.correctDiagnosis}`,
        variant: "destructive"
      });
    }

    setPhase('complete');
  };

  const nextCase = () => {
    if (currentCase < patientCases.length - 1) {
      setCurrentCase(prev => prev + 1);
      setSelectedTests([]);
      setTestResults({});
      setBudget(1000);
      setPhase('assessment');
      setFinalDiagnosis('');
    } else {
      toast({
        title: "Level 2 Complete!",
        description: `Congratulations! Final Score: ${score}`,
      });
    }
  };

  const startGame = () => {
    setGameStarted(true);
    toast({
      title: "Level 2 Started!",
      description: "Analyze the patient and select appropriate tests.",
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 p-4">
      {/* Header */}
      <div className="container mx-auto mb-6">
        <Card className="bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between text-white">
              <div>
                <h1 className="text-3xl font-bold mb-2">Level 2: Diagnostic Detective</h1>
                <p className="text-green-200">Select and interpret lab tests to diagnose coagulation disorders</p>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{score}</div>
                  <div className="text-sm text-gray-300">Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">${budget}</div>
                  <div className="text-sm text-gray-300">Budget</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{formatTime(timeElapsed)}</div>
                  <div className="text-sm text-gray-300">Time</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="container mx-auto grid lg:grid-cols-3 gap-6">
        {/* Patient Case Panel */}
        <div className="lg:col-span-1">
          <Card className="bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 h-fit">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Stethoscope className="h-5 w-5 mr-2" />
                Patient Case {currentCase + 1}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-white space-y-4">
              <div>
                <h3 className="font-bold text-lg">{currentPatient.name}</h3>
                <p className="text-sm text-gray-300">{currentPatient.age} year old {currentPatient.gender}</p>
              </div>

              <div>
                <h4 className="font-semibold text-yellow-300 mb-1">Chief Complaint</h4>
                <p className="text-sm">{currentPatient.chiefComplaint}</p>
              </div>

              <div>
                <h4 className="font-semibold text-blue-300 mb-1">History</h4>
                <p className="text-sm">{currentPatient.history}</p>
              </div>

              <div>
                <h4 className="font-semibold text-green-300 mb-1">Physical Exam</h4>
                <p className="text-sm">{currentPatient.physicalExam}</p>
              </div>

              <div>
                <h4 className="font-semibold text-purple-300 mb-2">Key Symptoms</h4>
                <div className="flex flex-wrap gap-1">
                  {currentPatient.symptoms.map((symptom, index) => (
                    <Badge key={index} variant="outline" className="text-xs border-white/30 text-white">
                      {symptom}
                    </Badge>
                  ))}
                </div>
              </div>

              {!gameStarted && (
                <Button onClick={startGame} className="w-full bg-green-600 hover:bg-green-700">
                  <Target className="h-4 w-4 mr-2" />
                  Start Case Analysis
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Laboratory Testing Panel */}
        <div className="lg:col-span-2">
          {phase === 'assessment' && gameStarted && (
            <Card className="bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TestTube className="h-5 w-5 mr-2" />
                  Laboratory Test Selection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {labTests.map(test => (
                    <div
                      key={test.id}
                      onClick={() => handleTestSelection(test.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                        selectedTests.includes(test.id)
                          ? 'border-green-400 bg-green-100/10 text-white'
                          : 'border-gray-400 bg-white/5 text-gray-300 hover:border-blue-400 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-bold">{test.name}</div>
                        <Badge variant={test.category === 'basic' ? 'default' : test.category === 'specialized' ? 'secondary' : 'destructive'}>
                          {test.category}
                        </Badge>
                      </div>
                      <div className="text-sm mb-2">{test.fullName}</div>
                      <div className="text-xs text-gray-400 mb-2">{test.description}</div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {test.timeMinutes}min
                        </span>
                        <span className="font-bold">${test.cost}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-white">
                    Selected Tests: {selectedTests.length} | 
                    Total Cost: ${selectedTests.reduce((total, testId) => {
                      const test = labTests.find(t => t.id === testId);
                      return total + (test?.cost || 0);
                    }, 0)}
                  </div>
                  <Button 
                    onClick={runTests}
                    disabled={selectedTests.length === 0}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Microscope className="h-4 w-4 mr-2" />
                    Run Selected Tests
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {phase === 'testing' && (
            <Card className="bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TestTube className="h-5 w-5 mr-2" />
                  Laboratory Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  {Object.entries(testResults).map(([testId, result]) => {
                    const test = labTests.find(t => t.id === testId);
                    return (
                      <div key={testId} className="bg-white/5 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-bold text-white">{test?.name}</div>
                          {result.abnormal ? (
                            <XCircle className="h-5 w-5 text-red-400" />
                          ) : (
                            <CheckCircle className="h-5 w-5 text-green-400" />
                          )}
                        </div>
                        <div className="text-sm text-gray-300 mb-1">{test?.fullName}</div>
                        <div className="text-lg font-bold text-white">
                          {result.value} {result.unit || ''}
                        </div>
                        <div className="text-xs text-gray-400">
                          Normal Range: {test?.normalRange}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-white mb-2">Select Your Diagnosis:</h3>
                  {['Hemophilia A', 'Hemophilia B', 'von Willebrand Disease', 'Hereditary Thrombophilia', 'Normal/No disorder'].map(diagnosis => (
                    <div
                      key={diagnosis}
                      onClick={() => setFinalDiagnosis(diagnosis)}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                        finalDiagnosis === diagnosis
                          ? 'border-green-400 bg-green-100/10 text-white'
                          : 'border-gray-400 bg-white/5 text-gray-300 hover:border-blue-400'
                      }`}
                    >
                      {diagnosis}
                    </div>
                  ))}
                </div>

                <Button 
                  onClick={submitDiagnosis}
                  disabled={!finalDiagnosis}
                  className="w-full mt-4 bg-purple-600 hover:bg-purple-700"
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Submit Diagnosis
                </Button>
              </CardContent>
            </Card>
          )}

          {phase === 'complete' && (
            <Card className="bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20">
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-4">Case Complete!</h2>
                <p className="text-gray-300 mb-6">
                  You've successfully analyzed this patient case. 
                  {finalDiagnosis === currentPatient.correctDiagnosis 
                    ? ' Your diagnosis was correct!' 
                    : ` The correct diagnosis was: ${currentPatient.correctDiagnosis}`}
                </p>
                <div className="flex justify-center space-x-4">
                  <Button onClick={() => navigate('/')} variant="outline" className="border-white text-white">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Back to Hub
                  </Button>
                  {currentCase < patientCases.length - 1 ? (
                    <Button onClick={nextCase} className="bg-green-600 hover:bg-green-700">
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Next Case
                    </Button>
                  ) : (
                    <Button onClick={() => navigate('/')} className="bg-blue-600 hover:bg-blue-700">
                      Level Complete!
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Level2;
