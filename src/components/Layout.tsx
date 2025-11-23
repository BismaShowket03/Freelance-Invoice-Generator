import React from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => (
  <div className="flex bg-gray-100 min-h-screen">
    <Sidebar />
    <main className="flex-1 p-2 sm:p-4 md:p-8">{children}</main>
  </div>
);

export default Layout;

