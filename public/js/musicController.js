class MusicController {
  constructor() {
    this.audio = null; // Initialize as null
    this.currentTrack = null;
    this.volume = 0.1;
    this._isMuted = false; // Initialize _isMuted
    this.readyToPlay = false;
    this.shouldPlayGameMusic = false; // Add this flag
    
    this.loadPreferences();
    this.setupInteractionListener();
  }
  
  // Getter for audio element that lazy-loads it when needed
  getAudioElement() {
    if (!this.audio) {
      this.audio = document.getElementById('backgroundMusic') || this.createAudioElement();
      this.audio.volume = this._isMuted ? 0 : this.volume;
    }
    return this.audio;
  }
  
  createAudioElement() {
    const audio = document.createElement('audio');
    audio.id = 'backgroundMusic';
    audio.loop = true;
    document.body.appendChild(audio);
    return audio;
  }
  
  loadPreferences() {
    try {
      const savedVolume = localStorage.getItem('musicVolume');
      const savedMuted = localStorage.getItem('musicMuted');
      
      if (savedVolume !== null) {
        this.volume = parseFloat(savedVolume);
      }
      
      if (savedMuted !== null) {
        this._isMuted = savedMuted === 'true';
      }
    } catch (e) {
      console.error('Error loading preferences:', e);
    }
  }
  
  savePreferences() {
    try {
      localStorage.setItem('musicVolume', this.volume.toString());
      localStorage.setItem('musicMuted', this._isMuted.toString());
    } catch (e) {
      console.error('Error saving preferences:', e);
    }
  }
  
  setupInteractionListener() {
    const enablePlayback = () => {
      this.readyToPlay = true;
      document.removeEventListener('click', enablePlayback);
      document.removeEventListener('keydown', enablePlayback);
      document.removeEventListener('touchstart', enablePlayback);
      
      // Try playing if music was queued
      if (this.currentTrack) {
        this.getAudioElement().play().catch(e => console.log('Autoplay blocked:', e));
      }
    };
  
    // Listen for first user interaction
    document.addEventListener('click', enablePlayback, { once: true });
    document.addEventListener('keydown', enablePlayback, { once: true });
    document.addEventListener('touchstart', enablePlayback, { once: true });
  }
  
  playMenuMusic() {
    return new Promise((resolve, reject) => {
      if (this.currentTrack === 'menu') return resolve();

      this.currentTrack = 'menu';
      const audio = this.getAudioElement();
      audio.src = '/assets/audio/menu-music.mp3';
      audio.volume = this._isMuted ? 0 : this.volume;

      if (this.readyToPlay) {
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => resolve())
            .catch(e => {
              console.error('Playback failed:', e);
              this.readyToPlay = false; // Reset for next attempt
              reject(e);
            });
        }
      } else {
        reject(new Error('User interaction required'));
      }
    });
  }
  
  playGameMusic() {
    if (this.currentTrack === 'game') return Promise.resolve();

    this.currentTrack = 'game';
    this.shouldPlayGameMusic = true; // Set the flag
    const audio = this.getAudioElement();
    audio.src = '/assets/audio/rechnen-music.mp3';
    audio.volume = this._isMuted ? 0 : this.volume;

    if (this.readyToPlay) {
      return audio.play().catch(e => {
        console.log('Playback error:', e);
        throw e;
      });
    }
    return Promise.reject(new Error('User interaction required'));
  }

  // Add this method to resume playback if needed
  resumePlayback() {
    if (this.shouldPlayGameMusic && !this.isPlaying()) {
      this.playGameMusic().catch(e => console.log('Resume playback error:', e));
    }
  }
  
  stopMusic() {
    if (this.audio) {
      this.audio.pause();
    }
    this.currentTrack = null;
  }
  
  setVolume(volume) {
    this.volume = volume;
    if (!this._isMuted && this.audio) {
      this.audio.volume = volume;
    }
    this.savePreferences();
  }

  get isMuted() {
    return this._isMuted;
  }
  
  toggleMute() {
    this._isMuted = !this._isMuted;
    if (this.audio) {
      this.audio.volume = this._isMuted ? 0 : this.volume;
    }
    this.savePreferences();
    return !this._isMuted;
  }
  
  isPlaying() {
    return this.audio && !this.audio.paused && this.currentTrack !== null;
  }
}

// Singleton instance
const musicController = new MusicController();

// Export and also make available globally for easy access
window.musicController = musicController;
export default musicController;
