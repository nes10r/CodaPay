import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { FiHome, FiUser, FiTerminal, FiBriefcase, FiSettings, FiLogOut } from 'react-icons/fi';

const Sidebar = () => {
    const { user, logout, isAdmin } = useAuth();
    const location = useLocation();

    const navItems = [
        { path: '/', label: 'Ana Səhifə', icon: <FiHome /> },
        { path: '/profile', label: 'Profil', icon: <FiUser /> },
        { path: '/virtual', label: 'Virtual Tətbiq', icon: <FiTerminal /> },
        { path: '/vacancy', label: 'Vakansiyalar', icon: <FiBriefcase /> },
    ];

    if (isAdmin()) {
        navItems.push({ path: '/admin', label: 'Admin Paneli', icon: <FiSettings /> });
    }

    return (
        <aside className="dashboard-sidebar">
            <div className="sidebar-header">CodaPay</div>
            <nav className="sidebar-nav">
                {navItems.map(item => (
                    <Link key={item.path} to={item.path} className={`sidebar-link ${location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path)) ? 'active' : ''}`}>
                        {item.icon}
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>
            <div className="sidebar-footer">
                {user && user.name && (
                    <div className="sidebar-user-info">
                        <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
                        <div className="user-details">
                            <h4>{user.name}</h4>
                            <p>{user.email}</p>
                        </div>
                    </div>
                )}
                <button onClick={logout} className="logout-button">
                    <FiLogOut />
                    <span>Çıxış</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar; 