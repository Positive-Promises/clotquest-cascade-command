
export interface Factor {
  id: string;
  name: string;
  fullName: string;
  pathway: 'intrinsic' | 'extrinsic' | 'common' | 'fibrinolysis' | 'regulatory';
  position: { x: number; y: number } | null;
  description: string;
  color: string;
  isPlaced: boolean;
  correctPosition: { x: number; y: number };
  clinicalRelevance: string;
  deficiencyDisorder: string;
  normalRange: string;
  antagonisticAgents: string[];
  cofactorFor?: string;
  activatedBy?: string;
  referenceLinks: Array<{
    title: string;
    url: string;
    type: 'pubmed' | 'textbook' | 'video';
  }>;
}

export const level1Factors: Factor[] = [
  {
    id: 'f12',
    name: 'Factor XII',
    fullName: 'Hageman Factor (Contact Factor)',
    pathway: 'intrinsic',
    position: null,
    description: 'Initiates the intrinsic pathway when activated by contact with negatively charged surfaces like collagen or glass',
    color: 'bg-blue-500',
    isPlaced: false,
    correctPosition: { x: 150, y: 50 },
    clinicalRelevance: 'Deficiency rarely causes bleeding but prolongs aPTT. Important in laboratory activation of coagulation cascade.',
    deficiencyDisorder: 'Factor XII deficiency (usually asymptomatic)',
    normalRange: '50-150% of pooled normal plasma',
    antagonisticAgents: ['C1 esterase inhibitor', 'Corn trypsin inhibitor', 'Antithrombin III'],
    referenceLinks: [
      {
        title: 'Factor XII and Contact Activation',
        url: 'https://pubmed.ncbi.nlm.nih.gov/25861491/',
        type: 'pubmed'
      }
    ]
  },
  {
    id: 'f11',
    name: 'Factor XI',
    fullName: 'Plasma Thromboplastin Antecedent',
    pathway: 'intrinsic',
    position: null,
    description: 'Activated by Factor XIIa and also by thrombin in a positive feedback loop. Activates Factor IX.',
    color: 'bg-blue-600',
    isPlaced: false,
    correctPosition: { x: 150, y: 120 },
    clinicalRelevance: 'Deficiency causes mild to moderate bleeding, especially after trauma or surgery. Common in Ashkenazi Jewish population.',
    deficiencyDisorder: 'Hemophilia C (Factor XI deficiency)',
    normalRange: '50-150% of pooled normal plasma',
    antagonisticAgents: ['Antithrombin III', 'Protein Z-dependent protease inhibitor', 'C1 esterase inhibitor'],
    referenceLinks: [
      {
        title: 'Factor XI Deficiency',
        url: 'https://pubmed.ncbi.nlm.nih.gov/29920516/',
        type: 'pubmed'
      }
    ]
  },
  {
    id: 'f9',
    name: 'Factor IX',
    fullName: 'Christmas Factor',
    pathway: 'intrinsic',
    position: null,
    description: 'Vitamin K-dependent factor, key component of the intrinsic pathway. Forms tenase complex with Factor VIIIa.',
    color: 'bg-blue-700',
    isPlaced: false,
    correctPosition: { x: 150, y: 190 },
    clinicalRelevance: 'Deficiency causes Hemophilia B, an X-linked bleeding disorder affecting males primarily.',
    deficiencyDisorder: 'Hemophilia B (Christmas Disease)',
    normalRange: '50-150% of pooled normal plasma',
    antagonisticAgents: ['Antithrombin III', 'Heparin cofactor II', 'Tissue factor pathway inhibitor'],
    referenceLinks: [
      {
        title: 'Hemophilia B: Christmas Disease',
        url: 'https://pubmed.ncbi.nlm.nih.gov/30620421/',
        type: 'pubmed'
      }
    ]
  },
  {
    id: 'f8',
    name: 'Factor VIII',
    fullName: 'Antihemophilic Factor',
    pathway: 'intrinsic',
    position: null,
    description: 'Essential cofactor for Factor IXa in the tenase complex. Activated by thrombin and Factor Xa.',
    color: 'bg-blue-800',
    isPlaced: false,
    correctPosition: { x: 100, y: 240 },
    clinicalRelevance: 'Deficiency causes Hemophilia A, the most common severe bleeding disorder.',
    deficiencyDisorder: 'Hemophilia A (Classic Hemophilia)',
    normalRange: '50-150% of pooled normal plasma',
    antagonisticAgents: ['Activated Protein C', 'Factor IXa inhibitor', 'Anti-Factor VIII antibodies'],
    cofactorFor: 'Factor IX',
    activatedBy: 'Thrombin, Factor Xa',
    referenceLinks: [
      {
        title: 'Factor VIII Structure and Function',
        url: 'https://pubmed.ncbi.nlm.nih.gov/29273045/',
        type: 'pubmed'
      }
    ]
  },
  {
    id: 'f7',
    name: 'Factor VII',
    fullName: 'Proconvertin (Stable Factor)',
    pathway: 'extrinsic',
    position: null,
    description: 'Vitamin K-dependent factor activated by tissue factor. Initiates extrinsic pathway after tissue injury.',
    color: 'bg-green-500',
    isPlaced: false,
    correctPosition: { x: 350, y: 120 },
    clinicalRelevance: 'First factor to decrease with warfarin therapy. Deficiency causes bleeding similar to hemophilia.',
    deficiencyDisorder: 'Factor VII deficiency (rare autosomal recessive)',
    normalRange: '50-150% of pooled normal plasma',
    antagonisticAgents: ['Tissue factor pathway inhibitor (TFPI)', 'Antithrombin III', 'Warfarin'],
    referenceLinks: [
      {
        title: 'Factor VII Deficiency',
        url: 'https://pubmed.ncbi.nlm.nih.gov/28301907/',
        type: 'pubmed'
      }
    ]
  },
  {
    id: 'tf',
    name: 'Tissue Factor',
    fullName: 'Factor III (Thromboplastin)',
    pathway: 'extrinsic',
    position: null,
    description: 'Membrane-bound glycoprotein released by damaged tissue. Forms complex with Factor VII to initiate coagulation.',
    color: 'bg-green-600',
    isPlaced: false,
    correctPosition: { x: 350, y: 50 },
    clinicalRelevance: 'Primary initiator of hemostasis. Expression increased in inflammation, cancer, and atherosclerosis.',
    deficiencyDisorder: 'No hereditary deficiency described (incompatible with life)',
    normalRange: 'Not routinely measured in clinical practice',
    antagonisticAgents: ['Tissue factor pathway inhibitor (TFPI)', 'Anti-tissue factor antibodies'],
    referenceLinks: [
      {
        title: 'Tissue Factor in Hemostasis',
        url: 'https://pubmed.ncbi.nlm.nih.gov/31648335/',
        type: 'pubmed'
      }
    ]
  },
  {
    id: 'f10',
    name: 'Factor X',
    fullName: 'Stuart-Prower Factor',
    pathway: 'common',
    position: null,
    description: 'Vitamin K-dependent factor, convergence point of intrinsic and extrinsic pathways. Forms prothrombinase complex.',
    color: 'bg-purple-500',
    isPlaced: false,
    correctPosition: { x: 250, y: 280 },
    clinicalRelevance: 'Critical convergence point. Deficiency causes moderate to severe bleeding disorder.',
    deficiencyDisorder: 'Factor X deficiency (rare autosomal recessive)',
    normalRange: '50-150% of pooled normal plasma',
    antagonisticAgents: ['Antithrombin III', 'Tissue factor pathway inhibitor', 'Direct Factor Xa inhibitors (Rivaroxaban, Apixaban)'],
    referenceLinks: [
      {
        title: 'Factor X Structure and Function',
        url: 'https://pubmed.ncbi.nlm.nih.gov/26990094/',
        type: 'pubmed'
      }
    ]
  },
  {
    id: 'f5',
    name: 'Factor V',
    fullName: 'Proaccelerin (Labile Factor)',
    pathway: 'common',
    position: null,
    description: 'Non-enzymatic cofactor for Factor Xa in the prothrombinase complex. Essential for thrombin generation.',
    color: 'bg-purple-600',
    isPlaced: false,
    correctPosition: { x: 200, y: 350 },
    clinicalRelevance: 'Factor V Leiden mutation causes activated protein C resistance and thrombophilia.',
    deficiencyDisorder: 'Factor V deficiency (parahemophilia) or Factor V Leiden (thrombophilia)',
    normalRange: '50-150% of pooled normal plasma',
    antagonisticAgents: ['Activated Protein C', 'Protein S', 'Anti-Factor V antibodies'],
    cofactorFor: 'Factor X',
    activatedBy: 'Thrombin',
    referenceLinks: [
      {
        title: 'Factor V Leiden and Thrombosis',
        url: 'https://pubmed.ncbi.nlm.nih.gov/29923465/',
        type: 'pubmed'
      }
    ]
  },
  {
    id: 'f2',
    name: 'Factor II',
    fullName: 'Prothrombin',
    pathway: 'common',
    position: null,
    description: 'Vitamin K-dependent zymogen converted to thrombin by prothrombinase complex. Central enzyme of hemostasis.',
    color: 'bg-purple-700',
    isPlaced: false,
    correctPosition: { x: 250, y: 420 },
    clinicalRelevance: 'Thrombin has multiple functions: converts fibrinogen to fibrin, activates factors V, VIII, XI, and XIII.',
    deficiencyDisorder: 'Prothrombin deficiency (very rare) or Prothrombin G20210A mutation (thrombophilia)',
    normalRange: '80-120% of pooled normal plasma',
    antagonisticAgents: ['Antithrombin III', 'Heparin', 'Direct thrombin inhibitors (Dabigatran)', 'Hirudin'],
    referenceLinks: [
      {
        title: 'Thrombin Generation and Function',
        url: 'https://pubmed.ncbi.nlm.nih.gov/25854643/',
        type: 'pubmed'
      }
    ]
  },
  {
    id: 'fibrinogen',
    name: 'Fibrinogen',
    fullName: 'Factor I',
    pathway: 'common',
    position: null,
    description: 'Soluble plasma protein converted to insoluble fibrin by thrombin. Forms the structural basis of blood clots.',
    color: 'bg-red-500',
    isPlaced: false,
    correctPosition: { x: 250, y: 490 },
    clinicalRelevance: 'Acute phase reactant. Low levels cause bleeding; high levels increase thrombotic risk.',
    deficiencyDisorder: 'Afibrinogenemia, hypofibrinogenemia, or dysfibrinogenemia',
    normalRange: '200-400 mg/dL (2.0-4.0 g/L)',
    antagonisticAgents: ['Fibrinolytic agents (tPA, Streptokinase)', 'Plasmin', 'Anti-fibrinogen antibodies'],
    referenceLinks: [
      {
        title: 'Fibrinogen Disorders',
        url: 'https://pubmed.ncbi.nlm.nih.gov/29436322/',
        type: 'pubmed'
      }
    ]
  },
  {
    id: 'fibrin',
    name: 'Fibrin',
    fullName: 'Polymerized Fibrin',
    pathway: 'common',
    position: null,
    description: 'Insoluble protein polymer formed from fibrinogen by thrombin action. Forms the mesh structure of blood clots.',
    color: 'bg-red-600',
    isPlaced: false,
    correctPosition: { x: 250, y: 550 },
    clinicalRelevance: 'Final product of coagulation cascade. Forms stable hemostatic plug with platelets.',
    deficiencyDisorder: 'Dysfibrinogenemia can affect fibrin polymerization',
    normalRange: 'Not directly measured; assessed through fibrinogen levels',
    antagonisticAgents: ['Plasmin', 'Fibrinolytic therapy (tPA, urokinase)', 'Antifibrin antibodies'],
    activatedBy: 'Thrombin',
    referenceLinks: [
      {
        title: 'Fibrin Formation and Structure',
        url: 'https://pubmed.ncbi.nlm.nih.gov/28420295/',
        type: 'pubmed'
      }
    ]
  },
  {
    id: 'f13',
    name: 'Factor XIII',
    fullName: 'Fibrin Stabilizing Factor',
    pathway: 'common',
    position: null,
    description: 'Transglutaminase enzyme that cross-links fibrin polymers, stabilizing the clot structure.',
    color: 'bg-red-700',
    isPlaced: false,
    correctPosition: { x: 300, y: 590 },
    clinicalRelevance: 'Essential for clot stability. Deficiency causes delayed bleeding and poor wound healing.',
    deficiencyDisorder: 'Factor XIII deficiency (rare, causes delayed bleeding)',
    normalRange: '70-140% of pooled normal plasma',
    antagonisticAgents: ['Transglutaminase inhibitors', 'Anti-Factor XIII antibodies'],
    activatedBy: 'Thrombin',
    referenceLinks: [
      {
        title: 'Factor XIII and Clot Stabilization',
        url: 'https://pubmed.ncbi.nlm.nih.gov/26621325/',
        type: 'pubmed'
      }
    ]
  },
  // Fibrinolysis System
  {
    id: 'plasminogen',
    name: 'Plasminogen',
    fullName: 'Plasmin Precursor',
    pathway: 'fibrinolysis',
    position: null,
    description: 'Zymogen that is converted to plasmin, the primary fibrinolytic enzyme.',
    color: 'bg-orange-500',
    isPlaced: false,
    correctPosition: { x: 450, y: 500 },
    clinicalRelevance: 'Key component of fibrinolytic system. Deficiency causes thrombotic complications.',
    deficiencyDisorder: 'Plasminogen deficiency (ligneous conjunctivitis syndrome)',
    normalRange: '75-150% of pooled normal plasma',
    antagonisticAgents: ['Plasminogen activator inhibitor-1 (PAI-1)', 'α2-antiplasmin', 'Tranexamic acid'],
    activatedBy: 'tPA, urokinase',
    referenceLinks: [
      {
        title: 'Plasminogen and Fibrinolysis',
        url: 'https://pubmed.ncbi.nlm.nih.gov/27363882/',
        type: 'pubmed'
      }
    ]
  },
  {
    id: 'tpa',
    name: 'tPA',
    fullName: 'Tissue Plasminogen Activator',
    pathway: 'fibrinolysis',
    position: null,
    description: 'Serine protease that converts plasminogen to plasmin, initiating fibrinolysis.',
    color: 'bg-orange-600',
    isPlaced: false,
    correctPosition: { x: 400, y: 450 },
    clinicalRelevance: 'Primary endogenous fibrinolytic activator. Used therapeutically for stroke and MI.',
    deficiencyDisorder: 'tPA deficiency (rare, causes thrombotic tendency)',
    normalRange: '1-12 ng/mL',
    antagonisticAgents: ['PAI-1', 'PAI-2', 'Neuroserpin'],
    referenceLinks: [
      {
        title: 'tPA in Fibrinolysis and Therapy',
        url: 'https://pubmed.ncbi.nlm.nih.gov/28851729/',
        type: 'pubmed'
      }
    ]
  },
  // Regulatory Factors
  {
    id: 'antithrombin',
    name: 'Antithrombin III',
    fullName: 'Antithrombin III (ATIII)',
    pathway: 'regulatory',
    position: null,
    description: 'Primary natural anticoagulant that inhibits thrombin and Factor Xa. Enhanced by heparin.',
    color: 'bg-cyan-500',
    isPlaced: false,
    correctPosition: { x: 100, y: 400 },
    clinicalRelevance: 'Major natural anticoagulant. Deficiency causes thrombophilia and heparin resistance.',
    deficiencyDisorder: 'Antithrombin deficiency (hereditary thrombophilia)',
    normalRange: '80-120% of pooled normal plasma',
    antagonisticAgents: ['Heparin (enhances activity)', 'Low molecular weight heparin'],
    referenceLinks: [
      {
        title: 'Antithrombin and Natural Anticoagulation',
        url: 'https://pubmed.ncbi.nlm.nih.gov/25472749/',
        type: 'pubmed'
      }
    ]
  },
  {
    id: 'protein_c',
    name: 'Protein C',
    fullName: 'Protein C System',
    pathway: 'regulatory',
    position: null,
    description: 'Vitamin K-dependent anticoagulant protein that inactivates Factors Va and VIIIa.',
    color: 'bg-cyan-600',
    isPlaced: false,
    correctPosition: { x: 50, y: 350 },
    clinicalRelevance: 'Natural anticoagulant. Deficiency causes thrombophilia. Resistance causes Factor V Leiden.',
    deficiencyDisorder: 'Protein C deficiency (hereditary thrombophilia)',
    normalRange: '70-140% of pooled normal plasma',
    antagonisticAgents: ['Warfarin (decreases levels)', 'Protein C inhibitor'],
    referenceLinks: [
      {
        title: 'Protein C Pathway',
        url: 'https://pubmed.ncbi.nlm.nih.gov/28436116/',
        type: 'pubmed'
      }
    ]
  }
];
