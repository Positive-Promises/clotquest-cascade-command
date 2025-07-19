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
  }
];