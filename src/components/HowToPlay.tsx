
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Target, 
  Beaker, 
  Heart, 
  Stethoscope, 
  Trophy, 
  Zap, 
  Star,
  Gift,
  X
} from 'lucide-react';

interface HowToPlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const HowToPlay: React.FC<HowToPlayProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const levels = [
    {
      id: 1,
      title: "Coagulation Cascade Commander",
      icon: <Target className="h-6 w-6" />,
      difficulty: "Beginner",
      description: "Master the intricate dance of hemostasis through interactive drag-and-drop learning",
      objectives: [
        "Arrange coagulation factors in correct sequence",
        "Complete cascade under time pressure",
        "Handle emergency bleeding scenarios",
        "Achieve 90% accuracy to advance"
      ],
      tips: [
        "Start with the intrinsic pathway (Factor XII)",
        "Remember the common pathway converges at Factor X",
        "Emergency mode adds time pressure - stay calm!"
      ]
    },
    {
      id: 2,
      title: "Laboratory Detective",
      icon: <Beaker className="h-6 w-6" />,
      difficulty: "Intermediate",
      description: "Solve complex diagnostic puzzles through virtual lab experiments",
      objectives: [
        "Perform virtual laboratory tests",
        "Interpret PT/PTT results correctly",
        "Diagnose coagulation disorders",
        "Complete 5 different test scenarios"
      ],
      tips: [
        "Read test results carefully",
        "Consider patient history",
        "Multiple tests may be needed for diagnosis"
      ]
    }
  ];

  const powerUps = [
    {
      name: "Time Freeze",
      icon: <Zap className="h-5 w-5" />,
      description: "Pauses the timer for 10 seconds during emergency scenarios",
      howToObtain: "Complete a level with 100% accuracy"
    },
    {
      name: "Hint Master",
      icon: <Star className="h-5 w-5" />,
      description: "Reveals the next correct factor placement",
      howToObtain: "Help 3 friends complete a level"
    },
    {
      name: "Double Points",
      icon: <Trophy className="h-5 w-5" />,
      description: "Doubles your score for the current level",
      howToObtain: "Complete 5 levels in a single session"
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 border border-blue-400/30">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl text-white flex items-center">
            <BookOpen className="h-6 w-6 mr-3 text-blue-400" />
            How to Play HemoMaster Academy
          </CardTitle>
          <Button variant="ghost" onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        
        <CardContent className="p-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-slate-800">
              <TabsTrigger value="overview" className="text-white">Overview</TabsTrigger>
              <TabsTrigger value="levels" className="text-white">Levels</TabsTrigger>
              <TabsTrigger value="powerups" className="text-white">Power-ups</TabsTrigger>
              <TabsTrigger value="scoring" className="text-white">Scoring</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6 space-y-4">
              <div className="text-gray-300 space-y-4">
                <h3 className="text-xl font-bold text-white">Welcome to HemoMaster Academy!</h3>
                <p>
                  Master the complexities of hemostasis and thrombosis through immersive, 
                  interactive learning experiences. Each level teaches different aspects of 
                  blood coagulation while providing engaging gameplay.
                </p>
                
                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  <Card className="bg-blue-900/20 border-blue-400/30">
                    <CardContent className="p-4">
                      <h4 className="text-white font-semibold mb-2">Game Mechanics</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Drag and drop elements to build pathways</li>
                        <li>• Time-based challenges test your speed</li>
                        <li>• Emergency scenarios add pressure</li>
                        <li>• Progress tracking across all levels</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-purple-900/20 border-purple-400/30">
                    <CardContent className="p-4">
                      <h4 className="text-white font-semibold mb-2">Learning Objectives</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Understand coagulation cascade</li>
                        <li>• Master laboratory diagnostics</li>
                        <li>• Apply clinical decision-making</li>
                        <li>• Develop emergency response skills</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="levels" className="mt-6">
              <div className="space-y-4">
                {levels.map((level) => (
                  <Card key={level.id} className="bg-white/5 border-white/10">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-500/20 rounded-lg">
                            {level.icon}
                          </div>
                          <div>
                            <h4 className="text-white font-semibold">{level.title}</h4>
                            <Badge variant="outline" className={`mt-1 ${
                              level.difficulty === 'Beginner' ? 'text-green-300 border-green-300' :
                              level.difficulty === 'Intermediate' ? 'text-yellow-300 border-yellow-300' :
                              'text-red-300 border-red-300'
                            }`}>
                              {level.difficulty}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-300 text-sm mb-4">{level.description}</p>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="text-white font-medium mb-2">Objectives:</h5>
                          <ul className="text-sm text-gray-300 space-y-1">
                            {level.objectives.map((objective, index) => (
                              <li key={index}>• {objective}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h5 className="text-white font-medium mb-2">Pro Tips:</h5>
                          <ul className="text-sm text-gray-300 space-y-1">
                            {level.tips.map((tip, index) => (
                              <li key={index}>💡 {tip}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="powerups" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white mb-4">Power-ups & Boosters</h3>
                <div className="grid gap-4">
                  {powerUps.map((powerUp, index) => (
                    <Card key={index} className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-400/30">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                              {powerUp.icon}
                            </div>
                            <div>
                              <h4 className="text-white font-semibold">{powerUp.name}</h4>
                              <p className="text-gray-300 text-sm">{powerUp.description}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-purple-300 border-purple-300">
                            <Gift className="h-3 w-3 mr-1" />
                            Booster
                          </Badge>
                        </div>
                        <div className="mt-3 p-2 bg-white/5 rounded">
                          <p className="text-xs text-gray-400">
                            <strong>How to obtain:</strong> {powerUp.howToObtain}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="scoring" className="mt-6">
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white">Scoring System</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="bg-green-900/20 border-green-400/30">
                    <CardContent className="p-4">
                      <h4 className="text-white font-semibold mb-3">Points Breakdown</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-300">Correct placement:</span>
                          <span className="text-green-300">+100 points</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Speed bonus:</span>
                          <span className="text-green-300">+50 points</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Perfect level:</span>
                          <span className="text-green-300">+500 points</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Emergency save:</span>
                          <span className="text-green-300">+1000 points</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-red-900/20 border-red-400/30">
                    <CardContent className="p-4">
                      <h4 className="text-white font-semibold mb-3">Penalties</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-300">Wrong placement:</span>
                          <span className="text-red-300">-25 points</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Time penalty:</span>
                          <span className="text-red-300">-10 points/sec</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Patient death:</span>
                          <span className="text-red-300">-500 points</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card className="bg-blue-900/20 border-blue-400/30">
                  <CardContent className="p-4">
                    <h4 className="text-white font-semibold mb-3">Achievement Levels</h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-3 bg-yellow-900/20 rounded border border-yellow-400/30">
                        <Trophy className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                        <p className="text-yellow-300 font-semibold">Bronze</p>
                        <p className="text-xs text-gray-300">60-79% accuracy</p>
                      </div>
                      <div className="p-3 bg-gray-900/20 rounded border border-gray-400/30">
                        <Trophy className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-300 font-semibold">Silver</p>
                        <p className="text-xs text-gray-300">80-94% accuracy</p>
                      </div>
                      <div className="p-3 bg-yellow-900/30 rounded border border-yellow-400/50">
                        <Trophy className="h-8 w-8 text-yellow-300 mx-auto mb-2" />
                        <p className="text-yellow-200 font-semibold">Gold</p>
                        <p className="text-xs text-gray-300">95-100% accuracy</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default HowToPlay;
