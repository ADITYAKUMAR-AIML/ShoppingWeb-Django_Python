import React, { useEffect, useState } from 'react';

const Settings = () => {
  const getInitial = () => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return document.body.classList.contains('dark-mode');
  };

  const [isDark, setIsDark] = useState(getInitial);

  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <div className="settings-page" style={{ maxWidth: 720, margin: '32px auto', padding: 16 }}>
      <h1 style={{ marginBottom: 16 }}>Settings</h1>
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
  );
};

export default Settings;