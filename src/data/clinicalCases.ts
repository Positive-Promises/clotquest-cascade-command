import { ClinicalCase } from '@/types/pathologyTypes';

export const clinicalCases: ClinicalCase[] = [
  {
    id: 'case-001',
    title: 'Young Athlete with Easy Bruising',
    difficulty: 'beginner',
    category: 'hereditary',
    timeLimit: 15,
    isUrgent: false,
    resourceLimited: false,
    patient: {
      id: 'patient-001',
      demographics: {
        age: 16,
        sex: 'M',
        ethnicity: 'Caucasian',
        occupation: 'High School Student/Athlete'
      },
      chiefComplaint: 'Easy bruising and prolonged bleeding after sports injuries',
      historyOfPresentIllness: 'Over the past 6 months, patient has noticed increasing tendency to bruise easily during football practice. Small cuts take longer than usual to stop bleeding. No history of major bleeding episodes.',
      pastMedicalHistory: ['No significant past medical history'],
      medications: ['None'],
      familyHistory: ['Maternal uncle with bleeding disorder', 'No other known bleeding disorders'],
      socialHistory: 'High school student, plays varsity football, denies alcohol/drugs',
      reviewOfSystems: ['Easy bruising', 'Prolonged bleeding', 'No nosebleeds', 'No GI bleeding', 'No CNS symptoms'],
      physicalExam: {
        vitalSigns: {
          temperature: 98.6,
          bloodPressure: '120/80',
          heartRate: 60,
          respiratoryRate: 16
        },
        general: 'Well-appearing adolescent male in no acute distress',
        cardiovascular: 'Regular rate and rhythm, no murmurs',
        pulmonary: 'Clear to auscultation bilaterally',
        abdominal: 'Soft, non-tender, no organomegaly',
        extremities: 'Multiple ecchymoses on arms and legs in various stages of healing',
        skin: 'Multiple bruises, no petechiae',
        neurological: 'Grossly intact'
      },
      labResults: [
        {
          id: 'lab-001',
          name: 'Platelet Count',
          value: 280,
          unit: 'x10³/μL',
          referenceRange: '150-450',
          isAbnormal: false,
          significance: 'Normal'
        },
        {
          id: 'lab-002',
          name: 'PT',
          value: 12.1,
          unit: 'seconds',
          referenceRange: '11-13',
          isAbnormal: false,
          significance: 'Normal'
        },
        {
          id: 'lab-003',
          name: 'PTT',
          value: 45,
          unit: 'seconds',
          referenceRange: '25-35',
          isAbnormal: true,
          significance: 'High'
        },
        {
          id: 'lab-004',
          name: 'Factor VIII Activity',
          value: 15,
          unit: '%',
          referenceRange: '50-150',
          isAbnormal: true,
          significance: 'Low'
        },
        {
          id: 'lab-005',
          name: 'von Willebrand Factor',
          value: 85,
          unit: '%',
          referenceRange: '50-150',
          isAbnormal: false,
          significance: 'Normal'
        }
      ],
      images: [
        {
          id: 'img-001',
          type: 'blood_smear',
          title: 'Peripheral Blood Smear',
          description: 'Normal platelet morphology and count',
          url: '/placeholder.svg',
          findings: ['Normal platelet size and granulation', 'Adequate platelet count', 'No platelet clumping']
        }
      ]
    },
    correctDiagnosis: 'Hemophilia A (Factor VIII Deficiency)',
    learningObjectives: [
      'Recognize clinical presentation of mild hemophilia',
      'Interpret coagulation studies in factor deficiencies',
      'Understand inheritance patterns of X-linked disorders',
      'Differentiate between hemophilia A and B'
    ],
    scoringCriteria: {
      accuracyWeight: 0.5,
      timeWeight: 0.2,
      evidenceWeight: 0.3
    }
  },
  {
    id: 'case-002',
    title: 'Elderly Patient with Multiple Medications',
    difficulty: 'intermediate',
    category: 'medication',
    timeLimit: 20,
    isUrgent: true,
    resourceLimited: false,
    patient: {
      id: 'patient-002',
      demographics: {
        age: 72,
        sex: 'F',
        ethnicity: 'African American',
        occupation: 'Retired'
      },
      chiefComplaint: 'Spontaneous bruising and gum bleeding',
      historyOfPresentIllness: 'Patient developed spontaneous bruising on arms and legs over the past week. Also notes gum bleeding when brushing teeth. No trauma or injury recalled.',
      pastMedicalHistory: ['Atrial fibrillation', 'Hypertension', 'Osteoarthritis', 'Recent pneumonia treated with antibiotics'],
      medications: ['Warfarin 5mg daily', 'Metoprolol 50mg BID', 'Sulfamethoxazole-trimethoprim (completed 10-day course 3 days ago)'],
      familyHistory: ['No bleeding disorders'],
      socialHistory: 'Lives alone, independent in ADLs, no alcohol use',
      reviewOfSystems: ['Easy bruising', 'Gum bleeding', 'No nosebleeds', 'No melena', 'No hematuria'],
      physicalExam: {
        vitalSigns: {
          temperature: 98.4,
          bloodPressure: '140/85',
          heartRate: 88,
          respiratoryRate: 18
        },
        general: 'Elderly female in no acute distress',
        cardiovascular: 'Irregularly irregular rhythm, no murmurs',
        pulmonary: 'Clear to auscultation',
        abdominal: 'Soft, non-tender',
        extremities: 'Large ecchymoses on bilateral arms and legs',
        skin: 'Multiple large bruises, no petechiae',
        neurological: 'Alert and oriented'
      },
      labResults: [
        {
          id: 'lab-006',
          name: 'INR',
          value: 6.2,
          unit: '',
          referenceRange: '2.0-3.0 (on warfarin)',
          isAbnormal: true,
          significance: 'Critical'
        },
        {
          id: 'lab-007',
          name: 'PT',
          value: 58,
          unit: 'seconds',
          referenceRange: '11-13',
          isAbnormal: true,
          significance: 'Critical'
        },
        {
          id: 'lab-008',
          name: 'PTT',
          value: 65,
          unit: 'seconds',
          referenceRange: '25-35',
          isAbnormal: true,
          significance: 'High'
        },
        {
          id: 'lab-009',
          name: 'Platelet Count',
          value: 240,
          unit: 'x10³/μL',
          referenceRange: '150-450',
          isAbnormal: false,
          significance: 'Normal'
        }
      ],
      images: []
    },
    correctDiagnosis: 'Warfarin over-anticoagulation due to drug interaction',
    learningObjectives: [
      'Recognize warfarin over-anticoagulation',
      'Understand drug interactions with warfarin',
      'Interpret INR values in anticoagulated patients',
      'Manage warfarin reversal strategies'
    ],
    scoringCriteria: {
      accuracyWeight: 0.4,
      timeWeight: 0.4,
      evidenceWeight: 0.2
    }
  },
  {
    id: 'case-003',
    title: 'Thrombotic Microangiopathy Emergency',
    difficulty: 'advanced',
    category: 'platelet',
    timeLimit: 10,
    isUrgent: true,
    resourceLimited: true,
    patient: {
      id: 'patient-003',
      demographics: {
        age: 28,
        sex: 'F',
        ethnicity: 'Hispanic',
        occupation: 'Teacher'
      },
      chiefComplaint: 'Severe headache, confusion, and dark urine',
      historyOfPresentIllness: 'Previously healthy woman developed severe headache, confusion, and dark urine over 2 days. Family reports personality changes and difficulty speaking coherently.',
      pastMedicalHistory: ['No significant medical history'],
      medications: ['Oral contraceptive pills'],
      familyHistory: ['No known medical conditions'],
      socialHistory: 'Non-smoker, occasional alcohol use',
      reviewOfSystems: ['Severe headache', 'Confusion', 'Dark urine', 'Fatigue', 'Nausea'],
      physicalExam: {
        vitalSigns: {
          temperature: 100.2,
          bloodPressure: '160/100',
          heartRate: 110,
          respiratoryRate: 22
        },
        general: 'Acutely ill-appearing woman, confused',
        cardiovascular: 'Tachycardic, regular rhythm',
        pulmonary: 'Clear bilaterally',
        abdominal: 'Soft, mild tenderness',
        extremities: 'Petechiae on arms and legs',
        skin: 'Pallor, scattered petechiae',
        neurological: 'Confused, difficulty with speech, no focal deficits'
      },
      labResults: [
        {
          id: 'lab-010',
          name: 'Hemoglobin',
          value: 7.2,
          unit: 'g/dL',
          referenceRange: '12-15',
          isAbnormal: true,
          significance: 'Critical'
        },
        {
          id: 'lab-011',
          name: 'Platelet Count',
          value: 15,
          unit: 'x10³/μL',
          referenceRange: '150-450',
          isAbnormal: true,
          significance: 'Critical'
        },
        {
          id: 'lab-012',
          name: 'LDH',
          value: 2800,
          unit: 'U/L',
          referenceRange: '140-280',
          isAbnormal: true,
          significance: 'Critical'
        },
        {
          id: 'lab-013',
          name: 'Schistocytes',
          value: 'Present',
          unit: '',
          referenceRange: 'Absent',
          isAbnormal: true,
          significance: 'Critical'
        },
        {
          id: 'lab-014',
          name: 'Creatinine',
          value: 2.1,
          unit: 'mg/dL',
          referenceRange: '0.6-1.2',
          isAbnormal: true,
          significance: 'High'
        }
      ],
      images: [
        {
          id: 'img-002',
          type: 'blood_smear',
          title: 'Blood Smear with Schistocytes',
          description: 'Multiple fragmented red blood cells (schistocytes)',
          url: '/placeholder.svg',
          findings: ['Numerous schistocytes', 'Severe thrombocytopenia', 'Polychromasia']
        }
      ]
    },
    correctDiagnosis: 'Thrombotic Thrombocytopenic Purpura (TTP)',
    learningObjectives: [
      'Recognize TTP pentad and emergency nature',
      'Understand microangiopathic hemolytic anemia',
      'Differentiate TTP from HUS and other TMAs',
      'Initiate urgent plasmapheresis'
    ],
    scoringCriteria: {
      accuracyWeight: 0.3,
      timeWeight: 0.5,
      evidenceWeight: 0.2
    }
  },
  {
    id: 'case-004',
    title: 'Disseminated Intravascular Coagulation (DIC)',
    difficulty: 'advanced',
    category: 'emergency',
    timeLimit: 8,
    isUrgent: true,
    resourceLimited: true,
    patient: {
      id: 'patient-004',
      demographics: {
        age: 45,
        sex: 'F',
        ethnicity: 'Caucasian',
        occupation: 'Office Worker'
      },
      chiefComplaint: 'Severe bleeding, confusion, and shortness of breath following surgery',
      historyOfPresentIllness: 'Post-operative day 2 following emergency appendectomy. Developed excessive bleeding from surgical site, confusion, and difficulty breathing. Surgery was complicated by peritonitis.',
      pastMedicalHistory: ['No significant past medical history'],
      medications: ['Postoperative antibiotics', 'Pain medications'],
      familyHistory: ['No bleeding disorders'],
      socialHistory: 'Non-smoker, social drinker',
      reviewOfSystems: ['Excessive bleeding', 'Confusion', 'Shortness of breath', 'Abdominal pain'],
      physicalExam: {
        vitalSigns: {
          temperature: 101.2,
          bloodPressure: '90/60',
          heartRate: 120,
          respiratoryRate: 28
        },
        general: 'Critically ill-appearing woman, confused',
        cardiovascular: 'Tachycardic, hypotensive',
        pulmonary: 'Tachypneic, bilateral crackles',
        abdominal: 'Surgical site bleeding, tender',
        extremities: 'Petechiae and ecchymoses',
        skin: 'Cyanotic, cool extremities',
        neurological: 'Confused, agitated'
      },
      labResults: [
        {
          id: 'lab-015',
          name: 'Platelet Count',
          value: 45,
          unit: 'x10³/μL',
          referenceRange: '150-450',
          isAbnormal: true,
          significance: 'Critical'
        },
        {
          id: 'lab-016',
          name: 'PT',
          value: 25,
          unit: 'seconds',
          referenceRange: '11-13',
          isAbnormal: true,
          significance: 'Critical'
        },
        {
          id: 'lab-017',
          name: 'PTT',
          value: 85,
          unit: 'seconds',
          referenceRange: '25-35',
          isAbnormal: true,
          significance: 'Critical'
        },
        {
          id: 'lab-018',
          name: 'Fibrinogen',
          value: 80,
          unit: 'mg/dL',
          referenceRange: '200-400',
          isAbnormal: true,
          significance: 'Critical'
        },
        {
          id: 'lab-019',
          name: 'D-dimer',
          value: 8500,
          unit: 'ng/mL',
          referenceRange: '<500',
          isAbnormal: true,
          significance: 'Critical'
        }
      ],
      images: []
    },
    correctDiagnosis: 'Disseminated Intravascular Coagulation (DIC)',
    learningObjectives: [
      'Recognize DIC clinical presentation and laboratory findings',
      'Understand pathophysiology of consumption coagulopathy',
      'Differentiate DIC from other bleeding disorders',
      'Initiate appropriate emergency management'
    ],
    scoringCriteria: {
      accuracyWeight: 0.4,
      timeWeight: 0.5,
      evidenceWeight: 0.1
    }
  },
  {
    id: 'case-005',
    title: 'Hemolytic Uremic Syndrome (HUS)',
    difficulty: 'advanced',
    category: 'platelet',
    timeLimit: 12,
    isUrgent: true,
    resourceLimited: false,
    patient: {
      id: 'patient-005',
      demographics: {
        age: 8,
        sex: 'M',
        ethnicity: 'Hispanic',
        occupation: 'Student'
      },
      chiefComplaint: 'Bloody diarrhea, decreased urination, and fatigue',
      historyOfPresentIllness: 'Previously healthy 8-year-old boy developed bloody diarrhea 5 days ago after eating undercooked hamburger at a family BBQ. Over the past 2 days, parents noticed decreased urination and increasing fatigue.',
      pastMedicalHistory: ['No significant medical history'],
      medications: ['None'],
      familyHistory: ['No kidney disease or bleeding disorders'],
      socialHistory: 'Lives with parents, attends elementary school',
      reviewOfSystems: ['Bloody diarrhea', 'Decreased urination', 'Fatigue', 'Pallor', 'Mild fever'],
      physicalExam: {
        vitalSigns: {
          temperature: 99.8,
          bloodPressure: '130/85',
          heartRate: 105,
          respiratoryRate: 20
        },
        general: 'Pale, fatigued child in mild distress',
        cardiovascular: 'Tachycardic, no murmurs',
        pulmonary: 'Clear to auscultation',
        abdominal: 'Mild tenderness, no organomegaly',
        extremities: 'Petechiae on arms and legs',
        skin: 'Pale, scattered petechiae',
        neurological: 'Alert but lethargic'
      },
      labResults: [
        {
          id: 'lab-020',
          name: 'Hemoglobin',
          value: 6.8,
          unit: 'g/dL',
          referenceRange: '11.5-14.5',
          isAbnormal: true,
          significance: 'Critical'
        },
        {
          id: 'lab-021',
          name: 'Platelet Count',
          value: 35,
          unit: 'x10³/μL',
          referenceRange: '150-450',
          isAbnormal: true,
          significance: 'Critical'
        },
        {
          id: 'lab-022',
          name: 'Creatinine',
          value: 3.2,
          unit: 'mg/dL',
          referenceRange: '0.3-0.7',
          isAbnormal: true,
          significance: 'Critical'
        },
        {
          id: 'lab-023',
          name: 'LDH',
          value: 1850,
          unit: 'U/L',
          referenceRange: '140-280',
          isAbnormal: true,
          significance: 'Critical'
        },
        {
          id: 'lab-024',
          name: 'Schistocytes',
          value: 'Present',
          unit: '',
          referenceRange: 'Absent',
          isAbnormal: true,
          significance: 'Critical'
        }
      ],
      images: []
    },
    correctDiagnosis: 'Hemolytic Uremic Syndrome (HUS)',
    learningObjectives: [
      'Recognize HUS triad: hemolytic anemia, thrombocytopenia, acute kidney injury',
      'Understand STEC-HUS pathophysiology',
      'Differentiate HUS from TTP',
      'Manage supportive care and avoid antibiotics'
    ],
    scoringCriteria: {
      accuracyWeight: 0.4,
      timeWeight: 0.3,
      evidenceWeight: 0.3
    }
  },
  {
    id: 'case-006',
    title: 'Immune Thrombocytopenic Purpura (ITP)',
    difficulty: 'intermediate',
    category: 'platelet',
    timeLimit: 18,
    isUrgent: false,
    resourceLimited: false,
    patient: {
      id: 'patient-006',
      demographics: {
        age: 32,
        sex: 'F',
        ethnicity: 'Asian',
        occupation: 'Nurse'
      },
      chiefComplaint: 'Easy bruising and heavy menstrual bleeding',
      historyOfPresentIllness: 'Over the past month, patient has noticed increased bruising with minimal trauma and unusually heavy menstrual periods. No recent illness or new medications.',
      pastMedicalHistory: ['No significant medical history'],
      medications: ['Oral contraceptive pills'],
      familyHistory: ['No bleeding disorders or autoimmune conditions'],
      socialHistory: 'Healthcare worker, non-smoker, occasional alcohol',
      reviewOfSystems: ['Easy bruising', 'Heavy menstrual bleeding', 'No nosebleeds', 'No GI bleeding', 'No weight loss'],
      physicalExam: {
        vitalSigns: {
          temperature: 98.6,
          bloodPressure: '118/75',
          heartRate: 78,
          respiratoryRate: 16
        },
        general: 'Well-appearing woman in no acute distress',
        cardiovascular: 'Regular rate and rhythm',
        pulmonary: 'Clear bilaterally',
        abdominal: 'Soft, non-tender, no splenomegaly',
        extremities: 'Multiple ecchymoses, petechiae on lower legs',
        skin: 'Scattered petechiae and ecchymoses',
        neurological: 'Normal'
      },
      labResults: [
        {
          id: 'lab-025',
          name: 'Platelet Count',
          value: 18,
          unit: 'x10³/μL',
          referenceRange: '150-450',
          isAbnormal: true,
          significance: 'Critical'
        },
        {
          id: 'lab-026',
          name: 'PT',
          value: 12.0,
          unit: 'seconds',
          referenceRange: '11-13',
          isAbnormal: false,
          significance: 'Normal'
        },
        {
          id: 'lab-027',
          name: 'PTT',
          value: 28,
          unit: 'seconds',
          referenceRange: '25-35',
          isAbnormal: false,
          significance: 'Normal'
        },
        {
          id: 'lab-028',
          name: 'Hemoglobin',
          value: 11.2,
          unit: 'g/dL',
          referenceRange: '12-15',
          isAbnormal: true,
          significance: 'Low'
        }
      ],
      images: [
        {
          id: 'img-003',
          type: 'blood_smear',
          title: 'Peripheral Blood Smear',
          description: 'Severe thrombocytopenia with large, young platelets',
          url: '/placeholder.svg',
          findings: ['Severely decreased platelet count', 'Large platelet size', 'Normal red and white cell morphology']
        }
      ]
    },
    correctDiagnosis: 'Immune Thrombocytopenic Purpura (ITP)',
    learningObjectives: [
      'Recognize isolated thrombocytopenia presentation',
      'Understand autoimmune platelet destruction',
      'Differentiate primary from secondary ITP',
      'Consider treatment options based on platelet count and bleeding'
    ],
    scoringCriteria: {
      accuracyWeight: 0.5,
      timeWeight: 0.2,
      evidenceWeight: 0.3
    }
  }
];