
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Beaker, Microscope, Heart, Clock, Trophy, ArrowLeft, LogOut, Play, RotateCcw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AudioSystem from '@/components/AudioSystem';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Experiment {
  id: number;
  title: string;
  description: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  progress: number;
  outcome?: 'success' | 'failure';
}

const initialExperiments: Experiment[] = [
  {
    id: 1,
    title: 'Cell Culture Optimization',
    description: 'Optimizing growth conditions for mammalian cell cultures.',
    status: 'idle',
    progress: 0,
  },
  {
    id: 2,
    title: 'Protein Purification',
    description: 'Purifying a target protein using affinity chromatography.',
    status: 'running',
    progress: 50,
  },
  {
    id: 3,
    title: 'Enzyme Kinetics Assay',
    description: 'Measuring the reaction rate of an enzyme at different substrate concentrations.',
    status: 'completed',
    progress: 100,
    outcome: 'success',
  },
  {
    id: 4,
    title: 'Antibody Production',
    description: 'Generating monoclonal antibodies against a specific antigen.',
    status: 'failed',
    progress: 80,
    outcome: 'failure',
  },
];

const Level2 = () => {
  const navigate = useNavigate();
  const [experiments, setExperiments] = useState(initialExperiments);
  const [showExitDialog, setShowExitDialog] = useState(false);

  const startExperiment = (id: number) => {
    setExperiments(experiments.map(exp =>
      exp.id === id ? { ...exp, status: 'running', progress: 10 } : exp
    ));
  };

  const completeExperiment = (id: number, outcome: 'success' | 'failure') => {
    setExperiments(experiments.map(exp =>
      exp.id === id ? { ...exp, status: 'completed', progress: 100, outcome } : exp
    ));
  };

  const resetExperiment = (id: number) => {
    setExperiments(experiments.map(exp =>
      exp.id === id ? { ...exp, status: 'idle', progress: 0, outcome: undefined } : exp
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 pb-32 relative overflow-hidden">
      {/* Floating particles animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/20 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <AudioSystem gameState="playing" level={2} />
      
      {/* Exit Button */}
      <Button
        onClick={() => setShowExitDialog(true)}
        className="fixed top-4 left-4 z-50 bg-red-600/80 hover:bg-red-700 backdrop-blur-sm border border-red-400/30 transform hover:scale-105 transition-all duration-200"
      >
        <LogOut className="h-4 w-4 mr-2" />
        Exit Game
      </Button>

      <div className="container mx-auto relative z-10">
        <div className="mb-6 animate-in slide-in-from-top-4 duration-1000">
          <Link to="/" className="inline-flex items-center mb-4 text-blue-300 hover:text-blue-100 transform hover:scale-105 transition-all duration-200">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          
          <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl transform hover:scale-[1.01] transition-all duration-300">
            <CardContent className="p-6">
              <h1 className="text-3xl font-bold mb-2 text-white bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
                Lab Experiments Dashboard
              </h1>
              <p className="text-blue-200">Master platelet aggregation through interactive laboratory simulations</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiments.map((experiment, index) => (
            <div key={experiment.id} className="animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: `${index * 200}ms` }}>
              <Card className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl transform hover:scale-105 transition-all duration-300 hover:shadow-3xl">
                <CardHeader className="p-4">
                  <CardTitle className="text-lg font-semibold text-white flex items-center">
                    <Beaker className="mr-2 h-5 w-5 text-blue-400 animate-pulse" />
                    {experiment.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-gray-200 mb-3">{experiment.description}</p>
                  <div className="flex items-center mb-2">
                    <Badge
                      variant="secondary"
                      className={`mr-2 transform hover:scale-105 transition-transform ${
                        experiment.status === 'idle' ? 'bg-gray-600 text-white' :
                        experiment.status === 'running' ? 'bg-blue-600 text-white animate-pulse' :
                        experiment.status === 'completed' && experiment.outcome === 'success' ? 'bg-green-600 text-white' :
                        experiment.status === 'failed' ? 'bg-red-600 text-white' : 'bg-gray-400'
                      }`}
                    >
                      {experiment.status === 'idle' ? 'Idle' : 
                       experiment.status === 'running' ? 'Running' : 
                       experiment.status === 'completed' ? 'Completed' : 'Failed'}
                    </Badge>
                    {experiment.status === 'completed' && (
                      <Badge 
                        variant="outline" 
                        className={`transform hover:scale-105 transition-transform ${
                          experiment.outcome === 'success' ? 'text-green-400 border-green-400' : 'text-red-400 border-red-400'
                        }`}
                      >
                        {experiment.outcome === 'success' ? 'Success' : 'Failure'}
                      </Badge>
                    )}
                  </div>
                  <Progress value={experiment.progress} className="mb-4" />
                  <div className="flex justify-between">
                    {experiment.status === 'idle' ? (
                      <Button 
                        onClick={() => startExperiment(experiment.id)} 
                        className="bg-blue-600 hover:bg-blue-700 transform hover:scale-105 transition-all duration-200"
                      >
                        <Microscope className="mr-2 h-4 w-4" />Start
                      </Button>
                    ) : experiment.status === 'running' ? (
                      <>
                        <Button 
                          variant="secondary" 
                          onClick={() => completeExperiment(experiment.id, 'success')} 
                          className="bg-green-600 hover:bg-green-700 transform hover:scale-105 transition-all duration-200"
                        >
                          <Heart className="mr-2 h-4 w-4" />Success
                        </Button>
                        <Button 
                          variant="destructive" 
                          onClick={() => completeExperiment(experiment.id, 'failure')}
                          className="transform hover:scale-105 transition-all duration-200"
                        >
                          <Clock className="mr-2 h-4 w-4" />Failure
                        </Button>
                      </>
                    ) : (
                      <Button 
                        variant="ghost" 
                        onClick={() => resetExperiment(experiment.id)} 
                        className="text-white hover:bg-white/10 transform hover:scale-105 transition-all duration-200"
                      >
                        <Trophy className="mr-2 h-4 w-4" />Reset
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Exit Dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 border border-red-400/30 backdrop-blur-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-2xl font-bold text-red-400">
              Exit Game?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-lg text-gray-300">
              Are you sure you want to exit? Your current progress will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-center space-x-4">
            <AlertDialogCancel className="border-white/20 text-white hover:bg-white/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => navigate('/')}
              className="bg-red-600 hover:bg-red-700"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Exit Game
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Level2;
