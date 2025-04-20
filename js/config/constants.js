// Focus Areas
export const FOCUS_AREAS = ['Physical', 'Mental', 'Relationships'];

// Badge definitions
export const BADGES = [
  { id: "starter", name: "Getting Started", desc: "Complete your first quest" },
  { id: "level5", name: "Level 5 Achiever", desc: "Reach Level 5" },
];

// Quest difficulty levels
export const DIFFICULTY_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
  EXPERT: 'expert'
};

// Level ranges and their characteristics
export const LEVEL_RANGES = {
  NOVICE: { min: 1, max: 3, title: "Novice" },
  BEGINNER: { min: 4, max: 6, title: "Beginner" },
  APPRENTICE: { min: 7, max: 9, title: "Apprentice" },
  ADEPT: { min: 10, max: 12, title: "Adept" },
  SKILLED: { min: 13, max: 15, title: "Skilled" },
  EXPERT: { min: 16, max: 20, title: "Expert" },
  MASTER: { min: 21, max: 25, title: "Master" },
  GRANDMASTER: { min: 26, max: 30, title: "Grandmaster" }
};

// Survey questions for each area
export const QUESTIONS = {
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

// Survey intermissions
export const INTERMISSIONS = {
  Physical: [
    { after: 3, message: "💪 Keep going! Physical wellness is a journey." },
    { after: 7, message: "🌟 Halfway there! You're doing great!" },
    { after: 11, message: "🎯 Almost done! Every step counts!" }
  ],
  Mental: [
    { after: 3, message: "🧠 Your mind is getting stronger!" },
    { after: 7, message: "✨ Keep going! You're doing amazing!" },
    { after: 11, message: "🎓 Almost there! Stay focused!" }
  ],
  Relationships: [
    { after: 3, message: "❤️ Building connections takes time!" },
    { after: 7, message: "🤝 You're making great progress!" },
    { after: 11, message: "🌈 Final stretch! Keep going!" }
  ]
}; 