
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Plus, 
  Trash2, 
  Users, 
  BookOpen,
  CheckCircle,
  AlertCircle,
  Microscope,
  Timeline
} from 'lucide-react';
import { DiagnosticHypothesis } from '@/types/pathologyTypes';
import { LiteratureSearch } from './LiteratureSearch';

interface DiagnosticWorkspaceProps {
  hypotheses: DiagnosticHypothesis[];
  onAddHypothesis: (hypothesis: Omit<DiagnosticHypothesis, 'id'>) => void;
  onUpdateHypothesis: (id: string, updates: Partial<DiagnosticHypothesis>) => void;
  onRemoveHypothesis: (id: string) => void;
  onConsultSpecialist: () => void;
  onSearchLiterature: (query: string) => void;
  consultationsRemaining: number;
}

export const DiagnosticWorkspace = ({
  hypotheses,
  onAddHypothesis,
  onUpdateHypothesis,
  onRemoveHypothesis,
  onConsultSpecialist,
  onSearchLiterature,
  consultationsRemaining
}: DiagnosticWorkspaceProps) => {
  const [newDiagnosis, setNewDiagnosis] = useState('');
  const [selectedHypothesis, setSelectedHypothesis] = useState<string | null>(null);

  const handleAddHypothesis = () => {
    if (newDiagnosis.trim()) {
      onAddHypothesis({
        diagnosis: newDiagnosis,
        probability: 50,
        supportingEvidence: [],
        contradictingEvidence: [],
        nextSteps: []
      });
      setNewDiagnosis('');
    }
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 70) return 'text-green-600';
    if (probability >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProbabilityLabel = (probability: number) => {
    if (probability >= 70) return 'High';
    if (probability >= 40) return 'Moderate';
    return 'Low';
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center text-card-foreground">
          <Brain className="h-5 w-5 mr-2 text-primary" />
          Clinical Reasoning Workspace
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="diagnosis" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="diagnosis">Diagnosis</TabsTrigger>
            <TabsTrigger value="literature">Literature</TabsTrigger>
            <TabsTrigger value="consult">Consult</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
          </TabsList>
          
          <TabsContent value="diagnosis" className="space-y-6 mt-6">
            {/* Add New Hypothesis */}
            <div className="space-y-3">
              <h4 className="font-semibold text-card-foreground">Differential Diagnosis</h4>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter suspected diagnosis..."
                  value={newDiagnosis}
                  onChange={(e) => setNewDiagnosis(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddHypothesis()}
                  className="flex-1"
                />
                <Button onClick={handleAddHypothesis} size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </div>

            {/* Current Hypotheses */}
            <div className="space-y-4">
              {hypotheses.map((hypothesis) => (
                <div 
                  key={hypothesis.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedHypothesis === hypothesis.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedHypothesis(
                    selectedHypothesis === hypothesis.id ? null : hypothesis.id
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-semibold text-card-foreground">{hypothesis.diagnosis}</h5>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={getProbabilityColor(hypothesis.probability)}
                      >
                        {getProbabilityLabel(hypothesis.probability)} ({hypothesis.probability}%)
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveHypothesis(hypothesis.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <Progress value={hypothesis.probability} className="h-2 mb-3" />
                  
                  {selectedHypothesis === hypothesis.id && (
                    <div className="space-y-3 border-t pt-3">
                      <div>
                        <h6 className="font-medium text-green-600 mb-1 flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Supporting Evidence
                        </h6>
                        <ul className="text-sm space-y-1">
                          {hypothesis.supportingEvidence.map((evidence, index) => (
                            <li key={index} className="flex items-center">
                              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                              {evidence}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h6 className="font-medium text-red-600 mb-1 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          Contradicting Evidence
                        </h6>
                        <ul className="text-sm space-y-1">
                          {hypothesis.contradictingEvidence.map((evidence, index) => (
                            <li key={index} className="flex items-center">
                              <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                              {evidence}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h6 className="font-medium text-blue-600 mb-1">Next Steps</h6>
                        <ul className="text-sm space-y-1">
                          {hypothesis.nextSteps.map((step, index) => (
                            <li key={index} className="flex items-center">
                              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                              {step}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Clinical Reasoning Help */}
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold text-card-foreground mb-2 flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                Clinical Reasoning Framework
              </h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• Build differential diagnoses based on patient presentation</p>
                <p>• Assign probabilities using Bayesian reasoning</p>
                <p>• Document supporting and contradicting evidence</p>
                <p>• Plan next diagnostic steps or treatments</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="literature" className="mt-6">
            <LiteratureSearch onSearchComplete={(results) => {
              console.log('Literature search results:', results);
            }} />
          </TabsContent>
          
          <TabsContent value="consult" className="space-y-4 mt-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-card-foreground">Expert Consultation</h4>
              <Button 
                onClick={onConsultSpecialist}
                disabled={consultationsRemaining === 0}
                className="w-full"
                variant={consultationsRemaining > 0 ? "default" : "outline"}
              >
                <Users className="h-4 w-4 mr-2" />
                Consult Specialist ({consultationsRemaining} left)
              </Button>
              
              <div className="bg-muted p-4 rounded-lg">
                <h5 className="font-medium text-card-foreground mb-2">Available Specialists</h5>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• Hematologist - Blood disorders and coagulation</p>
                  <p>• Pathologist - Tissue and laboratory analysis</p>
                  <p>• Geneticist - Hereditary bleeding disorders</p>
                  <p>• Emergency Medicine - Acute bleeding management</p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="tools" className="space-y-4 mt-6">
            <div className="grid grid-cols-2 gap-4">
              <Card className="border-muted">
                <CardContent className="p-4">
                  <div className="flex items-center mb-2">
                    <Microscope className="h-5 w-5 mr-2 text-primary" />
                    <h5 className="font-semibold">Virtual Microscopy</h5>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Examine blood smears and tissue samples
                  </p>
                  <Button size="sm" className="w-full" variant="outline">
                    Launch Microscope
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="border-muted">
                <CardContent className="p-4">
                  <div className="flex items-center mb-2">
                    <Timeline className="h-5 w-5 mr-2 text-primary" />
                    <h5 className="font-semibold">Symptom Timeline</h5>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Create interactive timeline of symptoms
                  </p>
                  <Button size="sm" className="w-full" variant="outline">
                    Build Timeline
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
