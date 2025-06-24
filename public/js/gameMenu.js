import HouseCore from './houseCore.js';
import HouseUI from './houseUI.js'; // Combined import
import { houseData, professorIntro, houseDialogue, finalCompletionDialogue, houseCompletionDialogues } from '../shared/js/variables.js';
import { showDialogue } from './dialogue.js';



const Houses = [];


function getContextualGreeting(completedCount) {
  const greetings = {
    1: ["Gut gemacht", "Erster Schritt geschafft"],
    2: ["Schon zwei Häuser", "Weiter so"],
    3: ["Drittes Haus gemeistert", "Immer besser"],
    default: [
      "Exzellente Arbeit",
      "Großartige Fortschritte",
      "Beeindruckende Leistung"
    ]
  };
  
  const available = greetings[completedCount] || greetings.default;
  return available[Math.floor(Math.random() * available.length)];
}

function getContextualEncouragement(completedCount) {
  const encouragements = {
    beginner: [
      "Das nächste Haus wartet!",
      "Bereit für mehr?"
    ],
    intermediate: [
      "Deine Fähigkeiten wachsen!",
      "Jedes Haus macht dich stärker"
    ],
    advanced: [
      "Nur noch wenige Häuser!",
      "Du näherst dich dem Finale"
    ]
  };
  
  let category = 'beginner';
  if (completedCount > 3) category = 'intermediate';
  if (completedCount > houseData.length/2) category = 'advanced';
  
  return encouragements[category][Math.floor(Math.random() * encouragements[category].length)];
}

function getNextHouseToComplete(userProgress, completedHouses) {
  return houseData.find(h => 
    !completedHouses.includes(h.number) && 
    userProgress.unlockedHouses.includes(h.number)
  );
}

function getHomeDialogue(userProgress) {
  // Check if it's a new player (no progress)
  if (!userProgress || userProgress.completedHouses.length === 0) {
    return professorIntro.newPlayer;
  }
  // Check if a house was recently completed
  const lastCompletedHouse = userProgress.completedHouses[userProgress.completedHouses.length - 1];
  if (lastCompletedHouse && houseCompletionDialogues[lastCompletedHouse]) {
    return houseCompletionDialogues[lastCompletedHouse];
  }
  // Default: Returning player
  return professorIntro.returningPlayer;
}

function getLastCompletedHouse(completedHouses) {
  if (!completedHouses || completedHouses.length === 0) return null;
  // Filter out any non-numbers and return the highest number
  return Math.max(...completedHouses.filter(Number.isInteger));
}

function shouldShowEncouragement(userProgress) {
  const now = Date.now();
  const lastEncouragement = userProgress.lastEncouragementTime || 0;
  const hoursSinceLastEncouragement = (now - lastEncouragement) / (1000 * 60 * 60);
  return Math.random() < 0.3 && hoursSinceLastEncouragement >= 1;
}

function updateEncouragementTimestamp(userProgress) {
  userProgress.lastEncouragementTime = Date.now();
  if (!window.userAccount || !window.userAccount.id) {
    localStorage.setItem('guestProgress', JSON.stringify(userProgress));
  }
}

function playDialogueSequence(sequence, index = 0) {
  if (index >= sequence.length) return;
  
  const { messages, options } = sequence[index];
  showDialogue(messages, {
    ...options,
    onComplete: () => playDialogueSequence(sequence, index + 1)
  });
}

// Main initialization function
function initHouses(userProgress = {
  unlockedHouses: [1, 2],
  completedHouses: []
}) {
  // Start menu music
  // Add this to your dialogue box click handler or any initial user interaction
  const isGuest = !window.userAccount || !window.userAccount.id;
  let guestProgress = userProgress;
  
  if (isGuest) {
    const savedProgress = localStorage.getItem('guestProgress');
    guestProgress = savedProgress ? JSON.parse(savedProgress) : {
      unlockedHouses: [1, 2],
      completedHouses: [],
      houseProgress: {}
    };
    localStorage.setItem('guestProgress', JSON.stringify(guestProgress));
  }

  // Initialize houses
  Houses.length = 0;
  const houseFigures = document.querySelectorAll(".house");
  if (houseFigures.length === 0) {
    console.error("No house elements found in DOM!");
    createFallbackHouses();
    return;
  }

  houseData.forEach((house, index) => {
    try {
      if (!houseFigures[index]) return;

      const core = new HouseCore(
        house.number,
        house.name,
        house.topic,
        house.levelLimit,
        house.lives,
        house.numberStart || 1,
        house.numberLimit || 15,
        house.description,
        house.image,
        userProgress.unlockedHouses
      );
      core.isCompleted = guestProgress.completedHouses.includes(house.number) || 
                        userProgress.completedHouses.includes(house.number);

      if (isGuest && guestProgress.houseProgress?.[house.number]) {
        core.currentLevelIndex = guestProgress.houseProgress[house.number] - 1;
      }
      
      Houses.push(new HouseUI(core, houseFigures[index]));
    } catch (error) {
      console.error(`Error creating house ${index}:`, error);
    }
  });

  // Start dialogue sequence after houses are initialized
  setTimeout(() => {
    const allCompletedHouses = [
      ...new Set([
        ...(userProgress.completedHouses || []),
        ...(guestProgress.completedHouses || [])
      ])
    ];
    
    showInitialDialogues(userProgress, allCompletedHouses);
    
    // Check for newly unlocked houses
    checkForNewUnlocks(userProgress, allCompletedHouses);
  }, 100);
  

}

// In gameMenu.js

function checkForNewUnlocks(userProgress) {
  // Get all completed houses
  const completedHouses = userProgress.completedHouses || [];
  
  // Find the highest completed house number
  const highestCompleted = Math.max(...completedHouses, 0);
  
  // Check if next house should be unlocked
  const nextHouse = highestCompleted + 1;
  if (nextHouse <= 10 && !userProgress.unlockedHouses.includes(nextHouse)) {
    // Add to unlocked houses
    userProgress.unlockedHouses.push(nextHouse);
    
    // Show notification
    if (typeof showHouseUnlockNotification === 'function') {
      showHouseUnlockNotification(nextHouse);
    }
    
    // Save progress
    if (!userAccount?.id) {
      localStorage.setItem('guestProgress', JSON.stringify(userProgress));
    }
  }
}

function showInitialDialogues(userProgress, completedHouses) {
  const isFirstVisit = !localStorage.getItem('hasVisitedBefore');
  const isGuest = !window.userAccount || !window.userAccount.id;
  const allCompletedHouses = completedHouses || [];
  const lastCompletedHouse = getLastCompletedHouse(allCompletedHouses);
  const nextHouse = getNextHouseToComplete(userProgress, allCompletedHouses);

  // Determine which dialogues to show in sequence
  const dialogueSequence = [];

  // 1. First visit or returning player dialogue
  if (isFirstVisit && window.userAccount) {
    dialogueSequence.push({
      messages: professorIntro.newPlayer,
      options: { typingSpeed: 40, delay: 1500 }
    });
    localStorage.setItem('hasVisitedBefore', 'true');
  } else if (window.userAccount && professorIntro.returningPlayer?.length) {
    dialogueSequence.push({
      messages: professorIntro.returningPlayer,
      options: { typingSpeed: 40, delay: 500 }
    });
  }

  // 2. House completion dialogue (if applicable)
  if (lastCompletedHouse && !userProgress.shownCompletionDialogue) {
    dialogueSequence.push({
      messages: houseCompletionDialogues[lastCompletedHouse],
      options: { typingSpeed: 30, delay: 1000 }
    });
    if (isGuest) {
      userProgress.shownCompletionDialogue = true;
      localStorage.setItem('guestProgress', JSON.stringify(userProgress));
    }
  }

  // 3. Main menu content (without house intro)
  const mainMenuContent = getMainMenuContent(userProgress, allCompletedHouses, false);
  if (mainMenuContent && mainMenuContent.length > 0) {
    dialogueSequence.push({
      messages: mainMenuContent,
      options: { typingSpeed: 30, delay: 500 }
    });
  }

  // Only play sequence if we have dialogues to show
  if (dialogueSequence.length > 0) {
    playDialogueSequence(dialogueSequence);
  }
}

// Add this function to gameMenu.js
function showHouseUnlockNotification(houseNumber) {
  const notification = document.getElementById('notification');
  if (!notification) {
    console.error('Notification element not found');
    return;
  }
  
  const notificationText = notification.querySelector('.notification-text');
  notificationText.textContent = `Haus ${houseNumber} ist nun freigeschaltet!`;
  
  // Show notification
  notification.classList.add('show');
  
  // Play unlock sound
  const audio = new Audio('/assets/audio/notification.mp3');
  audio.volume = 0.3;
  audio.play().catch(e => console.log('Audio play prevented:', e));
  
  // Highlight the newly unlocked house
  const newHouseElement = document.getElementById(`Haus${houseNumber}`);
  if (newHouseElement) {
    newHouseElement.classList.add('newly-unlocked');
    setTimeout(() => {
      newHouseElement.classList.remove('newly-unlocked');
    }, 5000);
  }
  
  // Hide notification after delay
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

// Modified getMainMenuContent to be more consistent
function getMainMenuContent(userProgress, completedHouses, includeHouseIntro = true) {
  const allHouses = houseData.map(h => h.number);
  const nextHouse = getNextHouseToComplete(userProgress, completedHouses);
  const completionPercentage = Math.round((completedHouses.length / allHouses.length) * 100);
  const playerName = window.userAccount?.name || 'Zahlenmeister';
  
  // For new players
  if (completedHouses.length === 0) {
    if (window.userAccount) {
      return [...professorIntro.newPlayer];
    }
    return [
      `Willkommen, ${playerName}!`,
      "Ich bin der Professor, der plug für alle Fälle!",
      "Hinter jeder Tür verbirgt sich ein Geheimnis, das nur mit Logik und Mut gelüftet werden kann.",
      "Beginne mit Haus 1 und starte deine Reise!"
    ];
  }

  // For players with progress
  if (nextHouse) {
    const menuDialogue = [
      `${getContextualGreeting(completedHouses.length)}, ${playerName}!`,
      `Fortschritt: ${completedHouses.length}/${allHouses.length} Häuser (${completionPercentage}%)`
    ];

    // Add encouragement if applicable (only if not just shown completion dialogue)
    if (shouldShowEncouragement(userProgress) && userProgress.shownCompletionDialogue) {
      menuDialogue.push(getContextualEncouragement(completedHouses.length));
      updateEncouragementTimestamp(userProgress);
    }

    return menuDialogue;
  } 
  
  // For completed all houses
  if (completedHouses.length === allHouses.length) {
    return [...finalCompletionDialogue];
  }
  
  // For completed all unlocked houses
  return [
    `Beeindruckend, ${playerName}!`,
    `Du hast alle verfügbaren Häuser gemeistert (${completedHouses.length}/${allHouses.length}).`,
    "Ich arbeite bereits an neuen Herausforderungen für dich..."
  ];
}


// Add this at the bottom of gameMenu.js, before the exports
document.addEventListener('houseCompleted', (event) => {
  const houseNumber = event.detail.houseNumber;
  const nextHouse = houseNumber + 1;
  
  // Check if next house should be unlocked
  if (nextHouse <= 10 && !userProgress.unlockedHouses.includes(nextHouse)) {
    userProgress.unlockedHouses.push(nextHouse);
    showHouseUnlockNotification(nextHouse);
    
    // Save progress
    if (!window.userAccount?.id) {
      localStorage.setItem('guestProgress', JSON.stringify(userProgress));
    }
  }
});


export { initHouses, checkForNewUnlocks, showHouseUnlockNotification }


