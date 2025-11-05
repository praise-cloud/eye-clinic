import React, { useState, useEffect } from 'react';
import { DeleteIcon, EditIcon, ViewIcon } from '../components/Icons';

const getStatClasses = (color) => {
    if (color.includes('blue')) return { icon: 'text-blue-600', bg: 'bg-blue-100' };
    if (color.includes('green')) return { icon: 'text-green-600', bg: 'bg-green-100' };
    if (color.includes('yellow')) return { icon: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (color.includes('red')) return { icon: 'text-red-600', bg: 'bg-red-100' };
    return {};
};

const App = () => {
    const statsData = [
        { label: 'Total Patients', number: '1,240', icon: 'fas fa-users', color: 'text-blue-500' },
        { label: "Today's Appointments", number: '15', icon: 'fas fa-calendar-check', color: 'text-green-500' },
        { label: 'Pending Appointments', number: '7', icon: 'fas fa-clock', color: 'text-yellow-500' },
        { label: 'Monthly Revenue', number: '₦850,000', icon: 'fa-solid fa-coins', color: 'text-red-500' },
    ];

    // Patient data
    const [patients] = useState([
        { name: 'Dr. Ammar', date: '25/01/2024', case: 'Some pain in the eye ...', phone: '+0123456789', email: 'ammar@gmail.com' },
        { name: 'Dr. Khan', date: '25/01/2024', case: 'Some pain in the eye ...', phone: '+0123456789', email: 'khan@gmail.com' },
        { name: 'Dr. Abdullah', date: '24/01/2024', case: 'Some pain in the eye ...', phone: '+0123456789', email: 'abdullah@gmail.com' },
        { name: 'Dr. Alia', date: '13/01/2024', case: 'Some pain in the eye ...', phone: '+0123456789', email: 'ali@gmail.com' },
    ]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const totalPages = Math.ceil(patients.length / rowsPerPage);
    const paginatedPatients = patients.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    const DashboardSection = () => (
        <div className="w-full">
            <div className="mb-6">
                <p className="text-gray-300 text-sm italic">Overview of your eye clinic operations and quick access tools.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statsData.map((stat, index) => {
                    const { icon: iconClass, bg: bgClass } = getStatClasses(stat.color);
                    return (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4 hover:shadow-lg transition-shadow">
                            <div className={`p-4 rounded-lg ${bgClass}`}>
                                <i className={`${stat.icon} text-2xl ${iconClass}`}></i>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-600 mb-1">{stat.label}</h3>
                                <span className="text-3xl font-bold text-gray-900">{stat.number}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-4 pb-4 border-b-2 border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900">Patient's of the day</h3>
                </div>
                <table style={{width: '100%', borderCollapse: 'collapse'}}>
                    <thead>
                        <tr style={{backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6'}}>
                            <th style={{padding: '12px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#6c757d'}}>Name</th>
                            <th style={{padding: '12px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#6c757d'}}>Date</th>
                            <th style={{padding: '12px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#6c757d'}}>Case</th>
                            <th style={{padding: '12px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#6c757d'}}>Phone</th>
                            <th style={{padding: '12px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#6c757d'}}>Email</th>
                            <th style={{padding: '12px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#6c757d'}}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedPatients.map((patient, idx) => (
                            <tr key={idx} style={{borderBottom: '1px solid #dee2e6'}}>
                                <td style={{padding: '12px', fontSize: '0.875rem'}}>{patient.name}</td>
                                <td style={{padding: '12px', fontSize: '0.875rem'}}>{patient.date}</td>
                                <td style={{padding: '12px', fontSize: '0.875rem'}}>{patient.case}</td>
                                <td style={{padding: '12px', fontSize: '0.875rem'}}>{patient.phone}</td>
                                <td style={{padding: '12px', fontSize: '0.875rem'}}>{patient.email}</td>
                                <td style={{padding: '12px', fontSize: '0.875rem', display: 'flex', gap: '8px'}}>
                                    <button style={{color: '#dc3545', background: 'none', border: 'none', cursor: 'pointer'}}>
                                        <DeleteIcon />
                                    </button>
                                    <button style={{color: '#28a745', background: 'none', border: 'none', cursor: 'pointer'}}>
                                        <EditIcon />
                                    </button>
                                    <button style={{color: '#007bff', background: 'none', border: 'none', cursor: 'pointer'}}>
                                        <ViewIcon />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <label style={{fontSize: '0.875rem', color: '#6c757d'}}>Rows per page:</label>
                        <select value={rowsPerPage} onChange={(e) => setRowsPerPage(Number(e.target.value))} style={{padding: '4px 8px', border: '1px solid #dee2e6', borderRadius: '4px'}}>
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                        </select>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} style={{padding: '6px 12px', border: '1px solid #dee2e6', borderRadius: '4px', background: currentPage === 1 ? '#e9ecef' : 'white', cursor: currentPage === 1 ? 'not-allowed' : 'pointer'}}>Previous</button>
                        <span style={{fontSize: '0.875rem', color: '#6c757d'}}>Page {currentPage} of {totalPages}</span>
                        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={{padding: '6px 12px', border: '1px solid #dee2e6', borderRadius: '4px', background: currentPage === totalPages ? '#e9ecef' : 'white', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'}}>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );



    return <DashboardSection />;
};

export default App;
