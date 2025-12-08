import React, { useState, useEffect } from 'react';
import './DoctorsChatScreen.css';
import useUser from '../hooks/useUser';
import MessagesContent from '../components/content/MessagesContent'; // Import the good component

// Main application component
const DoctorsChatScreen = () => {
    const { user, loading } = useUser(); // The currently logged-in user
    const [users, setUsers] = useState([]); // The list of all other users
    const [selectedUser, setSelectedUser] = useState(null); // The user selected from the sidebar

    // Effect to fetch all users to display in the sidebar
    useEffect(() => {
        const fetchUsers = async () => {
            if (user?.id) {
                const result = await window.electronAPI.getAllUsers();
                if (result.success) {
                    // Filter out the current user from the list
                    setUsers(result.users.filter(u => u.id !== user.id));
                }
            }
        };

        fetchUsers();
    }, [user?.id]);

    // Show a loading screen while the user is being authenticated.
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center text-gray-500">
                    <i className="fas fa-spinner fa-spin text-4xl mb-4"></i>
                    <h2 className="text-xl">Loading User...</h2>
                </div>
            </div>
        );
    }


    return (
        <div className="app-container">
            {/* The header remains the same */}
            <header className="app-header">
                <div className="header-content">
                    <div className="logo">
                        <i className="fas fa-eye"></i>
                        <h1>KORENE EYE CLINIC</h1>
                    </div>
                    <div className="user-info">
                        <img
                            src="https://via.placeholder.com/30"
                            alt="Admin Avatar Placeholder"
                            className="avatar"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://placehold.co/30x30/3742fa/ffffff?text=A';
                            }}
                        />
                        <span>{user ? user.name : '...'}</span>
                    </div>
                </div>
            </header>

            <div className="main-content-wrapper">
                {/* Sidebar for user selection */}
                <nav className="sidebar">
                    <ul className="nav-menu">
                        {users.map(u => (
                            <li key={u.id} className={`nav-item ${selectedUser && selectedUser.id === u.id ? 'active' : ''}`} onClick={() => setSelectedUser(u)}>
                                <a href="#" className="nav-link" onClick={(e) => e.preventDefault()}>
                                    <i className="fas fa-user"></i>
                                    <span>{u.name || `${u.first_name} ${u.last_name}`}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                <main className="content-area">
                    {/* Conditionally render MessagesContent or a placeholder */}
                    {selectedUser ? (
                        <MessagesContent key={selectedUser.id} currentUser={user} otherUser={selectedUser} />
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center text-gray-500">
                                <i className="fas fa-comments text-4xl mb-4"></i>
                                <h2 className="text-xl">Select a user to start a conversation</h2>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default DoctorsChatScreen;
