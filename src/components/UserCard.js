import React from 'react';
import './UserCard.css';

const UserCard = ({ user, onViewMore }) => {
  return (
    <div className="user-card">
      <div className="user-avatar">
        <img 
          src={user.avatar} 
          alt={`${user.firstname} ${user.lastname}`}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/150x150?text=No+Image';
          }}
        />
      </div>
      <h3 className="user-name">{user.firstname} {user.lastname}</h3>
      <p className="user-role">{user.role}</p>
      <p className="user-description">
        {user.description.length > 100 
          ? `${user.description.substring(0, 100)}...` 
          : user.description
        }
      </p>
      <button 
        className="view-more-btn" 
        onClick={() => onViewMore(user)}
      >
        View More
      </button>
    </div>
  );
};

export default UserCard;
