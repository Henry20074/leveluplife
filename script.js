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
    {
      id: "n1",
      question: "I eat a variety of nutrient-dense foods every day (including fruits, vegetables, lean proteins, and whole grains).",
      category: "Daily Nutrition Balance",
      weight: 3
    },
    {
      id: "n2",
      question: "I include a source of protein with most of my meals or snacks throughout the day.",
      category: "Protein with Meals",
      weight: 2
    },
    {
      id: "n3",
      question: "I drink water regularly throughout the day to stay hydrated.",
      category: "Hydration Habits",
      weight: 2
    },
    {
      id: "n4",
      question: "I limit sugary drinks like soda or sweetened coffees/teas, choosing water or unsweetened beverages most of the time.",
      category: "Beverage Choices",
      weight: 2
    },
    {
      id: "n5",
      question: "I allow myself occasional treats or 'junk food' in moderation without feeling guilt, as part of an overall healthy diet.",
      category: "Moderation & Treats",
      weight: 2
    },
    {
      id: "n6",
      question: "I don't label foods as strictly 'good' or 'bad' – instead, I focus on balance and portion control.",
      category: "No Food Blacklist",
      weight: 2
    },
    {
      id: "n7",
      question: "I maintain a regular eating schedule (avoiding skipping meals or extreme fasting) to fuel my body consistently.",
      category: "Consistent Meal Routine",
      weight: 2
    },
    {
      id: "a1",
      question: "I engage in physical activity (of any type) at least 3–5 times per week.",
      category: "Overall Activity Level",
      weight: 3
    },
    {
      id: "a2",
      question: "I get at least 150 minutes of moderate aerobic exercise (e.g. brisk walking, cycling) or 75 minutes of vigorous exercise each week.",
      category: "Cardio Exercise",
      weight: 3
    },
    {
      id: "a3",
      question: "I do resistance or strength-training exercises (like weightlifting or bodyweight workouts) at least twice per week.",
      category: "Strength Training",
      weight: 3
    },
    {
      id: "a4",
      question: "Even outside of formal workouts, I stay active (taking walks, using stairs, stretching at my desk) rather than sitting for long periods all day.",
      category: "Active Lifestyle (NEAT)",
      weight: 2
    },
    {
      id: "a5",
      question: "I have a consistent workout routine that I stick to each week, rarely missing planned exercise sessions.",
      category: "Exercise Consistency",
      weight: 2
    },
    {
      id: "a6",
      question: "I find ways to make exercise enjoyable (for example, listening to music/podcasts or doing fun activities), so I look forward to being active.",
      category: "Enjoyable Workouts",
      weight: 2
    },
    {
      id: "r1",
      question: "I take at least 1–2 rest days each week to let my body recover from exercise.",
      category: "Rest Days",
      weight: 2
    },
    {
      id: "r2",
      question: "I regularly get 7–9 hours of sleep per night to support my health and recovery.",
      category: "Sleep Duration",
      weight: 3
    },
    {
      id: "r3",
      question: "I go to bed and wake up at around the same time each day, even on weekends, to keep a consistent sleep schedule.",
      category: "Sleep Schedule",
      weight: 2
    },
    {
      id: "r4",
      question: "I prioritize recovery practices (such as stretching, foam rolling, or light active recovery workouts) to help my body feel its best.",
      category: "Recovery and Self-Care",
      weight: 2
    },
    {
      id: "l1",
      question: "I have healthy ways to manage stress (like exercise, meditation, or hobbies) so that stress doesn't derail my eating or exercise habits.",
      category: "Stress Management",
      weight: 2
    },
    {
      id: "l2",
      question: "I pay attention to my body's signals – if I'm truly exhausted or feeling pain, I allow myself to rest or adjust my workout plan.",
      category: "Listening to Your Body",
      weight: 2
    },
    {
      id: "l3",
      question: "I focus on being consistent with my health habits rather than being perfect – an occasional slip-up doesn't make me give up.",
      category: "Consistency Over Perfection",
      weight: 2
    },
    {
      id: "l4",
      question: "If I miss a workout or have an unhealthy day, I simply get back on track the next day instead of punishing myself or quitting my routine.",
      category: "Resilience After Setbacks",
      weight: 2
    },
    {
      id: "l5",
      question: "When I set fitness or weight goals, I prefer a slow and steady approach over any drastic or crash diet/workout program.",
      category: "Sustainable Pace",
      weight: 2
    },
    {
      id: "l6",
      question: "I plan or prep some of my meals and workouts ahead of time to make healthy choices easier during my busy week.",
      category: "Planning & Preparation",
      weight: 2
    },
    {
      id: "l7",
      question: "I keep my kitchen stocked with healthy options and limit tempting junk foods at home, so it's easier to stick to my nutrition goals.",
      category: "Food Environment",
      weight: 2
    },
    {
      id: "k1",
      question: "I feel informed about basic nutrition and exercise principles (like calories, macronutrients, and proper form) and use this knowledge in my daily life.",
      category: "Knowledge & Education",
      weight: 2
    },
    {
      id: "k2",
      question: "I stay up-to-date by reading, watching, or listening to credible health and fitness information to improve my habits (and I'm careful about fitness 'fads').",
      category: "Continuous Learning",
      weight: 2
    },
    {
      id: "k3",
      question: "I can generally tell sound health advice from myths or gimmicks – I don't fall for 'too good to be true' diet pills, detoxes, or fitness trends.",
      category: "Myth Busting",
      weight: 2
    },
    {
      id: "k4",
      question: "I track my progress in some way – for example, monitoring my body weight or measurements, keeping a workout log, or using a health app – to stay accountable.",
      category: "Progress Tracking",
      weight: 2
    },
    {
      id: "k5",
      question: "My healthy habits (exercise, eating, sleep) fit well into my lifestyle – I've found routines that work with my work/social life rather than conflict with it.",
      category: "Lifestyle Integration",
      weight: 2
    },
    {
      id: "k6",
      question: "I have a support system or community (friends, family, or online) that encourages my healthy lifestyle and keeps me motivated.",
      category: "Support System",
      weight: 2
    }
  ],
  Mental: [
    "I take responsibility for my own mental well-being rather than blaming other people or circumstances for my difficulties",
    "I set clear personal goals and actively work toward them, giving myself a sense of direction and progress",
    "I have a strong sense of purpose or meaning in my life that motivates me each day",
    "When faced with challenges or fears, I confront them even if it's uncomfortable, rather than avoiding them",
    "I maintain daily routines or habits that add structure and stability to my life",
    "I keep my living and work spaces clean and organized to help me feel in control and focused",
    "I get sufficient, restful sleep on a regular schedule to support my mood and energy levels",
    "I eat a nutritious, balanced diet to sustain my physical and mental health",
    "I engage in regular exercise or physical activity because it improves my mood and reduces stress",
    "I use healthy strategies to cope with stress – for example, taking short breaks, practicing relaxation techniques, or spending time in nature",
    "I set aside time for self-reflection or mindfulness to process my thoughts and feelings",
    "I can calm myself down in a healthy way when I'm upset or anxious",
    "I am aware of my emotions as they come and go, and I can usually identify what I'm feeling and why",
    "I have taken steps to understand and heal from painful past experiences or traumas",
    "I treat myself with kindness and understanding when I make mistakes or experience failures",
    "When I feel down or stressed, I turn to healthy coping activities instead of numbing myself",
    "I have at least one or two close friends or family members I can rely on for emotional support",
    "If I notice my mental health is suffering, I'm willing to seek help from a therapist or counselor",
    "I believe in my own worth as a person, and I generally have confidence in myself and my abilities",
    "I avoid comparing myself to others' successes or lifestyles and focus on being better than I was yesterday",
    "I maintain a healthy balance between my work and my personal life to prevent burnout",
    "I find small moments of joy or beauty in everyday life – even when times are tough",
    "I feel in control of my use of technology and can unplug when I need to focus on other priorities",
    "I have a clear sense of my own values and identity, rather than letting social media dictate who I should be",
    "I have hobbies or interests that I engage in regularly which bring me joy and help me relieve stress",
    "I don't let a single setback or bad experience completely overshadow the positive things in my life",
    "If I notice signs of my mental health worsening, I take action rather than ignoring it",
    "I make time for activities that give me a sense of accomplishment or fulfillment outside of work",
    "I practice self-care regularly to maintain my mental well-being",
    "I can recognize and manage my stress levels effectively"
  ],
  Relationships: [
    "I am truthful with my partner and close friends, even when it's difficult",
    "When there is a problem or disagreement, I bring it up and address it openly",
    "I listen attentively to others during conversations, focusing on understanding their perspective",
    "I express my thoughts and feelings clearly and directly so that others don't have to guess",
    "I maintain healthy boundaries in my relationships — I can say 'no' when I need to",
    "I feel comfortable sharing my true feelings, concerns, and needs with people I care about",
    "I empathize with what my friends or partner are going through",
    "I make a consistent effort to spend quality time with loved ones",
    "I enjoy working together with my partner or friends on shared goals and projects",
    "I trust my partner and close friends; I don't feel the need to check up on them constantly",
    "If I feel jealous or insecure, I openly discuss these feelings with the person",
    "I genuinely celebrate my partner's or friends' successes and good fortune",
    "I am committed to my relationships and willing to work through difficulties",
    "I strive to understand how my loved ones' past experiences affect them",
    "When I realize I have hurt someone I care about, I apologize sincerely",
    "If someone I love is upset with me, I try to understand their perspective",
    "I can forgive my partner or friends when they apologize for a mistake",
    "Even during arguments, I avoid yelling, name-calling, or saying things I might regret",
    "I maintain my own interests and individuality in a relationship",
    "I regularly express appreciation and gratitude towards my friends or partner",
    "When I'm spending time with loved ones, I put away distractions",
    "My close friends are positive, supportive people who truly want the best for me",
    "I feel confident reaching out to meet new people and form new connections",
    "I check in with my partner or close friends about how our relationship is doing",
    "I am comfortable being on my own when I need to be",
    "I adapt my communication style when necessary to communicate effectively",
    "When my needs conflict with someone else's, I'm willing to compromise",
    "I have at least one person in my life with whom I can truly be myself",
    "I pay attention to my tone of voice and body language during interactions",
    "I actively encourage and support the goals and dreams of my friends or partner"
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
    { after: 5, message: "🧠 Your mind is getting stronger!" },
    { after: 10, message: "✨ Keep going! You're doing amazing!" },
    { after: 15, message: "🌈 You're making great progress!" },
    { after: 20, message: "🌟 Almost there! Stay focused!" },
    { after: 25, message: "🎯 Final stretch! You've got this!" }
  ],
  Relationships: [
    { after: 5, message: "❤️ Building connections takes time!" },
    { after: 10, message: "🤝 You're making great progress!" },
    { after: 15, message: "🌈 Your relationships are growing!" },
    { after: 20, message: "🌟 Keep going! You're doing well!" },
    { after: 25, message: "🎯 Final stretch! Almost there!" }
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
        { id: "pe1", title: "5-minute Stretching", duration: 5, xpValue: 10, description: "Simple full-body stretch routine", difficulty: "easy" },
        { id: "pe2", title: "10-minute Walk", duration: 10, xpValue: 15, description: "Take a short walk around your area", difficulty: "easy" },
        { id: "pe3", title: "Basic Squats", duration: 5, xpValue: 12, description: "Do 5 basic squats", difficulty: "easy" },
        { id: "pe4", title: "Arm Circles", duration: 3, xpValue: 8, description: "30 seconds each direction", difficulty: "easy" },
        { id: "pe5", title: "March in Place", duration: 5, xpValue: 10, description: "Simple marching exercise", difficulty: "easy" }
      ],
      "4-6": [ // Beginner
        { id: "pe6", title: "15-minute Walk", duration: 15, xpValue: 20, description: "Brisk walking pace", difficulty: "medium" },
        { id: "pe7", title: "10 Pushups", duration: 10, xpValue: 22, description: "Can be done on knees", difficulty: "medium" },
        { id: "pe8", title: "Basic Yoga Flow", duration: 15, xpValue: 25, description: "Simple yoga sequence", difficulty: "medium" },
        { id: "pe9", title: "Jump Rope Practice", duration: 10, xpValue: 22, description: "Practice basic jumping", difficulty: "medium" },
        { id: "pe10", title: "Bodyweight Exercises", duration: 15, xpValue: 25, description: "Mix of basic exercises", difficulty: "medium" }
      ],
      "7-9": [ // Apprentice
        { id: "pe11", title: "20-minute HIIT", duration: 20, xpValue: 35, description: "Basic interval training", difficulty: "hard" },
        { id: "pe12", title: "Strength Circuit", duration: 25, xpValue: 40, description: "Full body workout", difficulty: "hard" },
        { id: "pe13", title: "3km Run", duration: 30, xpValue: 45, description: "Steady pace run", difficulty: "hard" },
        { id: "pe14", title: "Flexibility Flow", duration: 20, xpValue: 35, description: "Advanced stretching", difficulty: "hard" },
        { id: "pe15", title: "Plank Challenge", duration: 15, xpValue: 30, description: "Hold plank position", difficulty: "hard" }
      ]
    },
    Nutrition: {
      "1-3": [
        { id: "pn1", title: "Water Intake", duration: "all day", xpValue: 10, description: "Drink 4 glasses of water", difficulty: "easy" },
        { id: "pn2", title: "Fruit Break", duration: "one meal", xpValue: 8, description: "Add a fruit to your meal", difficulty: "easy" },
        { id: "pn3", title: "Veggie Starter", duration: "one meal", xpValue: 10, description: "Add one vegetable serving", difficulty: "easy" }
      ],
      "4-6": [
        { id: "pn4", title: "Balanced Breakfast", duration: "morning", xpValue: 20, description: "Include protein and fiber", difficulty: "medium" },
        { id: "pn5", title: "Meal Planning", duration: 30, xpValue: 22, description: "Plan tomorrow's meals", difficulty: "medium" },
        { id: "pn6", title: "Healthy Snack Swap", duration: "all day", xpValue: 18, description: "Replace processed snacks", difficulty: "medium" }
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
  medium: 2,
  hard: 3
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
    const totalTime = 20000; // 20 seconds total
    const messageInterval = totalTime / messages.length;
    
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
            <p class="text-xl mb-6">You're starting at Level ${calculateInitialLevel(responses)}</p>
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
      }, 500);
    }, totalTime);
  });
}

function calculateInitialLevel(responses) {
  let totalScore = 0;
  let maxPossibleScore = 0;

  // Calculate scores for each category
  const categories = {
    Nutrition: responses.filter(r => r.id.startsWith('n')),
    Activity: responses.filter(r => r.id.startsWith('a')),
    Recovery: responses.filter(r => r.id.startsWith('r')),
    Lifestyle: responses.filter(r => r.id.startsWith('l')),
    Knowledge: responses.filter(r => r.id.startsWith('k'))
  };

  Object.entries(categories).forEach(([category, categoryResponses]) => {
    let categoryScore = 0;
    let categoryMaxScore = 0;

    categoryResponses.forEach(response => {
      const question = questions.Physical.find(q => q.id === response.id);
      if (question) {
        categoryScore += response.value * question.weight;
        categoryMaxScore += 5 * question.weight; // 5 is the maximum Likert scale value
      }
    });

    totalScore += categoryScore;
    maxPossibleScore += categoryMaxScore;
  });

  // Calculate percentage score (1-100)
  const percentageScore = Math.round((totalScore / maxPossibleScore) * 100);

  // Determine level based on score
  if (percentageScore >= 86) return 7; // Master
  if (percentageScore >= 71) return 6; // Advanced
  if (percentageScore >= 51) return 5; // Intermediate
  if (percentageScore >= 31) return 4; // Beginner
  return 3; // Novice
}

// Update the finishSurvey function to use the new level calculation
async function finishSurvey(area, responses) {
  try {
    console.log('Finishing survey for area:', area);
    currentState.surveyInProgress = false;
    
    // Show enhanced loading screen first
    await showLoadingScreen();
    
    // Calculate results
    const total = responses.reduce((a, b) => a + b.value, 0);
    const maxPossibleScore = responses.length * 5;
    const percentage = (total / maxPossibleScore) * 100;
    
    // Calculate level using the new function
    const level = calculateInitialLevel(responses);

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
    
    // Hide loading screen and show dashboard
    const loadingScreen = document.querySelector('.fixed.inset-0');
    if (loadingScreen) {
      loadingScreen.remove();
    }
    
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

// Update the XP calculation constants
const XP_CONSTANTS = {
  BASE_XP: 100, // Base XP for level 1
  GROWTH_RATE: 1.25, // XP growth rate between levels
  LEVEL_MULTIPLIER: 0.05 // 5% increase per level
};

// Update the calculateQuestXP function
function calculateQuestXP(baseXP, level, difficulty) {
  const difficultyMultiplier = DIFFICULTY_MULTIPLIERS[difficulty] || 1;
  const levelMultiplier = 1 + (level * XP_CONSTANTS.LEVEL_MULTIPLIER);
  return Math.floor(baseXP * difficultyMultiplier * levelMultiplier);
}

// Update the calculateLevelXP function
function calculateLevelXP(level) {
  return Math.floor(XP_CONSTANTS.BASE_XP * Math.pow(XP_CONSTANTS.GROWTH_RATE, level - 1));
}

// Update the checkForLevelUp function
function checkForLevelUp(area, level, xp) {
  console.log('Checking for level up:', { area, level, xp });
  
  const currentLevelXP = calculateLevelXP(level);
  
  if (xp >= currentLevelXP) {
    const newLevel = level + 1;
    const newXp = xp - currentLevelXP;
    
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
    
    // Update XP bar and text
    const xpBar = document.getElementById("xpBar");
    const xpText = document.getElementById("xpText");
    if (xpBar && xpText) {
      const newXpCap = calculateLevelXP(newLevel);
      const percentage = Math.min(Math.floor((newXp / newXpCap) * 100), 100);
      xpBar.style.width = `${percentage}%`;
      xpText.textContent = `${newXp} / ${newXpCap} XP`;
    }
    
    return true;
  }
  return false;
}

// Update the initDashboard function to use the new quest card system
function initDashboard(data) {
  console.log('Initializing dashboard with data:', data);
  const { area, level, xp, quests } = data;
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

  // Calculate XP cap for current level
  const xpCap = calculateLevelXP(level);
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
      
      // Create quest card using the new system
      const questCard = createQuestCard(quest);
      questCard.style.animation = `fadeIn 0.3s ease-out ${index * 0.1}s forwards`;
      questList.appendChild(questCard);
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

// Update the generateQuests function to use the new quest structure
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

  // Select 3 random quests (we'll add the multi-step and time-gated quests)
  const selectedQuests = shuffleArray(availableQuests)
    .slice(0, Math.min(3, availableQuests.length))
    .map(quest => ({
      ...quest,
      completed: false,
      progress: 0,
      refreshable: true,
      // Calculate XP based on level and difficulty
      xpValue: calculateQuestXP(quest.xpValue || 20, level, quest.difficulty)
    }));
  
  // Add the multi-step quest
  selectedQuests.push({...MULTI_STEP_QUEST});
  
  // Add the time-gated quest
  selectedQuests.push({...TIME_GATED_QUEST});

  console.log('Generated quests:', selectedQuests);
  return selectedQuests;
}

// Update the getDefaultQuests function to use the new quest structure
function getDefaultQuests() {
  return [
    {
      id: "default1",
      title: "Start Your Journey",
      description: "Begin your first quest and take your first step towards growth",
      duration: 5,
      xpValue: 10,
      difficulty: "easy",
      completed: false,
      progress: 0,
      refreshable: true
    },
    {
      id: "default2",
      title: "Set Your Goals",
      description: "Write down three goals you want to achieve in this area",
      duration: 10,
      xpValue: 15,
      difficulty: "medium",
      completed: false,
      progress: 0,
      refreshable: true
    },
    {
      id: "default3",
      title: "Take a Small Step",
      description: "Complete one small task towards your goal",
      duration: 5,
      xpValue: 10,
      difficulty: "easy",
      completed: false,
      progress: 0,
      refreshable: true
    },
    {
      id: "default4",
      title: "Reflect on Progress",
      description: "Think about what you've accomplished today",
      duration: 5,
      xpValue: 10,
      difficulty: "easy",
      completed: false,
      progress: 0,
      refreshable: true
    },
    {
      id: "default5",
      title: "Plan Tomorrow",
      description: "Plan your activities for tomorrow",
      duration: 10,
      xpValue: 15,
      difficulty: "medium",
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
    
    // Calculate XP - use the quest's xpValue directly as it already includes difficulty
    const finalXP = quest.xpValue;
    
    // Update user data
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
      
      // Update XP display and bar
      const xpCap = calculateLevelXP(userData.level);
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
  responses = [];
  
  const areaSelection = document.getElementById('area-selection');
  const survey = document.getElementById('survey');
  
  if (areaSelection) areaSelection.classList.add('hidden');
  if (survey) {
    survey.classList.remove('hidden');
    survey.className = 'min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 p-6';
    
    // Update survey title
    const surveyTitle = document.getElementById('surveyTitle');
    if (surveyTitle) {
      surveyTitle.textContent = `${area} Assessment`;
    }
    
    // Initialize the first question
        renderQuestion();
  }
}

function renderQuestion() {
  const question = questions[area][current];
  const questionContainer = document.getElementById('questionContainer');
  
  if (!questionContainer) {
    console.error('Question container not found');
    return;
  }
  
  // Calculate progress percentage
  const progress = ((current + 1) / questions[area].length) * 100;
  
  // Create question card
  questionContainer.innerHTML = `
    <div class="bg-white rounded-xl p-8 shadow-xl">
      <div class="mb-6">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm text-gray-600">Progress</span>
          <span class="text-sm font-medium">${current + 1} of ${questions[area].length}</span>
        </div>
        <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div class="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300" style="width: ${progress}%"></div>
        </div>
      </div>
      <h2 class="text-xl font-semibold mb-6">Question ${current + 1} of ${questions[area].length}</h2>
      <p class="text-lg mb-6">${typeof question === 'string' ? question : question.question}</p>
      <div class="flex flex-col space-y-3">
        ${LIKERT_SCALE.map(scale => `
          <button class="option-btn bg-white border border-gray-200 rounded-lg p-4 w-full text-left hover:bg-gray-50 transition-colors" data-value="${scale.value}">
            ${scale.label}
          </button>
        `).join('')}
      </div>
    </div>
  `;

  // Add event listeners to option buttons
  document.querySelectorAll('.option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active state from all buttons
      document.querySelectorAll('.option-btn').forEach(b => {
        b.classList.remove('border-indigo-500', 'bg-indigo-50');
      });
      
      // Add active state to clicked button
      btn.classList.add('border-indigo-500', 'bg-indigo-50');
      
      const value = parseInt(btn.dataset.value);
      responses[current] = {
        id: typeof question === 'string' ? `q${current + 1}` : question.id,
        value: value,
        category: typeof question === 'string' ? 'General' : question.category
      };
      
      // Enable next button
      const nextBtn = document.getElementById('nextBtn');
      if (nextBtn) {
        nextBtn.disabled = false;
      }
    });
  });

  // Update navigation buttons
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  
  if (prevBtn) {
    prevBtn.disabled = current === 0;
    prevBtn.onclick = () => {
      if (current > 0) {
        current--;
        renderQuestion();
      }
    };
  }
  
  if (nextBtn) {
    nextBtn.disabled = !responses[current];
    nextBtn.onclick = async () => {
      if (current === selected.length - 1) {
        await finishSurvey(area, responses);
      } else {
        // Check for intermission
        const intermission = INTERMISSIONS[area]?.find(i => i.after === current + 1);
        if (intermission) {
          await showIntermission(intermission.message);
        }
        current++;
        renderQuestion();
      }
    };
  }
}

// Add Likert scale options
const LIKERT_SCALE = [
  { value: 1, label: "Strongly Disagree" },
  { value: 2, label: "Disagree" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Agree" },
  { value: 5, label: "Strongly Agree" }
];

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
      <div class="text-3xl mr-3">🏆</div>
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

// Quest System Types and Interfaces
const QUEST_TYPES = {
  SINGLE_STEP: 'single_step',
  MULTI_STEP: 'multi_step',
  TIMED: 'timed',
  REPEATABLE: 'repeatable',
  CHAIN: 'chain',
  TIME_GATED: 'time_gated'
};

const QUEST_STATES = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  FAILED: 'failed',
  EXPIRED: 'expired'
};

// Quest template structure
const QUEST_TEMPLATE = {
  id: '',
  title: '',
  description: '',
  type: QUEST_TYPES.SINGLE_STEP,
  difficulty: 'easy',
  duration: 0,
  xpValue: 0,
  requirements: [],
  rewards: [],
  steps: [],
  state: QUEST_STATES.NOT_STARTED,
  progress: 0,
  startTime: null,
  endTime: null,
  metadata: {}
};

// Step template structure
const STEP_TEMPLATE = {
  id: '',
  description: '',
  type: 'action',
  required: true,
  completed: false,
  progress: 0,
  validation: null,
  rewards: [],
  metadata: {}
};

// Quest validation functions
const QUEST_VALIDATORS = {
  isComplete: (quest) => {
    if (quest.type === QUEST_TYPES.SINGLE_STEP) {
      return quest.progress >= 100;
    }
    if (quest.type === QUEST_TYPES.MULTI_STEP) {
      return quest.steps.every(step => step.completed);
    }
    if (quest.type === QUEST_TYPES.TIMED) {
      return quest.progress >= 100 && Date.now() <= quest.endTime;
    }
    return false;
  },
  
  canStart: (quest) => {
    return quest.state === QUEST_STATES.NOT_STARTED;
  },
  
  isExpired: (quest) => {
    if (quest.type === QUEST_TYPES.TIMED) {
      return Date.now() > quest.endTime;
    }
    return false;
  }
};

// Quest reward system
const QUEST_REWARDS = {
  XP: 'xp',
  BADGE: 'badge',
  ITEM: 'item',
  UNLOCK: 'unlock'
};

// Quest requirement system
const QUEST_REQUIREMENTS = {
  LEVEL: 'level',
  QUEST: 'quest',
  ITEM: 'item',
  BADGE: 'badge'
};

// Quest metadata system
const QUEST_METADATA = {
  CATEGORY: 'category',
  TAGS: 'tags',
  DIFFICULTY: 'difficulty',
  DURATION: 'duration',
  REPEATABLE: 'repeatable',
  CHAIN_ID: 'chain_id',
  CHAIN_STEP: 'chain_step'
};

// Quest UI components
function createQuestCard(quest) {
  const card = document.createElement('div');
  card.className = 'quest-card bg-white rounded-lg shadow-md p-4 mb-4 cursor-pointer hover:shadow-lg transition-shadow';
  card.setAttribute('data-quest-id', quest.id);
  
  // Calculate progress for multi-step and time-gated quests
  let progressPercentage = 0;
  if (quest.type === QUEST_TYPES.MULTI_STEP || quest.type === QUEST_TYPES.TIME_GATED) {
    const completedSteps = quest.steps.filter(step => step.completed).length;
    progressPercentage = (completedSteps / quest.steps.length) * 100;
  } else {
    progressPercentage = quest.progress;
  }
  
  // Quest header
  const header = document.createElement('div');
  header.className = 'flex justify-between items-start mb-4';
  header.innerHTML = `
    <div>
      <h3 class="text-lg font-semibold">${quest.title}</h3>
      <p class="text-sm text-gray-600">${quest.description}</p>
    </div>
    <span class="px-2 py-1 text-xs rounded-full ${
      quest.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
      quest.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
      'bg-red-100 text-red-800'
    }">${quest.difficulty}</span>
  `;
  
  // Quest progress
  const progress = document.createElement('div');
  progress.className = 'mb-4';
  progress.innerHTML = `
    <div class="flex justify-between items-center mb-1">
      <span class="text-sm text-gray-600">Progress</span>
      <span class="text-sm font-medium">${Math.round(progressPercentage)}%</span>
    </div>
    <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <div class="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300" style="width: ${progressPercentage}%"></div>
    </div>
  `;
  
  // Quest steps (if multi-step or time-gated)
  let stepsHtml = '';
  if ((quest.type === QUEST_TYPES.MULTI_STEP || quest.type === QUEST_TYPES.TIME_GATED) && quest.steps) {
    stepsHtml = `
      <div class="mt-4 space-y-2">
        ${quest.steps.map(step => {
          const isTimeGated = quest.type === QUEST_TYPES.TIME_GATED;
          const isAvailable = !isTimeGated || new Date(step.date) <= new Date();
          const isCompleted = step.completed;
          return `
            <div class="flex items-center space-x-2" data-step-id="${step.id}">
              <span class="step-checkbox w-5 h-5 rounded-full flex items-center justify-center ${
                isCompleted ? 'bg-green-500 text-white' : 
                isAvailable ? 'bg-gray-200' : 'bg-gray-100'
              }">${isCompleted ? '✓' : ''}</span>
              <span class="text-sm ${isCompleted ? 'line-through text-gray-500' : !isAvailable ? 'text-gray-400' : ''}">
                ${step.description}
                ${isTimeGated ? `<span class="text-xs text-gray-400 ml-2">(${new Date(step.date).toLocaleDateString()})</span>` : ''}
              </span>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }
  
  // Quest actions
  const actions = document.createElement('div');
  actions.className = 'flex justify-between items-center mt-4';
  actions.innerHTML = `
    <div class="flex items-center space-x-4">
      <span class="text-sm">⏱️ ${quest.duration} min</span>
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
        ${quest.completed ? "Completed!" : 
          quest.type === QUEST_TYPES.MULTI_STEP ? "View Steps" :
          quest.type === QUEST_TYPES.TIME_GATED ? "View Days" :
          "Complete"}
      </button>
    </div>
  `;
  
  // Assemble card
  card.innerHTML = `
    ${header.outerHTML}
    ${progress.outerHTML}
    ${stepsHtml}
    ${actions.outerHTML}
  `;
  
  // Add click handler for the entire card
  card.addEventListener('click', (e) => {
    // Don't trigger if clicking buttons
    if (e.target.closest('button')) return;
    showQuestModal(quest);
  });
  
  // Add event listeners for buttons
  const refreshBtn = card.querySelector('.refresh-btn');
  refreshBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent card click
    refreshQuest(quest.id);
  });

  const completeBtn = card.querySelector('.complete-btn');
  if (!quest.completed) {
    completeBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent card click
      if (quest.type === QUEST_TYPES.MULTI_STEP || quest.type === QUEST_TYPES.TIME_GATED) {
        showQuestModal(quest);
      } else {
        completeQuest(quest.id);
      }
    });
  }
  
  return card;
}

// Quest management functions
function startQuest(questId) {
  const currentArea = localStorage.getItem('currentFocusArea');
  if (!currentArea) return;
  
  const userData = JSON.parse(localStorage.getItem(`levelUpUser_${currentArea}`)) || {};
  const quest = userData.quests.find(q => q.id === questId);
  
  if (!quest || !QUEST_VALIDATORS.canStart(quest)) return;
  
  quest.state = QUEST_STATES.IN_PROGRESS;
  quest.startTime = Date.now();
  if (quest.type === QUEST_TYPES.TIMED) {
    quest.endTime = quest.startTime + (quest.duration * 60 * 1000);
  }
  
  saveUserData(currentArea, userData);
  updateQuestUI(quest);
}

function updateQuestProgress(questId, progress) {
  const currentArea = localStorage.getItem('currentFocusArea');
  if (!currentArea) return;
  
  const userData = JSON.parse(localStorage.getItem(`levelUpUser_${currentArea}`)) || {};
  const quest = userData.quests.find(q => q.id === questId);
  
  if (!quest || quest.state !== QUEST_STATES.IN_PROGRESS) return;
  
  quest.progress = progress;
  
  if (QUEST_VALIDATORS.isComplete(quest)) {
    completeQuest(questId);
  } else {
    saveUserData(currentArea, userData);
    updateQuestUI(quest);
  }
}

// Update the completeQuest function to properly handle UI updates
function completeQuest(questId) {
  const currentArea = localStorage.getItem('currentFocusArea');
  if (!currentArea) return;
  
  const userData = JSON.parse(localStorage.getItem(`levelUpUser_${currentArea}`)) || {};
  const quest = userData.quests.find(q => q.id === questId);
  
  if (!quest || quest.completed) return;
  
  // Play completion sound
  gameSounds.questComplete?.play().catch(() => {});
  
  // Update quest state
  quest.completed = true;
  quest.progress = 100;
  
  // Award XP
  const currentXP = userData.xp || 0;
  const newXP = currentXP + quest.xpValue;
  userData.xp = newXP;
  userData.totalCompleted = (userData.totalCompleted || 0) + 1;
  
  // Save updated data
  saveUserData(currentArea, userData);
  
  // Check for level up
  const leveledUp = checkForLevelUp(currentArea, userData.level, newXP);
  
  // Update UI
  const questElement = document.querySelector(`[data-quest-id="${questId}"]`);
  if (questElement) {
    // Update complete button
    const completeBtn = questElement.querySelector('.complete-btn');
    if (completeBtn) {
      completeBtn.textContent = 'Completed!';
      completeBtn.classList.remove('bg-green-500', 'hover:bg-green-600');
      completeBtn.classList.add('bg-gray-300', 'cursor-not-allowed');
      completeBtn.disabled = true;
    }
    
    // Update progress bar
    const progressBar = questElement.querySelector('.h-full.bg-gradient-to-r');
    if (progressBar) {
      progressBar.style.width = '100%';
    }
    
    // Update progress text
    const progressText = questElement.querySelector('.text-sm.font-medium');
    if (progressText) {
      progressText.textContent = '100%';
    }
    
    // Add glow effect
    questElement.classList.add('quest-complete-glow');
    
    // Create floating XP element
    const xpPopup = document.createElement('div');
    xpPopup.className = 'xp-popup';
    xpPopup.innerHTML = `✨ +${quest.xpValue} XP`;
    questElement.appendChild(xpPopup);
    
    // Animate the XP popup
    setTimeout(() => {
      xpPopup.classList.add('show');
      setTimeout(() => {
        xpPopup.classList.remove('show');
        setTimeout(() => xpPopup.remove(), 500);
      }, 2000);
    }, 100);
  }
  
  // Show achievement
  showAchievement('🎉 Quest Completed!', `You earned ✨ ${quest.xpValue} XP!`);
  
  // Update dashboard XP if not leveled up
  if (!leveledUp) {
    const xpBar = document.getElementById("xpBar");
    const xpText = document.getElementById("xpText");
    if (xpBar && xpText) {
      const xpCap = calculateLevelXP(userData.level);
      const percentage = Math.min(Math.floor((newXP / xpCap) * 100), 100);
      xpBar.style.width = `${percentage}%`;
      xpText.textContent = `${newXP} / ${xpCap} XP`;
    }
  }
}

// Add CSS for the XP popup animation
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
    opacity: 0;
    transform: translateY(0);
    transition: all 0.3s ease-out;
  }
  
  .xp-popup.show {
    opacity: 1;
    transform: translateY(-30px);
  }
  
  .quest-complete-glow {
    animation: glow 1s ease-out;
  }
  
  @keyframes glow {
    0% {
      box-shadow: 0 0 5px rgba(79, 70, 229, 0.5);
    }
    50% {
      box-shadow: 0 0 20px rgba(79, 70, 229, 0.8);
    }
    100% {
      box-shadow: 0 0 5px rgba(79, 70, 229, 0.5);
    }
  }
`;
document.head.appendChild(style);

function awardReward(reward) {
  switch (reward.type) {
    case QUEST_REWARDS.XP:
      // XP is handled in completeQuest
      break;
    case QUEST_REWARDS.BADGE:
      unlockBadge(reward.id);
      break;
    case QUEST_REWARDS.ITEM:
      // Add item to inventory
      break;
    case QUEST_REWARDS.UNLOCK:
      // Unlock new content
      break;
  }
}

function updateQuestUI(quest) {
  const questElement = document.querySelector(`[data-quest-id="${quest.id}"]`);
  if (!questElement) return;
  
  // Update progress bar
  const progressBar = questElement.querySelector('.progress-bar');
  if (progressBar) {
    progressBar.style.width = `${quest.progress}%`;
  }
  
  // Update step checkmarks
  if (quest.type === QUEST_TYPES.MULTI_STEP) {
    quest.steps.forEach((step, index) => {
      const stepElement = questElement.querySelector(`[data-step-id="${step.id}"]`);
      if (stepElement) {
        stepElement.classList.toggle('completed', step.completed);
      }
    });
  }
  
  // Update complete button
  const completeBtn = questElement.querySelector('.complete-btn');
  if (completeBtn) {
    completeBtn.disabled = quest.state === QUEST_STATES.COMPLETED;
    completeBtn.textContent = quest.state === QUEST_STATES.COMPLETED ? 'Completed!' : 'Complete';
    completeBtn.classList.toggle('bg-gray-300', quest.state === QUEST_STATES.COMPLETED);
    completeBtn.classList.toggle('bg-green-500', quest.state !== QUEST_STATES.COMPLETED);
  }
}

// Add this function to create and show the quest modal
function showQuestModal(quest) {
  // Create modal container
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
  
  // Calculate progress for multi-step and time-gated quests
  let progressPercentage = 0;
  if (quest.type === QUEST_TYPES.MULTI_STEP || quest.type === QUEST_TYPES.TIME_GATED) {
    const completedSteps = quest.steps.filter(step => step.completed).length;
    progressPercentage = (completedSteps / quest.steps.length) * 100;
  } else {
    progressPercentage = quest.progress;
  }
  
  // Check if all available steps are completed for time-gated quests
  const allAvailableStepsCompleted = quest.type === QUEST_TYPES.TIME_GATED ? 
    quest.steps.every(step => {
      const stepDate = new Date(step.date);
      const currentDate = new Date();
      return stepDate > currentDate || step.completed;
    }) : false;
  
  // Check if all steps are completed for multi-step quests
  const allStepsCompleted = quest.type === QUEST_TYPES.MULTI_STEP ?
    quest.steps.every(step => step.completed) : false;
  
  modal.innerHTML = `
    <div class="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 transform transition-all duration-300 scale-95 opacity-0">
      <div class="flex justify-between items-start mb-4">
        <div>
          <h2 class="text-2xl font-bold mb-2">${quest.title}</h2>
          <span class="px-2 py-1 text-xs rounded-full ${
            quest.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
            quest.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }">${quest.difficulty}</span>
        </div>
        <button class="close-modal text-gray-500 hover:text-gray-700">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div class="space-y-4">
        <div class="bg-gray-50 rounded-lg p-4">
          <p class="text-gray-700">${quest.description}</p>
        </div>
        
        <div class="flex items-center justify-between text-sm text-gray-600">
          <div class="flex items-center space-x-4">
            <span>⏱️ ${quest.duration} min</span>
            <span>✨ ${quest.xpValue} XP</span>
          </div>
          <span>${quest.completed ? '✅ Completed' : '🔄 In Progress'}</span>
        </div>
        
        <div class="border-t pt-4">
          <h3 class="font-semibold mb-2">Progress</h3>
          <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300" style="width: ${progressPercentage}%"></div>
          </div>
        </div>
        
        ${(quest.type === QUEST_TYPES.MULTI_STEP || quest.type === QUEST_TYPES.TIME_GATED) ? `
          <div class="border-t pt-4">
            <h3 class="font-semibold mb-2">Steps</h3>
            <div class="space-y-2">
              ${quest.steps.map(step => {
                const isTimeGated = quest.type === QUEST_TYPES.TIME_GATED;
                const isAvailable = !isTimeGated || new Date(step.date) <= new Date();
                const isCompleted = step.completed;
                return `
                  <div class="flex items-center space-x-2" data-step-id="${step.id}">
                    <button class="step-btn w-5 h-5 rounded-full flex items-center justify-center ${
                      isCompleted ? 'bg-green-500 text-white' : 
                      isAvailable ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-100'
                    }" ${isCompleted || !isAvailable ? 'disabled' : ''}>
                      ${isCompleted ? '✓' : ''}
                    </button>
                    <span class="text-sm ${isCompleted ? 'line-through text-gray-500' : !isAvailable ? 'text-gray-400' : ''}">
                      ${step.description}
                      ${isTimeGated ? `<span class="text-xs text-gray-400 ml-2">(${new Date(step.date).toLocaleDateString()})</span>` : ''}
                    </span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        ` : ''}
        
        <div class="flex justify-end space-x-3">
          <button class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            View Tips
          </button>
        </div>
      </div>
    </div>
  `;

  // Add to document
  document.body.appendChild(modal);

  // Animate in
  requestAnimationFrame(() => {
    modal.querySelector('div').classList.remove('scale-95', 'opacity-0');
  });

  // Add event listeners
  const closeBtn = modal.querySelector('.close-modal');
  closeBtn.addEventListener('click', () => {
    modal.querySelector('div').classList.add('scale-95', 'opacity-0');
    setTimeout(() => modal.remove(), 300);
  });

  // Close on outside click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.querySelector('div').classList.add('scale-95', 'opacity-0');
      setTimeout(() => modal.remove(), 300);
    }
  });

  // Add step button handlers for multi-step and time-gated quests
  if (quest.type === QUEST_TYPES.MULTI_STEP || quest.type === QUEST_TYPES.TIME_GATED) {
    const stepButtons = modal.querySelectorAll('.step-btn');
    stepButtons.forEach(button => {
      button.addEventListener('click', () => {
        const stepId = button.closest('[data-step-id]').dataset.stepId;
        const step = quest.steps.find(s => s.id === stepId);
        if (step && !step.completed) {
          // For time-gated quests, check if the step is available
          if (quest.type === QUEST_TYPES.TIME_GATED) {
            const stepDate = new Date(step.date);
            const currentDate = new Date();
            if (stepDate > currentDate) {
              return; // Step is not available yet
            }
          }
          
          step.completed = true;
          step.progress = 100;
          
          // Update UI
          button.classList.add('bg-green-500', 'text-white');
          button.textContent = '✓';
          button.disabled = true;
          const stepText = button.nextElementSibling;
          stepText.classList.add('line-through', 'text-gray-500');
          
          // Update progress
          const completedSteps = quest.steps.filter(s => s.completed).length;
          const newProgress = (completedSteps / quest.steps.length) * 100;
          const progressBar = modal.querySelector('.h-full.bg-gradient-to-r');
          if (progressBar) {
            progressBar.style.width = `${newProgress}%`;
          }
          
          // Save progress and update dashboard
          const currentArea = localStorage.getItem('currentFocusArea');
          if (currentArea) {
            const userData = JSON.parse(localStorage.getItem(`levelUpUser_${currentArea}`)) || {};
            const questIndex = userData.quests.findIndex(q => q.id === quest.id);
            if (questIndex !== -1) {
              userData.quests[questIndex] = quest;
              saveUserData(currentArea, userData);
              
              // Update the quest card in the dashboard
              const questCard = document.querySelector(`[data-quest-id="${quest.id}"]`);
              if (questCard) {
                const cardProgressBar = questCard.querySelector('.h-full.bg-gradient-to-r');
                const cardProgressText = questCard.querySelector('.text-sm.font-medium');
                if (cardProgressBar && cardProgressText) {
                  cardProgressBar.style.width = `${newProgress}%`;
                  cardProgressText.textContent = `${Math.round(newProgress)}%`;
                }
              }
            }
          }
          
          // Check if all steps are completed
          const allCompleted = quest.steps.every(s => s.completed);
          if (allCompleted) {
            // Automatically complete the quest
            completeQuest(quest.id);
            modal.querySelector('div').classList.add('scale-95', 'opacity-0');
            setTimeout(() => modal.remove(), 300);
          }
        }
      });
    });
  }
}

// Add a multi-step quest to the QUEST_POOL
const MULTI_STEP_QUEST = {
  id: "ms1",
  title: "Mindful Morning Routine",
  description: "Complete a series of mindful activities to start your day right",
  type: QUEST_TYPES.MULTI_STEP,
  difficulty: "medium",
  duration: 15,
  xpValue: 30,
  steps: [
    {
      id: "ms1_step1",
      description: "Take 5 deep breaths",
      completed: false,
      progress: 0
    },
    {
      id: "ms1_step2",
      description: "Drink a glass of water",
      completed: false,
      progress: 0
    },
    {
      id: "ms1_step3",
      description: "Stretch for 2 minutes",
      completed: false,
      progress: 0
    }
  ],
  completed: false,
  progress: 0,
  refreshable: true
};

// Add a time-gated quest
const TIME_GATED_QUEST = {
  id: "tg1",
  title: "7-Day Mindfulness Challenge",
  description: "Build a daily mindfulness practice over the course of a week",
  type: QUEST_TYPES.TIME_GATED,
  difficulty: "medium",
  duration: 5,
  xpValue: 50,
  steps: [
    {
      id: "tg1_day1",
      description: "Day 1: Take 5 deep breaths",
      completed: false,
      progress: 0,
      date: new Date().toDateString()
    },
    {
      id: "tg1_day2",
      description: "Day 2: Practice 2 minutes of mindful breathing",
      completed: false,
      progress: 0,
      date: new Date(Date.now() + 86400000).toDateString()
    },
    {
      id: "tg1_day3",
      description: "Day 3: Do a body scan meditation",
      completed: false,
      progress: 0,
      date: new Date(Date.now() + 172800000).toDateString()
    },
    {
      id: "tg1_day4",
      description: "Day 4: Practice mindful walking",
      completed: false,
      progress: 0,
      date: new Date(Date.now() + 259200000).toDateString()
    },
    {
      id: "tg1_day5",
      description: "Day 5: Try a guided meditation",
      completed: false,
      progress: 0,
      date: new Date(Date.now() + 345600000).toDateString()
    },
    {
      id: "tg1_day6",
      description: "Day 6: Practice gratitude meditation",
      completed: false,
      progress: 0,
      date: new Date(Date.now() + 432000000).toDateString()
    },
    {
      id: "tg1_day7",
      description: "Day 7: Reflect on your mindfulness journey",
      completed: false,
      progress: 0,
      date: new Date(Date.now() + 518400000).toDateString()
    }
  ],
  completed: false,
  progress: 0,
  refreshable: false,
  startDate: new Date().toDateString()
};