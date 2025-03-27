

import React from 'react';

/**
 * ThemeToggle Component
 * This component provides a toggle switch to switch between light mode and dark mode.
 * It displays sun and moon icons to visually indicate the theme state.
 *
 * Props:
 * @param {boolean} isDarkMode - Determines whether dark mode is enabled.
 * @param {function} onToggle - Function to toggle the theme mode when the switch is clicked.
 */
const ThemeToggle = ({ isDarkMode, onToggle }) => {
  return (
    // Wrapper div for theme toggle switch
    <div className="theme-toggle-container">

      {/* Sun icon representing light mode */}
      <span className="theme-icon light">☀️</span>

      {/* Toggle switch label for accessibility */}
      <label className="switch">
        {/* Input checkbox acting as a toggle switch */}
        <input 
          type="checkbox" 
          checked={isDarkMode} // Controls the checked state based on the `isDarkMode` prop
          onChange={onToggle} // Calls `onToggle` function to change the theme when toggled
        />
        {/* Visual representation of the slider switch */}
        <span className="slider round"></span>
      </label>

      {/* Moon icon representing dark mode */}
      <span className="theme-icon dark">🌙</span>
      
    </div>
  );
};

export default ThemeToggle;
