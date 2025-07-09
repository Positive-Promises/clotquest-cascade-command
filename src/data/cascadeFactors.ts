import { Factor } from '@/types/cascadeTypes';

export const level1Factors: Factor[] = [
  {
    id: 'factor12',
    name: 'Factor XII',
    fullName: 'Hageman Factor (Contact Factor)',
    pathway: 'intrinsic',
    position: null,
    description: 'Initiates the intrinsic pathway when activated by contact with negatively charged surfaces like collagen or glass',
    color: 'bg-blue-500',
    isPlaced: false,
    correctPosition: { x: 50, y: 100 },
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
    id: 'factor11',
    name: 'Factor XI',
    fullName: 'Plasma Thromboplastin Antecedent',
    pathway: 'intrinsic',
    position: null,
    description: 'Activated by Factor XIIa and also by thrombin in a positive feedback loop. Activates Factor IX.',
    color: 'bg-blue-600',
    isPlaced: false,
    correctPosition: { x: 50, y: 180 },
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
    id: 'factor9',
    name: 'Factor IX',
    fullName: 'Christmas Factor',
    pathway: 'intrinsic',
    position: null,
    description: 'Vitamin K-dependent factor, key component of the intrinsic pathway. Forms tenase complex with Factor VIIIa.',
    color: 'bg-blue-700',
    isPlaced: false,
    correctPosition: { x: 50, y: 260 },
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
    id: 'factor8',
    name: 'Factor VIII',
    fullName: 'Antihemophilic Factor',
    pathway: 'intrinsic',
    position: null,
    description: 'Essential cofactor for Factor IXa in the tenase complex. Activated by thrombin and Factor Xa.',
    color: 'bg-blue-800',
    isPlaced: false,
    correctPosition: { x: 120, y: 260 },
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
    id: 'factor7',
    name: 'Factor VII',
    fullName: 'Proconvertin (Stable Factor)',
    pathway: 'extrinsic',
    position: null,
    description: 'Vitamin K-dependent factor activated by tissue factor. Initiates extrinsic pathway after tissue injury.',
    color: 'bg-green-500',
    isPlaced: false,
    correctPosition: { x: 450, y: 180 },
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
    id: 'tissueFactor',
    name: 'Tissue Factor',
    fullName: 'Factor III (Thromboplastin)',
    pathway: 'extrinsic',
    position: null,
    description: 'Membrane-bound glycoprotein released by damaged tissue. Forms complex with Factor VII to initiate coagulation.',
    color: 'bg-green-600',
    isPlaced: false,
    correctPosition: { x: 450, y: 100 },
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
    id: 'factor3',
    name: 'Factor III',
    fullName: 'Tissue Factor Complex',
    pathway: 'extrinsic',
    position: null,
    description: 'Active tissue factor-factor VII complex that initiates the extrinsic pathway.',
    color: 'bg-green-700',
    isPlaced: false,
    correctPosition: { x: 450, y: 260 },
    clinicalRelevance: 'Forms the primary activation complex for extrinsic pathway initiation.',
    deficiencyDisorder: 'Related to tissue factor pathway disorders',
    normalRange: 'Activity measured through PT/INR',
    antagonisticAgents: ['TFPI', 'Warfarin', 'Direct factor VIIa inhibitors'],
    referenceLinks: [
      {
        title: 'Tissue Factor Pathway',
        url: 'https://pubmed.ncbi.nlm.nih.gov/28436116/',
        type: 'pubmed'
      }
    ]
  },
  {
    id: 'factor10',
    name: 'Factor X',
    fullName: 'Stuart-Prower Factor',
    pathway: 'common',
    position: null,
    description: 'Vitamin K-dependent factor, convergence point of intrinsic and extrinsic pathways. Forms prothrombinase complex.',
    color: 'bg-purple-500',
    isPlaced: false,
    correctPosition: { x: 250, y: 340 },
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
    id: 'factor5',
    name: 'Factor V',
    fullName: 'Proaccelerin (Labile Factor)',
    pathway: 'common',
    position: null,
    description: 'Non-enzymatic cofactor for Factor Xa in the prothrombinase complex. Essential for thrombin generation.',
    color: 'bg-purple-600',
    isPlaced: false,
    correctPosition: { x: 320, y: 340 },
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
    id: 'factor2',
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
    id: 'factor1',
    name: 'Factor I',
    fullName: 'Fibrinogen',
    pathway: 'common',
    position: null,
    description: 'Soluble plasma protein converted to insoluble fibrin by thrombin. Forms the structural basis of blood clots.',
    color: 'bg-red-500',
    isPlaced: false,
    correctPosition: { x: 320, y: 420 },
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
    id: 'fibrinogen',
    name: 'Fibrinogen',
    fullName: 'Factor I',
    pathway: 'common',
    position: null,
    description: 'Soluble plasma protein converted to insoluble fibrin by thrombin. Forms the structural basis of blood clots.',
    color: 'bg-red-500',
    isPlaced: false,
    correctPosition: { x: 250, y: 500 },
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
    id: 'factor13',
    name: 'Factor XIII',
    fullName: 'Fibrin Stabilizing Factor',
    pathway: 'common',
    position: null,
    description: 'Transglutaminase enzyme that cross-links fibrin polymers, stabilizing the clot structure.',
    color: 'bg-red-700',
    isPlaced: false,
    correctPosition: { x: 320, y: 500 },
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
  {
    id: 'prekallikrein',
    name: 'Prekallikrein',
    fullName: 'Fletcher Factor',
    pathway: 'intrinsic',
    position: null,
    description: 'Contact system component that works with HMWK to activate Factor XII.',
    color: 'bg-blue-400',
    isPlaced: false,
    correctPosition: { x: 120, y: 100 },
    clinicalRelevance: 'Deficiency prolongs aPTT but rarely causes bleeding.',
    deficiencyDisorder: 'Prekallikrein deficiency (Fletcher factor deficiency)',
    normalRange: '50-150% of pooled normal plasma',
    antagonisticAgents: ['C1 esterase inhibitor', 'Alpha-2 antiplasmin'],
    referenceLinks: [
      {
        title: 'Prekallikrein and Contact System',
        url: 'https://pubmed.ncbi.nlm.nih.gov/28436116/',
        type: 'pubmed'
      }
    ]
  },
  {
    id: 'hmwk',
    name: 'HMWK',
    fullName: 'High Molecular Weight Kininogen',
    pathway: 'intrinsic',
    position: null,
    description: 'Contact system cofactor essential for Factor XII activation and surface binding.',
    color: 'bg-blue-300',
    isPlaced: false,
    correctPosition: { x: 120, y: 180 },
    clinicalRelevance: 'Deficiency causes prolonged aPTT with minimal bleeding tendency.',
    deficiencyDisorder: 'HMWK deficiency (Williams-Fitzgerald-Flaujeac trait)',
    normalRange: '50-150% of pooled normal plasma',
    antagonisticAgents: ['Carboxypeptidase N', 'Angiotensin converting enzyme'],
    referenceLinks: [
      {
        title: 'HMWK in Coagulation',
        url: 'https://pubmed.ncbi.nlm.nih.gov/25472749/',
        type: 'pubmed'
      }
    ]
  },
  {
    id: 'antithrombin',
    name: 'Antithrombin III',
    fullName: 'Antithrombin III (ATIII)',
    pathway: 'regulatory',
    position: null,
    description: 'Primary natural anticoagulant that inhibits thrombin and Factor Xa. Enhanced by heparin.',
    color: 'bg-cyan-500',
    isPlaced: false,
    correctPosition: { x: 50, y: 420 },
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
    id: 'proteinC',
    name: 'Protein C',
    fullName: 'Protein C (Anticoagulant)',
    pathway: 'regulatory',
    position: null,
    description: 'Vitamin K-dependent anticoagulant protein that inactivates factors Va and VIIIa when activated.',
    color: 'bg-cyan-600',
    isPlaced: false,
    correctPosition: { x: 400, y: 420 },
    clinicalRelevance: 'Key natural anticoagulant. Deficiency causes severe thrombophilia and neonatal purpura fulminans.',
    deficiencyDisorder: 'Protein C deficiency (hereditary thrombophilia)',
    normalRange: '70-140% of pooled normal plasma',
    antagonisticAgents: ['Warfarin', 'Vitamin K antagonists'],
    activatedBy: 'Thrombin-thrombomodulin complex',
    referenceLinks: [
      {
        title: 'Protein C Deficiency and Thrombosis',
        url: 'https://pubmed.ncbi.nlm.nih.gov/28301907/',
        type: 'pubmed'
      }
    ]
  },
  {
    id: 'proteinS',
    name: 'Protein S',
    fullName: 'Protein S (Cofactor)',
    pathway: 'regulatory',
    position: null,
    description: 'Vitamin K-dependent cofactor for activated Protein C. Essential for anticoagulant activity.',
    color: 'bg-cyan-700',
    isPlaced: false,
    correctPosition: { x: 470, y: 420 },
    clinicalRelevance: 'Cofactor for Protein C. Deficiency causes thrombophilia and increased clotting risk.',
    deficiencyDisorder: 'Protein S deficiency (hereditary thrombophilia)',
    normalRange: '65-140% of pooled normal plasma',
    antagonisticAgents: ['Warfarin', 'Vitamin K antagonists'],
    cofactorFor: 'Activated Protein C',
    referenceLinks: [
      {
        title: 'Protein S Deficiency',
        url: 'https://pubmed.ncbi.nlm.nih.gov/25472749/',
        type: 'pubmed'
      }
    ]
  }
];

// Add the legacy export for backward compatibility
export const factors = level1Factors;
