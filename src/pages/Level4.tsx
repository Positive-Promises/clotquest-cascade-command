
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft, 
  Play, 
  RotateCcw, 
  Stethoscope,
  Pill,
  Syringe,
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
  UserCheck,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff
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
  diagnosis: string;
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
}

interface Diagnosis {
  id: string;
  name: string;
  category: 'bleeding_disorder' | 'thrombotic_disorder' | 'platelet_disorder' | 'acquired_disorder';
  description: string;
  keyFeatures: string[];
  diagnosticCriteria: string[];
  treatment: string[];
}

const Level4 = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [level4Complete, setLevel4Complete] = useState(false);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const [currentPatientIndex, setCurrentPatientIndex] = useState(0);
  const [selectedTests, setSelectedTests] = useState<DiagnosticTest[]>([]);
  const [testResults, setTestResults] = useState<{[key: string]: any}>({});
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<Diagnosis | null>(null);
  const [selectedTreatments, setSelectedTreatments] = useState<Treatment[]>([]);
  const [patientResponse, setPatientResponse] = useState<string>('stable');
  const [gamePhase, setGamePhase] = useState<'assessment' | 'testing' | 'diagnosis' | 'treatment' | 'monitoring'>('assessment');
  const [revealedSections, setRevealedSections] = useState<{[key: string]: boolean}>({});
  const [currency, setCurrency] = useState(2000);
  const [treatmentCompleted, setTreatmentCompleted] = useState(false);

  const patients: Patient[] = [
    // 1. von Willebrand Disease
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
      labValues: { pt: 12.8, aptt: 45.2, inr: 1.1, plateletCount: 245000, hemoglobin: 10.2, hematocrit: 32.1, wbc: 6800, fibrinogen: 320, dDimer: 0.3 },
      diagnosis: 'von Willebrand Disease Type 1',
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
      diagnosis: 'Severe Hemophilia A',
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
      diagnosis: 'DVT with Pulmonary Embolism',
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
      diagnosis: 'Disseminated Intravascular Coagulation (DIC)',
      difficulty: 'hard'
    },

    {
      id: '5',
      name: 'David Williams',
      age: 68,
      weight: 78,
      gender: 'Male',
      chiefComplaint: 'Sudden onset left-sided weakness and speech difficulty',
      presentIllness: 'Patient developed acute onset left hemiparesis and aphasia 2 hours ago. No head trauma. Currently on warfarin for atrial fibrillation.',
      pastMedicalHistory: ['Atrial fibrillation', 'Hypertension', 'Diabetes mellitus'],
      medications: ['Warfarin 5mg daily', 'Metformin', 'Lisinopril'],
      allergies: ['Sulfa drugs'],
      familyHistory: 'Mother had stroke at age 75',
      socialHistory: 'Retired, lives with spouse',
      symptoms: ['Left-sided weakness', 'Speech difficulty', 'Facial droop'],
      physicalExam: {
        vitals: { bloodPressure: '165/95', heartRate: 88, temperature: 36.7, respiratoryRate: 16, oxygenSat: 97 },
        generalAppearance: 'Alert but unable to speak clearly',
        skin: 'No bleeding or bruising',
        cardiovascular: 'Irregularly irregular rhythm',
        respiratory: 'Clear bilaterally',
        abdomen: 'Soft, non-tender',
        extremities: 'Left arm and leg weakness',
        neurological: 'Left hemiparesis, expressive aphasia, NIHSS 12'
      },
      labValues: { pt: 25.8, aptt: 32.5, inr: 3.2, plateletCount: 285000, hemoglobin: 14.2, hematocrit: 42.5, wbc: 8900, fibrinogen: 420, dDimer: 0.8 },
      diagnosis: 'Acute Ischemic Stroke with Supratherapeutic Anticoagulation',
      difficulty: 'hard'
    },

    {
      id: '6',
      name: 'Patricia Davis',
      age: 74,
      weight: 68,
      gender: 'Female',
      chiefComplaint: 'Palpitations and shortness of breath',
      presentIllness: 'Patient reports irregular heartbeat and increasing shortness of breath over past week. No chest pain.',
      pastMedicalHistory: ['Hypertension', 'Heart failure with preserved EF'],
      medications: ['Metoprolol', 'Furosemide', 'Lisinopril'],
      allergies: ['NKDA'],
      familyHistory: 'Father had atrial fibrillation',
      socialHistory: 'Non-smoker, no alcohol',
      symptoms: ['Palpitations', 'Shortness of breath', 'Fatigue', 'Lower extremity edema'],
      physicalExam: {
        vitals: { bloodPressure: '145/85', heartRate: 110, temperature: 36.6, respiratoryRate: 20, oxygenSat: 94 },
        generalAppearance: 'Elderly female in mild distress',
        skin: 'Cool extremities, no cyanosis',
        cardiovascular: 'Irregularly irregular rhythm, S3 gallop',
        respiratory: 'Bilateral basilar crackles',
        abdomen: 'Soft, non-tender',
        extremities: '2+ bilateral lower extremity edema',
        neurological: 'Alert and oriented'
      },
      labValues: { pt: 12.2, aptt: 28.5, inr: 1.0, plateletCount: 245000, hemoglobin: 12.8, hematocrit: 38.5, wbc: 7800, fibrinogen: 385, dDimer: 1.2 },
      diagnosis: 'Atrial Fibrillation with Heart Failure',
      difficulty: 'medium'
    },

    {
      id: '7',
      name: 'Joshua Thompson',
      age: 2,
      weight: 12,
      gender: 'Male',
      chiefComplaint: 'Bleeding after circumcision',
      presentIllness: 'Infant underwent circumcision 6 hours ago. Parents report persistent bleeding from surgical site despite pressure.',
      pastMedicalHistory: ['Healthy newborn', 'Normal delivery'],
      medications: ['None'],
      allergies: ['Unknown'],
      familyHistory: 'No known bleeding disorders in family',
      socialHistory: 'Full-term infant, breastfeeding well',
      symptoms: ['Persistent bleeding from circumcision site', 'Fussiness'],
      physicalExam: {
        vitals: { bloodPressure: '85/45', heartRate: 145, temperature: 36.8, respiratoryRate: 35, oxygenSat: 99 },
        generalAppearance: 'Fussy but consolable infant',
        skin: 'Pallor noted, active bleeding from surgical site',
        cardiovascular: 'Tachycardic but regular rhythm',
        respiratory: 'Clear bilaterally',
        abdomen: 'Soft, non-distended',
        extremities: 'Good perfusion',
        neurological: 'Appropriate for age'
      },
      labValues: { pt: 15.5, aptt: 58.2, inr: 1.3, plateletCount: 385000, hemoglobin: 9.8, hematocrit: 29.5, wbc: 12500, fibrinogen: 250, dDimer: 0.1 },
      diagnosis: 'Possible Hemophilia or von Willebrand Disease',
      difficulty: 'medium'
    },

    {
      id: '8',
      name: 'James Wilson',
      age: 32,
      weight: 85,
      gender: 'Male',
      chiefComplaint: 'Motor vehicle accident with massive blood loss',
      presentIllness: 'Patient involved in high-speed motor vehicle collision. Presents with multiple trauma and evidence of significant blood loss.',
      pastMedicalHistory: ['No significant medical history'],
      medications: ['None regularly'],
      allergies: ['NKDA'],
      familyHistory: 'Non-contributory',
      socialHistory: 'Construction worker, occasional alcohol use',
      symptoms: ['Abdominal pain', 'Dizziness', 'Weakness', 'Nausea'],
      physicalExam: {
        vitals: { bloodPressure: '75/45', heartRate: 135, temperature: 35.8, respiratoryRate: 30, oxygenSat: 90 },
        generalAppearance: 'Critically injured male in severe distress',
        skin: 'Pale, cool, diaphoretic',
        cardiovascular: 'Tachycardic, weak pulses',
        respiratory: 'Decreased breath sounds on right',
        abdomen: 'Distended, tender, possible internal bleeding',
        extremities: 'Multiple lacerations, weak pulses',
        neurological: 'Confused, Glasgow Coma Scale 12'
      },
      labValues: { pt: 18.5, aptt: 45.8, inr: 1.8, plateletCount: 185000, hemoglobin: 5.2, hematocrit: 15.8, wbc: 15800, fibrinogen: 120, dDimer: 4.2 },
      diagnosis: 'Hemorrhagic Shock with Coagulopathy of Trauma',
      difficulty: 'hard'
    },

    {
      id: '9',
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
      diagnosis: 'Immune Thrombocytopenic Purpura (ITP)',
      difficulty: 'medium'
    },

    {
      id: '10',
      name: 'Frank Anderson',
      age: 65,
      weight: 75,
      gender: 'Male',
      chiefComplaint: 'Massive rectal bleeding',
      presentIllness: 'Patient presents with sudden onset of large volume bright red blood per rectum. Associated with dizziness and weakness.',
      pastMedicalHistory: ['Peptic ulcer disease', 'NSAID use', 'Hypertension'],
      medications: ['Ibuprofen 800mg TID', 'Omeprazole', 'Amlodipine'],
      allergies: ['NKDA'],
      familyHistory: 'Father had peptic ulcer disease',
      socialHistory: 'Heavy NSAID use for arthritis, social drinker',
      symptoms: ['Massive rectal bleeding', 'Dizziness', 'Weakness', 'Abdominal pain'],
      physicalExam: {
        vitals: { bloodPressure: '88/55', heartRate: 125, temperature: 36.2, respiratoryRate: 24, oxygenSat: 95 },
        generalAppearance: 'Pale, diaphoretic male in distress',
        skin: 'Pale, cool, clammy',
        cardiovascular: 'Tachycardic, weak pulses',
        respiratory: 'Clear bilaterally',
        abdomen: 'Epigastric tenderness, active bowel sounds',
        extremities: 'Cool, weak pulses',
        neurological: 'Alert but anxious'
      },
      labValues: { pt: 16.8, aptt: 38.5, inr: 1.5, plateletCount: 285000, hemoglobin: 6.2, hematocrit: 18.8, wbc: 12500, fibrinogen: 180, dDimer: 1.8 },
      diagnosis: 'Upper GI Bleeding with Coagulopathy',
      difficulty: 'hard'
    },

    {
      id: '11',
      name: 'Betty Johnson',
      age: 72,
      weight: 62,
      gender: 'Female',
      chiefComplaint: 'Blood in stool and weight loss',
      presentIllness: 'Patient reports 3-month history of intermittent blood in stool, changed bowel habits, and 15-pound weight loss.',
      pastMedicalHistory: ['Hypertension', 'Osteoarthritis'],
      medications: ['Lisinopril', 'Acetaminophen'],
      allergies: ['Aspirin'],
      familyHistory: 'Sister had colon cancer at age 68',
      socialHistory: 'Non-smoker, minimal alcohol use',
      symptoms: ['Blood in stool', 'Weight loss', 'Changed bowel habits', 'Fatigue'],
      physicalExam: {
        vitals: { bloodPressure: '125/78', heartRate: 95, temperature: 36.8, respiratoryRate: 18, oxygenSat: 96 },
        generalAppearance: 'Elderly female appearing stated age, mild distress',
        skin: 'Pale, no jaundice',
        cardiovascular: 'Regular rate and rhythm',
        respiratory: 'Clear bilaterally',
        abdomen: 'Soft, left lower quadrant mass palpable',
        extremities: 'No edema',
        neurological: 'Alert and oriented'
      },
      labValues: { pt: 13.2, aptt: 30.5, inr: 1.1, plateletCount: 485000, hemoglobin: 8.8, hematocrit: 26.5, wbc: 9200, fibrinogen: 450, dDimer: 2.1 },
      diagnosis: 'Colon Cancer with Iron Deficiency Anemia',
      difficulty: 'medium'
    }
  ];

  const availableTests: DiagnosticTest[] = [
    {
      id: 'bleeding_time',
      name: 'Bleeding Time',
      category: 'basic',
      cost: 25,
      timeToResult: 30,
      description: 'Measures primary hemostasis and platelet function',
      indication: 'Suspected platelet dysfunction or von Willebrand disease',
      normalRange: '2-7 minutes'
    },
    {
      id: 'factor_viii',
      name: 'Factor VIII Activity',
      category: 'specialized',
      cost: 150,
      timeToResult: 120,
      description: 'Measures Factor VIII clotting activity',
      indication: 'Suspected Hemophilia A or von Willebrand disease',
      normalRange: '50-150%'
    },
    {
      id: 'vwf_antigen',
      name: 'von Willebrand Factor Antigen',
      category: 'specialized',
      cost: 120,
      timeToResult: 180,
      description: 'Quantitative measurement of vWF protein',
      indication: 'Suspected von Willebrand disease',
      normalRange: '60-140%'
    },
    {
      id: 'duplex_ultrasound',
      name: 'Venous Duplex Ultrasound',
      category: 'imaging',
      cost: 300,
      timeToResult: 60,
      description: 'Non-invasive imaging to detect deep vein thrombosis',
      indication: 'Suspected DVT',
      normalRange: 'No evidence of thrombosis'
    },
    {
      id: 'ct_angiogram',
      name: 'CT Pulmonary Angiogram',
      category: 'imaging',
      cost: 800,
      timeToResult: 90,
      description: 'Imaging to detect pulmonary embolism',
      indication: 'Suspected pulmonary embolism',
      normalRange: 'No filling defects'
    },
    {
      id: 'fibrin_degradation_products',
      name: 'Fibrin Degradation Products',
      category: 'specialized',
      cost: 85,
      timeToResult: 45,
      description: 'Measures breakdown products of fibrin',
      indication: 'Suspected DIC or excessive fibrinolysis',
      normalRange: '<10 mg/L'
    },
    {
      id: 'antithrombin_iii',
      name: 'Antithrombin III',
      category: 'specialized',
      cost: 95,
      timeToResult: 120,
      description: 'Natural anticoagulant protein',
      indication: 'Thrombophilia screening',
      normalRange: '80-120%'
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
      indication: 'Mild bleeding disorders, vWD Type 1'
    },
    {
      id: 'factor_viii',
      name: 'Factor VIII Concentrate',
      type: 'blood_product',
      mechanism: 'Direct factor replacement',
      dosage: '25-50 units/kg for bleeding episodes',
      contraindications: ['Known inhibitors (relative)'],
      sideEffects: ['Allergic reactions', 'Inhibitor development', 'Thrombosis'],
      monitoring: ['Factor VIII levels', 'Inhibitor screen', 'Clinical response'],
      cost: 2000,
      indication: 'Hemophilia A, severe bleeding'
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
      cost: 300,
      indication: 'DVT/PE treatment and prevention'
    },
    {
      id: 'vitamin_k',
      name: 'Vitamin K',
      type: 'reversal',
      mechanism: 'Reverses warfarin anticoagulation',
      dosage: '1-10mg IV/PO based on INR',
      contraindications: ['Hypersensitivity'],
      sideEffects: ['Pain at injection site', 'Rare anaphylaxis'],
      monitoring: ['INR', 'PT', 'Clinical response'],
      cost: 50,
      indication: 'Warfarin reversal'
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
      cost: 400,
      indication: 'Multiple factor deficiencies, massive bleeding'
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
      indication: 'Severe thrombocytopenia with bleeding'
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
      cost: 25,
      indication: 'Immune thrombocytopenic purpura'
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
      treatment: ['DDAVP', 'Tranexamic acid', 'vWF concentrates']
    },
    {
      id: 'hemophilia_a',
      name: 'Hemophilia A',
      category: 'bleeding_disorder',
      description: 'X-linked bleeding disorder due to Factor VIII deficiency',
      keyFeatures: ['Joint bleeding', 'Muscle hematomas', 'Prolonged aPTT', 'Family history'],
      diagnosticCriteria: ['Factor VIII <50%', 'Prolonged aPTT', 'Normal PT and platelets'],
      treatment: ['Factor VIII concentrates', 'DDAVP', 'Antifibrinolytics']
    },
    {
      id: 'dic',
      name: 'Disseminated Intravascular Coagulation',
      category: 'acquired_disorder',
      description: 'Systemic activation of coagulation with consumption of factors',
      keyFeatures: ['Bleeding and thrombosis', 'Low platelets', 'Low fibrinogen', 'High D-dimer'],
      diagnosticCriteria: ['Low platelets', 'Prolonged PT/aPTT', 'Low fibrinogen', 'High D-dimer'],
      treatment: ['Treat underlying cause', 'Fresh frozen plasma', 'Platelets', 'Supportive care']
    },
    {
      id: 'itp',
      name: 'Immune Thrombocytopenic Purpura',
      category: 'platelet_disorder',
      description: 'Autoimmune destruction of platelets',
      keyFeatures: ['Isolated thrombocytopenia', 'Mucocutaneous bleeding', 'Normal bone marrow'],
      diagnosticCriteria: ['Platelet count <100,000', 'Normal PT/aPTT', 'Exclusion of other causes'],
      treatment: ['Corticosteroids', 'IVIG', 'Platelet transfusion if bleeding']
    },
    {
      id: 'dvt_pe',
      name: 'Deep Vein Thrombosis with Pulmonary Embolism',
      category: 'thrombotic_disorder',
      description: 'Venous thromboembolism with pulmonary complications',
      keyFeatures: ['Leg swelling', 'Shortness of breath', 'Elevated D-dimer', 'Imaging confirmation'],
      diagnosticCriteria: ['Duplex ultrasound positive', 'CT angiogram positive', 'Clinical probability'],
      treatment: ['Anticoagulation', 'Thrombolysis', 'Supportive care']
    }
  ];

  useEffect(() => {
    if (gameStarted) {
      const timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameStarted]);

  const startGame = () => {
    setGameStarted(true);
    setCurrentPatient(patients[0]);
    setGamePhase('assessment');
    toast({
      title: "🩺 Diagnosis & Treatment Tactician Started!",
      description: "Assess the patient, order appropriate tests, make a diagnosis, and develop a treatment plan!",
    });
  };

  const nextCase = () => {
    const nextIndex = (currentPatientIndex + 1) % patients.length;
    setCurrentPatientIndex(nextIndex);
    setCurrentPatient(patients[nextIndex]);
    setSelectedTests([]);
    setTestResults({});
    setSelectedDiagnosis(null);
    setSelectedTreatments([]);
    setGamePhase('assessment');
    setRevealedSections({});
    setTreatmentCompleted(false);
    setScore(prev => prev + 100);
    toast({
      title: "New Case Study! 📋",
      description: `Now treating ${patients[nextIndex].name}. +100 points for case completion!`,
    });
  };

  const dischargePatient = () => {
    if (selectedDiagnosis && selectedTreatments.length > 0 && treatmentCompleted) {
      setScore(prev => prev + 500);
      toast({
        title: "Patient Discharged! 🏠",
        description: `${currentPatient?.name} successfully treated and discharged! +500 points`,
      });
      nextCase();
    } else {
      toast({
        title: "Cannot Discharge Patient ❌",
        description: "Complete diagnosis and treatment plan before discharge.",
        variant: "destructive",
      });
    }
  };

  const orderTest = (test: DiagnosticTest) => {
    if (currency < test.cost) {
      toast({
        title: "Insufficient Funds! 💰",
        description: `You need ${test.cost} QUID but only have ${currency} QUID.`,
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
    setCurrency(prev => prev - test.cost);
    setScore(prev => prev + 50);
    
    toast({
      title: "Test Ordered! 📋",
      description: `${test.name} ordered. Cost: ${test.cost} QUID. +50 points`,
    });

    setTimeout(() => {
      const result = generateTestResults(test, currentPatient);
      setTestResults(prev => ({ ...prev, [test.id]: result }));
      toast({
        title: "Results Available! ✅",
        description: `${test.name} results are ready for interpretation.`,
      });
    }, test.timeToResult * 10);
  };

  const generateTestResults = (test: DiagnosticTest, patient: Patient | null) => {
    if (!patient) return null;

    const resultsByPatient: { [key: string]: { [key: string]: string } } = {
      '1': { // von Willebrand Disease
        'bleeding_time': '12 minutes (prolonged)',
        'vwf_antigen': '28% (low)',
        'factor_viii': '45% (low)'
      },
      '2': { // Hemophilia A
        'factor_viii': '2% (critically low)',
        'bleeding_time': '4 minutes (normal)'
      },
      '3': { // DVT/PE
        'duplex_ultrasound': 'Extensive DVT in left femoral and popliteal veins',
        'ct_angiogram': 'Bilateral subsegmental pulmonary emboli'
      },
      '4': { // DIC
        'fibrin_degradation_products': '45 mg/L (critically high)',
        'antithrombin_iii': '35% (low)'
      }
    };

    return resultsByPatient[patient.id]?.[test.id] || 'Normal';
  };

  const toggleSection = (section: string) => {
    setRevealedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const selectDiagnosis = (diagnosis: Diagnosis) => {
    setSelectedDiagnosis(diagnosis);
    setScore(prev => prev + 150);
    toast({
      title: "Diagnosis Selected! 🎯",
      description: `${diagnosis.name} added to differential. +150 points`,
    });
  };

  const selectTreatment = (treatment: Treatment) => {
    if (currency < treatment.cost) {
      toast({
        title: "Insufficient Funds! 💰",
        description: `You need ${treatment.cost} QUID but only have ${currency} QUID.`,
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
    setCurrency(prev => prev - treatment.cost);
    setScore(prev => prev + 100);
    setTreatmentCompleted(true);
    
    toast({
      title: "Treatment Selected! 💊",
      description: `${treatment.name} added to treatment plan. +100 points`,
    });
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const resetLevel = () => {
    setScore(0);
    setCurrency(2000);
    setTimeElapsed(0);
    setCurrentPatientIndex(0);
    setCurrentPatient(patients[0]);
    setSelectedTests([]);
    setTestResults({});
    setSelectedDiagnosis(null);
    setSelectedTreatments([]);
    setGamePhase('assessment');
    setRevealedSections({});
    setLevel4Complete(false);
    setShowCompletionDialog(false);
    setTreatmentCompleted(false);
    setGameStarted(true);
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
                Level 4: Diagnosis & Treatment Tactician
              </h1>
              <p className="text-purple-200 text-base lg:text-lg">Master diagnostic reasoning and therapeutic decision-making</p>
            </div>
            <div className="flex items-center space-x-4 lg:space-x-8">
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-yellow-400">{score}</div>
                <div className="text-sm text-gray-300">Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-green-400">{currency}</div>
                <div className="text-sm text-gray-300">QUID</div>
              </div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-blue-400">{formatTime(timeElapsed)}</div>
                <div className="text-sm text-gray-300">Time</div>
              </div>
            </div>
          </div>
        </GlassmorphicCard>

        {!gameStarted ? (
          <div className="text-center">
            <GlassmorphicCard intensity="medium" className="p-12">
              <Stethoscope className="h-24 w-24 text-purple-400 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Clinical Practice?</h2>
              <p className="text-white/70 mb-8 text-lg">Master the art of diagnosis and treatment through comprehensive case studies!</p>
              <Button onClick={startGame} size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg transform hover:scale-105 transition-all duration-200">
                <Play className="h-6 w-6 mr-3" />
                Start Clinical Cases
              </Button>
            </GlassmorphicCard>
          </div>
        ) : (
          <div className="space-y-6">
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
                onClick={dischargePatient}
                className={`transform hover:scale-105 transition-all duration-200 ${
                  treatmentCompleted && selectedDiagnosis && selectedTreatments.length > 0
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-gray-600 cursor-not-allowed'
                }`}
                disabled={!treatmentCompleted || !selectedDiagnosis || selectedTreatments.length === 0}
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
                        {availableTests.slice(0, 4).map((test) => (
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
                        {availableDiagnoses.slice(0, 5).map((diagnosis) => (
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
                        {availableTreatments.slice(0, 4).map((treatment) => (
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
    </div>
  );
};

export default Level4;
