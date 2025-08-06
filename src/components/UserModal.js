import React from 'react';
import './UserModal.css';

const UserModal = ({ user, isOpen, onClose }) => {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!isOpen || !user) return null;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          &times;
        </button>

        <div className="modal-header">
          <div className="modal-avatar">
            <img
              src={user.avatar}
              alt={`${user.firstname} ${user.lastname}`}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/150x150?text=No+Image';
              }}
            />
          </div>
          <div className="modal-user-info">
            <h2>{user.firstname} {user.lastname}</h2>
            <p className="modal-role">{user.role}</p>
            <p className="modal-join-date">Joined: {user.join_date}</p>
          </div>
        </div>

        <div className="modal-body">
          <h3>About</h3>
          <p className="modal-description">{user.description}</p>

          <div className="modal-details">
            <div className="detail-item">
              <strong>Email:</strong> {user.email}
            </div>
            <div className="detail-item">
              <strong>Username:</strong> {user.username}
            </div>
            <div className="detail-item">
              <strong>Employee ID:</strong> {user.id}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
