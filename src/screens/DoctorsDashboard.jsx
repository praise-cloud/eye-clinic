import React, { useState } from 'react';

// Mock Patient Data
const MOCK_PATIENTS = [
    { id: 1, name: "Ammar", date: "25/01/2024", case: "Retinal Detachment", phone: "+0123456789", email: "ammar@gmail.com" },
    { id: 2, name: "Abdullah", date: "24/01/2024", case: "Cataract Surgery Follow-up", phone: "+0123456789", email: "abdullah@gmail.com" },
    { id: 3, name: "Alia", date: "13/01/2024", case: "Acute Glaucoma Attack", phone: "+0123456789", email: "ali@gmail.com" },
    { id: 4, name: "Khan", date: "25/01/2024", case: "Diabetic Retinopathy Check", phone: "+0123456789", email: "khan@gmail.com" },
    { id: 5, name: "Sarah", date: "22/01/2024", case: "Routine Eye Exam", phone: "+0123456789", email: "sarah@gmail.com" },
    { id: 6, name: "Jamal", date: "21/01/2024", case: "Severe Dry Eye Syndrome", phone: "+0123456789", email: "jamal@gmail.com" },
    // Repeat for table length
    { id: 7, name: "Farah", date: "20/01/2024", case: "Lens Prescription Update", phone: "+0123456789", email: "farah@gmail.com" },
    { id: 8, name: "Hassan", date: "19/01/2024", case: "Corneal Abrasion", phone: "+0123456789", email: "hassan@gmail.com" },
];

// Reusable Navigation Item Component
const NavItem = ({ icon, label, isActive, onClick }) => (
    <li className={`nav-item ${isActive ? 'active' : ''}`} onClick={onClick}>
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a href="#" className="nav-link">
            <i className={`fas ${icon}`}></i> <span>{label}</span>
        </a>
    </li>
);

// Navigation Menu Component (Sidebar)
const NavMenu = ({ isOpen, toggleSidebar }) => {
    const navItems = [
        { icon: "fa-th-large", label: "Dashboard", isActive: true },
        { icon: "fa-users", label: "Patients", isActive: false },
        { icon: "fa-envelope", label: "Messages", isActive: false },
        { icon: "fa-clipboard-check", label: "Tests", isActive: false },
        { icon: "fa-box-open", label: "Inventory", isActive: false },
        { icon: "fa-chart-bar", label: "Reports", isActive: false },
        { icon: "fa-cog", label: "Settings", isActive: false },
        { icon: "fa-sign-out-alt", label: "Logout", isActive: false, isLogout: true },
    ];

    return (
        <nav className={`sidebar ${isOpen ? 'open' : ''}`}>
            <ul className="nav-menu">
                {navItems.map((item) => (
                    <NavItem 
                        key={item.label} 
                        icon={item.icon} 
                        label={item.label} 
                        isActive={item.isActive} 
                        onClick={toggleSidebar} // Close sidebar on click (mobile UX)
                    />
                ))}
            </ul>
        </nav>
    );
};

// Main App Component
const App = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [patients] = useState(MOCK_PATIENTS);
    const [adminName] = useState("Dr. Emily Carter");
    const [doctorName] = useState("Doctor John Doe");

    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
    };

    return (
        <div className="app-container">
            {/* Font Awesome 6.5.1 and Poppins Font - Required by the original HTML */}
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
            
            {/* Embedded CSS Styles */}
            <style jsx="true">{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

                :root {
                    /* Primary Colors */
                    --primary-color: #3742fa;
                    --secondary-color: #6c757d;
                    --text-color: #2c3e50;
                    --border-color: #dee2e6;
                    --bg-light: #f5f6fa;
                    --bg-white: #ffffff;
                    --accent-color: #ffd700; /* Yellow accent */
                    --danger-color: #dc3545;

                    /* Sidebar Specific */
                    --sidebar-bg: #764ba2; /* Darker Purple */
                    --sidebar-text: #bdc3c7;
                    --sidebar-active-bg: #4a5dff; /* Lighter Blue/Purple */
                    
                    /* Header Specific */
                    --header-bg: linear-gradient(135deg, #667eea 0%, #764ba2 100%); /* Blue-to-Purple Gradient */
                }

                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    font-family: 'Poppins', sans-serif;
                }
                
                html, body, #root {
                    height: 100%;
                    overflow: hidden; 
                    background-color: var(--bg-light);
                }

                .app-container {
                    height: 100vh;
                    display: flex;
                    flex-direction: column; 
                }

                .main-content-wrapper {
                    display: flex;
                    flex: 1; 
                    overflow: hidden; 
                }

                /* -----------------------------------------------------
                 * Header Styling
                 * ----------------------------------------------------- */
                .app-header {
                    background: var(--header-bg);
                    color: white;
                    padding: 1rem 2rem;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.15);
                    z-index: 1000;
                }

                .header-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    max-width: 1400px;
                    margin: 0 auto;
                }
                
                .menu-toggle {
                    display: none; /* Hidden by default on desktop */
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: var(--accent-color);
                    transition: color 0.2s;
                }

                .logo {
                    display: flex; 
                    align-items: center; 
                    gap: 10px; 
                }

                .logo i {
                    font-size: 2rem;
                    color: var(--accent-color);
                }

                .logo h1 {
                    font-size: 1.5rem;
                    font-weight: 600;
                    text-transform: uppercase;
                }

                .user-info {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: white; 
                    font-weight: 500;
                    padding: 0.25rem 0.5rem;
                    border-radius: 9999px;
                    background-color: rgba(255, 255, 255, 0.1);
                    transition: background-color 0.3s;
                }
                .user-info:hover {
                    background-color: rgba(255, 255, 255, 0.2);
                }

                .user-info .avatar {
                    width: 35px;
                    height: 35px;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 2px solid var(--accent-color);
                }

                /* -----------------------------------------------------
                 * Sidebar Styling
                 * ----------------------------------------------------- */
                .sidebar {
                    width: 250px;
                    background-color: var(--sidebar-bg);
                    color: white;
                    height: 100%; 
                    overflow-y: auto;
                    box-shadow: 2px 0 10px rgba(0,0,0,0.1);
                    flex-shrink: 0; /* Prevent sidebar from shrinking */
                }

                .nav-menu {
                    list-style: none;
                    padding: 1.5rem 0;
                }

                .nav-link{
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem 1.5rem;
                    color: var(--sidebar-text);
                    text-decoration: none;
                    transition: all 0.3s ease;
                    border-left: 5px solid transparent;
                }

                .nav-link:hover {
                    background-color: rgba(255, 255, 255, 0.1);
                    color: white;
                    border-left-color: var(--accent-color);
                }

                .nav-item.active .nav-link {
                    background-color: var(--sidebar-active-bg);
                    color: white;
                    border-left-color: var(--accent-color);
                    font-weight: 600;
                }

                .nav-link i {
                    font-size: 1.2rem;
                    width: 25px; /* Fixed width for icon alignment */
                }

                /* -----------------------------------------------------
                 * Main Content Area and Dashboard Widgets
                 * ----------------------------------------------------- */
                .content-area {
                    flex: 1; 
                    padding: 2rem;
                    overflow-y: auto;
                    background-color: var(--bg-light);
                    display: grid;
                    gap: 1.5rem;
                    align-content: start; /* Align content to the top */
                }

                .greeting {
                    margin-bottom: 1.5rem;
                }

                .greeting h2 {
                    font-size: 2rem;
                    font-weight: 700;
                    color: var(--text-color);
                }

                .greeting p {
                    font-size: 1.1rem;
                    color: var(--secondary-color);
                }

                .widget-card {
                    background-color: var(--bg-white);
                    border-radius: 12px;
                    padding: 2rem;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
                    min-height: 500px;
                }

                .widget-card h3 {
                    font-size: 1.5rem;
                    font-weight: 600;
                    margin-bottom: 1.5rem;
                    color: var(--primary-color);
                }

                /* Filter Bar Styles */
                .filter-bar {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                    flex-wrap: wrap; /* Allows wrapping on smaller screens */
                }

                .search-input-group {
                    display: flex;
                    flex-grow: 1;
                    max-width: 400px;
                }

                .search-input-group input {
                    flex-grow: 1;
                    padding: 0.75rem 1rem;
                    border: 1px solid var(--border-color);
                    border-radius: 8px 0 0 8px;
                    outline: none;
                    transition: border-color 0.2s;
                }
                .search-input-group input:focus {
                    border-color: var(--primary-color);
                }

                .filter-bar button {
                    background-color: var(--primary-color);
                    color: white;
                    border: none;
                    padding: 0.75rem 1.25rem;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 500;
                    transition: background-color 0.2s, transform 0.1s;
                }

                .search-input-group button {
                    background-color: var(--primary-color);
                    border-radius: 0 8px 8px 0;
                    padding: 0.75rem 1.25rem;
                }

                .filter-bar button:hover {
                    background-color: #2b35c0;
                    transform: translateY(-1px);
                }

                /* Table Styles */
                .table-responsive {
                    overflow-x: auto;
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                }

                .patient-table {
                    width: 100%;
                    border-collapse: collapse;
                    background-color: var(--bg-white);
                    min-width: 700px; /* Ensure minimum width for desktop view */
                }

                .patient-table th, .patient-table td {
                    text-align: left;
                    padding: 1rem;
                    border-bottom: 1px solid var(--border-color);
                }

                .patient-table thead {
                    background-color: #f7f9fc;
                    color: var(--text-color);
                }

                .patient-table th {
                    font-weight: 600;
                    text-transform: uppercase;
                    font-size: 0.8rem;
                }

                .patient-table tbody tr:hover {
                    background-color: #fafafa;
                }

                .action-icons i {
                    color: var(--secondary-color);
                    margin-right: 15px;
                    cursor: pointer;
                    transition: color 0.2s;
                }

                .action-icons i:hover {
                    color: var(--primary-color);
                }

                /* -----------------------------------------------------
                 * Responsive Media Queries
                 * ----------------------------------------------------- */
                /* Tablet & Smaller Desktop */
                @media (max-width: 1024px) {
                    .sidebar {
                        width: 80px;
                        padding: 15px 0;
                    }
                    .nav-link {
                        justify-content: center;
                        padding: 15px 0;
                        border-left: none; /* Remove left border */
                        border-right: 5px solid transparent; /* Add right border for active indicator */
                    }
                    .nav-link span { 
                        display: none; 
                    } 
                    .nav-item.active .nav-link,
                    .nav-link:hover {
                        border-right-color: var(--accent-color);
                        border-left: none;
                    }
                }

                /* Mobile View */
                @media (max-width: 768px) {
                    .app-header {
                        padding: 0.75rem 1rem;
                    }

                    .logo h1 {
                        font-size: 1.3rem;
                    }

                    .menu-toggle {
                        display: block; /* Show menu button */
                    }

                    .header-content {
                        justify-content: space-between;
                    }
                    
                    /* Sidebar sliding mechanism for mobile */
                    .sidebar {
                        position: fixed;
                        top: 0;
                        left: -250px; 
                        width: 250px;
                        z-index: 1010;
                        transition: left 0.3s ease;
                        box-shadow: 5px 0 15px rgba(0,0,0,0.4);
                        overflow-y: auto;
                    }
                    .sidebar.open {
                        left: 0; 
                    }
                    
                    /* Restore full text and alignment when sidebar is open */
                    .nav-link span { 
                        display: inline;
                    }
                    .nav-link {
                        justify-content: flex-start;
                        border-right: none !important; 
                        border-left: 5px solid transparent; 
                    }
                    .nav-item.active .nav-link,
                    .nav-link:hover {
                        border-left-color: var(--accent-color);
                    }

                    .content-area {
                        padding: 1rem;
                    }
                    .widget-card {
                        padding: 1rem;
                    }
                    .greeting h2 {
                        font-size: 1.5rem;
                    }
                    .filter-bar {
                        flex-direction: column;
                    }
                    .search-input-group {
                        max-width: 100%;
                    }
                    .filter-bar button {
                        width: 100%;
                        border-radius: 8px;
                    }
                }
            `}</style>
            
            <header className="app-header">
                <div className="header-content">
                    {/* Menu Toggle button (Visible on mobile) */}
                    <div className="menu-toggle" onClick={toggleSidebar}>
                        <i className={`fas ${isSidebarOpen ? 'fa-times' : 'fa-bars'}`}></i>
                    </div>

                    <div className="logo">
                        <i className="fas fa-eye"></i>
                        <h1>KORENE EYE CLINIC</h1>
                    </div>
                    
                    <div className="user-info">
                        <img src="https://placehold.co/35x35/4a5dff/ffffff?text=AD" alt="Admin Avatar" className="avatar" /> 
                        <span>{adminName}</span>
                    </div>
                </div>
            </header>

            <div className="main-content-wrapper">
                {/* Sidebar Navigation */}
                <NavMenu isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

                <main className="content-area">
                    <div className="greeting">
                        <h2>Good day</h2>
                        <p>{doctorName}</p>
                    </div>

                    <div className="widget-card">
                        <h3>Today's Patient List</h3>

                        {/* Search and Filter Bar */}
                        <div className="filter-bar">
                            <div className="search-input-group">
                                <input type="text" placeholder="Patient name or case..." />
                                <button><i className="fas fa-search"></i></button>
                            </div>
                            <button>
                                <span>Filter</span>
                            </button>
                            <button>
                                <span>Date</span>
                            </button>
                        </div>

                        {/* Patients Table */}
                        <div className="table-responsive">
                            <table className="patient-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Date</th>
                                        <th>Case</th>
                                        <th>Phone Number</th>
                                        <th>Email</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {patients.map(patient => (
                                        <tr key={patient.id}>
                                            <td>{patient.name}</td>
                                            <td>{patient.date}</td>
                                            <td>{patient.case}</td>
                                            <td>{patient.phone}</td>
                                            <td>{patient.email}</td>
                                            <td>
                                                <div className="action-icons">
                                                    <i className="fas fa-pen" title="Edit"></i>
                                                    <i className="fas fa-eye" title="View"></i>
                                                    <i className="fas fa-trash-can" title="Delete"></i>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;
