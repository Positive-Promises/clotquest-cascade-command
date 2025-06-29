
// Enhanced type definitions for the upgraded game platform

export interface AdaptiveLearningProfile {
  userId: string;
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  difficultyPreference: number; // 0-1 scale
  averageResponseTime: number;
  accuracyRate: number;
  strengthAreas: string[];
  improvementAreas: string[];
  personalizedPath: LearningPathNode[];
}

export interface LearningPathNode {
  id: string;
  concept: string;
  prerequisites: string[];
  difficulty: number;
  estimatedDuration: number;
  completionStatus: 'not_started' | 'in_progress' | 'completed' | 'needs_review';
}

export interface GameAnalytics {
  sessionId: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  actions: UserAction[];
  performanceMetrics: PerformanceMetrics;
  learningOutcomes: LearningOutcome[];
}

export interface UserAction {
  timestamp: Date;
  type: 'factor_select' | 'factor_place' | 'hint_request' | 'info_view' | 'mistake';
  factorId?: string;
  position?: { x: number; y: number };
  responseTime: number;
  accuracy: boolean;
  context: Record<string, any>;
}

export interface PerformanceMetrics {
  overallAccuracy: number;
  averageResponseTime: number;
  hintUsageRate: number;
  completionTime: number;
  strugglingConcepts: string[];
  masteredConcepts: string[];
  engagementScore: number; // 0-1 scale
}

export interface LearningOutcome {
  conceptId: string;
  conceptName: string;
  masteryLevel: number; // 0-1 scale
  confidenceInterval: number;
  retentionPrediction: number;
  recommendedReview: Date;
}

export interface ThreeDVisualization {
  moleculeId: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: number;
  animationState: 'idle' | 'rotating' | 'highlighting' | 'dissolving';
  interactionEnabled: boolean;
}

export interface AudioConfiguration {
  masterVolume: number;
  musicVolume: number;
  effectsVolume: number;
  narrationVolume: number;
  spatialAudioEnabled: boolean;
  accessibilityAudioEnabled: boolean;
  currentSoundscape: 'laboratory' | 'hospital' | 'classroom' | 'ambient';
}

export interface AccessibilitySettings {
  screenReaderEnabled: boolean;
  highContrastMode: boolean;
  largeTextMode: boolean;
  colorBlindSupport: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  motorAssistance: boolean;
  keyboardNavigationOnly: boolean;
  reducedMotion: boolean;
  audioDescriptions: boolean;
}

export interface MultiplayerSession {
  sessionId: string;
  hostId: string;
  participants: Participant[];
  gameMode: 'collaborative' | 'competitive' | 'instructor_led';
  currentLevel: number;
  sharedState: SharedGameState;
  communication: CommunicationChannel;
}

export interface Participant {
  userId: string;
  displayName: string;
  role: 'student' | 'instructor' | 'observer';
  isReady: boolean;
  currentScore: number;
  contributions: ContributionRecord[];
}

export interface SharedGameState {
  placedFactors: Factor[];
  collaborativeFactors: CollaborativeFactor[];
  sharedHints: SharedHint[];
  groupProgress: number;
  consensusRequired: boolean;
}

export interface CollaborativeFactor extends Factor {
  placedBy: string;
  approvedBy: string[];
  disputed: boolean;
  discussionThread: DiscussionMessage[];
}

export interface DiscussionMessage {
  userId: string;
  timestamp: Date;
  message: string;
  type: 'suggestion' | 'question' | 'correction' | 'approval';
}

export interface VRConfiguration {
  headsetType: 'oculus' | 'vive' | 'mixed_reality' | 'mobile_vr';
  handTrackingEnabled: boolean;
  roomScale: boolean;
  comfortSettings: {
    teleportMovement: boolean;
    snapTurning: boolean;
    vignetting: boolean;
  };
  hapticFeedback: boolean;
}

export interface AssessmentFramework {
  assessmentId: string;
  type: 'formative' | 'summative' | 'diagnostic';
  competencies: MedicalCompetency[];
  rubric: AssessmentRubric;
  adaptiveScoring: boolean;
  realTimeAnalytics: boolean;
}

export interface MedicalCompetency {
  id: string;
  name: string;
  description: string;
  level: 'novice' | 'advanced_beginner' | 'competent' | 'proficient' | 'expert';
  measurableOutcomes: string[];
  assessmentCriteria: AssessmentCriterion[];
}

export interface AssessmentCriterion {
  id: string;
  description: string;
  weight: number;
  scoringMethod: 'binary' | 'scale' | 'rubric';
  passingThreshold: number;
}

// Enhanced Factor type with 3D and AI capabilities
export interface EnhancedFactor extends Factor {
  // 3D Visualization properties
  threeDModel?: {
    modelPath: string;
    animations: string[];
    interactionPoints: { x: number; y: number; z: number }[];
    scaleFactor: number;
  };
  
  // AI Learning properties
  difficultyWeight: number;
  commonMistakes: string[];
  learningHints: HintLevel[];
  prerequisiteKnowledge: string[];
  
  // Accessibility properties
  audioDescription: string;
  tactileFeedback?: {
    pattern: 'pulse' | 'vibrate' | 'tap';
    intensity: number;
  };
  
  // Collaboration properties
  collaborativeComplexity: number;
  discussionPrompts: string[];
  
  // Assessment properties
  assessmentWeight: number;
  competencyMapping: string[];
}

export interface HintLevel {
  level: 1 | 2 | 3 | 4 | 5;
  content: string;
  type: 'text' | 'visual' | 'audio' | 'interactive';
  prerequisite?: string;
  adaptiveContent: Record<string, string>; // Keyed by learning style
}
