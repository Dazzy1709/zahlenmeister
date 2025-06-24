import Levels from './level.js';

class HouseCore {
  constructor(number, name, topic, levelLimit, lives, numberStart, numberLimit, description, image, unlockedHouses = [1,2]) {
    this.number = number;
    this.name = name;
    this.topic = topic;
    this.numberStart = numberStart;
    this.numberLimit = numberLimit;
    this.description = description;
    this.image = image;
    this.lives = lives;
    this.levelLimit = levelLimit;
    this.houseCompleted = false;
    this.currentLevelIndex = 0;
    this.levels = [];
    this.time = 15;
    this.isLocked = !unlockedHouses.includes(number); 
    this.isCompleted = false;
    this.initLevels();
  }

  initLevels() {
    for (let i = 1; i <= this.levelLimit; i++) {
      const level = new Levels(i, this.topic, this.time, this.numberStart, this.numberLimit);
      this.levels.push(level);
    }
  }

  getCurrentLevel() {
    return this.levels[this.currentLevelIndex];
  }

  nextLevel() {
    if (this.currentLevelIndex < this.levelLimit - 1) {
      this.currentLevelIndex++;
      return true;
    }
    this.completeHouse();
    return false;
  }

  updateLevelProgress(level) {
    this.currentLevelIndex = level - 1; // Convert to 0-based index
    
    // If this is the last level, mark house as completed
    if (level >= this.levelLimit) {
        this.completeHouse();
    }
}

// In houseCore.js
completeHouse() {
  this.isCompleted = true;
  this.currentLevelIndex = 0;
  
  // Dispatch a custom event when house is completed
  const event = new CustomEvent('houseCompleted', {
    detail: { houseNumber: this.number }
  });
  document.dispatchEvent(event);
  
  return this.isCompleted;
}

  unlock() {
    this.isLocked = false;
  }

  reset() {
    this.currentLevelIndex = 0;
    this.lives = 3;
  }
}

export default HouseCore;