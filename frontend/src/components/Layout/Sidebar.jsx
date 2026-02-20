import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import AuthService from '../../api/auth.service';

const Sidebar = () => {
    const user = AuthService.getCurrentUser();

    const navItems = [
        { name: 'Home', path: '/home', icon: '🏠' },
        { name: 'Manage', path: '/manage', icon: '📂' },
        { name: 'Templates', path: '/templates', icon: '📄' },
        { name: 'Reports', path: '/reports', icon: '📊' },
        { name: 'Admin', path: '/admin', icon: '⚙️' },
    ];

    return (
        <div className="w-64 bg-gray-100 h-screen border-r border-gray-300 flex flex-col">
            <div className="p-6">
                <Link to="/manage" className="block text-center bg-blue-600 text-white w-full py-2 rounded font-semibold hover:bg-blue-700 transition">
                    Start Now
                </Link>
            </div>
            <nav className="flex-1">
                <ul>
                    {navItems.map((item) => (
                        <li key={item.name}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center px-6 py-3 text-gray-700 hover:bg-gray-200 transition ${isActive ? 'bg-gray-200 border-l-4 border-blue-600 font-medium' : ''
                                    }`
                                }
                            >
                                <span className="mr-3">{item.icon}</span>
                                {item.name}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="p-6 border-t border-gray-300">
                {user && (
                    <div className="text-sm text-gray-700">
                        <p className="font-bold text-gray-900 truncate" title={user.name}>{user.name}</p>
                        <p className="text-gray-500 text-xs truncate" title={user.email}>{user.email}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Sidebar;
