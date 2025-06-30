import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { ThemeProvider } from '@/components/ThemeProvider';
import ThemeToggle from '@/components/ThemeToggle';
import { Flame, Clock, ShoppingCart, TrendingUp, Star, Play } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleGameSelect = (route: string) => {
    toast({
      title: "Game Selected!",
      description: `Navigating to ${route}...`,
    });
    navigate(route);
  };

  const gameCards = [
    {
      id: 1,
      title: "Coagulation Cascade Commander",
      description: "Master the intricate coagulation cascade through interactive drag-and-drop gameplay. Learn each factor's role in hemostasis.",
      level: "Level 1",
      difficulty: "Beginner",
      route: "/level1",
      completionRate: 78,
      rating: 4.8,
      isHot: true,
      estimatedTime: "15 mins",
      coursePrice: "Q29.99",
      features: ["Emergency Mode", "Interactive Tutorial", "Real-time Feedback"],
      gradient: "from-blue-600 via-purple-600 to-pink-600"
    },
    {
      id: 2, 
      title: "Hematology Lab Diagnostic Detective",
      description: "Master laboratory diagnostics for coagulation disorders in this challenging game.",
      level: "Level 2",
      difficulty: "Intermediate", 
      route: "/level2",
      completionRate: 65,
      rating: 4.6,
      isLive: true,
      estimatedTime: "25 mins",
      coursePrice: "Q39.99",
      features: ["Advanced Mechanics", "Multiplayer Mode"],
      gradient: "from-green-500 via-teal-500 to-blue-500"
    },
    {
      id: 3,
      title: "PATHOLOGY PROFESSOR",
      description: "Learn anticoagulation therapy through strategic gameplay and clinical scenarios.",
      level: "Level 3", 
      difficulty: "Advanced",
      route: "/level3",
      completionRate: 52,
      rating: 4.9,
      isHot: true,
      estimatedTime: "35 mins", 
      coursePrice: "Q49.99",
      features: ["Clinical Cases", "Drug Interactions"],
      gradient: "from-purple-600 via-pink-600 to-red-600"
    },
    {
      id: 4,
      title: "Diagnosis & Treatment Tactician, Resource Manager",
      description: "Diagnose and manage bleeding disorders through immersive clinical simulations.",
      level: "Level 4",
      difficulty: "Expert",
      route: "/level4", 
      completionRate: 41,
      rating: 4.7,
      isLive: true,
      estimatedTime: "45 mins",
      coursePrice: "Q59.99", 
      features: ["AI Patients", "Diagnostic Tools"],
      gradient: "from-red-600 via-orange-600 to-yellow-600"
    }
  ];

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 dark:from-slate-950 dark:via-blue-950 dark:to-slate-950 light:from-slate-100 light:via-blue-100 light:to-slate-100">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDYwIDAgTCAwIDAgMCA2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIxIiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] bg-repeat"></div>
        </div>
        
        {/* Hero Section with Theme Toggle */}
        <div className="container mx-auto px-4 pt-8 pb-16 relative z-10">
          <div className="flex justify-between items-start mb-8">
            <div></div>
            <ThemeToggle />
          </div>
          
          {/* Hero Content */}
          <div className="text-center md:text-left md:flex md:items-center">
            <div className="md:w-2/3">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                ClotQuest: Cascade Command
              </h1>
              <p className="text-blue-200 dark:text-blue-200 light:text-blue-200 text-lg md:text-xl mb-8 leading-relaxed">
                Master the art of hemostasis through interactive challenges and simulations.
                From coagulation cascades to bleeding disorders, become the ultimate blood clot commander!
              </p>
              <div className="space-x-4">
                <Button onClick={() => handleGameSelect('/level1')} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
                  Start Learning
                </Button>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 backdrop-blur-sm">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
          
          {/* Enhanced Game Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {gameCards.map((game, index) => (
              <Card key={game.id} className={`group relative overflow-hidden bg-gradient-to-br ${game.gradient} shadow-2xl border-0 hover-scale hover-glow transition-all duration-500 animate-fade-in`}
                style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-8 relative z-10">
                  {/* Status Badges */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-wrap gap-2">
                      {game.isHot && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-orange-500 to-red-500 text-white">
                          <Flame className="h-3 w-3 mr-1" />
                          HOT
                        </span>
                      )}
                      {game.isLive && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-green-500 to-emerald-500 text-white animate-pulse">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          LIVE
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-white/90 text-sm mb-1">
                        <Clock className="h-4 w-4 mr-1" />
                        {game.estimatedTime}
                      </div>
                      <div className="flex items-center text-yellow-300 text-sm">
                        <Star className="h-4 w-4 mr-1 fill-current" />
                        {game.rating}
                      </div>
                    </div>
                  </div>

                  {/* Game Info */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-2xl font-bold text-white group-hover:text-yellow-300 transition-colors">
                        {game.title}
                      </h3>
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold text-white">
                        {game.level}
                      </span>
                    </div>
                    <p className="text-white/90 mb-4 leading-relaxed">
                      {game.description}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                        <div className="text-white font-bold text-lg">{game.completionRate}%</div>
                        <div className="text-white/70 text-sm">Completion Rate</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                        <div className="text-white font-bold text-lg">{game.difficulty}</div>
                        <div className="text-white/70 text-sm">Difficulty</div>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {game.features.map((feature, idx) => (
                          <span key={idx} className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded text-xs text-white">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => handleGameSelect(game.route)}
                      className="flex-1 bg-white text-gray-900 hover:bg-white/90 font-bold py-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      PLAY
                    </Button>
                    <Button 
                      variant="outline"
                      className="px-4 bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {game.coursePrice}
                    </Button>
                  </div>
                </CardContent>

                {/* Animated Background Elements */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-white rounded-full opacity-10 group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-white rounded-full opacity-5 group-hover:scale-125 transition-transform duration-700"></div>
                </div>
              </Card>
            ))}
          </div>

          {/* Features Section */}
          <section className="py-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Unlock the Secrets of Hemostasis</h2>
              <p className="text-blue-200 text-lg">Explore advanced features designed to enhance your learning experience.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 mx-auto text-green-400 mb-3" />
                <h3 className="text-xl font-semibold text-white mb-2">Real-time Progress Tracking</h3>
                <p className="text-blue-200">Monitor your learning progress and identify areas for improvement.</p>
              </div>
              <div className="text-center">
                <Clock className="h-12 w-12 mx-auto text-yellow-400 mb-3" />
                <h3 className="text-xl font-semibold text-white mb-2">Adaptive Learning Paths</h3>
                <p className="text-blue-200">Personalized learning paths that adapt to your skill level and pace.</p>
              </div>
              <div className="text-center">
                <Star className="h-12 w-12 mx-auto text-blue-400 mb-3" />
                <h3 className="text-xl font-semibold text-white mb-2">Expert-Designed Content</h3>
                <p className="text-blue-200">Curated content developed by leading hematology experts.</p>
              </div>
            </div>
          </section>

          {/* Social Gaming Integration */}
          <section className="py-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Join the Hemostasis Community</h2>
              <p className="text-blue-200 text-lg">Connect with fellow learners and compete in collaborative challenges.</p>
            </div>
            <div className="flex justify-center">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg">
                Explore Community Features
              </Button>
            </div>
          </section>

          {/* How to Play Section */}
          <section className="py-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Ready to Start Your Quest?</h2>
              <p className="text-blue-200 text-lg">Follow these simple steps to begin your journey.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-blue-500 rounded-full text-white text-2xl font-bold flex items-center justify-center mb-3">1</div>
                <h3 className="text-xl font-semibold text-white mb-2">Select a Level</h3>
                <p className="text-blue-200">Choose a level that matches your current knowledge and skill level.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-purple-500 rounded-full text-white text-2xl font-bold flex items-center justify-center mb-3">2</div>
                <h3 className="text-xl font-semibold text-white mb-2">Complete the Challenges</h3>
                <p className="text-blue-200">Engage with interactive simulations and solve complex hemostasis puzzles.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-pink-500 rounded-full text-white text-2xl font-bold flex items-center justify-center mb-3">3</div>
                <h3 className="text-xl font-semibold text-white mb-2">Track Your Progress</h3>
                <p className="text-blue-200">Monitor your progress and earn rewards as you master each concept.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Index;
