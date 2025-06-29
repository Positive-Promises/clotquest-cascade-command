
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
  Calculator
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
  diagnosis: string;
  symptoms: string[];
  labValues: {
    pt: number;
    aptt: number;
    inr: number;
    plateletCount: number;
    hemoglobin: number;
  };
  medications: string[];
  allergies: string[];
  vitals: {
    bloodPressure: string;
    heartRate: number;
    temperature: number;
    oxygenSat: number;
  };
}

interface Treatment {
  id: string;
  name: string;
  type: 'anticoagulant' | 'antiplatelet' | 'thrombolytic' | 'reversal' | 'blood_product';
  mechanism: string;
  dosage: string;
  contraindications: string[];
  sideEffects: string[];
  monitoring: string[];
  cost: number;
}

interface TreatmentPlan {
  id: string;
  treatments: Treatment[];
  monitoring: string[];
  duration: string;
  followUp: string[];
  patientEducation: string[];
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
  const [selectedTreatments, setSelectedTreatments] = useState<Treatment[]>([]);
  const [patientResponse, setPatientResponse] = useState<string>('stable');
  const [treatmentPhase, setTreatmentPhase] = useState<'assessment' | 'planning' | 'implementation' | 'monitoring'>('assessment');

  const patients: Patient[] = [
    {
      id: '1',
      name: 'John Smith',
      age: 65,
      weight: 80,
      diagnosis: 'Acute DVT',
      symptoms: ['Leg swelling', 'Pain', 'Warmth'],
      labValues: {
        pt: 12.5,
        aptt: 35,
        inr: 1.1,
        plateletCount: 250000,
        hemoglobin: 12.5
      },
      medications: ['Metformin', 'Lisinopril'],
      allergies: ['Penicillin'],
      vitals: {
        bloodPressure: '140/90',
        heartRate: 88,
        temperature: 37.2,
        oxygenSat: 98
      }
    },
    {
      id: '2',
      name: 'Maria Garcia',
      age: 45,
      weight: 65,
      diagnosis: 'Hemophilia A bleeding episode',
      symptoms: ['Joint bleeding', 'Hematoma', 'Pain'],
      labValues: {
        pt: 13.2,
        aptt: 68,
        inr: 1.2,
        plateletCount: 180000,
        hemoglobin: 9.8
      },
      medications: ['Factor VIII concentrate'],
      allergies: ['None known'],
      vitals: {
        bloodPressure: '110/70',
        heartRate: 102,
        temperature: 36.8,
        oxygenSat: 99
      }
    }
  ];

  const availableTreatments: Treatment[] = [
    {
      id: 'warfarin',
      name: 'Warfarin',
      type: 'anticoagulant',
      mechanism: 'Vitamin K antagonist',
      dosage: '5-10mg daily',
      contraindications: ['Active bleeding', 'Pregnancy', 'Severe liver disease'],
      sideEffects: ['Bleeding', 'Skin necrosis', 'Hair loss'],
      monitoring: ['INR', 'PT', 'Complete blood count'],
      cost: 50
    },
    {
      id: 'heparin',
      name: 'Unfractionated Heparin',
      type: 'anticoagulant',
      mechanism: 'Antithrombin activation',
      dosage: '80 units/kg bolus, then 18 units/kg/hr',
      contraindications: ['HIT', 'Active bleeding', 'Severe thrombocytopenia'],
      sideEffects: ['Bleeding', 'HIT', 'Osteoporosis'],
      monitoring: ['aPTT', 'Platelet count', 'Anti-Xa'],
      cost: 100
    },
    {
      id: 'factor8',
      name: 'Factor VIII Concentrate',
      type: 'blood_product',
      mechanism: 'Factor replacement',
      dosage: '25-50 units/kg',
      contraindications: ['Known inhibitors'],
      sideEffects: ['Allergic reactions', 'Inhibitor development'],
      monitoring: ['Factor VIII levels', 'Inhibitor screen'],
      cost: 2000
    },
    {
      id: 'tpa',
      name: 'Alteplase (tPA)',
      type: 'thrombolytic',
      mechanism: 'Plasminogen activation',
      dosage: '0.9mg/kg over 60 minutes',
      contraindications: ['Recent surgery', 'Active bleeding', 'Recent stroke'],
      sideEffects: ['ICH', 'Systemic bleeding', 'Reperfusion injury'],
      monitoring: ['Neurological assessment', 'CBC', 'Fibrinogen'],
      cost: 5000
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
    setTreatmentPhase('assessment');
    toast({
      title: "🏥 Treatment Tactician Started!",
      description: "Assess the patient and develop an appropriate treatment plan!",
    });
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
    const phases: Array<'assessment' | 'planning' | 'implementation' | 'monitoring'> = 
      ['assessment', 'planning', 'implementation', 'monitoring'];
    const currentIndex = phases.indexOf(treatmentPhase);
    
    if (currentIndex < phases.length - 1) {
      setTreatmentPhase(phases[currentIndex + 1]);
      setScore(prevScore => prevScore + 100);
    } else {
      // Complete level
      setLevel4Complete(true);
      setShowCompletionDialog(true);
      const timeBonus = Math.max(0, 600 - timeElapsed) * 5;
      setScore(prevScore => prevScore + timeBonus);
      toast({
        title: "🏆 Treatment Tactician Master!",
        description: `Congratulations! You've successfully managed the patient's treatment! Time bonus: +${timeBonus} points`,
      });
    }
  };

  const resetLevel = () => {
    setScore(0);
    setTimeElapsed(0);
    setLevel4Complete(false);
    setShowCompletionDialog(false);
    setCurrentPatient(patients[0]);
    setSelectedTreatments([]);
    setPatientResponse('stable');
    setTreatmentPhase('assessment');
    setGameStarted(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseProgress = () => {
    const phases = ['assessment', 'planning', 'implementation', 'monitoring'];
    return ((phases.indexOf(treatmentPhase) + 1) / phases.length) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-teal-900 to-blue-900 p-4 pb-20">
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
                <h1 className="text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
                  Level 4: Treatment Tactician
                </h1>
                <p className="text-green-200 text-base lg:text-lg">Master pharmacological interventions and patient management</p>
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
                  <div className="text-2xl lg:text-3xl font-bold text-blue-400 capitalize">{treatmentPhase}</div>
                  <div className="text-sm text-gray-300">Phase</div>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <Progress value={getPhaseProgress()} className="h-3" />
              <p className="text-center text-white mt-2 text-sm">Treatment Progress: {Math.round(getPhaseProgress())}%</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Control Panel */}
          <div className="lg:col-span-1">
            <Card className="bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 shadow-xl mb-4">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Stethoscope className="h-6 w-6 mr-2 text-green-400" />
                  Treatment Control
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!gameStarted && (
                  <Button onClick={startGame} className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700">
                    <Play className="h-4 w-4 mr-2" />
                    Start Treatment
                  </Button>
                )}

                {gameStarted && (
                  <>
                    <Button onClick={resetLevel} variant="outline" className="w-full border-white text-white hover:bg-white hover:text-green-900">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset Case
                    </Button>
                    
                    <Button 
                      onClick={advancePhase} 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={treatmentPhase === 'monitoring' && !level4Complete}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Next Phase
                    </Button>
                  </>
                )}

                <div className="bg-white/10 p-4 rounded-lg">
                  <h4 className="text-white font-bold mb-2">Phase: {treatmentPhase}</h4>
                  <p className="text-white/80 text-sm">
                    {treatmentPhase === 'assessment' && 'Review patient data and identify treatment needs.'}
                    {treatmentPhase === 'planning' && 'Select appropriate treatments and create a plan.'}
                    {treatmentPhase === 'implementation' && 'Administer treatments and monitor for effects.'}
                    {treatmentPhase === 'monitoring' && 'Track patient response and adjust as needed.'}
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
                      Vitals: {currentPatient.vitals.bloodPressure} | HR: {currentPatient.vitals.heartRate} | 
                      Temp: {currentPatient.vitals.temperature}°C
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Treatment Interface */}
          <div className="lg:col-span-2">
            {currentPatient ? (
              <div className="space-y-6">
                {/* Patient Information */}
                <Card className="bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Activity className="h-6 w-6 mr-2 text-green-400" />
                      Patient: {currentPatient.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
                      <div>
                        <h4 className="font-bold text-green-300 mb-2">Demographics</h4>
                        <p>Age: {currentPatient.age} years</p>
                        <p>Weight: {currentPatient.weight} kg</p>
                        <p>Diagnosis: {currentPatient.diagnosis}</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-blue-300 mb-2">Lab Values</h4>
                        <p>PT: {currentPatient.labValues.pt}s</p>
                        <p>aPTT: {currentPatient.labValues.aptt}s</p>
                        <p>INR: {currentPatient.labValues.inr}</p>
                        <p>Platelets: {currentPatient.labValues.plateletCount.toLocaleString()}</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-yellow-300 mb-2">Symptoms</h4>
                        {currentPatient.symptoms.map((symptom, index) => (
                          <Badge key={index} variant="outline" className="mr-1 mb-1 text-white border-white/30">
                            {symptom}
                          </Badge>
                        ))}
                      </div>
                      <div>
                        <h4 className="font-bold text-purple-300 mb-2">Current Medications</h4>
                        {currentPatient.medications.map((med, index) => (
                          <p key={index} className="text-sm">• {med}</p>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Treatment Options */}
                <Card className="bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Pill className="h-6 w-6 mr-2 text-blue-400" />
                      Available Treatments
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
                              <h4 className="text-white font-bold">{treatment.name}</h4>
                              <Badge variant="outline" className="text-white border-white/30">
                                ${treatment.cost}
                              </Badge>
                            </div>
                            <p className="text-white/70 text-sm mb-2">{treatment.mechanism}</p>
                            <p className="text-white/60 text-xs">{treatment.dosage}</p>
                            <div className="mt-2">
                              <Badge 
                                variant="secondary" 
                                className={`text-xs ${
                                  treatment.type === 'anticoagulant' ? 'bg-red-600' :
                                  treatment.type === 'antiplatelet' ? 'bg-blue-600' :
                                  treatment.type === 'thrombolytic' ? 'bg-green-600' :
                                  treatment.type === 'reversal' ? 'bg-purple-600' :
                                  'bg-orange-600'
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

                {/* Selected Treatments */}
                {selectedTreatments.length > 0 && (
                  <Card className="bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 shadow-2xl">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <CheckCircle className="h-6 w-6 mr-2 text-green-400" />
                        Treatment Plan
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
                  <h3 className="text-2xl font-bold text-white mb-2">Ready to Start Treatment</h3>
                  <p className="text-white/70">Click "Start Treatment" to begin managing your first patient case.</p>
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
            <AlertDialogTitle className="text-center text-2xl font-bold text-green-600">
              🏥 Level 4 Complete! 🏥
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-lg">
              Outstanding work! You've successfully demonstrated mastery of treatment planning and patient management!
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
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">EXPERT</div>
                <div className="text-sm text-gray-600">Treatment Status</div>
              </div>
            </div>
          </div>

          <AlertDialogFooter className="flex justify-center space-x-4">
            <AlertDialogAction 
              onClick={resetLevel}
              className="bg-green-600 hover:bg-green-700"
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
