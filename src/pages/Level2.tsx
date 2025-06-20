import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Flask, Microscope, TestTube, Timer, Star, ArrowRight, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Test {
  id: string;
  name: string;
  description: string;
  cost: number;
  timeMinutes: number;
}

interface Result {
  testId: string;
  value: string;
  unit: string;
  reference: string;
  abnormal: boolean;
}

interface Case {
  id: string;
  complaint: string;
  history: string;
  physicalExam: string;
  possibleDiagnoses: string[];
  correctDiagnosis: string;
  explanation: string;
  results: Result[];
}

const tests: Test[] = [
  {
    id: 'cbc',
    name: 'Complete Blood Count',
    description: 'Evaluates overall blood health.',
    cost: 25,
    timeMinutes: 30,
  },
  {
    id: 'cmp',
    name: 'Comprehensive Metabolic Panel',
    description: 'Assesses kidney and liver function.',
    cost: 35,
    timeMinutes: 45,
  },
  {
    id: 'lipid',
    name: 'Lipid Panel',
    description: 'Measures cholesterol and triglycerides.',
    cost: 30,
    timeMinutes: 40,
  },
  {
    id: 'thyroid',
    name: 'Thyroid Function Test',
    description: 'Evaluates thyroid hormone levels.',
    cost: 40,
    timeMinutes: 60,
  },
  {
    id: 'glucose',
    name: 'Glucose Test',
    description: 'Measures blood sugar levels.',
    cost: 20,
    timeMinutes: 20,
  },
  {
    id: 'electrolyte',
    name: 'Electrolyte Panel',
    description: 'Assesses electrolyte balance.',
    cost: 28,
    timeMinutes: 35,
  },
];

const cases: Case[] = [
  {
    id: 'case1',
    complaint: 'Fatigue and weight gain',
    history: 'Patient reports feeling tired and has gained weight over the past few months.',
    physicalExam: 'Dry skin, puffy face, and slow reflexes.',
    possibleDiagnoses: ['Hypothyroidism', 'Anemia', 'Depression'],
    correctDiagnosis: 'Hypothyroidism',
    explanation: 'The symptoms and lab results point towards an underactive thyroid gland.',
    results: [
      { testId: 'thyroid', value: '2.0', unit: 'mIU/L', reference: '0.5-5.0', abnormal: false },
      { testId: 'cbc', value: 'Normal', unit: '', reference: '', abnormal: false },
    ],
  },
  {
    id: 'case2',
    complaint: 'Abdominal pain and jaundice',
    history: 'Patient reports severe abdominal pain and yellowing of the skin.',
    physicalExam: 'Tenderness in the upper abdomen, enlarged liver.',
    possibleDiagnoses: ['Hepatitis', 'Gallstones', 'Pancreatitis'],
    correctDiagnosis: 'Hepatitis',
    explanation: 'Elevated liver enzymes and jaundice indicate liver inflammation.',
    results: [
      { testId: 'cmp', value: 'High', unit: '', reference: '', abnormal: true },
      { testId: 'cbc', value: 'Normal', unit: '', reference: '', abnormal: false },
    ],
  },
  {
    id: 'case3',
    complaint: 'Increased thirst and frequent urination',
    history: 'Patient reports excessive thirst and frequent urination, especially at night.',
    physicalExam: 'Normal blood pressure, slightly dry mucous membranes.',
    possibleDiagnoses: ['Diabetes', 'Kidney Disease', 'Dehydration'],
    correctDiagnosis: 'Diabetes',
    explanation: 'Elevated glucose levels confirm a diagnosis of diabetes.',
    results: [
      { testId: 'glucose', value: '200', unit: 'mg/dL', reference: '70-100', abnormal: true },
      { testId: 'cmp', value: 'Normal', unit: '', reference: '', abnormal: false },
    ],
  },
];

const Level2 = () => {
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [currentCaseIndex, setCurrentCaseIndex] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Reset level when case index changes
    resetLevel();
  }, [currentCaseIndex]);

  const handleTestSelection = (testId: string) => {
    if (selectedTests.includes(testId)) {
      setSelectedTests(selectedTests.filter(id => id !== testId));
    } else if (selectedTests.length < 3) {
      setSelectedTests([...selectedTests, testId]);
    }
  };

  const handleRunTests = () => {
    setIsRunningTests(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunningTests(false);
          setShowResults(true);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleDiagnosis = (diagnosis: string) => {
    setSelectedDiagnosis(diagnosis);
    const correct = currentCase?.correctDiagnosis === diagnosis;
    setIsCorrect(correct);
    setScore(prev => correct ? prev + 200 : prev);
    setShowFeedback(true);
  };

  const handleNextCase = () => {
    if (currentCaseIndex < cases.length - 1) {
      setCurrentCaseIndex(prev => prev + 1);
      resetLevel();
    } else {
      setGameCompleted(true);
    }
  };

  const resetLevel = () => {
    setSelectedTests([]);
    setShowResults(false);
    setSelectedDiagnosis('');
    setShowFeedback(false);
    setIsCorrect(false);
    setIsRunningTests(false);
    setProgress(0);
  };

  const currentCase = cases[currentCaseIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Level 2: Diagnostic Detective 🔬
            </h1>
            <p className="text-blue-200">Analyze lab results and make the correct diagnosis</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-white border-white/30 bg-white/10">
              Case {currentCaseIndex + 1} of {cases.length}
            </Badge>
            <Badge variant="outline" className="text-yellow-300 border-yellow-300/30 bg-yellow-300/10">
              Score: {score}
            </Badge>
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="text-white border-white/30 hover:bg-white/10"
            >
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
          </div>
        </div>

        {gameCompleted ? (
          <Card className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400/30 text-center p-8">
            <CardContent>
              <div className="flex justify-center mb-4">
                <Star className="h-16 w-16 text-yellow-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Congratulations! 🎉</h2>
              <p className="text-green-200 mb-6">
                You've completed Level 2: Diagnostic Detective!
                <br />Final Score: {score} points
              </p>
              <div className="flex justify-center gap-4">
                <Button 
                  onClick={() => navigate('/level3')}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  Continue to Level 3 <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button onClick={() => window.location.reload()} variant="outline">
                  Play Again
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Patient Case */}
            <Card className="lg:col-span-1 bg-slate-800/50 border-slate-600/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TestTube className="h-5 w-5 mr-2 text-blue-400" />
                  Patient Case
                </CardTitle>
              </CardHeader>
              <CardContent className="text-white space-y-4">
                <div>
                  <h3 className="font-semibold text-blue-300 mb-2">Chief Complaint</h3>
                  <p className="text-sm text-gray-300">{currentCase?.complaint}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-300 mb-2">History</h3>
                  <p className="text-sm text-gray-300">{currentCase?.history}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-300 mb-2">Physical Exam</h3>
                  <p className="text-sm text-gray-300">{currentCase?.physicalExam}</p>
                </div>
              </CardContent>
            </Card>

            {/* Test Selection */}
            <Card className="lg:col-span-2 bg-slate-800/50 border-slate-600/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <div className="flex items-center">
                    <Flask className="h-5 w-5 mr-2 text-green-400" />
                    Laboratory Tests
                  </div>
                  <Badge variant="outline" className="text-white border-white/30">
                    Selected: {selectedTests.length}/3
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {tests.map((test) => (
                    <div
                      key={test.id}
                      onClick={() => handleTestSelection(test.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                        selectedTests.includes(test.id)
                          ? 'border-blue-400 bg-blue-400/20 scale-105'
                          : 'border-slate-600 bg-slate-700/50 hover:border-slate-500 hover:bg-slate-700/70'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-white">{test.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          ${test.cost}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-300 mb-2">{test.description}</p>
                      <div className="flex items-center text-xs text-gray-400">
                        <Timer className="h-3 w-3 mr-1" />
                        {test.timeMinutes} min
                      </div>
                    </div>
                  ))}
                </div>

                {selectedTests.length > 0 && !showResults && (
                  <div className="text-center">
                    <Button
                      onClick={handleRunTests}
                      disabled={selectedTests.length === 0 || isRunningTests}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                    >
                      {isRunningTests ? (
                        <>
                          <Microscope className="h-4 w-4 mr-2 animate-spin" />
                          Running Tests...
                        </>
                      ) : (
                        <>
                          <Flask className="h-4 w-4 mr-2" />
                          Run Selected Tests
                        </>
                      )}
                    </Button>
                    {isRunningTests && (
                      <div className="mt-4">
                        <Progress value={progress} className="w-full" />
                        <p className="text-sm text-gray-300 mt-2">Processing samples...</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Test Results */}
            {showResults && (
              <Card className="lg:col-span-3 bg-slate-800/50 border-slate-600/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <TestTube className="h-5 w-5 mr-2 text-yellow-400" />
                    Laboratory Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {selectedTests.map((testId) => {
                      const test = tests.find(t => t.id === testId);
                      const result = currentCase?.results.find(r => r.testId === testId);
                      return (
                        <div key={testId} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                          <h3 className="font-semibold text-white mb-2">{test?.name}</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-300">Result:</span>
                              <span className={`font-semibold ${
                                result?.abnormal ? 'text-red-400' : 'text-green-400'
                              }`}>
                                {result?.value} {result?.unit}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-300">Reference:</span>
                              <span className="text-gray-400">{result?.reference}</span>
                            </div>
                            {result?.abnormal && (
                              <Badge variant="destructive" className="w-full justify-center">
                                Abnormal
                              </Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Diagnosis Selection */}
                  <div className="border-t border-slate-600 pt-6">
                    <h3 className="text-xl font-semibold text-white mb-4">Select Diagnosis:</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {currentCase?.possibleDiagnoses.map((diagnosis, index) => (
                        <Button
                          key={index}
                          onClick={() => handleDiagnosis(diagnosis)}
                          variant="outline"
                          className={`p-4 h-auto text-left justify-start ${
                            selectedDiagnosis === diagnosis
                              ? isCorrect
                                ? 'border-green-400 bg-green-400/20 text-green-300'
                                : 'border-red-400 bg-red-400/20 text-red-300'
                              : 'border-slate-600 hover:border-slate-500 text-white'
                          }`}
                          disabled={!!selectedDiagnosis}
                        >
                          {selectedDiagnosis === diagnosis && (
                            <>
                              {isCorrect ? (
                                <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
                              ) : (
                                <XCircle className="h-5 w-5 mr-2 text-red-400" />
                              )}
                            </>
                          )}
                          {diagnosis}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Feedback */}
                  {showFeedback && (
                    <Card className={`mt-6 ${
                      isCorrect 
                        ? 'bg-green-500/20 border-green-400/30' 
                        : 'bg-red-500/20 border-red-400/30'
                    }`}>
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          {isCorrect ? (
                            <CheckCircle className="h-8 w-8 text-green-400 flex-shrink-0 mt-1" />
                          ) : (
                            <XCircle className="h-8 w-8 text-red-400 flex-shrink-0 mt-1" />
                          )}
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-white mb-2">
                              {isCorrect ? 'Correct Diagnosis! 🎉' : 'Incorrect Diagnosis'}
                            </h3>
                            <p className="text-gray-300 mb-4">
                              {isCorrect 
                                ? `Excellent work! You correctly identified ${currentCase?.correctDiagnosis}.`
                                : `The correct diagnosis was: ${currentCase?.correctDiagnosis}`}
                            </p>
                            <div className="bg-slate-800/50 p-4 rounded-lg">
                              <h4 className="font-semibold text-blue-300 mb-2">Educational Note:</h4>
                              <p className="text-sm text-gray-300">{currentCase?.explanation}</p>
                            </div>
                            <div className="flex justify-center mt-6">
                              {currentCaseIndex < cases.length - 1 ? (
                                <Button
                                  onClick={handleNextCase}
                                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                                >
                                  Next Case <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                              ) : (
                                <Button
                                  onClick={handleNextCase}
                                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                                >
                                  Complete Level 2 <Star className="ml-2 h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Level2;
