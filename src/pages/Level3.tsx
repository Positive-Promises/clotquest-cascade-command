import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  Play, 
  RotateCcw, 
  Clock,
  Award,
  BookOpen,
  Trophy,
  Target,
  Stethoscope
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
import { PatientProfile } from '@/components/pathology/PatientProfile';
import { LaboratoryResults } from '@/components/pathology/LaboratoryResults';
import { DiagnosticWorkspace } from '@/components/pathology/DiagnosticWorkspace';
import { clinicalCases } from '@/data/clinicalCases';
import { ClinicalCase, DiagnosticHypothesis, GameState, LabResult } from '@/types/pathologyTypes';

const Level3 = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentCaseIndex, setCurrentCaseIndex] = useState(0);
  const [gameState, setGameState] = useState<GameState>({
    currentCase: null,
    hypotheses: [],
    timeElapsed: 0,
    score: 0,
    consultationsUsed: 0,
    isComplete: false,
    feedback: []
  });
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const currentCase = clinicalCases[currentCaseIndex];
  const maxConsultations = 2;
  const consultationsRemaining = maxConsultations - gameState.consultationsUsed;

  useEffect(() => {
    if (gameStarted && currentCase && !gameState.isComplete) {
      const timer = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          timeElapsed: prev.timeElapsed + 1
        }));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameStarted, currentCase, gameState.isComplete]);

  const startGame = () => {
    setGameStarted(true);
    setGameState(prev => ({
      ...prev,
      currentCase: currentCase,
      timeElapsed: 0,
      score: 0,
      consultationsUsed: 0,
      hypotheses: [],
      isComplete: false,
      feedback: []
    }));
    toast({
      title: "🩺 Pathology Case Started!",
      description: `Analyze the clinical presentation of: ${currentCase.title}`,
    });
  };

  const resetLevel = () => {
    setGameState({
      currentCase: currentCase,
      hypotheses: [],
      timeElapsed: 0,
      score: 0,
      consultationsUsed: 0,
      isComplete: false,
      feedback: []
    });
    setGameStarted(true);
    setShowCompletionDialog(false);
  };

  const nextCase = () => {
    if (currentCaseIndex < clinicalCases.length - 1) {
      setCurrentCaseIndex(prev => prev + 1);
      setGameStarted(false);
      setShowCompletionDialog(false);
      setGameState({
        currentCase: null,
        hypotheses: [],
        timeElapsed: 0,
        score: 0,
        consultationsUsed: 0,
        isComplete: false,
        feedback: []
      });
    }
  };

  const handleAddHypothesis = (hypothesis: Omit<DiagnosticHypothesis, 'id'>) => {
    const newHypothesis: DiagnosticHypothesis = {
      ...hypothesis,
      id: `hyp-${Date.now()}`
    };
    
    setGameState(prev => ({
      ...prev,
      hypotheses: [...prev.hypotheses, newHypothesis]
    }));

    // Auto-populate evidence based on lab results and clinical findings
    setTimeout(() => updateHypothesisEvidence(newHypothesis.id, hypothesis.diagnosis), 100);
  };

  const updateHypothesisEvidence = (hypothesisId: string, diagnosis: string) => {
    if (!currentCase) return;

    let supportingEvidence: string[] = [];
    let contradictingEvidence: string[] = [];
    let probability = 50;

    // Analyze diagnosis against case data
    if (diagnosis.toLowerCase().includes('hemophilia')) {
      const hasLowFactorVIII = currentCase.patient.labResults.some(
        lab => lab.name === 'Factor VIII Activity' && typeof lab.value === 'number' && lab.value < 50
      );
      const hasProlongedPTT = currentCase.patient.labResults.some(
        lab => lab.name === 'PTT' && lab.isAbnormal
      );
      const malePatient = currentCase.patient.demographics.sex === 'M';
      const familyHistory = currentCase.patient.familyHistory.some(
        history => history.toLowerCase().includes('bleeding')
      );

      if (hasLowFactorVIII) {
        supportingEvidence.push('Low Factor VIII activity (<50%)');
        probability += 25;
      }
      if (hasProlongedPTT) {
        supportingEvidence.push('Prolonged PTT (intrinsic pathway defect)');
        probability += 20;
      }
      if (malePatient) {
        supportingEvidence.push('Male patient (X-linked inheritance pattern)');
        probability += 15;
      }
      if (familyHistory) {
        supportingEvidence.push('Family history of bleeding disorder');
        probability += 10;
      }

      const normalPlateletCount = currentCase.patient.labResults.some(
        lab => lab.name === 'Platelet Count' && !lab.isAbnormal
      );
      if (normalPlateletCount) {
        supportingEvidence.push('Normal platelet count (excludes platelet disorders)');
        probability += 10;
      }
    }

    if (diagnosis.toLowerCase().includes('warfarin') || diagnosis.toLowerCase().includes('anticoagulation')) {
      const elevatedINR = currentCase.patient.labResults.some(
        lab => lab.name === 'INR' && lab.significance === 'Critical'
      );
      const onWarfarin = currentCase.patient.medications.some(
        med => med.toLowerCase().includes('warfarin')
      );
      const recentAntibiotics = currentCase.patient.medications.some(
        med => med.toLowerCase().includes('trimethoprim') || med.toLowerCase().includes('sulfamethoxazole')
      );

      if (elevatedINR) {
        supportingEvidence.push('Critically elevated INR (>6.0)');
        probability += 30;
      }
      if (onWarfarin) {
        supportingEvidence.push('Patient on warfarin therapy');
        probability += 25;
      }
      if (recentAntibiotics) {
        supportingEvidence.push('Recent antibiotic use (drug interaction)');
        probability += 20;
      }
    }

    if (diagnosis.toLowerCase().includes('ttp') || diagnosis.toLowerCase().includes('thrombotic thrombocytopenic')) {
      const severeThrombocytopenia = currentCase.patient.labResults.some(
        lab => lab.name === 'Platelet Count' && lab.significance === 'Critical'
      );
      const anemia = currentCase.patient.labResults.some(
        lab => lab.name === 'Hemoglobin' && lab.significance === 'Critical'
      );
      const elevatedLDH = currentCase.patient.labResults.some(
        lab => lab.name === 'LDH' && lab.significance === 'Critical'
      );
      const schistocytes = currentCase.patient.labResults.some(
        lab => lab.name === 'Schistocytes' && lab.isAbnormal
      );
      const neuroSymptoms = currentCase.patient.chiefComplaint.toLowerCase().includes('confusion') ||
                           currentCase.patient.chiefComplaint.toLowerCase().includes('headache');

      if (severeThrombocytopenia) {
        supportingEvidence.push('Severe thrombocytopenia (<20,000)');
        probability += 25;
      }
      if (anemia) {
        supportingEvidence.push('Severe hemolytic anemia');
        probability += 20;
      }
      if (elevatedLDH) {
        supportingEvidence.push('Markedly elevated LDH (hemolysis)');
        probability += 15;
      }
      if (schistocytes) {
        supportingEvidence.push('Schistocytes on blood smear');
        probability += 20;
      }
      if (neuroSymptoms) {
        supportingEvidence.push('Neurological symptoms (confusion, headache)');
        probability += 15;
      }
    }

    // Cap probability at 95%
    probability = Math.min(probability, 95);

    setGameState(prev => ({
      ...prev,
      hypotheses: prev.hypotheses.map(hyp =>
        hyp.id === hypothesisId
          ? {
              ...hyp,
              probability,
              supportingEvidence,
              contradictingEvidence,
              nextSteps: generateNextSteps(diagnosis)
            }
          : hyp
      )
    }));
  };

  const generateNextSteps = (diagnosis: string): string[] => {
    if (diagnosis.toLowerCase().includes('hemophilia')) {
      return [
        'Confirm with factor VIII and IX levels',
        'Genetic counseling consultation',
        'Consider factor concentrate therapy',
        'Activity restrictions counseling'
      ];
    }
    if (diagnosis.toLowerCase().includes('warfarin')) {
      return [
        'Hold warfarin immediately',
        'Consider vitamin K administration',
        'Monitor INR closely',
        'Review drug interactions'
      ];
    }
    if (diagnosis.toLowerCase().includes('ttp')) {
      return [
        'URGENT: Initiate plasmapheresis',
        'Hematology consultation STAT',
        'Monitor neurological status',
        'Consider corticosteroids'
      ];
    }
    return ['Further diagnostic workup needed'];
  };

  const handleUpdateHypothesis = (id: string, updates: Partial<DiagnosticHypothesis>) => {
    setGameState(prev => ({
      ...prev,
      hypotheses: prev.hypotheses.map(hyp =>
        hyp.id === id ? { ...hyp, ...updates } : hyp
      )
    }));
  };

  const handleRemoveHypothesis = (id: string) => {
    setGameState(prev => ({
      ...prev,
      hypotheses: prev.hypotheses.filter(hyp => hyp.id !== id)
    }));
  };

  const handleConsultSpecialist = () => {
    if (consultationsRemaining > 0 && currentCase) {
      setGameState(prev => ({
        ...prev,
        consultationsUsed: prev.consultationsUsed + 1
      }));

      // Provide specialist insight
      const insight = getSpecialistInsight(currentCase);
      toast({
        title: "🩺 Specialist Consultation",
        description: insight,
      });
    }
  };

  const getSpecialistInsight = (case_: ClinicalCase): string => {
    if (case_.correctDiagnosis.includes('Hemophilia')) {
      return "Consider inherited coagulation disorders given the family history and prolonged PTT with normal platelet count.";
    }
    if (case_.correctDiagnosis.includes('Warfarin')) {
      return "Drug interactions with warfarin are common, especially with antibiotics. Check recent medication changes.";
    }
    if (case_.correctDiagnosis.includes('TTP')) {
      return "This constellation of symptoms requires immediate evaluation for thrombotic microangiopathy. Time is critical.";
    }
    return "Consider the pattern of lab abnormalities and clinical presentation systematically.";
  };

  const handleSearchLiterature = async (query: string) => {
    if (!query.trim()) return;

    toast({
      title: "🔍 Searching Medical Literature",
      description: "Fetching latest research findings from trusted medical databases...",
    });

    // The actual search will be handled by the LiteratureSearch component
    // This function now serves as a callback for toast notifications
  };

  const searchMedicalLiterature = async (query: string) => {
    // Format search query for medical literature
    const medicalQuery = `${query} hematology pathology clinical study site:pubmed.ncbi.nlm.nih.gov OR site:ajol.info OR site:sciencedirect.com`;
    
    // This would typically call a medical literature API
    // For now, return mock data structure
    return [
      {
        title: `Clinical study on ${query}`,
        authors: "Medical Research Team",
        journal: "Journal of Hematology",
        year: "2024",
        abstract: `Recent findings regarding ${query} in clinical practice...`,
        doi: "10.1000/example",
        relevance: "High"
      }
    ];
  };

  const handleLabResultClick = (result: LabResult) => {
    const interpretation = getLabInterpretation(result);
    toast({
      title: `💡 ${result.name} Interpretation`,
      description: interpretation,
    });
  };

  const getLabInterpretation = (result: LabResult): string => {
    switch (result.name) {
      case 'Factor VIII Activity':
        if (typeof result.value === 'number' && result.value < 30) return "Severely reduced Factor VIII suggests moderate to severe hemophilia A";
        if (typeof result.value === 'number' && result.value < 50) return "Mildly reduced Factor VIII may indicate mild hemophilia A or other causes";
        return "Normal Factor VIII activity";
      case 'INR':
        if (typeof result.value === 'number' && result.value > 5) return "Critically elevated INR indicates severe anticoagulation - bleeding risk is very high";
        if (typeof result.value === 'number' && result.value > 3.5) return "Significantly elevated INR - increased bleeding risk";
        return "Therapeutic or normal INR range";
      case 'Platelet Count':
        if (typeof result.value === 'number' && result.value < 20) return "Severe thrombocytopenia - high bleeding risk, consider TTP/ITP";
        if (typeof result.value === 'number' && result.value < 100) return "Thrombocytopenia - investigate cause";
        return "Normal platelet count";
      default:
        return `${result.name}: ${result.value} ${result.unit} (Reference: ${result.referenceRange})`;
    }
  };

  const submitDiagnosis = () => {
    if (!currentCase || gameState.hypotheses.length === 0) return;

    const topHypothesis = gameState.hypotheses.reduce((top, current) =>
      current.probability > top.probability ? current : top
    );

    const isCorrect = topHypothesis.diagnosis.toLowerCase().includes(
      currentCase.correctDiagnosis.toLowerCase().split(' ')[0]
    );

    let finalScore = 0;
    const timeInMinutes = gameState.timeElapsed / 60;
    const timeLimit = currentCase.timeLimit;

    // Calculate score
    if (isCorrect) {
      finalScore += 1000; // Base score for correct diagnosis
      
      // Time bonus (up to 500 points)
      const timeBonus = Math.max(0, (timeLimit - timeInMinutes) / timeLimit * 500);
      finalScore += Math.round(timeBonus);
      
      // Evidence quality bonus (up to 300 points)
      const evidenceBonus = Math.min(topHypothesis.supportingEvidence.length * 50, 300);
      finalScore += evidenceBonus;
      
      // Consultation penalty
      finalScore -= gameState.consultationsUsed * 100;
    } else {
      finalScore = Math.max(100, 500 - gameState.consultationsUsed * 50); // Partial credit
    }

    setGameState(prev => ({
      ...prev,
      score: finalScore,
      isComplete: true,
      feedback: generateFeedback(isCorrect, topHypothesis, currentCase)
    }));

    setShowCompletionDialog(true);

    toast({
      title: isCorrect ? "🎉 Correct Diagnosis!" : "📝 Case Complete",
      description: isCorrect 
        ? `Excellent clinical reasoning! Score: ${finalScore}`
        : `Diagnosis needs refinement. Review the feedback.`,
    });
  };

  const generateFeedback = (
    isCorrect: boolean, 
    hypothesis: DiagnosticHypothesis, 
    case_: ClinicalCase
  ): string[] => {
    const feedback: string[] = [];
    
    if (isCorrect) {
      feedback.push("✅ Correct diagnosis identified");
      feedback.push("✅ Good use of clinical reasoning");
      if (hypothesis.supportingEvidence.length >= 3) {
        feedback.push("✅ Strong evidence-based approach");
      }
    } else {
      feedback.push(`❌ Missed diagnosis: ${case_.correctDiagnosis}`);
      feedback.push("💡 Key learning points:");
      case_.learningObjectives.forEach(obj => feedback.push(`• ${obj}`));
    }
    
    return feedback;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const timeRemaining = currentCase ? (currentCase.timeLimit * 60 - gameState.timeElapsed) / 60 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 dark:from-slate-950 dark:via-blue-950 dark:to-purple-950 p-4 pb-20">
      <div className="container mx-auto max-w-7xl">
        <Link to="/" className="inline-flex items-center mb-4 text-primary hover:text-primary/80">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        {/* Header */}
        <Card className="border-border shadow-lg mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              <div className="text-center lg:text-left">
                <h1 className="text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Level 3: Pathology Professor
                </h1>
                <p className="text-muted-foreground text-base lg:text-lg">
                  Master clinical case analysis and diagnostic reasoning
                </p>
                {currentCase && (
                  <Badge variant="outline" className="mt-2">
                    Case {currentCaseIndex + 1}/{clinicalCases.length}: {currentCase.title}
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-4 lg:space-x-8">
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-primary">{gameState.score}</div>
                  <div className="text-sm text-muted-foreground">Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-secondary">
                    {formatTime(gameState.timeElapsed)}
                  </div>
                  <div className="text-sm text-muted-foreground">Elapsed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-accent">
                    {gameState.hypotheses.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Hypotheses</div>
                </div>
              </div>
            </div>
            
            {gameStarted && currentCase && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Case Progress</span>
                  <Badge variant={currentCase.isUrgent ? "destructive" : "secondary"}>
                    {currentCase.difficulty.charAt(0).toUpperCase() + currentCase.difficulty.slice(1)}
                  </Badge>
                </div>
                <Progress 
                  value={gameState.isComplete ? 100 : Math.min((gameState.timeElapsed / (currentCase.timeLimit * 60)) * 100, 100)} 
                  className="h-3" 
                />
                <p className="text-center text-muted-foreground mt-2 text-sm">
                  {gameState.isComplete ? 'Case Complete' : `Time Remaining: ${Math.max(0, Math.ceil(timeRemaining))} min`}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {!gameStarted ? (
          // Case Selection and Start Screen
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-primary" />
                  Case Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{currentCase.title}</h3>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline">{currentCase.difficulty}</Badge>
                      <Badge variant="outline">{currentCase.category}</Badge>
                      {currentCase.isUrgent && <Badge variant="destructive">Urgent</Badge>}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Learning Objectives:</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      {currentCase.learningObjectives.map((obj, index) => (
                        <li key={index} className="flex items-center">
                          <Target className="h-3 w-3 mr-2 text-primary" />
                          {obj}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <span>Time Limit:</span>
                      <span className="font-medium">{currentCase.timeLimit} minutes</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Consultations:</span>
                      <span className="font-medium">{maxConsultations} available</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Stethoscope className="h-5 w-5 mr-2 text-primary" />
                  Game Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={startGame} size="lg" className="w-full">
                  <Play className="h-4 w-4 mr-2" />
                  Start Clinical Case
                </Button>
                
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">How to Play</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Analyze patient data systematically</li>
                    <li>• Build differential diagnoses</li>
                    <li>• Use evidence-based reasoning</li>
                    <li>• Consult specialists when needed</li>
                    <li>• Submit your final diagnosis</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Active Game Interface
          <div className="grid lg:grid-cols-12 gap-6">
            {/* Patient Profile */}
            <div className="lg:col-span-4">
              <PatientProfile 
                patient={currentCase.patient}
                isUrgent={currentCase.isUrgent}
                timeRemaining={timeRemaining}
              />
            </div>

            {/* Laboratory Results */}
            <div className="lg:col-span-4">
              <LaboratoryResults 
                labResults={currentCase.patient.labResults}
                onResultClick={handleLabResultClick}
              />
            </div>

            {/* Diagnostic Workspace */}
            <div className="lg:col-span-4">
              <DiagnosticWorkspace
                hypotheses={gameState.hypotheses}
                onAddHypothesis={handleAddHypothesis}
                onUpdateHypothesis={handleUpdateHypothesis}
                onRemoveHypothesis={handleRemoveHypothesis}
                onConsultSpecialist={handleConsultSpecialist}
                onSearchLiterature={handleSearchLiterature}
                consultationsRemaining={consultationsRemaining}
              />
              
              {/* Submit Diagnosis */}
              <Card className="mt-4 border-border">
                <CardContent className="p-4">
                  <Button 
                    onClick={submitDiagnosis}
                    disabled={gameState.hypotheses.length === 0 || gameState.isComplete}
                    className="w-full"
                    size="lg"
                  >
                    <Trophy className="h-4 w-4 mr-2" />
                    Submit Final Diagnosis
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Completion Dialog */}
      <AlertDialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-2xl font-bold text-primary">
              🩺 Case Analysis Complete! 🩺
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-lg">
              {gameState.feedback[0]?.includes('✅') 
                ? 'Excellent diagnostic reasoning!' 
                : 'Case complete - review the feedback for learning.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-6">
            <div className="grid grid-cols-3 gap-4 text-center mb-6">
              <div className="bg-muted p-4 rounded-lg">
                <div className="text-2xl font-bold text-primary">{gameState.score}</div>
                <div className="text-sm text-muted-foreground">Final Score</div>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <div className="text-2xl font-bold text-secondary">{formatTime(gameState.timeElapsed)}</div>
                <div className="text-sm text-muted-foreground">Completion Time</div>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <div className="text-2xl font-bold text-accent">{gameState.consultationsUsed}/{maxConsultations}</div>
                <div className="text-sm text-muted-foreground">Consultations Used</div>
              </div>
            </div>
            
            {/* Feedback */}
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Clinical Feedback</h4>
              <ul className="text-sm space-y-1">
                {gameState.feedback.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <AlertDialogFooter className="flex justify-center space-x-4">
            <AlertDialogAction onClick={resetLevel}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Retry Case
            </AlertDialogAction>
            {currentCaseIndex < clinicalCases.length - 1 && (
              <AlertDialogAction onClick={nextCase}>
                <Award className="h-4 w-4 mr-2" />
                Next Case
              </AlertDialogAction>
            )}
            {currentCaseIndex === clinicalCases.length - 1 && (
              <AlertDialogAction onClick={() => navigate('/level4')}>
                <Award className="h-4 w-4 mr-2" />
                Final Level
              </AlertDialogAction>
            )}
            <AlertDialogCancel onClick={() => navigate('/')}>
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
