
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, XCircle, Search } from 'lucide-react';

interface DiagnosisAnalyzerProps {
  patientCase: {
    symptoms: string[];
    labResults: string[];
    history: string;
    correctDiagnosis: string;
    differentialDiagnoses: string[];
  };
  onAnalysisComplete: (correct: boolean, score: number) => void;
}

const DiagnosisAnalyzer: React.FC<DiagnosisAnalyzerProps> = ({ 
  patientCase, 
  onAnalysisComplete 
}) => {
  const [userDiagnosis, setUserDiagnosis] = useState('');
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const analyzeDiagnosis = () => {
    if (!userDiagnosis.trim()) return;

    const isCorrect = userDiagnosis.toLowerCase().trim() === 
                      patientCase.correctDiagnosis.toLowerCase().trim();
    
    const score = isCorrect ? 100 : 50;
    
    // Generate analysis for user's diagnosis
    const analysis = generateDiagnosisAnalysis(userDiagnosis, patientCase);
    
    setAnalysisResult({
      isCorrect,
      userDiagnosis,
      correctDiagnosis: patientCase.correctDiagnosis,
      differentials: patientCase.differentialDiagnoses,
      analysis
    });
    
    setShowAnalysis(true);
    onAnalysisComplete(isCorrect, score);
  };

  const generateDiagnosisAnalysis = (diagnosis: string, caseData: any) => {
    const diagnosisLower = diagnosis.toLowerCase();
    
    // Define evidence for different diagnoses
    const evidenceMap: { [key: string]: { supporting: string[], contradicting: string[] } } = {
      'hemophilia a': {
        supporting: ['Prolonged aPTT', 'Normal PT', 'Family history of bleeding', 'Joint bleeding'],
        contradicting: ['Normal factor VIII levels', 'Recent platelet count normal']
      },
      'hemophilia b': {
        supporting: ['Prolonged aPTT', 'Normal PT', 'Factor IX deficiency', 'Bleeding tendency'],
        contradicting: ['Normal factor IX levels', 'No family history']
      },
      'von willebrand disease': {
        supporting: ['Mucocutaneous bleeding', 'Prolonged bleeding time', 'Family history'],
        contradicting: ['Normal vWF studies', 'No epistaxis history']
      },
      'dic': {
        supporting: ['Low platelets', 'Elevated D-dimer', 'Prolonged PT/aPTT', 'Underlying sepsis'],
        contradicting: ['Normal fibrinogen', 'No schistocytes on smear']
      },
      'thrombocytopenia': {
        supporting: ['Low platelet count', 'Petechial rash', 'Mucosal bleeding'],
        contradicting: ['Normal platelet count', 'No bleeding symptoms']
      }
    };

    // Find closest match or use default
    let evidence = evidenceMap[diagnosisLower] || {
      supporting: ['Clinical presentation consistent', 'Laboratory findings supportive'],
      contradicting: ['Alternative diagnoses possible', 'Additional testing needed']
    };

    return evidence;
  };

  return (
    <Card className="glassmorphic-card">
      <CardHeader>
        <CardTitle className="text-white dark:text-white light:text-black flex items-center gap-2">
          <Search className="h-5 w-5" />
          Diagnosis Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!showAnalysis ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-blue-200 dark:text-blue-200 light:text-blue-800 mb-2">
                Enter your suspected diagnosis:
              </label>
              <Input
                value={userDiagnosis}
                onChange={(e) => setUserDiagnosis(e.target.value)}
                placeholder="e.g., Hemophilia A, DIC, von Willebrand Disease..."
                className="bg-white/10 border-white/20 text-white dark:text-white light:text-black placeholder-blue-300"
              />
            </div>
            <Button 
              onClick={analyzeDiagnosis}
              disabled={!userDiagnosis.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Analyze Diagnosis
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Result Header */}
            <div className="flex items-center gap-3">
              {analysisResult.isCorrect ? (
                <CheckCircle className="h-6 w-6 text-green-400" />
              ) : (
                <AlertTriangle className="h-6 w-6 text-yellow-400" />
              )}
              <div>
                <h3 className="text-lg font-semibold text-white dark:text-white light:text-black">
                  {analysisResult.isCorrect ? 'Correct Diagnosis!' : 'Diagnosis Analysis'}
                </h3>
                <p className="text-sm text-blue-200 dark:text-blue-200 light:text-blue-800">
                  Your diagnosis: {analysisResult.userDiagnosis}
                </p>
              </div>
            </div>

            {/* Evidence Analysis */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-800/30 dark:bg-green-800/30 light:bg-green-100/50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-300 dark:text-green-300 light:text-green-700 mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Supporting Evidence
                </h4>
                <ul className="space-y-2">
                  {analysisResult.analysis.supporting.map((evidence: string, index: number) => (
                    <li key={index} className="text-sm text-green-200 dark:text-green-200 light:text-green-800 flex items-start gap-2">
                      <span className="text-green-400 mt-1">•</span>
                      {evidence}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-red-800/30 dark:bg-red-800/30 light:bg-red-100/50 p-4 rounded-lg">
                <h4 className="font-semibold text-red-300 dark:text-red-300 light:text-red-700 mb-3 flex items-center gap-2">
                  <XCircle className="h-4 w-4" />
                  Contradicting Evidence
                </h4>
                <ul className="space-y-2">
                  {analysisResult.analysis.contradicting.map((evidence: string, index: number) => (
                    <li key={index} className="text-sm text-red-200 dark:text-red-200 light:text-red-800 flex items-start gap-2">
                      <span className="text-red-400 mt-1">•</span>
                      {evidence}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Correct Diagnosis (if wrong) */}
            {!analysisResult.isCorrect && (
              <div className="bg-blue-800/30 dark:bg-blue-800/30 light:bg-blue-100/50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-300 dark:text-blue-300 light:text-blue-700 mb-2">
                  Correct Diagnosis: {analysisResult.correctDiagnosis}
                </h4>
                <p className="text-sm text-blue-200 dark:text-blue-200 light:text-blue-800">
                  Review the case presentation and laboratory findings to understand why this is the most likely diagnosis.
                </p>
              </div>
            )}

            {/* Differential Diagnoses */}
            <div className="bg-purple-800/30 dark:bg-purple-800/30 light:bg-purple-100/50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-300 dark:text-purple-300 light:text-purple-700 mb-3">
                Other Differential Diagnoses to Consider:
              </h4>
              <div className="flex flex-wrap gap-2">
                {analysisResult.differentials.map((diagnosis: string, index: number) => (
                  <Badge key={index} variant="outline" className="bg-purple-600/20 border-purple-400/30">
                    {diagnosis}
                  </Badge>
                ))}
              </div>
            </div>

            <Button 
              onClick={() => {
                setShowAnalysis(false);
                setUserDiagnosis('');
                setAnalysisResult(null);
              }}
              variant="outline"
              className="w-full bg-white/10 hover:bg-white/20 border-white/20"
            >
              Try Another Diagnosis
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DiagnosisAnalyzer;
