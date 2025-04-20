import { QUEST_POOL } from '../config/quests.js';
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
        refreshable: true
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
        refreshable: true
      },
      {
        id: "default2",
        title: "Set Your Goals",
        duration: 10,
        xpValue: 25,
        description: "Write down three goals you want to achieve",
        completed: false,
        progress: 0,
        refreshable: true
      },
      {
        id: "default3",
        title: "Take a Small Step",
        duration: 5,
        xpValue: 20,
        description: "Complete one small task towards your goal",
        completed: false,
        progress: 0,
        refreshable: true
      },
      {
        id: "default4",
        title: "Reflect on Progress",
        duration: 5,
        xpValue: 20,
        description: "Think about what you've accomplished today",
        completed: false,
        progress: 0,
        refreshable: true
      },
      {
        id: "default5",
        title: "Plan Tomorrow",
        duration: 10,
        xpValue: 25,
        description: "Plan your activities for tomorrow",
        completed: false,
        progress: 0,
        refreshable: true
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

  static async updateQuestProgress(questId, progress) {
    const profile = StorageService.getProfile();
    const quest = profile.activeQuests.find(q => q.id === questId);
    
    if (!quest) {
      console.error('Quest not found:', questId);
      return;
    }

    // Update quest progress
    quest.progress = progress;
    
    // Check if quest is completed
    if (progress >= 100) {
      // Calculate reward with streak bonus
      const reward = AchievementService.calculateQuestReward(quest, profile.currentStreak);
      
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

  static calculateLevel(xp) {
    // Level calculation formula: level = floor(sqrt(xp/100))
    return Math.floor(Math.sqrt(xp / 100)) + 1;
  }
} 