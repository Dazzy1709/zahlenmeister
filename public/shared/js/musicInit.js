import musicController from '../../js/musicController.js';

export function initMenuPages() {
  const startBtn = document.getElementById('startMusicBtn');
  
  // First attempt (will fail if no interaction yet)
  musicController.playMenuMusic().catch(() => {
    if (startBtn) {
      startBtn.style.display = 'block';
      
      startBtn.addEventListener('click', async (e) => {
        try {
          // Create new audio context during click handler
          const silentAudio = new Audio();
          silentAudio.volume = 0;
          
          // Must play silent audio first in the same event handler
          await silentAudio.play().catch(() => {});
          
          // Now play the real music
          await musicController.playMenuMusic();
          
          // Hide button and transition screens
          startBtn.style.display = 'none';
          document.querySelector('.start-screen')?.classList.add('hidden');
          document.querySelector('.welcome-overlay')?.classList.remove('hidden');
        } catch (err) {
          console.error('Final playback failed:', err);
          
          // Last resort - create completely new audio element
          const newAudio = new Audio('/assets/audio/menu-music.mp3');
          newAudio.volume = 0.3;
          await newAudio.play();
          startBtn.style.display = 'none';
          document.querySelector('.start-screen')?.classList.add('hidden');
          document.querySelector('.welcome-overlay')?.classList.remove('hidden');
        }
      });
    }
  });
}