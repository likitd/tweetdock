

import React, { useState } from 'react'; // Importing React and useState hook for managing state

// AddColumnModal component receives two props: 
// - onClose (to close the modal) 
// - onAdd (to add a new column of selected type)
const AddColumnModal = ({ onClose, onAdd }) => {
  // State to store the selected column type, initialized to 'Home'
  const [selectedType, setSelectedType] = useState('Home');
  
  // List of available column types
  const columnTypes = ['Home', 'Mentions', 'Search', 'Lists', 'Trending', 'Bookmarks'];
  
  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents default form submission behavior
    onAdd(selectedType); // Calls the onAdd function with the selected column type
  };
  
  return (
    // Modal overlay to darken the background and focus attention on the modal
    <div className="modal-overlay">
      <div className="modal">
        {/* Modal header containing the title and close button */}
        <div className="modal-header">
          <h3>Add New Column</h3>
          <button className="close-btn" onClick={onClose}>&times;</button> {/* Close button */}
        </div>
        
        {/* Form for selecting a column type and adding a new column */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="column-type">Column Type:</label>
            {/* Dropdown (select) input for choosing the column type */}
            <select 
              id="column-type"
              value={selectedType} // Controlled component bound to state
              onChange={(e) => setSelectedType(e.target.value)} // Update state on selection change
            >
              {/* Mapping through columnTypes array to create dropdown options */}
              {columnTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          {/* Modal footer with action buttons */}
          <div className="modal-footer">
            {/* Cancel button to close the modal */}
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            {/* Add Column button to submit the selected column type */}
            <button type="submit" className="add-btn">
              Add Column
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddColumnModal; // Exporting the AddColumnModal component
