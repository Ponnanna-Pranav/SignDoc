import React, { useState, useRef, useEffect } from 'react';
import AuthService from '../../api/auth.service';
import { useNavigate, Link } from 'react-router-dom';
import {
    HelpCircle,
    User,
    Settings,
    LogOut,
    ChevronDown,
    Bell,
    CheckCircle,
    FileText
} from 'lucide-react';

const Topbar = () => {
    const user = AuthService.getCurrentUser();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    // Mock notifications
    const [notifications, setNotifications] = useState([
        { id: 1, text: "NDA Document signed by John Doe", time: "2 mins ago", read: false },
        { id: 2, text: "New template 'Contract' added", time: "1 hour ago", read: false },
        { id: 3, text: "Welcome to DocuSign Clone!", time: "1 day ago", read: true }
    ]);

    const dropdownRef = useRef(null);
    const notificationRef = useRef(null);

    const handleLogout = () => {
        AuthService.logout();
        navigate('/login');
    };

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setIsNotificationsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-20 relative">
            <div className="flex items-center">
                <Link to="/home" className="font-bold text-2xl tracking-tight text-gray-900 flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-serif italic">S</div>
                    <span><span className="text-blue-600">Sign</span>Docu</span>
                </Link>
                <nav className="ml-10 space-x-6 text-sm font-medium text-gray-600">
                    <Link to="/manage" className="hover:text-blue-600 transition-colors">Agreements</Link>
                    <Link to="/templates" className="hover:text-blue-600 transition-colors">Templates</Link>
                    <Link to="/reports" className="hover:text-blue-600 transition-colors">Reports</Link>
                </nav>
            </div>

            <div className="flex items-center space-x-2">
                {/* Settings Button */}
                <Link to="/admin/settings" className="text-gray-500 hover:text-gray-900 transition-colors p-2 rounded-full hover:bg-gray-100" title="Settings">
                    <Settings size={20} />
                </Link>

                {/* Help Button */}
                <button className="text-gray-500 hover:text-gray-900 transition-colors p-2 rounded-full hover:bg-gray-100" title="Help">
                    <HelpCircle size={20} />
                </button>

                {/* Notifications */}
                <div className="relative" ref={notificationRef}>
                    <button
                        onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                        className="text-gray-500 hover:text-gray-900 transition-colors p-2 rounded-full hover:bg-gray-100 relative"
                        title="Notifications"
                    >
                        <Bell size={20} />
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        )}
                    </button>

                    {isNotificationsOpen && (
                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl py-2 border border-gray-100 animate-in fade-in slide-in-from-top-1 z-30">
                            <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="font-semibold text-gray-900">Notifications</h3>
                                <span className="text-xs text-blue-600 cursor-pointer hover:underline">Mark all read</span>
                            </div>
                            <div className="max-h-64 overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <p className="px-4 py-4 text-center text-gray-500 text-sm">No new notifications</p>
                                ) : (
                                    notifications.map(notification => (
                                        <div key={notification.id} className={`px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-0 ${notification.read ? 'opacity-70' : ''}`}>
                                            <div className="flex items-start gap-3">
                                                <div className={`mt-1 p-1 rounded-full ${notification.read ? 'bg-gray-100 text-gray-500' : 'bg-blue-50 text-blue-600'}`}>
                                                    {notification.text.includes('signed') ? <CheckCircle size={14} /> : <FileText size={14} />}
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-800">{notification.text}</p>
                                                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className="px-4 py-2 border-t border-gray-100 text-center">
                                <Link to="/reports" className="text-xs text-blue-600 font-medium hover:underline" onClick={() => setIsNotificationsOpen(false)}>
                                    View all activity
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* User Dropdown */}
                <div className="relative ml-2" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center space-x-2 focus:outline-none hover:bg-gray-50 p-1 rounded-full transition-colors border border-transparent hover:border-gray-200"
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <ChevronDown size={14} className={`text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 border border-gray-100 animate-in fade-in slide-in-from-top-1 z-30">
                            <div className="px-4 py-3 border-b border-gray-100">
                                <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                            </div>

                            <div className="py-1">
                                <Link
                                    to="/admin/settings"
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                    onClick={() => setIsDropdownOpen(false)}
                                >
                                    <User size={16} className="mr-3 text-gray-400" />
                                    My Profile
                                </Link>
                                <Link
                                    to="/admin/settings"
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                    onClick={() => setIsDropdownOpen(false)}
                                >
                                    <Settings size={16} className="mr-3 text-gray-400" />
                                    Settings
                                </Link>
                            </div>

                            <div className="border-t border-gray-100 mt-1 pt-1">
                                <button
                                    onClick={handleLogout}
                                    className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <LogOut size={16} className="mr-3" />
                                    Log Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Topbar;
