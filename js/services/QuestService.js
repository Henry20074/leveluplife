import { QUEST_POOL, QUEST_TYPES } from '../config/quests.js';
import { LEVEL_RANGES } from '../config/constants.js';
import { StorageService } from './StorageService.js';
import { AchievementService } from './AchievementService.js';
import { UIService } from './UIService.js';

export class QuestService {
  static generateQuests(area, level) {
    console.log('Starting generateQuests for area:', area, 'level:', level);
    
    // Get quests for the area
    const areaQuests = QUEST_POOL[area];
    if (!areaQuests) {
      console.error('No quests found for area:', area);
      return this.getDefaultQuests();
    }

    // Get the level range for current level
    const range = this.getLevelRange(level);
    const rangeKey = `${range.min}-${range.max}`;
    console.log('Using level range:', rangeKey);

    // Collect all quests from all categories for this level range
    let availableQuests = [];
    Object.keys(areaQuests).forEach(category => {
      if (areaQuests[category][rangeKey]) {
        availableQuests = availableQuests.concat(areaQuests[category][rangeKey]);
      }
    });

    console.log('Found quests for level range:', availableQuests.length);

    if (availableQuests.length === 0) {
      console.error('No quests available for level range:', rangeKey);
      return this.getDefaultQuests();
    }

    // Select 5 random quests
    const selectedQuests = this.shuffleArray(availableQuests)
      .slice(0, Math.min(5, availableQuests.length))
      .map(quest => ({
        ...quest,
        completed: false,
        progress: 0,
        refreshable: true,
        accepted: false,
        acceptedAt: null
      }));

    console.log('Generated quests:', selectedQuests);
    return selectedQuests;
  }

  static getDefaultQuests() {
    return [
      {
        id: "default1",
        title: "Start Your Journey",
        duration: 5,
        xpValue: 20,
        description: "Begin your first quest",
        completed: false,
        progress: 0,
        refreshable: true,
        accepted: false,
        acceptedAt: null
      },
      {
        id: "default2",
        title: "Set Your Goals",
        duration: 10,
        xpValue: 25,
        description: "Write down three goals you want to achieve",
        completed: false,
        progress: 0,
        refreshable: true,
        accepted: false,
        acceptedAt: null
      },
      {
        id: "default3",
        title: "Take a Small Step",
        duration: 5,
        xpValue: 20,
        description: "Complete one small task towards your goal",
        completed: false,
        progress: 0,
        refreshable: true,
        accepted: false,
        acceptedAt: null
      },
      {
        id: "default4",
        title: "Reflect on Progress",
        duration: 5,
        xpValue: 20,
        description: "Think about what you've accomplished today",
        completed: false,
        progress: 0,
        refreshable: true,
        accepted: false,
        acceptedAt: null
      },
      {
        id: "default5",
        title: "Plan Tomorrow",
        duration: 10,
        xpValue: 25,
        description: "Plan your activities for tomorrow",
        completed: false,
        progress: 0,
        refreshable: true,
        accepted: false,
        acceptedAt: null
      }
    ];
  }

  static getLevelRange(level) {
    return Object.values(LEVEL_RANGES).find(range => 
      level >= range.min && level <= range.max
    ) || LEVEL_RANGES.GRANDMASTER;
  }

  static shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  static refreshQuest(questId) {
    const currentArea = StorageService.getCurrentArea();
    const allData = StorageService.getAllUserData();
    const areaData = allData[currentArea];

    if (areaData && areaData.quests) {
      const questIndex = areaData.quests.findIndex(q => q.id === questId);
      if (questIndex === -1) return;

      const oldQuest = areaData.quests[questIndex];
      if (!oldQuest.refreshable) return;

      // Get a new quest from the same category and level range
      const range = this.getLevelRange(areaData.level);
      const rangeKey = `${range.min}-${range.max}`;
      const categoryQuests = QUEST_POOL[currentArea][rangeKey];

      // Filter out currently active quests
      const availableQuests = categoryQuests.filter(q => 
        !areaData.quests.some(activeQuest => activeQuest.id === q.id)
      );

      if (availableQuests.length > 0) {
        // Randomly select a new quest
        const newQuest = {
          ...this.shuffleArray(availableQuests)[0],
          category: oldQuest.category,
          levelRange: rangeKey,
          completed: false,
          progress: 0,
          refreshable: true,
          xpValue: Math.round(availableQuests[0].xpValue * (1 + (areaData.level - range.min) * 0.1))
        };

        // Replace the old quest
        areaData.quests[questIndex] = newQuest;
        StorageService.saveUserData(currentArea, areaData);
        return areaData;
      }
    }
    return null;
  }

  static async updateQuestProgress(questId, progress, checkpointOrStepId = null) {
    const profile = StorageService.getProfile();
    const quest = profile.activeQuests.find(q => q.id === questId);
    
    if (!quest) {
      console.error('Quest not found:', questId);
      return;
    }

    switch (quest.type) {
      case QUEST_TYPES.MULTI_DAY:
        this.handleMultiDayProgress(quest, checkpointOrStepId, progress);
        break;
      case QUEST_TYPES.COMPLEX:
        this.handleComplexProgress(quest, checkpointOrStepId, progress);
        break;
      case QUEST_TYPES.STREAK:
        this.handleStreakProgress(quest, progress);
        break;
      default:
        this.handleStandardProgress(quest, progress);
    }

    // Check if quest is completed
    if (this.isQuestComplete(quest)) {
      // Calculate reward with streak bonus
      const reward = this.calculateTotalQuestXP(quest);
      
      // Update profile
      profile.xp += reward;
      profile.totalQuestsCompleted++;
      profile.completedQuests.push({
        id: quest.id,
        title: quest.title,
        category: quest.category,
        completedAt: new Date().toISOString()
      });

      // Check for achievements and badges
      const { achievements, badges } = AchievementService.checkAchievements(profile, quest);
      
      // Add new achievements and badges
      achievements.forEach(achievement => {
        profile.achievements.push(achievement.id);
        profile.xp += achievement.xpReward;
        UIService.showAchievement(achievement.title, achievement.description);
      });

      badges.forEach(badge => {
        profile.badges.push(badge.id);
        profile.xp += badge.xpReward;
        UIService.showAchievement(badge.title, badge.description);
      });

      // Update streak
      StorageService.updateStreak();

      // Remove completed quest
      profile.activeQuests = profile.activeQuests.filter(q => q.id !== questId);

      // Check for level up
      const newLevel = this.calculateLevel(profile.xp);
      if (newLevel > profile.level) {
        profile.level = newLevel;
        await UIService.celebrateLevelUp(newLevel, profile.currentArea);
      }

      // Save updated profile
      StorageService.saveProfile(profile);

      // Show completion message
      UIService.showAchievement(
        'Quest Completed!',
        `You earned ${reward} XP${achievements.length > 0 ? ' + bonus achievements!' : ''}`
      );
    } else {
      // Save progress
      StorageService.saveProfile(profile);
    }
  }

  static handleMultiDayProgress(quest, checkpointId, progress) {
    if (!quest.progress) quest.progress = {};
    if (!quest.checkpointsCompleted) quest.checkpointsCompleted = [];
    
    if (checkpointId && !quest.checkpointsCompleted.includes(checkpointId)) {
      quest.progress[checkpointId] = progress;
      if (progress >= 100) {
        quest.checkpointsCompleted.push(checkpointId);
        const checkpoint = quest.checkpoints.find(cp => cp.day === checkpointId);
        UIService.showAchievement(
          'Checkpoint Complete!',
          `Completed: ${checkpoint.task}\nEarned: ${checkpoint.xp} XP`
        );
      }
    }
  }

  static handleComplexProgress(quest, stepId, progress) {
    if (!quest.progress) quest.progress = {};
    if (!quest.stepsCompleted) quest.stepsCompleted = [];
    
    // Check if previous steps are completed if there are requirements
    if (quest.requirements && stepId > 1) {
      const previousStepComplete = quest.stepsCompleted.includes(stepId - 1);
      if (!previousStepComplete) {
        UIService.showAchievement('Step Locked', 'Complete the previous step first!');
        return;
      }
    }
    
    quest.progress[stepId] = progress;
    if (progress >= 100 && !quest.stepsCompleted.includes(stepId)) {
      quest.stepsCompleted.push(stepId);
      const step = quest.steps.find(s => s.id === stepId);
      UIService.showAchievement(
        'Step Complete!',
        `Completed: ${step.task}\nEarned: ${step.xp} XP`
      );
    }
  }

  static handleStreakProgress(quest, progress) {
    const today = new Date().toDateString();
    if (!quest.streakData) {
      quest.streakData = {
        currentStreak: 0,
        lastCompletedDate: null,
        missedDays: 0
      };
    }
    
    if (progress >= 100) {
      const lastDate = quest.streakData.lastCompletedDate;
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      
      if (!lastDate || lastDate === yesterday) {
        quest.streakData.currentStreak++;
        quest.streakData.lastCompletedDate = today;
        
        // Check for checkpoint rewards
        const checkpoint = quest.checkpoints?.find(cp => cp.day === quest.streakData.currentStreak);
        if (checkpoint) {
          UIService.showAchievement(
            checkpoint.reward.title,
            `Earned: ${checkpoint.reward.xp} XP`
          );
        }
      } else if (lastDate !== today) {
        quest.streakData.missedDays++;
        if (quest.failureRules && quest.streakData.missedDays > quest.failureRules.maxMissedDays) {
          this.handleQuestFailure(quest);
        }
        quest.streakData.currentStreak = 1;
      }
    }
  }

  static handleStandardProgress(quest, progress) {
    quest.progress = progress;
  }

  static isQuestComplete(quest) {
    switch (quest.type) {
      case QUEST_TYPES.MULTI_DAY:
        return quest.checkpointsCompleted?.length === quest.checkpoints.length;
      case QUEST_TYPES.COMPLEX:
        return quest.stepsCompleted?.length === quest.steps.length;
      case QUEST_TYPES.STREAK:
        return quest.streakData?.currentStreak >= quest.streakRequirement;
      default:
        return quest.progress >= 100;
    }
  }

  static calculateTotalQuestXP(quest) {
    let baseXP = quest.xpValue;
    let bonusXP = quest.bonusXP || 0;
    
    // Add checkpoint/step XP
    if (quest.type === QUEST_TYPES.MULTI_DAY || quest.type === QUEST_TYPES.COMPLEX) {
      baseXP = quest.checkpointsCompleted?.reduce((total, cpId) => {
        const checkpoint = quest.checkpoints?.find(cp => cp.day === cpId);
        return total + (checkpoint?.xp || 0);
      }, 0) || baseXP;
    }
    
    // Apply streak bonuses
    if (quest.type === QUEST_TYPES.STREAK) {
      const perfectStreak = quest.streakData?.missedDays === 0;
      if (perfectStreak) bonusXP *= 1.5;
    }
    
    // Apply level and difficulty multipliers
    return this.calculateQuestXP(baseXP + bonusXP, quest.level, quest.difficulty);
  }

  static handleQuestFailure(quest) {
    UIService.showAchievement(
      'Quest Failed',
      `You missed too many days. The quest has been reset.`
    );
    quest.streakData.currentStreak = 0;
    quest.streakData.missedDays = 0;
    quest.progress = 0;
  }

  static calculateLevel(xp) {
    // Level calculation formula: level = floor(sqrt(xp/100))
    return Math.floor(Math.sqrt(xp / 100)) + 1;
  }

  static getActiveQuests(area) {
    const userData = StorageService.getUserData(area);
    if (!userData || !userData.quests) return [];

    // Filter for accepted quests
    return userData.quests.filter(quest => quest.accepted && !quest.completed);
  }

  static getAvailableQuests(area) {
    const userData = StorageService.getUserData(area);
    if (!userData || !userData.quests) return [];

    // Filter for unaccepted quests
    return userData.quests.filter(quest => !quest.accepted);
  }
} 