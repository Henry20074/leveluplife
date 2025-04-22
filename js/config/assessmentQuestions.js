// Physical Health Assessment Questions and Scoring System
export const PHYSICAL_HEALTH_QUESTIONS = {
  Nutrition: [
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
    }
  ],
  Activity: [
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
    }
  ],
  Recovery: [
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
    }
  ],
  Lifestyle: [
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
    }
  ],
  Knowledge: [
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
  ]
};

// Likert scale options for responses
export const LIKERT_SCALE = [
  { value: 1, label: "Strongly Disagree" },
  { value: 2, label: "Disagree" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Agree" },
  { value: 5, label: "Strongly Agree" }
];

// Scoring system
export const calculateHealthScore = (responses) => {
  let totalScore = 0;
  let maxPossibleScore = 0;

  // Calculate scores for each category
  Object.keys(PHYSICAL_HEALTH_QUESTIONS).forEach(category => {
    const categoryQuestions = PHYSICAL_HEALTH_QUESTIONS[category];
    let categoryScore = 0;
    let categoryMaxScore = 0;

    categoryQuestions.forEach(question => {
      const response = responses[question.id];
      if (response) {
        categoryScore += response * question.weight;
        categoryMaxScore += 5 * question.weight; // 5 is the maximum Likert scale value
      }
    });

    totalScore += categoryScore;
    maxPossibleScore += categoryMaxScore;
  });

  // Calculate percentage score (1-100)
  const percentageScore = Math.round((totalScore / maxPossibleScore) * 100);
  return percentageScore;
};

// Level ranges based on health score
export const HEALTH_LEVEL_RANGES = {
  NOVICE: { min: 1, max: 30, title: "Novice" },
  BEGINNER: { min: 31, max: 50, title: "Beginner" },
  INTERMEDIATE: { min: 51, max: 70, title: "Intermediate" },
  ADVANCED: { min: 71, max: 85, title: "Advanced" },
  MASTER: { min: 86, max: 100, title: "Master" }
};

// Get level based on health score
export const getHealthLevel = (score) => {
  return Object.entries(HEALTH_LEVEL_RANGES).find(([_, range]) => 
    score >= range.min && score <= range.max
  )?.[0] || "NOVICE";
}; 