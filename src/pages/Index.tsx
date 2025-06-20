
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
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
  Award
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const levels = [
    {
      id: 1,
      title: "Coagulation Cascade Commander",
      description: "Master the intricate dance of hemostasis through interactive drag-and-drop learning",
      icon: <Target className="h-8 w-8" />,
      difficulty: "Beginner",
      color: "from-blue-600 to-purple-600",
      features: ["Interactive cascade building", "Emergency scenarios", "Educational tooltips", "Real-time feedback"],
      path: "/level1"
    },
    {
      id: 2,
      title: "Laboratory Detective",
      description: "Solve complex diagnostic puzzles through virtual lab experiments and analysis",
      icon: <Beaker className="h-8 w-8" />,
      difficulty: "Intermediate",
      color: "from-green-600 to-blue-600",
      features: ["Virtual experiments", "Lab result analysis", "Diagnostic challenges", "Equipment simulation"],
      path: "/level2"
    },
    {
      id: 3,
      title: "Platelet Plug Formation",
      description: "Experience primary hemostasis through interactive platelet activation sequences",
      icon: <Heart className="h-8 w-8" />,
      difficulty: "Intermediate",
      color: "from-red-600 to-purple-600",
      features: ["Step-by-step hemostasis", "Vessel injury simulation", "Platelet activation", "Visual feedback"],
      path: "/level3"
    },
    {
      id: 4,
      title: "Clinical Case Studies",
      description: "Apply your knowledge to real-world clinical scenarios and diagnostic challenges",
      icon: <Stethoscope className="h-8 w-8" />,
      difficulty: "Advanced",
      color: "from-indigo-600 to-purple-600",
      features: ["Real clinical cases", "Diagnostic reasoning", "Treatment decisions", "Expert explanations"],
      path: "/level4"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-2xl">
              <Trophy className="h-16 w-16 text-white" />
            </div>
          </div>
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            HemoMaster Academy
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Master the complexities of hemostasis and thrombosis through immersive, 
            interactive learning experiences designed by medical experts.
          </p>
          <div className="flex justify-center space-x-4 mb-12">
            <Badge variant="outline" className="px-4 py-2 text-blue-300 border-blue-300">
              <Brain className="h-4 w-4 mr-2" />
              Evidence-Based Learning
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-green-300 border-green-300">
              <Zap className="h-4 w-4 mr-2" />
              Interactive Gameplay
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-purple-300 border-purple-300">
              <Award className="h-4 w-4 mr-2" />
              Clinical Excellence
            </Badge>
          </div>
        </div>

        {/* Game Levels Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {levels.map((level) => (
            <Card key={level.id} className="bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 bg-gradient-to-r ${level.color} rounded-lg shadow-lg`}>
                    {level.icon}
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`${
                      level.difficulty === 'Beginner' ? 'border-green-400 text-green-300' :
                      level.difficulty === 'Intermediate' ? 'border-yellow-400 text-yellow-300' :
                      'border-red-400 text-red-300'
                    } font-semibold`}
                  >
                    {level.difficulty}
                  </Badge>
                </div>
                <CardTitle className="text-2xl text-white mb-2">{level.title}</CardTitle>
                <p className="text-gray-300 leading-relaxed">{level.description}</p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="mb-6">
                  <h4 className="text-white font-semibold mb-3 flex items-center">
                    <BookOpen className="h-4 w-4 mr-2 text-blue-400" />
                    Key Features
                  </h4>
                  <ul className="space-y-2">
                    {level.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-300 text-sm">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button 
                  onClick={() => navigate(level.path)}
                  className={`w-full bg-gradient-to-r ${level.color} hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 shadow-lg transition-all duration-200`}
                >
                  <Play className="h-5 w-5 mr-2" />
                  Start Level {level.id}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Educational Footer */}
        <div className="mt-16 text-center">
          <Card className="bg-white bg-opacity-5 backdrop-blur-lg border border-white border-opacity-10 shadow-xl max-w-4xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Why Choose HemoMaster Academy?
              </h3>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="space-y-3">
                  <div className="p-3 bg-blue-500/20 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                    <Brain className="h-8 w-8 text-blue-400" />
                  </div>
                  <h4 className="text-white font-semibold">Evidence-Based</h4>
                  <p className="text-gray-300 text-sm">
                    All content is based on current medical literature and clinical guidelines
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-green-500/20 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                    <Zap className="h-8 w-8 text-green-400" />
                  </div>
                  <h4 className="text-white font-semibold">Interactive Learning</h4>
                  <p className="text-gray-300 text-sm">
                    Engage with dynamic simulations and hands-on problem solving
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-purple-500/20 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                    <Award className="h-8 w-8 text-purple-400" />
                  </div>
                  <h4 className="text-white font-semibold">Clinical Excellence</h4>
                  <p className="text-gray-300 text-sm">
                    Develop skills that directly translate to improved patient care
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
