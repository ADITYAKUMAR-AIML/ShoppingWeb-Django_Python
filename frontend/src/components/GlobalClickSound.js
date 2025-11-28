import { useEffect } from 'react';
import { useSound } from '../context/SoundContext';

const GlobalClickSound = () => {
  const { playClickSound, soundEnabled, selectedSound } = useSound();

  useEffect(() => {
    if (!soundEnabled || !selectedSound) return;

    const handleClick = (e) => {
      // Only play sound for interactive elements (buttons, links, clickable items)
      const target = e.target;
      
      // Check if clicked element is interactive
      const isButton = target.tagName === 'BUTTON' || target.closest('button');
      const isLink = target.tagName === 'A' || target.closest('a');
      const isRoleButton = target.closest('[role="button"]');
      const isClickable = target.closest('.clickable') || target.closest('[data-clickable]');
      const isInteractive = isButton || isLink || isRoleButton || isClickable;

      // Don't play sounds on specific settings page controls to avoid feedback loops
      // But allow sounds for category tabs and other buttons
      const isSettingsPage = target.closest('.settings-page');
      const isCheckbox = target.type === 'checkbox' || target.closest('input[type="checkbox"]');
      const isRange = target.type === 'range' || target.closest('input[type="range"]');
      const isSettingsControl = isSettingsPage && (isCheckbox || isRange);
      
      if (isInteractive && !isSettingsControl) {
        playClickSound();
      }
    };

    document.addEventListener('click', handleClick, true);
    
    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, [playClickSound, soundEnabled, selectedSound]);

  return null;
};

export default GlobalClickSound;

