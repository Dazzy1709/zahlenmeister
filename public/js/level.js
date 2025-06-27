import {questionGenerators} from "../shared/js/variables.js";

class Levels {
  constructor(levelNr,topic,time,numberStart,numberLimit) {
    this.levelNr = levelNr;
    this.topic = this.validateTopic(topic);
    this.time = time;
    this.questionCount = 1;
    this.numberStart = numberStart;
    this.numberLimit = numberLimit;
    this.isCompleted = false;
    this.currentQuestionIndex = 0;
    this.questions = this.generateQuestions();
  }

  validateTopic(topic) {
      if (questionGenerators[topic]) return topic;
      const lowerTopic = topic.toLowerCase();
      const matchedKey = Object.keys(questionGenerators).find(
        key => key.toLowerCase() === lowerTopic
      );
      return matchedKey || "Plus (Easy)"; 
  }

  generateQuestions () {
    try {
      const generator = questionGenerators[this.topic];
      if (typeof generator !== 'function') {
        throw new Error(`No generator found for topic: ${this.topic}`);
      }
      const questions = [];
      for (let i = 0; i < this.questionCount; i++) {
        const a = this.random(this.numberStart, this.numberLimit);
        const b = this.random(this.numberStart, this.numberLimit);
        questions.push(generator(a, b));
      }
      return questions;
    } catch (error) {
      console.error("Question generation failed:", error);
      return [{
        question: "1 + 1",
        answer: 2
      }];
    }
  }

  getCurrentQuestion() {
    return this.questions[this.currentQuestionIndex];
  }

  nextQuestion() {
    this.currentQuestionIndex++;
    return this.getCurrentQuestion();
  }

  isFinished() {
    return this.currentQuestionIndex >= this.questions.length;
  }


  random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

export default Levels;