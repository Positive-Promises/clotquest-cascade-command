
import { AdaptiveLearningProfile, UserAction, PerformanceMetrics, LearningOutcome } from '@/types/enhancedTypes';

export class AdaptiveLearningEngine {
  private userProfiles: Map<string, AdaptiveLearningProfile> = new Map();
  private performanceHistory: Map<string, UserAction[]> = new Map();

  constructor() {
    this.initializeEngine();
  }

  private initializeEngine() {
    console.log('🧠 Adaptive Learning Engine initialized');
    // Initialize ML models, load training data, set up analytics
  }

  analyzeUserPerformance(userId: string, actions: UserAction[]): PerformanceMetrics {
    const totalActions = actions.length;
    const correctActions = actions.filter(action => action.accuracy).length;
    const averageResponseTime = actions.reduce((sum, action) => sum + action.responseTime, 0) / totalActions;
    const hintRequests = actions.filter(action => action.type === 'hint_request').length;
    
    const strugglingConcepts = this.identifyStrugglingConcepts(actions);
    const masteredConcepts = this.identifyMasteredConcepts(actions);
    const engagementScore = this.calculateEngagementScore(actions);

    return {
      overallAccuracy: correctActions / totalActions,
      averageResponseTime,
      hintUsageRate: hintRequests / totalActions,
      completionTime: this.calculateCompletionTime(actions),
      strugglingConcepts,
      masteredConcepts,
      engagementScore
    };
  }

  generatePersonalizedRecommendations(userId: string, metrics: PerformanceMetrics): string[] {
    const recommendations: string[] = [];
    
    if (metrics.overallAccuracy < 0.7) {
      recommendations.push('Focus on reviewing basic coagulation pathway concepts');
      recommendations.push('Try the tutorial mode for additional guidance');
    }
    
    if (metrics.averageResponseTime > 10000) {
      recommendations.push('Practice identifying factors more quickly');
      recommendations.push('Use visual mnemonics to improve recognition speed');
    }
    
    if (metrics.hintUsageRate > 0.5) {
      recommendations.push('Review factor positions before starting the next level');
      recommendations.push('Study the pathway legend more carefully');
    }
    
    if (metrics.engagementScore < 0.5) {
      recommendations.push('Try emergency mode for a more challenging experience');
      recommendations.push('Explore the detailed medical information for each factor');
    }

    return recommendations;
  }

  adaptDifficultyLevel(userId: string, currentLevel: number, metrics: PerformanceMetrics): number {
    let newLevel = currentLevel;
    
    // Increase difficulty if user is performing well
    if (metrics.overallAccuracy > 0.9 && metrics.averageResponseTime < 5000) {
      newLevel = Math.min(currentLevel + 1, 5);
    }
    
    // Decrease difficulty if user is struggling
    if (metrics.overallAccuracy < 0.6 || metrics.hintUsageRate > 0.7) {
      newLevel = Math.max(currentLevel - 1, 1);
    }
    
    console.log(`🎯 Difficulty adapted from ${currentLevel} to ${newLevel} for user ${userId}`);
    return newLevel;
  }

  predictLearningOutcomes(userId: string, metrics: PerformanceMetrics): LearningOutcome[] {
    const outcomes: LearningOutcome[] = [];
    
    // Predict mastery for each medical concept
    const concepts = [
      'intrinsic_pathway',
      'extrinsic_pathway',
      'common_pathway',
      'fibrinolysis',
      'anticoagulation'
    ];
    
    concepts.forEach(concept => {
      const masteryLevel = this.calculateMasteryLevel(concept, metrics);
      const retentionPrediction = this.predictRetention(masteryLevel);
      
      outcomes.push({
        conceptId: concept,
        conceptName: this.getConceptDisplayName(concept),
        masteryLevel,
        confidenceInterval: 0.85,
        retentionPrediction,
        recommendedReview: this.calculateReviewDate(retentionPrediction)
      });
    });
    
    return outcomes;
  }

  private identifyStrugglingConcepts(actions: UserAction[]): string[] {
    const conceptErrors = new Map<string, number>();
    
    actions.forEach(action => {
      if (!action.accuracy && action.factorId) {
        const concept = this.getConceptFromFactor(action.factorId);
        conceptErrors.set(concept, (conceptErrors.get(concept) || 0) + 1);
      }
    });
    
    return Array.from(conceptErrors.entries())
      .filter(([_, errors]) => errors >= 2)
      .map(([concept, _]) => concept);
  }

  private identifyMasteredConcepts(actions: UserAction[]): string[] {
    const conceptSuccess = new Map<string, { correct: number; total: number }>();
    
    actions.forEach(action => {
      if (action.factorId) {
        const concept = this.getConceptFromFactor(action.factorId);
        const stats = conceptSuccess.get(concept) || { correct: 0, total: 0 };
        
        if (action.accuracy) stats.correct++;
        stats.total++;
        
        conceptSuccess.set(concept, stats);
      }
    });
    
    return Array.from(conceptSuccess.entries())
      .filter(([_, stats]) => stats.total >= 3 && stats.correct / stats.total >= 0.9)
      .map(([concept, _]) => concept);
  }

  private calculateEngagementScore(actions: UserAction[]): number {
    // Factor in various engagement indicators
    const infoViews = actions.filter(a => a.type === 'info_view').length;
    const quickResponses = actions.filter(a => a.responseTime < 3000).length;
    const totalActions = actions.length;
    
    const infoEngagement = Math.min(infoViews / (totalActions * 0.3), 1);
    const responseEngagement = quickResponses / totalActions;
    
    return (infoEngagement + responseEngagement) / 2;
  }

  private calculateCompletionTime(actions: UserAction[]): number {
    if (actions.length === 0) return 0;
    const firstAction = Math.min(...actions.map(a => a.timestamp.getTime()));
    const lastAction = Math.max(...actions.map(a => a.timestamp.getTime()));
    return lastAction - firstAction;
  }

  private getConceptFromFactor(factorId: string): string {
    const conceptMap: Record<string, string> = {
      'f12': 'intrinsic_pathway',
      'f11': 'intrinsic_pathway',
      'f9': 'intrinsic_pathway',
      'f8': 'intrinsic_pathway',
      'f7': 'extrinsic_pathway',
      'tf': 'extrinsic_pathway',
      'f10': 'common_pathway',
      'f5': 'common_pathway',
      'f2': 'common_pathway',
      'fibrinogen': 'common_pathway',
      'fibrin': 'common_pathway',
      'f13': 'common_pathway',
      'plasminogen': 'fibrinolysis',
      'tpa': 'fibrinolysis',
      'antithrombin': 'anticoagulation',
      'protein_c': 'anticoagulation'
    };
    
    return conceptMap[factorId] || 'unknown';
  }

  private calculateMasteryLevel(concept: string, metrics: PerformanceMetrics): number {
    if (metrics.masteredConcepts.includes(concept)) return 0.9;
    if (metrics.strugglingConcepts.includes(concept)) return 0.3;
    return 0.6; // Default intermediate level
  }

  private predictRetention(masteryLevel: number): number {
    // Simplified retention prediction based on mastery level
    return Math.max(0.2, masteryLevel * 0.8);
  }

  private calculateReviewDate(retentionPrediction: number): Date {
    const daysUntilReview = Math.ceil((1 - retentionPrediction) * 30);
    const reviewDate = new Date();
    reviewDate.setDate(reviewDate.getDate() + daysUntilReview);
    return reviewDate;
  }

  private getConceptDisplayName(concept: string): string {
    const displayNames: Record<string, string> = {
      'intrinsic_pathway': 'Intrinsic Coagulation Pathway',
      'extrinsic_pathway': 'Extrinsic Coagulation Pathway',
      'common_pathway': 'Common Coagulation Pathway',
      'fibrinolysis': 'Fibrinolytic System',
      'anticoagulation': 'Natural Anticoagulants'
    };
    
    return displayNames[concept] || concept;
  }
}

export const adaptiveLearningEngine = new AdaptiveLearningEngine();
