
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Play, 
  RotateCcw, 
  Stethoscope,
  Pill,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Award,
  Calculator,
  Microscope,
  Brain,
  FileText,
  Target,
  LogOut,
  Home,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  Lightbulb,
  DollarSign,
  X,
  Zap
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import GlassmorphicCard from '@/components/enhanced/GlassmorphicCard';
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

interface Patient {
  id: string;
  name: string;
  age: number;
  weight: number;
  gender: string;
  chiefComplaint: string;
  presentIllness: string;
  pastMedicalHistory: string[];
  medications: string[];
  allergies: string[];
  familyHistory: string;
  socialHistory: string;
  symptoms: string[];
  physicalExam: {
    vitals: {
      bloodPressure: string;
      heartRate: number;
      temperature: number;
      respiratoryRate: number;
      oxygenSat: number;
    };
    generalAppearance: string;
    skin: string;
    cardiovascular: string;
    respiratory: string;
    abdomen: string;
    extremities: string;
    neurological: string;
  };
  labValues: {
    pt: number;
    aptt: number;
    inr: number;
    plateletCount: number;
    hemoglobin: number;
    hematocrit: number;
    wbc: number;
    fibrinogen: number;
    dDimer: number;
    factorVIII?: number;
    factorIX?: number;
    vwf?: number;
  };
  correctDiagnosis: string;
  necessaryTests: string[];
  necessaryTreatments: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

interface DiagnosticTest {
  id: string;
  name: string;
  category: 'basic' | 'specialized' | 'genetic' | 'imaging';
  cost: number;
  timeToResult: number;
  description: string;
  indication: string;
  normalRange: string;
  isNecessaryFor: string[];
}

interface Treatment {
  id: string;
  name: string;
  type: 'anticoagulant' | 'antiplatelet' | 'thrombolytic' | 'reversal' | 'blood_product' | 'hemostatic';
  mechanism: string;
  dosage: string;
  contraindications: string[];
  sideEffects: string[];
  monitoring: string[];
  cost: number;
  indication: string;
  isNecessaryFor: string[];
}

interface Diagnosis {
  id: string;
  name: string;
  category: 'bleeding_disorder' | 'thrombotic_disorder' | 'platelet_disorder' | 'acquired_disorder';
  description: string;
  keyFeatures: string[];
  diagnosticCriteria: string[];
  treatment: string[];
  isCorrectFor: string[];
}

interface GameSession {
  totalPatients: number;
  currentPatientIndex: number;
  startingBudget: number;
  remainingBudget: number;
  hintsUsed: number;
  lifelinesUsed: number;
  eliminationsUsed: { tests: number; diagnoses: number; treatments: number };
  completedCases: number;
  totalScore: number;
}

const Level4 = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [gameStarted, setGameStarted] = useState(false);
  const [level4Complete, setLevel4Complete] = useState(false);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const [selectedTests, setSelectedTests] = useState<DiagnosticTest[]>([]);
  const [testResults, setTestResults] = useState<{[key: string]: any}>({});
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<Diagnosis | null>(null);
  const [selectedTreatments, setSelectedTreatments] = useState<Treatment[]>([]);
  const [revealedSections, setRevealedSections] = useState<{[key: string]: boolean}>({});
  const [eliminatedOptions, setEliminatedOptions] = useState<{
    tests: string[];
    diagnoses: string[];
    treatments: string[];
  }>({ tests: [], diagnoses: [], treatments: [] });
  
  const [gameSession, setGameSession] = useState<GameSession>({
    totalPatients: 5,
    currentPatientIndex: 0,
    startingBudget: 3500, // Calculated to be exactly enough for all 5 cases if played optimally
    remainingBudget: 3500,
    hintsUsed: 0,
    lifelinesUsed: 0,
    eliminationsUsed: { tests: 0, diagnoses: 0, treatments: 0 },
    completedCases: 0,
    totalScore: 0
  });

  const patients: Patient[] = [
    {
      id: '1',
      name: 'Sarah Mitchell',
      age: 28,
      weight: 65,
      gender: 'Female',
      chiefComplaint: 'Easy bruising and heavy menstrual periods',
      presentIllness: 'Patient reports increasing bruising over the past 6 months, particularly after minor trauma. Heavy menstrual bleeding requiring frequent pad changes.',
      pastMedicalHistory: ['No significant past medical history'],
      medications: ['Oral contraceptive pills'],
      allergies: ['NKDA'],
      familyHistory: 'Mother had bleeding problems during childbirth',
      socialHistory: 'Non-smoker, social drinker',
      symptoms: ['Easy bruising', 'Heavy menstrual bleeding', 'Bleeding gums', 'Nosebleeds'],
      physicalExam: {
        vitals: { bloodPressure: '118/76', heartRate: 88, temperature: 36.8, respiratoryRate: 16, oxygenSat: 99 },
        generalAppearance: 'Well-appearing female in no acute distress',
        skin: 'Multiple ecchymoses on arms and legs in various stages of healing',
        cardiovascular: 'Regular rate and rhythm, no murmurs',
        respiratory: 'Clear to auscultation bilaterally',
        abdomen: 'Soft, non-tender, no organomegaly',
        extremities: 'No edema, multiple bruises noted',
        neurological: 'Alert and oriented, no focal deficits'
      },
      labValues: { pt: 12.8, aptt: 54.2, inr: 1.1, plateletCount: 245000, hemoglobin: 10.2, hematocrit: 32.1, wbc: 6800, fibrinogen: 320, dDimer: 0.3 },
      correctDiagnosis: 'von Willebrand Disease Type 1',
      necessaryTests: ['bleeding_time', 'vwf_antigen', 'factor_viii'],
      necessaryTreatments: ['ddavp'],
      difficulty: 'medium'
    },
    {
      id: '2',
      name: 'Michael Chen',
      age: 12,
      weight: 45,
      gender: 'Male',
      chiefComplaint: 'Recurrent joint swelling and pain',
      presentIllness: 'Patient has history of spontaneous joint bleeds, particularly in knees and elbows. Recent episode after minor fall.',
      pastMedicalHistory: ['Hemophilia A', 'Previous joint bleeds'],
      medications: ['Factor VIII concentrate as needed'],
      allergies: ['NKDA'],
      familyHistory: 'X-linked inheritance, maternal grandfather had bleeding disorder',
      socialHistory: 'Active child, plays sports with precautions',
      symptoms: ['Joint swelling', 'Joint pain', 'Easy bruising', 'Muscle hematomas'],
      physicalExam: {
        vitals: { bloodPressure: '102/65', heartRate: 95, temperature: 36.5, respiratoryRate: 18, oxygenSat: 100 },
        generalAppearance: 'Well-developed male child in mild discomfort',
        skin: 'Multiple bruises of varying ages',
        cardiovascular: 'Regular rate and rhythm',
        respiratory: 'Clear bilaterally',
        abdomen: 'Soft, non-tender',
        extremities: 'Left knee swelling and warmth, limited range of motion',
        neurological: 'Alert and oriented'
      },
      labValues: { pt: 12.5, aptt: 85.3, inr: 1.0, plateletCount: 325000, hemoglobin: 11.8, hematocrit: 35.2, wbc: 7200, fibrinogen: 380, dDimer: 0.2, factorVIII: 2 },
      correctDiagnosis: 'Severe Hemophilia A',
      necessaryTests: ['factor_viii'],
      necessaryTreatments: ['factor_viii_concentrate'],
      difficulty: 'medium'
    },
    {
      id: '3',
      name: 'Robert Johnson',
      age: 72,
      weight: 82,
      gender: 'Male',
      chiefComplaint: 'Leg swelling and shortness of breath',
      presentIllness: 'Patient presents with 3-day history of left leg swelling, pain, and warmth. Associated with new onset shortness of breath.',
      pastMedicalHistory: ['Atrial fibrillation', 'Hypertension', 'Recent hip surgery'],
      medications: ['Metformin', 'Lisinopril', 'Metoprolol'],
      allergies: ['Penicillin'],
      familyHistory: 'Father died of heart attack at age 68',
      socialHistory: 'Former smoker (quit 5 years ago), sedentary lifestyle',
      symptoms: ['Leg swelling', 'Leg pain', 'Shortness of breath', 'Chest discomfort'],
      physicalExam: {
        vitals: { bloodPressure: '142/88', heartRate: 94, temperature: 37.1, respiratoryRate: 22, oxygenSat: 92 },
        generalAppearance: 'Elderly male in mild respiratory distress',
        skin: 'No rash or petechiae',
        cardiovascular: 'Irregular rhythm, no murmurs, elevated JVP',
        respiratory: 'Decreased breath sounds at bases',
        abdomen: 'Soft, non-tender',
        extremities: 'Left calf swelling, warmth, tenderness. Positive Wells score',
        neurological: 'Alert and oriented'
      },
      labValues: { pt: 13.5, aptt: 28.2, inr: 1.2, plateletCount: 380000, hemoglobin: 13.8, hematocrit: 41.2, wbc: 11200, fibrinogen: 450, dDimer: 2.8 },
      correctDiagnosis: 'DVT with Pulmonary Embolism',
      necessaryTests: ['duplex_ultrasound', 'ct_angiogram'],
      necessaryTreatments: ['rivaroxaban'],
      difficulty: 'hard'
    },
    {
      id: '4',
      name: 'Maria Rodriguez',
      age: 45,
      weight: 70,
      gender: 'Female',
      chiefComplaint: 'Bleeding from multiple sites and confusion',
      presentIllness: 'Patient developed sepsis following abdominal surgery. Now presents with bleeding from IV sites, petechiae, and altered mental status.',
      pastMedicalHistory: ['Recent abdominal surgery', 'Postoperative sepsis'],
      medications: ['Antibiotics', 'IV fluids', 'Pain medications'],
      allergies: ['NKDA'],
      familyHistory: 'Non-contributory',
      socialHistory: 'Non-smoker, occasional alcohol use',
      symptoms: ['Bleeding from puncture sites', 'Petechiae', 'Confusion', 'Oliguria'],
      physicalExam: {
        vitals: { bloodPressure: '85/50', heartRate: 125, temperature: 38.9, respiratoryRate: 28, oxygenSat: 88 },
        generalAppearance: 'Critically ill female, altered mental status',
        skin: 'Widespread petechiae and purpura, bleeding from IV sites',
        cardiovascular: 'Tachycardic, hypotensive',
        respiratory: 'Tachypneic, bilateral crackles',
        abdomen: 'Surgical incision with some oozing',
        extremities: 'Cool, mottled',
        neurological: 'Confused, oriented to person only'
      },
      labValues: { pt: 22.5, aptt: 65.8, inr: 2.8, plateletCount: 45000, hemoglobin: 7.2, hematocrit: 21.8, wbc: 18500, fibrinogen: 85, dDimer: 8.5 },
      correctDiagnosis: 'Disseminated Intravascular Coagulation (DIC)',
      necessaryTests: ['fibrin_degradation_products', 'antithrombin_iii'],
      necessaryTreatments: ['fresh_frozen_plasma', 'platelets'],
      difficulty: 'hard'
    },
    {
      id: '5',
      name: 'Emma Martinez',
      age: 8,
      weight: 28,
      gender: 'Female',
      chiefComplaint: 'Easy bruising and petechiae',
      presentIllness: 'Child developed widespread petechiae and bruising over past 2 weeks. No recent illness or medication changes.',
      pastMedicalHistory: ['Healthy child', 'Recent viral illness 3 weeks ago'],
      medications: ['None'],
      allergies: ['NKDA'],
      familyHistory: 'No autoimmune disorders in family',
      socialHistory: 'Active child, attends school regularly',
      symptoms: ['Easy bruising', 'Petechiae', 'Epistaxis', 'No fever'],
      physicalExam: {
        vitals: { bloodPressure: '95/60', heartRate: 100, temperature: 36.5, respiratoryRate: 20, oxygenSat: 100 },
        generalAppearance: 'Well-appearing child, playful',
        skin: 'Widespread petechiae and purpura, no pallor',
        cardiovascular: 'Regular rate and rhythm',
        respiratory: 'Clear bilaterally',
        abdomen: 'Soft, no splenomegaly',
        extremities: 'Multiple bruises of varying ages',
        neurological: 'Alert and oriented'
      },
      labValues: { pt: 12.0, aptt: 28.5, inr: 1.0, plateletCount: 8000, hemoglobin: 11.8, hematocrit: 35.2, wbc: 6500, fibrinogen: 320, dDimer: 0.2 },
      correctDiagnosis: 'Immune Thrombocytopenic Purpura (ITP)',
      necessaryTests: ['bleeding_time'],
      necessaryTreatments: ['prednisone'],
      difficulty: 'medium'
    }
  ];

  const availableTests: DiagnosticTest[] = [
    {
      id: 'bleeding_time',
      name: 'Bleeding Time',
      category: 'basic',
      cost: 150,
      timeToResult: 30,
      description: 'Measures primary hemostasis and platelet function',
      indication: 'Suspected platelet dysfunction or von Willebrand disease',
      normalRange: '2-7 minutes',
      isNecessaryFor: ['1', '5']
    },
    {
      id: 'factor_viii',
      name: 'Factor VIII Activity',
      category: 'specialized',
      cost: 300,
      timeToResult: 120,
      description: 'Measures Factor VIII clotting activity',
      indication: 'Suspected Hemophilia A or von Willebrand disease',
      normalRange: '50-150%',
      isNecessaryFor: ['1', '2']
    },
    {
      id: 'vwf_antigen',
      name: 'von Willebrand Factor Antigen',
      category: 'specialized',
      cost: 250,
      timeToResult: 180,
      description: 'Quantitative measurement of vWF protein',
      indication: 'Suspected von Willebrand disease',
      normalRange: '60-140%',
      isNecessaryFor: ['1']
    },
    {
      id: 'duplex_ultrasound',
      name: 'Venous Duplex Ultrasound',
      category: 'imaging',
      cost: 400,
      timeToResult: 60,
      description: 'Non-invasive imaging to detect deep vein thrombosis',
      indication: 'Suspected DVT',
      normalRange: 'No evidence of thrombosis',
      isNecessaryFor: ['3']
    },
    {
      id: 'ct_angiogram',
      name: 'CT Pulmonary Angiogram',
      category: 'imaging',
      cost: 800,
      timeToResult: 90,
      description: 'Imaging to detect pulmonary embolism',
      indication: 'Suspected pulmonary embolism',
      normalRange: 'No filling defects',
      isNecessaryFor: ['3']
    },
    {
      id: 'fibrin_degradation_products',
      name: 'Fibrin Degradation Products',
      category: 'specialized',
      cost: 200,
      timeToResult: 45,
      description: 'Measures breakdown products of fibrin',
      indication: 'Suspected DIC or excessive fibrinolysis',
      normalRange: '<10 mg/L',
      isNecessaryFor: ['4']
    },
    {
      id: 'antithrombin_iii',
      name: 'Antithrombin III',
      category: 'specialized',
      cost: 180,
      timeToResult: 120,
      description: 'Natural anticoagulant protein',
      indication: 'Thrombophilia screening or DIC',
      normalRange: '80-120%',
      isNecessaryFor: ['4']
    },
    // Unnecessary tests to create challenge
    {
      id: 'protein_c',
      name: 'Protein C Activity',
      category: 'specialized',
      cost: 200,
      timeToResult: 120,
      description: 'Natural anticoagulant assessment',
      indication: 'Thrombophilia screening',
      normalRange: '70-130%',
      isNecessaryFor: []
    },
    {
      id: 'lupus_anticoagulant',
      name: 'Lupus Anticoagulant',
      category: 'specialized',
      cost: 180,
      timeToResult: 180,
      description: 'Antiphospholipid syndrome screening',
      indication: 'Recurrent thrombosis',
      normalRange: 'Negative',
      isNecessaryFor: []
    }
  ];

  const availableTreatments: Treatment[] = [
    {
      id: 'ddavp',
      name: 'DDAVP (Desmopressin)',
      type: 'hemostatic',
      mechanism: 'Releases vWF and Factor VIII from storage sites',
      dosage: '0.3 mcg/kg IV or 300 mcg intranasal',
      contraindications: ['Type 2B vWD', 'Severe cardiovascular disease', 'Hyponatremia'],
      sideEffects: ['Hyponatremia', 'Headache', 'Facial flushing'],
      monitoring: ['Sodium levels', 'Fluid balance', 'Bleeding assessment'],
      cost: 200,
      indication: 'Mild bleeding disorders, vWD Type 1',
      isNecessaryFor: ['1']
    },
    {
      id: 'factor_viii_concentrate',
      name: 'Factor VIII Concentrate',
      type: 'blood_product',
      mechanism: 'Direct factor replacement',
      dosage: '25-50 units/kg for bleeding episodes',
      contraindications: ['Known inhibitors (relative)'],
      sideEffects: ['Allergic reactions', 'Inhibitor development', 'Thrombosis'],
      monitoring: ['Factor VIII levels', 'Inhibitor screen', 'Clinical response'],
      cost: 800,
      indication: 'Hemophilia A, severe bleeding',
      isNecessaryFor: ['2']
    },
    {
      id: 'rivaroxaban',
      name: 'Rivaroxaban',
      type: 'anticoagulant',
      mechanism: 'Direct Factor Xa inhibitor',
      dosage: '15mg BID x 21 days, then 20mg daily',
      contraindications: ['Active bleeding', 'Severe renal impairment', 'Pregnancy'],
      sideEffects: ['Bleeding', 'GI upset', 'Fatigue'],
      monitoring: ['CBC', 'Renal function', 'Bleeding assessment'],
      cost: 400,
      indication: 'DVT/PE treatment and prevention',
      isNecessaryFor: ['3']
    },
    {
      id: 'fresh_frozen_plasma',
      name: 'Fresh Frozen Plasma',
      type: 'blood_product',
      mechanism: 'Replaces coagulation factors',
      dosage: '10-15 mL/kg',
      contraindications: ['Volume overload', 'IgA deficiency'],
      sideEffects: ['Transfusion reactions', 'Volume overload', 'Infection risk'],
      monitoring: ['Coagulation studies', 'Vital signs', 'Transfusion reactions'],
      cost: 500,
      indication: 'Multiple factor deficiencies, DIC',
      isNecessaryFor: ['4']
    },
    {
      id: 'platelets',
      name: 'Platelet Transfusion',
      type: 'blood_product',
      mechanism: 'Replaces platelets for hemostasis',
      dosage: '1 unit per 10kg body weight',
      contraindications: ['TTP', 'HIT', 'Unnecessary transfusion'],
      sideEffects: ['Transfusion reactions', 'Alloimmunization', 'Infection risk'],
      monitoring: ['Platelet count', 'Bleeding assessment', 'Transfusion reactions'],
      cost: 600,
      indication: 'Severe thrombocytopenia with bleeding',
      isNecessaryFor: ['4']
    },
    {
      id: 'prednisone',
      name: 'Prednisone',
      type: 'hemostatic',
      mechanism: 'Immunosuppression for ITP',
      dosage: '1mg/kg/day for children, 1mg/kg/day for adults',
      contraindications: ['Active infection', 'Live vaccines'],
      sideEffects: ['Hyperglycemia', 'Hypertension', 'Growth suppression'],
      monitoring: ['Platelet count', 'Blood glucose', 'Blood pressure'],
      cost: 50,
      indication: 'Immune thrombocytopenic purpura',
      isNecessaryFor: ['5']
    },
    // Unnecessary treatments
    {
      id: 'warfarin',
      name: 'Warfarin',
      type: 'anticoagulant',
      mechanism: 'Vitamin K antagonist',
      dosage: '2-10mg daily based on INR',
      contraindications: ['Pregnancy', 'Active bleeding'],
      sideEffects: ['Bleeding', 'Skin necrosis', 'Teratogenicity'],
      monitoring: ['INR', 'PT', 'Bleeding assessment'],
      cost: 30,
      indication: 'Long-term anticoagulation',
      isNecessaryFor: []
    }
  ];

  const availableDiagnoses: Diagnosis[] = [
    {
      id: 'vwd_type1',
      name: 'von Willebrand Disease Type 1',
      category: 'bleeding_disorder',
      description: 'Mild bleeding disorder due to quantitative vWF deficiency',
      keyFeatures: ['Mucocutaneous bleeding', 'Family history', 'Prolonged aPTT', 'Low vWF levels'],
      diagnosticCriteria: ['vWF antigen <50%', 'vWF activity <50%', 'Bleeding symptoms'],
      treatment: ['DDAVP', 'Tranexamic acid', 'vWF concentrates'],
      isCorrectFor: ['1']
    },
    {
      id: 'hemophilia_a',
      name: 'Hemophilia A',
      category: 'bleeding_disorder',
      description: 'X-linked bleeding disorder due to Factor VIII deficiency',
      keyFeatures: ['Joint bleeding', 'Muscle hematomas', 'Prolonged aPTT', 'Family history'],
      diagnosticCriteria: ['Factor VIII <50%', 'Prolonged aPTT', 'Normal PT and platelets'],
      treatment: ['Factor VIII concentrates', 'DDAVP', 'Antifibrinolytics'],
      isCorrectFor: ['2']
    },
    {
      id: 'dic',
      name: 'Disseminated Intravascular Coagulation',
      category: 'acquired_disorder',
      description: 'Systemic activation of coagulation with consumption of factors',
      keyFeatures: ['Bleeding and thrombosis', 'Low platelets', 'Low fibrinogen', 'High D-dimer'],
      diagnosticCriteria: ['Low platelets', 'Prolonged PT/aPTT', 'Low fibrinogen', 'High D-dimer'],
      treatment: ['Treat underlying cause', 'Fresh frozen plasma', 'Platelets', 'Supportive care'],
      isCorrectFor: ['4']
    },
    {
      id: 'itp',
      name: 'Immune Thrombocytopenic Purpura',
      category: 'platelet_disorder',
      description: 'Autoimmune destruction of platelets',
      keyFeatures: ['Isolated thrombocytopenia', 'Mucocutaneous bleeding', 'Normal bone marrow'],
      diagnosticCriteria: ['Platelet count <100,000', 'Normal PT/aPTT', 'Exclusion of other causes'],
      treatment: ['Corticosteroids', 'IVIG', 'Platelet transfusion if bleeding'],
      isCorrectFor: ['5']
    },
    {
      id: 'dvt_pe',
      name: 'Deep Vein Thrombosis with Pulmonary Embolism',
      category: 'thrombotic_disorder',
      description: 'Venous thromboembolism with pulmonary complications',
      keyFeatures: ['Leg swelling', 'Shortness of breath', 'Elevated D-dimer', 'Imaging confirmation'],
      diagnosticCriteria: ['Duplex ultrasound positive', 'CT angiogram positive', 'Clinical probability'],
      treatment: ['Anticoagulation', 'Thrombolysis', 'Supportive care'],
      isCorrectFor: ['3']
    },
    // Wrong diagnoses
    {
      id: 'antiphospholipid_syndrome',
      name: 'Antiphospholipid Syndrome',
      category: 'thrombotic_disorder',
      description: 'Autoimmune disorder causing thrombosis',
      keyFeatures: ['Recurrent thrombosis', 'Pregnancy complications', 'Positive antibodies'],
      diagnosticCriteria: ['Clinical criteria', 'Laboratory criteria', 'Positive antibodies'],
      treatment: ['Anticoagulation', 'Low-dose aspirin'],
      isCorrectFor: []
    }
  ];

  const startGame = () => {
    setGameStarted(true);
    setCurrentPatient(patients[0]);
    setGameSession(prev => ({ ...prev, currentPatientIndex: 0 }));
    toast({
      title: "🩺 Financial Logic Challenge Started!",
      description: `You have ${gameSession.startingBudget} QUID to diagnose and treat ${gameSession.totalPatients} patients. Spend wisely!`,
    });
  };

  const useHint = () => {
    if (gameSession.hintsUsed >= 1) {
      toast({
        title: "Hint Already Used! 💡",
        description: "You can only use one hint per game session.",
        variant: "destructive",
      });
      return;
    }

    if (!currentPatient) return;

    const necessaryTest = availableTests.find(test => 
      currentPatient.necessaryTests.includes(test.id) && 
      !selectedTests.some(t => t.id === test.id)
    );

    if (necessaryTest) {
      toast({
        title: "💡 Hint Used!",
        description: `Consider ordering: ${necessaryTest.name} - ${necessaryTest.indication}`,
      });
    } else {
      toast({
        title: "💡 Hint Used!",
        description: `You've ordered the necessary tests. Focus on the correct diagnosis: ${currentPatient.correctDiagnosis}`,
      });
    }

    setGameSession(prev => ({ ...prev, hintsUsed: prev.hintsUsed + 1 }));
  };

  const useLifeline = () => {
    if (gameSession.lifelinesUsed >= 1) {
      toast({
        title: "Lifeline Already Used! 💰",
        description: "You can only use one lifeline per game session.",
        variant: "destructive",
      });
      return;
    }

    setGameSession(prev => ({ 
      ...prev, 
      lifelinesUsed: prev.lifelinesUsed + 1,
      remainingBudget: prev.remainingBudget + 500
    }));

    toast({
      title: "💰 Lifeline Used!",
      description: "You received 500 QUID emergency funding!",
    });
  };

  const eliminateWrongOption = (type: 'tests' | 'diagnoses' | 'treatments') => {
    if (gameSession.eliminationsUsed[type] >= 1) {
      toast({
        title: "Elimination Already Used! ❌",
        description: `You can only eliminate one wrong ${type.slice(0, -1)} per game session.`,
        variant: "destructive",
      });
      return;
    }

    if (!currentPatient) return;

    let wrongOptions: string[] = [];
    
    if (type === 'tests') {
      wrongOptions = availableTests
        .filter(test => !currentPatient.necessaryTests.includes(test.id))
        .map(test => test.id);
    } else if (type === 'diagnoses') {
      wrongOptions = availableDiagnoses
        .filter(diagnosis => !diagnosis.isCorrectFor.includes(currentPatient.id))
        .map(diagnosis => diagnosis.id);
    } else if (type === 'treatments') {
      wrongOptions = availableTreatments
        .filter(treatment => !currentPatient.necessaryTreatments.includes(treatment.id))
        .map(treatment => treatment.id);
    }

    if (wrongOptions.length > 0) {
      const randomWrongOption = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
      setEliminatedOptions(prev => ({
        ...prev,
        [type]: [...prev[type], randomWrongOption]
      }));

      setGameSession(prev => ({
        ...prev,
        eliminationsUsed: {
          ...prev.eliminationsUsed,
          [type]: prev.eliminationsUsed[type] + 1
        }
      }));

      toast({
        title: "❌ Wrong Option Eliminated!",
        description: `One incorrect ${type.slice(0, -1)} has been eliminated.`,
      });
    }
  };

  const orderTest = (test: DiagnosticTest) => {
    if (gameSession.remainingBudget < test.cost) {
      toast({
        title: "Insufficient Funds! 💰",
        description: `You need ${test.cost} QUID but only have ${gameSession.remainingBudget} QUID.`,
        variant: "destructive",
      });
      return;
    }

    if (selectedTests.find(t => t.id === test.id)) {
      toast({
        title: "Test Already Ordered",
        description: `${test.name} has already been ordered.`,
        variant: "destructive",
      });
      return;
    }

    setSelectedTests(prev => [...prev, test]);
    setGameSession(prev => ({ 
      ...prev, 
      remainingBudget: prev.remainingBudget - test.cost,
      totalScore: currentPatient?.necessaryTests.includes(test.id) ? 
        prev.totalScore + 100 : prev.totalScore - 50
    }));
    
    const isNecessary = currentPatient?.necessaryTests.includes(test.id);
    toast({
      title: isNecessary ? "Correct Test Ordered! ✅" : "Unnecessary Test! ⚠️",
      description: `${test.name} ordered. Cost: ${test.cost} QUID. ${isNecessary ? '+100 points' : '-50 points'}`,
      variant: isNecessary ? "default" : "destructive"
    });

    setTimeout(() => {
      const result = generateTestResults(test, currentPatient);
      setTestResults(prev => ({ ...prev, [test.id]: result }));
      toast({
        title: "Results Available! 📊",
        description: `${test.name} results are ready for interpretation.`,
      });
    }, test.timeToResult * 10);
  };

  const generateTestResults = (test: DiagnosticTest, patient: Patient | null) => {
    if (!patient) return null;

    const resultsByPatient: { [key: string]: { [key: string]: string } } = {
      '1': {
        'bleeding_time': '12 minutes (prolonged)',
        'vwf_antigen': '28% (low)',
        'factor_viii': '45% (low)'
      },
      '2': {
        'factor_viii': '2% (critically low)',
        'bleeding_time': '4 minutes (normal)'
      },
      '3': {
        'duplex_ultrasound': 'Extensive DVT in left femoral and popliteal veins',
        'ct_angiogram': 'Bilateral subsegmental pulmonary emboli'
      },
      '4': {
        'fibrin_degradation_products': '45 mg/L (critically high)',
        'antithrombin_iii': '35% (low)'
      },
      '5': {
        'bleeding_time': '15 minutes (prolonged)'
      }
    };

    return resultsByPatient[patient.id]?.[test.id] || 'Normal';
  };

  const selectDiagnosis = (diagnosis: Diagnosis) => {
    if (!currentPatient) return;
    
    setSelectedDiagnosis(diagnosis);
    const isCorrect = diagnosis.isCorrectFor.includes(currentPatient.id);
    
    setGameSession(prev => ({ 
      ...prev, 
      totalScore: isCorrect ? prev.totalScore + 200 : prev.totalScore - 100
    }));
    
    toast({
      title: isCorrect ? "Correct Diagnosis! 🎯" : "Incorrect Diagnosis! ❌",
      description: `${diagnosis.name} selected. ${isCorrect ? '+200 points' : '-100 points'}`,
      variant: isCorrect ? "default" : "destructive"
    });
  };

  const selectTreatment = (treatment: Treatment) => {
    if (!currentPatient) return;

    if (gameSession.remainingBudget < treatment.cost) {
      toast({
        title: "Insufficient Funds! 💰",
        description: `You need ${treatment.cost} QUID but only have ${gameSession.remainingBudget} QUID.`,
        variant: "destructive",
      });
      return;
    }

    if (selectedTreatments.find(t => t.id === treatment.id)) {
      toast({
        title: "Treatment Already Selected",
        description: `${treatment.name} has already been added to treatment plan.`,
        variant: "destructive",
      });
      return;
    }

    setSelectedTreatments(prev => [...prev, treatment]);
    const isNecessary = currentPatient.necessaryTreatments.includes(treatment.id);
    
    setGameSession(prev => ({ 
      ...prev, 
      remainingBudget: prev.remainingBudget - treatment.cost,
      totalScore: isNecessary ? prev.totalScore + 150 : prev.totalScore - 75
    }));
    
    toast({
      title: isNecessary ? "Correct Treatment! 💊" : "Unnecessary Treatment! ⚠️",
      description: `${treatment.name} selected. Cost: ${treatment.cost} QUID. ${isNecessary ? '+150 points' : '-75 points'}`,
      variant: isNecessary ? "default" : "destructive"
    });
  };

  const nextCase = () => {
    const nextIndex = gameSession.currentPatientIndex + 1;
    
    if (nextIndex >= patients.length) {
      // Game completed
      setLevel4Complete(true);
      setShowCompletionDialog(true);
      return;
    }

    setCurrentPatient(patients[nextIndex]);
    setGameSession(prev => ({ 
      ...prev, 
      currentPatientIndex: nextIndex,
      completedCases: prev.completedCases + 1
    }));
    
    // Reset case-specific states
    setSelectedTests([]);
    setTestResults({});
    setSelectedDiagnosis(null);
    setSelectedTreatments([]);
    setRevealedSections({});
    
    toast({
      title: "New Case Study! 📋",
      description: `Now treating ${patients[nextIndex].name}. Case ${nextIndex + 1} of ${gameSession.totalPatients}`,
    });
  };

  const toggleSection = (section: string) => {
    setRevealedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const resetLevel = () => {
    setGameStarted(false);
    setLevel4Complete(false);
    setShowCompletionDialog(false);
    setCurrentPatient(null);
    setSelectedTests([]);
    setTestResults({});
    setSelectedDiagnosis(null);
    setSelectedTreatments([]);
    setRevealedSections({});
    setEliminatedOptions({ tests: [], diagnoses: [], treatments: [] });
    setGameSession({
      totalPatients: 5,
      currentPatientIndex: 0,
      startingBudget: 3500,
      remainingBudget: 3500,
      hintsUsed: 0,
      lifelinesUsed: 0,
      eliminationsUsed: { tests: 0, diagnoses: 0, treatments: 0 },
      completedCases: 0,
      totalScore: 0
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-green-900 p-4 pb-20">
      <div className="container mx-auto">
        <Link to="/" className="inline-flex items-center mb-4 text-blue-300 hover:text-blue-100">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        {/* Header */}
        <GlassmorphicCard intensity="heavy" color="purple" className="p-6 mb-6">
          <div className="flex flex-col lg:flex-row items-center justify-between text-white gap-4">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Level 4: Diagnosis & Treatment Tactician: Financial Logic Challenge
              </h1>
              <p className="text-purple-200 text-base lg:text-lg">Master resource management in medical diagnosis & Treatment</p>
            </div>
            <div className="flex items-center space-x-4 lg:space-x-8">
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-yellow-400">{gameSession.totalScore}</div>
                <div className="text-sm text-gray-300">Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-green-400">{gameSession.remainingBudget}</div>
                <div className="text-sm text-gray-300">QUID</div>
              </div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-blue-400">
                  {gameSession.currentPatientIndex + 1}/{gameSession.totalPatients}
                </div>
                <div className="text-sm text-gray-300">Cases</div>
              </div>
            </div>
          </div>
        </GlassmorphicCard>

        {!gameStarted ? (
          <div className="text-center">
            <GlassmorphicCard intensity="medium" className="p-12">
              <Calculator className="h-24 w-24 text-purple-400 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-4">Diagnosis & Treatment Tactician: Financial Logic Challenge</h2>
              <p className="text-white/70 mb-8 text-lg">
                You have exactly 3500 QUID to diagnose and treat 5 patients. Choose wisely - unnecessary tests and treatments will drain your budget!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-blue-500/20 p-4 rounded-lg backdrop-blur-sm">
                  <Lightbulb className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                  <h3 className="text-white font-bold">Hint</h3>
                  <p className="text-white/70 text-sm">Get a clue about necessary tests (1x per game)</p>
                </div>
                <div className="bg-green-500/20 p-4 rounded-lg backdrop-blur-sm">
                  <DollarSign className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <h3 className="text-white font-bold">Lifeline</h3>
                  <p className="text-white/70 text-sm">Emergency 500 QUID funding (1x per game)</p>
                </div>
                <div className="bg-red-500/20 p-4 rounded-lg backdrop-blur-sm">
                  <X className="h-8 w-8 text-red-400 mx-auto mb-2" />
                  <h3 className="text-white font-bold">Eliminate</h3>
                  <p className="text-white/70 text-sm">Remove wrong options (1x per category)</p>
                </div>
              </div>
              <Button onClick={startGame} size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg transform hover:scale-105 transition-all duration-200">
                <Play className="h-6 w-6 mr-3" />
                Start Challenge
              </Button>
            </GlassmorphicCard>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Game Controls */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                onClick={useHint}
                disabled={gameSession.hintsUsed >= 1}
                className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 transform hover:scale-105 transition-all duration-200"
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                Hint ({1 - gameSession.hintsUsed} left)
              </Button>
              
              <Button 
                onClick={useLifeline}
                disabled={gameSession.lifelinesUsed >= 1}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 transform hover:scale-105 transition-all duration-200"
              >
                <Zap className="h-4 w-4 mr-2" />
                Lifeline 500 QUID ({1 - gameSession.lifelinesUsed} left)
              </Button>
              
              <Button 
                onClick={() => eliminateWrongOption('tests')}
                disabled={gameSession.eliminationsUsed.tests >= 1}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 transform hover:scale-105 transition-all duration-200"
              >
                <X className="h-4 w-4 mr-2" />
                Eliminate Test ({1 - gameSession.eliminationsUsed.tests} left)
              </Button>
              
              <Button 
                onClick={() => eliminateWrongOption('diagnoses')}
                disabled={gameSession.eliminationsUsed.diagnoses >= 1}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 transform hover:scale-105 transition-all duration-200"
              >
                <X className="h-4 w-4 mr-2" />
                Eliminate Diagnosis ({1 - gameSession.eliminationsUsed.diagnoses} left)
              </Button>
              
              <Button 
                onClick={() => eliminateWrongOption('treatments')}
                disabled={gameSession.eliminationsUsed.treatments >= 1}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 transform hover:scale-105 transition-all duration-200"
              >
                <X className="h-4 w-4 mr-2" />
                Eliminate Treatment ({1 - gameSession.eliminationsUsed.treatments} left)
              </Button>
            </div>

            {/* Control Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                onClick={() => setShowExitDialog(true)}
                className="bg-red-600 hover:bg-red-700 transform hover:scale-105 transition-all duration-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Exit Game
              </Button>
              
              <Button 
                onClick={nextCase}
                className="bg-blue-600 hover:bg-blue-700 transform hover:scale-105 transition-all duration-200"
              >
                <FileText className="h-4 w-4 mr-2" />
                Next Case Study
              </Button>
              
              <Button 
                onClick={nextCase}
                className={`transform hover:scale-105 transition-all duration-200 ${
                  selectedDiagnosis && selectedTreatments.length > 0
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-gray-600 cursor-not-allowed'
                }`}
                disabled={!selectedDiagnosis || selectedTreatments.length === 0}
              >
                <Home className="h-4 w-4 mr-2" />
                Discharge Patient Home
              </Button>
            </div>

            {currentPatient && (
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Patient Information */}
                <GlassmorphicCard intensity="medium" color="blue" className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-white">
                      Patient: {currentPatient.name}
                    </h3>
                    <Badge 
                      className={`${
                        currentPatient.difficulty === 'easy' ? 'bg-green-600' :
                        currentPatient.difficulty === 'medium' ? 'bg-yellow-600' :
                        'bg-red-600'
                      }`}
                    >
                      {currentPatient.difficulty.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="space-y-4 text-white">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p><strong>Age:</strong> {currentPatient.age} years</p>
                        <p><strong>Gender:</strong> {currentPatient.gender}</p>
                        <p><strong>Weight:</strong> {currentPatient.weight} kg</p>
                      </div>
                      <div>
                        <p><strong>BP:</strong> {currentPatient.physicalExam.vitals.bloodPressure}</p>
                        <p><strong>HR:</strong> {currentPatient.physicalExam.vitals.heartRate} bpm</p>
                        <p><strong>O2Sat:</strong> {currentPatient.physicalExam.vitals.oxygenSat}%</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-bold text-blue-300 mb-2">Chief Complaint</h4>
                      <p className="text-white/80">{currentPatient.chiefComplaint}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-bold text-green-300 mb-2">Present Illness</h4>
                      <p className="text-white/80 text-sm">{currentPatient.presentIllness}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-bold text-yellow-300 mb-2">Laboratory Values</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <p>PT: {currentPatient.labValues.pt}s</p>
                        <p>aPTT: {currentPatient.labValues.aptt}s</p>
                        <p>INR: {currentPatient.labValues.inr}</p>
                        <p>Platelets: {currentPatient.labValues.plateletCount.toLocaleString()}</p>
                        <p>Hgb: {currentPatient.labValues.hemoglobin} g/dL</p>
                        <p>D-dimer: {currentPatient.labValues.dDimer} mg/L</p>
                      </div>
                    </div>
                  </div>
                </GlassmorphicCard>

                {/* Interactive Sections */}
                <div className="space-y-4">
                  {/* Diagnostic Tests */}
                  <GlassmorphicCard intensity="medium" color="green" className="p-4">
                    <Button
                      onClick={() => toggleSection('tests')}
                      className="w-full flex justify-between items-center bg-transparent hover:bg-white/10 text-white border-none p-4 group transform hover:scale-105 transition-all duration-200"
                    >
                      <div className="flex items-center">
                        <Microscope className="h-5 w-5 mr-2 text-green-400 group-hover:text-green-300" />
                        <span className="text-lg font-bold">Diagnostic Tests</span>
                      </div>
                      {revealedSections['tests'] ? (
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-2" />
                          <ChevronDown className="h-4 w-4" />
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <EyeOff className="h-4 w-4 mr-2" />
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      )}
                    </Button>
                    
                    {revealedSections['tests'] && (
                      <div className="mt-4 space-y-3">
                        {availableTests
                          .filter(test => !eliminatedOptions.tests.includes(test.id))
                          .map((test) => (
                          <div key={test.id} className="bg-white/5 p-3 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-200">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="text-white font-bold text-sm">{test.name}</h4>
                              <Badge className="bg-green-600 text-xs">{test.cost} QUID</Badge>
                            </div>
                            <p className="text-white/70 text-xs mb-2">{test.description}</p>
                            <Button
                              size="sm"
                              onClick={() => orderTest(test)}
                              disabled={selectedTests.some(t => t.id === test.id)}
                              className="bg-green-600 hover:bg-green-700 text-xs transform hover:scale-105 transition-all duration-200"
                            >
                              {selectedTests.some(t => t.id === test.id) ? 'Ordered' : 'Order Test'}
                            </Button>
                            {testResults[test.id] && (
                              <div className="mt-2 p-2 bg-blue-600/20 rounded border border-blue-400/30">
                                <p className="text-xs text-blue-300 font-bold">Result:</p>
                                <p className="text-xs text-white">{testResults[test.id]}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </GlassmorphicCard>

                  {/* Differential Diagnosis */}
                  <GlassmorphicCard intensity="medium" color="purple" className="p-4">
                    <Button
                      onClick={() => toggleSection('diagnosis')}
                      className="w-full flex justify-between items-center bg-transparent hover:bg-white/10 text-white border-none p-4 group transform hover:scale-105 transition-all duration-200"
                    >
                      <div className="flex items-center">
                        <Brain className="h-5 w-5 mr-2 text-purple-400 group-hover:text-purple-300" />
                        <span className="text-lg font-bold">Differential Diagnosis</span>
                      </div>
                      {revealedSections['diagnosis'] ? (
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-2" />
                          <ChevronDown className="h-4 w-4" />
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <EyeOff className="h-4 w-4 mr-2" />
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      )}
                    </Button>
                    
                    {revealedSections['diagnosis'] && (
                      <div className="mt-4 space-y-3">
                        {availableDiagnoses
                          .filter(diagnosis => !eliminatedOptions.diagnoses.includes(diagnosis.id))
                          .map((diagnosis) => (
                          <div 
                            key={diagnosis.id} 
                            className={`bg-white/5 p-3 rounded-lg border border-white/10 cursor-pointer hover:bg-white/10 transition-all duration-200 transform hover:scale-105 ${
                              selectedDiagnosis?.id === diagnosis.id ? 'ring-2 ring-purple-400' : ''
                            }`}
                            onClick={() => selectDiagnosis(diagnosis)}
                          >
                            <h4 className="text-white font-bold text-sm mb-1">{diagnosis.name}</h4>
                            <p className="text-white/70 text-xs">{diagnosis.description}</p>
                            {selectedDiagnosis?.id === diagnosis.id && (
                              <Badge className="mt-2 bg-purple-600 text-xs">Selected</Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </GlassmorphicCard>

                  {/* Treatment Options */}
                  <GlassmorphicCard intensity="medium" color="red" className="p-4">
                    <Button
                      onClick={() => toggleSection('treatment')}
                      className="w-full flex justify-between items-center bg-transparent hover:bg-white/10 text-white border-none p-4 group transform hover:scale-105 transition-all duration-200"
                    >
                      <div className="flex items-center">
                        <Pill className="h-5 w-5 mr-2 text-red-400 group-hover:text-red-300" />
                        <span className="text-lg font-bold">Treatment Options</span>
                      </div>
                      {revealedSections['treatment'] ? (
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-2" />
                          <ChevronDown className="h-4 w-4" />
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <EyeOff className="h-4 w-4 mr-2" />
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      )}
                    </Button>
                    
                    {revealedSections['treatment'] && (
                      <div className="mt-4 space-y-3">
                        {availableTreatments
                          .filter(treatment => !eliminatedOptions.treatments.includes(treatment.id))
                          .map((treatment) => (
                          <div key={treatment.id} className="bg-white/5 p-3 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-200">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="text-white font-bold text-sm">{treatment.name}</h4>
                              <Badge className="bg-red-600 text-xs">{treatment.cost} QUID</Badge>
                            </div>
                            <p className="text-white/70 text-xs mb-2">{treatment.mechanism}</p>
                            <Button
                              size="sm"
                              onClick={() => selectTreatment(treatment)}
                              disabled={selectedTreatments.some(t => t.id === treatment.id)}
                              className="bg-red-600 hover:bg-red-700 text-xs transform hover:scale-105 transition-all duration-200"
                            >
                              {selectedTreatments.some(t => t.id === treatment.id) ? 'Selected' : 'Select Treatment'}
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </GlassmorphicCard>
                </div>
              </div>
            )}
          </div>
        )}
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

      {/* Completion Dialog */}
      <AlertDialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-2xl font-bold text-blue-600">
              🏆 Challenge Complete! 🏆
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-lg">
              Excellent financial management! You've successfully completed the diagnostic challenge!
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{gameSession.totalScore}</div>
                <div className="text-sm text-gray-600">Final Score</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{gameSession.remainingBudget}</div>
                <div className="text-sm text-gray-600">QUID Remaining</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{gameSession.completedCases}</div>
                <div className="text-sm text-gray-600">Cases Completed</div>
              </div>
            </div>
          </div>

          <AlertDialogFooter className="flex justify-center space-x-4">
            <AlertDialogAction 
              onClick={resetLevel}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Play Again
            </AlertDialogAction>
            <AlertDialogCancel 
              onClick={() => navigate('/')}
            >
              <Home className="h-4 w-4 mr-2" />
              Main Menu
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Level4;
