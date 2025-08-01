
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Clock, Target, Users, Home, Brain, Microscope, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '@/components/ThemeToggle';
import DiagnosisAnalyzer from '@/components/DiagnosisAnalyzer';

const Level2: React.FC = () => {
  const navigate = useNavigate();
  const [currentScenario, setCurrentScenario] = useState(0);
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [gameMode, setGameMode] = useState<'quiz' | 'analysis'>('quiz');

  // Enhanced scenarios with diagnosis analysis data
  const scenarios = [
    {
      id: 1,
      title: "Emergency: Massive Hemorrhage",
      urgency: "critical" as const,
      description: "A 45-year-old patient presents with massive gastrointestinal bleeding following anticoagulant therapy.",
      question: "What is the most appropriate immediate intervention?",
      options: [
        "Administer fresh frozen plasma and vitamin K",
        "Start platelet transfusion immediately",
        "Give protamine sulfate",
        "Begin heparin therapy"
      ],
      correctAnswer: 0,
      explanation: "For anticoagulant-related bleeding, reversing the anticoagulation with FFP and vitamin K is the priority.",
      // Diagnosis analysis data
      analysisData: {
        symptoms: ["Massive GI bleeding", "Recent anticoagulant use", "Hemodynamic instability"],
        labResults: ["Prolonged PT/INR", "Low hemoglobin", "Normal platelet count"],
        history: "45-year-old on warfarin therapy for atrial fibrillation",
        correctDiagnosis: "Anticoagulant-associated bleeding",
        differentialDiagnoses: ["Peptic ulcer disease", "Esophageal varices", "Mallory-Weiss tear"]
      }
    },
    {
      id: 2,
      title: "Pediatric Case: Recurrent Bleeding",
      urgency: "moderate" as const,
      description: "An 8-year-old boy presents with recurrent joint bleeding and prolonged bleeding after minor trauma.",
      question: "Which test would be most appropriate for initial screening?",
      options: [
        "Platelet aggregometry",
        "PT/INR and aPTT",
        "Thrombin time",
        "Factor VIII activity"
      ],
      correctAnswer: 1,
      explanation: "PT/INR and aPTT provide a comprehensive initial screening for bleeding disorders.",
      analysisData: {
        symptoms: ["Recurrent joint bleeding", "Prolonged bleeding after trauma", "Easy bruising"],
        labResults: ["Prolonged aPTT", "Normal PT", "Normal platelet count"],
        history: "8-year-old male, family history of bleeding disorders",
        correctDiagnosis: "Hemophilia A",
        differentialDiagnoses: ["Hemophilia B", "von Willebrand disease", "Platelet dysfunction"]
      }
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    if (answerIndex === scenarios[currentScenario].correctAnswer) {
      setScore(prev => prev + 100);
    }
  };

  const handleNextScenario = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(prev => prev + 1);
      setSelectedAnswer(null);
    }
  };

  const handleAnalysisComplete = (correct: boolean, points: number) => {
    setScore(prev => prev + points);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentCase = scenarios[currentScenario];
  const progress = ((currentScenario + 1) / scenarios.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 light:from-blue-50 light:via-purple-50 light:to-indigo-50">
      {/* Header */}
      <div className="container mx-auto p-4">
        <Card className="glassmorphic-card mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="text-center lg:text-left">
                <h1 className="text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Level 2: Clinical Case Mastery
                </h1>
                <p className="text-blue-200 dark:text-blue-200 light:text-blue-800">
                  Navigate complex bleeding disorder scenarios
                </p>
              </div>

              <div className="flex items-center justify-center lg:justify-end gap-4">
                <ThemeToggle />
                <Button
                  onClick={() => navigate('/')}
                  className="bg-red-600/80 hover:bg-red-700 backdrop-blur-sm border border-red-400/30"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex justify-center gap-8 mt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{score}</div>
                <div className="text-sm text-gray-300 dark:text-gray-300 light:text-gray-700">Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{formatTime(timeElapsed)}</div>
                <div className="text-sm text-gray-300 dark:text-gray-300 light:text-gray-700">Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{currentScenario + 1}/{scenarios.length}</div>
                <div className="text-sm text-gray-300 dark:text-gray-300 light:text-gray-700">Cases</div>
              </div>
            </div>

            <Progress value={progress} className="mt-4" />
          </CardContent>
        </Card>

        {/* Game Mode Selection */}
        <Card className="glassmorphic-card mb-6">
          <CardContent className="p-4">
            <div className="flex justify-center gap-4">
              <Button
                onClick={() => setGameMode('quiz')}
                variant={gameMode === 'quiz' ? 'default' : 'outline'}
                className={gameMode === 'quiz' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-white/10 hover:bg-white/20 border-white/20'}
              >
                Quiz Mode
              </Button>
              <Button
                onClick={() => setGameMode('analysis')}
                variant={gameMode === 'analysis' ? 'default' : 'outline'}
                className={gameMode === 'analysis' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-white/10 hover:bg-white/20 border-white/20'}
              >
                Diagnosis Analysis
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Current Case */}
        <Card className="glassmorphic-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl text-white dark:text-white light:text-black">
                {currentCase.title}
              </CardTitle>
              <Badge 
                variant={currentCase.urgency === 'critical' ? 'destructive' : 'secondary'}
                className="flex items-center gap-1"
              >
                {currentCase.urgency === 'critical' && <AlertTriangle className="h-3 w-3" />}
                <Clock className="h-3 w-3" />
                {currentCase.urgency}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <p className="text-blue-100 dark:text-blue-100 light:text-blue-900 text-lg">
                {currentCase.description}
              </p>

              {gameMode === 'quiz' ? (
                <div className="bg-blue-800/30 dark:bg-blue-800/30 light:bg-blue-100/50 p-4 rounded-lg">
                  <h3 className="font-semibold text-white dark:text-white light:text-black mb-3">
                    {currentCase.question}
                  </h3>
                  
                  <div className="space-y-2">
                    {currentCase.options.map((option, index) => (
                      <Button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        variant={selectedAnswer === index ? "default" : "outline"}
                        className={`w-full justify-start text-left h-auto p-4 ${
                          selectedAnswer === index
                            ? index === currentCase.correctAnswer
                              ? 'bg-green-600 hover:bg-green-700 border-green-500'
                              : 'bg-red-600 hover:bg-red-700 border-red-500'
                            : 'bg-white/10 hover:bg-white/20 border-white/20'
                        }`}
                        disabled={selectedAnswer !== null}
                      >
                        <span className="mr-3 font-bold">
                          {String.fromCharCode(65 + index)}.
                        </span>
                        {option}
                      </Button>
                    ))}
                  </div>

                  {selectedAnswer !== null && (
                    <div className="mt-4 p-4 bg-blue-900/50 dark:bg-blue-900/50 light:bg-blue-50 rounded-lg">
                      <p className="text-blue-100 dark:text-blue-100 light:text-blue-900">
                        <strong>Explanation:</strong> {currentCase.explanation}
                      </p>
                      
                      {currentScenario < scenarios.length - 1 ? (
                        <Button 
                          onClick={handleNextScenario}
                          className="mt-3 bg-blue-600 hover:bg-blue-700"
                        >
                          Next Case
                        </Button>
                      ) : (
                        <div className="mt-3 text-center">
                          <p className="text-green-400 font-bold mb-3">Level 2 Complete!</p>
                          <Button 
                            onClick={() => navigate('/level3')}
                            className="bg-green-600 hover:bg-green-700 mr-2"
                          >
                            <Target className="h-4 w-4 mr-2" />
                            Continue to Level 3
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <DiagnosisAnalyzer 
                  patientCase={currentCase.analysisData}
                  onAnalysisComplete={handleAnalysisComplete}
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Navigation */}
        <Card className="glassmorphic-card mt-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                onClick={() => navigate('/level1')}
                variant="outline"
                className="bg-white/10 hover:bg-white/20 border-white/20"
              >
                <Brain className="h-4 w-4 mr-2" />
                Level 1: Cascade
              </Button>
              <Button
                onClick={() => navigate('/level3')}
                variant="outline"
                className="bg-white/10 hover:bg-white/20 border-white/20"
              >
                <Microscope className="h-4 w-4 mr-2" />
                Level 3: Pathology
              </Button>
              <Button
                onClick={() => navigate('/level4')}
                variant="outline"
                className="bg-white/10 hover:bg-white/20 border-white/20"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Level 4: Research
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Level2;
