import React from 'react';
import { Link } from 'react-router-dom';

const Admin = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link to="/admin/users" className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition cursor-pointer">
                    <h3 className="font-bold text-lg mb-2">Users</h3>
                    <p className="text-gray-600">Manage users, groups and permissions.</p>
                </Link>
                <Link to="/admin/settings" className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition cursor-pointer">
                    <h3 className="font-bold text-lg mb-2">Account Settings</h3>
                    <p className="text-gray-600">Global account configuration and branding.</p>
                </Link>
                <Link to="/admin/billing" className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition cursor-pointer">
                    <h3 className="font-bold text-lg mb-2">Billing</h3>
                    <p className="text-gray-600">Plan details and payment methods.</p>
                </Link>
                <Link to="/admin/security" className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition cursor-pointer">
                    <h3 className="font-bold text-lg mb-2">Security</h3>
                    <p className="text-gray-600">SSO configuration and password policies.</p>
                </Link>
            </div>
        </div>
    );
};

export default Admin;
