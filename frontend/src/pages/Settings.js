import React, { useEffect, useState } from 'react';

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
    </div>
  );
};

export default Settings;