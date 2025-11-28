import React, { useEffect, useState } from 'react';
import './Settings.css';
import { useSound } from '../context/SoundContext';

const Settings = () => {
  const getInitialTheme = () => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return document.body.classList.contains('dark-mode');
  };

  const getInitialCursor = () => {
    return localStorage.getItem('cursor') || 'default';
  };

  const getInitialCursorSize = () => {
    return parseInt(localStorage.getItem('cursorSize')) || 30;
  };

  const [isDark, setIsDark] = useState(getInitialTheme);
  const [cursor, setCursor] = useState(getInitialCursor);
  const [cursorSize, setCursorSize] = useState(getInitialCursorSize);
  
  // Sound context
  const { 
    selectedSound, 
    setSelectedSound, 
    volume, 
    setVolume, 
    soundEnabled, 
    setSoundEnabled,
    playPreviewSound,
    soundCategories 
  } = useSound();

  const [soundCategory, setSoundCategory] = useState(() => {
    return localStorage.getItem('soundCategory') || 'classical';
  });
  
  const getMusicalSubcategory = () => {
    const saved = localStorage.getItem('musicalSubcategory') || 'guitar';
    return saved;
  };

  const [musicalSubcategory, setMusicalSubcategory] = useState(getMusicalSubcategory);

  useEffect(() => {
    localStorage.setItem('soundCategory', soundCategory);
  }, [soundCategory]);

  useEffect(() => {
    localStorage.setItem('musicalSubcategory', musicalSubcategory);
  }, [musicalSubcategory]);

  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    // Remove any existing cursor class
    document.body.classList.remove('custom-cursor-googles', 'custom-cursor-heart', 'custom-cursor-cart', 'custom-cursor-laser', 'custom-cursor-fire');
    
    // Remove old style if exists
    const oldStyle = document.getElementById('custom-cursor-styles');
    if (oldStyle) {
      oldStyle.remove();
    }
    
    // For custom cursors (emojis), we use CSS classes
    const customCursors = ['Googles', 'heart', 'cart', 'laser', 'fire'];
    
    if (customCursors.includes(cursor)) {
      document.body.classList.add(`custom-cursor-${cursor.toLowerCase()}`);
      document.body.style.cursor = '';
      
      // Add styles for custom cursors
      const style = document.createElement('style');
      style.id = 'custom-cursor-styles';
      
      const emojiMap = {
        'googles': '😎',
        'heart': '❤️',
        'cart': '🛒',
        'laser': '💥',
        'fire': '🔥'
      };
      
      const emoji = emojiMap[cursor.toLowerCase()];
      
      style.textContent = `
        .custom-cursor-${cursor.toLowerCase()} * { 
          cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='${cursorSize + 10}' height='${cursorSize + 10}' viewport='0 0 ${cursorSize + 10} ${cursorSize + 10}' style='font-size:${cursorSize}px;'><text y='${cursorSize}'>${emoji}</text></svg>") ${(cursorSize + 10) / 2} ${(cursorSize + 10) / 2}, auto !important; 
        }
        
        /* Keep pointer cursor for clickable elements */
        .custom-cursor-${cursor.toLowerCase()} button,
        .custom-cursor-${cursor.toLowerCase()} a,
        .custom-cursor-${cursor.toLowerCase()} [role="button"],
        .custom-cursor-${cursor.toLowerCase()} .clickable,
        .custom-cursor-${cursor.toLowerCase()} input[type="range"] {
          cursor: pointer !important;
        }
      `;
      document.head.appendChild(style);
    } else {
      document.body.style.cursor = cursor;
    }
    
    localStorage.setItem('cursor', cursor);
  }, [cursor, cursorSize]);

  useEffect(() => {
    localStorage.setItem('cursorSize', cursorSize);
  }, [cursorSize]);

  const cursorOptions = [
    { value: 'default', label: 'Default', icon: '👆' },
    { value: 'crosshair', label: 'Crosshair', icon: '➕' },
    { value: 'move', label: 'Move', icon: '✋' },
    { value: 'help', label: 'Help', icon: '❓' },
    { value: 'Googles', label: 'Googles', icon: '😎' },
    { value: 'pointer', label: 'Pointer', icon: '👉' },
    { value: 'laser', label: 'Laser', icon: '💥' },
    { value: 'fire', label: 'Fire', icon: '🔥' },
    { value: 'cart', label: 'Cart', icon: '🛒' },
    { value: 'heart', label: 'Heart', icon: '❤' },
    { value: 'not-allowed', label: 'Not Allowed', icon: '🚫' },
    { value: 'grab', label: 'Grab', icon: '✊' },
    { value: 'zoom-in', label: 'Zoom In', icon: '🔍' },
  ];

  const customCursorValues = ['Googles', 'heart', 'cart', 'laser', 'fire'];
  const isCustomCursor = customCursorValues.includes(cursor);


  return (
    <div 
      className="settings-page" 
      style={{ 
        maxWidth: 720, 
        margin: '32px auto', 
        padding: 16,
        backgroundColor: isDark ? '#1a1a1a' : '#fff5e6',
        minHeight: '100vh',
        color: isDark ? '#f0f0f0' : '#333'
      }}
    >
      <h1 style={{ marginBottom: 24, color: isDark ? '#ff8c42' : '#ff6b35' }}>Settings</h1>

      {/* Dark Mode Toggle */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ 
          fontSize: 18, 
          marginBottom: 12, 
          fontWeight: 600,
          color: isDark ? '#ff8c42' : '#ff6b35'
        }}>
          Theme
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={isDark}
              onChange={(e) => setIsDark(e.target.checked)}
              style={{ display: 'none' }}
            />
            <span
              aria-hidden
              style={{
                position: 'relative',
                width: 52,
                height: 28,
                background: isDark ? '#111827' : '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: 999,
                boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                transition: 'background 0.2s',
                display: 'inline-block'
              }}
              onClick={() => setIsDark(!isDark)}
            >
              <span
                style={{
                  position: 'absolute',
                  top: 2,
                  left: isDark ? 26 : 2,
                  width: 24,
                  height: 24,
                  background: isDark ? '#f59e0b' : '#374151',
                  borderRadius: '50%',
                  transition: 'left 0.2s',
                }}
              />
            </span>
            <span style={{ fontWeight: 600 }}>{isDark ? 'Dark Mode' : 'Light Mode'}</span>
          </label>
        </div>
      </div>

      {/* Cursor Selection */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ 
          fontSize: 18, 
          marginBottom: 12, 
          fontWeight: 600,
          color: isDark ? '#ff8c42' : '#ff6b35'
        }}>
          Cursor Style
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', 
          gap: 12 
        }}>
          {cursorOptions.map((option) => (
            <div
              key={option.value}
              onClick={() => setCursor(option.value)}
              style={{
                padding: '12px 16px',
                border: cursor === option.value 
                  ? '2px solid #f59e0b' 
                  : isDark ? '1px solid #444' : '1px solid #e5e7eb',
                borderRadius: 8,
                cursor: 'pointer',
                textAlign: 'center',
                background: cursor === option.value 
                  ? (isDark ? '#3a3a1a' : '#fef3c7')
                  : (isDark ? '#2a2a2a' : '#fff'),
                transition: 'all 0.2s',
                boxShadow: cursor === option.value ? '0 4px 6px rgba(245, 158, 11, 0.1)' : 'none'
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 4 }}>{option.icon}</div>
              <div style={{ 
                fontSize: 14, 
                fontWeight: cursor === option.value ? 600 : 400,
                color: isDark ? '#f0f0f0' : '#333'
              }}>
                {option.label}
              </div>
            </div>
          ))}
        </div>
        
        {/* Preview text */}
        <p style={{ 
          marginTop: 16, 
          padding: 12, 
          background: isDark ? '#2a2a2a' : '#f3f4f6', 
          borderRadius: 8,
          fontSize: 14,
          color: isDark ? '#9ca3af' : '#6b7280'
        }}>
          💡 Hover over this settings page to preview your cursor style
        </p>
      </div>

      {/* Cursor Size Slider (only visible for custom emoji cursors) */}
      {isCustomCursor && (
        <div>
          <h2 style={{ 
            fontSize: 18, 
            marginBottom: 12, 
            fontWeight: 600,
            color: isDark ? '#ff8c42' : '#ff6b35'
          }}>
            Cursor Size
          </h2>
          <div style={{
            padding: 16,
            background: isDark ? '#2a2a2a' : '#fff',
            borderRadius: 8,
            border: isDark ? '1px solid #444' : '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontSize: 14, minWidth: 60 }}>Small</span>
              <input
                type="range"
                min="20"
                max="60"
                value={cursorSize}
                onChange={(e) => setCursorSize(parseInt(e.target.value))}
                style={{
                  flex: 1,
                  height: 6,
                  borderRadius: 3,
                  outline: 'none',
                  background: isDark 
                    ? `linear-gradient(to right, #f59e0b 0%, #f59e0b ${((cursorSize - 20) / 40) * 100}%, #444 ${((cursorSize - 20) / 40) * 100}%, #444 100%)`
                    : `linear-gradient(to right, #f59e0b 0%, #f59e0b ${((cursorSize - 20) / 40) * 100}%, #e5e7eb ${((cursorSize - 20) / 40) * 100}%, #e5e7eb 100%)`,
                  WebkitAppearance: 'none',
                  appearance: 'none'
                }}
              />
              <span style={{ fontSize: 14, minWidth: 60, textAlign: 'right' }}>Large</span>
            </div>
            <div style={{ 
              marginTop: 12, 
              textAlign: 'center',
              fontSize: 14,
              color: isDark ? '#9ca3af' : '#6b7280'
            }}>
              Current size: {cursorSize}px
            </div>
          </div>
          
          <style>{`
            input[type="range"]::-webkit-slider-thumb {
              -webkit-appearance: none;
              appearance: none;
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background: #f59e0b;
              cursor: pointer;
              border: 2px solid white;
              box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }
            
            input[type="range"]::-moz-range-thumb {
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background: #f59e0b;
              cursor: pointer;
              border: 2px solid white;
              box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }
          `}</style>
        </div>
      )}

      {/* Sound Section */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ 
          fontSize: 18, 
          marginBottom: 12, 
          fontWeight: 600,
          color: isDark ? '#ff8c42' : '#ff6b35'
        }}>
          Click Sounds
        </h2>
        <p style={{ 
          marginBottom: 16,
          fontSize: 14,
          color: isDark ? '#9ca3af' : '#6b7280'
        }}>
          Select a sound effect that will play when you click buttons and links throughout the website.
        </p>

        {/* Enable/Disable Toggle */}
        <div style={{ 
          marginBottom: 16,
          padding: 12,
          background: isDark ? '#2a2a2a' : '#fff',
          borderRadius: 8,
          border: isDark ? '1px solid #444' : '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span style={{ 
            fontWeight: 600,
            color: isDark ? '#f0f0f0' : '#333'
          }}>
            Enable Click Sounds
          </span>
          <label 
            style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
          >
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(e) => {
                e.stopPropagation();
                const newValue = e.target.checked;
                setSoundEnabled(newValue);
              }}
              style={{ display: 'none' }}
            />
            <span
              aria-hidden
              style={{
                position: 'relative',
                width: 52,
                height: 28,
                background: soundEnabled ? (isDark ? '#f59e0b' : '#ff6b35') : (isDark ? '#444' : '#e5e7eb'),
                border: '1px solid transparent',
                borderRadius: 999,
                boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                transition: 'background 0.2s',
                display: 'inline-block',
                pointerEvents: 'none'
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: 2,
                  left: soundEnabled ? 26 : 2,
                  width: 24,
                  height: 24,
                  background: '#fff',
                  borderRadius: '50%',
                  transition: 'left 0.2s',
                }}
              />
            </span>
          </label>
        </div>

        {/* Category Tabs */}
        <div style={{
          display: 'flex',
          gap: 8,
          marginBottom: 16,
          flexWrap: 'wrap',
          borderBottom: isDark ? '1px solid #444' : '1px solid #e5e7eb',
          paddingBottom: 8
        }}>
          {Object.keys(soundCategories).map((categoryKey) => (
            <button
              key={categoryKey}
              onClick={() => {
                setSoundCategory(categoryKey);
                if (categoryKey !== 'musical') {
                  setSelectedSound(null);
                }
              }}
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: 6,
                background: soundCategory === categoryKey
                  ? (isDark ? '#3a3a1a' : '#fef3c7')
                  : 'transparent',
                color: soundCategory === categoryKey
                  ? (isDark ? '#f59e0b' : '#ff6b35')
                  : (isDark ? '#9ca3af' : '#6b7280'),
                fontWeight: soundCategory === categoryKey ? 600 : 400,
                cursor: 'pointer',
                fontSize: 14,
                transition: 'all 0.2s',
                borderBottom: soundCategory === categoryKey ? `2px solid ${isDark ? '#f59e0b' : '#ff6b35'}` : '2px solid transparent'
              }}
            >
              <span style={{ marginRight: 6 }}>
                {soundCategories[categoryKey].icon}
              </span>
              {soundCategories[categoryKey].name}
            </button>
          ))}
        </div>

        {/* Musical Subcategory Selection */}
        {soundCategory === 'musical' && (
          <div style={{
            display: 'flex',
            gap: 8,
            marginBottom: 16,
            flexWrap: 'wrap'
          }}>
            {Object.keys(soundCategories.musical.subcategories).map((subKey) => {
              const subcat = soundCategories.musical.subcategories[subKey];
              return (
                <button
                  key={subKey}
                  onClick={() => {
                    setMusicalSubcategory(subKey);
                    setSelectedSound(null);
                  }}
                  style={{
                    padding: '8px 16px',
                    border: musicalSubcategory === subKey
                      ? `2px solid ${isDark ? '#f59e0b' : '#ff6b35'}`
                      : isDark ? '1px solid #444' : '1px solid #e5e7eb',
                    borderRadius: 6,
                    background: musicalSubcategory === subKey
                      ? (isDark ? '#3a3a1a' : '#fef3c7')
                      : (isDark ? '#2a2a2a' : '#fff'),
                    color: isDark ? '#f0f0f0' : '#333',
                    fontWeight: musicalSubcategory === subKey ? 600 : 400,
                    cursor: 'pointer',
                    fontSize: 14,
                    transition: 'all 0.2s'
                  }}
                >
                  <span style={{ marginRight: 6 }}>{subcat.icon}</span>
                  {subcat.name}
                </button>
              );
            })}
          </div>
        )}

        {/* Sound List */}
        <div style={{
          background: isDark ? '#2a2a2a' : '#fff',
          borderRadius: 8,
          border: isDark ? '1px solid #444' : '1px solid #e5e7eb',
          padding: 16,
          marginBottom: 16
        }}>
          {soundCategory === 'musical' ? (
            <div style={{ display: 'grid', gap: 12 }}>
              {soundCategories.musical.subcategories[musicalSubcategory]?.sounds.map((sound) => (
                <div
                  key={sound.id}
                  style={{
                    padding: '12px 16px',
                    border: selectedSound?.id === sound.id
                      ? `2px solid ${isDark ? '#f59e0b' : '#ff6b35'}`
                      : isDark ? '1px solid #444' : '1px solid #e5e7eb',
                    borderRadius: 6,
                    background: selectedSound?.id === sound.id
                      ? (isDark ? '#3a3a1a' : '#fef3c7')
                      : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s'
                  }}
                >
                  <span style={{
                    color: isDark ? '#f0f0f0' : '#333',
                    fontWeight: selectedSound?.id === sound.id ? 600 : 400
                  }}>
                    {sound.name}
                  </span>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playPreviewSound(sound);
                      }}
                      style={{
                        padding: '6px 12px',
                        border: 'none',
                        borderRadius: 4,
                        background: isDark ? '#444' : '#e5e7eb',
                        color: isDark ? '#f0f0f0' : '#333',
                        cursor: 'pointer',
                        fontSize: 12,
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = isDark ? '#555' : '#d1d5db';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = isDark ? '#444' : '#e5e7eb';
                      }}
                    >
                      🔊 Preview
                    </button>
                    <button
                      onClick={() => setSelectedSound(sound)}
                      style={{
                        padding: '6px 12px',
                        border: 'none',
                        borderRadius: 4,
                        background: selectedSound?.id === sound.id
                          ? (isDark ? '#f59e0b' : '#ff6b35')
                          : (isDark ? '#444' : '#e5e7eb'),
                        color: '#fff',
                        cursor: 'pointer',
                        fontSize: 12,
                        fontWeight: 600,
                        transition: 'all 0.2s'
                      }}
                    >
                      {selectedSound?.id === sound.id ? '✓ Selected' : 'Select'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 12 }}>
              {soundCategories[soundCategory]?.sounds.map((sound) => (
                <div
                  key={sound.id}
                  style={{
                    padding: '12px 16px',
                    border: selectedSound?.id === sound.id
                      ? `2px solid ${isDark ? '#f59e0b' : '#ff6b35'}`
                      : isDark ? '1px solid #444' : '1px solid #e5e7eb',
                    borderRadius: 6,
                    background: selectedSound?.id === sound.id
                      ? (isDark ? '#3a3a1a' : '#fef3c7')
                      : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s'
                  }}
                >
                  <span style={{
                    color: isDark ? '#f0f0f0' : '#333',
                    fontWeight: selectedSound?.id === sound.id ? 600 : 400
                  }}>
                    {sound.name}
                  </span>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playPreviewSound(sound);
                      }}
                      style={{
                        padding: '6px 12px',
                        border: 'none',
                        borderRadius: 4,
                        background: isDark ? '#444' : '#e5e7eb',
                        color: isDark ? '#f0f0f0' : '#333',
                        cursor: 'pointer',
                        fontSize: 12,
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = isDark ? '#555' : '#d1d5db';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = isDark ? '#444' : '#e5e7eb';
                      }}
                    >
                      🔊 Preview
                    </button>
                    <button
                      onClick={() => setSelectedSound(sound)}
                      style={{
                        padding: '6px 12px',
                        border: 'none',
                        borderRadius: 4,
                        background: selectedSound?.id === sound.id
                          ? (isDark ? '#f59e0b' : '#ff6b35')
                          : (isDark ? '#444' : '#e5e7eb'),
                        color: '#fff',
                        cursor: 'pointer',
                        fontSize: 12,
                        fontWeight: 600,
                        transition: 'all 0.2s'
                      }}
                    >
                      {selectedSound?.id === sound.id ? '✓ Selected' : 'Select'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Volume Control */}
        {selectedSound && (
          <div style={{
            background: isDark ? '#2a2a2a' : '#fff',
            borderRadius: 8,
            border: isDark ? '1px solid #444' : '1px solid #e5e7eb',
            padding: 16
          }}>
            <div style={{ marginBottom: 8 }}>
              <span style={{
                fontSize: 14,
                fontWeight: 600,
                color: isDark ? '#f0f0f0' : '#333',
                display: 'block',
                marginBottom: 12
              }}>
                Selected: {selectedSound.name}
              </span>
            </div>
            
            {/* Volume Control */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12
            }}>
              <span style={{
                fontSize: 18,
                minWidth: 30
              }}>
                🔊
              </span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                style={{
                  flex: 1,
                  height: 6,
                  borderRadius: 3,
                  outline: 'none',
                  background: isDark
                    ? `linear-gradient(to right, #f59e0b 0%, #f59e0b ${volume * 100}%, #444 ${volume * 100}%, #444 100%)`
                    : `linear-gradient(to right, #f59e0b 0%, #f59e0b ${volume * 100}%, #e5e7eb ${volume * 100}%, #e5e7eb 100%)`,
                  WebkitAppearance: 'none',
                  appearance: 'none',
                  cursor: 'pointer'
                }}
              />
              <span style={{
                fontSize: 14,
                color: isDark ? '#9ca3af' : '#6b7280',
                minWidth: 50,
                textAlign: 'right'
              }}>
                {Math.round(volume * 100)}%
              </span>
            </div>
          </div>
        )}

        {!selectedSound && (
          <p style={{
            padding: 12,
            background: isDark ? '#2a2a2a' : '#f3f4f6',
            borderRadius: 8,
            fontSize: 14,
            color: isDark ? '#9ca3af' : '#6b7280',
            textAlign: 'center',
            marginTop: 16
          }}>
            💡 Select a sound from the list above. It will play when you click buttons and links throughout the website.
          </p>
        )}
      </div>
    </div>
  );
};

export default Settings;