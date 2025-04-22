import { PHYSICAL_HEALTH_QUESTIONS, LIKERT_SCALE, calculateHealthScore, getHealthLevel } from '../config/assessmentQuestions.js';
import { StorageService } from './StorageService.js';
import { UIService } from './UIService.js';

export class HealthAssessmentService {
  static async conductHealthAssessment() {
    const responses = {};
    let currentCategory = 0;
    const categories = Object.keys(PHYSICAL_HEALTH_QUESTIONS);
    
    // Show welcome message
    await UIService.showMessage(
      "Health Assessment",
      "Welcome to your physical health assessment! This will help us understand your current habits and create a personalized plan for improvement. Please answer each question honestly - there are no right or wrong answers."
    );

    // Conduct assessment for each category
    for (const category of categories) {
      await this.assessCategory(category, responses);
    }

    // Calculate final score
    const score = calculateHealthScore(responses);
    const level = getHealthLevel(score);

    // Save assessment results
    const assessmentResults = {
      score,
      level,
      responses,
      completedAt: new Date().toISOString()
    };

    StorageService.saveAssessmentResults(assessmentResults);

    // Show results
    await this.showAssessmentResults(assessmentResults);

    return assessmentResults;
  }

  static async assessCategory(category, responses) {
    const questions = PHYSICAL_HEALTH_QUESTIONS[category];
    
    // Show category introduction
    await UIService.showMessage(
      `${category} Assessment`,
      `Let's assess your ${category.toLowerCase()} habits. Please answer each question based on your current lifestyle.`
    );

    // Ask each question
    for (const question of questions) {
      const response = await this.askQuestion(question);
      responses[question.id] = response;
    }
  }

  static async askQuestion(question) {
    const options = LIKERT_SCALE.map(scale => ({
      value: scale.value,
      label: scale.label
    }));

    const response = await UIService.showQuestion(
      question.question,
      options,
      "Select your response"
    );

    return response;
  }

  static async showAssessmentResults(results) {
    const { score, level, responses } = results;
    
    // Calculate category scores
    const categoryScores = {};
    Object.keys(PHYSICAL_HEALTH_QUESTIONS).forEach(category => {
      const categoryQuestions = PHYSICAL_HEALTH_QUESTIONS[category];
      let categoryScore = 0;
      let maxScore = 0;

      categoryQuestions.forEach(question => {
        const response = responses[question.id];
        if (response) {
          categoryScore += response * question.weight;
          maxScore += 5 * question.weight;
        }
      });

      categoryScores[category] = Math.round((categoryScore / maxScore) * 100);
    });

    // Show results message
    await UIService.showMessage(
      "Assessment Complete!",
      `Your overall health score is ${score}/100, placing you at the ${level} level.\n\n` +
      "Category Scores:\n" +
      Object.entries(categoryScores)
        .map(([category, score]) => `${category}: ${score}%`)
        .join("\n") +
      "\n\nBased on your results, we'll create a personalized plan to help you improve your health habits."
    );

    // Show specific recommendations
    await this.showRecommendations(categoryScores);
  }

  static async showRecommendations(categoryScores) {
    const recommendations = [];
    
    // Generate recommendations based on lowest scoring categories
    const sortedCategories = Object.entries(categoryScores)
      .sort(([, a], [, b]) => a - b);

    for (const [category, score] of sortedCategories) {
      if (score < 70) {
        const categoryQuestions = PHYSICAL_HEALTH_QUESTIONS[category];
        const lowScoringQuestions = categoryQuestions.filter(q => 
          q.weight >= 2 && score < 60
        );

        if (lowScoringQuestions.length > 0) {
          recommendations.push({
            category,
            score,
            focusAreas: lowScoringQuestions.map(q => q.category)
          });
        }
      }
    }

    if (recommendations.length > 0) {
      await UIService.showMessage(
        "Areas for Improvement",
        "Based on your assessment, here are some areas you might want to focus on:\n\n" +
        recommendations.map(rec => 
          `${rec.category} (${rec.score}%):\n` +
          `- Focus on: ${rec.focusAreas.join(", ")}`
        ).join("\n\n")
      );
    }
  }
} 