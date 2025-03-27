


import React, { useState } from 'react'; // Importing React and useState hook for state management

// TweetModal component receives two props: onClose (to close the modal) and onTweet (to submit a tweet)
const TweetModal = ({ onClose, onTweet }) => {
  // State to store the tweet content
  const [tweetContent, setTweetContent] = useState('');

  // Maximum character limit for a tweet
  const maxLength = 280;
  
  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    
    // Check if the tweet has content before submitting
    if (tweetContent.trim().length > 0) {
      onTweet(tweetContent); // Call the onTweet function with the tweet content
      setTweetContent(''); // Clear the tweet content after submission
    }
  };
  
  return (
    // Modal overlay to darken the background and focus attention on the modal
    <div className="modal-overlay">
      <div className="modal tweet-modal">
        {/* Modal header containing the title and close button */}
        <div className="modal-header">
          <h3>Compose Tweet</h3>
          <button className="close-btn" onClick={onClose}>&times;</button> {/* Close button */}
        </div>
        
        {/* Form for composing and submitting a tweet */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            {/* Textarea for tweet input */}
            <textarea
              placeholder="What's happening?" // Placeholder text for guidance
              value={tweetContent} // Controlled component bound to state
              onChange={(e) => setTweetContent(e.target.value)} // Update state on input change
              maxLength={maxLength} // Restrict input to maxLength characters
              className="tweet-textarea"
              rows={4} // Set number of visible text rows
            />
            {/* Character count display */}
            <div className="character-count">
              {maxLength - tweetContent.length} characters remaining
            </div>
          </div>
          
          {/* Modal footer with action buttons */}
          <div className="modal-footer">
            {/* Cancel button to close the modal */}
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            {/* Tweet button, disabled if tweet content is empty */}
            <button 
              type="submit" 
              className="tweet-btn"
              disabled={tweetContent.trim().length === 0} // Disable if no text
            >
              Tweet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TweetModal; // Export the TweetModal component
