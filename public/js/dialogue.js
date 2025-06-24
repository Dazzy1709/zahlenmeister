function initDialogue(dialogues, options = {}) {
  const dialogueBox = document.querySelector('.dialogue-box');
  const dialogueText = document.getElementById('dialogue-text');

  // Check if elements exist and dialogues are valid
  if (!dialogueBox || !dialogueText || !Array.isArray(dialogues) || dialogues.length === 0) {
    if (options.onComplete) options.onComplete();
    return;
  }

  // Clear any existing dialogue instances
  if (window.activeDialogue) {
    window.activeDialogue.cleanup();
  }

  // Set default options
  const config = {
    typingSpeed: options.typingSpeed || 30,
    delay: options.delay || 300,
    autoHide: options.autoHide !== false,
    clickToContinue: options.clickToContinue !== false,
    onComplete: options.onComplete || function() {}
  };

  // Dialogue state variables
  let currentLine = 0;
  let isTyping = false;
  let currentText = "";
  let timeoutId = null;
  let isComplete = false;

  function startTyping() {
    if (currentLine >= dialogues.length) {
      finishDialogue();
      return;
    }

    isTyping = true;
    currentText = dialogues[currentLine];
    dialogueText.textContent = "";
    
    // Reset the text container
    dialogueText.style.visibility = 'hidden';
    void dialogueText.offsetWidth; // Trigger reflow
    dialogueText.style.visibility = 'visible';
    
    // Split text into characters for proper typing
    const characters = [...currentText];
    let currentPos = 0;
    
    function typeCharacter() {
      if (currentPos < characters.length) {
        dialogueText.textContent += characters[currentPos];
        currentPos++;
        timeoutId = setTimeout(typeCharacter, config.typingSpeed);
      } else {
        isTyping = false;
        // Auto-advance if clickToContinue is disabled
        if (!config.clickToContinue) {
          timeoutId = setTimeout(advanceDialogue, 1500);
        }
      }
    }
    
    typeCharacter();
  }

  function advanceDialogue() {
    if (isComplete) return;
    
    currentLine++;
    if (currentLine < dialogues.length) {
      startTyping();
    } else {
      finishDialogue();
    }
  }

  function finishDialogue() {
    if (isComplete) return;
    isComplete = true;
  
    if (config.autoHide) {
      dialogueBox.classList.remove('visible');
      dialogueBox.classList.add('hidden');
      setTimeout(() => {
        cleanup();
        config.onComplete();
      }, 500); // Match this with the CSS transition duration
    } else {
      cleanup();
      config.onComplete();
    }
  }

  function cleanup() {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    dialogueBox.removeEventListener('click', handleClick);
    delete window.activeDialogue;
  }

  function handleClick() {
    if (isComplete) return;
    
    if (timeoutId) clearTimeout(timeoutId);
    
    if (isTyping) {
      // Skip to end of current line
      dialogueText.textContent = currentText;
      isTyping = false;
    } else {
      advanceDialogue();
    }
  }

  // Store the active dialogue for cleanup
  window.activeDialogue = {
    cleanup: cleanup
  };

  // Initialize the dialogue
  dialogueBox.classList.remove('hidden');
  dialogueBox.addEventListener('click', handleClick);

  // Start the dialogue after delay
  timeoutId = setTimeout(() => {
    dialogueBox.classList.add('visible');
    startTyping();
  }, config.delay);
}

function showDialogue(message, options = {}) {
  const messages = Array.isArray(message) ? message : [message];
  initDialogue(messages, {
    autoHide: true,
    clickToContinue: true,
    ...options
  });
}

export { showDialogue, initDialogue };