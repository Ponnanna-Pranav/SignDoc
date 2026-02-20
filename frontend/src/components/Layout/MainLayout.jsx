import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const MainLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Topbar />
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar is hidden on very small screens for now, or can be responsive */}
                <aside className="hidden md:block">
                    <Sidebar />
                </aside>
                <main className="flex-1 overflow-y-auto p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
