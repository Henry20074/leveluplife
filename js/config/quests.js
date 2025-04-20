// Quest pool for each area and level range
export const QUEST_POOL = {
  Physical: {
    Exercise: {
      "1-3": [ // Novice
        { id: "pe1", title: "5-minute Stretching", duration: 5, xpValue: 20, description: "Simple full-body stretch routine" },
        { id: "pe2", title: "10-minute Walk", duration: 10, xpValue: 25, description: "Take a short walk around your area" },
        { id: "pe3", title: "Basic Squats", duration: 5, xpValue: 20, description: "Do 5 basic squats" },
        { id: "pe4", title: "Arm Circles", duration: 3, xpValue: 15, description: "30 seconds each direction" },
        { id: "pe5", title: "March in Place", duration: 5, xpValue: 20, description: "Simple marching exercise" }
      ],
      "4-6": [ // Beginner
        { id: "pe6", title: "15-minute Walk", duration: 15, xpValue: 35, description: "Brisk walking pace" },
        { id: "pe7", title: "10 Pushups", duration: 10, xpValue: 30, description: "Can be done on knees" },
        { id: "pe8", title: "Basic Yoga Flow", duration: 15, xpValue: 35, description: "Simple yoga sequence" },
        { id: "pe9", title: "Jump Rope Practice", duration: 10, xpValue: 30, description: "Practice basic jumping" },
        { id: "pe10", title: "Bodyweight Exercises", duration: 15, xpValue: 35, description: "Mix of basic exercises" }
      ],
      "7-9": [ // Apprentice
        { id: "pe11", title: "20-minute HIIT", duration: 20, xpValue: 45, description: "Basic interval training" },
        { id: "pe12", title: "Strength Circuit", duration: 25, xpValue: 50, description: "Full body workout" },
        { id: "pe13", title: "3km Run", duration: 30, xpValue: 55, description: "Steady pace run" },
        { id: "pe14", title: "Flexibility Flow", duration: 20, xpValue: 45, description: "Advanced stretching" },
        { id: "pe15", title: "Plank Challenge", duration: 15, xpValue: 40, description: "Hold plank position" }
      ]
    },
    Nutrition: {
      "1-3": [
        { id: "pn1", title: "Water Intake", duration: "all day", xpValue: 20, description: "Drink 4 glasses of water" },
        { id: "pn2", title: "Fruit Break", duration: "one meal", xpValue: 15, description: "Add a fruit to your meal" },
        { id: "pn3", title: "Veggie Starter", duration: "one meal", xpValue: 20, description: "Add one vegetable serving" }
      ],
      "4-6": [
        { id: "pn4", title: "Balanced Breakfast", duration: "morning", xpValue: 30, description: "Include protein and fiber" },
        { id: "pn5", title: "Meal Planning", duration: 30, xpValue: 35, description: "Plan tomorrow's meals" },
        { id: "pn6", title: "Healthy Snack Swap", duration: "all day", xpValue: 25, description: "Replace processed snacks" }
      ]
    }
  },
  Mental: {
    Mindfulness: {
      "1-3": [
        { id: "mm1", title: "Deep Breathing", duration: 5, xpValue: 20, description: "Basic breathing exercise" },
        { id: "mm2", title: "Mindful Minute", duration: 1, xpValue: 15, description: "One minute of presence" },
        { id: "mm3", title: "Gratitude Note", duration: 5, xpValue: 20, description: "Write one thing you're grateful for" }
      ],
      "4-6": [
        { id: "mm4", title: "Body Scan", duration: 10, xpValue: 30, description: "Progressive relaxation" },
        { id: "mm5", title: "Mindful Walking", duration: 15, xpValue: 35, description: "Walking meditation" },
        { id: "mm6", title: "Thought Journal", duration: 10, xpValue: 30, description: "Record and observe thoughts" }
      ]
    },
    Learning: {
      "1-3": [
        { id: "ml1", title: "Read Article", duration: 15, xpValue: 20, description: "Read an educational article" },
        { id: "ml2", title: "Watch Tutorial", duration: 10, xpValue: 15, description: "Watch a skill tutorial" },
        { id: "ml3", title: "Practice Skill", duration: 20, xpValue: 25, description: "Practice a new skill" }
      ],
      "4-6": [
        { id: "ml4", title: "Online Course", duration: 30, xpValue: 35, description: "Complete a course module" },
        { id: "ml5", title: "Skill Challenge", duration: 25, xpValue: 30, description: "Challenge yourself with a new skill" },
        { id: "ml6", title: "Teach Others", duration: 20, xpValue: 30, description: "Share knowledge with others" }
      ]
    }
  },
  Relationships: {
    Communication: {
      "1-3": [
        { id: "rc1", title: "Check-in Call", duration: 15, xpValue: 20, description: "Call a friend or family member" },
        { id: "rc2", title: "Active Listening", duration: 10, xpValue: 15, description: "Practice active listening" },
        { id: "rc3", title: "Express Gratitude", duration: 5, xpValue: 20, description: "Express gratitude to someone" }
      ],
      "4-6": [
        { id: "rc4", title: "Deep Conversation", duration: 30, xpValue: 35, description: "Have a meaningful conversation" },
        { id: "rc5", title: "Conflict Resolution", duration: 20, xpValue: 30, description: "Practice resolving a conflict" },
        { id: "rc6", title: "Support Network", duration: 25, xpValue: 35, description: "Reach out to your support network" }
      ]
    },
    Social: {
      "1-3": [
        { id: "rs1", title: "Social Media Break", duration: "all day", xpValue: 20, description: "Take a break from social media" },
        { id: "rs2", title: "Group Activity", duration: 30, xpValue: 25, description: "Participate in a group activity" },
        { id: "rs3", title: "New Connection", duration: 15, xpValue: 20, description: "Make a new connection" }
      ],
      "4-6": [
        { id: "rs4", title: "Community Service", duration: 60, xpValue: 40, description: "Volunteer in your community" },
        { id: "rs5", title: "Social Event", duration: 45, xpValue: 35, description: "Attend a social event" },
        { id: "rs6", title: "Relationship Building", duration: 30, xpValue: 30, description: "Work on building a relationship" }
      ]
    }
  }
}; 