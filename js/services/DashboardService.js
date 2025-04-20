import { StorageService } from './StorageService.js';
import { QuestService } from './QuestService.js';
import { UIService } from './UIService.js';
import { BADGES } from '../config/constants.js';

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

    questsToDisplay.forEach((quest) => {
      if (!quest) return; // Skip undefined quests
      
      const div = document.createElement("div");
      div.className = "flex justify-between items-center bg-gray-100 px-4 py-3 rounded mb-2";
      div.innerHTML = `
        <div class="flex-1">
          <div class="flex items-center justify-between">
            <p class="font-medium">${quest.title || 'Unnamed Quest'}</p>
            <span class="text-xs text-gray-500">${quest.duration || '5'} min</span>
          </div>
          <p class="text-sm text-gray-600 mt-1">${quest.description || 'No description available'}</p>
          <div class="flex items-center mt-2">
            <div class="w-full bg-gray-200 rounded-full h-2.5 mr-2">
              <div class="bg-indigo-600 h-2.5 rounded-full" style="width: ${quest.progress || 0}%"></div>
            </div>
            <span class="text-xs text-gray-500">${quest.progress || 0}%</span>
          </div>
        </div>
        <div class="flex items-center space-x-2 ml-4">
          <button class="refresh-btn bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 rounded text-sm" title="Refresh Quest">
            🔄
          </button>
          <button class="complete-btn ${
            quest.completed
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-green-500 hover:bg-green-600"
          } text-white px-4 py-1 rounded text-sm" ${quest.completed ? "disabled" : ""}>
            ${quest.completed ? "Completed!" : "Complete"}
          </button>
        </div>
      `;

      // Add refresh button handler
      const refreshBtn = div.querySelector('.refresh-btn');
      refreshBtn.addEventListener('click', () => {
        const updatedData = QuestService.refreshQuest(quest.id);
        if (updatedData) {
          this.initDashboard(updatedData);
        }
      });

      // Add complete button handler
      const completeBtn = div.querySelector('.complete-btn');
      if (!quest.completed) {
        completeBtn.addEventListener('click', () => {
          const result = QuestService.updateQuestProgress(quest.id, 100);
          if (result) {
            if (result.levelUp) {
              UIService.celebrateLevelUp(result.newLevel, data.area);
              if (result.achievement) {
                UIService.showAchievement(result.achievement.title, result.achievement.description);
              }
            }
            this.initDashboard(result.areaData);
          }
        });
      }

      questList.appendChild(div);
    });
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