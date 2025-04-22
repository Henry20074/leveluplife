import { StorageService } from './StorageService.js';
import { QuestService } from './QuestService.js';
import { UIService } from './UIService.js';
import { BADGES } from '../config/constants.js';
import { QUEST_TYPES } from '../config/quests.js';

export class DashboardService {
  static initDashboard(data) {
    console.log('Initializing dashboard with data:', data);
    const { area, level, xp, quests } = data;
    const xpCap = level * 100 + 200;

    // Add dashboard-item class to elements we want to animate
    const elements = [
      document.querySelector('.bg-white.rounded-lg.shadow.p-6.w-full'),
      document.querySelector('.bg-white.rounded-lg.shadow.p-6.flex-1')
    ];
    
    elements.forEach(el => {
      if (el) el.classList.add('dashboard-item');
    });

    // Update profile section
    this.updateProfileSection();

    // Update main stats
    this.updateMainStats(area, level, xp, xpCap);

    // Update streak
    const streak = StorageService.updateStreak();
    this.updateStreakDisplay(streak);

    // Update badges
    this.renderBadges(data);

    // Animate dashboard elements
    setTimeout(() => {
      UIService.animateElements(document.querySelectorAll('.dashboard-item'), 200);
    }, 300);

    // Display quests
    this.displayQuests(data);

    // Update stats with animation
    this.updateStatsSection(data, xpCap);
  }

  static updateProfileSection() {
    const profile = StorageService.getProfile();
    const nameEl = document.getElementById("profileName");
    const avatarEl = document.getElementById("profileAvatar");
    const titleEl = document.getElementById("profileTitle");
    if (nameEl) nameEl.textContent = profile.name;
    if (avatarEl) avatarEl.textContent = profile.avatar;
    if (titleEl) titleEl.textContent = profile.title;
  }

  static updateMainStats(area, level, xp, xpCap) {
    document.getElementById("dashboardArea").textContent = `Focus: ${area}`;
    document.getElementById("dashboardLevel").textContent = `Level ${level}`;
    document.getElementById("xpText").textContent = `${xp} / ${xpCap} XP`;
    document.getElementById("xpPercent").textContent = `${Math.floor((xp / xpCap) * 100)}%`;
    document.getElementById("xpBar").style.width = `${Math.floor((xp / xpCap) * 100)}%`;
  }

  static updateStreakDisplay(streak) {
    const streakDisplay = document.getElementById("streakDisplay");
    if (streakDisplay) {
      streakDisplay.innerHTML = `<span class="streak-flame">🔥</span> Streak: <span class="font-bold">${streak}</span> day${streak > 1 ? 's' : ''}`;
      
      // Celebrate streak milestones
      if (streak > 0 && streak % 7 === 0) {
        UIService.showAchievement('Streak Master! 🔥', `You've maintained your streak for ${streak} days!`);
      }
    }
  }

  static renderBadges(data) {
    const grid = document.getElementById("badgeGrid");
    if (!grid) return;
    grid.innerHTML = "";

    BADGES.forEach((b) => {
      const unlocked =
        (b.id === "starter" && data.totalCompleted >= 1) ||
        (b.id === "level5" && data.level >= 5);

      const badge = document.createElement("div");
      badge.id = "badge-" + b.id;
      badge.className = `p-4 border rounded-lg text-center ${
        unlocked ? "bg-yellow-50 opacity-100" : "bg-gray-100 opacity-50"
      }`;
      badge.innerHTML = `
        <h3 class="font-bold text-lg">${b.name}</h3>
        <p class="text-sm text-gray-600">${b.desc}</p>
        <div class="status text-sm ${
          unlocked ? "text-green-600" : "text-gray-500"
        } mt-2">${unlocked ? "✔️ Unlocked" : "🔒 Locked"}</div>
      `;
      grid.appendChild(badge);
    });
  }

  static displayQuests(data) {
    const questList = document.getElementById("questList");
    if (!questList) {
      console.error('Quest list container not found');
      return;
    }
    
    questList.innerHTML = "";

    // Ensure we have quests to display
    const questsToDisplay = data.quests || QuestService.generateQuests(data.area, data.level);
    console.log('Displaying quests:', questsToDisplay);

    if (!questsToDisplay || questsToDisplay.length === 0) {
      questList.innerHTML = `
        <div class="text-center py-4 text-gray-500">
          <p>No quests available right now.</p>
          <button onclick="refreshQuests()" class="mt-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
            Generate New Quests
          </button>
        </div>
      `;
      return;
    }

    // Show quest acceptance popup for each quest
    questsToDisplay.forEach((quest) => {
      if (!quest) return;
      this.showQuestAcceptancePopup(quest, data, questList);
    });
  }

  static showQuestAcceptancePopup(quest, data, questList) {
    const popup = document.createElement('div');
    popup.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    popup.innerHTML = `
      <div class="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">${quest.title}</h2>
        
        <div class="space-y-4">
          <div>
            <h3 class="text-lg font-semibold text-gray-700">Description</h3>
            <p class="text-gray-600">${quest.description}</p>
          </div>

          <div>
            <h3 class="text-lg font-semibold text-gray-700">Quest Details</h3>
            <ul class="list-disc list-inside text-gray-600">
              <li>Duration: ${quest.duration}</li>
              <li>Difficulty: ${quest.difficulty}</li>
              <li>Base XP: ${quest.xpValue}</li>
              ${quest.bonusXP ? `<li>Bonus XP: ${quest.bonusXP}</li>` : ''}
            </ul>
          </div>

          ${this.getQuestTypeSpecificDetails(quest)}

          <div class="flex justify-end space-x-4 mt-6">
            <button class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300" onclick="this.closest('.fixed').remove()">
              Decline
            </button>
            <button class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700" onclick="DashboardService.acceptQuest('${quest.id}', ${JSON.stringify(data).replace(/"/g, '&quot;')}, this.closest('.fixed'))">
              Accept Quest
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(popup);
  }

  static getQuestTypeSpecificDetails(quest) {
    switch (quest.type) {
      case QUEST_TYPES.MULTI_DAY:
        return `
          <div>
            <h3 class="text-lg font-semibold text-gray-700">Daily Checkpoints</h3>
            <ul class="list-disc list-inside text-gray-600">
              ${quest.checkpoints.map(cp => `
                <li>Day ${cp.day}: ${cp.task} (${cp.xp} XP)</li>
              `).join('')}
            </ul>
          </div>
        `;
      case QUEST_TYPES.COMPLEX:
        return `
          <div>
            <h3 class="text-lg font-semibold text-gray-700">Steps</h3>
            <ul class="list-disc list-inside text-gray-600">
              ${quest.steps.map(step => `
                <li>Step ${step.id}: ${step.task} (${step.xp} XP)</li>
              `).join('')}
            </ul>
            ${quest.requirements ? `
              <h4 class="text-md font-semibold text-gray-700 mt-2">Requirements</h4>
              <ul class="list-disc list-inside text-gray-600">
                ${quest.requirements.map(req => `<li>${req}</li>`).join('')}
              </ul>
            ` : ''}
          </div>
        `;
      case QUEST_TYPES.STREAK:
        return `
          <div>
            <h3 class="text-lg font-semibold text-gray-700">Streak Requirements</h3>
            <ul class="list-disc list-inside text-gray-600">
              <li>Daily Task: ${quest.dailyTask}</li>
              <li>Required Streak: ${quest.streakRequirement} days</li>
              <li>Maximum Missed Days: ${quest.failureRules.maxMissedDays}</li>
              <li>Penalty per Miss: ${quest.failureRules.penaltyPerMiss} XP</li>
            </ul>
            <h4 class="text-md font-semibold text-gray-700 mt-2">Milestone Rewards</h4>
            <ul class="list-disc list-inside text-gray-600">
              ${quest.checkpoints.map(cp => `
                <li>Day ${cp.day}: ${cp.reward.title} (${cp.reward.xp} XP)</li>
              `).join('')}
            </ul>
          </div>
        `;
      default:
        return '';
    }
  }

  static acceptQuest(questId, data, popup) {
    // Add quest to active quests
    const quest = data.quests.find(q => q.id === questId);
    if (quest) {
      quest.accepted = true;
      quest.acceptedAt = new Date().toISOString();
      
      // Save updated data
      StorageService.saveUserData(data.area, data);
      
      // Remove popup
      popup.remove();
      
      // Refresh dashboard
      this.initDashboard(data);
      
      // Show acceptance message
      UIService.showAchievement(
        'Quest Accepted!',
        `Good luck with your new quest: ${quest.title}`
      );
    }
  }

  static updateStatsSection(data, xpCap) {
    const statsElements = [
      document.getElementById("stats-total-xp"),
      document.getElementById("stats-level"),
      document.getElementById("stats-quests"),
      document.getElementById("stats-progress")
    ];

    statsElements.forEach(el => {
      if (el) el.classList.add('slide-fade');
    });

    setTimeout(() => {
      const statsXp = document.getElementById("stats-total-xp");
      const statsLevel = document.getElementById("stats-level");
      const statsQuests = document.getElementById("stats-quests");
      const statsProgress = document.getElementById("stats-progress");

      if (statsXp) statsXp.textContent = `${data.xp} XP`;
      if (statsLevel) statsLevel.textContent = `Level ${data.level}`;
      if (statsQuests) statsQuests.textContent = data.totalCompleted || 0;
      if (statsProgress) statsProgress.textContent = `${data.xp} / ${xpCap} XP`;
      
      UIService.animateElements(statsElements, 100);
    }, 400);
  }
} 