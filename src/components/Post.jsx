

import React from 'react';
import { formatDistance } from 'date-fns';

const Post = ({ post, onInteraction }) => {
  // Calculate relative time from the post's timestamp (e.g., "5 minutes ago")
  const timeAgo = formatDistance(new Date(post.timestamp), new Date(), { addSuffix: true });
  
  return (
    <div className="post">
      {/* User Info Section */}
      <div className="post-user">
        <img 
          src={post.user.profilePicture} 
          alt={`${post.user.username}'s profile`} 
          className="profile-picture"
        />
        <div className="user-info">
          <span className="user-name">{post.user.displayName}</span>
          <span className="user-handle">@{post.user.username}</span>
        </div>
        <span className="post-time">{timeAgo}</span>
      </div>
      
      {/* Post Content */}
      <div className="post-content">
        {post.content}
      </div>
      
      {/* Post Actions (Like & Retweet) */}
      <div className="post-actions">
        <button 
          className={`action-btn like-btn ${post.liked ? 'active' : ''}`}
          onClick={() => onInteraction(post.id, 'like')}
        >
          <span className="icon">♥</span>
          <span className="count">{post.likes}</span>
        </button>
        
        <button 
          className={`action-btn retweet-btn ${post.retweeted ? 'active' : ''}`}
          onClick={() => onInteraction(post.id, 'retweet')}
        >
          <span className="icon">↻</span>
          <span className="count">{post.retweets}</span>
        </button>
      </div>
    </div>
  );
};

export default Post;
