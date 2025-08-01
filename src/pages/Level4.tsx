import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Search, 
  FileText, 
  BarChart3, 
  Users, 
  Award, 
  Home,
  Brain,
  Stethoscope,
  Microscope,
  Download,
  Share,
  Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '@/components/ThemeToggle';

const Level4: React.FC = () => {
  const navigate = useNavigate();
  const [activeProject, setActiveProject] = useState(0);
  const [researchProgress, setResearchProgress] = useState(25);
  const [timeSpent, setTimeSpent] = useState(0);
  const [points, setPoints] = useState(750);

  // Mock research projects
  const researchProjects = [
    {
      id: 1,
      title: "Novel Anticoagulant Mechanisms",
      status: "active",
      progress: 65,
      description: "Investigating new pathways for safer anticoagulation therapy with reduced bleeding risk.",
      objectives: [
        "Identify novel molecular targets",
        "Develop preliminary compounds",
        "Conduct in-vitro testing",
        "Prepare clinical trial proposal"
      ],
      collaborators: ["Dr. Sarah Chen", "Prof. Michael Torres", "Dr. Anna Kowalski"],
      publications: 2,
      citations: 34
    },
    {
      id: 2,
      title: "Pediatric Hemophilia Gene Therapy",
      status: "planning",
      progress: 20,
      description: "Advancing gene therapy approaches for treating hemophilia in pediatric populations.",
      objectives: [
        "Literature review completion",
        "Protocol development",
        "Ethics approval",
        "Patient recruitment strategy"
      ],
      collaborators: ["Dr. James Wilson", "Prof. Maria Rodriguez"],
      publications: 0,
      citations: 0
    }
  ];

  const researchTools = [
    { name: "PubMed", icon: BookOpen, status: "Available" },
    { name: "Statistical Analysis", icon: PresentationChart, status: "Licensed" },
    { name: "Lab Management", icon: Microscope, status: "Active" },
    { name: "Collaboration Hub", icon: Users, status: "Connected" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentProject = researchProjects[activeProject];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 light:from-purple-50 light:via-blue-50 light:to-indigo-50">
      {/* Header */}
      <div className="container mx-auto p-4">
        <Card className="glassmorphic-card mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="text-center lg:text-left">
                <h1 className="text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Level 4: Research & Innovation Lab
                </h1>
                <p className="text-purple-200 dark:text-purple-200 light:text-purple-800">
                  Lead groundbreaking research in hemostasis and thrombosis
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

            {/* Research Stats */}
            <div className="flex justify-center gap-8 mt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{points}</div>
                <div className="text-sm text-gray-300 dark:text-gray-300 light:text-gray-700">Research Points</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{formatTime(timeSpent)}</div>
                <div className="text-sm text-gray-300 dark:text-gray-300 light:text-gray-700">Time Invested</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{researchProjects.length}</div>
                <div className="text-sm text-gray-300 dark:text-gray-300 light:text-gray-700">Active Projects</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Research Dashboard */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Research Area */}
          <div className="lg:col-span-2">
            <Card className="glassmorphic-card">
              <CardHeader>
                <CardTitle className="text-white dark:text-white light:text-black flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Current Research Project
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="objectives">Objectives</TabsTrigger>
                    <TabsTrigger value="collaboration">Team</TabsTrigger>
                    <TabsTrigger value="publications">Publications</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white dark:text-white light:text-black mb-2">
                        {currentProject.title}
                      </h3>
                      <Badge 
                        variant={currentProject.status === 'active' ? 'default' : 'secondary'}
                        className="mb-3"
                      >
                        {currentProject.status}
                      </Badge>
                      <p className="text-blue-100 dark:text-blue-100 light:text-blue-900 mb-4">
                        {currentProject.description}
                      </p>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300 dark:text-gray-300 light:text-gray-700">Progress</span>
                          <span className="text-blue-300 dark:text-blue-300 light:text-blue-700">{currentProject.progress}%</span>
                        </div>
                        <Progress value={currentProject.progress} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        View Analytics
                      </Button>
                      <Button variant="outline" className="bg-white/10 hover:bg-white/20 border-white/20">
                        <Share className="h-4 w-4 mr-2" />
                        Share Progress
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="objectives" className="space-y-4">
                    <div className="space-y-3">
                      {currentProject.objectives.map((objective, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-blue-800/30 dark:bg-blue-800/30 light:bg-blue-100/50 rounded-lg">
                          <div className={`w-3 h-3 rounded-full ${index < 2 ? 'bg-green-400' : 'bg-gray-400'}`} />
                          <span className="text-blue-100 dark:text-blue-100 light:text-blue-900">{objective}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="collaboration" className="space-y-4">
                    <div className="space-y-3">
                      {currentProject.collaborators.map((collaborator, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-purple-800/30 dark:bg-purple-800/30 light:bg-purple-100/50 rounded-lg">
                          <Users className="h-4 w-4 text-purple-300" />
                          <span className="text-purple-100 dark:text-purple-100 light:text-purple-900">{collaborator}</span>
                          <Badge variant="outline" className="ml-auto">Active</Badge>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="publications" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-green-800/30 dark:bg-green-800/30 light:bg-green-100/50 rounded-lg">
                        <div className="text-2xl font-bold text-green-400">{currentProject.publications}</div>
                        <div className="text-sm text-green-300 dark:text-green-300 light:text-green-700">Publications</div>
                      </div>
                      <div className="text-center p-4 bg-blue-800/30 dark:bg-blue-800/30 light:bg-blue-100/50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-400">{currentProject.citations}</div>
                        <div className="text-sm text-blue-300 dark:text-blue-300 light:text-blue-700">Citations</div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Research Tools */}
            <Card className="glassmorphic-card">
              <CardHeader>
                <CardTitle className="text-white dark:text-white light:text-black text-lg">Research Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {researchTools.map((tool, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <tool.icon className="h-4 w-4 text-blue-300" />
                      <span className="text-blue-100 dark:text-blue-100 light:text-blue-900">{tool.name}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {tool.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Project Selector */}
            <Card className="glassmorphic-card">
              <CardHeader>
                <CardTitle className="text-white dark:text-white light:text-black text-lg">All Projects</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {researchProjects.map((project, index) => (
                  <Button
                    key={project.id}
                    onClick={() => setActiveProject(index)}
                    variant={activeProject === index ? "default" : "outline"}
                    className={`w-full justify-start text-left h-auto p-3 ${
                      activeProject === index 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'bg-white/10 hover:bg-white/20 border-white/20'
                    }`}
                  >
                    <div>
                      <div className="font-medium">{project.title}</div>
                      <div className="text-xs text-gray-300 dark:text-gray-300 light:text-gray-700 mt-1">
                        {project.progress}% complete
                      </div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="glassmorphic-card">
              <CardHeader>
                <CardTitle className="text-white dark:text-white light:text-black text-lg flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Badge className="w-full justify-start bg-yellow-600">
                  🏆 First Publication
                </Badge>
                <Badge className="w-full justify-start bg-blue-600">
                  🔬 Research Milestone
                </Badge>
                <Badge className="w-full justify-start bg-purple-600">
                  🤝 Collaboration Expert
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>

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
                onClick={() => navigate('/level2')}
                variant="outline"
                className="bg-white/10 hover:bg-white/20 border-white/20"
              >
                <Stethoscope className="h-4 w-4 mr-2" />
                Level 2: Clinical Cases
              </Button>
              <Button
                onClick={() => navigate('/level3')}
                variant="outline"
                className="bg-white/10 hover:bg-white/20 border-white/20"
              >
                <Microscope className="h-4 w-4 mr-2" />
                Level 3: Pathology
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Level4;
