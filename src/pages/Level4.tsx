
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  Play, 
  RotateCcw, 
  Stethoscope,
  FileText,
  Award,
  CheckCircle,
  XCircle,
  Clock,
  Brain
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

interface ClinicalCase {
  id: number;
  title: string;
  patientInfo: string;
  symptoms: string[];
  labResults: string[];
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: 'Bleeding Disorder' | 'Thrombosis' | 'Lab Interpretation' | 'Treatment';
  references: string[];
}

const Level4 = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [level4Complete, setLevel4Complete] = useState(false);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [currentCaseIndex, setCurrentCaseIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [casesCompleted, setCasesCompleted] = useState<boolean[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const clinicalCases: ClinicalCase[] = [
    {
      id: 1,
      title: "The Bleeding Child",
      patientInfo: "8-year-old male with recurrent nosebleeds and easy bruising since early childhood",
      symptoms: [
        "Frequent epistaxis (nosebleeds)",
        "Easy bruising with minor trauma",
        "Prolonged bleeding after dental procedures",
        "No family history of bleeding disorders"
      ],
      labResults: [
        "PT: 12 seconds (normal: 11-13 sec)",
        "aPTT: 45 seconds (normal: 25-35 sec)",
        "Platelet count: 280,000/μL (normal)",
        "Bleeding time: 8 minutes (normal: 2-7 min)"
      ],
      question: "What is the most likely diagnosis?",
      options: [
        "Hemophilia A (Factor VIII deficiency)",
        "Hemophilia B (Factor IX deficiency)", 
        "Von Willebrand Disease",
        "Platelet function disorder"
      ],
      correctAnswer: 2,
      explanation: "The prolonged aPTT with normal PT and platelet count, combined with prolonged bleeding time and clinical presentation, strongly suggests Von Willebrand Disease. This is the most common inherited bleeding disorder.",
      difficulty: "Medium",
      category: "Bleeding Disorder",
      references: [
        "https://pubmed.ncbi.nlm.nih.gov/28301907/",
        "Williams Hematology 9th Edition, Chapter 147"
      ]
    },
    {
      id: 2,
      title: "The Anticoagulated Patient",
      patientInfo: "65-year-old female on warfarin for atrial fibrillation presents with severe epistaxis",
      symptoms: [
        "Severe nosebleed for 2 hours",
        "Dizziness and weakness",
        "Multiple bruises on arms and legs",
        "Taking warfarin 5mg daily"
      ],
      labResults: [
        "PT: 45 seconds (normal: 11-13 sec)",
        "INR: 8.2 (target: 2.0-3.0)",
        "aPTT: 38 seconds (normal: 25-35 sec)",
        "Hemoglobin: 8.5 g/dL (normal: 12-15 g/dL)"
      ],
      question: "What is the most appropriate immediate management?",
      options: [
        "Increase warfarin dose",
        "Hold warfarin and give vitamin K",
        "Give fresh frozen plasma and vitamin K",
        "Start heparin bridge therapy"
      ],
      correctAnswer: 2,
      explanation: "With INR >8 and active bleeding, immediate reversal is needed. Fresh frozen plasma provides immediate factor replacement while vitamin K provides longer-term reversal of warfarin effects.",
      difficulty: "Hard",
      category: "Treatment",
      references: [
        "https://pubmed.ncbi.nlm.nih.gov/31648335/",
        "ASH Guidelines on Anticoagulation Reversal"
      ]
    },
    {
      id: 3,
      title: "The Surgical Patient",
      patientInfo: "45-year-old male scheduled for elective surgery with unknown bleeding risk",
      symptoms: [
        "No personal history of bleeding",
        "Family history: father had 'bleeding problems'",
        "Scheduled for major abdominal surgery",
        "Taking no medications"
      ],
      labResults: [
        "PT: 13 seconds (normal: 11-13 sec)",
        "aPTT: 52 seconds (normal: 25-35 sec)",
        "Platelet count: 250,000/μL (normal)",
        "Factor XI level: 15% (normal: 50-150%)"
      ],
      question: "What is the appropriate preoperative management?",
      options: [
        "Proceed with surgery without intervention",
        "Give prophylactic FFP before surgery",
        "Cancel surgery permanently",
        "Consider Factor XI concentrate or antifibrinolytic therapy"
      ],
      correctAnswer: 3,
      explanation: "Factor XI deficiency can cause significant bleeding with major surgery. Preoperative treatment with Factor XI concentrate (if available) or antifibrinolytic agents like tranexamic acid should be considered.",
      difficulty: "Hard",
      category: "Treatment",
      references: [
        "https://pubmed.ncbi.nlm.nih.gov/29920516/",
        "Guidelines for Perioperative Hemostasis Management"
      ]
    },
    {
      id: 4,
      title: "The Thrombotic Event",
      patientInfo: "28-year-old female presents with leg swelling and shortness of breath",
      symptoms: [
        "Left leg swelling and pain",
        "Shortness of breath",
        "Taking oral contraceptives",
        "Recent 8-hour flight"
      ],
      labResults: [
        "D-dimer: 2400 ng/mL (normal: <500 ng/mL)",
        "PT: 12 seconds (normal)",
        "aPTT: 28 seconds (normal)",
        "Ultrasound: Deep vein thrombosis confirmed"
      ],
      question: "What additional testing should be considered after acute treatment?",
      options: [
        "Factor V Leiden mutation",
        "Antithrombin III level",
        "Protein C and S levels",
        "All of the above"
      ],
      correctAnswer: 3,
      explanation: "Young patients with unprovoked thrombosis should be evaluated for thrombophilia, including Factor V Leiden, Prothrombin G20210A mutation, and natural anticoagulant deficiencies (AT III, Protein C, Protein S).",
      difficulty: "Medium",
      category: "Thrombosis",
      references: [
        "https://pubmed.ncbi.nlm.nih.gov/29923465/",
        "ASH Guidelines on Thrombophilia Testing"
      ]
    },
    {
      id: 5,
      title: "The Laboratory Mystery",
      patientInfo: "Adult patient with unusual coagulation test results",
      symptoms: [
        "Routine preoperative testing",
        "No bleeding history",
        "No medications",
        "Asymptomatic"
      ],
      labResults: [
        "PT: 11 seconds (normal: 11-13 sec)",
        "aPTT: 48 seconds (normal: 25-35 sec)",
        "Mixing study: aPTT corrects to 32 seconds",
        "Factor XII level: <1% (normal: 50-150%)"
      ],
      question: "What is the clinical significance of these findings?",
      options: [
        "High bleeding risk - surgery should be postponed",
        "Lupus anticoagulant present",
        "No clinical significance - proceed with surgery",
        "Heparin contamination of sample"
      ],
      correctAnswer: 2,
      explanation: "Factor XII deficiency causes prolonged aPTT but does not cause bleeding. The mixing study correction confirms factor deficiency rather than inhibitor. Surgery can proceed safely.",
      difficulty: "Easy",
      category: "Lab Interpretation",
      references: [
        "https://pubmed.ncbi.nlm.nih.gov/25861491/",
        "Laboratory Diagnosis of Coagulation Disorders"
      ]
    }
  ];

  useEffect(() => {
    setCasesCompleted(new Array(clinicalCases.length).fill(false));
  }, []);

  useEffect(() => {
    if (gameStarted) {
      const timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameStarted]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (showExplanation) return;
    setSelectedAnswer(answerIndex);
  };

  const submitAnswer = () => {
    if (selectedAnswer === null) {
      toast({
        title: "No Answer Selected",
        description: "Please select an answer before submitting.",
        variant: "destructive"
      });
      return;
    }

    const currentCase = clinicalCases[currentCaseIndex];
    const isCorrect = selectedAnswer === currentCase.correctAnswer;
    
    if (isCorrect) {
      const points = currentCase.difficulty === 'Hard' ? 300 : currentCase.difficulty === 'Medium' ? 200 : 100;
      setScore(prev => prev + points);
      setCorrectAnswers(prev => prev + 1);
      toast({
        title: "Correct! 🎯",
        description: `Excellent diagnosis! +${points} points`,
      });
    } else {
      toast({
        title: "Incorrect ❌",
        description: "Review the explanation to understand the correct diagnosis.",
        variant: "destructive"
      });
    }

    setCasesCompleted(prev => {
      const newCompleted = [...prev];
      newCompleted[currentCaseIndex] = true;
      return newCompleted;
    });

    setShowExplanation(true);
  };

  const nextCase = () => {
    if (currentCaseIndex < clinicalCases.length - 1) {
      setCurrentCaseIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      // All cases completed
      setLevel4Complete(true);
      const accuracyBonus = Math.round((correctAnswers / clinicalCases.length) * 500);
      setScore(prev => prev + accuracyBonus);
      setShowCompletionDialog(true);
      toast({
        title: "🎉 Clinical Mastery Achieved!",
        description: `All cases completed! Accuracy bonus: +${accuracyBonus} points`,
      });
    }
  };

  const startGame = () => {
    setGameStarted(true);
    toast({
      title: "🏥 Clinical Cases Started!",
      description: "Apply your knowledge to real clinical scenarios. Read carefully and choose the best answer!",
    });
  };

  const resetLevel = () => {
    setCurrentCaseIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setCasesCompleted(new Array(clinicalCases.length).fill(false));
    setCorrectAnswers(0);
    setScore(0);
    setTimeElapsed(0);
    setLevel4Complete(false);
    setShowCompletionDialog(false);
    setGameStarted(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentCase = clinicalCases[currentCaseIndex];
  const progressPercentage = ((currentCaseIndex + 1) / clinicalCases.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 p-4">
      <div className="container mx-auto max-w-6xl">
        <Link to="/" className="inline-flex items-center mb-4 text-blue-300 hover:text-blue-100">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        {/* Header */}
        <Card className="bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 shadow-2xl mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between text-white">
              <div>
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  Level 4: Clinical Case Studies
                </h1>
                <p className="text-blue-200 text-lg">Apply your knowledge to real-world clinical scenarios</p>
              </div>
              <div className="flex items-center space-x-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">{score}</div>
                  <div className="text-sm text-gray-300">Score</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">{formatTime(timeElapsed)}</div>
                  <div className="text-sm text-gray-300">Time</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">{correctAnswers}/{currentCaseIndex + (showExplanation ? 1 : 0)}</div>
                  <div className="text-sm text-gray-300">Correct</div>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <Progress value={progressPercentage} className="h-3" />
              <p className="text-center text-white mt-2 text-sm">Case Progress: {currentCaseIndex + 1}/{clinicalCases.length}</p>
            </div>
          </CardContent>
        </Card>

        {!gameStarted ? (
          <Card className="bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 shadow-2xl">
            <CardContent className="p-8 text-center">
              <Stethoscope className="h-16 w-16 mx-auto mb-4 text-blue-400" />
              <h2 className="text-2xl font-bold text-white mb-4">Clinical Case Challenge</h2>
              <p className="text-white/80 mb-6 max-w-2xl mx-auto">
                Test your clinical reasoning skills with real-world scenarios involving bleeding disorders, 
                thrombosis, and laboratory interpretation. Each case presents a unique diagnostic challenge.
              </p>
              <Button onClick={startGame} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-8 py-3">
                <Play className="h-5 w-5 mr-2" />
                Start Clinical Cases
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Case Information */}
            <div className="lg:col-span-2">
              <Card className="bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 shadow-2xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center">
                      <FileText className="h-6 w-6 mr-2 text-blue-400" />
                      {currentCase.title}
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-white border-white">
                        {currentCase.difficulty}
                      </Badge>
                      <Badge variant="secondary">
                        {currentCase.category}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Patient Information */}
                  <div className="bg-white/10 p-4 rounded-lg">
                    <h4 className="text-white font-bold mb-2">Patient Information</h4>
                    <p className="text-white/90">{currentCase.patientInfo}</p>
                  </div>

                  {/* Symptoms */}
                  <div className="bg-white/10 p-4 rounded-lg">
                    <h4 className="text-white font-bold mb-2">Clinical Presentation</h4>
                    <ul className="text-white/90 space-y-1">
                      {currentCase.symptoms.map((symptom, index) => (
                        <li key={index} className="flex items-center">
                          <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
                          {symptom}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Lab Results */}
                  <div className="bg-white/10 p-4 rounded-lg">
                    <h4 className="text-white font-bold mb-2">Laboratory Results</h4>
                    <ul className="text-white/90 space-y-1">
                      {currentCase.labResults.map((result, index) => (
                        <li key={index} className="flex items-center font-mono text-sm">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                          {result}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Question and Options */}
                  <div className="bg-white/10 p-4 rounded-lg">
                    <h4 className="text-white font-bold mb-4">{currentCase.question}</h4>
                    <div className="space-y-3">
                      {currentCase.options.map((option, index) => (
                        <Button
                          key={index}
                          variant={selectedAnswer === index ? "default" : "outline"}
                          className={`w-full text-left justify-start p-4 h-auto ${
                            showExplanation 
                              ? index === currentCase.correctAnswer 
                                ? 'bg-green-600 border-green-500 text-white' 
                                : selectedAnswer === index && index !== currentCase.correctAnswer
                                  ? 'bg-red-600 border-red-500 text-white'
                                  : 'opacity-50'
                              : selectedAnswer === index
                                ? 'bg-blue-600 border-blue-500 text-white'
                                : 'border-white text-white hover:bg-white/10'
                          }`}
                          onClick={() => handleAnswerSelect(index)}
                          disabled={showExplanation}
                        >
                          <div className="flex items-center">
                            <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center text-sm font-bold ${
                              showExplanation && index === currentCase.correctAnswer
                                ? 'bg-green-500 border-green-400'
                                : showExplanation && selectedAnswer === index && index !== currentCase.correctAnswer
                                  ? 'bg-red-500 border-red-400'
                                  : ''
                            }`}>
                              {String.fromCharCode(65 + index)}
                            </div>
                            <span>{option}</span>
                            {showExplanation && index === currentCase.correctAnswer && (
                              <CheckCircle className="h-5 w-5 ml-auto text-green-400" />
                            )}
                            {showExplanation && selectedAnswer === index && index !== currentCase.correctAnswer && (
                              <XCircle className="h-5 w-5 ml-auto text-red-400" />
                            )}
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Explanation */}
                  {showExplanation && (
                    <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 p-4 rounded-lg border border-green-400/30">
                      <h4 className="text-white font-bold mb-2 flex items-center">
                        <Brain className="h-5 w-5 mr-2 text-green-400" />
                        Explanation
                      </h4>
                      <p className="text-white/90 mb-3">{currentCase.explanation}</p>
                      <div>
                        <h5 className="text-white font-semibold mb-1">References:</h5>
                        <ul className="text-blue-300 text-sm space-y-1">
                          {currentCase.references.map((ref, index) => (
                            <li key={index}>• {ref}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-between">
                    {!showExplanation ? (
                      <Button onClick={submitAnswer} className="bg-green-600 hover:bg-green-700">
                        Submit Answer
                      </Button>
                    ) : (
                      <Button onClick={nextCase} className="bg-blue-600 hover:bg-blue-700">
                        {currentCaseIndex < clinicalCases.length - 1 ? 'Next Case' : 'Complete Level'}
                      </Button>
                    )}
                    <Button onClick={resetLevel} variant="outline" className="border-white text-white hover:bg-white/10">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset Level
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Progress Panel */}
            <div className="lg:col-span-1">
              <Card className="bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Clock className="h-6 w-6 mr-2 text-yellow-400" />
                    Case Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {clinicalCases.map((caseItem, index) => (
                    <div key={caseItem.id} className={`p-3 rounded-lg ${
                      index === currentCaseIndex ? 'bg-blue-500/30 border border-blue-400' :
                      casesCompleted[index] ? 'bg-green-500/20 border border-green-400' :
                      'bg-white/5 border border-gray-600'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className={`font-semibold ${
                          index === currentCaseIndex ? 'text-blue-300' :
                          casesCompleted[index] ? 'text-green-300' :
                          'text-white/70'
                        }`}>
                          Case {index + 1}
                        </span>
                        {casesCompleted[index] && (
                          <CheckCircle className="h-5 w-5 text-green-400" />
                        )}
                        {index === currentCaseIndex && !casesCompleted[index] && (
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                        )}
                      </div>
                      <p className="text-xs text-white/60 mt-1">{caseItem.category}</p>
                      <Badge variant="outline" className={`text-xs mt-2 ${
                        caseItem.difficulty === 'Hard' ? 'border-red-400 text-red-300' :
                        caseItem.difficulty === 'Medium' ? 'border-yellow-400 text-yellow-300' :
                        'border-green-400 text-green-300'
                      }`}>
                        {caseItem.difficulty}
                      </Badge>
                    </div>
                  ))}
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
            <AlertDialogTitle className="text-center text-2xl font-bold text-indigo-600">
              🏥 Level 4 Complete! 🏥
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-lg">
              Congratulations! You've demonstrated exceptional clinical reasoning skills and mastery of hemostasis disorders!
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{score}</div>
                <div className="text-sm text-gray-600">Final Score</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{Math.round((correctAnswers/clinicalCases.length)*100)}%</div>
                <div className="text-sm text-gray-600">Accuracy</div>
              </div>
              <div className="bg-indigo-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-indigo-600">EXPERT</div>
                <div className="text-sm text-gray-600">Clinical Status</div>
              </div>
            </div>
          </div>

          <AlertDialogFooter className="flex justify-center space-x-4">
            <AlertDialogAction 
              onClick={resetLevel}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Replay Level
            </AlertDialogAction>
            <AlertDialogAction 
              onClick={() => navigate('/')}
              className="bg-green-600 hover:bg-green-700"
            >
              <Award className="h-4 w-4 mr-2" />
              Back to Hub
            </AlertDialogAction>
            <AlertDialogCancel 
              onClick={() => navigate('/')}
            >
              <Stethoscope className="h-4 w-4 mr-2" />
              Main Menu
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Level4;
