class AchievementService {
  static BADGES = {
    QUEST_MASTER: {
      id: 'quest_master',
      title: 'Quest Master',
      description: 'Complete 50 quests',
      icon: '🏆',
      xpReward: 100
    },
    STREAK_KING: {
      id: 'streak_king',
      title: 'Streak King',
      description: 'Maintain a 7-day streak',
      icon: '🔥',
      xpReward: 150
    },
    CATEGORY_EXPERT: {
      id: 'category_expert',
      title: 'Category Expert',
      description: 'Complete 20 quests in one category',
      icon: '⭐',
      xpReward: 75
    },
    EARLY_BIRD: {
      id: 'early_bird',
      title: 'Early Bird',
      description: 'Complete a quest before 8 AM',
      icon: '🌅',
      xpReward: 50
    },
    NIGHT_OWL: {
      id: 'night_owl',
      title: 'Night Owl',
      description: 'Complete a quest after 10 PM',
      icon: '🌙',
      xpReward: 50
    }
  };

  static ACHIEVEMENTS = {
    FIRST_QUEST: {
      id: 'first_quest',
      title: 'First Steps',
      description: 'Complete your first quest',
      icon: '👣',
      xpReward: 25
    },
    LEVEL_UP: {
      id: 'level_up',
      title: 'Level Up!',
      description: 'Reach level 5',
      icon: '📈',
      xpReward: 50
    },
    CATEGORY_MASTER: {
      id: 'category_master',
      title: 'Category Master',
      description: 'Complete all quests in a category',
      icon: '🎯',
      xpReward: 100
    },
    STREAK_MASTER: {
      id: 'streak_master',
      title: 'Streak Master',
      description: 'Maintain a 30-day streak',
      icon: '💪',
      xpReward: 200
    }
  };

  static checkAchievements(profile, completedQuest) {
    const achievements = [];
    const badges = [];

    // Check for first quest achievement
    if (profile.totalQuestsCompleted === 1) {
      achievements.push(this.ACHIEVEMENTS.FIRST_QUEST);
    }

    // Check for level up achievement
    if (profile.level === 5 && !profile.achievements.includes('level_up')) {
      achievements.push(this.ACHIEVEMENTS.LEVEL_UP);
    }

    // Check for category master achievement
    const categoryQuests = profile.completedQuests.filter(q => q.category === completedQuest.category);
    if (categoryQuests.length >= 20 && !profile.achievements.includes('category_master')) {
      achievements.push(this.ACHIEVEMENTS.CATEGORY_MASTER);
    }

    // Check for streak master achievement
    if (profile.currentStreak >= 30 && !profile.achievements.includes('streak_master')) {
      achievements.push(this.ACHIEVEMENTS.STREAK_MASTER);
    }

    // Check for quest master badge
    if (profile.totalQuestsCompleted >= 50 && !profile.badges.includes('quest_master')) {
      badges.push(this.BADGES.QUEST_MASTER);
    }

    // Check for streak king badge
    if (profile.currentStreak >= 7 && !profile.badges.includes('streak_king')) {
      badges.push(this.BADGES.STREAK_KING);
    }

    // Check for category expert badge
    if (categoryQuests.length >= 20 && !profile.badges.includes('category_expert')) {
      badges.push(this.BADGES.CATEGORY_EXPERT);
    }

    // Check for early bird badge
    const currentHour = new Date().getHours();
    if (currentHour < 8 && !profile.badges.includes('early_bird')) {
      badges.push(this.BADGES.EARLY_BIRD);
    }

    // Check for night owl badge
    if (currentHour >= 22 && !profile.badges.includes('night_owl')) {
      badges.push(this.BADGES.NIGHT_OWL);
    }

    return { achievements, badges };
  }

  static calculateStreakBonus(streak) {
    if (streak >= 30) return 0.5; // 50% bonus
    if (streak >= 14) return 0.3; // 30% bonus
    if (streak >= 7) return 0.2; // 20% bonus
    if (streak >= 3) return 0.1; // 10% bonus
    return 0;
  }

  static calculateQuestReward(quest, streak) {
    const baseXP = quest.xpValue;
    const streakBonus = this.calculateStreakBonus(streak);
    const difficultyMultiplier = {
      beginner: 1,
      intermediate: 1.2,
      advanced: 1.5
    }[quest.difficulty] || 1;

    return Math.round(baseXP * (1 + streakBonus) * difficultyMultiplier);
  }
} 