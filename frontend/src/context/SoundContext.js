import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const SoundContext = createContext();

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    // Return a no-op function if context is not available
    return { 
      playClickSound: () => {}, 
      playPreviewSound: () => {},
      soundEnabled: false,
      setSoundEnabled: () => {},
      selectedSound: null,
      setSelectedSound: () => {},
      volume: 0.5,
      setVolume: () => {},
      soundCategories: {}
    };
  }
  return context;
};

export const SoundProvider = ({ children }) => {
  const getInitialSelectedSound = () => {
    const saved = localStorage.getItem('selectedClickSound');
    return saved ? JSON.parse(saved) : null;
  };

  const getInitialVolume = () => {
    const saved = localStorage.getItem('clickSoundVolume');
    return saved ? parseFloat(saved) : 0.3;
  };

  const getInitialSoundEnabled = () => {
    const saved = localStorage.getItem('clickSoundEnabled');
    return saved !== 'false'; // Default to enabled
  };

  const [selectedSound, setSelectedSound] = useState(getInitialSelectedSound);
  const [volume, setVolume] = useState(getInitialVolume);
  const [soundEnabled, setSoundEnabled] = useState(getInitialSoundEnabled);

  // Helper function to create a simple beep sound using Web Audio API
  const createBeepSound = (vol, frequency = 800, duration = 0.1) => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      // Increased volume - using 0.8 multiplier for louder sound
      const volumeMultiplier = vol * 0.8;
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(volumeMultiplier, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (err) {
      console.error('Beep sound creation failed:', err);
    }
  };

  // Sound configuration - supports both custom files and programmatic beep sounds
  const soundCategories = {
    classical: {
      name: 'Classical',
      icon: '🎼',
      sounds: [
        { id: 'classical1', name: 'Classical Click', url: '/sounds/classical/classical1.mp3', type: 'beep', frequency: 800 },
        { id: 'classical2', name: 'Piano Key', url: '/sounds/classical/classical2.mp3', type: 'beep', frequency: 523 },
        { id: 'classical3', name: 'Bell Chime', url: '/sounds/classical/classical3.mp3', type: 'beep', frequency: 1047 },
        { id: 'classical4', name: 'Harp Pluck', url: '/sounds/classical/classical4.mp3', type: 'beep', frequency: 659 },
      ]
    },
    musical: {
      name: 'Musical',
      icon: '🎵',
      subcategories: {
        guitar: {
          name: 'Guitar',
          icon: '🎸',
          sounds: [
            { id: 'guitar1', name: 'Guitar', url: '/sounds/guitar/Guitar.mp3', type: 'beep', frequency: 330 },
            { id: 'guitar2', name: 'Guitar 2', url: '/sounds/guitar/Guitar2.mp3', type: 'beep', frequency: 392 },
            { id: 'guitar3', name: 'Guitar 3', url: '/sounds/guitar/Guitar3.mp3', type: 'beep', frequency: 440 },
          ]
        },
        piano: {
          name: 'Piano',
          icon: '🎹',
          sounds: [
            { id: 'piano1', name: 'Piano', url: '/sounds/piano/Piano.mp3', type: 'beep', frequency: 523 },
            { id: 'piano2', name: 'Piano 1', url: '/sounds/piano/Piano1.mp3', type: 'beep', frequency: 262 },
            { id: 'piano3', name: 'Piano 2', url: '/sounds/piano/Piano2.mp3', type: 'beep', frequency: 1047 },
            { id: 'piano4', name: 'Piano 3', url: '/sounds/piano/Piano3.mp3', type: 'beep', frequency: 659 },
            { id: 'piano5', name: 'Piano 4', url: '/sounds/piano/Piano4.mp3', type: 'beep', frequency: 784 },
          ]
        },
        violin: {
          name: 'Violin',
          icon: '🎻',
          sounds: [
            { id: 'violin1', name: 'Violin', url: '/sounds/Voilin/Voilin.mp3', type: 'file' },
            { id: 'violin2', name: 'Violin 1', url: '/sounds/Voilin/Voilin1.mp3', type: 'file' },
            { id: 'violin3', name: 'Violin 2', url: '/sounds/Voilin/Voilin2.mp3', type: 'file' },
            { id: 'violin4', name: 'Violin 3', url: '/sounds/Voilin/Voilin3.mp3', type: 'file' },
            { id: 'violin5', name: 'Violin 4', url: '/sounds/Voilin/Voilin4.mp3', type: 'file' },
            { id: 'violin6', name: 'Violin 5', url: '/sounds/Voilin/Voilin5.mp3', type: 'file' },
          ]
        }
      }
    },
    modern: {
      name: 'Modern',
      icon: '🎧',
      sounds: [
        { id: 'modern1', name: 'Modern', url: '/sounds/Mordern/Mordern.mp3', type: 'beep', frequency: 1000 },
        { id: 'modern2', name: 'Modern 1', url: '/sounds/Mordern/Mordern1.mp3', type: 'beep', frequency: 1200 },
        { id: 'modern3', name: 'Modern 2', url: '/sounds/Mordern/Mordern2.mp3', type: 'beep', frequency: 800 },
        { id: 'modern4', name: 'Modern 3', url: '/sounds/Mordern/Mordern3.mp3', type: 'beep', frequency: 600 },
        { id: 'modern5', name: 'Modern 4', url: '/sounds/Mordern/Mordern4.mp3', type: 'beep', frequency: 1000 },
        { id: 'modern6', name: 'Modern 5', url: '/sounds/Mordern/Mordern5.mp3', type: 'beep', frequency: 1200 },
        { id: 'modern7', name: 'Modern 6', url: '/sounds/Mordern/Mordern6.mp3', type: 'beep', frequency: 800 },
        { id: 'modern8', name: 'Modern 7', url: '/sounds/Mordern/Mordern7.mp3', type: 'beep', frequency: 600 },
        { id: 'modern9', name: 'Modern 8', url: '/sounds/Mordern/Mordern8.mp3', type: 'beep', frequency: 1000 },
        { id: 'modern10', name: 'Modern 9', url: '/sounds/Mordern/Mordern9.mp3', type: 'beep', frequency: 1200 },
        { id: 'modern11', name: 'Modern 10', url: '/sounds/Mordern/Mordern10.mp3', type: 'beep', frequency: 800 },
      ]
    }
  };

  useEffect(() => {
    if (selectedSound) {
      localStorage.setItem('selectedClickSound', JSON.stringify(selectedSound));
    }
  }, [selectedSound]);

  useEffect(() => {
    localStorage.setItem('clickSoundVolume', volume.toString());
  }, [volume]);

  useEffect(() => {
    localStorage.setItem('clickSoundEnabled', soundEnabled.toString());
  }, [soundEnabled]);

  const playClickSound = useCallback(() => {
    if (!soundEnabled || !selectedSound) return;

    // Try custom sound file first (if URL exists)
    if (selectedSound.url) {
      const audio = new Audio(selectedSound.url);
      audio.volume = volume;
      
      // Try to play custom file, fallback to beep if it fails
      audio.onerror = () => {
        // Custom file not found or failed, use beep sound
        if (selectedSound.frequency) {
          createBeepSound(volume, selectedSound.frequency);
        } else {
          createBeepSound(volume);
        }
      };
      
      audio.play().catch(err => {
        console.debug('Custom sound play failed, using beep:', err);
        // Fallback to beep
        if (selectedSound.frequency) {
          createBeepSound(volume, selectedSound.frequency);
        } else {
          createBeepSound(volume);
        }
      });
    } else if (selectedSound.type === 'beep' && selectedSound.frequency) {
      // Use programmatic beep sound directly
      createBeepSound(volume, selectedSound.frequency);
    } else {
      // Default beep
      createBeepSound(volume);
    }
  }, [soundEnabled, selectedSound, volume]);

  const playPreviewSound = useCallback((sound) => {
    if (!sound) {
      console.error('Invalid sound provided for preview');
      return;
    }

    // Try custom sound file first (if URL exists)
    if (sound.url) {
      try {
        const audio = new Audio(sound.url);
        audio.volume = volume;
        
        audio.onerror = () => {
          // Custom file not found or failed, use beep sound
          if (sound.frequency) {
            createBeepSound(volume, sound.frequency);
          } else {
            createBeepSound(volume);
          }
        };
        
        audio.play().catch(err => {
          console.debug('Preview custom sound play failed, using beep:', err);
          // Fallback to beep sound
          if (sound.frequency) {
            createBeepSound(volume, sound.frequency);
          } else {
            createBeepSound(volume);
          }
        });
      } catch (error) {
        console.error('Error creating audio:', error);
        // Fallback to beep
        if (sound.frequency) {
          createBeepSound(volume, sound.frequency);
        } else {
          createBeepSound(volume);
        }
      }
    } else if (sound.type === 'beep' && sound.frequency) {
      // Use programmatic beep sound directly
      createBeepSound(volume, sound.frequency);
    } else {
      // Default beep
      createBeepSound(volume);
    }
  }, [volume]);

  const value = {
    selectedSound,
    setSelectedSound,
    volume,
    setVolume,
    soundEnabled,
    setSoundEnabled,
    playClickSound,
    playPreviewSound,
    soundCategories,
  };

  return (
    <SoundContext.Provider value={value}>
      {children}
    </SoundContext.Provider>
  );
};

