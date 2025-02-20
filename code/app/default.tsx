import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';

interface LayoutProps {
    children: React.ReactNode;
    showHeader?: boolean;
    showFooter?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showHeader = true, showFooter = true }) => {
    return (
        <div className="min-h-screen bg-white">
            {showHeader && <Header />}
            <main className="flex-grow">
                {children}
            </main>
            {showFooter && <Footer />}
        </div>
    );
};

export default Layout;