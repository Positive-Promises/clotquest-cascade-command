
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { 
  Play, 
  Beaker, 
  Target, 
  Stethoscope,
  Trophy,
  BookOpen,
  Zap,
  Heart,
  Brain,
  Award,
  HelpCircle,
  Users
} from "lucide-react";
import Tutorial from "@/components/Tutorial";
import SocialGaming from "@/components/SocialGaming";
import HowToPlay from "@/components/HowToPlay";
import AudioSystem from "@/components/AudioSystem";

const Index = () => {
  const navigate = useNavigate();
  const [showTutorial, setShowTutorial] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const tutorialSteps = [
    {
      id: 1,
      title: "Welcome to HemoMaster Academy!",
      description: "This is your medical education gaming platform. Choose from 4 different levels to master hemostasis and blood coagulation.",
      position: "bottom" as const
    },
    {
      id: 2,
      title: "Level Selection",
      description: "Each level teaches different aspects of hemostasis. Start with Level 1 for beginners or jump to advanced levels if you're experienced.",
      position: "top" as const
    },
    {
      id: 3,
      title: "Difficulty Levels",
      description: "Pay attention to difficulty badges - they indicate the complexity and skills required for each level.",
      position: "left" as const
    },
    {
      id: 4,
      title: "Social Features",
      description: "Log in to track your progress, compete with friends, and see leaderboards!",
      position: "right" as const
    },
    {
      id: 5,
      title: "Help & Tutorials",
      description: "Click 'How to Play' anytime for detailed guides, power-ups info, and scoring details.",
      position: "top" as const
    },
    {
      id: 6,
      title: "Ready to Start!",
      description: "You're all set! Choose your first level and begin mastering hemostasis. Good luck, future medical expert!",
      position: "bottom" as const
    }
  ];

  const levels = [
    {
      id: 1,
      title: "Coagulation Cascade Commander",
      description: "Master the intricate dance of hemostasis through interactive drag-and-drop learning",
      icon: <Target className="h-6 w-6 sm:h-8 sm:w-8" />,
      difficulty: "Beginner",
      color: "from-blue-600 to-purple-600",
      features: ["Interactive cascade building", "Emergency scenarios", "Educational tooltips", "Real-time feedback"],
      path: "/level1"
    },
    {
      id: 2,
      title: "Laboratory Detective",
      description: "Solve complex diagnostic puzzles through virtual lab experiments and analysis",
      icon: <Beaker className="h-6 w-6 sm:h-8 sm:w-8" />,
      difficulty: "Intermediate",
      color: "from-green-600 to-blue-600",
      features: ["Virtual experiments", "Lab result analysis", "Diagnostic challenges", "Equipment simulation"],
      path: "/level2"
    },
    {
      id: 3,
      title: "Platelet Plug Formation",
      description: "Experience primary hemostasis through interactive platelet activation sequences",
      icon: <Heart className="h-6 w-6 sm:h-8 sm:w-8" />,
      difficulty: "Intermediate",
      color: "from-red-600 to-purple-600",
      features: ["Step-by-step hemostasis", "Vessel injury simulation", "Platelet activation", "Visual feedback"],
      path: "/level3"
    },
    {
      id: 4,
      title: "Clinical Case Studies",
      description: "Apply your knowledge to real-world clinical scenarios and diagnostic challenges",
      icon: <Stethoscope className="h-6 w-6 sm:h-8 sm:w-8" />,
      difficulty: "Advanced",
      color: "from-indigo-600 to-purple-600",
      features: ["Real clinical cases", "Diagnostic reasoning", "Treatment decisions", "Expert explanations"],
      path: "/level4"
    }
  ];

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleSignUp = () => {
    setIsLoggedIn(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-x-hidden">
      <AudioSystem gameState="menu" level={1} />
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDYwIDAgTCAwIDAgMCA2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIxIiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] bg-repeat"></div>
      </div>
      
      {/* Mobile-optimized Header */}
      <div className="container mx-auto px-4 py-8 sm:py-16 relative z-10">
        <div className="text-center mb-8 sm:mb-16">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="p-3 sm:p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-2xl animate-pulse-glow">
              <Trophy className="h-12 w-12 sm:h-16 sm:w-16 text-white" />
            </div>
          </div>
          
          <h1 className="font-playfair text-4xl sm:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent px-2 animate-fade-in">
            HemoMaster Academy
          </h1>
          
          <p className="font-inter text-lg sm:text-xl lg:text-2xl text-gray-300 mb-6 sm:mb-8 max-w-4xl mx-auto leading-relaxed px-4">
            Master the complexities of hemostasis and thrombosis through immersive, 
            interactive learning experiences designed by medical experts.
          </p>

          {/* Mobile-friendly action buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mb-8 sm:mb-12 px-4">
            <Button
              onClick={() => setShowHowToPlay(true)}
              variant="outline"
              className="w-full sm:w-auto border-blue-400/50 text-blue-300 hover:bg-blue-400/10 backdrop-blur-sm bg-white/5 transition-all duration-300 hover:scale-105"
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              How to Play
            </Button>
            
            <Button
              onClick={() => setShowTutorial(true)}
              className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-lg transition-all duration-300 hover:scale-105"
            >
              <Play className="h-4 w-4 mr-2" />
              Start Tutorial
            </Button>
          </div>
          
          {/* Mobile-optimized badges */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 sm:mb-12 px-4">
            <Badge variant="outline" className="px-3 py-2 text-blue-300 border-blue-300/50 bg-blue-500/10 backdrop-blur-sm">
              <Brain className="h-4 w-4 mr-2" />
              Evidence-Based
            </Badge>
            <Badge variant="outline" className="px-3 py-2 text-green-300 border-green-300/50 bg-green-500/10 backdrop-blur-sm">
              <Zap className="h-4 w-4 mr-2" />
              Interactive
            </Badge>
            <Badge variant="outline" className="px-3 py-2 text-purple-300 border-purple-300/50 bg-purple-500/10 backdrop-blur-sm">
              <Award className="h-4 w-4 mr-2" />
              Clinical Excellence
            </Badge>
          </div>
        </div>

        {/* Social Gaming Component */}
        <div className="mb-8 sm:mb-12 max-w-4xl mx-auto">
          <SocialGaming 
            isLoggedIn={isLoggedIn}
            onLogin={handleLogin}
            onSignUp={handleSignUp}
          />
        </div>

        {/* Mobile-responsive game levels grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto mb-8 sm:mb-16">
          {levels.map((level) => (
            <Card 
              key={level.id} 
              className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 hover:bg-white/10 group"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 sm:p-3 bg-gradient-to-r ${level.color} rounded-lg shadow-lg group-hover:animate-pulse-glow transition-all duration-300`}>
                    {level.icon}
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-xs sm:text-sm font-semibold backdrop-blur-sm ${
                      level.difficulty === 'Beginner' ? 'border-green-400/50 text-green-300 bg-green-500/10' :
                      level.difficulty === 'Intermediate' ? 'border-yellow-400/50 text-yellow-300 bg-yellow-500/10' :
                      'border-red-400/50 text-red-300 bg-red-500/10'
                    }`}
                  >
                    {level.difficulty}
                  </Badge>
                </div>
                <CardTitle className="font-playfair text-xl sm:text-2xl text-white mb-2 group-hover:text-blue-300 transition-colors duration-300">
                  {level.title}
                </CardTitle>
                <p className="font-inter text-gray-300 leading-relaxed text-sm sm:text-base group-hover:text-gray-200 transition-colors duration-300">
                  {level.description}
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="mb-6">
                  <h4 className="text-white font-semibold mb-3 flex items-center text-sm sm:text-base">
                    <BookOpen className="h-4 w-4 mr-2 text-blue-400" />
                    Key Features
                  </h4>
                  <ul className="space-y-2">
                    {level.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-300 text-xs sm:text-sm group-hover:text-gray-200 transition-colors duration-300">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 flex-shrink-0 group-hover:bg-blue-300 transition-colors duration-300"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button 
                  onClick={() => navigate(level.path)}
                  className={`w-full bg-gradient-to-r ${level.color} hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl`}
                >
                  <Play className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Start Level {level.id}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mobile-optimized educational footer */}
        <div className="mt-8 sm:mt-16 text-center">
          <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl max-w-4xl mx-auto">
            <CardContent className="p-6 sm:p-8">
              <h3 className="font-playfair text-xl sm:text-2xl font-bold text-white mb-4">
                Why Choose HemoMaster Academy?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                <div className="space-y-3 group">
                  <div className="p-3 bg-blue-500/20 rounded-full w-16 h-16 mx-auto flex items-center justify-center border border-blue-400/30 group-hover:animate-pulse-glow transition-all duration-300">
                    <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />
                  </div>
                  <h4 className="font-inter text-white font-semibold">Evidence-Based</h4>
                  <p className="font-inter text-gray-300 text-sm">
                    All content is based on current medical literature and clinical guidelines
                  </p>
                </div>
                <div className="space-y-3 group">
                  <div className="p-3 bg-green-500/20 rounded-full w-16 h-16 mx-auto flex items-center justify-center border border-green-400/30 group-hover:animate-pulse-glow transition-all duration-300">
                    <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-green-400" />
                  </div>
                  <h4 className="font-inter text-white font-semibold">Interactive Learning</h4>
                  <p className="font-inter text-gray-300 text-sm">
                    Engage with dynamic simulations and hands-on problem solving
                  </p>
                </div>
                <div className="space-y-3 group">
                  <div className="p-3 bg-purple-500/20 rounded-full w-16 h-16 mx-auto flex items-center justify-center border border-purple-400/30 group-hover:animate-pulse-glow transition-all duration-300">
                    <Award className="h-6 w-6 sm:h-8 sm:w-8 text-purple-400" />
                  </div>
                  <h4 className="font-inter text-white font-semibold">Clinical Excellence</h4>
                  <p className="font-inter text-gray-300 text-sm">
                    Develop skills that directly translate to improved patient care
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <Tutorial
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
        onSkip={() => setShowTutorial(false)}
        steps={tutorialSteps}
        currentLevel="index"
      />

      <HowToPlay
        isOpen={showHowToPlay}
        onClose={() => setShowHowToPlay(false)}
      />
    </div>
  );
};

export default Index;
