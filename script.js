// =====================
// LevelUp Life JS Logic (With Fancy Survey Flow + Effects)
// =====================

// Version: 1.0.0
// Last Updated: 2024-03-21
// Changelog:
// - Initial release
// - Added quest system
// - Added level-up mechanics
// - Added data persistence
// - Fixed quest refresh functionality
// - Fixed page load behavior
// - Fixed level-up logic

const BADGES = [
    { id: "starter", name: "Getting Started", desc: "Complete your first quest" },
    { id: "level5", name: "Level 5 Achiever", desc: "Reach Level 5" },
    { id: "streak7", name: "Week Warrior", desc: "Maintain a 7-day streak" },
    { id: "quest10", name: "Quest Master", desc: "Complete 10 quests" },
    { id: "allareas", name: "Well-Rounded", desc: "Unlock all focus areas" },
    { id: "level10", name: "Decade Master", desc: "Reach Level 10" },
    { id: "streak30", name: "Month Master", desc: "Maintain a 30-day streak" }
];

let userProfile = {
  name: "Adventurer",
  avatar: "🧙",
};

// Survey variables
let current = 0;
let selected = [];
let area = '';
let selectedValue = null;
let responses = [];

// Survey questions for each area
const questions = {
  Physical: [
    "How often do you exercise per week?",
    "Do you maintain a regular sleep schedule?",
    "How often do you eat healthy meals?",
    "Do you take regular breaks when sitting for long periods?",
    "How often do you stretch or do mobility exercises?",
    "Do you drink enough water daily?",
    "How often do you engage in outdoor activities?",
    "Do you participate in any sports or fitness classes?",
    "How often do you track your physical activity?",
    "Do you maintain good posture throughout the day?",
    "How often do you get at least 7 hours of sleep?",
    "Do you take time for physical recovery after exercise?",
    "How often do you prepare meals at home?",
    "Do you regularly try new physical activities?",
    "How often do you do strength training?"
  ],
  Mental: [
    "Do you practice mindfulness or meditation?",
    "How well do you manage stress?",
    "Do you engage in learning new skills?",
    "How often do you read books?",
    "Do you practice creative activities?",
    "How well do you maintain work-life balance?",
    "Do you set and review personal goals?",
    "How often do you try brain-training exercises?",
    "Do you take breaks to prevent mental fatigue?",
    "How well do you handle challenging situations?",
    "Do you journal or reflect on your thoughts?",
    "How often do you learn something new?",
    "Do you practice positive self-talk?",
    "How well do you manage your time?",
    "Do you engage in problem-solving activities?"
  ],
  Relationships: [
    "How often do you connect with friends/family?",
    "Do you actively listen to others?",
    "Do you make time for social activities?",
    "How often do you express gratitude to others?",
    "Do you maintain long-term friendships?",
    "How well do you communicate your feelings?",
    "Do you participate in group activities?",
    "How often do you help others?",
    "Do you set boundaries in relationships?",
    "How well do you handle conflicts?",
    "Do you show empathy towards others?",
    "How often do you organize social gatherings?",
    "Do you maintain professional relationships?",
    "How well do you work in team settings?",
    "Do you celebrate others' achievements?"
  ]
};

let confettiSound;

const INTERMISSIONS = {
  Physical: [
    { after: 3, message: "💪 Keep going! Physical wellness is a journey." },
    { after: 7, message: "🌟 Halfway there! You're doing great!" },
    { after: 11, message: " Almost done! Every step counts!" }
  ],
  Mental: [
    { after: 3, message: "🧠 Your mind is getting stronger!" },
    { after: 7, message: "✨ Keep going! You're doing amazing!" },
    { after: 11, message: " Almost there! Stay focused!" }
  ],
  Relationships: [
    { after: 3, message: "❤️ Building connections takes time!" },
    { after: 7, message: "🤝 You're making great progress!" },
    { after: 11, message: "🌈 Final stretch! Keep going!" }
  ]
};

const FOCUS_AREAS = ['Physical', 'Mental', 'Relationships'];

// Quest difficulty levels
const DIFFICULTY_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
  EXPERT: 'expert'
};

// Level ranges and their characteristics
const LEVEL_RANGES = {
  NOVICE: { min: 1, max: 3, title: "Novice" },
  BEGINNER: { min: 4, max: 6, title: "Beginner" },
  APPRENTICE: { min: 7, max: 9, title: "Apprentice" },
  ADEPT: { min: 10, max: 12, title: "Adept" },
  SKILLED: { min: 13, max: 15, title: "Skilled" },
  EXPERT: { min: 16, max: 20, title: "Expert" },
  MASTER: { min: 21, max: 25, title: "Master" },
  GRANDMASTER: { min: 26, max: 30, title: "Grandmaster" }
};

// Expanded quest pool for each area and level range
const QUEST_POOL = {
  Physical: {
    Exercise: {
      "1-3": [ // Novice
        { id: "pe1", title: "5-minute Stretching", duration: 5, xpValue: 20, description: "Simple full-body stretch routine", difficulty: "easy" },
        { id: "pe2", title: "10-minute Walk", duration: 10, xpValue: 30, description: "Take a short walk around your area", difficulty: "easy" },
        { id: "pe3", title: "Basic Squats", duration: 5, xpValue: 25, description: "Do 5 basic squats", difficulty: "easy" },
        { id: "pe4", title: "Arm Circles", duration: 3, xpValue: 15, description: "30 seconds each direction", difficulty: "easy" },
        { id: "pe5", title: "March in Place", duration: 5, xpValue: 20, description: "Simple marching exercise", difficulty: "easy" }
      ],
      "4-6": [ // Beginner
        { id: "pe6", title: "15-minute Walk", duration: 15, xpValue: 40, description: "Brisk walking pace", difficulty: "medium" },
        { id: "pe7", title: "10 Pushups", duration: 10, xpValue: 45, description: "Can be done on knees", difficulty: "medium" },
        { id: "pe8", title: "Basic Yoga Flow", duration: 15, xpValue: 50, description: "Simple yoga sequence", difficulty: "medium" },
        { id: "pe9", title: "Jump Rope Practice", duration: 10, xpValue: 45, description: "Practice basic jumping", difficulty: "medium" },
        { id: "pe10", title: "Bodyweight Exercises", duration: 15, xpValue: 50, description: "Mix of basic exercises", difficulty: "medium" }
      ],
      "7-9": [ // Apprentice
        { id: "pe11", title: "20-minute HIIT", duration: 20, xpValue: 75, description: "Basic interval training", difficulty: "hard" },
        { id: "pe12", title: "Strength Circuit", duration: 25, xpValue: 85, description: "Full body workout", difficulty: "hard" },
        { id: "pe13", title: "3km Run", duration: 30, xpValue: 90, description: "Steady pace run", difficulty: "hard" },
        { id: "pe14", title: "Flexibility Flow", duration: 20, xpValue: 75, description: "Advanced stretching", difficulty: "hard" },
        { id: "pe15", title: "Plank Challenge", duration: 15, xpValue: 65, description: "Hold plank position", difficulty: "hard" }
      ]
    },
    Nutrition: {
      "1-3": [
        { id: "pn1", title: "Water Intake", duration: "all day", xpValue: 20, description: "Drink 4 glasses of water", difficulty: "easy" },
        { id: "pn2", title: "Fruit Break", duration: "one meal", xpValue: 15, description: "Add a fruit to your meal", difficulty: "easy" },
        { id: "pn3", title: "Veggie Starter", duration: "one meal", xpValue: 20, description: "Add one vegetable serving", difficulty: "easy" }
      ],
      "4-6": [
        { id: "pn4", title: "Balanced Breakfast", duration: "morning", xpValue: 40, description: "Include protein and fiber", difficulty: "medium" },
        { id: "pn5", title: "Meal Planning", duration: 30, xpValue: 45, description: "Plan tomorrow's meals", difficulty: "medium" },
        { id: "pn6", title: "Healthy Snack Swap", duration: "all day", xpValue: 35, description: "Replace processed snacks", difficulty: "medium" }
      ]
    }
  },
  Mental: {
    Mindfulness: {
      "1-3": [
        { id: "mm1", title: "Deep Breathing", duration: 5, xpValue: 20, description: "Basic breathing exercise", difficulty: "easy" },
        { id: "mm2", title: "Mindful Minute", duration: 1, xpValue: 15, description: "One minute of presence", difficulty: "easy" },
        { id: "mm3", title: "Gratitude Note", duration: 5, xpValue: 20, description: "Write one thing you're grateful for", difficulty: "easy" }
      ],
      "4-6": [
        { id: "mm4", title: "Body Scan", duration: 10, xpValue: 40, description: "Progressive relaxation", difficulty: "medium" },
        { id: "mm5", title: "Mindful Walking", duration: 15, xpValue: 45, description: "Walking meditation", difficulty: "medium" },
        { id: "mm6", title: "Thought Journal", duration: 10, xpValue: 40, description: "Record and observe thoughts", difficulty: "medium" }
      ]
    },
    Learning: {
      "1-3": [
        { id: "ml1", title: "Read Article", duration: 15, xpValue: 20, description: "Read an educational article", difficulty: "easy" },
        { id: "ml2", title: "Watch Tutorial", duration: 10, xpValue: 15, description: "Watch a skill tutorial", difficulty: "easy" },
        { id: "ml3", title: "Practice Skill", duration: 20, xpValue: 25, description: "Practice a new skill", difficulty: "easy" }
      ],
      "4-6": [
        { id: "ml4", title: "Online Course", duration: 30, xpValue: 45, description: "Complete a course module", difficulty: "medium" },
        { id: "ml5", title: "Skill Challenge", duration: 25, xpValue: 40, description: "Challenge yourself with a new skill", difficulty: "medium" },
        { id: "ml6", title: "Teach Others", duration: 20, xpValue: 40, description: "Share knowledge with others", difficulty: "medium" }
      ]
    }
  },
  Relationships: {
    Communication: {
      "1-3": [
        { id: "rc1", title: "Check-in Call", duration: 15, xpValue: 20, description: "Call a friend or family member", difficulty: "easy" },
        { id: "rc2", title: "Active Listening", duration: 10, xpValue: 15, description: "Practice active listening", difficulty: "easy" },
        { id: "rc3", title: "Express Gratitude", duration: 5, xpValue: 20, description: "Express gratitude to someone", difficulty: "easy" }
      ],
      "4-6": [
        { id: "rc4", title: "Deep Conversation", duration: 30, xpValue: 45, description: "Have a meaningful conversation", difficulty: "medium" },
        { id: "rc5", title: "Conflict Resolution", duration: 20, xpValue: 40, description: "Practice resolving a conflict", difficulty: "medium" },
        { id: "rc6", title: "Support Network", duration: 25, xpValue: 45, description: "Reach out to your support network", difficulty: "medium" }
      ]
    },
    Social: {
      "1-3": [
        { id: "rs1", title: "Social Media Break", duration: "all day", xpValue: 20, description: "Take a break from social media", difficulty: "easy" },
        { id: "rs2", title: "Group Activity", duration: 30, xpValue: 25, description: "Participate in a group activity", difficulty: "easy" },
        { id: "rs3", title: "New Connection", duration: 15, xpValue: 20, description: "Make a new connection", difficulty: "easy" }
      ],
      "4-6": [
        { id: "rs4", title: "Community Service", duration: 60, xpValue: 50, description: "Volunteer in your community", difficulty: "medium" },
        { id: "rs5", title: "Social Event", duration: 45, xpValue: 45, description: "Attend a social event", difficulty: "medium" },
        { id: "rs6", title: "Relationship Building", duration: 30, xpValue: 40, description: "Work on building a relationship", difficulty: "medium" }
      ]
    }
  }
};

// Add difficulty multipliers
const DIFFICULTY_MULTIPLIERS = {
  easy: 1,
  medium: 1.5,
  hard: 2
};

// Add this at the top of the file, after the constants
let currentState = {
  area: null,
  level: 1,
  xp: 0,
  quests: [],
  surveyInProgress: false
};

// Sound configuration
const SOUND_EFFECTS = {
  questComplete: {
    url: 'sounds/Button Press.mp3',
    volume: 0.3
  },
  levelUp: {
    url: 'sounds/lvlup.mp3',
    volume: 0.4
  },
  achievement: {
    url: 'sounds/Button Press.mp3',
    volume: 0.3
  }
};

function preloadAudio() {
  // Create an audio context for better control
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
  // Create a gain node for volume control
  const gainNode = audioContext.createGain();
  gainNode.connect(audioContext.destination);
  
  // Initialize sound effects
  const sounds = {};
  
  for (const [key, config] of Object.entries(SOUND_EFFECTS)) {
    sounds[key] = {
      play: () => {
        const audio = new Audio(config.url);
        audio.volume = config.volume;
        return audio.play().catch(err => console.log('Audio play failed:', err));
      }
    };
  }
  
  // Replace global confettiSound with our new sound system
  window.gameSounds = sounds;
}

function showSection(name) {
  console.log('Showing section:', name);
  const currentArea = localStorage.getItem('currentFocusArea');
  const allData = getAllUserData();
  
  // Hide all sections first
  document.querySelectorAll(".tab-section, #welcome, #area-selection, #survey").forEach((s) => {
    s.classList.remove("active");
    setTimeout(() => s.classList.add("hidden"), 300); // Wait for fade out animation
  });

  // Show the target section
  const target = document.getElementById(`section-${name}`);
  if (target) {
    target.classList.remove("hidden");
    // Force a reflow to ensure the animation triggers
    void target.offsetWidth;
    // Add active class to trigger animation
    requestAnimationFrame(() => {
      target.classList.add("active");
    });

    // Animate elements in the newly shown section
    const elements = target.querySelectorAll('.dashboard-item, .slide-fade');
    animateElements(elements, 100);
  }

  // Update current state
  if (name === 'dashboard' && currentArea) {
    currentState.area = currentArea;
    const areaData = allData[currentArea];
    if (areaData) {
      currentState.level = areaData.level;
      currentState.xp = areaData.xp;
      currentState.quests = areaData.quests;
      
      // Update the dashboard with current area data
      initDashboard(areaData);
    }
  }
  
  // Update navigation state
  document.querySelectorAll('nav button').forEach(btn => {
    btn.classList.remove('bg-gray-100');
    if (btn.textContent.toLowerCase().includes(name.toLowerCase())) {
      btn.classList.add('bg-gray-100');
    }
  });
}

function resetProgress() {
  if (confirm("Are you sure you want to reset all your data?")) {
    localStorage.clear();
    document.getElementById("section-dashboard").classList.add("hidden");
    document.getElementById("survey").classList.add("hidden");
    document.getElementById("area-selection").classList.remove("hidden");
    renderBadges({ level: 0, totalCompleted: 0 });
  }
}

function refreshQuests() {
  const currentArea = localStorage.getItem('currentFocusArea');
  if (currentArea) {
    const allData = getAllUserData();
    if (allData[currentArea]) {
      // Get current level and generate new quests
      const currentLevel = allData[currentArea].level;
      const newQuests = generateQuests(currentArea, currentLevel);
      
      // Update the quests in user data
      allData[currentArea].quests = newQuests;
      
      // Save updated data
      saveUserData(currentArea, allData[currentArea]);
      
      // Update dashboard with new quests
      initDashboard(allData[currentArea]);
      
      // Show success message
      showAchievement('Quests Refreshed!', 'All quests have been refreshed with new challenges!');
    }
  }
}

function updateStreak(area) {
  const today = new Date().toDateString();
  let lastDate = localStorage.getItem(`lastQuestDate_${area}`);
  let streak = parseInt(localStorage.getItem(`streak_${area}`) || "0");

  if (lastDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    streak = lastDate === yesterday ? streak + 1 : 1;
    localStorage.setItem(`streak_${area}`, streak);
    localStorage.setItem(`lastQuestDate_${area}`, today);
  }

  const streakText = `🔥 Streak: ${streak} day${streak > 1 ? 's' : ''}`;
  const streakDisplay = document.getElementById("streakDisplay");
  streakDisplay.innerHTML = `<span class="streak-flame">🔥</span> Streak: <span class="font-bold">${streak}</span> day${streak > 1 ? 's' : ''}`;
  
  // Celebrate streak milestones
  if (streak > 0 && streak % 7 === 0) {
    showAchievement('Streak Master! 🔥', `You've maintained your streak for ${streak} days!`);
  }
}

function celebrateLevelUp(level) {
  console.log('Celebrating level up to:', level);
  const overlay = document.createElement('div');
  overlay.className = 'level-up-overlay';
  
  // Different colors for different areas
  const colors = {
    Physical: '#2563eb',
    Mental: '#16a34a',
    Relationships: '#9333ea'
  };
  
  const currentArea = document.getElementById('dashboardArea')?.textContent.split(': ')[1] || 'Physical';
  const color = colors[currentArea] || '#4f46e5';
  
  overlay.innerHTML = `
    <div class="level-up-content text-white p-8">
      <div class="text-6xl mb-6">⭐</div>
      <h2 class="text-4xl font-bold mb-4">Level Up!</h2>
      <div class="text-8xl font-bold mb-6" style="color: ${color}">Level ${level}</div>
      <p class="text-xl mb-8">Your journey continues to new heights!</p>
      <button class="bg-white text-indigo-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-opacity-90 transition-all">
        Continue
      </button>
    </div>
  `;
  
  document.body.appendChild(overlay);
  
  // Multiple confetti bursts
  const confettiColors = [color, '#ffffff', '#gold'];
  
  function burstConfetti() {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: confettiColors
    });
  }
  
  // Initial burst
  burstConfetti();
  
  // Secondary bursts
  setTimeout(burstConfetti, 500);
  setTimeout(burstConfetti, 1000);
  
  // Play level up sound
  gameSounds.levelUp?.play().catch(() => {});
  
  // Animate in
  requestAnimationFrame(() => overlay.classList.add('show'));
  
  // Remove on button click
  overlay.querySelector('button').addEventListener('click', () => {
    overlay.classList.remove('show');
    setTimeout(() => overlay.remove(), 300);
  });
}

function unlockBadge(id) {
  const badge = document.getElementById("badge-" + id);
  if (badge && badge.classList.contains("opacity-50")) {
    badge.classList.remove("opacity-50");
    badge.querySelector(".status").textContent = "✔️ Unlocked";
    badge
      .querySelector(".status")
      .classList.replace("text-gray-500", "text-green-600");
  }
}

// Add this at the top with other state variables
let achievementProgress = {
    highestLevel: 0,
    totalCompleted: 0,
    highestStreak: 0,
    unlockedAreas: []
};

// Update the checkAchievements function
function checkAchievements(data) {
    const achievements = [];
    const allData = getAllUserData();
    
    // Check for starter achievement (only on first completion)
    if (data.totalCompleted === 1 && achievementProgress.totalCompleted === 0) {
        achievements.push("starter");
    }
    
    // Check for level achievements (only when reaching new levels)
    if (data.level >= 5 && achievementProgress.highestLevel < 5) {
        achievements.push("level5");
    }
    if (data.level >= 10 && achievementProgress.highestLevel < 10) {
        achievements.push("level10");
    }
    
    // Check for quest completion achievement (only when reaching milestone)
    if (data.totalCompleted >= 10 && achievementProgress.totalCompleted < 10) {
        achievements.push("quest10");
    }
    
    // Check for streak achievements (only when reaching new streak milestones)
    const streak = parseInt(localStorage.getItem("streak") || "0");
    if (streak >= 7 && achievementProgress.highestStreak < 7) {
        achievements.push("streak7");
    }
    if (streak >= 30 && achievementProgress.highestStreak < 30) {
        achievements.push("streak30");
    }
    
    // Check for all areas achievement (only when unlocking the last area)
    const unlockedAreas = FOCUS_AREAS.filter(area => allData[area]);
    if (unlockedAreas.length === FOCUS_AREAS.length && 
        achievementProgress.unlockedAreas.length < FOCUS_AREAS.length) {
        achievements.push("allareas");
    }
    
    // Update progress tracking
    achievementProgress.highestLevel = Math.max(achievementProgress.highestLevel, data.level);
    achievementProgress.totalCompleted = Math.max(achievementProgress.totalCompleted, data.totalCompleted);
    achievementProgress.highestStreak = Math.max(achievementProgress.highestStreak, streak);
    achievementProgress.unlockedAreas = [...new Set([...achievementProgress.unlockedAreas, ...unlockedAreas])];
    
    return achievements;
}

// Update the renderBadges function to use area-specific badges
function renderBadges(area, data) {
    const grid = document.getElementById("badgeGrid");
    if (!grid) return;
    grid.innerHTML = "";

    const badges = AREA_BADGES[area] || [];
    const theme = AREA_THEMES[area] || AREA_THEMES.Physical;

    badges.forEach((b) => {
        let unlocked = false;
        let progress = null;

        switch (b.id) {
            case "starter":
                unlocked = data.totalCompleted >= 1;
                progress = data.totalCompleted > 0 ? "1/1" : "0/1";
                break;
            case "level5":
                unlocked = data.level >= 5;
                progress = `${Math.min(data.level, 5)}/5`;
                break;
            case "level10":
                unlocked = data.level >= 10;
                progress = `${Math.min(data.level, 10)}/10`;
                break;
            case "quest10":
                unlocked = data.totalCompleted >= 10;
                progress = `${Math.min(data.totalCompleted, 10)}/10`;
                break;
            case "streak7":
                const streak = parseInt(localStorage.getItem(`streak_${area}`) || "0");
                unlocked = streak >= 7;
                progress = `${Math.min(streak, 7)}/7`;
                break;
            case "streak30":
                const longStreak = parseInt(localStorage.getItem(`streak_${area}`) || "0");
                unlocked = longStreak >= 30;
                progress = `${Math.min(longStreak, 30)}/30`;
                break;
        }

        const badge = document.createElement("div");
        badge.id = `badge-${area}-${b.id}`;
        badge.className = `p-4 border rounded-lg text-center ${
            unlocked ? "bg-yellow-50 opacity-100" : "bg-gray-100 opacity-50"
        }`;
        badge.innerHTML = `
            <div class="text-2xl mb-2">${theme.icon}</div>
            <h3 class="font-bold text-lg">${b.name}</h3>
            <p class="text-sm text-gray-600">${b.desc}</p>
            <div class="status text-sm ${
                unlocked ? "text-green-600" : "text-gray-500"
            } mt-2">${unlocked ? "✔️ Unlocked" : progress}</div>
        `;
        grid.appendChild(badge);
    });
}

function goToAreaSelection() {
  const welcome = document.getElementById('welcome');
  const areaSelection = document.getElementById('area-selection');
  
  if (welcome) welcome.classList.add('hidden');
  if (areaSelection) areaSelection.classList.remove('hidden');
  
  // Animate the area selection screen
  const elements = areaSelection.querySelectorAll('button');
  animateElements(elements, 100);
}

function initSurvey() {
  const container = document.getElementById('questionContainer');
  if (!container) return;

  // Clear previous content
  container.innerHTML = '';

  // Create question card
  const card = document.createElement('div');
  card.className = 'question-card bg-white p-6 rounded-lg shadow-md';
  card.innerHTML = `
    <p class="text-gray-800 font-semibold text-xl mb-4">${currentQuestion}</p>
    <div class="flex flex-col space-y-2">
      <label class="flex items-center">
        <input type="radio" name="response" value="1" class="mr-2">
        <span>Not at all</span>
      </label>
      <label class="flex items-center">
        <input type="radio" name="response" value="2" class="mr-2">
        <span>Rarely</span>
      </label>
      <label class="flex items-center">
        <input type="radio" name="response" value="3" class="mr-2">
        <span>Sometimes</span>
      </label>
      <label class="flex items-center">
        <input type="radio" name="response" value="4" class="mr-2">
        <span>Often</span>
      </label>
      <label class="flex items-center">
        <input type="radio" name="response" value="5" class="mr-2">
        <span>Always</span>
      </label>
    </div>
  `;

  container.appendChild(card);
  
  // Apply the new styling
  UIService.styleSurveyQuestions();
}

// Add this new function for the loading screen
function showLoadingScreen() {
  return new Promise(resolve => {
    const container = document.createElement('div');
    container.className = 'fixed inset-0 bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center z-50';
    container.innerHTML = `
      <div class="bg-white rounded-xl p-8 max-w-md w-full mx-4 text-center transform transition-all duration-500 opacity-0 translate-y-4">
        <div class="animate-spin mb-6 mx-auto h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
        <h2 class="text-2xl font-bold mb-4">Analyzing Your Journey</h2>
        <div class="space-y-3">
          <p class="text-gray-600 loading-message">Calculating your potential...</p>
        </div>
        <div class="mt-6 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div class="progress-bar h-full bg-gradient-to-r from-blue-500 to-purple-500 w-0 transition-all duration-1000"></div>
        </div>
      </div>
    `;

    document.body.appendChild(container);

    // Fancy entrance animation
    requestAnimationFrame(() => {
      container.querySelector('div').classList.remove('opacity-0', 'translate-y-4');
    });

    const messages = [
      "Analyzing response patterns...",
      "Calculating your strengths...",
      "Determining optimal level...",
      "Generating personalized quests...",
      "Creating your unique journey...",
      "Preparing your adventure...",
      "Finalizing your profile...",
      "Almost ready..."
    ];

    let messageIndex = 0;
    const messageElement = container.querySelector('.loading-message');
    const progressBar = container.querySelector('.progress-bar');
    
    // Calculate timing for perfect alignment
    const totalTime = 15000; // 15 seconds total
    const messageInterval = totalTime / messages.length; // ~1875ms per message
    
    // Cycle through messages with typing effect
    const messageTimer = setInterval(() => {
      messageIndex = (messageIndex + 1) % messages.length;
      messageElement.style.opacity = '0';
      
      setTimeout(() => {
        messageElement.textContent = messages[messageIndex];
        messageElement.style.opacity = '1';
        // Update progress bar
        const progress = ((messageIndex + 1) / messages.length) * 100;
        progressBar.style.width = `${progress}%`;
      }, 200);
    }, messageInterval);

    // After loading, show celebration
    setTimeout(() => {
      clearInterval(messageTimer);
      
      // Ensure progress bar is at 100%
      progressBar.style.width = '100%';
      
      // Add a small delay before showing celebration
      setTimeout(() => {
        container.innerHTML = `
          <div class="bg-white rounded-xl p-8 max-w-md w-full mx-4 text-center">
            <div class="text-6xl mb-6">🎉</div>
            <h2 class="text-3xl font-bold mb-4">Journey Begins!</h2>
            <p class="text-xl mb-6">You're starting at Level ${calculateInitialLevel()}</p>
            <div class="space-y-4 mb-8">
              <p class="text-gray-600">Your adventure awaits...</p>
            </div>
            <button class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-full font-bold text-lg hover:opacity-90 transform hover:scale-105 transition-all">
              Begin Your Quest
            </button>
          </div>
        `;

        // Add confetti effect
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });

        // Play celebration sound
        gameSounds.levelUp?.play().catch(() => {});

        // Continue to dashboard after button click
        container.querySelector('button').addEventListener('click', () => {
          container.classList.add('opacity-0');
          setTimeout(() => {
            container.remove();
            resolve();
          }, 300);
        });
      }, 500); // Small delay before celebration
    }, totalTime);
  });
}

function calculateInitialLevel() {
  // Calculate initial level based on survey responses
  const total = responses.reduce((a, b) => a + b, 0);
  const percentage = (total / (responses.length * 5)) * 100;
  
  if (percentage >= 90) return 5;
  if (percentage >= 70) return 4;
  if (percentage >= 50) return 3;
  if (percentage >= 30) return 2;
  return 1;
}

// Update your finishSurvey function
async function finishSurvey(area, responses) {
  try {
    console.log('Finishing survey for area:', area);
    currentState.surveyInProgress = false;
    
    // Show enhanced loading screen first
    await showLoadingScreen();
    
    // Calculate results
    const total = responses.reduce((a, b) => a + b, 0);
    const percentage = (total / (responses.length * 3)) * 100;
    
    let level;
    if (percentage >= 90) level = 10;
    else if (percentage >= 80) level = 9;
    else if (percentage >= 70) level = 8;
    else if (percentage >= 60) level = 7;
    else if (percentage >= 50) level = 6;
    else if (percentage >= 40) level = 5;
    else if (percentage >= 30) level = 4;
    else if (percentage >= 20) level = 3;
    else if (percentage >= 10) level = 2;
    else level = 1;

    // Generate initial quests
    const quests = generateQuests(area, level);

    const user = {
      area,
      level,
      xp: 0,
      quests: quests,
      totalCompleted: 0,
      score: percentage.toFixed(1)
    };

    // Store data
    saveUserData(area, user);
    localStorage.setItem('currentFocusArea', area);
    
    // Update current state
    currentState.area = area;
    currentState.level = level;
    currentState.xp = 0;
    currentState.quests = quests;
    
    // Show dashboard
    document.getElementById('survey').classList.add('hidden');
    const sidebar = document.getElementById("sidebar");
    if (sidebar) {
      sidebar.classList.remove('hidden');
      setTimeout(() => sidebar.classList.add('show'), 100);
    }
    
    showSection("dashboard");
    initDashboard(user);
    
  } catch (error) {
    console.error('Error in finishSurvey:', error);
    showAchievement('Error', 'Something went wrong. Please try again.');
  }
}

function checkForLevelUp(area, level, xp) {
  console.log('Checking for level up:', { area, level, xp });
  // Scale XP cap based on level
  const xpCap = level * 100 + 200;
  
  if (xp >= xpCap) {
    const newLevel = level + 1;
    const newXp = xp - xpCap;
    
    // Update user data
    const userData = JSON.parse(localStorage.getItem(`levelUpUser_${area}`)) || {};
    userData.level = newLevel;
    userData.xp = newXp;
    
    // Save updated data
    saveUserData(area, userData);
    
    // Show level up celebration
    celebrateLevelUp(newLevel);
    
    // Update dashboard with new level
    initDashboard({
      area,
      level: newLevel,
      xp: newXp,
      quests: userData.quests || []
    });
    
    return true;
  }
  return false;
}

function initDashboard(data) {
  console.log('Initializing dashboard with data:', data);
  const { area, level, xp, quests } = data;
  const xpCap = level * 100 + 200;
  const theme = AREA_THEMES[area] || AREA_THEMES.Physical;

  // Update the dashboard theme immediately
  const dashboard = document.getElementById("section-dashboard");
  if (dashboard) {
    // Remove all possible theme classes first
    dashboard.classList.remove(
      'bg-gradient-to-br',
      'from-orange-50',
      'to-orange-100',
      'from-purple-50',
      'to-purple-100',
      'from-red-50',
      'to-red-100'
    );
    // Add new theme classes
    dashboard.className = `min-h-screen ${theme.background} p-6`;
  }

  // Update the sidebar theme immediately
  const sidebar = document.getElementById("sidebar");
  if (sidebar) {
    // Remove all possible theme classes first
    sidebar.classList.remove(
      'bg-gradient-to-b',
      'from-orange-50',
      'to-orange-100',
      'from-purple-50',
      'to-purple-100',
      'from-red-50',
      'to-red-100'
    );
    
    // Add new theme classes based on area
    if (area === 'Physical') {
      sidebar.classList.add('bg-gradient-to-b', 'from-orange-50', 'to-orange-100');
    } else if (area === 'Mental') {
      sidebar.classList.add('bg-gradient-to-b', 'from-purple-50', 'to-purple-100');
    } else if (area === 'Relationships') {
      sidebar.classList.add('bg-gradient-to-b', 'from-red-50', 'to-red-100');
    }
  }

  // Update the area title with theme
  const areaTitle = document.getElementById("dashboardArea");
  if (areaTitle) {
    areaTitle.innerHTML = `
      <span class="text-2xl">${theme.icon}</span>
      <span class="ml-2">${theme.title}</span>
    `;
  }

  // Update level and XP display
  const levelDisplay = document.getElementById("dashboardLevel");
  if (levelDisplay) {
    levelDisplay.textContent = `Level ${level}`;
  }

  const xpText = document.getElementById("xpText");
  if (xpText) {
    xpText.textContent = `${xp} / ${xpCap} XP`;
  }
  
  // Update XP bar with theme color
  const xpBar = document.getElementById("xpBar");
  if (xpBar) {
    const percentage = Math.min(Math.floor((xp / xpCap) * 100), 100);
    xpBar.style.width = `${percentage}%`;
    xpBar.style.backgroundColor = theme.primary;
    xpBar.style.transition = 'width 0.3s ease-out';
  }

  // Update streak
  updateStreak(area);

  // Display quests
  const questList = document.getElementById("questList");
  if (questList) {
    questList.innerHTML = "";
    
    // Ensure we have quests to display
    const questsToDisplay = quests || generateQuests(area, level);
    
    if (!questsToDisplay || questsToDisplay.length === 0) {
      questList.innerHTML = `
        <div class="text-center py-4 text-gray-500">
          <p>No quests available right now.</p>
          <button onclick="refreshQuests()" class="mt-2 px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors">
            Generate New Quests
          </button>
        </div>
      `;
      return;
    }

    questsToDisplay.forEach((quest, index) => {
      if (!quest) return;
      
      const div = document.createElement("div");
      div.className = "bg-gray-50 rounded-lg p-4 quest-card opacity-0";
      div.style.animation = `fadeIn 0.3s ease-out ${index * 0.1}s forwards`;
      div.setAttribute('data-quest-id', quest.id);
      div.innerHTML = `
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center justify-between mb-2">
              <h4 class="font-semibold">${quest.title || 'Unnamed Quest'}</h4>
              <span class="text-xs px-2 py-1 rounded-full ${
                quest.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                quest.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }">${quest.difficulty}</span>
            </div>
            <p class="text-sm text-gray-600 mb-3">${quest.description || 'No description available'}</p>
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <span class="text-sm">⏱️ ${quest.duration || '5'} min</span>
                <span class="text-sm theme-primary">✨ ${quest.xpValue} XP</span>
              </div>
              <div class="flex items-center space-x-2">
                <button class="refresh-btn p-1 rounded hover:bg-gray-200 transition-colors" title="New Quest">
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
            </div>
          </div>
        </div>
      `;

      // Add refresh button handler
      const refreshBtn = div.querySelector('.refresh-btn');
      refreshBtn.addEventListener('click', () => {
        refreshQuest(quest.id);
      });

      // Add complete button handler
      const completeBtn = div.querySelector('.complete-btn');
      if (!quest.completed) {
        completeBtn.addEventListener('click', () => {
          updateQuestProgress(quest.id, 100);
        });
      }

      questList.appendChild(div);
    });
  }

  // Update stats
  updateStats(data);
}

function updateStats(data) {
  const allData = getAllUserData();
  const totalXP = Object.values(allData).reduce((sum, areaData) => sum + (areaData.xp || 0), 0);
  const totalQuests = Object.values(allData).reduce((sum, areaData) => sum + (areaData.totalCompleted || 0), 0);
  const totalBadges = Object.values(allData).reduce((sum, areaData) => {
    const unlockedBadges = AREA_BADGES[areaData.area]?.filter(badge => {
      switch (badge.id) {
        case "starter": return areaData.totalCompleted >= 1;
        case "level5": return areaData.level >= 5;
        case "level10": return areaData.level >= 10;
        case "quest10": return areaData.totalCompleted >= 10;
        case "streak7": return parseInt(localStorage.getItem(`streak_${areaData.area}`)) >= 7;
        case "streak30": return parseInt(localStorage.getItem(`streak_${areaData.area}`)) >= 30;
        default: return false;
      }
    }).length || 0;
    return sum + unlockedBadges;
  }, 0);

  // Update stats display
  document.getElementById("stats-total-xp").textContent = `${totalXP} XP`;
  document.getElementById("stats-quests").textContent = totalQuests;
  document.getElementById("stats-level").textContent = `Level ${data.level}`;
  document.getElementById("stats-progress").textContent = `${data.xp} / ${data.level * 100 + 200} XP`;
  document.getElementById("stats-streak").textContent = `${localStorage.getItem(`streak_${data.area}`) || 0} days`;
  document.getElementById("stats-badges").textContent = totalBadges;

  // Update recent activity
  const activityContainer = document.getElementById("stats-activity");
  if (activityContainer) {
    // Clear previous activity
    activityContainer.innerHTML = "";
    
    // Add some placeholder activity items
    const activities = [
      { type: "quest", text: "Completed quest: Daily Exercise", time: "2h ago" },
      { type: "level", text: "Reached Level 2", time: "1d ago" },
      { type: "badge", text: "Earned badge: First Steps", time: "2d ago" }
    ];

    activities.forEach(activity => {
      const div = document.createElement("div");
      div.className = "flex items-center justify-between py-2 border-b last:border-0";
      div.innerHTML = `
        <span class="text-sm text-gray-600">${activity.text}</span>
        <span class="text-xs text-gray-400">${activity.time}</span>
      `;
      activityContainer.appendChild(div);
    });
  }
}

function getDifficultyLevel(level) {
  if (level < 5) return DIFFICULTY_LEVELS.BEGINNER;
  if (level < 15) return DIFFICULTY_LEVELS.INTERMEDIATE;
  if (level < 30) return DIFFICULTY_LEVELS.ADVANCED;
  return DIFFICULTY_LEVELS.EXPERT;
}

function getLevelRange(level) {
  return Object.values(LEVEL_RANGES).find(range => 
    level >= range.min && level <= range.max
  ) || LEVEL_RANGES.GRANDMASTER;
}

function generateQuests(area, level) {
  console.log('Starting generateQuests for area:', area, 'level:', level);
  
  // Get quests for the area
  const areaQuests = QUEST_POOL[area];
  if (!areaQuests) {
    console.error('No quests found for area:', area);
    return getDefaultQuests();
  }

  // Get the level range for current level
  const range = getLevelRange(level);
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

  // If no quests found for this level range, try to get quests from adjacent ranges
  if (availableQuests.length === 0) {
    console.log('No quests found for current range, trying adjacent ranges');
    Object.values(LEVEL_RANGES).forEach(adjacentRange => {
      const adjacentKey = `${adjacentRange.min}-${adjacentRange.max}`;
      Object.keys(areaQuests).forEach(category => {
        if (areaQuests[category][adjacentKey]) {
          availableQuests = availableQuests.concat(areaQuests[category][adjacentKey]);
        }
      });
    });
  }

  // If still no quests, use default quests
  if (availableQuests.length === 0) {
    console.error('No quests available in any range, using default quests');
    return getDefaultQuests();
  }

  // Select 5 random quests
  const selectedQuests = shuffleArray(availableQuests)
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

// Helper function for default quests
function getDefaultQuests() {
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

// Helper function to shuffle array
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Update the updateQuestProgress function to check achievements
function updateQuestProgress(questId, progress) {
  console.log('Updating quest progress:', questId, progress);
  const currentArea = localStorage.getItem('currentFocusArea');
  if (!currentArea) {
    console.error('No current area found');
    return;
  }

  const userData = JSON.parse(localStorage.getItem(`levelUpUser_${currentArea}`)) || {};
  const quests = userData.quests || [];
  const quest = quests.find(q => q.id === questId);
  
  if (!quest) {
    console.error('Quest not found:', questId);
    return;
  }
  
  // Update quest progress
  quest.progress = progress;
  if (progress >= 100 && !quest.completed) {
    quest.completed = true;
    
    // Play themed completion sound
    gameSounds.questComplete?.play().catch(() => {});
    
    // Calculate XP with difficulty multiplier
    const baseXP = quest.xpValue || 20;
    const multiplier = DIFFICULTY_MULTIPLIERS[quest.difficulty] || 1;
    const finalXP = Math.round(baseXP * multiplier);
    
    userData.xp = (userData.xp || 0) + finalXP;
    userData.totalCompleted = (userData.totalCompleted || 0) + 1;
    console.log('Awarded XP:', finalXP, 'New total XP:', userData.xp);
    
    // Check for achievements
    const newAchievements = checkAchievements(userData);
    newAchievements.forEach(achievementId => {
      const badge = BADGES.find(b => b.id === achievementId);
      if (badge) {
        showAchievement(badge.name, badge.desc);
        unlockBadge(achievementId);
      }
    });
    
    // Show completion animation
    const questElement = document.querySelector(`[data-quest-id="${questId}"]`);
    if (questElement) {
      // Update the quest card UI
      const completeBtn = questElement.querySelector('.complete-btn');
      if (completeBtn) {
        completeBtn.textContent = 'Completed!';
        completeBtn.classList.remove('bg-green-500', 'hover:bg-green-600');
        completeBtn.classList.add('bg-gray-300', 'cursor-not-allowed');
        completeBtn.disabled = true;
      }
      
      // Add glow effect
      questElement.classList.add('quest-complete-glow');
      
      // Create floating XP element
      const xpPopup = document.createElement('div');
      xpPopup.className = 'xp-popup';
      xpPopup.textContent = `+${finalXP} XP`;
      questElement.appendChild(xpPopup);
      
      // Update XP display and bar without reloading
      const xpCap = userData.level * 100 + 200;
      const percentage = Math.min(Math.floor((userData.xp / xpCap) * 100), 100);
      
      const xpBar = document.getElementById("xpBar");
      const xpText = document.getElementById("xpText");
      if (xpBar) {
        xpBar.style.width = `${percentage}%`;
      }
      if (xpText) {
        xpText.textContent = `${userData.xp} / ${xpCap} XP`;
      }
      
      // Check for level up
      const leveledUp = checkForLevelUp(currentArea, userData.level, userData.xp);
      if (leveledUp) {
        return; // Level up will handle the dashboard update
      }
    }
  }
  
  // Save updated data
  saveUserData(currentArea, userData);
}

function refreshQuest(questId) {
  console.log('Refreshing quest:', questId);
  const currentArea = localStorage.getItem('currentFocusArea');
  if (!currentArea) {
    console.error('No current area found');
    return;
  }

  // Get current user data
  const userData = JSON.parse(localStorage.getItem(`levelUpUser_${currentArea}`)) || {};
  const quests = userData.quests || [];
  
  // Find the quest to refresh
  const questIndex = quests.findIndex(q => q.id === questId);
  if (questIndex === -1) {
    console.error('Quest not found:', questId);
    return;
  }

  const oldQuest = quests[questIndex];
  if (!oldQuest.refreshable) {
    console.log('Quest is not refreshable:', questId);
    return;
  }

  // Get the level range for current level
  const range = getLevelRange(userData.level);
  const rangeKey = `${range.min}-${range.max}`;
  
  // Get all available quests for this level range
  let availableQuests = [];
  Object.keys(QUEST_POOL[currentArea]).forEach(category => {
    const categoryQuests = QUEST_POOL[currentArea][category][rangeKey];
    if (categoryQuests) {
      availableQuests = availableQuests.concat(categoryQuests);
    }
  });

  // If no quests found for this level range, try to get quests from adjacent ranges
  if (availableQuests.length === 0) {
    console.log('No quests found for current range, trying adjacent ranges');
    Object.values(LEVEL_RANGES).forEach(adjacentRange => {
      const adjacentKey = `${adjacentRange.min}-${adjacentRange.max}`;
      Object.keys(QUEST_POOL[currentArea]).forEach(category => {
        if (QUEST_POOL[currentArea][category][adjacentKey]) {
          availableQuests = availableQuests.concat(QUEST_POOL[currentArea][category][adjacentKey]);
        }
      });
    });
  }

  // If still no quests, use default quests
  if (availableQuests.length === 0) {
    console.log('No quests available in any range, using default quests');
    availableQuests = getDefaultQuests();
  }

  // Filter out currently active quests
  const activeQuestIds = quests.map(q => q.id);
  let newQuests = availableQuests.filter(q => !activeQuestIds.includes(q.id));

  // If all quests are active, allow refreshing with the same quest pool
  if (newQuests.length === 0) {
    console.log('All quests are active, allowing refresh with same pool');
    newQuests = availableQuests;
  }

  if (newQuests.length > 0) {
    // Randomly select a new quest
    const newQuest = {
      ...shuffleArray(newQuests)[0],
      completed: false,
      progress: 0,
      refreshable: true
    };

    // Replace the old quest
    quests[questIndex] = newQuest;
    
    // Update user data
    userData.quests = quests;
    
    // Save updated data
    saveUserData(currentArea, userData);
    
    // Update dashboard
    initDashboard({
      area: currentArea,
      level: userData.level,
      xp: userData.xp,
      quests: quests
    });
    
    console.log('Quest refreshed successfully:', newQuest);
  } else {
    console.log('No new quests available for refresh');
    // Show a message to the user
    showAchievement('No New Quests', 'All available quests are already active. Try completing some first!');
  }
}

function showIntermission(message) {
  return new Promise((resolve) => {
    const container = document.getElementById('questionContainer');
    const navigation = document.querySelector('#surveyForm > div:last-child');
    
    // Hide navigation
    if (navigation) navigation.style.display = 'none';
    
    // Create intermission content
    container.innerHTML = `
      <div class="question-card bg-gradient-to-r from-indigo-500 to-purple-600 p-8 rounded-xl shadow-lg text-center">
        <div class="text-white">
          <div class="text-4xl mb-4">✨</div>
          <p class="text-xl font-medium mb-6">${message}</p>
          <button class="bg-white text-indigo-600 px-6 py-2 rounded-full font-medium hover:bg-opacity-90">
            Continue Your Journey
          </button>
        </div>
      </div>
    `;

    // Add click handler
    const continueBtn = container.querySelector('button');
    continueBtn.addEventListener('click', () => {
      if (navigation) navigation.style.display = 'flex';
      resolve();
    });

    // Animate in
    requestAnimationFrame(() => {
      container.querySelector('.question-card').classList.add('show');
    });
  });
}

function startSurvey(selectedArea) {
  console.log('Starting survey for area:', selectedArea);
  
  // Check if we already have data for this area
  const existingData = JSON.parse(localStorage.getItem(`levelUpUser_${selectedArea}`));
  if (existingData && existingData.quests) {
    // If we have data, just switch to that area
    currentState.area = selectedArea;
    localStorage.setItem('currentFocusArea', selectedArea);
    
    // Update UI
    const sidebar = document.getElementById("sidebar");
    if (sidebar) {
      sidebar.classList.remove('hidden');
      setTimeout(() => sidebar.classList.add('show'), 100);
    }
    
    // Show dashboard with existing data
    showSection("dashboard");
    initDashboard(existingData);
    return;
  }
  
  // Only start new survey if we don't have data
  currentState.surveyInProgress = true;
  area = selectedArea;
  selected = questions[area];
  current = 0;
  selectedValue = null;
  responses = new Array(selected.length).fill(0);
  
  const areaSelection = document.getElementById('area-selection');
  const survey = document.getElementById('survey');
  
  if (areaSelection) areaSelection.classList.add('hidden');
  if (survey) {
    survey.classList.remove('hidden');
    survey.className = 'min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 p-6';
    
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    
    // Clear existing event listeners
    const newNextBtn = nextBtn.cloneNode(true);
    const newPrevBtn = prevBtn.cloneNode(true);
    nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);
    prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);

    // Add new event listeners
    newNextBtn.addEventListener('click', async function() {
      if (selectedValue === null) return;
      
      responses[current] = selectedValue;
      
      if (current === selected.length - 1) {
        currentState.surveyInProgress = false;
        await finishSurvey(area, responses);
      } else {
        // Check for intermission
        const intermission = INTERMISSIONS[area]?.find(i => i.after === current + 1);
        
        if (intermission) {
          await showIntermission(intermission.message);
        }
        
        current++;
        selectedValue = responses[current] || null;
        renderQuestion();
        newPrevBtn.disabled = false;
      }
    });
    
    newPrevBtn.addEventListener('click', function() {
      if (current > 0) {
        current--;
        selectedValue = responses[current];
        renderQuestion();
        this.disabled = current === 0;
      }
    });
  }
  
  renderQuestion();
}

function renderQuestion() {
  const container = document.getElementById('questionContainer');
  if (!container) return;

  // Clear previous content
  container.innerHTML = '';

  // Create question content
  const questionHTML = `
    <div class="mb-8">
      <h3 class="text-2xl font-bold text-gray-900 mb-6">Q${current + 1}: ${selected[current]}</h3>
      <div class="space-y-4">
        <label class="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
          <input type="radio" name="response" value="1" class="h-5 w-5 text-indigo-600" ${selectedValue === 1 ? 'checked' : ''}>
          <span class="ml-3 text-lg text-gray-900">Not at all</span>
        </label>
        <label class="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
          <input type="radio" name="response" value="2" class="h-5 w-5 text-indigo-600" ${selectedValue === 2 ? 'checked' : ''}>
          <span class="ml-3 text-lg text-gray-900">Rarely</span>
        </label>
        <label class="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
          <input type="radio" name="response" value="3" class="h-5 w-5 text-indigo-600" ${selectedValue === 3 ? 'checked' : ''}>
          <span class="ml-3 text-lg text-gray-900">Sometimes</span>
        </label>
        <label class="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
          <input type="radio" name="response" value="4" class="h-5 w-5 text-indigo-600" ${selectedValue === 4 ? 'checked' : ''}>
          <span class="ml-3 text-lg text-gray-900">Often</span>
        </label>
        <label class="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
          <input type="radio" name="response" value="5" class="h-5 w-5 text-indigo-600" ${selectedValue === 5 ? 'checked' : ''}>
          <span class="ml-3 text-lg text-gray-900">Always</span>
        </label>
      </div>
    </div>
  `;

  container.innerHTML = questionHTML;

  // Add radio button event listeners
  const radioButtons = container.querySelectorAll('input[type="radio"]');
  radioButtons.forEach(radio => {
    radio.addEventListener('change', () => {
      selectedValue = parseInt(radio.value);
      const nextBtn = document.getElementById('nextBtn');
      if (nextBtn) nextBtn.disabled = false;

      // Update selected styles
      const labels = container.querySelectorAll('label');
      labels.forEach(label => {
        if (label.querySelector('input').checked) {
          label.style.backgroundColor = '#eef2ff';
          label.style.borderColor = '#6366f1';
        } else {
          label.style.backgroundColor = 'white';
          label.style.borderColor = '#e5e7eb';
        }
      });
    });
  });

  // Add hover effects
  const labels = container.querySelectorAll('label');
  labels.forEach(label => {
    label.addEventListener('mouseover', () => {
      if (!label.querySelector('input').checked) {
        label.style.backgroundColor = '#f9fafb';
      }
    });
    label.addEventListener('mouseout', () => {
      if (!label.querySelector('input').checked) {
        label.style.backgroundColor = 'white';
      }
    });
  });
}

// Add this new function for staggered animations
function animateElements(elements, delay = 100) {
  elements.forEach((el, index) => {
    setTimeout(() => {
      el.classList.add('show');
    }, index * delay);
  });
}

// Show achievement popup
function showAchievement(title, description) {
  const popup = document.createElement('div');
  popup.className = 'achievement-popup';
  popup.innerHTML = `
    <div class="flex items-center">
      <div class="text-3xl mr-3">��</div>
      <div>
        <div class="font-bold">${title}</div>
        <div class="text-sm opacity-90">${description}</div>
      </div>
    </div>
  `;
  
  document.body.appendChild(popup);
  
  // Play achievement sound
  gameSounds.achievement?.play().catch(() => {});
  
  // Animate in
  requestAnimationFrame(() => popup.classList.add('show'));
  
  // Remove after delay
  setTimeout(() => {
    popup.classList.remove('show');
    setTimeout(() => popup.remove(), 500);
  }, 3000);
}

// Update the switchFocusArea function
async function switchFocusArea(area) {
  console.log('Switching to area:', area);
  const allData = getAllUserData();
  
  // Check if we have data for this area
  if (allData[area] && allData[area].quests) {
    // Update current area
    currentState.area = area;
    localStorage.setItem('currentFocusArea', area);
    
    // Update dashboard with existing data
    showSection("dashboard");
    
    // Apply realm-specific theme
    const theme = AREA_THEMES[area];
    const sidebar = document.getElementById("sidebar");
    const dashboard = document.getElementById("section-dashboard");
    
    // Update sidebar theme
    if (sidebar) {
      // Remove previous theme classes
      sidebar.classList.remove(
        'bg-gradient-to-b',
        'from-orange-50',
        'to-orange-100',
        'from-purple-50',
        'to-purple-100',
        'from-red-50',
        'to-red-100'
      );
      
      // Add new theme classes
      if (area === 'Physical') {
        sidebar.classList.add('bg-gradient-to-b', 'from-orange-50', 'to-orange-100');
      } else if (area === 'Mental') {
        sidebar.classList.add('bg-gradient-to-b', 'from-purple-50', 'to-purple-100');
      } else if (area === 'Relationships') {
        sidebar.classList.add('bg-gradient-to-b', 'from-red-50', 'to-red-100');
      }
    }
    
    // Update dashboard theme
    if (dashboard) {
      // Remove previous theme classes
      dashboard.classList.remove(
        'bg-gradient-to-br',
        'from-orange-50',
        'to-orange-100',
        'from-purple-50',
        'to-purple-100',
        'from-red-50',
        'to-red-100'
      );
      
      // Add new theme classes
      dashboard.className = `min-h-screen ${theme.background} p-6`;
    }
    
    // Update area buttons
    document.querySelectorAll('.focus-area-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.textContent.includes(area)) {
        btn.classList.add('active');
      }
    });
    
    initDashboard(allData[area]);
    return;
  }
  
  // Show survey prompt if area is locked
  const shouldTakeSurvey = await showConfirmDialog(
    '🔒 Area Locked',
    `Take a quick assessment to unlock ${area} focus area and start your journey!`,
    'Take Assessment',
    'Maybe Later'
  );
  
  if (shouldTakeSurvey) {
    currentState.surveyInProgress = true;
    startSurvey(area);
  }
}

// Add this function to show a nice confirmation dialog
function showConfirmDialog(title, message, confirmText, cancelText) {
  return new Promise((resolve) => {
    const dialog = document.createElement('div');
    dialog.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    dialog.innerHTML = `
      <div class="bg-white rounded-lg p-6 max-w-md mx-4 transform scale-95 transition-transform duration-200">
        <h3 class="text-xl font-bold mb-2">${title}</h3>
        <p class="text-gray-600 mb-6">${message}</p>
        <div class="flex justify-end space-x-3">
          <button class="cancel-btn px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">
            ${cancelText}
          </button>
          <button class="confirm-btn bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
            ${confirmText}
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(dialog);
    requestAnimationFrame(() => dialog.querySelector('div').style.transform = 'scale(1)');
    
    dialog.querySelector('.confirm-btn').addEventListener('click', () => {
      dialog.remove();
      resolve(true);
    });
    
    dialog.querySelector('.cancel-btn').addEventListener('click', () => {
      dialog.remove();
      resolve(false);
    });
  });
}

// Add this function to get all user data
function getAllUserData() {
  const allData = {};
  FOCUS_AREAS.forEach(area => {
    const data = localStorage.getItem(`levelUpUser_${area}`);
    if (data) {
      try {
        allData[area] = JSON.parse(data);
      } catch (e) {
        console.error('Error parsing data for area:', area, e);
      }
    }
  });
  return allData;
}

// Add this function to save user data for an area
function saveUserData(area, data) {
  try {
    localStorage.setItem(`levelUpUser_${area}`, JSON.stringify(data));
    console.log('Data saved for area:', area, data);
  } catch (e) {
    console.error('Error saving data for area:', area, e);
  }
}

function showOnboardingScreen() {
  const container = document.createElement('div');
  container.className = 'fixed inset-0 bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center z-50';
  container.innerHTML = `
    <div class="max-w-2xl mx-4 text-center text-white">
      <div class="space-y-6 transform transition-all duration-500 translate-y-4 opacity-0" id="onboardingContent">
        <div class="text-6xl mb-8">🌟</div>
        <h1 class="text-4xl font-bold mb-4">Welcome to LevelUp Life</h1>
        <p class="text-xl mb-8">Your journey to personal growth starts here!</p>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div class="bg-white bg-opacity-10 rounded-xl p-6">
            <div class="text-3xl mb-4">💪</div>
            <h3 class="text-lg font-semibold mb-2">Physical Wellness</h3>
            <p class="text-sm text-indigo-100">Build healthy habits and stay active</p>
          </div>
          <div class="bg-white bg-opacity-10 rounded-xl p-6">
            <div class="text-3xl mb-4">🧠</div>
            <h3 class="text-lg font-semibold mb-2">Mental Growth</h3>
            <p class="text-sm text-indigo-100">Develop mindfulness and learning</p>
          </div>
          <div class="bg-white bg-opacity-10 rounded-xl p-6">
            <div class="text-3xl mb-4">❤️</div>
            <h3 class="text-lg font-semibold mb-2">Relationships</h3>
            <p class="text-sm text-indigo-100">Strengthen your connections</p>
          </div>
        </div>

        <div class="space-y-4 mb-8">
          <div class="flex items-center justify-center space-x-3">
            <div class="w-8 h-8 bg-white bg-opacity-10 rounded-full flex items-center justify-center">✨</div>
            <p class="text-lg">Complete personalized daily quests</p>
          </div>
          <div class="flex items-center justify-center space-x-3">
            <div class="w-8 h-8 bg-white bg-opacity-10 rounded-full flex items-center justify-center">📈</div>
            <p class="text-lg">Track your progress and level up</p>
          </div>
          <div class="flex items-center justify-center space-x-3">
            <div class="w-8 h-8 bg-white bg-opacity-10 rounded-full flex items-center justify-center">🏆</div>
            <p class="text-lg">Earn badges and achievements</p>
          </div>
        </div>

        <button class="bg-white text-indigo-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-opacity-90 transition-all transform hover:scale-105">
          Begin Your Journey
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(container);

  // Animate in
  requestAnimationFrame(() => {
    const content = document.getElementById('onboardingContent');
    content.classList.remove('translate-y-4', 'opacity-0');
  });

  // Add click handler
  container.querySelector('button').addEventListener('click', () => {
    container.classList.add('fade-out');
    setTimeout(() => {
      container.remove();
      goToAreaSelection();
    }, 500);
  });

  // Add fade-out animation style
  const style = document.createElement('style');
  style.textContent = `
    .fade-out {
      animation: fadeOut 0.5s forwards;
    }
    @keyframes fadeOut {
      to {
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

// Add this function to load saved data on page load
function loadSavedData() {
  const currentArea = localStorage.getItem('currentFocusArea');
  if (currentArea) {
    const userData = JSON.parse(localStorage.getItem(`levelUpUser_${currentArea}`)) || {};
    if (userData.quests) {
      initDashboard({
        area: currentArea,
        level: userData.level,
        xp: userData.xp,
        quests: userData.quests
      });
    }
  }
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  preloadAudio();
  const currentArea = localStorage.getItem('currentFocusArea');
  const allData = getAllUserData();
  const profileSaved = localStorage.getItem("profileData");
  const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");
  
  if (profileSaved) userProfile = JSON.parse(profileSaved);

  // Hide welcome screen by default
  const startApp = document.getElementById("start-app");
  if (startApp) startApp.classList.add("hidden");
  
  if (!hasSeenOnboarding) {
    // First time user
    const sidebar = document.getElementById("sidebar");
    if (sidebar) sidebar.classList.add('hidden');
    showOnboardingScreen();
    localStorage.setItem("hasSeenOnboarding", "true");
  } else if (currentArea && allData[currentArea]) {
    // Returning user with data
    const sidebar = document.getElementById("sidebar");
    if (sidebar) {
      sidebar.classList.remove('hidden');
      setTimeout(() => sidebar.classList.add('show'), 100);
    }
    
    // Show dashboard immediately
    showSection("dashboard");
    initDashboard(allData[currentArea]);
  } else {
    // Returning user without data
    const sidebar = document.getElementById("sidebar");
    if (sidebar) sidebar.classList.add('hidden');
    const areaSelection = document.getElementById("area-selection");
    if (areaSelection) areaSelection.classList.remove('hidden');
    renderBadges({ level: 0, totalCompleted: 0 });
  }

  // Add profile form handler
  const profileForm = document.getElementById('profileForm');
  if (profileForm) {
    profileForm.onsubmit = (e) => {
      e.preventDefault();
      const newProfile = {
        name: document.getElementById('inputName').value || 'Adventurer',
        avatar: document.getElementById('inputAvatar').value || '🧙',
        title: document.getElementById('inputTitle').value || 'The Motivated One'
      };
      localStorage.setItem('profileData', JSON.stringify(newProfile));
      userProfile = newProfile;
      
      // Update display
      const profileName = document.getElementById('profileName');
      const profileAvatar = document.getElementById('profileAvatar');
      const profileTitle = document.getElementById('profileTitle');
      
      if (profileName) profileName.textContent = newProfile.name;
      if (profileAvatar) profileAvatar.textContent = newProfile.avatar;
      if (profileTitle) profileTitle.textContent = newProfile.title;
      
      alert('Profile updated successfully!');
    };
  }

  // Add this CSS for the XP popup
  const style = document.createElement('style');
  style.textContent = `
    .xp-popup {
      position: absolute;
      right: 10px;
      top: -20px;
      background: #4f46e5;
      color: white;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: bold;
      animation: xp-popup 2s ease-out;
      opacity: 0;
      z-index: 10;
    }
    
    @keyframes xp-popup {
      0% {
        transform: translateY(0);
        opacity: 1;
      }
      100% {
        transform: translateY(-30px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  // Initialize settings
  initSettings();
});

const AREA_BADGES = {
    Physical: [
        { id: "starter", name: "First Steps", desc: "Complete your first physical quest" },
        { id: "level5", name: "Fitness Novice", desc: "Reach Level 5 in Physical" },
        { id: "streak7", name: "Consistent Mover", desc: "Maintain a 7-day streak" },
        { id: "quest10", name: "Physical Master", desc: "Complete 10 physical quests" },
        { id: "level10", name: "Fitness Expert", desc: "Reach Level 10 in Physical" },
        { id: "streak30", name: "Dedicated Athlete", desc: "Maintain a 30-day streak" }
    ],
    Mental: [
        { id: "starter", name: "Mind Awakening", desc: "Complete your first mental quest" },
        { id: "level5", name: "Mental Novice", desc: "Reach Level 5 in Mental" },
        { id: "streak7", name: "Mindful Streak", desc: "Maintain a 7-day streak" },
        { id: "quest10", name: "Mental Master", desc: "Complete 10 mental quests" },
        { id: "level10", name: "Mental Expert", desc: "Reach Level 10 in Mental" },
        { id: "streak30", name: "Zen Master", desc: "Maintain a 30-day streak" }
    ],
    Relationships: [
        { id: "starter", name: "First Connection", desc: "Complete your first relationship quest" },
        { id: "level5", name: "Social Novice", desc: "Reach Level 5 in Relationships" },
        { id: "streak7", name: "Consistent Connector", desc: "Maintain a 7-day streak" },
        { id: "quest10", name: "Social Master", desc: "Complete 10 relationship quests" },
        { id: "level10", name: "Relationship Expert", desc: "Reach Level 10 in Relationships" },
        { id: "streak30", name: "Social Butterfly", desc: "Maintain a 30-day streak" }
    ]
};

const AREA_THEMES = {
    Physical: {
        primary: '#f97316', // Orange-500
        secondary: '#fb923c', // Orange-400
        background: 'bg-gradient-to-br from-orange-50 to-orange-100',
        icon: '💪',
        title: 'Physical Realm'
    },
    Mental: {
        primary: '#7c3aed', // Purple-600
        secondary: '#8b5cf6', // Purple-500
        background: 'bg-gradient-to-br from-purple-50 to-purple-100',
        icon: '🧠',
        title: 'Mental Realm'
    },
    Relationships: {
        primary: '#dc2626', // Red-600
        secondary: '#ef4444', // Red-500
        background: 'bg-gradient-to-br from-red-50 to-red-100',
        icon: '❤️',
        title: 'Relationships Realm'
    }
};

// Add these functions at the end of the file, before the last closing brace

// Settings functions
function initSettings() {
  // Load saved settings
  const settings = JSON.parse(localStorage.getItem('appSettings')) || {
    soundEnabled: true,
    soundVolume: 50,
    darkMode: false,
    questReminders: true,
    streakReminders: true
  };

  // Set initial values
  document.getElementById('soundEnabled').checked = settings.soundEnabled;
  document.getElementById('soundVolume').value = settings.soundVolume;
  document.getElementById('darkMode').checked = settings.darkMode;
  document.getElementById('questReminders').checked = settings.questReminders;
  document.getElementById('streakReminders').checked = settings.streakReminders;

  // Add event listeners
  document.getElementById('soundEnabled').addEventListener('change', saveSettings);
  document.getElementById('soundVolume').addEventListener('change', saveSettings);
  document.getElementById('darkMode').addEventListener('change', saveSettings);
  document.getElementById('questReminders').addEventListener('change', saveSettings);
  document.getElementById('streakReminders').addEventListener('change', saveSettings);
}

function saveSettings() {
  const settings = {
    soundEnabled: document.getElementById('soundEnabled').checked,
    soundVolume: parseInt(document.getElementById('soundVolume').value),
    darkMode: document.getElementById('darkMode').checked,
    questReminders: document.getElementById('questReminders').checked,
    streakReminders: document.getElementById('streakReminders').checked
  };

  localStorage.setItem('appSettings', JSON.stringify(settings));
  applySettings(settings);
}

function applySettings(settings) {
  // Apply sound settings
  if (window.gameSounds) {
    Object.values(window.gameSounds).forEach(sound => {
      sound.volume = settings.soundEnabled ? settings.soundVolume / 100 : 0;
    });
  }

  // Apply dark mode
  if (settings.darkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

function exportData() {
  const data = {
    userData: getAllUserData(),
    settings: JSON.parse(localStorage.getItem('appSettings')) || {}
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'levelup-life-data.json';
  a.click();
  URL.revokeObjectURL(url);
}

function importData() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        
        // Import user data
        if (data.userData) {
          Object.entries(data.userData).forEach(([area, areaData]) => {
            saveUserData(area, areaData);
          });
        }
        
        // Import settings
        if (data.settings) {
          localStorage.setItem('appSettings', JSON.stringify(data.settings));
          initSettings();
        }
        
        showAchievement('Data Imported', 'Your data has been successfully imported!');
      } catch (error) {
        console.error('Error importing data:', error);
        showAchievement('Import Failed', 'There was an error importing your data.');
      }
    };
    reader.readAsText(file);
  };
  
  input.click();
}

// Initialize settings when the app loads
document.addEventListener('DOMContentLoaded', () => {
  // ... existing DOMContentLoaded code ...
  initSettings();
});

// Add these functions at the end of the file, before the last closing brace

// Chatbot functionality
async function sendChatMessage() {
  const input = document.getElementById('chatInput');
  const message = input.value.trim();
  if (!message) return;

  // Add user message to chat
  addMessageToChat('user', message);
  input.value = '';

  // Show typing indicator
  const typingIndicator = document.createElement('div');
  typingIndicator.className = 'flex items-start';
  typingIndicator.innerHTML = `
    <div class="bg-gray-100 rounded-lg p-3 max-w-[80%]">
      <div class="flex space-x-2">
        <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
        <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
        <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
      </div>
    </div>
  `;
  document.getElementById('chatMessages').appendChild(typingIndicator);

  try {
    // Get current context
    const currentArea = localStorage.getItem('currentFocusArea');
    const userData = JSON.parse(localStorage.getItem(`levelUpUser_${currentArea}`)) || {};
    const quests = userData.quests || [];

    // Prepare context
    const context = {
      area: currentArea,
      level: userData.level || 1,
      xp: userData.xp || 0,
      quests: quests.filter(q => !q.completed)
    };

    // Call backend API
    const response = await fetch('http://localhost:5000/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: message,
        context: context
      })
    });

    const data = await response.json();
    
    // Remove typing indicator
    typingIndicator.remove();

    if (data.success) {
      addMessageToChat('assistant', data.response);
    } else {
      addMessageToChat('assistant', "I'm sorry, I encountered an error. Please try again.");
    }
  } catch (error) {
    console.error('Error:', error);
    typingIndicator.remove();
    addMessageToChat('assistant', "I'm sorry, I'm having trouble connecting. Please try again later.");
  }
}

function addMessageToChat(sender, message) {
  const chatMessages = document.getElementById('chatMessages');
  const messageDiv = document.createElement('div');
  messageDiv.className = `flex items-start ${sender === 'user' ? 'justify-end' : ''}`;
  
  const bubble = document.createElement('div');
  bubble.className = `rounded-lg p-3 max-w-[80%] ${
    sender === 'user' 
      ? 'bg-indigo-600 text-white' 
      : 'bg-gray-100'
  }`;
  bubble.innerHTML = `<p class="text-sm">${message}</p>`;
  
  messageDiv.appendChild(bubble);
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ... rest of the existing code ...