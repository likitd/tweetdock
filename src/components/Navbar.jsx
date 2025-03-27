

import React, { useState } from 'react'; // Importing React and useState for state management
import ThemeToggle from './ThemeToggle'; // Importing the ThemeToggle component

// Navbar component: Handles navigation, search, column management, and theme toggling
const Navbar = ({  
  columns, // Array of columns
  isExpanded, // Boolean indicating if the sidebar is expanded
  onToggleExpansion, // Function to toggle sidebar expansion
  onAddColumn, // Function to add a new column
  onSearch, // Function to handle search input
  searchTerm, // Search term value
  onNavigate, // Function to navigate to a column
  activeColumnId, // ID of the currently active column
  isDarkMode, // Boolean indicating if dark mode is enabled
  onToggleTheme, // Function to toggle the theme
  onTweetClick // Function to handle the tweet button click
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false); // State for toggling the user menu

  return (
    // Navbar container with conditional class based on expansion state
    <div className={`navbar ${isExpanded ? 'expanded' : 'collapsed'}`}> 
      <div className="navbar-header">
        {/* Logo with dynamic text based on expansion state */}
        <div className="logo">
          {isExpanded ? 'Dashboard' : 'D'}
        </div>
        {/* Toggle button for sidebar expansion */}
        <button className="toggle-btn" onClick={onToggleExpansion}>
          {isExpanded ? '«' : '»'}
        </button>
      </div>
      
      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder={isExpanded ? "Search all columns..." : "🔍"}
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)} // Calls onSearch function with user input
          className="search-input"
        />
      </div>
      
      {/* Navigation Menu for selecting columns */}
      <nav className="navigation">
        <ul>
          {columns.map((column) => (
            <li 
              key={column.id} 
              className={column.id === activeColumnId ? 'active' : ''}
              onClick={() => onNavigate(column.id)} // Calls onNavigate function with the selected column's ID
            >
              <span className="icon">
                {getIconForColumnType(column.type)}
              </span>
              {/* Displays column name only if expanded */}
              {isExpanded && <span className="label">{column.type}</span>}
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Footer containing tweet button, add column button, and user settings */}
      <div className="navbar-footer">
        {/* Tweet button */}
        <button 
          className="tweet-btn-nav"
          onClick={onTweetClick} // Calls the tweet button handler
        >
          <span className="icon">✏️</span>
          {isExpanded && <span className="label">Tweet</span>}
        </button>
        
        {/* Add Column button */}
        <button 
          className="add-column-btn"
          onClick={onAddColumn} // Calls the function to add a new column
        >
          <span className="icon">+</span>
          {isExpanded && <span className="label">Add Column</span>}
        </button>
        
        {/* Theme toggle (only visible when expanded) */}
        {isExpanded && (
          <div className="theme-toggle-wrapper">
            <ThemeToggle 
              isDarkMode={isDarkMode}
              onToggle={onToggleTheme} // Calls function to toggle theme
            />
          </div>
        )}
        
        {/* User Account Section */}
        <div className="user-section">
          <div 
            className="user-avatar" 
            onClick={() => setShowUserMenu(!showUserMenu)} // Toggles user menu visibility
          >
            <span className="icon">👤</span>
            {isExpanded && <span className="label">Account</span>}
          </div>
          
          {/* User menu dropdown (only visible when expanded) */}
          {showUserMenu && isExpanded && (
            <div className="user-menu">
              <ul>
                <li>Profile</li>
                <li>Settings</li>
                <li>Logout</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function to determine icon based on column type
const getIconForColumnType = (type) => {
  switch (type) {
    case 'Home':
      return '🏠';
    case 'Mentions':
      return '@';
    case 'Search':
      return '🔍';
    case 'Lists':
      return '📋';
    case 'Trending':
      return '📈';
    case 'Bookmarks':
      return '🔖';
    default:
      return '#';
  }
};

export default Navbar; // Exporting the Navbar component
