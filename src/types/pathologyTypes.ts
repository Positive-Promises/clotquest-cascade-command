export interface Patient {
  id: string;
  demographics: {
    age: number;
    sex: 'M' | 'F';
    ethnicity: string;
    occupation: string;
  };
  chiefComplaint: string;
  historyOfPresentIllness: string;
  pastMedicalHistory: string[];
  medications: string[];
  familyHistory: string[];
  socialHistory: string;
  reviewOfSystems: string[];
  physicalExam: PhysicalExam;
  labResults: LabResult[];
  images: PathologyImage[];
}

export interface PhysicalExam {
  vitalSigns: {
    temperature: number;
    bloodPressure: string;
    heartRate: number;
    respiratoryRate: number;
  };
  general: string;
  cardiovascular: string;
  pulmonary: string;
  abdominal: string;
  extremities: string;
  skin: string;
  neurological: string;
}

export interface LabResult {
  id: string;
  name: string;
  value: string | number;
  unit: string;
  referenceRange: string;
  isAbnormal: boolean;
  significance: 'High' | 'Low' | 'Critical' | 'Normal';
}

export interface PathologyImage {
  id: string;
  type: 'blood_smear' | 'tissue_sample' | 'gross_pathology' | 'radiological';
  title: string;
  description: string;
  url: string;
  findings: string[];
}

export interface DiagnosticHypothesis {
  id: string;
  diagnosis: string;
  probability: number;
  supportingEvidence: string[];
  contradictingEvidence: string[];
  nextSteps: string[];
}

export interface ClinicalCase {
  id: string;
  title: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'hereditary' | 'acquired' | 'platelet' | 'thrombophilia' | 'medication';
  patient: Patient;
  correctDiagnosis: string;
  learningObjectives: string[];
  timeLimit: number; // in minutes
  isUrgent: boolean;
  resourceLimited: boolean;
  scoringCriteria: {
    accuracyWeight: number;
    timeWeight: number;
    evidenceWeight: number;
  };
}

export interface GameState {
  currentCase: ClinicalCase | null;
  hypotheses: DiagnosticHypothesis[];
  timeElapsed: number;
  score: number;
  consultationsUsed: number;
  isComplete: boolean;
  feedback: string[];
}