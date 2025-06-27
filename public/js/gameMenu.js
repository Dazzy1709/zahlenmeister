import HouseCore from './houseCore.js';
import HouseUI from './houseUI.js'; 
import { houseData, professorIntro, finalCompletionDialogue, houseCompletionDialogues } from '../shared/js/variables.js';
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
};

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
};

function getNextHouseToComplete(userProgress, completedHouses) {
  return houseData.find(h => 
    !completedHouses.includes(h.number) && 
    userProgress.unlockedHouses.includes(h.number)
  );
};

function getLastCompletedHouse(completedHouses) {
  if (!completedHouses || completedHouses.length === 0) return null;
  return Math.max(...completedHouses.filter(Number.isInteger));
};

function shouldShowEncouragement(userProgress) {
  const now = Date.now();
  const lastEncouragement = userProgress.lastEncouragementTime || 0;
  const hoursSinceLastEncouragement = (now - lastEncouragement) / (1000 * 60 * 60);
  return Math.random() < 0.3 && hoursSinceLastEncouragement >= 1;
};

function updateEncouragementTimestamp(userProgress) {
  userProgress.lastEncouragementTime = Date.now();
  if (!window.userAccount || !window.userAccount.id) {
    localStorage.setItem('guestProgress', JSON.stringify(userProgress));
  }
};

function playDialogueSequence(sequence, index = 0) {
  if (index >= sequence.length) return;
  const { messages, options } = sequence[index];
  showDialogue(messages, {
    ...options,
    onComplete: () => playDialogueSequence(sequence, index + 1)
  });
};

function initHouses(userProgress = {
  unlockedHouses: [1, 2],
  completedHouses: []
}) {
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
  };

  Houses.length = 0;
  const houseFigures = document.querySelectorAll(".house");
  if (houseFigures.length === 0) {
    console.error("No house elements found in DOM!");
    createFallbackHouses();
    return;
  };

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

  setTimeout(() => {
    const allCompletedHouses = [
      ...new Set([
        ...(userProgress.completedHouses || []),
        ...(guestProgress.completedHouses || [])
      ])
    ];
    showInitialDialogues(userProgress, allCompletedHouses);
    checkForNewUnlocks(userProgress, allCompletedHouses);
  }, 100);
};

function checkForNewUnlocks(userProgress) {
  const completedHouses = userProgress.completedHouses || [];
  const highestCompleted = Math.max(...completedHouses, 0);
  const nextHouse = highestCompleted + 1;
  if (nextHouse <= 10 && !userProgress.unlockedHouses.includes(nextHouse)) {
    userProgress.unlockedHouses.push(nextHouse);
    if (!userAccount?.id) {
      localStorage.setItem('guestProgress', JSON.stringify(userProgress));
    }
  }
};

function showInitialDialogues(userProgress, completedHouses) {
  const isFirstVisit = !localStorage.getItem('hasVisitedBefore');
  const isGuest = !window.userAccount || !window.userAccount.id;
  const allCompletedHouses = completedHouses || [];
  const lastCompletedHouse = getLastCompletedHouse(allCompletedHouses);
  const nextHouse = getNextHouseToComplete(userProgress, allCompletedHouses);
  const dialogueSequence = [];

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
  const mainMenuContent = getMainMenuContent(userProgress, allCompletedHouses, false);
  if (mainMenuContent && mainMenuContent.length > 0) {
    dialogueSequence.push({
      messages: mainMenuContent,
      options: { typingSpeed: 30, delay: 500 }
    });
  }
  if (dialogueSequence.length > 0) {
    playDialogueSequence(dialogueSequence);
  }
};

function getMainMenuContent(userProgress, completedHouses) {
  const allHouses = houseData.map(h => h.number);
  const nextHouse = getNextHouseToComplete(userProgress, completedHouses);
  const completionPercentage = Math.round((completedHouses.length / allHouses.length) * 100);
  const playerName = window.userAccount?.name || 'Zahlenmeister';
  
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
  if (nextHouse) {
    const menuDialogue = [
      `${getContextualGreeting(completedHouses.length)}, ${playerName}!`,
      `Fortschritt: ${completedHouses.length}/${allHouses.length} Häuser (${completionPercentage}%)`
    ];
    if (shouldShowEncouragement(userProgress) && userProgress.shownCompletionDialogue) {
      menuDialogue.push(getContextualEncouragement(completedHouses.length));
      updateEncouragementTimestamp(userProgress);
    }
    return menuDialogue;
  } 
  if (completedHouses.length === allHouses.length) {
    return [...finalCompletionDialogue];
  }
  return [
    `Beeindruckend, ${playerName}!`,
    `Du hast alle verfügbaren Häuser gemeistert (${completedHouses.length}/${allHouses.length}).`,
    "Ich arbeite bereits an neuen Herausforderungen für dich..."
  ];
};
document.addEventListener('houseCompleted', (event) => {
  const houseNumber = event.detail.houseNumber;
  const nextHouse = houseNumber + 1;
  if (nextHouse <= 10 && !userProgress.unlockedHouses.includes(nextHouse)) {
    userProgress.unlockedHouses.push(nextHouse);
    if (!window.userAccount?.id) {
      localStorage.setItem('guestProgress', JSON.stringify(userProgress));
    }
  }
});

export { initHouses, checkForNewUnlocks }


