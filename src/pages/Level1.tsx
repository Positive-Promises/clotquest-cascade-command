import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowUp, Check, Target, BookOpen, Clock, Play, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import EnhancedFactor from '@/components/EnhancedFactor';
import AnimatedCascade from '@/components/AnimatedCascade';

interface Factor {
  id: string;
  name: string;
  fullName: string;
  pathway: 'intrinsic' | 'extrinsic' | 'common';
  position: { x: number; y: number } | null;
  description: string;
  color: string;
  isPlaced: boolean;
  correctPosition: { x: number; y: number };
  clinicalRelevance: string;
  deficiencyDisorder: string;
  normalRange: string;
  referenceLinks: Array<{
    title: string;
    url: string;
    type: 'pubmed' | 'textbook' | 'video';
  }>;
}

const Level1 = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [level1Complete, setLevel1Complete] = useState(false);

  const [factors, setFactors] = useState<Factor[]>([
    {
      id: 'f12',
      name: 'Factor XII',
      fullName: 'Hageman Factor (Contact Factor)',
      pathway: 'intrinsic',
      position: null,
      description: 'Initiates the intrinsic pathway when activated by contact with negatively charged surfaces like collagen or glass',
      color: 'bg-blue-500',
      isPlaced: false,
      correctPosition: { x: 150, y: 50 },
      clinicalRelevance: 'Deficiency rarely causes bleeding but prolongs aPTT. Important in laboratory activation of coagulation cascade.',
      deficiencyDisorder: 'Factor XII deficiency (usually asymptomatic)',
      normalRange: '50-150% of pooled normal plasma',
      referenceLinks: [
        {
          title: 'Factor XII and Contact Activation',
          url: 'https://pubmed.ncbi.nlm.nih.gov/25861491/',
          type: 'pubmed'
        },
        {
          title: 'Hemostasis and Thrombosis - Hoffman 7th Ed.',
          url: 'https://www.sciencedirect.com/book/9780323462020/hemostasis-and-thrombosis',
          type: 'textbook'
        },
        {
          title: 'Coagulation Cascade Animation',
          url: 'https://www.youtube.com/watch?v=8-iGJ9vM_Gg',
          type: 'video'
        }
      ]
    },
    {
      id: 'f11',
      name: 'Factor XI',
      fullName: 'Plasma Thromboplastin Antecedent',
      pathway: 'intrinsic',
      position: null,
      description: 'Activated by Factor XIIa and also by thrombin in a positive feedback loop. Activates Factor IX.',
      color: 'bg-blue-600',
      isPlaced: false,
      correctPosition: { x: 150, y: 120 },
      clinicalRelevance: 'Deficiency causes mild to moderate bleeding, especially after trauma or surgery. Common in Ashkenazi Jewish population.',
      deficiencyDisorder: 'Hemophilia C (Factor XI deficiency)',
      normalRange: '50-150% of pooled normal plasma',
      referenceLinks: [
        {
          title: 'Factor XI Deficiency',
          url: 'https://pubmed.ncbi.nlm.nih.gov/29920516/',
          type: 'pubmed'
        },
        {
          title: 'Williams Hematology 9th Edition',
          url: 'https://accessmedicine.mhmedical.com/book.aspx?bookid=1581',
          type: 'textbook'
        }
      ]
    },
    {
      id: 'f9',
      name: 'Factor IX',
      fullName: 'Christmas Factor',
      pathway: 'intrinsic',
      position: null,
      description: 'Vitamin K-dependent factor, key component of the intrinsic pathway. Forms tenase complex with Factor VIIIa.',
      color: 'bg-blue-700',
      isPlaced: false,
      correctPosition: { x: 150, y: 190 },
      clinicalRelevance: 'Deficiency causes Hemophilia B, an X-linked bleeding disorder affecting males primarily.',
      deficiencyDisorder: 'Hemophilia B (Christmas Disease)',
      normalRange: '50-150% of pooled normal plasma',
      referenceLinks: [
        {
          title: 'Hemophilia B: Christmas Disease',
          url: 'https://pubmed.ncbi.nlm.nih.gov/30620421/',
          type: 'pubmed'
        },
        {
          title: 'Nathan and Oski\'s Hematology of Infancy',
          url: 'https://www.sciencedirect.com/book/9780323401395/nathan-and-oskis-hematology-and-oncology-of-infancy-and-childhood',
          type: 'textbook'
        }
      ]
    },
    {
      id: 'f7',
      name: 'Factor VII',
      fullName: 'Proconvertin (Stable Factor)',
      pathway: 'extrinsic',
      position: null,
      description: 'Vitamin K-dependent factor activated by tissue factor. Initiates extrinsic pathway after tissue injury.',
      color: 'bg-green-500',
      isPlaced: false,
      correctPosition: { x: 350, y: 120 },
      clinicalRelevance: 'First factor to decrease with warfarin therapy. Deficiency causes bleeding similar to hemophilia.',
      deficiencyDisorder: 'Factor VII deficiency (rare autosomal recessive)',
      normalRange: '50-150% of pooled normal plasma',
      referenceLinks: [
        {
          title: 'Factor VII Deficiency',
          url: 'https://pubmed.ncbi.nlm.nih.gov/28301907/',
          type: 'pubmed'
        },
        {
          title: 'Tissue Factor Pathway',
          url: 'https://www.youtube.com/watch?v=rIuLsGHwdQE',
          type: 'video'
        }
      ]
    },
    {
      id: 'tf',
      name: 'Tissue Factor',
      fullName: 'Factor III (Thromboplastin)',
      pathway: 'extrinsic',
      position: null,
      description: 'Membrane-bound glycoprotein released by damaged tissue. Forms complex with Factor VII to initiate coagulation.',
      color: 'bg-green-600',
      isPlaced: false,
      correctPosition: { x: 350, y: 50 },
      clinicalRelevance: 'Primary initiator of hemostasis. Expression increased in inflammation, cancer, and atherosclerosis.',
      deficiencyDisorder: 'No hereditary deficiency described (incompatible with life)',
      normalRange: 'Not routinely measured in clinical practice',
      referenceLinks: [
        {
          title: 'Tissue Factor in Hemostasis',
          url: 'https://pubmed.ncbi.nlm.nih.gov/31648335/',
          type: 'pubmed'
        }
      ]
    },
    {
      id: 'f10',
      name: 'Factor X',
      fullName: 'Stuart-Prower Factor',
      pathway: 'common',
      position: null,
      description: 'Vitamin K-dependent factor, convergence point of intrinsic and extrinsic pathways. Forms prothrombinase complex.',
      color: 'bg-purple-500',
      isPlaced: false,
      correctPosition: { x: 250, y: 280 },
      clinicalRelevance: 'Critical convergence point. Deficiency causes moderate to severe bleeding disorder.',
      deficiencyDisorder: 'Factor X deficiency (rare autosomal recessive)',
      normalRange: '50-150% of pooled normal plasma',
      referenceLinks: [
        {
          title: 'Factor X Structure and Function',
          url: 'https://pubmed.ncbi.nlm.nih.gov/26990094/',
          type: 'pubmed'
        }
      ]
    },
    {
      id: 'f5',
      name: 'Factor V',
      fullName: 'Proaccelerin (Labile Factor)',
      pathway: 'common',
      position: null,
      description: 'Non-enzymatic cofactor for Factor Xa in the prothrombinase complex. Essential for thrombin generation.',
      color: 'bg-purple-600',
      isPlaced: false,
      correctPosition: { x: 200, y: 350 },
      clinicalRelevance: 'Factor V Leiden mutation causes activated protein C resistance and thrombophilia.',
      deficiencyDisorder: 'Factor V deficiency (parahemophilia) or Factor V Leiden (thrombophilia)',
      normalRange: '50-150% of pooled normal plasma',
      referenceLinks: [
        {
          title: 'Factor V Leiden and Thrombosis',
          url: 'https://pubmed.ncbi.nlm.nih.gov/29923465/',
          type: 'pubmed'
        }
      ]
    },
    {
      id: 'f2',
      name: 'Factor II',
      fullName: 'Prothrombin',
      pathway: 'common',
      position: null,
      description: 'Vitamin K-dependent zymogen converted to thrombin by prothrombinase complex. Central enzyme of hemostasis.',
      color: 'bg-purple-700',
      isPlaced: false,
      correctPosition: { x: 250, y: 420 },
      clinicalRelevance: 'Thrombin has multiple functions: converts fibrinogen to fibrin, activates factors V, VIII, XI, and XIII.',
      deficiencyDisorder: 'Prothrombin deficiency (very rare) or Prothrombin G20210A mutation (thrombophilia)',
      normalRange: '80-120% of pooled normal plasma',
      referenceLinks: [
        {
          title: 'Thrombin Generation and Function',
          url: 'https://pubmed.ncbi.nlm.nih.gov/25854643/',
          type: 'pubmed'
        }
      ]
    },
    {
      id: 'fibrinogen',
      name: 'Fibrinogen',
      fullName: 'Factor I',
      pathway: 'common',
      position: null,
      description: 'Soluble plasma protein converted to insoluble fibrin by thrombin. Forms the structural basis of blood clots.',
      color: 'bg-red-500',
      isPlaced: false,
      correctPosition: { x: 250, y: 490 },
      clinicalRelevance: 'Acute phase reactant. Low levels cause bleeding; high levels increase thrombotic risk.',
      deficiencyDisorder: 'Afibrinogenemia, hypofibrinogenemia, or dysfibrinogenemia',
      normalRange: '200-400 mg/dL (2.0-4.0 g/L)',
      referenceLinks: [
        {
          title: 'Fibrinogen Disorders',
          url: 'https://pubmed.ncbi.nlm.nih.gov/29436322/',
          type: 'pubmed'
        },
        {
          title: 'Fibrin Formation Video',
          url: 'https://www.youtube.com/watch?v=rMhdLRq5qJA',
          type: 'video'
        }
      ]
    }
  ]);

  useEffect(() => {
    if (gameStarted) {
      const timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameStarted]);

  const handleDragStart = (e: React.DragEvent, factor: Factor) => {
    e.dataTransfer.setData('factorId', factor.id);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const factorId = e.dataTransfer.getData('factorId');
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setFactors(prev => prev.map(factor => {
      if (factor.id === factorId) {
        const isCorrect = Math.abs(x - factor.correctPosition.x) < 50 && 
                         Math.abs(y - factor.correctPosition.y) < 50;
        
        if (isCorrect) {
          setScore(prev => prev + 100);
          toast({
            title: "Perfect Placement! 🎯",
            description: `${factor.name} correctly positioned! +100 points`,
          });
          return { ...factor, position: factor.correctPosition, isPlaced: true };
        } else {
          toast({
            title: "Close, but not quite right! 🤔",
            description: `${factor.name} needs to be positioned more precisely in the cascade.`,
            variant: "destructive"
          });
          return { ...factor, position: { x, y }, isPlaced: false };
        }
      }
      return factor;
    }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const checkCompletion = () => {
    const allPlaced = factors.every(factor => factor.isPlaced);
    if (allPlaced && !level1Complete) {
      setLevel1Complete(true);
      const timeBonus = Math.max(0, 300 - timeElapsed) * 10;
      setScore(prev => prev + timeBonus);
      toast({
        title: "🎉 Cascade Mastered!",
        description: `Outstanding work! You've assembled the complete coagulation cascade! Time bonus: +${timeBonus} points`,
      });
    }
  };

  useEffect(() => {
    checkCompletion();
  }, [factors]);

  const resetLevel = () => {
    setFactors(prev => prev.map(factor => ({
      ...factor,
      position: null,
      isPlaced: false
    })));
    setScore(0);
    setTimeElapsed(0);
    setLevel1Complete(false);
    setGameStarted(true);
  };

  const startGame = () => {
    setGameStarted(true);
    toast({
      title: "🎮 Game Started!",
      description: "Drag and drop factors to their correct positions in the cascade. Use tooltips for educational content!",
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const unplacedFactors = factors.filter(factor => !factor.isPlaced);
  const placedFactors = factors.filter(factor => factor.isPlaced);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      {/* Enhanced Header */}
      <div className="container mx-auto mb-6">
        <Card className="bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 shadow-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between text-white">
              <div>
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Level 1: Coagulation Cascade Commander
                </h1>
                <p className="text-blue-200 text-lg">Master the intricate dance of hemostasis through interactive learning</p>
              </div>
              <div className="flex items-center space-x-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400 animate-pulse">{score}</div>
                  <div className="text-sm text-gray-300">Score</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">{formatTime(timeElapsed)}</div>
                  <div className="text-sm text-gray-300">Time</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">{placedFactors.length}/{factors.length}</div>
                  <div className="text-sm text-gray-300">Placed</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="container mx-auto grid lg:grid-cols-4 gap-6">
        {/* Enhanced Factor Bank */}
        <div className="lg:col-span-1">
          <Card className="bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 h-fit shadow-xl">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                <Target className="h-6 w-6 mr-2 text-yellow-400" />
                Clotting Factors
              </h3>
              <div className="space-y-4">
                {unplacedFactors.map(factor => (
                  <EnhancedFactor
                    key={factor.id}
                    factor={factor}
                    onDragStart={handleDragStart}
                    gameStarted={gameStarted}
                  />
                ))}
              </div>

              <div className="mt-6 space-y-3">
                {!gameStarted && (
                  <Button onClick={startGame} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
                    <Play className="h-4 w-4 mr-2" />
                    Start Cascade Assembly
                  </Button>
                )}

                {gameStarted && (
                  <Button onClick={resetLevel} variant="outline" className="w-full border-white text-white hover:bg-white hover:text-blue-900">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset Challenge
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Pathway Legend */}
          <Card className="bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 mt-4 shadow-xl">
            <CardContent className="p-4">
              <h4 className="text-white font-bold mb-3 text-lg">Pathway Guide</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center p-2 rounded bg-blue-500/20">
                  <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-blue-700 rounded mr-3"></div>
                  <div>
                    <div className="text-white font-semibold">Intrinsic Pathway</div>
                    <div className="text-blue-200 text-xs">Contact activation (XII, XI, IX)</div>
                  </div>
                </div>
                <div className="flex items-center p-2 rounded bg-green-500/20">
                  <div className="w-4 h-4 bg-gradient-to-br from-green-500 to-green-700 rounded mr-3"></div>
                  <div>
                    <div className="text-white font-semibold">Extrinsic Pathway</div>
                    <div className="text-green-200 text-xs">Tissue factor activation (VII, TF)</div>
                  </div>
                </div>
                <div className="flex items-center p-2 rounded bg-purple-500/20">
                  <div className="w-4 h-4 bg-gradient-to-br from-purple-500 to-purple-700 rounded mr-3"></div>
                  <div>
                    <div className="text-white font-semibold">Common Pathway</div>
                    <div className="text-purple-200 text-xs">Final clot formation (X, V, II, I)</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Cascade Visualization */}
        <div className="lg:col-span-3">
          <Card className="bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white flex items-center">
                  <ArrowUp className="h-6 w-6 mr-2 text-blue-400 rotate-180" />
                  Interactive Coagulation Cascade
                </h3>
                <div className="text-white text-sm bg-white/10 px-4 py-2 rounded-full">
                  Hover over factors for detailed educational content
                </div>
              </div>

              <AnimatedCascade
                factors={factors}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              />

              {level1Complete && (
                <div className="mt-8 text-center">
                  <Card className="bg-gradient-to-r from-green-500 to-blue-600 border-0 max-w-2xl mx-auto shadow-2xl">
                    <CardContent className="p-8 text-white">
                      <Check className="h-16 w-16 mx-auto mb-4 animate-bounce text-yellow-300" />
                      <h3 className="text-3xl font-bold mb-4">🎉 Cascade Mastery Achieved!</h3>
                      <p className="mb-6 text-lg">
                        Congratulations! You've successfully assembled the complete coagulation cascade and demonstrated mastery of hemostatic mechanisms!
                      </p>
                      <div className="text-lg mb-6 bg-white/20 p-4 rounded-lg">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-2xl font-bold text-yellow-300">{score}</div>
                            <div className="text-sm">Final Score</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-blue-300">{formatTime(timeElapsed)}</div>
                            <div className="text-sm">Completion Time</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-center space-x-4">
                        <Button 
                          className="bg-white text-blue-600 hover:bg-gray-100 shadow-lg"
                          onClick={() => navigate('/')}
                        >
                          <BookOpen className="h-4 w-4 mr-2" />
                          Back to Game Hub
                        </Button>
                        <Button 
                          className="bg-green-600 hover:bg-green-700 shadow-lg"
                          onClick={() => navigate('/level2')}
                        >
                          <Target className="h-4 w-4 mr-2" />
                          Continue to Level 2
                        </Button>
                        <Button 
                          variant="outline" 
                          className="border-white text-white hover:bg-white hover:text-blue-600"
                          onClick={resetLevel}
                        >
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Master Again
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Level1;
