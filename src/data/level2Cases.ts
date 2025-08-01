
export interface Level2Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  symptoms: string[];
  clinicalHistory: string;
  correctDiagnosis: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'hereditary' | 'acquired' | 'platelet' | 'medication' | 'emergency';
}

export const level2Patients: Level2Patient[] = [
  {
    id: 'p1',
    name: 'Maria Santos',
    age: 34,
    gender: 'Female',
    symptoms: ['Easy bruising', 'Heavy menstrual bleeding', 'Bleeding gums'],
    clinicalHistory: 'Family history of bleeding disorders. Recent dental work with excessive bleeding. Mother had similar symptoms.',
    correctDiagnosis: 'von Willebrand Disease',
    difficulty: 'beginner',
    category: 'hereditary'
  },
  {
    id: 'p2', 
    name: 'James Wilson',
    age: 8,
    gender: 'Male',
    symptoms: ['Joint swelling', 'Easy bruising', 'Muscle bleeding'],
    clinicalHistory: 'X-linked inheritance pattern. Recurrent joint bleeds since early childhood. Maternal uncle affected.',
    correctDiagnosis: 'Hemophilia A',
    difficulty: 'beginner',
    category: 'hereditary'
  },
  {
    id: 'p3',
    name: 'Robert Chen',
    age: 12,
    gender: 'Male', 
    symptoms: ['Joint pain', 'Muscle hematomas', 'Delayed bleeding'],
    clinicalHistory: 'Similar to hemophilia A but milder course. Normal Factor VIII levels. Family history of bleeding.',
    correctDiagnosis: 'Hemophilia B',
    difficulty: 'intermediate',
    category: 'hereditary'
  },
  {
    id: 'p4',
    name: 'Eleanor Thompson',
    age: 67,
    gender: 'Female',
    symptoms: ['Spontaneous bruising', 'Gum bleeding', 'Nosebleeds'],
    clinicalHistory: 'Recently started antibiotics for UTI. Takes warfarin for atrial fibrillation. Lives alone.',
    correctDiagnosis: 'Warfarin over-anticoagulation',
    difficulty: 'intermediate',
    category: 'medication'
  },
  {
    id: 'p5',
    name: 'Sarah Mitchell',
    age: 25,
    gender: 'Female',
    symptoms: ['Severe headache', 'Confusion', 'Dark urine', 'Fever'],
    clinicalHistory: 'Previously healthy. Sudden onset neurological symptoms with thrombocytopenia and hemolytic anemia.',
    correctDiagnosis: 'Thrombotic Thrombocytopenic Purpura (TTP)',
    difficulty: 'advanced',
    category: 'emergency'
  },
  {
    id: 'p6',
    name: 'Tommy Rodriguez',
    age: 6,
    gender: 'Male',
    symptoms: ['Bloody diarrhea', 'Decreased urination', 'Pallor', 'Fatigue'],
    clinicalHistory: 'Recent consumption of undercooked hamburger at family BBQ. Progressive kidney dysfunction.',
    correctDiagnosis: 'Hemolytic Uremic Syndrome (HUS)', 
    difficulty: 'advanced',
    category: 'emergency'
  },
  {
    id: 'p7',
    name: 'Lisa Park',
    age: 29,
    gender: 'Female',
    symptoms: ['Petechiae', 'Easy bruising', 'Heavy menstruation', 'Fatigue'],
    clinicalHistory: 'Recent viral illness 2 weeks ago. No medications. Previously healthy with normal bleeding history.',
    correctDiagnosis: 'Immune Thrombocytopenic Purpura (ITP)',
    difficulty: 'intermediate',
    category: 'platelet'
  },
  {
    id: 'p8',
    name: 'David Kumar',
    age: 45,
    gender: 'Male',
    symptoms: ['Excessive surgical bleeding', 'Oozing from IV sites', 'Confusion', 'Hypotension'],
    clinicalHistory: 'Post-operative day 1 after emergency surgery for perforated appendix with sepsis. Developed consumptive coagulopathy.',
    correctDiagnosis: 'Disseminated Intravascular Coagulation (DIC)',
    difficulty: 'advanced', 
    category: 'emergency'
  },
  {
    id: 'p9',
    name: 'Amanda Foster',
    age: 52,
    gender: 'Female',
    symptoms: ['Easy bruising', 'Bleeding gums', 'Fatigue', 'Weight loss'],
    clinicalHistory: 'Chronic liver disease due to hepatitis C. Recent worsening of liver function with ascites.',
    correctDiagnosis: 'Liver disease coagulopathy',
    difficulty: 'intermediate',
    category: 'acquired'
  },
  {
    id: 'p10',
    name: 'Michael Johnson',
    age: 38,
    gender: 'Male',
    symptoms: ['Recurrent DVTs', 'Pulmonary embolism', 'Family history of clots'],
    clinicalHistory: 'Multiple episodes of venous thromboembolism. Sister had PE at young age. No obvious triggers.',
    correctDiagnosis: 'Factor V Leiden mutation',
    difficulty: 'intermediate',
    category: 'hereditary'
  },
  {
    id: 'p11',
    name: 'Grace Williams',
    age: 19,
    gender: 'Female',
    symptoms: ['Heavy menstrual bleeding', 'Iron deficiency anemia', 'Easy bruising since childhood'],
    clinicalHistory: 'Lifelong heavy periods. Multiple family members with bleeding disorders. Responds poorly to hormonal therapy.',
    correctDiagnosis: 'Platelet function disorder',
    difficulty: 'intermediate',
    category: 'platelet'
  },
  {
    id: 'p12',
    name: 'Carlos Mendez',
    age: 61,
    gender: 'Male',
    symptoms: ['Spontaneous bleeding', 'Purpura', 'Splenomegaly', 'Bone pain'],
    clinicalHistory: 'Progressive symptoms over 6 months. Weight loss and night sweats. Pancytopenia on CBC.',
    correctDiagnosis: 'Myelodysplastic syndrome with bleeding',
    difficulty: 'advanced',
    category: 'acquired'
  }
];

export const getPatientsByDifficulty = (difficulty: 'beginner' | 'intermediate' | 'advanced'): Level2Patient[] => {
  return level2Patients.filter(patient => patient.difficulty === difficulty);
};

export const getPatientsByCategory = (category: string): Level2Patient[] => {
  return level2Patients.filter(patient => patient.category === category);
};

export const getRandomPatient = (): Level2Patient => {
  const randomIndex = Math.floor(Math.random() * level2Patients.length);
  return level2Patients[randomIndex];
};
