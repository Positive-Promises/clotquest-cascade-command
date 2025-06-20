import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Beaker, Microscope, Heart, Clock, Trophy, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

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
  const [experiments, setExperiments] = useState(initialExperiments);

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
    <div className="container mx-auto p-8">
      <Link to="/" className="inline-flex items-center mb-4 text-blue-500 hover:text-blue-700">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Link>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Lab Experiments Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {experiments.map(experiment => (
          <Card key={experiment.id} className="bg-white shadow-md rounded-lg overflow-hidden">
            <CardHeader className="p-4">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                <Beaker className="mr-2 h-5 w-5 text-blue-500" />
                {experiment.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-gray-700 mb-3">{experiment.description}</p>
              <div className="flex items-center mb-2">
                <Badge
                  variant="secondary"
                  className={`mr-2 ${experiment.status === 'idle' ? 'bg-gray-400 text-white' :
                    experiment.status === 'running' ? 'bg-blue-500 text-white' :
                      experiment.status === 'completed' && experiment.outcome === 'success' ? 'bg-green-500 text-white' :
                        experiment.status === 'failed' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                >
                  {experiment.status === 'idle' ? 'Idle' : experiment.status === 'running' ? 'Running' : experiment.status === 'completed' ? 'Completed' : 'Failed'}
                </Badge>
                {experiment.status === 'completed' && (
                  <Badge variant="outline" className={experiment.outcome === 'success' ? 'text-green-600 border-green-600' : 'text-red-600 border-red-600'}>
                    {experiment.outcome === 'success' ? 'Success' : 'Failure'}
                  </Badge>
                )}
              </div>
              <Progress value={experiment.progress} className="mb-4" />
              <div className="flex justify-between">
                {experiment.status === 'idle' ? (
                  <Button onClick={() => startExperiment(experiment.id)}><Microscope className="mr-2 h-4 w-4" />Start</Button>
                ) : experiment.status === 'running' ? (
                  <>
                    <Button variant="secondary" onClick={() => completeExperiment(experiment.id, 'success')}><Heart className="mr-2 h-4 w-4" />Success</Button>
                    <Button variant="destructive" onClick={() => completeExperiment(experiment.id, 'failure')}><Clock className="mr-2 h-4 w-4" />Failure</Button>
                  </>
                ) : (
                  <Button variant="ghost" onClick={() => resetExperiment(experiment.id)}><Trophy className="mr-2 h-4 w-4" />Reset</Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Level2;
