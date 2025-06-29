

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft, 
  Play, 
  RotateCcw, 
  Stethoscope,
  Pill,
  Syringe,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Award,
  Calculator,
  Microscope,
  Brain,
  FileText,
  Target
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

interface Patient {
  id: string;
  name: string;
  age: number;
  weight: number;
  gender: string;
  chiefComplaint: string;
  presentIllness: string;
  pastMedicalHistory: string[];
  medications: string[];
  allergies: string[];
  familyHistory: string;
  socialHistory: string;
  symptoms: string[];
  physicalExam: {
    vitals: {
      bloodPressure: string;
      heartRate: number;
      temperature: number;
      respiratoryRate: number;
      oxygenSat: number;
    };
    generalAppearance: string;
    skin: string;
    cardiovascular: string;
    respiratory: string;
    abdomen: string;
    extremities: string;
    neurological: string;
  };
  labValues: {
    pt: number;
    aptt: number;
    inr: number;
    plateletCount: number;
    hemoglobin: number;
    hematocrit: number;
    wbc: number;
    fibrinogen: number;
    dDimer: number;
    factorVIII?: number;
    factorIX?: number;
    vwf?: number;
  };
}

interface DiagnosticTest {
  id: string;
  name: string;
  category: 'basic' | 'specialized' | 'genetic' | 'imaging';
  cost: number;
  timeToResult: number;
  description: string;
  indication: string;
  normalRange: string;
}

interface Treatment {
  id: string;
  name: string;
  type: 'anticoagulant' | 'antiplatelet' | 'thrombolytic' | 'reversal' | 'blood_product' | 'hemostatic';
  mechanism: string;
  dosage: string;
  contraindications: string[];
  sideEffects: string[];
  monitoring: string[];
  cost: number;
  indication: string;
}

interface Diagnosis {
  id: string;
  name: string;
  category: 'bleeding_disorder' | 'thrombotic_disorder' | 'platelet_disorder' | 'acquired_disorder';
  description: string;
  keyFeatures: string[];
  diagnosticCriteria: string[];
  treatment: string[];
}

const Level4 = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [level4Complete, setLevel4Complete] = useState(false);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const [selectedTests, setSelectedTests] = useState<DiagnosticTest[]>([]);
  const [testResults, setTestResults] = useState<{[key: string]: any}>({});
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<Diagnosis | null>(null);
  const [selectedTreatments, setSelectedTreatments] = useState<Treatment[]>([]);
  const [patientResponse, setPatientResponse] = useState<string>('stable');
  const [gamePhase, setGamePhase] = useState<'assessment' | 'testing' | 'diagnosis' | 'treatment' | 'monitoring'>('assessment');

  const patients: Patient[] = [
    {
      id: '1',
      name: 'Sarah Mitchell',
      age: 28,
      weight: 65,
      gender: 'Female',
      chiefComplaint: 'Easy bruising and heavy menstrual periods',
      presentIllness: 'Patient reports increasing bruising over the past 6 months, particularly after minor trauma. Heavy menstrual bleeding requiring frequent pad changes.',
      pastMedicalHistory: ['No significant past medical history'],
      medications: ['Oral contraceptive pills'],
      allergies: ['NKDA'],
      familyHistory: 'Mother had bleeding problems during childbirth',
      socialHistory: 'Non-smoker, social drinker',
      symptoms: ['Easy bruising', 'Heavy menstrual bleeding', 'Bleeding gums', 'Nosebleeds'],
      physicalExam: {
        vitals: {
          bloodPressure: '118/76',
          heartRate: 88,
          temperature: 36.8,
          respiratoryRate: 16,
          oxygenSat: 99
        },
        generalAppearance: 'Well-appearing female in no acute distress',
        skin: 'Multiple ecchymoses on arms and legs in various stages of healing',
        cardiovascular: 'Regular rate and rhythm, no murmurs',
        respiratory: 'Clear to auscultation bilaterally',
        abdomen: 'Soft, non-tender, no organomegaly',
        extremities: 'No edema, multiple bruises noted',
        neurological: 'Alert and oriented, no focal deficits'
      },
      labValues: {
        pt: 12.8,
        aptt: 45.2,
        inr: 1.1,
        plateletCount: 245000,
        hemoglobin: 10.2,
        hematocrit: 32.1,
        wbc: 6800,
        fibrinogen: 320,
        dDimer: 0.3
      }
    },
    {
      id: '2',
      name: 'Robert Chen',
      age: 72,
      weight: 82,
      gender: 'Male',
      chiefComplaint: 'Leg swelling and shortness of breath',
      presentIllness: 'Patient presents with 3-day history of left leg swelling, pain, and warmth. Associated with new onset shortness of breath.',
      pastMedicalHistory: ['Atrial fibrillation', 'Hypertension', 'Diabetes mellitus type 2'],
      medications: ['Metformin', 'Lisinopril', 'Metoprolol'],
      allergies: ['Penicillin'],
      familyHistory: 'Father died of heart attack at age 68',
      socialHistory: 'Former smoker (quit 5 years ago), no alcohol',
      symptoms: ['Leg swelling', 'Leg pain', 'Shortness of breath', 'Chest discomfort'],
      physicalExam: {
        vitals: {
          bloodPressure: '142/88',
          heartRate: 94,
          temperature: 37.1,
          respiratoryRate: 22,
          oxygenSat: 94
        },
        generalAppearance: 'Elderly male in mild respiratory distress',
        skin: 'No rash or petechiae',
        cardiovascular: 'Irregular rhythm, no murmurs, elevated JVP',
        respiratory: 'Decreased breath sounds at bases',
        abdomen: 'Soft, non-tender',
        extremities: 'Left calf swelling, warmth, tenderness. Positive Homan\'s sign',
        neurological: 'Alert and oriented'
      },
      labValues: {
        pt: 13.5,
        aptt: 28.2,
        inr: 1.2,
        plateletCount: 380000,
        hemoglobin: 13.8,
        hematocrit: 41.2,
        wbc: 11200,
        fibrinogen: 450,
        dDimer: 2.8
      }
    }
  ];

  const availableTests: DiagnosticTest[] = [
    {
      id: 'bleeding_time',
      name: 'Bleeding Time',
      category: 'basic',
      cost: 25,
      timeToResult: 30,
      description: 'Measures primary hemostasis and platelet function',
      indication: 'Suspected platelet dysfunction or von Willebrand disease',
      normalRange: '2-7 minutes'
    },
    {
      id: 'factor_viii',
      name: 'Factor VIII Activity',
      category: 'specialized',
      cost: 150,
      timeToResult: 120,
      description: 'Measures Factor VIII clotting activity',
      indication: 'Suspected Hemophilia A or von Willebrand disease',
      normalRange: '50-150%'
    },
    {
      id: 'vwf_antigen',
      name: 'von Willebrand Factor Antigen',
      category: 'specialized',
      cost: 120,
      timeToResult: 180,
      description: 'Quantitative measurement of vWF protein',
      indication: 'Suspected von Willebrand disease',
      normalRange: '60-140%'
    },
    {
      id: 'vwf_activity',
      name: 'von Willebrand Factor Activity (Ristocetin)',
      category: 'specialized',
      cost: 140,
      timeToResult: 180,
      description: 'Functional assessment of vWF',
      indication: 'Suspected von Willebrand disease',
      normalRange: '60-140%'
    },
    {
      id: 'duplex_ultrasound',
      name: 'Venous Duplex Ultrasound',
      category: 'imaging',
      cost: 300,
      timeToResult: 60,
      description: 'Non-invasive imaging to detect deep vein thrombosis',
      indication: 'Suspected DVT',
      normalRange: 'No evidence of thrombosis'
    },
    {
      id: 'ct_angiogram',
      name: 'CT Pulmonary Angiogram',
      category: 'imaging',
      cost: 800,
      timeToResult: 90,
      description: 'Imaging to detect pulmonary embolism',
      indication: 'Suspected pulmonary embolism',
      normalRange: 'No filling defects'
    }
  ];

  const availableDiagnoses: Diagnosis[] = [
    {
      id: 'vwd_type1',
      name: 'von Willebrand Disease Type 1',
      category: 'bleeding_disorder',
      description: 'Mild bleeding disorder due to quantitative vWF deficiency',
      keyFeatures: ['Mucocutaneous bleeding', 'Family history', 'Prolonged aPTT', 'Low vWF levels'],
      diagnosticCriteria: ['vWF antigen <50%', 'vWF activity <50%', 'Bleeding symptoms'],
      treatment: ['DDAVP', 'Tranexamic acid', 'vWF concentrates']
    },
    {
      id: 'dvt_pe',
      name: 'Deep Vein Thrombosis with Pulmonary Embolism',
      category: 'thrombotic_disorder',
      description: 'Venous thromboembolism affecting deep veins and pulmonary circulation',
      keyFeatures: ['Leg swelling', 'Shortness of breath', 'Elevated D-dimer', 'Risk factors'],
      diagnosticCriteria: ['Positive duplex ultrasound', 'Positive CT angiogram', 'Clinical probability'],
      treatment: ['Anticoagulation', 'Thrombolysis', 'Embolectomy']
    },
    {
      id: 'hemophilia_a',
      name: 'Hemophilia A',
      category: 'bleeding_disorder',
      description: 'X-linked bleeding disorder due to Factor VIII deficiency',
      keyFeatures: ['Joint bleeding', 'Muscle hematomas', 'Prolonged aPTT', 'Family history'],
      diagnosticCriteria: ['Factor VIII <50%', 'Prolonged aPTT', 'Normal PT and platelets'],
      treatment: ['Factor VIII concentrates', 'DDAVP', 'Antifibrinolytics']
    }
  ];

  const availableTreatments: Treatment[] = [
    {
      id: 'ddavp',
      name: 'DDAVP (Desmopressin)',
      type: 'hemostatic',
      mechanism: 'Releases vWF and Factor VIII from storage sites',
      dosage: '0.3 mcg/kg IV or 300 mcg intranasal',
      contraindications: ['Type 2B vWD', 'Severe cardiovascular disease', 'Hyponatremia'],
      sideEffects: ['Hyponatremia', 'Headache', 'Facial flushing'],
      monitoring: ['Sodium levels', 'Fluid balance', 'Bleeding assessment'],
      cost: 200,
      indication: 'Mild bleeding disorders, vWD Type 1'
    },
    {
      id: 'factor_viii',
      name: 'Factor VIII Concentrate',
      type: 'blood_product',
      mechanism: 'Direct factor replacement',
      dosage: '25-50 units/kg for bleeding episodes',
      contraindications: ['Known inhibitors (relative)'],
      sideEffects: ['Allergic reactions', 'Inhibitor development', 'Thrombosis'],
      monitoring: ['Factor VIII levels', 'Inhibitor screen', 'Clinical response'],
      cost: 2000,
      indication: 'Hemophilia A, severe bleeding'
    },
    {
      id: 'rivaroxaban',
      name: 'Rivaroxaban',
      type: 'anticoagulant',
      mechanism: 'Direct Factor Xa inhibitor',
      dosage: '15mg BID x 21 days, then 20mg daily',
      contraindications: ['Active bleeding', 'Severe renal impairment', 'Pregnancy'],
      sideEffects: ['Bleeding', 'GI upset', 'Fatigue'],
      monitoring: ['CBC', 'Renal function', 'Bleeding assessment'],
      cost: 300,
      indication: 'DVT/PE treatment and prevention'
    },
    {
      id: 'tranexamic_acid',
      name: 'Tranexamic Acid',
      type: 'hemostatic',
      mechanism: 'Antifibrinolytic - prevents clot breakdown',
      dosage: '1g TID PO or 10mg/kg IV',
      contraindications: ['Active thrombosis', 'Subarachnoid hemorrhage', 'Color vision defects'],
      sideEffects: ['Nausea', 'Diarrhea', 'Visual disturbances'],
      monitoring: ['Visual acuity', 'Bleeding assessment', 'Thrombotic events'],
      cost: 50,
      indication: 'Mucocutaneous bleeding, menorrhagia'
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
    setGamePhase('assessment');
    toast({
      title: "🔬 Diagnosis and Treatment Tactician Started!",
      description: "Assess the patient, order appropriate tests, make a diagnosis, and develop a treatment plan!",
    });
  };

  const orderTest = (test: DiagnosticTest) => {
    if (selectedTests.find(t => t.id === test.id)) {
      toast({
        title: "Test Already Ordered",
        description: `${test.name} has already been ordered.`,
        variant: "destructive",
      });
      return;
    }

    setSelectedTests(prev => [...prev, test]);
    setScore(prevScore => prevScore + 50);
    
    // Simulate test results after time delay
    setTimeout(() => {
      const results = generateTestResults(test, currentPatient);
      setTestResults(prev => ({ ...prev, [test.id]: results }));
      toast({
        title: "📋 Test Results Available!",
        description: `${test.name} results are now available. +50 points`,
      });
    }, test.timeToResult * 10); // Reduced time for gameplay
  };

  const generateTestResults = (test: DiagnosticTest, patient: Patient | null) => {
    if (!patient) return null;

    // Simulate realistic test results based on patient condition
    switch (test.id) {
      case 'bleeding_time':
        return patient.id === '1' ? '12 minutes (prolonged)' : '4 minutes (normal)';
      case 'factor_viii':
        return patient.id === '1' ? '35% (low)' : '95% (normal)';
      case 'vwf_antigen':
        return patient.id === '1' ? '28% (low)' : '110% (normal)';
      case 'vwf_activity':
        return patient.id === '1' ? '22% (low)' : '105% (normal)';
      case 'duplex_ultrasound':
        return patient.id === '2' ? 'Extensive DVT in left femoral and popliteal veins' : 'No evidence of DVT';
      case 'ct_angiogram':
        return patient.id === '2' ? 'Bilateral subsegmental pulmonary emboli' : 'No evidence of PE';
      default:
        return 'Normal';
    }
  };

  const selectDiagnosis = (diagnosis: Diagnosis) => {
    setSelectedDiagnosis(diagnosis);
    
    // Check if diagnosis is appropriate for the patient
    const isCorrect = checkDiagnosisCorrectness(diagnosis, currentPatient);
    
    if (isCorrect) {
      setScore(prevScore => prevScore + 200);
      toast({
        title: "🎯 Excellent Diagnosis!",
        description: `Correct diagnosis selected! +200 points`,
      });
    } else {
      toast({
        title: "❌ Reconsider Diagnosis",
        description: `This diagnosis may not fit the clinical picture. Review the evidence.`,
        variant: "destructive",
      });
    }
  };

  const checkDiagnosisCorrectness = (diagnosis: Diagnosis, patient: Patient | null) => {
    if (!patient) return false;
    
    // Simple logic to check diagnosis appropriateness
    if (patient.id === '1' && diagnosis.id === 'vwd_type1') return true;
    if (patient.id === '2' && diagnosis.id === 'dvt_pe') return true;
    return false;
  };

  const selectTreatment = (treatment: Treatment) => {
    // Check for contraindications
    const hasContraindications = treatment.contraindications.some(contra => 
      currentPatient?.symptoms.some(symptom => symptom.toLowerCase().includes(contra.toLowerCase())) ||
      currentPatient?.medications.some(med => med.toLowerCase().includes(contra.toLowerCase()))
    );

    if (hasContraindications) {
      toast({
        title: "⚠️ Contraindication Warning!",
        description: `${treatment.name} has contraindications for this patient. Consider alternatives.`,
        variant: "destructive",
      });
      return;
    }

    setSelectedTreatments(prev => [...prev, treatment]);
    setScore(prevScore => prevScore + 150);
    
    toast({
      title: "✅ Treatment Selected!",
      description: `${treatment.name} added to treatment plan. +150 points`,
    });

    // Simulate patient response
    setTimeout(() => {
      simulatePatientResponse(treatment);
    }, 2000);
  };

  const simulatePatientResponse = (treatment: Treatment) => {
    const responses = ['improving', 'stable', 'complications'];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    setPatientResponse(randomResponse);
    
    if (randomResponse === 'improving') {
      setScore(prevScore => prevScore + 200);
      toast({
        title: "🎉 Patient Improving!",
        description: `Excellent treatment choice! Patient showing positive response. +200 points`,
      });
    } else if (randomResponse === 'complications') {
      toast({
        title: "⚠️ Complications Detected!",
        description: `Monitor closely and consider treatment adjustments.`,
        variant: "destructive",
      });
    }
  };

  const advancePhase = () => {
    const phases: Array<'assessment' | 'testing' | 'diagnosis' | 'treatment' | 'monitoring'> = 
      ['assessment', 'testing', 'diagnosis', 'treatment', 'monitoring'];
    const currentIndex = phases.indexOf(gamePhase);
    
    if (currentIndex < phases.length - 1) {
      setGamePhase(phases[currentIndex + 1]);
      setScore(prevScore => prevScore + 100);
    } else {
      // Complete level
      setLevel4Complete(true);
      setShowCompletionDialog(true);
      const timeBonus = Math.max(0, 900 - timeElapsed) * 5;
      setScore(prevScore => prevScore + timeBonus);
      toast({
        title: "🏆 Diagnosis and Treatment Master!",
        description: `Congratulations! You've successfully diagnosed and treated the patient! Time bonus: +${timeBonus} points`,
      });
    }
  };

  const resetLevel = () => {
    setScore(0);
    setTimeElapsed(0);
    setLevel4Complete(false);
    setShowCompletionDialog(false);
    setCurrentPatient(patients[0]);
    setSelectedTests([]);
    setTestResults({});
    setSelectedDiagnosis(null);
    setSelectedTreatments([]);
    setPatientResponse('stable');
    setGamePhase('assessment');
    setGameStarted(true);
  };

  const switchPatient = () => {
    const currentIndex = patients.findIndex(p => p.id === currentPatient?.id);
    const nextIndex = (currentIndex + 1) % patients.length;
    setCurrentPatient(patients[nextIndex]);
    setSelectedTests([]);
    setTestResults({});
    setSelectedDiagnosis(null);
    setSelectedTreatments([]);
    setGamePhase('assessment');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseProgress = () => {
    const phases = ['assessment', 'testing', 'diagnosis', 'treatment', 'monitoring'];
    return ((phases.indexOf(gamePhase) + 1) / phases.length) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-green-900 p-4 pb-20">
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
                <h1 className="text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Level 4: Diagnosis & Treatment Tactician
                </h1>
                <p className="text-purple-200 text-base lg:text-lg">Master diagnostic reasoning and therapeutic decision-making</p>
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
                  <div className="text-2xl lg:text-3xl font-bold text-blue-400 capitalize">{gamePhase}</div>
                  <div className="text-sm text-gray-300">Phase</div>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <Progress value={getPhaseProgress()} className="h-3" />
              <p className="text-center text-white mt-2 text-sm">Clinical Progress: {Math.round(getPhaseProgress())}%</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Control Panel */}
          <div className="lg:col-span-1">
            <Card className="bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 shadow-xl mb-4">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Brain className="h-6 w-6 mr-2 text-purple-400" />
                  Clinical Control
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!gameStarted && (
                  <Button onClick={startGame} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    <Play className="h-4 w-4 mr-2" />
                    Start Clinical Case
                  </Button>
                )}

                {gameStarted && (
                  <>
                    <Button onClick={resetLevel} variant="outline" className="w-full border-white text-white hover:bg-white hover:text-purple-900">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset Case
                    </Button>
                    
                    <Button onClick={switchPatient} className="w-full bg-orange-600 hover:bg-orange-700">
                      <FileText className="h-4 w-4 mr-2" />
                      Switch Patient
                    </Button>
                    
                    <Button 
                      onClick={advancePhase} 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={gamePhase === 'monitoring' && !level4Complete}
                    >
                      <Target className="h-4 w-4 mr-2" />
                      Next Phase
                    </Button>
                  </>
                )}

                <div className="bg-white/10 p-4 rounded-lg">
                  <h4 className="text-white font-bold mb-2">Phase: {gamePhase}</h4>
                  <p className="text-white/80 text-sm">
                    {gamePhase === 'assessment' && 'Review patient history, symptoms, and physical findings.'}
                    {gamePhase === 'testing' && 'Order appropriate diagnostic tests to gather more data.'}
                    {gamePhase === 'diagnosis' && 'Analyze all available data to formulate a diagnosis.'}
                    {gamePhase === 'treatment' && 'Select appropriate treatments based on your diagnosis.'}
                    {gamePhase === 'monitoring' && 'Monitor patient response and adjust treatment as needed.'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Patient Status */}
            {currentPatient && (
              <Card className="bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Patient Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold">Response:</span>
                    <Badge 
                      variant={patientResponse === 'improving' ? "default" : patientResponse === 'complications' ? "destructive" : "secondary"}
                      className={`${
                        patientResponse === 'improving' ? 'bg-green-600' : 
                        patientResponse === 'complications' ? 'bg-red-600' : 'bg-blue-600'
                      }`}
                    >
                      {patientResponse}
                    </Badge>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg">
                    <p className="text-white/60 text-xs">
                      Vitals: {currentPatient.physicalExam.vitals.bloodPressure} | 
                      HR: {currentPatient.physicalExam.vitals.heartRate} | 
                      Temp: {currentPatient.physicalExam.vitals.temperature}°C | 
                      O2Sat: {currentPatient.physicalExam.vitals.oxygenSat}%
                    </p>
                  </div>
                  {selectedDiagnosis && (
                    <div className="bg-green-500/20 p-3 rounded-lg">
                      <p className="text-green-300 font-bold text-sm">Working Diagnosis:</p>
                      <p className="text-white text-sm">{selectedDiagnosis.name}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Clinical Interface */}
          <div className="lg:col-span-2">
            {currentPatient ? (
              <div className="space-y-6">
                {/* Patient Information */}
                <Card className="bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Activity className="h-6 w-6 mr-2 text-purple-400" />
                      Patient: {currentPatient.name} ({currentPatient.age}yo {currentPatient.gender})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
                      <div>
                        <h4 className="font-bold text-purple-300 mb-2">Chief Complaint</h4>
                        <p className="text-sm mb-3">{currentPatient.chiefComplaint}</p>
                        
                        <h4 className="font-bold text-blue-300 mb-2">Present Illness</h4>
                        <p className="text-sm mb-3">{currentPatient.presentIllness}</p>
                        
                        <h4 className="font-bold text-green-300 mb-2">Physical Exam</h4>
                        <div className="text-sm space-y-1">
                          <p><strong>General:</strong> {currentPatient.physicalExam.generalAppearance}</p>
                          <p><strong>Skin:</strong> {currentPatient.physicalExam.skin}</p>
                          <p><strong>CV:</strong> {currentPatient.physicalExam.cardiovascular}</p>
                          <p><strong>Extremities:</strong> {currentPatient.physicalExam.extremities}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-bold text-yellow-300 mb-2">Medications</h4>
                        <div className="text-sm mb-3">
                          {currentPatient.medications.map((med, index) => (
                            <Badge key={index} variant="outline" className="mr-1 mb-1 text-white border-white/30">
                              {med}
                            </Badge>
                          ))}
                        </div>
                        
                        <h4 className="font-bold text-orange-300 mb-2">Lab Values</h4>
                        <div className="text-sm space-y-1">
                          <p>PT: {currentPatient.labValues.pt}s, aPTT: {currentPatient.labValues.aptt}s</p>
                          <p>INR: {currentPatient.labValues.inr}, Platelets: {currentPatient.labValues.plateletCount.toLocaleString()}</p>
                          <p>Hgb: {currentPatient.labValues.hemoglobin}g/dL, WBC: {currentPatient.labValues.wbc}</p>
                          <p>D-dimer: {currentPatient.labValues.dDimer}mg/L</p>
                        </div>
                        
                        <h4 className="font-bold text-red-300 mb-2 mt-3">Family History</h4>
                        <p className="text-sm">{currentPatient.familyHistory}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Diagnostic Tests */}
                {(gamePhase === 'testing' || gamePhase === 'diagnosis' || gamePhase === 'treatment' || gamePhase === 'monitoring') && (
                  <Card className="bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 shadow-2xl">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Microscope className="h-6 w-6 mr-2 text-blue-400" />
                        Diagnostic Tests
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {availableTests.map(test => (
                          <Card 
                            key={test.id} 
                            className="bg-white/5 border border-white/20 cursor-pointer hover:bg-white/10 transition-all duration-200"
                            onClick={() => orderTest(test)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="text-white font-bold text-sm">{test.name}</h4>
                                <Badge variant="outline" className="text-white border-white/30 text-xs">
                                  ${test.cost}
                                </Badge>
                              </div>
                              <p className="text-white/70 text-xs mb-2">{test.description}</p>
                              <div className="flex items-center justify-between">
                                <Badge 
                                  variant="secondary" 
                                  className={`text-xs ${
                                    test.category === 'basic' ? 'bg-green-600' :
                                    test.category === 'specialized' ? 'bg-blue-600' :
                                    test.category === 'genetic' ? 'bg-purple-600' :
                                    'bg-orange-600'
                                  }`}
                                >
                                  {test.category}
                                </Badge>
                                {testResults[test.id] && (
                                  <Badge variant="outline" className="text-green-400 border-green-400 text-xs">
                                    Result Ready
                                  </Badge>
                                )}
                              </div>
                              {testResults[test.id] && (
                                <div className="mt-2 p-2 bg-white/10 rounded text-xs">
                                  <p className="text-white font-bold">Result: {testResults[test.id]}</p>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Diagnosis Selection */}
                {(gamePhase === 'diagnosis' || gamePhase === 'treatment' || gamePhase === 'monitoring') && (
                  <Card className="bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 shadow-2xl">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Brain className="h-6 w-6 mr-2 text-green-400" />
                        Differential Diagnosis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 gap-4">
                        {availableDiagnoses.map(diagnosis => (
                          <Card 
                            key={diagnosis.id} 
                            className={`bg-white/5 border border-white/20 cursor-pointer hover:bg-white/10 transition-all duration-200 ${
                              selectedDiagnosis?.id === diagnosis.id ? 'ring-2 ring-green-400' : ''
                            }`}
                            onClick={() => selectDiagnosis(diagnosis)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="text-white font-bold">{diagnosis.name}</h4>
                                <Badge 
                                  variant="secondary" 
                                  className={`text-xs ${
                                    diagnosis.category === 'bleeding_disorder' ? 'bg-red-600' :
                                    diagnosis.category === 'thrombotic_disorder' ? 'bg-blue-600' :
                                    diagnosis.category === 'platelet_disorder' ? 'bg-purple-600' :
                                    'bg-orange-600'
                                  }`}
                                >
                                  {diagnosis.category.replace('_', ' ')}
                                </Badge>
                              </div>
                              <p className="text-white/70 text-sm mb-2">{diagnosis.description}</p>
                              <div className="text-xs">
                                <p className="text-white/60 mb-1"><strong>Key Features:</strong> {diagnosis.keyFeatures.join(', ')}</p>
                                {selectedDiagnosis?.id === diagnosis.id && (
                                  <Badge variant="outline" className="text-green-400 border-green-400">
                                    Selected
                                  </Badge>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Treatment Selection */}
                {(gamePhase === 'treatment' || gamePhase === 'monitoring') && (
                  <Card className="bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 shadow-2xl">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Pill className="h-6 w-6 mr-2 text-orange-400" />
                        Treatment Options
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {availableTreatments.map(treatment => (
                          <Card 
                            key={treatment.id} 
                            className="bg-white/5 border border-white/20 cursor-pointer hover:bg-white/10 transition-all duration-200"
                            onClick={() => selectTreatment(treatment)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="text-white font-bold text-sm">{treatment.name}</h4>
                                <Badge variant="outline" className="text-white border-white/30 text-xs">
                                  ${treatment.cost}
                                </Badge>
                              </div>
                              <p className="text-white/70 text-xs mb-2">{treatment.mechanism}</p>
                              <p className="text-white/60 text-xs mb-2">{treatment.dosage}</p>
                              <div className="mt-2">
                                <Badge 
                                  variant="secondary" 
                                  className={`text-xs ${
                                    treatment.type === 'anticoagulant' ? 'bg-red-600' :
                                    treatment.type === 'antiplatelet' ? 'bg-blue-600' :
                                    treatment.type === 'thrombolytic' ? 'bg-green-600' :
                                    treatment.type === 'blood_product' ? 'bg-purple-600' :
                                    treatment.type === 'hemostatic' ? 'bg-orange-600' :
                                    'bg-gray-600'
                                  }`}
                                >
                                  {treatment.type.replace('_', ' ')}
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Selected Treatments */}
                {selectedTreatments.length > 0 && (
                  <Card className="bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 shadow-2xl">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <CheckCircle className="h-6 w-6 mr-2 text-green-400" />
                        Active Treatment Plan
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedTreatments.map((treatment, index) => (
                          <div key={index} className="bg-white/5 p-3 rounded-lg">
                            <div className="flex items-center justify-between">
                              <h4 className="text-white font-bold">{treatment.name}</h4>
                              <Badge variant="outline" className="text-green-400 border-green-400">
                                Active
                              </Badge>
                            </div>
                            <p className="text-white/70 text-sm">{treatment.dosage}</p>
                            <div className="mt-2">
                              <p className="text-white/60 text-xs">Monitoring: {treatment.monitoring.join(', ')}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Card className="bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 shadow-2xl">
                <CardContent className="p-12 text-center">
                  <Stethoscope className="h-24 w-24 text-white/20 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">Ready to Start Clinical Case</h3>
                  <p className="text-white/70">Click "Start Clinical Case" to begin your diagnostic and treatment challenge.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Completion Dialog */}
      <AlertDialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-2xl font-bold text-purple-600">
              🔬 Level 4 Complete! 🔬
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-lg">
              Outstanding work! You've successfully demonstrated mastery of diagnostic reasoning and therapeutic decision-making!
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
                <div className="text-2xl font-bold text-purple-600">EXPERT</div>
                <div className="text-sm text-gray-600">Clinical Status</div>
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
              onClick={() => navigate('/')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Award className="h-4 w-4 mr-2" />
              View Achievements
            </AlertDialogAction>
            <AlertDialogCancel 
              onClick={() => navigate('/')}
            >
              Main Menu
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Level4;

