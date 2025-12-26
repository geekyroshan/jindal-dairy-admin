import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Package,
    Image,
    MessageSquareQuote,
    HelpCircle,
    Settings,
    LogOut,
    Menu,
    X,
    Mail,
    ChevronRight,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/products', icon: Package, label: 'Products' },
    { path: '/banners', icon: Image, label: 'Banners' },
    { path: '/testimonials', icon: MessageSquareQuote, label: 'Testimonials' },
    { path: '/faqs', icon: HelpCircle, label: 'FAQs' },
    { path: '/inquiries', icon: Mail, label: 'Inquiries' },
    { path: '/settings', icon: Settings, label: 'Settings' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
    const { user, logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    const currentPage = navItems.find((item) => location.pathname.startsWith(item.path));

    const sidebarStyle: React.CSSProperties = {
        background: 'linear-gradient(180deg, #1E370F 0%, #2D5016 100%)',
        width: isSidebarOpen ? '280px' : '80px',
        minWidth: isSidebarOpen ? '280px' : '80px',
        transition: 'all 0.3s ease',
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F5F5F4' }}>
            {/* Desktop Sidebar */}
            <aside
                style={{
                    ...sidebarStyle,
                    display: 'none',
                    flexDirection: 'column',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    height: '100vh',
                    zIndex: 40,
                }}
                className="lg-sidebar"
            >
                {/* Logo */}
                <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '12px',
                                background: 'rgba(255,255,255,0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '20px',
                            }}
                        >
                            <img src="/logo.jpg" alt="Shudh Dudh" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
                        </div>
                        {isSidebarOpen && (
                            <div>
                                <div
                                    style={{
                                        fontFamily: 'Playfair Display, serif',
                                        color: 'white',
                                        fontSize: '18px',
                                        fontWeight: 600,
                                    }}
                                >
                                    Shudh Dudh
                                </div>
                                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                                    Admin Portal
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <nav style={{ flex: 1, padding: '24px 12px', overflowY: 'auto' }}>
                    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                        {navItems.map((item) => {
                            const isActive = location.pathname.startsWith(item.path);
                            return (
                                <li key={item.path} style={{ marginBottom: '4px' }}>
                                    <NavLink
                                        to={item.path}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            padding: '12px 16px',
                                            borderRadius: '12px',
                                            color: isActive ? 'white' : 'rgba(255,255,255,0.7)',
                                            background: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                                            textDecoration: 'none',
                                            transition: 'all 0.2s',
                                            fontWeight: 500,
                                        }}
                                    >
                                        <item.icon size={20} />
                                        {isSidebarOpen && <span>{item.label}</span>}
                                    </NavLink>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* User Profile */}
                <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <div
                        style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 12px' }}
                    >
                        <div
                            style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                background: '#D4A84B',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: 600,
                                fontSize: '14px',
                            }}
                        >
                            {user?.name?.charAt(0) || 'A'}
                        </div>
                        {isSidebarOpen && (
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p
                                    style={{
                                        color: 'white',
                                        fontWeight: 500,
                                        fontSize: '14px',
                                        margin: 0,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {user?.name}
                                </p>
                                <p
                                    style={{
                                        color: 'rgba(255,255,255,0.6)',
                                        fontSize: '12px',
                                        margin: 0,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {user?.email}
                                </p>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={logout}
                        style={{
                            width: '100%',
                            marginTop: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '10px 16px',
                            borderRadius: '12px',
                            color: 'rgba(255,255,255,0.7)',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '14px',
                            transition: 'all 0.2s',
                        }}
                    >
                        <LogOut size={18} />
                        {isSidebarOpen && <span>Logout</span>}
                    </button>
                </div>

                {/* Toggle Button */}
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    style={{
                        position: 'absolute',
                        right: '-12px',
                        top: '80px',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: 'white',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: '#1E370F',
                    }}
                >
                    <ChevronRight
                        size={14}
                        style={{ transform: isSidebarOpen ? 'rotate(180deg)' : 'rotate(0)' }}
                    />
                </button>
            </aside>

            {/* Mobile Header */}
            <header
                style={{
                    display: 'flex',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '64px',
                    background: 'white',
                    borderBottom: '1px solid #E7E5E4',
                    zIndex: 40,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 16px',
                }}
                className="mobile-header"
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        style={{
                            padding: '8px',
                            borderRadius: '8px',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        <Menu size={24} />
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <img src="/logo.jpg" alt="Shudh Dudh" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                        <span
                            style={{
                                fontFamily: 'Playfair Display, serif',
                                fontWeight: 600,
                                color: '#1E370F',
                            }}
                        >
                            Shudh Dudh Admin
                        </span>
                    </div>
                </div>
                <button
                    onClick={logout}
                    style={{
                        padding: '8px',
                        borderRadius: '8px',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#57534E',
                    }}
                >
                    <LogOut size={20} />
                </button>
            </header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            style={{
                                position: 'fixed',
                                inset: 0,
                                background: 'rgba(0,0,0,0.5)',
                                zIndex: 50,
                            }}
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'tween' }}
                            style={{
                                position: 'fixed',
                                left: 0,
                                top: 0,
                                height: '100vh',
                                width: '280px',
                                background: 'linear-gradient(180deg, #1E370F 0%, #2D5016 100%)',
                                zIndex: 50,
                            }}
                        >
                            <div
                                style={{
                                    padding: '16px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <img src="/logo.jpg" alt="Shudh Dudh" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                                    <span
                                        style={{
                                            fontFamily: 'Playfair Display, serif',
                                            color: 'white',
                                            fontWeight: 600,
                                        }}
                                    >
                                        Shudh Dudh
                                    </span>
                                </div>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    style={{
                                        padding: '8px',
                                        color: 'rgba(255,255,255,0.7)',
                                        background: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            <nav style={{ padding: '24px 12px' }}>
                                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                                    {navItems.map((item) => {
                                        const isActive = location.pathname.startsWith(item.path);
                                        return (
                                            <li key={item.path} style={{ marginBottom: '4px' }}>
                                                <NavLink
                                                    to={item.path}
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '12px',
                                                        padding: '12px 16px',
                                                        borderRadius: '12px',
                                                        color: isActive ? 'white' : 'rgba(255,255,255,0.7)',
                                                        background: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                                                        textDecoration: 'none',
                                                        fontWeight: 500,
                                                    }}
                                                >
                                                    <item.icon size={20} />
                                                    <span>{item.label}</span>
                                                </NavLink>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </nav>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main
                style={{
                    flex: 1,
                    marginLeft: 0,
                    paddingTop: '64px',
                    transition: 'all 0.3s',
                }}
                className="main-content"
            >
                {/* Page Header */}
                <div
                    style={{
                        background: 'white',
                        borderBottom: '1px solid #E7E5E4',
                        padding: '20px 24px',
                    }}
                >
                    <h1 style={{ fontSize: '20px', fontWeight: 600, color: '#292524', margin: 0 }}>
                        {currentPage?.label || 'Admin'}
                    </h1>
                </div>

                {/* Page Content */}
                <div style={{ padding: '24px' }}>{children}</div>
            </main>

            {/* CSS for responsive layout */}
            <style>{`
        @media (min-width: 1024px) {
          .lg-sidebar {
            display: flex !important;
          }
          .mobile-header {
            display: none !important;
          }
          .main-content {
            margin-left: ${isSidebarOpen ? '280px' : '80px'} !important;
            padding-top: 0 !important;
          }
        }
      `}</style>
        </div>
    );
}
