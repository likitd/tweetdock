

import React, { useState } from 'react'; // Importing React and the useState hook for state management
import Post from './Post'; // Importing the Post component
import { useDrag, useDrop } from 'react-dnd'; // Importing drag-and-drop hooks from react-dnd

// Column component represents an individual feed column in the UI
// Props:
// - column: Object containing column data (type, posts, id)
// - index: Position of the column in the list (for drag-and-drop)
// - searchTerm: Global search term used to filter posts
// - onRemove: Function to remove the column
// - onMove: Function to handle column reordering
// - onInteraction: Function to handle interactions with posts
// - isActive: Boolean indicating whether this column is currently active
const Column = ({ column, index, searchTerm, onRemove, onMove, onInteraction, isActive }) => {
  // State to manage column-specific filtering input
  const [columnFilter, setColumnFilter] = useState('');

  // Set up drag functionality using react-dnd
  const [{ isDragging }, drag] = useDrag({
    type: 'COLUMN', // Identifies the draggable type as "COLUMN"
    item: { index }, // Stores the column's index to track its position
    collect: (monitor) => ({
      isDragging: monitor.isDragging(), // Tracks if the column is being dragged
    }),
  });

  // Set up drop functionality to allow reordering of columns
  const [, drop] = useDrop({
    accept: 'COLUMN', // Accepts only draggable items of type "COLUMN"
    hover(item) {
      if (item.index !== index) {
        onMove(item.index, index); // Calls the function to move the column
        item.index = index; // Updates the item's index after moving
      }
    },
  });

  // Ensure posts is always an array, even if column.posts is undefined
  const posts = column.posts || [];

  // Filters posts based on global search term and column-specific filter
  const filteredPosts = posts.filter(post => {
    // Check if the post matches the global search term
    const matchesSearch =
      searchTerm === '' ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.user.username.toLowerCase().includes(searchTerm.toLowerCase());

    // Check if the post matches the column-specific filter
    const matchesColumnFilter =
      columnFilter === '' ||
      post.content.toLowerCase().includes(columnFilter.toLowerCase()) ||
      post.user.username.toLowerCase().includes(columnFilter.toLowerCase());

    return matchesSearch && matchesColumnFilter; // Both conditions must be true
  });

  return (
    // Apply both drag and drop functionality to the column
    <div 
      ref={node => drag(drop(node))} // Connects drag-and-drop hooks to the DOM node
      className={`column ${isDragging ? 'dragging' : ''} ${isActive ? 'active-column' : ''}`} // Dynamically applies classes
      style={{ opacity: isDragging ? 0.5 : 1 }} // Reduces opacity while dragging
    >
      {/* Column header containing the title, filter input, and remove button */}
      <div className="column-header">
        <h2>{column.type}</h2> {/* Displays column type as a title */}
        <div className="column-controls">
          {/* Input for column-specific filtering */}
          <input
            type="text"
            placeholder={`Filter ${column.type}...`}
            value={columnFilter}
            onChange={(e) => setColumnFilter(e.target.value)} // Updates state on input change
            className="column-filter"
          />
          {/* Button to remove the column */}
          <button 
            className="remove-column-btn"
            onClick={() => onRemove(column.id)} // Calls the onRemove function with column ID
          >
            &times;
          </button>
        </div>
      </div>
      
      {/* Container for displaying filtered posts */}
      <div className="posts-container">
        {filteredPosts.length > 0 ? (
          // Render posts if available
          filteredPosts.map(post => (
            <Post
              key={post.id}
              post={post}
              onInteraction={(postId, action) => onInteraction(column.id, postId, action)} // Handles interactions with posts
            />
          ))
        ) : (
          // Display message if no posts match the filters
          <div className="no-posts">No posts found</div>
        )}
      </div>
    </div>
  );
};

export default Column; // Exporting the Column component
