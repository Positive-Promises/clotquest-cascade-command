import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Target, Microscope, Stethoscope, Trophy, Play } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  const levels = [
    {
      id: 1,
      title: "Coagulation Cascade Commander",
      description: "Master the blood clotting cascade by correctly positioning factors and cofactors",
      icon: Target,
      difficulty: "Beginner",
      color: "bg-gradient-to-br from-blue-500 to-blue-700",
      objectives: ["Learn cascade pathways", "Factor positioning", "Understanding sequences"],
      unlocked: true
    },
    {
      id: 2,
      title: "Diagnostic Detective",
      description: "Interpret clotting tests and diagnose coagulation disorders",
      icon: Microscope,
      difficulty: "Intermediate",
      color: "bg-gradient-to-br from-green-500 to-green-700",
      objectives: ["Lab test interpretation", "Pattern recognition", "Clinical correlation"],
      unlocked: true
    },
    {
      id: 3,
      title: "Pathology Professor",
      description: "Analyze complex cases and identify hemostatic pathologies",
      icon: BookOpen,
      difficulty: "Advanced",
      color: "bg-gradient-to-br from-purple-500 to-purple-700",
      objectives: ["Case analysis", "Differential diagnosis", "Clinical reasoning"],
      unlocked: false
    },
    {
      id: 4,
      title: "Treatment Tactician",
      description: "Select appropriate anticoagulants and blood products for patients",
      icon: Stethoscope,
      difficulty: "Expert",
      color: "bg-gradient-to-br from-red-500 to-red-700",
      objectives: ["Treatment selection", "Medication management", "Patient outcomes"],
      unlocked: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-700 py-16">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative container mx-auto px-6 text-center">
          <div className="flex items-center justify-center mb-4">
            <Trophy className="h-12 w-12 text-yellow-400 mr-4" />
            <h1 className="text-5xl font-bold text-white tracking-tight">
              ClotQuest
            </h1>
          </div>
          <p className="text-xl text-blue-100 mb-2">Mastering Hemostasis</p>
          <p className="text-lg text-blue-200 max-w-3xl mx-auto">
            An interactive multi-level educational game designed to teach the complexities of blood coagulation 
            through immersive gameplay and real-world clinical scenarios.
          </p>
          <div className="mt-8 flex items-center justify-center space-x-4 text-blue-200">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-400 rounded-full mr-2"></div>
              <span>Harvard Medical School Curriculum Compatible</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
              <span>Evidence-Based Learning</span>
            </div>
          </div>
        </div>
      </div>

      {/* Game Levels */}
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Choose Your Learning Path</h2>
          <p className="text-gray-300 text-lg">Progress through four comprehensive levels of hemostasis education</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {levels.map((level) => {
            const IconComponent = level.icon;
            return (
              <Card key={level.id} className={`relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl ${level.unlocked ? 'cursor-pointer' : 'opacity-60'}`}>
                <div className={`${level.color} p-6 text-white relative`}>
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white opacity-10 rounded-full -mr-10 -mt-10"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <IconComponent className="h-8 w-8" />
                      <span className="text-sm font-medium bg-white bg-opacity-20 px-2 py-1 rounded">
                        Level {level.id}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold mb-2">{level.title}</h3>
                    <p className="text-sm opacity-90 mb-4">{level.description}</p>
                    <div className="text-xs opacity-80">
                      Difficulty: {level.difficulty}
                    </div>
                  </div>
                </div>
                <CardContent className="p-4 bg-white">
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Learning Objectives:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {level.objectives.map((objective, index) => (
                        <li key={index} className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                          {objective}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button 
                    className={`w-full ${level.unlocked ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
                    onClick={() => {
                      if (level.unlocked) {
                        if (level.id === 1) navigate('/level1');
                        else if (level.id === 2) navigate('/level2');
                      }
                    }}
                    disabled={!level.unlocked}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {level.unlocked ? 'Start Level' : 'Locked'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Educational Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20">
            <CardContent className="p-6 text-center text-white">
              <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Interactive Learning</h3>
              <p className="text-gray-300">
                Hands-on manipulation of coagulation factors with real-time feedback and visual animations
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20">
            <CardContent className="p-6 text-center text-white">
              <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Clinical Relevance</h3>
              <p className="text-gray-300">
                Every scenario is based on real clinical cases and current medical practice guidelines
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20">
            <CardContent className="p-6 text-center text-white">
              <div className="bg-purple-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Assessment & Progress</h3>
              <p className="text-gray-300">
                Comprehensive tracking of learning progress with detailed performance analytics
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Start */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 max-w-2xl mx-auto">
            <CardContent className="p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Ready to Begin Your Journey?</h3>
              <p className="text-blue-100 mb-6">
                Start with Level 1 to master the fundamentals of the coagulation cascade
              </p>
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100"
                onClick={() => navigate('/level1')}
              >
                <Play className="h-5 w-5 mr-2" />
                Start Level 1: Coagulation Cascade Commander
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
