import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Plus, 
  Trash2, 
  Search, 
  Users, 
  BookOpen,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { DiagnosticHypothesis } from '@/types/pathologyTypes';

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
  const [searchQuery, setSearchQuery] = useState('');
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

  const handleSearchLiterature = () => {
    if (searchQuery.trim()) {
      onSearchLiterature(searchQuery);
      setSearchQuery('');
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
          Diagnostic Reasoning
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
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

        {/* Clinical Tools */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-semibold text-card-foreground">Literature Search</h4>
            <div className="flex gap-2">
              <Input
                placeholder="Search medical literature..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearchLiterature()}
                className="flex-1"
              />
              <Button onClick={handleSearchLiterature} size="sm">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
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
          </div>
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
      </CardContent>
    </Card>
  );
};