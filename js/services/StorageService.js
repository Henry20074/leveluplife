import { FOCUS_AREAS } from '../config/constants.js';

export class StorageService {
  static saveUserData(area, data) {
    localStorage.setItem(`levelUpUser_${area}`, JSON.stringify(data));
  }

  static getAllUserData() {
    const allData = {};
    FOCUS_AREAS.forEach(area => {
      const key = `levelUpUser_${area}`;
      const data = localStorage.getItem(key);
      if (data) {
        allData[area] = JSON.parse(data);
      }
    });
    return allData;
  }

  static getCurrentArea() {
    return localStorage.getItem('currentFocusArea');
  }

  static setCurrentArea(area) {
    localStorage.setItem('currentFocusArea', area);
  }

  static saveProfile(profile) {
    localStorage.setItem('profileData', JSON.stringify(profile));
  }

  static getProfile() {
    const defaultProfile = {
      name: "Adventurer",
      avatar: "🧙",
      title: "The Motivated One"
    };
    const saved = localStorage.getItem('profileData');
    return saved ? JSON.parse(saved) : defaultProfile;
  }

  static updateStreak() {
    const today = new Date().toDateString();
    let lastDate = localStorage.getItem("lastQuestDate");
    let streak = parseInt(localStorage.getItem("streak") || "0");

    if (lastDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      streak = lastDate === yesterday ? streak + 1 : 1;
      localStorage.setItem("streak", streak);
      localStorage.setItem("lastQuestDate", today);
    }

    return streak;
  }

  static getStreak() {
    return parseInt(localStorage.getItem("streak") || "0");
  }

  static clearAllData() {
    localStorage.clear();
  }

  static hasSeenOnboarding() {
    return localStorage.getItem("hasSeenOnboarding") === "true";
  }

  static setOnboardingSeen() {
    localStorage.setItem("hasSeenOnboarding", "true");
  }
}
