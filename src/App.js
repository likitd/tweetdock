import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Column from './components/Column';
import AddColumnModal from './components/AddColumnModal';
import TweetModal from './components/TweetModal';
import Navbar from './components/Navbar';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { simulateNewPosts } from './utils/dataSimulator';

function App() {
  // State to manage columns
  const [columns, setColumns] = useState([
    { id: 1, type: 'Home', posts: [] },
    { id: 2, type: 'Mentions', posts: [] },
  ]);
  
  // State for showing modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTweetModal, setShowTweetModal] = useState(false);
  
  // State for global search
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for navbar expansion
  const [isNavExpanded, setIsNavExpanded] = useState(true);
  
  // State for theme
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // State to track active column for mobile view
  const [activeColumnId, setActiveColumnId] = useState(null);
  
  // Use a ref to keep track of the latest columns state for the interval
  const columnsRef = useRef(columns);
  
  // Update the ref whenever columns change
  useEffect(() => {
    columnsRef.current = columns;
    
    // Set the first column as active by default if none is selected
    if (columns.length > 0 && activeColumnId === null) {
      setActiveColumnId(columns[0].id);
    }
  }, [columns, activeColumnId]);
  
  // Initialize with sample data on mount
  useEffect(() => {
    // Load initial data for each column
    const initialData = async () => {
      const updatedColumns = [...columns];
      
      for (let i = 0; i < updatedColumns.length; i++) {
        const column = updatedColumns[i];
        // Simulate fetching data for this column type
        const posts = await simulateNewPosts(column.type, 10);
        updatedColumns[i] = { ...column, posts };
      }
      
      setColumns(updatedColumns);
    };
    
    initialData();
    
    // Set up interval for real-time updates
    const interval = setInterval(() => {
      const updateColumns = async () => {
        // Get the current columns from the ref
        const currentColumns = columnsRef.current;
        
        const updatedColumns = await Promise.all(
          currentColumns.map(async (column) => {
            // Simulate getting 0-2 new posts every interval for ALL columns
            const newPosts = await simulateNewPosts(column.type, Math.floor(Math.random() * 3));
            return {
              ...column,
              posts: [...newPosts, ...(column.posts || [])].slice(0, 50) // Keep max 50 posts per column
            };
          })
        );
        setColumns(updatedColumns);
      };
      
      updateColumns();
    }, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, []); // Empty dependency array means this only runs once on mount
  
  // Handle adding a new column
  const handleAddColumn = (columnType) => {
    const newColumn = {
      id: Date.now(), // Use timestamp for unique ID
      type: columnType,
      posts: []
    };
    
    // Simulate fetching initial data for the new column
    simulateNewPosts(columnType, 10)
      .then(posts => {
        setColumns(prevColumns => [...prevColumns, { ...newColumn, posts }]);
      });
    
    setShowAddModal(false);
  };
  
  // Handle removing a column
  const handleRemoveColumn = (columnId) => {
    setColumns(prevColumns => prevColumns.filter(column => column.id !== columnId));
    
    // If the active column is removed, set a new active column
    if (columnId === activeColumnId && columns.length > 1) {
      const remainingColumns = columns.filter(column => column.id !== columnId);
      setActiveColumnId(remainingColumns[0].id);
    }
  };
  
  // Handle column reordering
  const moveColumn = (fromIndex, toIndex) => {
    setColumns(prevColumns => {
      const updatedColumns = [...prevColumns];
      const [movedColumn] = updatedColumns.splice(fromIndex, 1);
      updatedColumns.splice(toIndex, 0, movedColumn);
      return updatedColumns;
    });
  };
  
  // Handle post interaction (like, retweet)
  const handlePostInteraction = (columnId, postId, action) => {
    setColumns(prevColumns => prevColumns.map(column => {
      if (column.id !== columnId) return column;
      
      return {
        ...column,
        posts: (column.posts || []).map(post => {
          if (post.id !== postId) return post;
          
          if (action === 'like') {
            return { ...post, likes: post.likes + 1, liked: true };
          } else if (action === 'retweet') {
            return { ...post, retweets: post.retweets + 1, retweeted: true };
          }
          return post;
        })
      };
    }));
  };
  
  // Handle tweet submission
  const handleTweetSubmit = (content) => {
    // Create a new tweet post
    const newTweet = {
      id: Date.now(),
      user: {
        username: 'currentuser',
        displayName: 'Current User',
        profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg'
      },
      content,
      timestamp: new Date(),
      likes: 0,
      retweets: 0,
      liked: false,
      retweeted: false
    };
    
    // Add to Home column
    setColumns(prevColumns => prevColumns.map(column => {
      if (column.type === 'Home') {
        return {
          ...column,
          posts: [newTweet, ...(column.posts || [])]
        };
      }
      return column;
    }));
    
    // Close modal
    setShowTweetModal(false);
  };
  
  // Navigate to a specific column (especially useful for mobile)
  const navigateToColumn = (columnId) => {
    setActiveColumnId(columnId);
  };
  
  // Toggle navbar expansion
  const toggleNavExpansion = () => {
    setIsNavExpanded(!isNavExpanded);
  };
  
  // Toggle theme
  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };
  
  // Apply theme class to the body element
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [isDarkMode]);
  
  // Save columns and theme preference to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('dashboard-columns', JSON.stringify(columns));
    localStorage.setItem('dashboard-theme', JSON.stringify({ isDarkMode }));
  }, [columns, isDarkMode]);
  
  // Load columns and theme preference from localStorage on initial load
  useEffect(() => {
    const savedColumns = localStorage.getItem('dashboard-columns');
    if (savedColumns) {
      try {
        const parsedColumns = JSON.parse(savedColumns);
        setColumns(parsedColumns);
      } catch (error) {
        console.error('Error parsing saved columns:', error);
      }
    }
    
    const savedTheme = localStorage.getItem('dashboard-theme');
    if (savedTheme) {
      try {
        const { isDarkMode: savedDarkMode } = JSON.parse(savedTheme);
        setIsDarkMode(savedDarkMode);
      } catch (error) {
        console.error('Error parsing saved theme:', error);
      }
    }
  }, []);
  
  return (
    <DndProvider backend={HTML5Backend}>
      <div className={`app-container ${isNavExpanded ? 'nav-expanded' : 'nav-collapsed'} ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
        <Navbar 
          columns={columns}
          isExpanded={isNavExpanded}
          onToggleExpansion={toggleNavExpansion}
          onAddColumn={() => setShowAddModal(true)}
          onSearch={setSearchTerm}
          searchTerm={searchTerm}
          onNavigate={navigateToColumn}
          activeColumnId={activeColumnId}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
          onTweetClick={() => setShowTweetModal(true)}
        />
        
        <div className="main-content">
          <header className="app-header">
            <h1>Social Media Dashboard</h1>
            <div className="mobile-menu-toggle" onClick={toggleNavExpansion}>
              {isNavExpanded ? '«' : '»'}
            </div>
          </header>
          
          <main className="columns-container">
            {columns.map((column, index) => (
              <Column
                key={column.id}
                column={column}
                index={index}
                searchTerm={searchTerm}
                onRemove={handleRemoveColumn}
                onMove={moveColumn}
                onInteraction={handlePostInteraction}
                isActive={column.id === activeColumnId}
              />
            ))}
          </main>
        </div>
        
        {showAddModal && (
          <AddColumnModal
            onClose={() => setShowAddModal(false)}
            onAdd={handleAddColumn}
          />
        )}
        
        {showTweetModal && (
          <TweetModal
            onClose={() => setShowTweetModal(false)}
            onTweet={handleTweetSubmit}
          />
        )}
      </div>
    </DndProvider>
  );
}

export default App;