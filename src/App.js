import React, { useState, useEffect } from 'react';
import './App.css';
import UserCard from './components/UserCard';
import UserModal from './components/UserModal';
import LoadingSpinner from './components/LoadingSpinner';
import userService from './services/userService';

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedUsers = await userService.getUsers();
      setUsers(fetchedUsers);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleViewMore = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Our Team</h1>
        <p>Meet the amazing people who make our organization great</p>
      </header>
      
      <main className="App-main">
        {loading && <LoadingSpinner message="Loading team members..." />}
        
        {error && (
          <div className="error-container">
            <div className="error-message">
              <h3>Oops! Something went wrong</h3>
              <p>{error}</p>
              <button className="retry-button" onClick={fetchUsers}>
                Try Again
              </button>
            </div>
          </div>
        )}
        
        {!loading && !error && users.length > 0 && (
          <div className="users-grid">
            {users.map(user => (
              <UserCard 
                key={user.id} 
                user={user} 
                onViewMore={handleViewMore}
              />
            ))}
          </div>
        )}
        
        {!loading && !error && users.length === 0 && (
          <div className="no-users">
            <h3>No team members found</h3>
            <p>There are currently no team members to display.</p>
          </div>
        )}
      </main>
      
      <UserModal 
        user={selectedUser}
        isOpen={modalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export default App;
