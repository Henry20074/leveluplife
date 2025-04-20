class UIService {
  static showAchievement(title, description) {
    const achievementPopup = document.createElement('div');
    achievementPopup.className = 'achievement-popup';
    achievementPopup.innerHTML = `
      <div class="achievement-content">
        <div class="achievement-icon">🎉</div>
        <div class="achievement-text">
          <h3>${title}</h3>
          <p>${description}</p>
        </div>
      </div>
    `;

    document.body.appendChild(achievementPopup);

    // Play achievement sound
    const audio = new Audio('sounds/achievement.mp3');
    audio.play().catch(e => console.log('Audio play failed:', e));

    // Animate the popup
    setTimeout(() => {
      achievementPopup.classList.add('show');
    }, 100);

    // Remove after animation
    setTimeout(() => {
      achievementPopup.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(achievementPopup);
      }, 500);
    }, 3000);
  }

  static showConfirmDialog(title, message, confirmText, cancelText) {
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

  static showLoadingScreen() {
    return new Promise(resolve => {
      const container = document.getElementById('survey');
      container.innerHTML = `
        <div class="fixed inset-0 bg-indigo-900 bg-opacity-95 flex items-center justify-center z-50">
          <div class="text-center text-white p-8 max-w-lg">
            <div class="animate-spin mb-8 mx-auto h-16 w-16 border-4 border-white border-t-transparent rounded-full"></div>
            <h2 class="text-2xl font-bold mb-4">Analyzing Your Responses</h2>
            <div class="loading-messages space-y-3">
              <p class="text-indigo-200 loading-message">Calculating your level...</p>
            </div>
          </div>
        </div>
      `;

      const messages = [
        "Analyzing response patterns...",
        "Generating personalized recommendations...",
        "Preparing your dashboard...",
        "Creating custom quests...",
        "Almost ready..."
      ];

      let messageIndex = 0;
      const messageElement = container.querySelector('.loading-message');
      
      // Cycle through messages
      const messageInterval = setInterval(() => {
        messageIndex = (messageIndex + 1) % messages.length;
        messageElement.style.opacity = '0';
        
        setTimeout(() => {
          messageElement.textContent = messages[messageIndex];
          messageElement.style.opacity = '1';
        }, 200);
      }, 1000);

      // Resolve after a shorter loading time
      setTimeout(() => {
        clearInterval(messageInterval);
        resolve();
      }, 4000);
    });
  }

  static showIntermission(message) {
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

  static styleSurveyQuestions() {
    const questionContainer = document.getElementById('questionContainer');
    if (!questionContainer) return;

    // Style the question container
    questionContainer.style.backgroundColor = 'white';
    questionContainer.style.color = '#1f2937'; // Dark gray text
    questionContainer.style.borderRadius = '1rem';
    questionContainer.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';

    // Style the question text
    const questionText = questionContainer.querySelector('.question-text');
    if (questionText) {
      questionText.classList.add('text-xl', 'font-semibold', 'mb-6');
    }

    // Style the radio options
    const radioLabels = questionContainer.querySelectorAll('label');
    radioLabels.forEach(label => {
      label.classList.add(
        'block',
        'p-4',
        'mb-3',
        'border',
        'border-gray-200',
        'rounded-lg',
        'cursor-pointer',
        'hover:border-indigo-500',
        'transition-colors'
      );

      // Style the radio input
      const radio = label.querySelector('input[type="radio"]');
      if (radio) {
        radio.classList.add('mr-3');
        
        // Add checked state styles
        radio.addEventListener('change', () => {
          radioLabels.forEach(l => {
            l.classList.remove('border-indigo-500', 'bg-indigo-50');
          });
          if (radio.checked) {
            label.classList.add('border-indigo-500', 'bg-indigo-50');
          }
        });
      }
    });
  }

  static renderQuestion(question, answers) {
    const container = document.getElementById('questionContainer');
    if (!container) return;

    container.innerHTML = `
      <div class="question-text mb-6">${question}</div>
      <div class="answers-container">
        ${answers.map((answer, index) => `
          <label class="block p-4 mb-3 border border-gray-200 rounded-lg cursor-pointer hover:border-indigo-500 transition-colors">
            <input type="radio" name="answer" value="${index}" class="mr-3">
            ${answer}
          </label>
        `).join('')}
      </div>
    `;

    this.styleSurveyQuestions();
  }

  static async celebrateLevelUp(level, area) {
    const levelUpPopup = document.createElement('div');
    levelUpPopup.className = 'level-up-popup';
    levelUpPopup.innerHTML = `
      <div class="level-up-content">
        <div class="level-up-icon">✨</div>
        <div class="level-up-text">
          <h2>Level Up!</h2>
          <p>You've reached level ${level} in ${area}!</p>
        </div>
      </div>
    `;

    document.body.appendChild(levelUpPopup);

    // Play level up sound
    const audio = new Audio('sounds/level-up.mp3');
    audio.play().catch(e => console.log('Audio play failed:', e));

    // Add confetti
    this.createConfetti();

    // Animate the popup
    setTimeout(() => {
      levelUpPopup.classList.add('show');
    }, 100);

    // Wait for user to click
    await new Promise(resolve => {
      levelUpPopup.addEventListener('click', () => {
        levelUpPopup.classList.remove('show');
        setTimeout(() => {
          document.body.removeChild(levelUpPopup);
          resolve();
        }, 500);
      });
    });
  }

  static createConfetti() {
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'confetti-container';
    document.body.appendChild(confettiContainer);

    for (let i = 0; i < 100; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.animationDelay = Math.random() * 5 + 's';
      confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
      confettiContainer.appendChild(confetti);
    }

    setTimeout(() => {
      document.body.removeChild(confettiContainer);
    }, 5000);
  }

  static animateElements(elements, delay = 100) {
    elements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('show');
      }, index * delay);
    });
  }

  static showOnboardingScreen() {
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

    return new Promise((resolve) => {
      // Add click handler
      container.querySelector('button').addEventListener('click', () => {
        container.classList.add('fade-out');
        setTimeout(() => {
          container.remove();
          resolve();
        }, 500);
      });
    });
  }
} 