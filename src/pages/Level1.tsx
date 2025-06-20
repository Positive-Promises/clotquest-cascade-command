
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowUp, Check, Target, BookOpen, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
}

const Level1 = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [level1Complete, setLevel1Complete] = useState(false);

  const [factors, setFactors] = useState<Factor[]>([
    {
      id: 'f12',
      name: 'Factor XII',
      fullName: 'Hageman Factor',
      pathway: 'intrinsic',
      position: null,
      description: 'Initiates the intrinsic pathway when activated by contact with negatively charged surfaces',
      color: 'bg-blue-500',
      isPlaced: false,
      correctPosition: { x: 150, y: 50 }
    },
    {
      id: 'f11',
      name: 'Factor XI',
      fullName: 'Plasma Thromboplastin Antecedent',
      pathway: 'intrinsic',
      position: null,
      description: 'Activated by Factor XIIa and activates Factor IX',
      color: 'bg-blue-600',
      isPlaced: false,
      correctPosition: { x: 150, y: 120 }
    },
    {
      id: 'f9',
      name: 'Factor IX',
      fullName: 'Christmas Factor',
      pathway: 'intrinsic',
      position: null,
      description: 'Key factor in the intrinsic pathway, deficiency causes Hemophilia B',
      color: 'bg-blue-700',
      isPlaced: false,
      correctPosition: { x: 150, y: 190 }
    },
    {
      id: 'f7',
      name: 'Factor VII',
      fullName: 'Proconvertin',
      pathway: 'extrinsic',
      position: null,
      description: 'Activated by tissue factor to initiate the extrinsic pathway',
      color: 'bg-green-500',
      isPlaced: false,
      correctPosition: { x: 350, y: 120 }
    },
    {
      id: 'tf',
      name: 'Tissue Factor',
      fullName: 'Factor III',
      pathway: 'extrinsic',
      position: null,
      description: 'Released by damaged tissue to trigger coagulation',
      color: 'bg-green-600',
      isPlaced: false,
      correctPosition: { x: 350, y: 50 }
    },
    {
      id: 'f10',
      name: 'Factor X',
      fullName: 'Stuart-Prower Factor',
      pathway: 'common',
      position: null,
      description: 'Convergence point where intrinsic and extrinsic pathways meet',
      color: 'bg-purple-500',
      isPlaced: false,
      correctPosition: { x: 250, y: 280 }
    },
    {
      id: 'f5',
      name: 'Factor V',
      fullName: 'Proaccelerin',
      pathway: 'common',
      position: null,
      description: 'Cofactor for Factor Xa in the prothrombinase complex',
      color: 'bg-purple-600',
      isPlaced: false,
      correctPosition: { x: 200, y: 350 }
    },
    {
      id: 'f2',
      name: 'Factor II',
      fullName: 'Prothrombin',
      pathway: 'common',
      position: null,
      description: 'Converted to thrombin by the prothrombinase complex',
      color: 'bg-purple-700',
      isPlaced: false,
      correctPosition: { x: 250, y: 420 }
    },
    {
      id: 'fibrinogen',
      name: 'Fibrinogen',
      fullName: 'Factor I',
      pathway: 'common',
      position: null,
      description: 'Converted to fibrin by thrombin to form the final clot',
      color: 'bg-red-500',
      isPlaced: false,
      correctPosition: { x: 250, y: 490 }
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
            title: "Correct Placement!",
            description: `${factor.name} placed correctly. +100 points!`,
          });
          return { ...factor, position: factor.correctPosition, isPlaced: true };
        } else {
          toast({
            title: "Try Again",
            description: `${factor.name} is not in the correct position.`,
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
        title: "Level Complete!",
        description: `Congratulations! You've mastered the coagulation cascade! Time bonus: +${timeBonus} points`,
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
      title: "Game Started!",
      description: "Drag and drop factors to their correct positions in the cascade.",
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
      {/* Header */}
      <div className="container mx-auto mb-6">
        <Card className="bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between text-white">
              <div>
                <h1 className="text-3xl font-bold mb-2">Level 1: Coagulation Cascade Commander</h1>
                <p className="text-blue-200">Drag and drop clotting factors to their correct positions</p>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{score}</div>
                  <div className="text-sm text-gray-300">Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{formatTime(timeElapsed)}</div>
                  <div className="text-sm text-gray-300">Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{placedFactors.length}/{factors.length}</div>
                  <div className="text-sm text-gray-300">Placed</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="container mx-auto grid lg:grid-cols-4 gap-6">
        {/* Factor Bank */}
        <div className="lg:col-span-1">
          <Card className="bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 h-fit">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Clotting Factors</h3>
              <div className="space-y-3">
                {unplacedFactors.map(factor => (
                  <div
                    key={factor.id}
                    draggable={gameStarted}
                    onDragStart={(e) => handleDragStart(e, factor)}
                    onMouseEnter={() => setShowTooltip(factor.id)}
                    onMouseLeave={() => setShowTooltip(null)}
                    className={`${factor.color} p-3 rounded-lg cursor-move text-white text-sm font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg relative`}
                  >
                    <div className="font-bold">{factor.name}</div>
                    <div className="text-xs opacity-90">{factor.fullName}</div>
                    
                    {showTooltip === factor.id && (
                      <div className="absolute z-50 bg-gray-900 text-white p-3 rounded-lg shadow-xl max-w-xs left-full ml-2 top-0">
                        <div className="font-medium mb-1">{factor.fullName}</div>
                        <div className="text-xs">{factor.description}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {!gameStarted && (
                <Button onClick={startGame} className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                  <Target className="h-4 w-4 mr-2" />
                  Start Game
                </Button>
              )}

              {gameStarted && (
                <Button onClick={resetLevel} variant="outline" className="w-full mt-4">
                  Reset Level
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Pathway Legend */}
          <Card className="bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 mt-4">
            <CardContent className="p-4">
              <h4 className="text-white font-bold mb-3">Pathways</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
                  <span className="text-white">Intrinsic Pathway</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                  <span className="text-white">Extrinsic Pathway</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-purple-500 rounded mr-2"></div>
                  <span className="text-white">Common Pathway</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
                  <span className="text-white">Final Product</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cascade Visualization */}
        <div className="lg:col-span-3">
          <Card className="bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Coagulation Cascade</h3>
                <div className="flex items-center space-x-4 text-white">
                  <div className="text-sm">Intrinsic Pathway</div>
                  <ArrowUp className="h-4 w-4 rotate-180" />
                  <div className="text-sm">Extrinsic Pathway</div>
                </div>
              </div>

              <div
                className="relative bg-gradient-to-b from-blue-50 to-red-50 rounded-lg p-6 min-h-[600px] border-2 border-dashed border-gray-300"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                {/* Pathway Labels */}
                <div className="absolute top-4 left-4 text-blue-600 font-bold text-lg">Intrinsic</div>
                <div className="absolute top-4 right-4 text-green-600 font-bold text-lg">Extrinsic</div>
                <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 text-purple-600 font-bold text-lg">Common Pathway</div>

                {/* Drop zones (visual guides) */}
                {factors.map(factor => (
                  <div
                    key={`zone-${factor.id}`}
                    className="absolute w-20 h-16 border-2 border-dashed border-gray-400 rounded-lg bg-gray-100 bg-opacity-50 flex items-center justify-center"
                    style={{
                      left: factor.correctPosition.x - 40,
                      top: factor.correctPosition.y - 32
                    }}
                  >
                    {!factor.isPlaced && (
                      <div className="text-xs text-gray-500 text-center p-1">
                        Drop {factor.name} here
                      </div>
                    )}
                  </div>
                ))}

                {/* Placed factors */}
                {factors.filter(factor => factor.position).map(factor => (
                  <div
                    key={`placed-${factor.id}`}
                    className={`absolute w-20 h-16 ${factor.color} rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-lg transition-all duration-300 ${factor.isPlaced ? 'ring-4 ring-green-400' : ''}`}
                    style={{
                      left: factor.position!.x - 40,
                      top: factor.position!.y - 32
                    }}
                  >
                    <div className="text-center">
                      <div className="text-xs">{factor.name}</div>
                      {factor.isPlaced && <Check className="h-4 w-4 mx-auto mt-1" />}
                    </div>
                  </div>
                ))}

                {/* Pathway arrows */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {/* Intrinsic pathway arrows */}
                  <path d="M150 80 L150 110" stroke="#3b82f6" strokeWidth="3" markerEnd="url(#arrowhead)" />
                  <path d="M150 150 L150 180" stroke="#3b82f6" strokeWidth="3" markerEnd="url(#arrowhead)" />
                  <path d="M150 220 L200 260" stroke="#3b82f6" strokeWidth="3" markerEnd="url(#arrowhead)" />
                  
                  {/* Extrinsic pathway arrows */}
                  <path d="M350 80 L350 110" stroke="#10b981" strokeWidth="3" markerEnd="url(#arrowhead)" />
                  <path d="M350 150 L300 260" stroke="#10b981" strokeWidth="3" markerEnd="url(#arrowhead)" />
                  
                  {/* Common pathway arrows */}
                  <path d="M250 310 L230 340" stroke="#8b5cf6" strokeWidth="3" markerEnd="url(#arrowhead)" />
                  <path d="M250 380 L250 410" stroke="#8b5cf6" strokeWidth="3" markerEnd="url(#arrowhead)" />
                  <path d="M250 450 L250 480" stroke="#dc2626" strokeWidth="3" markerEnd="url(#arrowhead)" />
                  
                  <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="#374151" />
                    </marker>
                  </defs>
                </svg>

                {/* Patient visualization */}
                <div className="absolute bottom-4 left-4 bg-white bg-opacity-80 rounded-lg p-4 max-w-xs">
                  <div className="text-sm font-medium text-gray-800 mb-2">Patient Status</div>
                  <div className="text-xs text-gray-600">
                    A patient with a laceration requires immediate hemostasis. 
                    The coagulation cascade must be properly activated to form a stable clot.
                  </div>
                  <div className="mt-2 text-xs">
                    Progress: {Math.round((placedFactors.length / factors.length) * 100)}%
                  </div>
                </div>
              </div>

              {level1Complete && (
                <div className="mt-6 text-center">
                  <Card className="bg-gradient-to-r from-green-500 to-blue-600 border-0 max-w-md mx-auto">
                    <CardContent className="p-6 text-white">
                      <Check className="h-12 w-12 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold mb-2">Level 1 Complete!</h3>
                      <p className="mb-4">You've mastered the coagulation cascade!</p>
                      <div className="text-sm mb-4">
                        Final Score: {score} points | Time: {formatTime(timeElapsed)}
                      </div>
                      <Button 
                        className="bg-white text-blue-600 hover:bg-gray-100 mr-2"
                        onClick={() => navigate('/')}
                      >
                        <BookOpen className="h-4 w-4 mr-2" />
                        Back to Hub
                      </Button>
                      <Button 
                        variant="outline" 
                        className="border-white text-white hover:bg-white hover:text-blue-600"
                        onClick={resetLevel}
                      >
                        Play Again
                      </Button>
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
