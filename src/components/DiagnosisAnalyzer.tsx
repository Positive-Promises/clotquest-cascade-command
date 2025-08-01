
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Search,
  Target,
  BookOpen
} from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  symptoms: string[];
  clinicalHistory: string;
}

interface DiagnosisData {
  name: string;
  probability: number;
  supportingEvidence: string[];
  contradictingEvidence: string[];
  additionalTests: string[];
  treatment: string[];
}

interface DiagnosisAnalyzerProps {
  patient: Patient | null;
  testResults: any[];
  onScoreUpdate: (points: number) => void;
}

const DiagnosisAnalyzer = ({ patient, testResults, onScoreUpdate }: DiagnosisAnalyzerProps) => {
  const [userDiagnosis, setUserDiagnosis] = useState('');
  const [analysisResult, setAnalysisResult] = useState<DiagnosisData | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  // Comprehensive diagnosis database for coagulation disorders
  const diagnosisDatabase: { [key: string]: DiagnosisData } = {
    'hemophilia a': {
      name: 'Hemophilia A (Factor VIII Deficiency)',
      probability: 0.95,
      supportingEvidence: [
        'Prolonged aPTT with normal PT',
        'X-linked inheritance pattern',
        'Joint bleeding (hemarthrosis)',
        'Muscle bleeding episodes',
        'Factor VIII levels <50%',
        'Male gender predominance'
      ],
      contradictingEvidence: [
        'Normal aPTT would rule out severe deficiency',
        'Female gender (though carriers can have symptoms)',
        'Normal factor VIII levels',
        'Absence of bleeding history'
      ],
      additionalTests: [
        'Factor VIII assay',
        'Factor VIII inhibitor screen',
        'Mixing studies',
        'Family history analysis'
      ],
      treatment: [
        'Factor VIII concentrates',
        'Desmopressin (DDAVP) for mild cases',
        'Antifibrinolytic agents',
        'Avoid antiplatelet medications'
      ]
    },
    'hemophilia b': {
      name: 'Hemophilia B (Factor IX Deficiency)',
      probability: 0.90,
      supportingEvidence: [
        'Prolonged aPTT with normal PT',
        'X-linked inheritance pattern',
        'Joint and muscle bleeding',
        'Factor IX levels <50%',
        'Normal Factor VIII levels'
      ],
      contradictingEvidence: [
        'Normal aPTT',
        'Low Factor VIII levels',
        'Female gender',
        'No bleeding history'
      ],
      additionalTests: [
        'Factor IX assay',
        'Mixing studies',
        'Genetic testing',
        'Factor IX inhibitor screen'
      ],
      treatment: [
        'Factor IX concentrates',
        'Fresh frozen plasma',
        'Avoid anticoagulants',
        'Joint protection measures'
      ]
    },
    'von willebrand disease': {
      name: 'von Willebrand Disease',
      probability: 0.85,
      supportingEvidence: [
        'Mucocutaneous bleeding',
        'Heavy menstrual bleeding',
        'Prolonged bleeding time',
        'Low von Willebrand factor',
        'Autosomal dominant inheritance',
        'Platelet aggregation defects'
      ],
      contradictingEvidence: [
        'Normal bleeding time',
        'Normal von Willebrand studies',
        'Absence of mucocutaneous bleeding',
        'Normal platelet aggregation'
      ],
      additionalTests: [
        'von Willebrand factor antigen',
        'von Willebrand factor activity',
        'Platelet aggregometry',
        'Multimer analysis'
      ],
      treatment: [
        'Desmopressin (DDAVP)',
        'von Willebrand factor concentrates',
        'Antifibrinolytic agents',
        'Hormonal therapy for menorrhagia'
      ]
    },
    'dic': {
      name: 'Disseminated Intravascular Coagulation',
      probability: 0.70,
      supportingEvidence: [
        'Low platelet count',
        'Prolonged PT and aPTT',
        'Elevated D-dimer',
        'Low fibrinogen',
        'Schistocytes on blood smear',
        'Underlying trigger condition'
      ],
      contradictingEvidence: [
        'Normal platelet count',
        'Normal coagulation times',
        'Normal D-dimer',
        'Normal fibrinogen levels',
        'Absence of underlying condition'
      ],
      additionalTests: [
        'D-dimer',
        'Fibrinogen level',
        'Platelet count',
        'Peripheral blood smear',
        'Factor levels'
      ],
      treatment: [
        'Treat underlying cause',
        'Fresh frozen plasma',
        'Platelet transfusion',
        'Cryoprecipitate',
        'Supportive care'
      ]
    },
    'thrombocytopenia': {
      name: 'Thrombocytopenia',
      probability: 0.75,
      supportingEvidence: [
        'Low platelet count (<150,000)',
        'Petechial rash',
        'Easy bruising',
        'Mucosal bleeding',
        'Prolonged bleeding time'
      ],
      contradictingEvidence: [
        'Normal platelet count',
        'Normal bleeding time',
        'Absence of bleeding symptoms',
        'No petechiae or purpura'
      ],
      additionalTests: [
        'Complete blood count',
        'Peripheral blood smear',
        'Bone marrow biopsy',
        'Antiplatelet antibodies'
      ],
      treatment: [
        'Corticosteroids',
        'Immunoglobulins',
        'Platelet transfusion',
        'Splenectomy (refractory cases)'
      ]
    }
  };

  const analyzeDiagnosis = (diagnosis: string) => {
    const normalizedDiagnosis = diagnosis.toLowerCase().trim();
    
    // Check for exact matches or partial matches
    const matchedKey = Object.keys(diagnosisDatabase).find(key => 
      normalizedDiagnosis.includes(key) || key.includes(normalizedDiagnosis)
    );

    if (matchedKey) {
      const result = diagnosisDatabase[matchedKey];
      setAnalysisResult(result);
      
      // Check if it's the correct diagnosis based on patient case
      const isCorrect = checkDiagnosisCorrectness(matchedKey);
      if (isCorrect) {
        onScoreUpdate(100);
      }
    } else {
      // Generate generic analysis for unknown diagnoses
      setAnalysisResult({
        name: diagnosis,
        probability: 0.20,
        supportingEvidence: ['Limited evidence available for this diagnosis'],
        contradictingEvidence: ['Consider more common coagulation disorders first'],
        additionalTests: ['Complete coagulation panel', 'Specialist consultation'],
        treatment: ['Seek expert hematology opinion']
      });
    }
    
    setShowAnalysis(true);
  };

  const checkDiagnosisCorrectness = (diagnosisKey: string): boolean => {
    if (!patient) return false;
    
    // Logic to determine correct diagnosis based on patient ID and test results
    if (patient.id === 'p2' && diagnosisKey === 'hemophilia a') return true;
    if (patient.id === 'p1' && diagnosisKey === 'von willebrand disease') return true;
    
    return false;
  };

  const getDifferentialDiagnoses = (): string[] => {
    if (!patient) return [];
    
    // Return relevant differentials based on patient presentation
    const commonDifferentials = [
      'Hemophilia A',
      'Hemophilia B', 
      'von Willebrand Disease',
      'Thrombocytopenia',
      'DIC'
    ];
    
    return commonDifferentials;
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Brain className="h-6 w-6 mr-2 text-blue-400" />
            Diagnosis Analysis Tool
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              value={userDiagnosis}
              onChange={(e) => setUserDiagnosis(e.target.value)}
              placeholder="Enter suspected diagnosis..."
              className="bg-white/5 border-white/20 text-white placeholder:text-white/60"
            />
            <Button
              onClick={() => analyzeDiagnosis(userDiagnosis)}
              disabled={!userDiagnosis.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Search className="h-4 w-4 mr-2" />
              Analyze
            </Button>
          </div>
          
          {showAnalysis && analysisResult && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">{analysisResult.name}</h3>
                <Badge 
                  variant={analysisResult.probability > 0.8 ? "default" : analysisResult.probability > 0.5 ? "secondary" : "destructive"}
                  className="text-sm"
                >
                  {Math.round(analysisResult.probability * 100)}% Match
                </Badge>
              </div>

              <Tabs defaultValue="evidence" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-white/10">
                  <TabsTrigger value="evidence">Evidence</TabsTrigger>
                  <TabsTrigger value="tests">Tests</TabsTrigger>
                  <TabsTrigger value="treatment">Treatment</TabsTrigger>
                  <TabsTrigger value="differentials">Differentials</TabsTrigger>
                </TabsList>
                
                <TabsContent value="evidence" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-green-500/10 border-green-500/30">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-green-400 text-sm flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Supporting Evidence
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="text-sm text-white/80 space-y-1">
                          {analysisResult.supportingEvidence.map((evidence, index) => (
                            <li key={index} className="flex items-start">
                              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 mt-1.5"></span>
                              {evidence}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-red-500/10 border-red-500/30">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-red-400 text-sm flex items-center">
                          <XCircle className="h-4 w-4 mr-2" />
                          Contradicting Evidence
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="text-sm text-white/80 space-y-1">
                          {analysisResult.contradictingEvidence.map((evidence, index) => (
                            <li key={index} className="flex items-start">
                              <span className="w-2 h-2 bg-red-400 rounded-full mr-2 mt-1.5"></span>
                              {evidence}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="tests" className="space-y-2">
                  <h4 className="text-white font-semibold">Recommended Additional Tests:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {analysisResult.additionalTests.map((test, index) => (
                      <Badge key={index} variant="outline" className="text-white border-white/30 justify-start p-2">
                        <Target className="h-3 w-3 mr-2" />
                        {test}
                      </Badge>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="treatment" className="space-y-2">
                  <h4 className="text-white font-semibold">Treatment Considerations:</h4>
                  <ul className="text-sm text-white/80 space-y-1">
                    {analysisResult.treatment.map((treatment, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-blue-400 rounded-full mr-2 mt-1.5"></span>
                        {treatment}
                      </li>
                    ))}
                  </ul>
                </TabsContent>
                
                <TabsContent value="differentials" className="space-y-2">
                  <h4 className="text-white font-semibold">Differential Diagnoses to Consider:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {getDifferentialDiagnoses().map((differential, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="cursor-pointer hover:bg-white/20 transition-colors p-2 justify-center"
                        onClick={() => {
                          setUserDiagnosis(differential);
                          analyzeDiagnosis(differential);
                        }}
                      >
                        <BookOpen className="h-3 w-3 mr-2" />
                        {differential}
                      </Badge>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DiagnosisAnalyzer;
