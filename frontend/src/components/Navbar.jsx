import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../api/auth.service';

const Navbar = () => {
    const navigate = useNavigate();
    const user = AuthService.getCurrentUser();

    const handleLogout = () => {
        AuthService.logout();
        navigate('/login');
        window.location.reload();
    };

    return (
        <nav className="bg-gray-800 p-4 text-white">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-bold">Signature App</Link>
                <div>
                    {user ? (
                        <div className="flex gap-4">
                            <Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>
                            <button onClick={handleLogout} className="hover:text-red-400">Logout</button>
                        </div>
                    ) : (
                        <div className="flex gap-4">
                            <Link to="/login" className="hover:text-gray-300">Login</Link>
                            <Link to="/register" className="hover:text-gray-300">Register</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
